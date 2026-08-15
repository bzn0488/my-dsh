/**
 * Pet HTTP routes — the browser half talks to the host through plain
 * same-origin JSON endpoints (`/api/pet/*`) and loads the whale-girl atlas
 * from `/pet/whale/*`. The `/plugins/` endpoint only serves client bundles
 * and RPC domains are platform-registered, so the pet serves its own API
 * and media — the same pattern as dsh-remote-web-ui's `/api/pair` family.
 * @module @linxin666/dsh-pet/routes
 */
import type { WebRoute } from '@deepseek-ai/dsh-host-webserver';
import type { PetService } from './service.ts';
/** Browser-facing base path of the pet API. */
export declare const PET_API_PREFIX = "/api/pet";
/** Browser-facing base path of the pet asset routes. */
export declare const PET_ASSET_PREFIX = "/pet/whale";
/** Absolute package root, resolved from this module's own location (lib/). */
export declare function petPackageRoot(importMetaUrl: string): string;
/** Build the full route family (API + assets) for one service + package root. */
export declare function makePetRoutes(deps: {
    service: PetService;
    packageRoot: string;
}): WebRoute[];
//# sourceMappingURL=routes.d.ts.map