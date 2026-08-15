/**
 * Update detection: per-plugin comparison of what the profile has against
 * the source of truth — git HEAD for github installs, the npm latest
 * dist-tag for registry installs — with a TTL cache.
 */
export interface UpdateStatus {
    kind: 'github' | 'npm' | 'linked';
    version: string | null;
    current: string | null;
    latest: string | null;
    updateAvailable: boolean;
}
/** Drop the cached listing (after a successful install/update/uninstall). */
export declare function invalidateUpdates(): void;
/** Per-plugin update checks; a failed check reports no update rather than failing the listing. */
export declare function checkUpdates(profile: string, force?: boolean): Promise<Record<string, UpdateStatus>>;
