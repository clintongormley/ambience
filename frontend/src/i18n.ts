import { AMBIENCE_STRINGS } from "./i18n-data.js";
import type { PeriodDef } from "./types.js";

type Localizer = (key: string) => string | undefined;

interface HassLike {
  localize?: Localizer;
  [key: string]: unknown;
}

/**
 * Look up a `component.ambience.<subPath>` key in the bundled AMBIENCE_STRINGS.
 * Returns the string value if found, or undefined otherwise.
 */
function _bundleLookup(key: string): string | undefined {
  const PREFIX = "component.ambience.";
  if (!key.startsWith(PREFIX)) return undefined;
  const parts = key.slice(PREFIX.length).split(".");
  let node: unknown = AMBIENCE_STRINGS;
  for (const part of parts) {
    if (node === null || typeof node !== "object") return undefined;
    node = (node as Record<string, unknown>)[part];
  }
  return typeof node === "string" ? node : undefined;
}

function _resolve(hass: HassLike | undefined, key: string, fallback: string): string {
  const localised = hass?.localize?.(key);
  if (localised && localised !== key) return localised;
  const bundled = _bundleLookup(key);
  if (bundled !== undefined) return bundled;
  return fallback;
}

/**
 * Convert a snake_case identifier into a friendly display string by replacing
 * underscores with spaces and capitalising the first letter:
 *   "time_of_day" → "Time of day"
 *   "light.turn_on" → "Light.turn on"  (dots are preserved)
 *
 * The shared humanisation primitive: used wherever a raw id needs a readable
 * label — field ids, condition/action ids, and so on.
 */
export function humanizeId(id: string): string {
  const spaced = id.replaceAll("_", " ").toLowerCase();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/** Fallback label for condition/action ids when hass.localize has no
 *  translation for the key. */
function _friendlyFallback(id: string): string {
  return humanizeId(id);
}

/**
 * Derive a human-friendly label from a service id, e.g.
 * `light.turn_on` → "Turn on light".
 *
 * The humanized service name is suffixed with the domain word(s), unless the
 * service already mentions every domain word (`cover.open_cover` → "Open cover",
 * not "Open cover cover"). The first letter is capitalized.
 */
export function deriveActionLabel(serviceId: string): string {
  const dotIdx = serviceId.indexOf(".");
  const domain = dotIdx === -1 ? "" : serviceId.slice(0, dotIdx);
  const service = dotIdx === -1 ? serviceId : serviceId.slice(dotIdx + 1);
  const serviceWords = service.replaceAll("_", " ").trim().toLowerCase();
  const domainWords = domain.replaceAll("_", " ").trim().toLowerCase();

  const serviceTokens = serviceWords ? serviceWords.split(" ") : [];
  const domainTokens = domainWords ? domainWords.split(" ") : [];
  const mentionsDomain =
    domainTokens.length > 0 && domainTokens.every((t) => serviceTokens.includes(t));

  const result = !domainWords || mentionsDomain ? serviceWords : `${serviceWords} ${domainWords}`;
  return result.charAt(0).toUpperCase() + result.slice(1);
}

/** HA's snake_case → "Sentence case" attribute formatter, with the same
 *  acronym fixups HA applies. Used as a fallback when the running HA doesn't
 *  expose `hass.formatEntityAttributeName`. */
export function formatAttributeName(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\bid\b/g, "ID")
    .replace(/\bip\b/g, "IP")
    .replace(/\bmac\b/g, "MAC")
    .replace(/\bgps\b/g, "GPS")
    .replace(/^\w/, (c) => c.toUpperCase());
}

/** Human-readable label for an entity attribute. Prefers HA's own translation-
 *  aware formatter (so it matches the automation editor / more-info dialog and
 *  the state condition's Where dropdown), falling back to
 *  {@link formatAttributeName}. `stateObj` is the entity's hass.states entry,
 *  needed by HA's formatter; pass undefined to force the fallback. */
export function stateAttributeLabel(
  hass: HassLike | undefined,
  stateObj: unknown,
  attribute: string,
): string {
  const fmt = (
    hass as { formatEntityAttributeName?: (s: unknown, a: string) => string } | undefined
  )?.formatEntityAttributeName;
  if (fmt && stateObj) {
    const label = fmt(stateObj, attribute);
    if (label) return label;
  }
  return formatAttributeName(attribute);
}

