/**
 * Whale-girl companion component — the browser half's centerpiece. Renders a
 * fixed-position floating sprite (React portal onto document.body), plays
 * the spritesheet track matching the host animation snapshot, and exposes
 * the interaction surface: click to pet, hover panel with feed/hide, drag to
 * reposition (persisted via setConfig).
 * @module @linxin666/dsh-pet/client/WhalePet
 */
import type { ReactPortal } from 'react';
import type { TranslateNS } from '@deepseek-ai/dsh-client-ui-slots';
import type { PetDisplayConfig } from '../persist.ts';
import type { PetStateView } from '../service.ts';
import type { PetFeedback } from './pet-store.ts';
import { NS } from './locales.ts';
/** Browser URL of the whale-girl atlas (served by the host half's own route). */
export declare const PET_SPRITESHEET_URL = "/pet/whale/spritesheet.webp";
/** Browser URL of the whale-girl manifest (authoritative per-row frame counts). */
export declare const PET_MANIFEST_URL = "/pet/whale/pet.json";
/** Props injected by the slot registration (store actions + locale). */
export interface WhalePetProps {
    /** Latest host snapshot; null while loading. */
    snapshot: PetStateView | null;
    /** Display configuration (persisted by the host). */
    display: PetDisplayConfig;
    /** Active reaction bubble, if any. */
    feedback: PetFeedback | null;
    /** Pet the whale girl (click). */
    onPet: () => void;
    /** Feed the whale girl (panel button). */
    onFeed: () => void;
    /** Hide the whale girl (panel button). */
    onHide: () => void;
    /** Persist a drag position. */
    onDragEnd: (right: number, bottom: number) => void;
    /** Rename the pet (persisted by the host). */
    onRename: (name: string) => void;
    /** Clear the reaction bubble (after its CSS animation). */
    onFeedbackDone: () => void;
    /** Locale translate seat (namespace-bound). */
    t: TranslateNS<typeof NS>;
}
/**
 * The floating pet. The spritesheet frame advances on requestAnimationFrame
 * with per-frame durations from TRACKS; the atlas image is loaded once and
 * the background position is written straight to the sprite element (no
 * per-frame React state).
 */
export declare function WhalePet(props: WhalePetProps): ReactPortal;
//# sourceMappingURL=WhalePet.d.ts.map