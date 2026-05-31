/**
 * Shared helpers for parsing and displaying the "re-apply interval" value that
 * is stored as `reapply_seconds` (an integer ≥ 0, or absent) on both
 * `ExposedAction` (global default) and `ActionSpec` (per-rule override).
 */

/**
 * Parse a minutes input string to a stored seconds value.
 *
 * Returns `null` for empty/invalid input (caller should then CLEAR / ignore).
 * Otherwise returns `Math.max(1, Math.round(minutes)) * 60`, so sub-1-minute
 * inputs are clamped up to 60 seconds.
 */
export function parseReapplyMinutes(raw: string): number | null {
  const trimmed = raw.trim();
  if (trimmed === "") return null;
  const minutes = Number(trimmed);
  if (isNaN(minutes)) return null;
  return Math.max(1, Math.round(minutes)) * 60;
}

/**
 * Inverse for display: seconds → whole minutes (rounded).
 */
export function reapplySecondsToMinutes(seconds: number): number {
  return Math.round(seconds / 60);
}
