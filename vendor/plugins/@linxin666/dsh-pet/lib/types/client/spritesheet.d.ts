/**
 * Whale-girl spritesheet geometry and animation tracks.
 *
 * The atlas follows the Codex/hatch-pet contract: 8 columns × 9 rows of
 * 192×208 cells (1536×1872 total), rows in this order:
 *   0 idle, 1 running-right, 2 running-left, 3 waving, 4 jumping,
 *   5 failed, 6 waiting, 7 running, 8 review
 *
 * Frame counts and per-frame durations are per-track definitions below; the
 * whale-girl atlas is produced by the hatch-pet pipeline, so calibrate
 * `TRACKS` against the actual run (`pet_request.json` frame counts) when the
 * asset lands. Tracks that do not loop hand off to `fallback`.
 * @module @linxin666/dsh-pet/client/spritesheet
 */
import type { PetAnimation } from '../state.ts';
/** Atlas cell size in px (Codex contract). */
export declare const FRAME_WIDTH = 192;
export declare const FRAME_HEIGHT = 208;
/** Columns per row (max frames per track). */
export declare const FRAME_COLUMNS = 8;
/** One animation track: frame indices into the row + per-frame durations. */
export interface TrackDef {
    /** Frame indices (columns) played in order; must be < FRAME_COLUMNS. */
    frames: readonly number[];
    /** Per-frame duration in ms; same length as frames. */
    durations: readonly number[];
    /** Whether the track loops; a non-looping track hands off to fallback. */
    loop: boolean;
    /** Track to play after a non-looping track finishes. */
    fallback?: PetAnimation;
}
/**
 * Track definitions for the whale-girl. Durations are tuned for a soft,
 * slow-healing feel (roughly 2.5× the earlier fast draft — the pet should
 * breathe, not race); calibrate frame counts against the hatch-pet run when
 * the asset lands (rows may carry 4–8 frames).
 */
export declare const TRACKS: Record<PetAnimation, TrackDef>;
/** Row index of one animation track (mirrors state.ts rowOf). */
export declare function rowOfTrack(animation: PetAnimation): number;
/**
 * Background-position (px) of one frame cell within the scaled atlas.
 * The background image is scaled by `scale` (element size ÷ cell size), and
 * background-position offsets are applied in SCALED coordinates — using raw
 * atlas coordinates here would drift each frame by the scale factor and
 * render torn/overlapping frames.
 */
export declare function framePosition(row: number, col: number, scale?: number): {
    x: number;
    y: number;
};
/** Total duration of one track, ms. */
export declare function trackDuration(track: TrackDef): number;
/**
 * Detect how many frames each row actually carries by scanning the decoded
 * atlas for non-transparent cells (hatch-pet rows may hold 4–8 frames; the
 * unused trailing cells are fully transparent). Rows whose every sample is
 * transparent report 0.
 * @param image - the fully decoded spritesheet (natural size 1536×1872).
 * @returns per-row frame counts, length 9.
 */
export declare function detectFrameCounts(image: HTMLImageElement): number[];
/**
 * Trim a track to the actual frame count of its row. A row with 0 detected
 * frames degrades to the first frame (the atlas is still loading or corrupt)
 * so the pet never renders blank.
 */
export declare function trimTrack(track: TrackDef, frameCount: number): TrackDef;
//# sourceMappingURL=spritesheet.d.ts.map