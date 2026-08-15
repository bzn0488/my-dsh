/**
 * dsh-pet browser half — mounts the whale-girl as a global floating surface
 * and drives it from the host's same-origin `/api/pet/*` JSON endpoints: poll
 * the host snapshot (~800 ms), forward interactions, persist drag positions.
 * The pet is host-global (no session dimension), so it mounts directly onto
 * `document.body` via a single React root rather than a session-scoped slot —
 * on the new-conversation screen no session exists, and a dock-mounted pet
 * would vanish there (issue #48). When the pet is hidden the entry becomes a
 * fixed-position summon button.
 * @module @linxin666/dsh-pet/client
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
/** Required services. */
export declare const inject: string[];
/** Re-exported for consumers that type against the injected face. */
export type { PetInjected, PetDockEntryProps } from './PetDockEntry.tsx';
export type { PetUiState, PetFeedback } from './pet-store.ts';
export type { PetSettingsCardFace, PetSettingsCardState } from './PetSettingsCard.tsx';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface SlotMap {
        /**
         * The child slot the Web UI plugin group declares; this card registers
         * into the group instead of the top-level `settings.plugin.item` list.
         * Spelled here with the same shape so this package can register without
         * depending on the sibling UI package.
         */
        'web-ui.plugin.item': {
            kind: 'list';
            scope: 'root';
            owner: SettingsPluginItemOwnerProps;
        };
    }
}
/** Owner share of a plugin card (the group card supplies nothing). */
export interface SettingsPluginItemOwnerProps {
    /** Marker field: card owner props are intentionally empty. */
    children?: never;
}
/**
 * Client plugin body: register dictionaries, mount the global pet entry and
 * poll loop while the plugin is enabled, and seat the settings card in the
 * Web UI plugin group.
 * @param ctx - client root context.
 */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map