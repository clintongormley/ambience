/**
 * Day-of-month spec validation, mirroring the backend `_parse_day_spec`
 * (custom_components/ambience/matchers/day.py).
 *
 * A spec is a comma-separated list of single days ("15") and inclusive ranges
 * ("1-10"). Whitespace is tolerated and empty tokens are ignored. Every day
 * must be in 1-31 and every range must have start <= end. At least one day is
 * required.
 */
export function isValidDaySpec(spec: string): boolean {
  if (typeof spec !== "string") return false;
  const tokens = spec.split(",").map((t) => t.trim()).filter((t) => t !== "");
  if (tokens.length === 0) return false;
  for (const tok of tokens) {
    if (tok.includes("-")) {
      const parts = tok.split("-").map((p) => p.trim());
      if (parts.length !== 2 || !/^\d+$/.test(parts[0]) || !/^\d+$/.test(parts[1])) {
        return false;
      }
      const lo = Number(parts[0]);
      const hi = Number(parts[1]);
      if (!(lo >= 1 && lo <= hi && hi <= 31)) return false;
    } else {
      if (!/^\d+$/.test(tok)) return false;
      const d = Number(tok);
      if (!(d >= 1 && d <= 31)) return false;
    }
  }
  return true;
}
