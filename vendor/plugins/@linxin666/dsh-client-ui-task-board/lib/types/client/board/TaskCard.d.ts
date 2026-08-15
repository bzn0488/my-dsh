/**
 * Task card: the board's column item. Clicking opens the task detail — it
 * never executes anything directly (detail holds the Run button).
 */
import type { TaskRecord } from '../../core/tasks.ts';
/** Compact relative/absolute time label. */
export declare function formatTime(ms: number): string;
/** One card in a column. */
export declare function TaskCard({ task, onClick }: {
    task: TaskRecord;
    onClick: () => void;
}): import("react").JSX.Element;
