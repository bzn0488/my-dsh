/**
 * Pet host service — the `pet.*` RPC domain. Owns the state machine wiring
 * (consumes `activity/status` session events and session lifecycle), the
 * affinity ledger, and the persisted display config. The API gateway maps
 * this service's methods onto `pet.state` / `pet.interact` /
 * `pet.setVisible` / `pet.setConfig` for browser consumers.
 * @module @linxin666/dsh-pet/service
 */
import { Context, Service } from '@deepseek-ai/cordis';
import { type AffinityConfig, type PetInteraction } from './affinity.ts';
import { type PetDisplayConfig } from './persist.ts';
import { type TreatConfig } from './treats.ts';
import { type PetStateConfig, type PetStateSnapshot } from './state.ts';
/** Plugin configuration. */
export interface PetConfig {
    /** Affinity tuning. */
    affinity?: Partial<AffinityConfig>;
    /** State machine tuning. */
    state?: Partial<PetStateConfig>;
    /** Treat economy tuning. */
    treats?: Partial<TreatConfig>;
    /** Persistence directory override (defaults to $DSH_HOME). */
    persistDir?: string;
    /** Master switch for the plugin (browser half + host routes). */
    enabled?: boolean;
}
/**
 * The pet's settings-namespace section: the display fields and name the web
 * settings surface edits. `right`/`bottom` are also updated by drag
 * interactions, which keep the settings document in sync through the service.
 */
export interface PetSettingsSection {
    /** Master switch. */
    visible: boolean;
    /** Scale of the rendered pet in px (sprite cell height). */
    size: number;
    /** Horizontal inset from the viewport right edge, px. */
    right: number;
    /** Vertical inset from the viewport bottom edge, px. */
    bottom: number;
    /** User-customizable pet display name. */
    name: string;
    /** Master switch for the plugin (browser half + host routes). */
    enabled?: boolean;
}
/** Settings namespace of the pet capability. Spelled here rather than imported: the browser half spells the same value. */
export declare const PET_SETTINGS_NAMESPACE = "pet";
/** Snapshot returned by `pet.state`. */
export interface PetStateView {
    animation: PetStateSnapshot['animation'];
    bubble?: string;
    phase: PetStateSnapshot['phase'];
    sessionActive: boolean;
    /** Affinity ledger snapshot. */
    affinity: {
        points: number;
        rank: string;
        rankEmoji: string;
        pets: number;
        feeds: number;
        turns: number;
        /** True while the pet interaction is inside its cooldown. */
        petCooldown: boolean;
        /** True while the feed is inside its cooldown. */
        feedCooldown: boolean;
    };
    /** Display configuration. */
    display: PetDisplayConfig;
    /** User-customizable pet display name. */
    name: string;
    /** Treat (小鱼干) stock snapshot. */
    treats: {
        /** Stocked treats now. */
        stocked: number;
        /** Stock cap. */
        max: number;
    };
}
/** Result of `pet.interact`. */
export interface PetInteractResult {
    /** Reaction copy bubble. */
    reaction: string;
    /** Points gained (0 when inside the cooldown). */
    delta: number;
    /** Full affinity snapshot (same shape as state view). */
    affinity: PetStateView['affinity'];
}
declare module '@deepseek-ai/cordis' {
    interface Context {
        pet: PetService;
    }
}
/**
 * Cordis service exposing the pet RPC domain. Lazy: nothing is scanned or
 * written until a query or interaction arrives; event listeners update only
 * in-memory state, and persistence happens on interaction/config changes
 * plus every completed turn.
 */
export declare class PetService extends Service {
    static inject: string[];
    private readonly machine;
    private readonly affinityConfig;
    private readonly treatConfig;
    private readonly persistDir;
    private persist;
    private lastTurnRewardAt;
    private enabled;
    private disposeActivity;
    constructor(ctx: Context, config?: PetConfig);
    /** Whether the pet service consumes session activity while enabled. */
    isEnabled(): boolean;
    /** RPC: current pet state snapshot. */
    state(): Promise<PetStateView>;
    /** Current persisted display config (read-only view). */
    display(): PetDisplayConfig;
    /** Current persisted pet name (read-only view). */
    petName(): string;
    /** Start or stop the session-activity listeners that drive the pet. */
    setEnabled(enabled: boolean): void;
    private syncActivity;
    /** RPC: pet or feed the pet. */
    interact(kind: PetInteraction): Promise<PetInteractResult>;
    /** RPC: show or hide the pet. */
    setVisible(visible: boolean): Promise<{
        ok: true;
        display: PetDisplayConfig;
    }>;
    /** RPC: update display config (size / position). Values are clamped to whole pixels. */
    setConfig(patch: Partial<PetDisplayConfig>): Promise<{
        ok: true;
        display: PetDisplayConfig;
    }>;
    /** RPC: rename the pet (trimmed, 1–20 chars). */
    setName(name: string): Promise<{
        ok: true;
        name: string;
    } | {
        ok: false;
        error: string;
    }>;
    /**
     * Apply a committed settings section to the persisted display config. Called
     * by the settings surface on every change; values are clamped exactly like
     * the setConfig RPC so both write paths converge.
     * @param section - the resolved settings section.
     */
    applySettingsSection(section: PetSettingsSection): void;
    /** Mirror the persisted display config into the settings document (best-effort). */
    private syncSettingsFromPet;
    /** Award the turn reward once per done phase (idempotent per transition). */
    private rewardTurn;
    /**
     * Settle the treat economy (work + time output since the last
     * settlement); persists only when treats were actually granted.
     */
    private settleTreats;
    private view;
    private affinityView;
    private flush;
}
//# sourceMappingURL=service.d.ts.map