/**
 * Install orchestration: collection-repo retargeting, post-install
 * validation that keeps broken pieces from bricking the next boot, and
 * update staleness detection. Every function takes the plugin runner as a
 * parameter so tests can substitute a recording fake.
 */
import type { InstallResult, PluginRunner } from './dsh-cli.ts';
/**
 * Run one plugin command with automatic recovery from the pnpm-major drift
 * failure (#20 bug 2): when the modules directory was built by a different
 * pnpm major, pnpm's documented remedy is one `install` to recreate it —
 * do that silently and retry the original command once. Any recognized
 * failure that survives gets its bilingual explanation appended to stderr
 * so the UI shows an actionable message instead of a wall of text (#20 bug 3).
 */
export declare function withHoistRecovery(run: PluginRunner, profile: string, pluginArgs: string[]): Promise<InstallResult>;
/**
 * Some registry entries point at collection repos whose actual plugin lives
 * in a subdirectory — the root has no package.json (or a workspace root with
 * no dsh surface), and pnpm installs the bare fileset with exit 0. Detect
 * that junk install, drop it, and re-add each plugin subdirectory through
 * pnpm's `#path:` selector (#18).
 * @returns overall success (true when nothing needed retargeting).
 */
export declare function retargetCollections(run: PluginRunner, profile: string, before: Set<string>, target: string): Promise<boolean>;
/**
 * Fake-success guard (#18): validate every package the install added. A
 * piece without a dsh manifest or without its declared entry artifact
 * (source-only checkout, build blocked by pnpm allowBuilds) would brick the
 * next boot, so it is removed on the spot.
 * @returns names kept and names removed as broken.
 */
export declare function validateAddedPlugins(run: PluginRunner, profile: string, before: Set<string>): Promise<{
    keep: string[];
    removedBroken: string[];
}>;
/**
 * Whether a clean-exit update actually changed nothing — pnpm's
 * minimumReleaseAge silently keeps the old version and exits 0 when the new
 * release is "too young" (#13, #22), so a clean exit alone does not mean the
 * update happened.
 */
export declare function isStaleUpdate(check: {
    isGit: boolean;
    beforeVersion: string | null;
    afterVersion: string | null;
    beforeCommit: string | null;
    afterCommit: string | null;
}): boolean;
/**
 * Package names pnpm reported as having their build scripts ignored
 * ("Ignored build scripts: esbuild, koffi."). Empty when none.
 * (#6 by @qichuang321.)
 */
export declare function parseIgnoredBuilds(stdout: string, stderr: string): string[];
