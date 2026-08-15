/**
 * dsh-pet host half — mounts the pet service and its HTTP routes. The
 * browser half (the `./client` entry) renders the whale-girl companion and
 * drives it through the same-origin `/api/pet/*` JSON endpoints plus the
 * `/pet/whale/*` media route. Install via `dsh plugin --profile web add
 * link:<dsh-web-ui>/packages/dsh-pet`; the cordis.patch.yml inserts this plugin row.
 * @module @linxin666/dsh-pet
 */
import { Context } from '@deepseek-ai/cordis';
import z from 'schemastery';
import { type PetConfig } from './service.ts';
export { PetService } from './service.ts';
export type { PetConfig, PetInteractResult, PetStateView, } from './service.ts';
export { AFFINITY_MAX, AFFINITY_RANKS, applyInteraction, applyTurnReward, emptyAffinity, rankOf, } from './affinity.ts';
export type { AffinityConfig, AffinityState, InteractionOutcome, PetInteraction, } from './affinity.ts';
export { animationForPhase, PetStateMachine, rowOf, } from './state.ts';
export type { ActivityPhase, PetAnimation, PetStateConfig, PetStateInput, PetStateSnapshot, } from './state.ts';
export { consumeTreat, defaultTreatConfig, emptyTreatLedger, settleTreatGrants, } from './treats.ts';
export type { TreatConfig, TreatLedger, TreatSettlement } from './treats.ts';
export { defaultDisplayConfig, emptyPersist, loadPetPersist, petHomeDir, savePetPersist, } from './persist.ts';
export type { PetDisplayConfig, PetPersist } from './persist.ts';
export { makePetRoutes, petPackageRoot, PET_API_PREFIX, PET_ASSET_PREFIX, } from './routes.ts';
/** Stable cordis plugin name (matches cordis.patch.yml insert id). */
export declare const name = "pet";
/** Services required before the pet can mount its surfaces. */
export declare const inject: string[];
/** Settings section schema: the display fields and name the web settings surface edits. */
export declare const PET_SETTINGS_SCHEMA: z<Schemastery.ObjectS<{
    visible: z<boolean, boolean>;
    size: z<number, number>;
    right: z<number, number>;
    bottom: z<number, number>;
    name: z<string, string>;
    enabled: z<boolean, boolean>;
}>, Schemastery.ObjectT<{
    visible: z<boolean, boolean>;
    size: z<number, number>;
    right: z<number, number>;
    bottom: z<number, number>;
    name: z<string, string>;
    enabled: z<boolean, boolean>;
}>>;
/** Register the pet service and its API + asset routes on the context. */
export declare function apply(ctx: Context, config?: PetConfig): void;
//# sourceMappingURL=index.d.ts.map