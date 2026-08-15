/**
 * Pet host service — the `pet.*` RPC domain. Owns the state machine wiring
 * (consumes `activity/status` session events and session lifecycle), the
 * affinity ledger, and the persisted display config. The API gateway maps
 * this service's methods onto `pet.state` / `pet.interact` /
 * `pet.setVisible` / `pet.setConfig` for browser consumers.
 * @module @linxin666/dsh-pet/service
 */
import { Service } from '@deepseek-ai/cordis';
import { applyInteraction, applyTurnReward, defaultAffinityConfig, rankOf, } from "./affinity.js";
import { loadPetPersist, petHomeDir, savePetPersist, DISPLAY_SIZE_MAX, DISPLAY_SIZE_MIN, DISPLAY_INSET_MAX, PET_NAME_MAX_LENGTH, } from "./persist.js";
import { defaultTreatConfig, settleTreatGrants, consumeTreat, } from "./treats.js";
import { defaultPetStateConfig, PetStateMachine, } from "./state.js";
/** Settings namespace of the pet capability. Spelled here rather than imported: the browser half spells the same value. */
export const PET_SETTINGS_NAMESPACE = 'pet';
/**
 * Cordis service exposing the pet RPC domain. Lazy: nothing is scanned or
 * written until a query or interaction arrives; event listeners update only
 * in-memory state, and persistence happens on interaction/config changes
 * plus every completed turn.
 */
