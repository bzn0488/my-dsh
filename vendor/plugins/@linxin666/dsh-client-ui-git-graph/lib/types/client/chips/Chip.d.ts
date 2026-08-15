/**
 * The shared chip button: one pill in the context row above the input.
 * @module dsh-git-graph/client/chips/Chip
 */
import type { ReactNode } from 'react';
/** Join conditional class names (the dependency-free clsx stand-in). */
export declare function cx(...parts: ReadonlyArray<string | false | null | undefined>): string;
/** Props of one context chip. */
export interface ChipProps {
    icon: ReactNode;
    label: string;
    ariaLabel: string;
    open: boolean;
    onClick: () => void;
}
/** The pill button shared by the project and branch chips. */
export declare function Chip({ icon, label, ariaLabel, open, onClick }: ChipProps): import("react").JSX.Element;
/** Full-screen transparent backdrop closing the open popover/dialog on click. */
export declare function Backdrop({ onClose }: {
    onClose: () => void;
}): import("react").JSX.Element;
//# sourceMappingURL=Chip.d.ts.map