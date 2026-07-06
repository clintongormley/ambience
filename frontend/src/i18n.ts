import { AMBIENCE_STRINGS_BY_LOCALE } from "./i18n-data.js";
import type { ExposedAction, PeriodDef } from "./types.js";

type Localizer = (key: string, ...args: string[]) => string | undefined;

export interface HassLike {
  localize?: Localizer;
  [key: string]: unknown;
}

/** Normalise a raw locale tag to its base language subtag, e.g.
 *  "pt-BR" / "pt_BR" → "pt". The single home for this rule so detection and
 *  string-loading can never drift apart. */
function _baseCode(raw: string): string {
  return raw.toLowerCase().split(/[-_]/)[0];
}

/** Ordered list of catalogue keys to try for the user's `hass.language`: the
 *  exact (region-specific) code first, then its base language, then `en`. A
 *  `pt-BR` user therefore prefers a `pt-BR` catalogue when one is shipped, then
 *  falls back to European `pt`, then English — so region variants can be
 *  authored independently without either collapsing into the other. Only codes
 *  actually present in the catalogue are included; `en` is always the final
 *  fallback. Region catalogue keys must match HA's canonical spelling (`pt-BR`,
 *  `es-419`); separators are normalised (`pt_BR` → `pt-BR`). */
function _localeChain(hass: HassLike | undefined): string[] {
  const raw = hass?.language as string | undefined;
  const chain: string[] = [];
  if (raw) {
    const code = raw.replace(/_/g, "-");
    const base = _baseCode(code);
    if (code in AMBIENCE_STRINGS_BY_LOCALE) chain.push(code);
    if (base !== code && base in AMBIENCE_STRINGS_BY_LOCALE) chain.push(base);
  }
  if (!chain.includes("en")) chain.push("en");
  return chain;
}

export interface LanguageSupport {
  /** Whether Ambience ships UI strings for the user's language. */
  available: boolean;
  /** Full requested locale, e.g. "pt-BR". */
  code: string;
  /** Base language of `code`, e.g. "pt". */
  baseCode: string;
}

/** Region variants for which Ambience solicits a *dedicated* translation even
 *  though a base catalogue already covers them. Ambience ships European `pt`;
 *  Brazilian Portuguese differs enough that a `pt-BR` user is still nudged to
 *  request their own translation — while their strings render in European `pt`
 *  as a graceful fallback (via {@link _localeChain}) until a `pt-BR` catalogue
 *  lands. Add a code here to invite its own translation. */
const WANTED_REGION_VARIANTS = new Set<string>(["pt-BR"]);

/** Whether Ambience ships UI strings for the user's HA language, i.e. whether
 *  to suppress the "request a translation" nudge. Covered when the catalogue has
 *  an exact entry for the locale, OR a base-language entry covers it — UNLESS
 *  the locale is a {@link WANTED_REGION_VARIANTS} variant, which is treated as
 *  not-yet-covered so the nudge fires. This DELIBERATELY diverges from
 *  {@link _localeChain} for those variants: a `pt-BR` user still renders European
 *  `pt` strings (base fallback) yet is invited to request a Brazilian
 *  translation. An undeterminable language is treated as available (no nudge). */
export function getLanguageSupport(hass: HassLike | undefined): LanguageSupport {
  const raw = hass?.language as string | undefined;
  if (!raw) return { available: true, code: "", baseCode: "" };
  // Normalise separators to hyphens (HA uses BCP-47, but be robust to "pt_BR")
  // so the display name, issue URL, and per-locale dismissal all key off one
  // canonical form — and `pt-BR`/`pt_BR` can't be treated as distinct locales.
  const code = raw.replace(/_/g, "-");
  const baseCode = _baseCode(code);
  const available =
    code in AMBIENCE_STRINGS_BY_LOCALE ||
    (!WANTED_REGION_VARIANTS.has(code) && baseCode in AMBIENCE_STRINGS_BY_LOCALE);
  return { available, code, baseCode };
}

/** Native display name for a BCP-47 code ("fr" → "français", "pt-BR" →
 *  "português (Brasil)"): native name → English name → raw code, every Intl call
 *  guarded. NB Intl.DisplayNames defaults to fallback:"code", so an unknown tag
 *  echoes the code back; the `!== code` guards stop that echo masquerading as a
 *  real name. */
export function languageDisplayName(code: string): string {
  if (!code) return code;
  try {
    const native = new Intl.DisplayNames([code], { type: "language" }).of(code);
    if (native && native !== code) return native;
  } catch {
    // Invalid locale for Intl — fall through to the English name.
  }
  try {
    const english = new Intl.DisplayNames(["en"], { type: "language" }).of(code);
    if (english && english !== code) return english;
  } catch {
    // Intl unavailable — fall through to the raw code.
  }
  return code;
}

