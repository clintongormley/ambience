import type { PeriodDef } from "./types.js";

type Localizer = (key: string) => string | undefined;

interface HassLike {
  localize?: Localizer;
}

function _resolve(hass: HassLike | undefined, key: string, fallback: string): string {
  const localised = hass?.localize?.(key);
  if (localised && localised !== key) return localised;
  return fallback;
}

/**
 * Convert a snake_case identifier into a friendly display string:
 *   "scene"       → "Scene"
 *   "time_of_day" → "Time of day"
 *   "set_light"   → "Set light"
 *
 * Used as the fallback for matcher/action labels when hass.localize
 * doesn't have a translation for the key.
 */
function _friendlyFallback(id: string): string {
  const spaced = id.replaceAll("_", " ").toLowerCase();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export function matcherLabel(hass: HassLike | undefined, name: string): string {
  return _resolve(hass, `component.ambience.matcher.${name}`, _friendlyFallback(name));
}

export function actionLabel(hass: HassLike | undefined, name: string): string {
  return _resolve(hass, `component.ambience.action.${name}`, _friendlyFallback(name));
}

export function anchorLabel(hass: HassLike | undefined, anchor: string): string {
  return _resolve(hass, `component.ambience.anchor.${anchor}`, _friendlyFallback(anchor));
}

/**
 * Resolve a period id to a display name.
 *   1. If the id is in `custom` and has a non-empty `label`, return the label.
 *   2. Else try `hass.localize("component.ambience.time_of_day_period.<id>")`.
 *      Many HA localizers return the key itself on miss; treat that as a miss.
 *   3. Else fall back to the id with first letter uppercased.
 */
export function periodLabel(
  hass: HassLike | undefined,
  id: string,
  custom: Record<string, PeriodDef>,
): string {
  const custom_label = custom[id]?.label;
  if (custom_label) return custom_label;

  const fallback = id.charAt(0).toUpperCase() + id.slice(1);
  return _resolve(hass, `component.ambience.time_of_day_period.${id}`, fallback);
}
