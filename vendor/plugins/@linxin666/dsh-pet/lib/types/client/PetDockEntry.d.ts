/**
 * Global floating pet entry. The pet is host-global (its state, display and
 * interactions live on `/api/pet/*` endpoints with no session dimension), so
 * it must not ride a session-scoped slot — on the new-conversation screen no
 * session exists to scope a slot by, and the pet would vanish (issue #48).
 * The client half therefore mounts this entry straight onto `document.body`
 * (see index.ts): while visible it renders the floating WhalePet (a portal),
 * while hidden it renders a fixed-position summon button.
 * @module @linxin666/dsh-pet/client/PetDockEntry
 */
import { type ReactElement } from 'react';
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
import type { PetStoreInstance } from './pet-store.ts';
import { NS } from './locales.ts';
/** Injected actions handed to the dock entry component. */
export interface PetInjected {
    /** The app-wide pet store instance (snapshot + feedback). */
    store: PetStoreInstance;
    /** Ensure the first snapshot is fetched (called on mount). */
    ensure: () => void;
    /** Pet the whale girl (click). */
    pet: () => void;
    /** Feed the whale girl. */
    feed: () => void;
    /** Hide the whale girl. */
    hide: () => void;
    /** Summon the hidden whale girl back. */
    summon: () => void;
    /** Persist a drag position. */
    dragEnd: (right: number, bottom: number) => void;
    /** Rename the pet (persisted by the host). */
    rename: (name: string) => void;
    /** Clear the reaction bubble. */
    feedbackDone: () => void;
}
/** Composed props of the global pet entry (locale + injected; no slot runtime share). */
export type PetDockEntryProps = PetInjected & PropsLocale<typeof NS>;
/**
 * Dock entry: while the pet is visible, mount the floating WhalePet (it
 * portals itself onto document.body); while hidden, render the summon
 * button so the pet can always come back. The store is the plugin-owned
 * single instance — the slot system provides none because the pet is
 * host-global, not session-scoped.
 */
export declare function PetDockEntry(props: PetDockEntryProps): ReactElement;
//# sourceMappingURL=PetDockEntry.d.ts.map