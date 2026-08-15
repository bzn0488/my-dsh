import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PluginSettingsCard, ValueField, BooleanField } from "./PluginSettingsCard.js";
import { CardForm, booleanField, numberField, textField } from "./settings-form.js";
/** Bridges the `pet` scope onto the card's staged form. */
export class PetSettingsCardController {
    form;
    store;
    /** @param scope - the bound settings scope for the `pet` namespace. */
    constructor(scope) {
        this.form = new CardForm(scope, [
            booleanField('enabled'),
            booleanField('visible'),
            numberField('size'),
            numberField('right'),
            numberField('bottom'),
            textField('name'),
        ]);
        this.store = this.form.bind(() => this.projection());
    }
    projection() {
        return {
            ...this.form.shell(),
            enabled: this.form.field('enabled'),
            visible: this.form.field('visible'),
            size: this.form.field('size'),
            right: this.form.field('right'),
            bottom: this.form.field('bottom'),
            name: this.form.field('name'),
        };
    }
    /**
     * Build the face the card's slot registration injects.
     * @returns the card's snapshot and its form actions.
     */
    inject() {
        return { hooks: { petSettingsCard: this.store }, ...this.form.actions() };
    }
}
/**
 * Render the pet settings card.
 * @param props - locale copy, the card snapshot, and its form actions.
 * @returns the card.
 */
export function PetSettingsCard(props) {
    const { t } = props;
    const state = props.usePetSettingsCard(snapshot => snapshot);
    const disabled = !state.writable;
    const fieldProps = {
        overriddenLabel: t('settings.overridden'),
        resetLabel: t('settings.reset'),
        invalidLabel: t('settings.invalidNumber'),
        disabled,
    };
    return (_jsxs(PluginSettingsCard, { t: t, titleKey: "settings.title", descriptionKey: "settings.description", state: state, onSave: props.save, onDiscard: props.discard, children: [_jsx(BooleanField, { id: "settings-pet-enabled", label: t('settings.enabled'), hint: t('settings.enabledHint'), inheritLabel: t('settings.inherit'), onLabel: t('settings.on'), offLabel: t('settings.off'), ...fieldProps, ...state.enabled, onEdit: (text) => { props.edit('enabled', text); }, onReset: () => { props.resetField('enabled'); } }), _jsx(BooleanField, { id: "settings-pet-visible", label: t('settings.visible'), hint: t('settings.visibleHint'), inheritLabel: t('settings.inherit'), onLabel: t('settings.on'), offLabel: t('settings.off'), ...fieldProps, ...state.visible, onEdit: (text) => { props.edit('visible', text); }, onReset: () => { props.resetField('visible'); } }), _jsx(ValueField, { id: "settings-pet-size", label: t('settings.size'), hint: t('settings.sizeHint'), numeric: true, ...fieldProps, ...state.size, onEdit: (text) => { props.edit('size', text); }, onReset: () => { props.resetField('size'); } }), _jsx(ValueField, { id: "settings-pet-right", label: t('settings.right'), hint: t('settings.rightHint'), numeric: true, ...fieldProps, ...state.right, onEdit: (text) => { props.edit('right', text); }, onReset: () => { props.resetField('right'); } }), _jsx(ValueField, { id: "settings-pet-bottom", label: t('settings.bottom'), hint: t('settings.bottomHint'), numeric: true, ...fieldProps, ...state.bottom, onEdit: (text) => { props.edit('bottom', text); }, onReset: () => { props.resetField('bottom'); } }), _jsx(ValueField, { id: "settings-pet-name", label: t('settings.name'), hint: t('settings.nameHint'), ...fieldProps, ...state.name, onEdit: (text) => { props.edit('name', text); }, onReset: () => { props.resetField('name'); } })] }));
}
