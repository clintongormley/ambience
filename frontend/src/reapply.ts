/**
 * Shared helpers for parsing and displaying the "re-apply interval" value that
 * is stored as `reapply_seconds` (an integer ≥ 0, or absent) on both
 * `ExposedAction` (global default) and `ActionSpec` (per-rule override).
 */

/** Minimum re-apply interval in seconds (mirrors the Python floor). */
export const MIN_REAPPLY_SECONDS = 10;

/**
 * Parse a seconds input string for the exposed-action config default field.
 *
 * Returns `null` for empty/invalid/non-positive input (caller should then
 * CLEAR the key / treat as "off"). Otherwise clamps up to the floor:
 * `Math.max(MIN_REAPPLY_SECONDS, Math.round(n))`.
 */
export function parseReapplyConfigSeconds(raw: string): number | null {
  const trimmed = raw.trim();
  if (trimmed === "") return null;
  const n = Number(trimmed);
  if (isNaN(n)) return null;
  if (n <= 0) return null;
  return Math.max(MIN_REAPPLY_SECONDS, Math.round(n));
}

/**
 * Parse a seconds input string for the per-rule override field.
 *
 * Returns `null` for empty/invalid input (caller should REMOVE the key →
 * inherit the exposed default). Returns `0` for zero or negative input
 * (explicitly disable for this rule). Otherwise clamps up to the floor:
 * `Math.max(MIN_REAPPLY_SECONDS, Math.round(n))`.
 */
export function parseReapplyOverrideSeconds(raw: string): number | null {
  const trimmed = raw.trim();
  if (trimmed === "") return null;
  const n = Number(trimmed);
  if (isNaN(n)) return null;
  if (n <= 0) return 0;
  return Math.max(MIN_REAPPLY_SECONDS, Math.round(n));
}
