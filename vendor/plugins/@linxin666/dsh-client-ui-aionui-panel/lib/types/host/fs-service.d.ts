/**
 * Host filesystem service for the panel: directory listing, file read with a
 * preview ceiling, text write with an mtime conflict check, filename search
 * with directory pruning, delete (untracked discard), and a recursive watcher
 * that emits change events. Every operation resolves against a gated project
 * root and refuses to escape it (path traversal guard). Text is decoded utf-8;
 * images come back as data URLs (capped) so the browser renders them without
 * extra round trips.
 * @module dsh-aionui-panel/host/fs-service
 */
import type { DirListing, FileRead, PanelError, SearchView } from '../core/types.ts';
import { type GateVerdict, type WorkspaceGate } from './gate.ts';
/** Preview text ceiling — mirrors AionUi's single-tab 80k-char cap. */
export declare const TEXT_CAP_CHARS = 80000;
/** The image probe: parse PNG/JPEG/GIF/WebP header dimensions (undefined on failure). */
export declare function probeImageSize(data: Buffer): {
    width: number;
    height: number;
} | undefined;
/**
 * Filesystem service: gated listing/read/write/search/delete plus a change
 * watcher. All relative paths are resolved against the gated root.
 * @param gate - the workspace gate (host: registered workspace membership).
 */
export declare class FsService {
    private readonly gate;
    constructor(gate: WorkspaceGate);
    /** Verify a project root against the workspace gate (used by the SSE layer). */
    verify(root: string): Promise<GateVerdict>;
    /** List one directory (relative path; '' = root). Sorted dirs-first alpha. */
    list(root: string, rel: string): Promise<DirListing | PanelError>;
    /** Read one file for preview: text decoded utf-8 (capped), images as data URLs. */
    read(root: string, rel: string, asImage: boolean): Promise<FileRead | PanelError>;
    /**
     * Read one file's raw bytes (the markdown image route): gated, traversal-
     * guarded, and .git-refusing. The bytes are streamed by the HTTP layer with
     * the derived mime so `<img>` tags can load workspace files directly.
     */
    readRaw(root: string, rel: string): Promise<{
        data: Buffer;
        mime: string;
        size: number;
    } | PanelError>;
    /** Write text content back, refusing when the file moved on disk (mtime conflict). */
    write(root: string, rel: string, content: string, baseMtime?: number): Promise<{
        mtime: number;
    } | PanelError>;
    /** Recursive filename search (case-insensitive substring), pruned at noise dirs. */
    search(root: string, query: string): Promise<SearchView | PanelError>;
    /** Delete a path (discard of untracked files). Recursive for directories. */
    delete(root: string, rel: string): Promise<{
        ok: true;
    } | PanelError>;
    /**
     * Watch a root recursively and emit change events (debounced + batched).
     * Recursive watch may be unavailable; a polling fallback then compares the
     * root signature periodically (best-effort).
     * @param root - project root to watch (gated on connect).
     * @param onChange - fired (debounced) when anything under root changed.
     * @returns disposer.
     */
    watch(root: string, onChange: () => void): () => void;
    /** Cheap root signature: entries of the root with sizes/mtimes (poll fallback). */
    private signature;
}
//# sourceMappingURL=fs-service.d.ts.map