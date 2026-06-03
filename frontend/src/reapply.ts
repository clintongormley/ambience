/**
 * Shared helpers for parsing and displaying the "re-apply interval" value that
 * is stored as `reapply_seconds` (an integer ≥ 0, or absent) on both
 * `ExposedAction` (global default) and `ActionSpec` (per-scene override).
 */

import type { ActionSpec } from "./types.js";

/** Minimum re-apply interval in seconds (mirrors the Python floor). */
export const MIN_REAPPLY_SECONDS = 10;

/** Seed default (seconds) when re-apply is first enabled on an exposed action. */
export const DEFAULT_REAPPLY_SECONDS = 300;

/**
 * Parse a seconds input string into a stored `reapply_seconds` value.
 *
 * Empty/invalid input → `null` (the caller clears the key). For non-positive
 * input, `zeroMeansDisable` decides: the per-scene override stores `0` (disable
 * for this scene), while the exposed-action default returns `null` (off).
 * Positive input clamps up to the floor.
 */
function parseReapplySeconds(raw: string, zeroMeansDisable: boolean): number | null {
  const trimmed = raw.trim();
  if (trimmed === "") return null;
  const n = Number(trimmed);
  if (Number.isNaN(n)) return null;
  if (n <= 0) return zeroMeansDisable ? 0 : null;
  return Math.max(MIN_REAPPLY_SECONDS, Math.round(n));
}

/**
 * Parse the exposed-action config default field. Returns `null` for
 * empty/invalid/non-positive input (caller CLEARs the key / treats as "off").
 */
export function parseReapplyConfigSeconds(raw: string): number | null {
  return parseReapplySeconds(raw, false);
}

/**
 * Parse the per-scene override field. Returns `null` for empty/invalid input
 * (caller REMOVEs the key → inherit the exposed default) and `0` for zero or
 * negative input (explicitly disable for this scene).
 */
export function parseReapplyOverrideSeconds(raw: string): number | null {
  return parseReapplySeconds(raw, true);
}

/**
 * The effective re-apply interval for a scene action: the per-scene override when
 * the key is PRESENT (so an explicit 0 does NOT fall back), else the exposed
 * default, else 0.
 */
export function effectiveReapplySeconds(action: ActionSpec, exposedSeconds: number): number {
  if ("reapply_seconds" in action) return action.reapply_seconds ?? 0;
  return exposedSeconds;
}
