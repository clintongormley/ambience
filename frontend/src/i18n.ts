import type { PeriodDef } from "./types.js";

type Localizer = (key: string) => string | undefined;

interface HassLike {
  localize?: Localizer;
  [key: string]: unknown;
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

/** Generic localizer: resolves `component.ambience.<subKey>` with an English fallback. */
export function localize(
  hass: HassLike | undefined,
  subKey: string,
  fallback: string,
): string {
  return _resolve(hass, `component.ambience.${subKey}`, fallback);
}

const _WEEKDAY_IDS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const _WEEKDAY_FALLBACKS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** index: 0=Mon … 6=Sun (matches Python date.weekday()). */
export function weekdayLabel(hass: HassLike | undefined, index: number): string {
  return _resolve(
    hass,
    `component.ambience.weekday.${_WEEKDAY_IDS[index]}`,
    _WEEKDAY_FALLBACKS[index] ?? String(index),
  );
}

const _DAY_ITEM_FALLBACKS: Record<string, string> = {
  weekday: "Day of week",
  day_of_month: "Day of month",
  date: "Date (annual)",
  date_range: "Date range (annual)",
  last_day: "Last day of month",
  workday: "Workday",
  holiday: "Holiday",
  first_workday: "First workday of month",
  last_workday: "Last workday of month",
};

export function dayItemKindLabel(hass: HassLike | undefined, kind: string): string {
  return _resolve(
    hass,
    `component.ambience.day_item.${kind}`,
    _DAY_ITEM_FALLBACKS[kind] ?? kind,
  );
}

const _MONTH_FALLBACKS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** month: 1=January … 12=December. */
export function monthLabel(hass: HassLike | undefined, month: number): string {
  return _resolve(
    hass,
    `component.ambience.month.${month}`,
    _MONTH_FALLBACKS[month - 1] ?? String(month),
  );
}

const _WEATHER_CONDITION_FALLBACKS: Record<string, string> = {
  "clear-night": "Clear (night)",
  cloudy: "Cloudy",
  fog: "Fog",
  hail: "Hail",
  lightning: "Lightning",
  "lightning-rainy": "Lightning-rainy",
  partlycloudy: "Partly cloudy",
  pouring: "Pouring",
  rainy: "Rainy",
  snowy: "Snowy",
  "snowy-rainy": "Snowy-rainy",
  sunny: "Sunny",
  windy: "Windy",
  "windy-variant": "Windy (variant)",
  exceptional: "Exceptional",
};

export function weatherConditionLabel(hass: HassLike | undefined, cond: string): string {
  return _resolve(
    hass,
    `component.ambience.weather_condition.${cond}`,
    _WEATHER_CONDITION_FALLBACKS[cond] ?? cond,
  );
}

const _WEATHER_ATTR_FALLBACKS: Record<string, string> = {
  temperature: "Temperature",
  apparent_temperature: "Apparent temperature",
  humidity: "Humidity",
  wind_speed: "Wind speed",
  pressure: "Pressure",
};

export function weatherAttrLabel(hass: HassLike | undefined, attr: string): string {
  return _resolve(
    hass,
    `component.ambience.weather_attr.${attr}`,
    _WEATHER_ATTR_FALLBACKS[attr] ?? attr,
  );
}
