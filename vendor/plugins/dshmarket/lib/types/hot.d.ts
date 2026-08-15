/**
 * Restart-free installs: mount a freshly installed plugin into the running
 * composition through a market-owned Include subtree.
 *
 * Durable state stays with the profile's `dsh.profile.bundles` (reconciled by
 * the dsh CLI at install time), so the next boot loads the plugin through the
 * normal bundle layer. The subtree here exists only for the current process:
 * its input files live under `<profile>/.dsh-market/` and are wiped on every
 * boot, so a crash can never leave a file that collides with the bundle layer
 * (inserting an id the bundle layer also inserts is a hard boot failure).
 *
 * The Include subclass suppresses `write()` — the loader otherwise persists
 * tree changes back to the file it read (see dsh's agent-presets PresetTree
 * for the in-tree precedent).
 */
interface HotRow {
    id: string;
    name: string;
}
interface PluginHandle {
    await(): Promise<unknown>;
    dispose(): Promise<unknown> | void;
}
interface HotContext {
    plugin(plugin: unknown, config: unknown): PluginHandle;
    logger?: {
        info?(message: string): void;
        warn(message: string): void;
    };
}
/**
 * Insert rows of a plugin's bundle patch, or null when the patch contains
 * anything beyond plain `id`/`name` insert rows (config blocks, disables,
 * expressions) — those compositions fall back to restart activation.
 */
export declare function parseSimplePatch(patchText: string): HotRow[] | null;
/**
 * Wipe leftover hot-mount inputs; call once when the market host starts.
 * `state.json` (skin enable/disable choices) deliberately survives.
 */
export declare function cleanHotDir(profileDir: string): void;
/** Themes the user switched away from; skipped by the boot re-mount. */
export declare function readDisabledThemes(profileDir: string): Set<string>;
export declare function writeDisabledThemes(profileDir: string, disabled: Set<string>): void;
/** Package names currently live through a market hot mount (patch or shim). */
export declare function listHotMounts(): string[];
/**
 * Dispose a plugin hot-mounted earlier in this session, removing it from the
 * running composition immediately.
 * @param packageName - package to unmount.
 * @returns true when a live hot mount was found and disposed.
 */
export declare function hotUnmount(packageName: string): Promise<boolean>;
/**
 * Mount `packageName` (just installed into the profile) into the running
 * composition.
 * @param ctx - market host context; the subtree unwinds with the market's fiber.
 * @param profileDir - profile the package was installed into.
 * @param packageName - installed package to activate.
 * @returns true when the plugin is live without a restart; false when the
 * caller should show the restart banner instead.
 */
export declare function hotMount(ctx: HotContext, profileDir: string, packageName: string): Promise<boolean>;
/**
 * Mount every installed client-only package (`dsh.client` without
 * `dsh.bundle`) at market startup. The bundle reconcile skips these packages
 * entirely, so without the market's shim their client bundles are unreachable
 * in every boot — this is what makes them behave like normal plugins.
 * @returns names that were mounted.
 */
export declare function mountClientOnlyDeps(ctx: HotContext, profileDir: string): Promise<string[]>;
export {};
