/**
 * Profile filesystem reads — everything the market learns from a dsh
 * profile directory (manifest, lockfile, installed package trees). Pure
 * functions of the directory contents; no processes, no network.
 */
/** Resolve a profile name to its directory under DSH_HOME (default ~/.dsh). */
export declare function profileDir(profile: string): string;
/** Community dependencies of the profile (in-box bundles filtered out). */
export declare function readInstalled(profile: string): Record<string, string>;
/** The version actually present in the profile's node_modules, or null. */
export declare function readInstalledVersion(profile: string, name: string): string | null;
/** Pinned commit per `owner/repo` from the profile lockfile's codeload tarball URLs. */
export declare function readLockCommits(profile: string): Map<string, string>;
/** True when the installed package's manifest declares a dsh plugin surface. */
export declare function hasDshManifest(dir: string): boolean;
/**
 * True when the package's declared entry artifact actually exists — github
 * source checkouts of build-required plugins ship no lib/, and promoting one
 * into the bundle layer bricks the next boot (ERR_MODULE_NOT_FOUND kills the
 * whole profile, #18).
 */
export declare function entryArtifactExists(dir: string): boolean;
/** Plugin subdirectories (depth 2) of a collection checkout, as relative paths. */
export declare function pluginSubdirs(root: string): string[];
/**
 * Allow the given packages' build scripts in the profile's
 * pnpm-workspace.yaml `allowBuilds` block (the key dsh profiles use),
 * merging with existing entries and leaving the rest of the yaml intact.
 * (#6 by @qichuang321.)
 * @returns every package now allowed.
 */
export declare function setAllowBuilds(profile: string, packages: string[]): string[];
