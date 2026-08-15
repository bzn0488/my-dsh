/**
 * The git branch selector chip, mounted above the input card. Preferred
 * seat is the selector row's context hole
 * (`conversation.input.selector.context`, session-maybe) right beside the
 * official workspace selector; on shells that dropped the hole (rc.6) the
 * chip falls back to `conversation.input.dock` (session-scoped), so it
 * mounts once a session is active there. The session-maybe seat keeps the
 * chip mounted in every phase — hero (blank session) included — and the
 * chip hides itself only when its data source is absent (no session cwd,
 * or not a git repository). The component consumes only the props common
 * to both seats (the session id, the inject face, the locale seat).
 * @module dsh-git-graph/client/chips/BranchChip
 */
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { GitGraphInjected } from '../index.ts';
/** Full props of the branch chip: either seat's runtime share (the session-maybe context hole or the session-scoped dock fallback) + the git-graph inject face + the locale seat. */
export type BranchChipProps = (PropsRuntime<'conversation.input.selector.context'> | PropsRuntime<'conversation.input.dock'>) & GitGraphInjected & PropsLocale<'git-graph'>;
/**
 * The git branch selector chip.
 * @param props - the composed entry props of whichever seat it mounted in.
 */
export declare function BranchChip(props: BranchChipProps): import("react").JSX.Element | null;
//# sourceMappingURL=BranchChip.d.ts.map