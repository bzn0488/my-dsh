/**
 * Pet persistence — tiny JSON store for affinity + display config, written
 * under $DSH_HOME (defaults to ~/.dsh) as `pet.json`. Deliberately minimal:
 * one file, atomic rename write, tolerant read (corrupt file → defaults).
 * @module @linxin666/dsh-pet/persist
 */
import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { AFFINITY_MAX, emptyAffinity } from "./affinity.js";
import { defaultTreatConfig, emptyTreatLedger } from "./treats.js";
export const defaultDisplayConfig = {
    visible: true,
    size: 160,
    right: 24,
    bottom: 20,
};
/** Display value bounds (shared by load-time validation and setConfig). */
export const DISPLAY_SIZE_MIN = 32;
export const DISPLAY_SIZE_MAX = 512;
export const DISPLAY_INSET_MAX = 10_000;
/** Default pet name (used until the user renames the pet). */
export const DEFAULT_PET_NAME = '鲸鱼娘';
/** Name constraints. */
export const PET_NAME_MAX_LENGTH = 20;
export function emptyPersist() {
    return {
        name: DEFAULT_PET_NAME,
        affinity: emptyAffinity(),
        treats: emptyTreatLedger(),
        display: { ...defaultDisplayConfig },
    };
}
/** Resolve the persistence directory ($DSH_HOME or ~/.dsh). */
export function petHomeDir() {
    return process.env.DSH_HOME ?? join(homedir(), '.dsh');
}
/** Numeric field guard: finite numbers only, else the fallback. */
function finiteNum(value, fallback) {
    return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}
/** Clamp one count/score into [0, max]. */
function clamp(value, max) {
    return Math.min(max, Math.max(0, value));
}
/** Load persisted state; missing or corrupt files fall back to defaults. */
export function loadPetPersist(dir = petHomeDir()) {
    try {
        const raw = readFileSync(join(dir, 'pet.json'), 'utf8');
        const parsed = JSON.parse(raw);
        const base = emptyPersist();
        const rawAffinity = (parsed.affinity ?? {});
        const affinity = {
            points: clamp(finiteNum(rawAffinity.points, 0), AFFINITY_MAX),
            lastPetAt: clamp(finiteNum(rawAffinity.lastPetAt, 0), Number.MAX_SAFE_INTEGER),
            lastFeedAt: clamp(finiteNum(rawAffinity.lastFeedAt, 0), Number.MAX_SAFE_INTEGER),
            pets: clamp(finiteNum(rawAffinity.pets, 0), Number.MAX_SAFE_INTEGER),
            feeds: clamp(finiteNum(rawAffinity.feeds, 0), Number.MAX_SAFE_INTEGER),
            turns: clamp(finiteNum(rawAffinity.turns, 0), Number.MAX_SAFE_INTEGER),
        };
        const rawTreats = (parsed.treats ?? {});
        const treats = {
            treats: clamp(finiteNum(rawTreats.treats, 0), defaultTreatConfig.maxTreats),
            lastTreatGrantAt: clamp(finiteNum(rawTreats.lastTreatGrantAt, 0), Number.MAX_SAFE_INTEGER),
            turnsAtLastTreatGrant: clamp(finiteNum(rawTreats.turnsAtLastTreatGrant, 0), Number.MAX_SAFE_INTEGER),
        };
        const rawDisplay = (parsed.display ?? {});
        const display = {
            visible: typeof rawDisplay.visible === 'boolean' ? rawDisplay.visible : base.display.visible,
            // The settings schema requires whole pixels; drag positions are
            // clamped but not integral, so round at the persistence boundary.
            size: Math.round(Math.min(DISPLAY_SIZE_MAX, Math.max(DISPLAY_SIZE_MIN, finiteNum(rawDisplay.size, base.display.size)))),
            right: Math.round(clamp(finiteNum(rawDisplay.right, base.display.right), DISPLAY_INSET_MAX)),
            bottom: Math.round(clamp(finiteNum(rawDisplay.bottom, base.display.bottom), DISPLAY_INSET_MAX)),
        };
        return {
            name: typeof parsed.name === 'string' && parsed.name.trim() !== ''
                ? parsed.name
                : base.name,
            affinity,
            treats,
            display,
        };
    }
    catch {
        return emptyPersist();
    }
}
/** Atomically persist state (write temp + rename). */
export function savePetPersist(data, dir = petHomeDir()) {
    mkdirSync(dir, { recursive: true });
    const target = join(dir, 'pet.json');
    const tmp = `${target}.tmp`;
    writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
    renameSync(tmp, target);
}
