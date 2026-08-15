/**
 * The pet settings card: display layout and name, bound to the `pet` settings
 * namespace the host plugin registers. Registered into the
 * `settings.plugin.item` slot the plugin-configuration section renders.
 */
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { SettingsScope, SnapshotStore } from '@deepseek-ai/dsh-client-runtime/client';
import { type CardActions, type CardShell, type FieldState as CardFieldState } from './settings-form.ts';
/** The pet's settings fields this card edits (the namespace's full schema). */
export interface PetSettings {
    /** Master switch for the plugin. */
    enabled?: boolean;
    /** Master switch. */
    visible?: boolean;
    /** Scale of the rendered pet in px (sprite cell height). */
    size?: number;
    /** Horizontal inset from the viewport right edge, px. */
    right?: number;
    /** Vertical inset from the viewport bottom edge, px. */
    bottom?: number;
    /** User-customizable pet display name. */
    name?: string;
}
/** What the pet settings card renders. */
export interface PetSettingsCardState extends CardShell {
    /** Plugin master switch. */
    enabled: CardFieldState;
    /** Master switch. */
    visible: CardFieldState;
    /** Pet scale. */
    size: CardFieldState;
    /** Right inset. */
    right: CardFieldState;
    /** Bottom inset. */
    bottom: CardFieldState;
    /** Pet name. */
    name: CardFieldState;
}
/** The registration-side face the card's slot entry injects. */
export interface PetSettingsCardFace extends CardActions {
    hooks: {
        /** Card snapshot bound by the renderer as usePetSettingsCard. */
        petSettingsCard: SnapshotStore<PetSettingsCardState>;
    };
}
/** Bridges the `pet` scope onto the card's staged form. */
export declare class PetSettingsCardController {
    private readonly form;
    private readonly store;
    /** @param scope - the bound settings scope for the `pet` namespace. */
    constructor(scope: SettingsScope<PetSettings>);
    private projection;
    /**
     * Build the face the card's slot registration injects.
     * @returns the card's snapshot and its form actions.
     */
    inject(): PetSettingsCardFace;
}
/** Props the renderer binds for the pet settings card. */
export type PetSettingsCardProps = PropsRuntime<'web-ui.plugin.item'> & PropsLocale<'pet'> & InjectFace<PetSettingsCardFace>;
/**
 * Render the pet settings card.
 * @param props - locale copy, the card snapshot, and its form actions.
 * @returns the card.
 */
export declare function PetSettingsCard(props: PetSettingsCardProps): import("react").JSX.Element;
//# sourceMappingURL=PetSettingsCard.d.ts.map