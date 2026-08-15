/**
 * Pet state machine — pure, clock-injected. Maps the DSH `activity/status`
 * phase vocabulary (session events) onto the 9-state Codex pet
 * animation contract, plus the session lifecycle transitions the web UI
 * exposes (turn end celebration, no-session idle).
 *
 * The machine is deliberately dumb: it holds the last input phase, the
 * animation decision, and a one-shot "celebration" window after `done` so the
 * pet visibly jumps before settling back to idle. Everything here is a pure
 * function of (input, nowMs); persistence and RPC live in the service.
 * @module @linxin666/dsh-pet/state
 */
export const defaultPetStateConfig = { celebrateMs: 2400 };
/**
 * Map one activity phase onto the animation contract.
 * - thinking / tool → `running` (focused work), with `running-right` as the
 *   side-alternating variant the client may use for tool activity.
 * - waiting → `waiting` (expectant pose, needs user input).
 * - done → `jumping` (celebration), then back to `idle` after the window.
 * - idle → `idle` (calm breathing loop).
 * `failed` has no DSH phase source yet; the machine keeps the mapping table
 * so a future error event can light it up.
 */
export function animationForPhase(phase) {
    switch (phase) {
        case 'thinking': return 'running';
        case 'tool': return 'running-right';
        case 'waiting': return 'waiting';
        case 'done': return 'jumping';
        case 'idle': return 'idle';
    }
}
/** The spritesheet row index for one animation track. */
export function rowOf(animation) {
    const rows = {
        'idle': 0,
        'running-right': 1,
        'running-left': 2,
        'waving': 3,
        'jumping': 4,
        'failed': 5,
        'waiting': 6,
        'running': 7,
        'review': 8,
    };
    return rows[animation];
}
/**
 * PetStateMachine — one instance per host process. Holds only the latest
 * input snapshot and the celebration timing; no storage, no side effects.
 */
export class PetStateMachine {
    config;
    now;
    phase = 'idle';
    line;
    phrase;
    sessionActive = false;
    doneAt;
    constructor(config = defaultPetStateConfig, now = Date.now) {
        this.config = config;
        this.now = now;
    }
    /** Consume one `activity/status` session event. */
    onActivityStatus(input) {
        this.phase = input.phase;
        this.line = input.line;
        this.phrase = input.phrase;
        if (input.phase === 'done')
            this.doneAt = this.now();
    }
    /** A session became the active one (or a fresh session started). */
    onSessionActive() {
        this.sessionActive = true;
    }
    /** The active session was disposed (or none left). */
    onSessionDisposed() {
        this.sessionActive = false;
        this.phase = 'idle';
        this.line = undefined;
        this.phrase = undefined;
        this.doneAt = undefined;
    }
    /** Render the current animation decision. */
    render() {
        const nowMs = this.now();
        let animation = animationForPhase(this.phase);
        // Celebration window: after `done`, jump for celebrateMs then settle idle.
        if (this.phase === 'done' && this.doneAt !== undefined) {
            if (nowMs - this.doneAt < this.config.celebrateMs) {
                animation = 'jumping';
            }
            else {
                animation = 'idle';
            }
        }
        const bubble = this.phrase ?? this.line;
        return {
            animation,
            ...(bubble === undefined ? {} : { bubble }),
            animationStartedAt: nowMs,
            phase: this.phase,
            sessionActive: this.sessionActive,
        };
    }
}
