/**
 * dsh-pet host half — mounts the pet service and its HTTP routes. The
 * browser half (the `./client` entry) renders the whale-girl companion and
 * drives it through the same-origin `/api/pet/*` JSON endpoints plus the
 * `/pet/whale/*` media route. Install via `dsh plugin --profile web add
 * link:<dsh-web-ui>/packages/dsh-pet`; the cordis.patch.yml inserts this plugin row.
 * @module @linxin666/dsh-pet
 */
import { installSettingsSection, settingsNamespace } from '@deepseek-ai/dsh-settings';
import z from 'schemastery';
import { PetService, PET_SETTINGS_NAMESPACE } from "./service.js";
import { makePetRoutes, petPackageRoot } from "./routes.js";
import { DEFAULT_PET_NAME, DISPLAY_INSET_MAX, DISPLAY_SIZE_MAX, DISPLAY_SIZE_MIN, PET_NAME_MAX_LENGTH, } from "./persist.js";
export { PetService } from "./service.js";
export { AFFINITY_MAX, AFFINITY_RANKS, applyInteraction, applyTurnReward, emptyAffinity, rankOf, } from "./affinity.js";
export { animationForPhase, PetStateMachine, rowOf, } from "./state.js";
export { consumeTreat, defaultTreatConfig, emptyTreatLedger, settleTreatGrants, } from "./treats.js";
export { defaultDisplayConfig, emptyPersist, loadPetPersist, petHomeDir, savePetPersist, } from "./persist.js";
export { makePetRoutes, petPackageRoot, PET_API_PREFIX, PET_ASSET_PREFIX, } from "./routes.js";
/** Stable cordis plugin name (matches cordis.patch.yml insert id). */
export const name = 'pet';
/** Services required before the pet can mount its surfaces. */
export const inject = ['webServer'];
/** Settings section schema: the display fields and name the web settings surface edits. */
export const PET_SETTINGS_SCHEMA = z.object({
    visible: z.boolean().default(true),
    size: z.number().step(1).min(DISPLAY_SIZE_MIN).max(DISPLAY_SIZE_MAX).default(160),
    right: z.number().step(1).min(0).max(DISPLAY_INSET_MAX).default(24),
    bottom: z.number().step(1).min(0).max(DISPLAY_INSET_MAX).default(20),
    name: z.string().min(1).max(PET_NAME_MAX_LENGTH).pattern(/\S/).default(DEFAULT_PET_NAME),
    enabled: z.boolean().default(true),
});
/** Register the pet service and its API + asset routes on the context. */
export function apply(ctx, config = {}) {
    const service = new PetService(ctx, config);
    // The settings surface edits the display config through the `pet`
    // namespace. The composition `base` starts as the persisted pet.json
    // values (clamped to schema bounds), so an empty user layer resolves to
    // exactly what the pet already shows — a fresh deployment never
    // overwrites a customized layout, and reset re-inherits it. Runtime drag
    // interactions mirror back into the settings document through the service
    // (see syncSettingsFromPet), keeping both views consistent.
    let current = () => base;
    const base = {
        visible: service.display().visible,
        size: service.display().size,
        right: service.display().right,
        bottom: service.display().bottom,
        name: service.petName(),
        enabled: config.enabled ?? true,
    };
    // The browser half talks to the pet through same-origin JSON endpoints and
    // loads the atlas from the pet's own media route (RPC domains are
    // platform-registered, so the pet serves its own API — the same pattern as
    // dsh-remote-web-ui's /api/pair family). The routes are registered while
    // the plugin is enabled; toggling the setting off makes the pet API
    // disappear until it is re-enabled.
    const routes = makePetRoutes({ service, packageRoot: petPackageRoot(import.meta.url) });
    let disposeRoutes;
    const syncRoutes = () => {
        const enabled = current().enabled ?? true;
        if (disposeRoutes === undefined && enabled) {
            disposeRoutes = ctx.effect(() => {
                const disposers = routes.map((route) => ctx.webServer.register(route));
                return () => { for (const dispose of disposers)
                    dispose(); };
            }, 'pet: routes');
        }
        else if (disposeRoutes !== undefined && !enabled) {
            disposeRoutes();
            disposeRoutes = undefined;
        }
    };
    installSettingsSection(ctx, settingsNamespace(PET_SETTINGS_NAMESPACE), PET_SETTINGS_SCHEMA, base, {
        setSource: (source) => { current = source; },
        onChange: () => {
            const section = current();
            service.applySettingsSection(section);
            service.setEnabled(section.enabled ?? true);
            syncRoutes();
        },
    });
    syncRoutes();
}