export class PetService extends Service {
    static inject = [];
    machine;
    affinityConfig;
    treatConfig;
    persistDir;
    persist;
    lastTurnRewardAt = 0;
    enabled;
    disposeActivity;
    constructor(ctx, config = {}) {
        super(ctx, 'pet');
        this.persistDir = config.persistDir ?? petHomeDir();
        this.affinityConfig = { ...defaultAffinityConfig, ...(config.affinity ?? {}) };
        this.treatConfig = { ...defaultTreatConfig, ...(config.treats ?? {}) };
        this.machine = new PetStateMachine({
            ...defaultPetStateConfig,
            ...(config.state ?? {}),
        });
        this.persist = loadPetPersist(this.persistDir);
        this.enabled = config.enabled ?? true;
        this.syncActivity();
    }
    /** Whether the pet service consumes session activity while enabled. */
    isEnabled() {
        return this.enabled;
    }
    /** RPC: current pet state snapshot. */
    async state() {
        return this.view();
    }
    /** Current persisted display config (read-only view). */
    display() {
        return { ...this.persist.display };
    }
    /** Current persisted pet name (read-only view). */
    petName() {
        return this.persist.name;
    }
    /** Start or stop the session-activity listeners that drive the pet. */
    setEnabled(enabled) {
        this.enabled = enabled;
        this.syncActivity();
    }
    syncActivity() {
        if (this.disposeActivity !== undefined) {
            this.disposeActivity();
            this.disposeActivity = undefined;
        }
        if (!this.enabled)
            return;
        this.disposeActivity = (() => {
            const disposers = [
                this.ctx.on('session/event', (_session, event) => {
                    if (event.type !== 'activity/status')
                        return;
                    const payload = (event.data ?? {});
                    if (payload.phase === undefined)
                        return;
                    const phase = payload.phase;
                    // Guard against unknown phases from newer activity trackers.
                    if (!['idle', 'waiting', 'thinking', 'tool', 'done'].includes(phase))
                        return;
                    this.machine.onActivityStatus({
                        phase,
                        ...(typeof payload.line === 'string' ? { line: payload.line } : {}),
                        ...(typeof payload.phrase === 'string' ? { phrase: payload.phrase } : {}),
                    });
                    this.machine.onSessionActive();
                    if (phase === 'done')
                        this.rewardTurn();
                }),
                this.ctx.on('session/disposed', () => {
                    this.machine.onSessionDisposed();
                }),
            ];
            return () => { for (const dispose of disposers)
                dispose(); };
        })();
    }
    /** RPC: pet or feed the pet. */
    async interact(kind) {
        const nowMs = Date.now();
        // Feeding consumes a treat: settle the economy first (work + time
        // output since the last settlement), then gate on the feed cooldown
        // BEFORE spending stock — a feed inside the cooldown must not burn a
        // treat for nothing.
        if (kind === 'feed')
            this.settleTreats(nowMs);
        const outcome = applyInteraction(this.persist.affinity, kind, nowMs, this.affinityConfig);
        if (kind === 'feed' && !outcome.accepted) {
            return { reaction: outcome.reaction, delta: 0, affinity: this.affinityView(this.persist.affinity) };
        }
        if (kind === 'feed') {
            const consume = consumeTreat(this.persist.treats);
            if (!consume.ok) {
                const affinity = this.affinityView(this.persist.affinity);
                return {
                    reaction: '没有小鱼干了，多陪鲸鱼娘工作一会儿吧～',
                    delta: 0,
                    affinity,
                };
            }
            this.persist = { ...this.persist, treats: consume.ledger };
        }
        if (outcome.accepted) {
            this.persist = { ...this.persist, affinity: outcome.affinity };
            this.flush();
        }
        const affinity = this.affinityView(outcome.affinity);
        return { reaction: outcome.reaction, delta: outcome.delta, affinity };
    }
    /** RPC: show or hide the pet. */
    async setVisible(visible) {
        this.persist = { ...this.persist, display: { ...this.persist.display, visible } };
        this.flush();
        this.syncSettingsFromPet();
        return { ok: true, display: this.persist.display };
    }
    /** RPC: update display config (size / position). Values are clamped to whole pixels. */
    async setConfig(patch) {
        const next = { ...this.persist.display, ...patch };
        next.size = Math.round(Math.min(DISPLAY_SIZE_MAX, Math.max(DISPLAY_SIZE_MIN, next.size)));
        next.right = Math.round(Math.min(DISPLAY_INSET_MAX, Math.max(0, next.right)));
        next.bottom = Math.round(Math.min(DISPLAY_INSET_MAX, Math.max(0, next.bottom)));
        this.persist = { ...this.persist, display: next };
        this.flush();
        this.syncSettingsFromPet();
        return { ok: true, display: this.persist.display };
    }
    /** RPC: rename the pet (trimmed, 1–20 chars). */
    async setName(name) {
        const trimmed = name.trim();
        if (trimmed === '')
            return { ok: false, error: 'name-empty' };
        if (trimmed.length > PET_NAME_MAX_LENGTH)
            return { ok: false, error: 'name-too-long' };
        this.persist = { ...this.persist, name: trimmed };
        this.flush();
        this.syncSettingsFromPet();
        return { ok: true, name: trimmed };
    }
    /**
     * Apply a committed settings section to the persisted display config. Called
     * by the settings surface on every change; values are clamped exactly like
     * the setConfig RPC so both write paths converge.
     * @param section - the resolved settings section.
     */
    applySettingsSection(section) {
        const next = { ...this.persist.display };
        next.visible = section.visible && (section.enabled ?? true);
        next.size = Math.round(Math.min(DISPLAY_SIZE_MAX, Math.max(DISPLAY_SIZE_MIN, section.size)));
        next.right = Math.round(Math.min(DISPLAY_INSET_MAX, Math.max(0, section.right)));
        next.bottom = Math.round(Math.min(DISPLAY_INSET_MAX, Math.max(0, section.bottom)));
        this.persist = { ...this.persist, display: next, name: section.name.trim() };
        this.flush();
    }
    /** Mirror the persisted display config into the settings document (best-effort). */
    syncSettingsFromPet() {
        const settings = this.ctx.get('settings', false);
        if (settings === undefined)
            return;
        void settings.update(PET_SETTINGS_NAMESPACE, {
            visible: this.persist.display.visible,
            size: this.persist.display.size,
            right: this.persist.display.right,
            bottom: this.persist.display.bottom,
            name: this.persist.name,
        }).catch(() => {
            // A settings write failure must not break the pet's own persistence.
        });
    }
    /** Award the turn reward once per done phase (idempotent per transition). */
    rewardTurn() {
        const nowMs = Date.now();
        // A done phase can repeat while celebrating; only reward the first.
        if (nowMs - this.lastTurnRewardAt < 5_000)
            return;
        this.lastTurnRewardAt = nowMs;
        this.persist = { ...this.persist, affinity: applyTurnReward(this.persist.affinity, this.affinityConfig) };
        this.flush();
    }
    /**
     * Settle the treat economy (work + time output since the last
     * settlement); persists only when treats were actually granted.
     */
    settleTreats(nowMs) {
        const settlement = settleTreatGrants(this.persist.treats, this.persist.affinity.turns, nowMs, this.treatConfig);
        if (settlement.gained > 0) {
            this.persist = { ...this.persist, treats: settlement.ledger };
            this.flush();
        }
    }
    view() {
        const snapshot = this.machine.render();
        // Time-output treats accrue while the host is idle too; settle on read.
        this.settleTreats(Date.now());
        return {
            animation: snapshot.animation,
            ...(snapshot.bubble === undefined ? {} : { bubble: snapshot.bubble }),
            phase: snapshot.phase,
            sessionActive: snapshot.sessionActive,
            affinity: this.affinityView(this.persist.affinity),
            display: { ...this.persist.display },
            name: this.persist.name,
            treats: {
                stocked: this.persist.treats.treats,
                max: this.treatConfig.maxTreats,
            },
        };
    }
    affinityView(affinity) {
        const nowMs = Date.now();
        const rank = rankOf(affinity.points);
        return {
            points: affinity.points,
            rank: rank.name,
            rankEmoji: rank.emoji,
            pets: affinity.pets,
            feeds: affinity.feeds,
            turns: affinity.turns,
            petCooldown: nowMs - affinity.lastPetAt < this.affinityConfig.petCooldownMs,
            feedCooldown: nowMs - affinity.lastFeedAt < this.affinityConfig.feedCooldownMs,
        };
    }
    flush() {
        try {
            savePetPersist(this.persist, this.persistDir);
        }
        catch {
            // Persistence is best-effort; the in-memory ledger keeps working.
        }
    }
}
