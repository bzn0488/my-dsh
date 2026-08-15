/**
 * Process layer: re-invoking the dsh CLI that launched this host, spawning
 * `dsh plugin` commands with timeouts and live progress, and provisioning
 * pnpm. This is the only module that starts child processes.
 *
 * Installs run through node:child_process, not ctx.shell: the shell service is
 * the agent's sandboxed executor and denies writes to the profile directory.
 */
import type { ChildProcess } from 'node:child_process';
/**
 * Windows npm/corepack/pnpm are `.cmd` shims. Node's `spawn` without a shell
 * cannot start them (ENOENT / EINVAL). Same pattern as dsh's `plugin` forwarder.
 */
export declare const winCmdShim: boolean;
/**
 * Argv re-invoking the CLI that launched this host process, so installs work
 * whether dsh runs from a global bin, a local install, or repo source
 * (`node --import tsx/esm .../bin.ts`). Falls back to a PATH `dsh`.
 */
export declare function dshArgv(): {
    file: string;
    args: string[];
    cwd: string | undefined;
    viaShell: boolean;
};
/** Outcome of one spawned plugin command. */
export interface InstallResult {
    exitCode: number | null;
    timedOut: boolean;
    stdout: string;
    stderr: string;
    /** True when the run ended because the user cancelled it. */
    cancelled: boolean;
}
/** The shape every orchestration function takes to run plugin commands (injectable in tests). */
export type PluginRunner = (profile: string, pluginArgs: string[]) => Promise<InstallResult>;
/**
 * Kill a spawned child and, on Windows, its whole process tree — `kill()`
 * there only terminates the wrapper, leaving pnpm children running.
 * (Contributed in #7 by @mraing.)
 */
export declare function killChild(child: ChildProcess): void;
/**
 * Cancel the plugin command currently running.
 * @returns true when there was one to cancel.
 */
export declare function cancelActive(): boolean;
/** Probe `pnpm --version` on PATH. */
export declare function probePnpm(): Promise<boolean>;
/**
 * Provision pnpm without user involvement: corepack (ships with Node) first,
 * a global npm install as fallback.
 * @returns true when `pnpm --version` succeeds afterwards.
 */
export declare function provisionPnpm(): Promise<boolean>;
/** Live progress of the running plugin command, for the status route. */
export interface InstallProgress {
    active: boolean;
    target: string;
    startedAt: number;
    lastLine: string;
}
/** Singleton progress state; the status route reads it, runDshPlugin writes it. */
export declare const progress: InstallProgress;
/** Identifies this host process; the client scopes its pending-restart flags to it. */
export declare const BOOT_ID: string;
/** Run one `dsh plugin --profile <p> …` command with timeout and progress tracking. */
export declare function runDshPlugin(profile: string, pluginArgs: string[]): Promise<InstallResult>;