function _interp(s: string, ph?: Record<string, string>): string {
  if (!ph) return s;
  return s.replace(/\{(\w+)\}/g, (m, k) => (k in ph ? ph[k] : m));
}

/**
 * Look up a `component.ambience.<subPath>` key in the bundled locale catalogue.
 * Checks the resolved locale first, then falls back to `en`. Returns the string
 * value if found, or undefined otherwise.
 */
function _lookupIn(catalogue: Record<string, unknown>, parts: string[]): string | undefined {
  let node: unknown = catalogue;
  for (const part of parts) {
    if (node === null || typeof node !== "object") return undefined;
    node = (node as Record<string, unknown>)[part];
  }
  return typeof node === "string" ? node : undefined;
}

function _bundleLookup(hass: HassLike | undefined, key: string): string | undefined {
  const PREFIX = "component.ambience.";
  if (!key.startsWith(PREFIX)) return undefined;
  const parts = key.slice(PREFIX.length).split(".");

  // Try each catalogue in the locale's fallback chain (exact → base → en),
  // returning the first that defines the key.
  for (const locale of _localeChain(hass)) {
    const catalogue = AMBIENCE_STRINGS_BY_LOCALE[locale];
    if (!catalogue) continue;
    const result = _lookupIn(catalogue, parts);
    if (result !== undefined) return result;
  }
  return undefined;
}

function _resolve(
  hass: HassLike | undefined,
  key: string,
  fallback: string,
  ph?: Record<string, string>,
): string {
  const pairs = ph ? Object.entries(ph).flat() : [];
  const localised = hass?.localize?.(key, ...pairs);
  if (localised && localised !== key) return localised;
  const bundled = _bundleLookup(hass, key);
  if (bundled !== undefined) return _interp(bundled, ph);
  return _interp(fallback, ph);
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

/**
 * Display label for an action: the user-configured label from the matching
 * exposed action (when set and non-blank), else the result of `fallback()`.
 *
 * The single source of truth for "prefer the configured label, else derive it".
 * Callers differ only in how they derive the fallback — the scene editor / action
 * summary use {@link actionLabel} (HA localize → humanized id), while the trace
 * renderer uses {@link deriveActionLabel} (humanized id with its domain appended).
 * `fallback` is a thunk so it isn't computed when a configured label wins.
 */
export function exposedActionLabel(
  service: string,
  exposedActions: ExposedAction[] | undefined,
  fallback: () => string,
): string {
  const match = exposedActions?.find((e) => e.id === service);
  if (match?.label?.trim()) return match.label;
  return fallback();
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

/** Resolve a category-color id to a display name. Mirrors {@link luxLabel}:
 *  `component.ambience.category_color.<id>` → the English `fallback` (the
 *  color's own `label`). The id can contain hyphens (e.g. "deep-purple"),
 *  which the bundle keys quote verbatim. */
export function categoryColorLabel(
  hass: HassLike | undefined,
  id: string,
  fallback: string,
): string {
  return _resolve(hass, `component.ambience.category_color.${id}`, fallback);
}

/** Generic localizer: resolves `component.ambience.<subKey>` with an English fallback.
 *  Optional `placeholders` map interpolates `{name}` tokens in the resolved string. */
export function localize(
  hass: HassLike | undefined,
  subKey: string,
  fallback: string,
  placeholders?: Record<string, string>,
): string {
  return _resolve(hass, `component.ambience.${subKey}`, fallback, placeholders);
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

/** Localize a websocket error. The backend's send_ambience_error attaches a
 *  `translation_key` (+ `translation_placeholders`) and an English `message`.
 *  Prefer the user's-language translation via hass.localize of the exceptions
 *  key; fall back to the English message, then to any raw error text. */
export function localizeWsError(hass: HassLike | undefined, err: unknown): string {
  const e = err as
    | {
        message?: string;
        translation_key?: string;
        translation_placeholders?: Record<string, string>;
      }
    | undefined;
  const key = e?.translation_key;
  if (key) {
    const ph = e?.translation_placeholders ?? {};
    const out = _resolve(hass, `component.ambience.exceptions.${key}`, "", ph);
    if (out) return out;
  }
  if (e?.message) return e.message;
  return err instanceof Error ? err.message : String(err);
}

// --- state condition --------------------------------------------------------

/** Label for a state-condition operator (`is`, `is_not`, `>=`, `and`, …).
 *  The glyph map (≥/≤ etc.) lives in i18n-data.ts. */
export function stateOpLabel(hass: HassLike | undefined, op: string): string {
  return _resolve(hass, `component.ambience.state_op.${op}`, op);
}
