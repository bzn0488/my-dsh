/**
 * Host git service for the SCM tab: working-tree status (porcelain v1, -z),
 * stage/unstage/discard batches, all scoped to the gated project root and
 * executed through the managed subprocess seam. Parsing is pure and exported
 * for tests; the service only wraps the runner. Discard never touches the
 * staged side (the index is only ever rewritten by stage/unstage), matching
 * the "discard = worktree side" contract.
 * @module dsh-aionui-panel/host/git-service
 */
import type { Context } from '@deepseek-ai/cordis';
import type { GitBatchResult, GitChangeRow, GitFileState, GitStatusView, PanelError } from '../core/types.ts';
import { type WorkspaceGate } from './gate.ts';
/** One finished git invocation. */
export interface GitRunResult {
    exitCode: number | null;
    stdout: string;
    stderr: string;
}
/** The spawn seam the service runs git through (subprocess service in production). */
export interface GitRunner {
    run(argv: readonly string[], cwd: string): Promise<GitRunResult>;
}
/** Production runner over `ctx.subprocess`: one managed child per command. */
export declare function subprocessRunner(ctx: Context): GitRunner;
/** Map one porcelain letter to the row state (unknown letters stay unknown). */
export declare function porcelainState(letter: string): GitFileState;
/**
 * Parse `git status --porcelain=v1 -z` output into staged/unstaged/untracked
 * rows. With -z every entry is NUL-terminated; rename entries carry two paths
 * (old and new). Pure — exported for tests.
 * @param output - raw porcelain v1 -z output.
 * @returns the three change groups.
 */
export declare function parsePorcelain(output: string): {
    staged: GitChangeRow[];
    unstaged: GitChangeRow[];
    untracked: GitChangeRow[];
};
/** Parse the porcelain row set into the status view shape. */
export declare function parseStatusView(root: string, branch: string, output: string): GitStatusView;
/**
 * Workspace-scoped git operations. Every method passes the gate, resolves the
 * repository root, and rejects non-repositories with a stable error.
 * @param runner - the spawn seam.
 * @param gate - workspace-membership gate.
 * @param fsDelete - delete seam for untracked discard (host: FsService.delete).
 */
export declare class GitService {
    private readonly runner;
    private readonly gate;
    private readonly fsDelete;
    constructor(runner: GitRunner, gate: WorkspaceGate, fsDelete: (root: string, rel: string) => Promise<{
        ok: true;
    } | PanelError>);
    /** Cached one-shot git binary probe; never re-probes after the first call. */
    private availablePromise;
    /**
     * Probe the git binary once (git --version) and cache the verdict for the
     * service lifetime. A machine without git then degrades every operation to
     * the stable "not a git repository" state after a single failed spawn,
     * instead of re-spawning ENOENT on every poll tick. The cache stays false
     * even if git is installed later; the host restart picks it up.
     */
    gitAvailable(): Promise<boolean>;
    /** Resolve the gated canonical root and the repository top-level. */
    private repo;
    /** Run one git invocation and classify failures. */
    private run;
    /** The repo status view; null when the root is not a repository. */
    status(root: string): Promise<GitStatusView | null | PanelError>;
    /** The repo root for the watch layer (null when not a repository). */
    repoRoot(root: string): Promise<string | null>;
    /**
     * The unified diff of one path ('' when there is no diff to show). Staged
     * paths diff the index against HEAD (`--cached`); unstaged paths diff the
     * worktree against the index. Untracked paths have no index/HEAD entry, so
     * they diff against /dev/null (the canonical new-file shape); its exit code
     * is 1 — differences exist — which is a success here, not a failure.
     */
    diff(root: string, path: string, staged: boolean): Promise<{
        content: string;
    } | PanelError>;
    /** Verify paths stay inside the repo root (defense in depth). */
    private pathsInside;
    /** Stage paths (git add). Batch result reflects the post-op status. */
    stage(root: string, paths: string[]): Promise<GitBatchResult | PanelError>;
    /** Unstage paths (git restore --staged). */
    unstage(root: string, paths: string[]): Promise<GitBatchResult | PanelError>;
    /**
     * Discard paths (worktree side only). Tracked paths are restored from the
     * index; untracked paths are deleted through the fs seam. The batch reports
     * applied/failed per path.
     */
    discard(root: string, paths: string[]): Promise<GitBatchResult | PanelError>;
    /** Shared batch plumbing: gate, repo resolve, path filter, run the op. */
    private batch;
}
//# sourceMappingURL=git-service.d.ts.map