/** Human-readable label for a candidate state/attribute VALUE. Mirrors
 *  {@link stateAttributeLabel} but for the right-hand side of a comparison:
 *  prefers HA's `formatEntityAttributeValue` (attribute mode) or
 *  `formatEntityState` (state mode) so a stored raw value (e.g. `heat_cool`)
 *  displays the way HA shows it (`Heat/cool`). `stateObj` is the entity's
 *  hass.states entry. Falls back to the raw value verbatim. */
export function stateValueLabel(
  hass: HassLike | undefined,
  stateObj: unknown,
  attribute: string | null | undefined,
  value: string,
): string {
  if (!stateObj) return value;
  const h = hass as
    | {
        formatEntityState?: (s: unknown, state?: string) => string;
        formatEntityAttributeValue?: (s: unknown, attr: string, v?: string) => string;
      }
    | undefined;
  if (attribute) {
    const fmt = h?.formatEntityAttributeValue;
    if (fmt) {
      const label = fmt(stateObj, attribute, value);
      if (label) return label;
    }
  } else {
    const fmt = h?.formatEntityState;
    if (fmt) {
      const label = fmt(stateObj, value);
      if (label) return label;
    }
  }
  return value;
}

export function conditionLabel(hass: HassLike | undefined, name: string): string {
  return _resolve(hass, `component.ambience.condition.${name}`, _friendlyFallback(name));
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

  return _resolve(hass, `component.ambience.time_of_day_period.${id}`, humanizeId(id));
}

/** Resolve a lux-range id to a display name. Mirrors {@link periodLabel}:
 *  custom label → `component.ambience.lux_range.<id>` → id with first letter
 *  uppercased (underscores become spaces, e.g. "very_bright" → "Very bright"). */
export function luxLabel(
  hass: HassLike | undefined,
  id: string,
  custom: Record<string, { label?: string | null }>,
): string {
  const custom_label = custom[id]?.label;
  if (custom_label) return custom_label;

  return _resolve(hass, `component.ambience.lux_range.${id}`, humanizeId(id));
}

/** Generic localizer: resolves `component.ambience.<subKey>` with an English fallback. */
export function localize(hass: HassLike | undefined, subKey: string, fallback: string): string {
  return _resolve(hass, `component.ambience.${subKey}`, fallback);
}

const _WEEKDAY_IDS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

/** index: 0=Mon … 6=Sun (matches Python date.weekday()). The English strings
 *  live in i18n-data.ts (the bundle); no duplicate fallback table here. */
export function weekdayLabel(hass: HassLike | undefined, index: number): string {
  const id = _WEEKDAY_IDS[index];
  return _resolve(hass, `component.ambience.weekday.${id}`, id ?? String(index));
}

export function dayItemKindLabel(hass: HassLike | undefined, kind: string): string {
  return _resolve(hass, `component.ambience.day_item.${kind}`, humanizeId(kind));
}

/** month: 1=January … 12=December. The English names live in i18n-data.ts. */
export function monthLabel(hass: HassLike | undefined, month: number): string {
  return _resolve(hass, `component.ambience.month.${month}`, String(month));
}

export function weatherConditionLabel(hass: HassLike | undefined, cond: string): string {
  return _resolve(hass, `component.ambience.weather_condition.${cond}`, humanizeId(cond));
}

export function weatherAttrLabel(hass: HassLike | undefined, attr: string): string {
  return _resolve(hass, `component.ambience.weather_attr.${attr}`, humanizeId(attr));
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
  const sys = (hass as { config?: { unit_system?: Record<string, unknown> } } | undefined)?.config
    ?.unit_system;
  if (sysKey && sys && typeof sys[sysKey] === "string") return sys[sysKey] as string;
  return _DEFAULT_WEATHER_UNITS[attr] ?? "";
}

// --- state condition --------------------------------------------------------

/** Label for a state-condition operator (`is`, `is_not`, `>=`, `and`, …).
 *  The glyph map (≥/≤ etc.) lives in i18n-data.ts. */
export function stateOpLabel(hass: HassLike | undefined, op: string): string {
  return _resolve(hass, `component.ambience.state_op.${op}`, op);
}
