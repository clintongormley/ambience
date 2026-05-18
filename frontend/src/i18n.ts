import type { PeriodDef } from "./types.js";

type Localizer = (key: string) => string | undefined;

interface HassLike {
  localize?: Localizer;
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

  const key = `component.ambience.time_of_day_period.${id}`;
  const localised = hass?.localize?.(key);
  if (localised && localised !== key) return localised;

  return id.charAt(0).toUpperCase() + id.slice(1);
}
