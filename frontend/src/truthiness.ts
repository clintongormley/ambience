/**
 * Frontend mirror of Home Assistant's `result_as_boolean`
 * (homeassistant.helpers.template.result_as_boolean), which the backend
 * `TemplateCondition` uses to turn a rendered template into a match/no-match.
 *
 * Keep this in sync with the backend rule:
 *   true / non-zero number / "1" / "true" / "yes" / "on" / "enable"  => true
 *   everything else (incl. unknown/none/empty/other strings)         => false
 *
 * Used to annotate the live render preview with the boolean the condition will
 * actually see — important because e.g. a bare `"42"` string is NOT truthy.
 */
const TRUE_STRINGS = new Set(["1", "true", "yes", "on", "enable"]);

export function resultAsBoolean(result: unknown): boolean {
  if (result == null) return false;
  if (typeof result === "boolean") return result;
  if (typeof result === "number") return result !== 0;
  // Any string not explicitly truthy is falsy (HA's forgiving default), so a
  // bare value like "42" or "off" => false.
  if (typeof result === "string") return TRUE_STRINGS.has(result.toLowerCase().trim());
  return false;
}
