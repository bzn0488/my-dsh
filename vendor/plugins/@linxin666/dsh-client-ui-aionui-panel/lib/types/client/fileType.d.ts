/**
 * Preview content-type detection from a file name — the router's single
 * source of truth for what a file becomes when opened (mirrors AionUi's
 * getFileTypeInfo table, re-derived for the panel's format set).
 * @module dsh-aionui-panel/client/fileType
 */
import type { PreviewContentType } from '../core/types.ts';
/** Detect the preview content type of a file by name (lowercased). */
export declare function detectContentType(name: string): PreviewContentType;
/** Whether the type can be edited and saved back. */
export declare function isEditableType(type: PreviewContentType): boolean;
/** Whether the type reads its content as text (vs image data URL). */
export declare function isTextType(type: PreviewContentType): boolean;
/** A stable tab id from the file identity (root + path + type). */
export declare function tabIdOf(root: string, path: string, type: PreviewContentType): string;
/** The language hint for code tabs (extension without the dot). */
export declare function languageOf(name: string): string;
/** The title for a tab: the basename. */
export declare function basenameOf(path: string): string;
/** The parent relative path of a path ('' for a root-level item). */
export declare function parentRel(path: string): string;
//# sourceMappingURL=fileType.d.ts.map