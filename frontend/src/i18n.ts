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
 *   "light.turn_on" → "Light.turn on"
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

// Metric defaults — used when hass.config.unit_system is unavailable or doesn't
// expose the relevant key. Humidity is always %.
const _DEFAULT_WEATHER_UNITS: Record<string, string> = {
  temperature: "°C",
  apparent_temperature: "°C",
  humidity: "%",
  wind_speed: "m/s",
  pressure: "hPa",
};

// Which `unit_system` field provides the unit for each weather attribute.
// Humidity is omitted: HA does not expose a humidity unit (it's always %).
const _UNIT_SYSTEM_KEY: Record<string, string> = {
  temperature: "temperature",
  apparent_temperature: "temperature",
  wind_speed: "wind_speed",
  pressure: "pressure",
};

// Which entity-state attribute carries the unit for each weather attribute.
// Weather entities expose these on their state attributes — HA itself reads
// them to display the value, so they're guaranteed to match what's stored.
const _ENTITY_UNIT_ATTR: Record<string, string> = {
  temperature: "temperature_unit",
  apparent_temperature: "temperature_unit",
  wind_speed: "wind_speed_unit",
  pressure: "pressure_unit",
};

type EntityStateLike = { attributes?: Record<string, unknown> };

/** Return the unit symbol to display next to a numeric weather threshold value.
 *
 *  Resolution order:
 *    1. Humidity is hard-coded to `%`.
 *    2. The configured weather entity's own `<attr>_unit` attribute, if
 *       provided — this is what HA actually uses to render the value.
 *    3. `hass.config.unit_system.<attr>` — falls back to HA's global unit
 *       system. NB: unit_system reports SI base units (e.g. `Pa`) while
 *       weather entities typically render in display units (`hPa`); for that
 *       reason prefer the entity state when you have it.
 *    4. Metric defaults (`°C`, `m/s`, `hPa`) when nothing else is known.
 *
 *  Returns `""` for unknown attributes. */
export function weatherAttrUnit(
  hass: HassLike | undefined,
  attr: string,
  entityState?: EntityStateLike,
): string {
  if (attr === "humidity") return "%";
  const entityAttr = _ENTITY_UNIT_ATTR[attr];
  if (entityAttr) {
    const value = entityState?.attributes?.[entityAttr];
    if (typeof value === "string" && value) return value;
  }
  const sysKey = _UNIT_SYSTEM_KEY[attr];
  const sys = (hass as { config?: { unit_system?: Record<string, unknown> } } | undefined)
    ?.config?.unit_system;
  if (sysKey && sys && typeof sys[sysKey] === "string") return sys[sysKey] as string;
  return _DEFAULT_WEATHER_UNITS[attr] ?? "";
}

// --- state matcher --------------------------------------------------------

const _STATE_OP_FALLBACKS: Record<string, string> = {
  is: "is",
  is_not: "is not",
  ">": ">",
  ">=": "≥",
  "<": "<",
  "<=": "≤",
  and: "AND",
  or: "OR",
  and_not: "AND NOT",
  or_not: "OR NOT",
  not: "NOT",
};

/** Label for a state-matcher operator (`is`, `is_not`, `and`, `or`, `not`). */
export function stateOpLabel(hass: HassLike | undefined, op: string): string {
  return _resolve(
    hass,
    `component.ambience.state_op.${op}`,
    _STATE_OP_FALLBACKS[op] ?? op,
  );
}
