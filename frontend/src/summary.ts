import {
  actionLabel,
  anchorLabel,
  humanizeId,
  localize,
  monthLabel,
  periodLabel,
  stateAttributeLabel,
  stateOpLabel,
  stateValueLabel,
  weatherAttrLabel,
  weekdayLabel,
} from "./i18n.js";
import type {
  ActionSpec,
  DayItem,
  DayPredicate,
  ExposedAction,
  PeoplePredicate,
  PeriodStoreView,
  Scene,
  ScriptPredicate,
  ServiceSchema,
  StateExpr,
  StatePredicate,
  SunPredicate,
  TemplatePredicate,
  TimeEndpoint,
  TimeOfDayPredicate,
  WeatherGroup,
  WeatherPredicate,
} from "./types.js";
import { entityName, type HassWithStates } from "./views/entity-row.js";

interface HassLike {
  localize?: (k: string) => string | undefined;
  [key: string]: unknown;
}

interface ConditionContext {
  hass?: HassLike;
  periods?: PeriodStoreView;
  weatherGroups?: WeatherGroup[];
}

interface ActionContext {
  hass?: HassLike;
  // Optional. When provided, the matching ExposedAction is used to resolve
  // a human-friendly label for the action (otherwise the service id is
  // used verbatim).
  exposedActions?: ExposedAction[];
  // Optional. When provided, the service schema is consulted for each
  // param's display name (HA's `field.name` attribute), falling back to
  // the humanized field id when absent.
  schemas?: Record<string, ServiceSchema>;
}

/** Human label for one param field: prefers HA's `field.name` attribute
 *  from the service schema; falls back to humanizing the raw field id. */
export function paramLabel(
  fieldId: string,
  serviceId: string | undefined,
  schemas?: Record<string, ServiceSchema>,
): string {
  if (serviceId && schemas) {
    const field = schemas[serviceId]?.fields?.[fieldId];
    if (field && typeof field === "object") {
      const name = (field as { name?: unknown }).name;
      if (typeof name === "string" && name) return name;
    }
  }
  return humanizeFieldId(fieldId);
}

/**
 * Display name for a scene: explicit `name`, or a default placeholder.
 */
export function sceneDisplayName(scene: Scene, defaultPlaceholder = "New scene"): string {
  if (scene.name?.trim()) return scene.name;
  return defaultPlaceholder;
}

export function summariseCondition(
  conditionName: string,
  predicate: unknown,
  ctx: ConditionContext,
): string {
  if (predicate == null) return localize(ctx.hass, "ui.summary_any_paren", "(any)");
  if (conditionName === "time_of_day") {
    return summariseTimeOfDay(predicate as TimeOfDayPredicate, ctx);
  }
  if (conditionName === "day") {
    return summariseDay(predicate as DayPredicate, ctx);
  }
  if (conditionName === "weather") {
    return summariseWeather(predicate as WeatherPredicate, ctx);
  }
  if (conditionName === "sun") {
    return summariseSun(predicate as SunPredicate, ctx);
  }
  if (conditionName === "state") {
    return summariseState(predicate as StatePredicate, ctx);
  }
  if (conditionName === "script") {
    return summariseScript(predicate as ScriptPredicate, ctx);
  }
  if (conditionName === "people") {
    return summarisePeople(predicate as PeoplePredicate, ctx);
  }
  if (conditionName === "template") {
    return summariseTemplate(predicate as TemplatePredicate, ctx);
  }
  return String(predicate);
}

export function summariseTemplate(pred: TemplatePredicate, ctx: ConditionContext = {}): string {
  if (pred === null) return localize(ctx.hass, "ui.summary_any_paren", "(any)");
  if (typeof pred !== "object" || typeof (pred as { template?: unknown }).template !== "string") {
    return String(pred);
  }
  return pred.template;
}

export function summariseScript(pred: ScriptPredicate, ctx: ConditionContext = {}): string {
  if (pred === null) return localize(ctx.hass, "ui.summary_any_paren", "(any)");
  // Defensive: malformed predicate (non-object or missing/non-string script).
  if (typeof pred !== "object" || typeof (pred as { script?: unknown }).script !== "string") {
    return String(pred);
  }
  const name = _domainEntityName(ctx, pred.script);
  const args = pred.args ?? {};
  const keys = Object.keys(args).sort();
  if (keys.length === 0) return name;
  const argStr = keys
    .map(
      (k) => `${scriptFieldLabel(ctx.hass, pred.script, k)}: ${formatArgValue(ctx.hass, args[k])}`,
    )
    .join(", ");
  return `${name} (${argStr})`;
}

/** Friendly label for a script field: prefers the field's HA `name` alias
 *  (from `hass.services.script.<name>.fields`), falling back to the humanised
 *  field id. Shared by the script summary and the predicate editor's
 *  `computeLabel`, which read the same live service registry. */
export function scriptFieldLabel(
  hass: HassLike | undefined,
  scriptId: string,
  fieldId: string,
): string {
  const name = scriptId.replace(/^script\./, "");
  const services = (
    hass as
      | {
          services?: Record<
            string,
            Record<string, { fields?: Record<string, { name?: unknown }> }>
          >;
        }
      | undefined
  )?.services;
  const alias = services?.script?.[name]?.fields?.[fieldId]?.name;
  return typeof alias === "string" && alias ? alias : humanizeFieldId(fieldId);
}

/** Display name for an entity from a domain-prefixed id, falling back to a
 *  humanised local id (`person.alice` → "Alice", `zone.gym` → "Gym") when no
 *  friendly_name is set. */
function _domainEntityName(ctx: ConditionContext, entity_id: string): string {
  const states = (
    ctx.hass as { states?: Record<string, { attributes?: Record<string, unknown> }> } | undefined
  )?.states;
  const name = states?.[entity_id]?.attributes?.friendly_name;
  if (typeof name === "string" && name) return name;
  const dot = entity_id.indexOf(".");
  const local = dot >= 0 ? entity_id.slice(dot + 1) : entity_id;
  return local.charAt(0).toUpperCase() + local.slice(1);
}

/** The location NAME only (no "at" prefix): "Home" or the zone's friendly name
 *  (capitalised) — the "at"/"not at" connector is built from `negate`. */
function _whereLabel(where: string, ctx: ConditionContext): string {
  if (where === "home") return localize(ctx.hass, "people_summary.home", "Home");
  return _domainEntityName(ctx, where);
}

/**
 * Mirror the widget's phrasing: "<Mode> is at <Location>" (or "is not at" when
 * negated) for the base modes and "<Mode>: (<names>) is [not] at <Location>"
 * for the "X of:" modes — e.g. "Everybody is at Home", "None of: (Clinton) is
 * at Home", "Any of: (Alice) is not at Work".
 * Mode is keyed off the presence of the `who` key (matching the input widget):
 * absent → a base mode (everyone→Everybody, nobody→Nobody); present → an
 * "X of:" mode chosen by `quant`.
 */
export function summarisePeople(pred: PeoplePredicate, ctx: ConditionContext = {}): string {
  if (pred == null) return localize(ctx.hass, "ui.summary_any", "any");
  const where = pred.where ?? "home";

  // Single-person list: drop the "Any of:/All of:/None of:" wrapper and read
  // "<Name> is [not] at <Location>". The verb polarity is the XOR of the
  // negative-quant ("nobody") and an explicit `negate`, so a double negative
  // resolves back to a positive.
  if (Array.isArray(pred.who) && pred.who.length === 1) {
    const name = _domainEntityName(ctx, pred.who[0]);
    const effectiveNot = (pred.quant === "nobody") !== Boolean(pred.negate);
    const conn = effectiveNot
      ? localize(ctx.hass, "people_summary.is_not_at", "is not at")
      : localize(ctx.hass, "people_summary.is_at", "is at");
    const head = `${name} ${conn} ${_whereLabel(where, ctx)}`;
    if (pred.for && _hasStateDuration(pred.for)) {
      return `${head} ${localize(ctx.hass, "ui.for_prefix", "for")} ≥${_fmtStateDur(pred.for)}`;
    }
    return head;
  }

  let subject: string;
  if (!Array.isArray(pred.who)) {
    // Base mode — no name list: everyone→Everybody, any→Anybody, nobody→Nobody.
    // A missing quant defaults to "everyone" (Everybody) to match the widget,
    // so a bare `{}` reads as "Everybody is Home".
    const quant = pred.quant ?? "everyone";
    subject =
      quant === "nobody"
        ? localize(ctx.hass, "ui.people_mode_nobody", "Nobody")
        : quant === "any"
          ? localize(ctx.hass, "ui.people_mode_anybody", "Anybody")
          : localize(ctx.hass, "ui.people_mode_everybody", "Everybody");
  } else {
    // "X of:" mode — a missing quant defaults to "any" (Any of:).
    const quant = pred.quant ?? "any";
    const label =
      quant === "any"
        ? localize(ctx.hass, "ui.people_mode_any", "Any of:")
        : quant === "everyone"
          ? localize(ctx.hass, "ui.people_mode_all", "All of:")
          : localize(ctx.hass, "ui.people_mode_none", "None of:");
    const names = pred.who.map((id) => _domainEntityName(ctx, id)).join(", ");
    subject = `${label} (${names})`;
  }
  const connector = pred.negate
    ? localize(ctx.hass, "people_summary.is_not_at", "is not at")
    : localize(ctx.hass, "people_summary.is_at", "is at");
  const head = `${subject} ${connector} ${_whereLabel(where, ctx)}`;
  if (pred.for && _hasStateDuration(pred.for)) {
    return `${head} ${localize(ctx.hass, "ui.for_prefix", "for")} ≥${_fmtStateDur(pred.for)}`;
  }
  return head;
}

export function summariseDay(pred: DayPredicate, ctx: ConditionContext = {}): string {
  if (pred === null) return localize(ctx.hass, "day_summary.any", "any");
  const include = pred.include ?? [];
  const exclude = pred.exclude ?? [];
  const inc =
    include.length === 0
      ? localize(ctx.hass, "day_summary.any_day", "any day")
      : include.map((it) => _fmtDayItem(it, ctx)).join(", ");
  if (exclude.length === 0) return inc;
  const except = localize(ctx.hass, "day_summary.except", "except");
  return `${inc} (${except} ${exclude.map((it) => _fmtDayItem(it, ctx)).join(", ")})`;
}

function _fmtDayItem(item: DayItem, ctx: ConditionContext): string {
  switch (item.kind) {
    case "weekday":
      return item.days.map((d) => weekdayLabel(ctx.hass, d)).join("/");
    case "day_of_month":
      return `${localize(ctx.hass, "day_summary.day_prefix", "Day")} ${item.days}`;
    case "date":
      return `${monthLabel(ctx.hass, item.month)} ${item.day}`;
    case "date_range":
      return `${monthLabel(ctx.hass, item.from.month)} ${item.from.day} → ${monthLabel(ctx.hass, item.to.month)} ${item.to.day}`;
    case "last_day":
      return localize(ctx.hass, "day_summary.last_day", "Last day");
    case "workday":
      return localize(ctx.hass, "day_summary.workday", "Workday");
    case "holiday":
      return localize(ctx.hass, "day_summary.holiday", "Holiday");
    case "first_workday":
      return localize(ctx.hass, "day_summary.first_workday", "First workday");
    case "last_workday":
      return localize(ctx.hass, "day_summary.last_workday", "Last workday");
  }
}

const _OP_LABEL: Record<string, string> = {
  "<": "<",
  "<=": "≤",
  ">": ">",
  ">=": "≥",
};

/** Humanize a field id: replace underscores with spaces and capitalize first letter.
 *  "brightness_pct" → "Brightness pct", "transition" → "Transition" */
export function humanizeFieldId(fieldId: string): string {
  return humanizeId(fieldId);
}

/** Format a param value for display: primitives as-is, arrays/objects via
 *  JSON.stringify so arrays render with [ ] brackets — e.g.
 *  [210, 81, 81] → "[210,81,81]". */
export function formatParamValue(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return JSON.stringify(value);
}

const _TARGET_KEYS = ["entity_id", "device_id", "area_id", "label_id", "floor_id"];
const _TARGET_ENTITY_CAP = 2;

/** If `value` is an HA target object (only target keys) carrying one or more
 *  entity_ids, return that list; otherwise null. Device/area/label/floor-only
 *  targets return null (no registry available here to name them). */
function _targetEntityIds(value: unknown): string[] | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const obj = value as Record<string, unknown>;
  if (!Object.keys(obj).every((k) => _TARGET_KEYS.includes(k))) return null;
  const raw = obj.entity_id;
  const ids =
    typeof raw === "string"
      ? [raw]
      : Array.isArray(raw)
        ? raw.filter((x): x is string => typeof x === "string")
        : [];
  return ids.length ? ids : null;
}

/** Format an arg/param value for a summary. HA target objects (`{entity_id:
 *  …}`) render as a bracketed list of friendly entity names — the first
 *  `_TARGET_ENTITY_CAP`, then "+N more" for longer lists — so a summary reads
 *  "Target: [Kitchen, Hallway +2 more]" rather than a raw JSON dump. Everything
 *  else falls back to {@link formatParamValue}. */
export function formatArgValue(hass: HassLike | undefined, value: unknown): string {
  const ids = _targetEntityIds(value);
  if (!ids) return formatParamValue(value);
  const names = ids.slice(0, _TARGET_ENTITY_CAP).map((id) => _domainEntityName({ hass }, id));
  const rest = ids.length - _TARGET_ENTITY_CAP;
  const body = rest > 0 ? `${names.join(", ")} +${rest} more` : names.join(", ");
  return `[${body}]`;
}

/** Extract the `unit_of_measurement` from a selector dict, if any — e.g.
 *  `{ number: { unit_of_measurement: "seconds" } }` → "seconds". Returns
 *  undefined for selectors that don't declare one. */
export function selectorUnit(selector: unknown): string | undefined {
  if (!selector || typeof selector !== "object") return undefined;
  for (const v of Object.values(selector as Record<string, unknown>)) {
    if (v && typeof v === "object") {
      const unit = (v as Record<string, unknown>).unit_of_measurement;
      if (typeof unit === "string" && unit) return unit;
    }
  }
  return undefined;
}

/** Fallback display for a group id that no longer matches any configured
 *  group — split on `_`/`-`/whitespace and title-case each word. */
function _humaniseGroupId(id: string): string {
  return id
    .split(/[\s_-]+/)
    .filter((w) => w !== "")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export function summariseWeather(pred: WeatherPredicate, ctx: ConditionContext = {}): string {
  if (pred === null) return localize(ctx.hass, "ui.summary_any", "any");
  const groupMap = new Map((ctx.weatherGroups ?? []).map((g) => [g.id, g.label]));
  const groups = (pred.groups ?? [])
    .map((id) => groupMap.get(id) ?? _humaniseGroupId(id))
    .join("/");
  const thr = (pred.thresholds ?? [])
    .map((t) => `${weatherAttrLabel(ctx.hass, t.attribute)} ${_OP_LABEL[t.op] ?? t.op} ${t.value}`)
    .join(", ");
  const parts = [groups, thr].filter((s) => s !== "");
  return parts.length === 0 ? localize(ctx.hass, "ui.summary_any", "any") : parts.join(", ");
}

export function summariseSun(pred: SunPredicate, ctx: ConditionContext = {}): string {
  if (pred === null) return localize(ctx.hass, "ui.summary_any", "any");
  const parts: string[] = [];
  const e = pred.elevation;
  if (e) {
    if (e.min != null && e.max != null) parts.push(`${e.min}°–${e.max}°`);
    else if (e.min != null) parts.push(`≥${e.min}°`);
    else if (e.max != null) parts.push(`≤${e.max}°`);
  }
  const az = pred.azimuth;
  if (az) {
    if (az.sectors?.length) parts.push(az.sectors.join("/"));
    for (const r of az.ranges ?? []) parts.push(`${r.from}°–${r.to}°`);
  }
  return parts.length === 0 ? localize(ctx.hass, "ui.summary_any", "any") : parts.join(", ");
}

/** Best-effort display name for an entity: friendly_name attribute when set,
 *  otherwise the raw entity_id. Thin ctx-first adapter over {@link entityName}. */
function _entityDisplayName(ctx: ConditionContext, entity_id: string): string {
  return entityName(ctx.hass as HassWithStates | undefined, entity_id);
}

/** Public, hass-first wrapper around {@link _entityDisplayName}: an entity's
 *  friendly_name when set, else the raw entity_id. */
export function entityDisplayName(hass: HassLike | undefined, entity_id: string): string {
  return _entityDisplayName({ hass }, entity_id);
}

export function summariseState(pred: StatePredicate, ctx: ConditionContext = {}): string {
  if (pred == null) return localize(ctx.hass, "ui.summary_any", "any");
  return _renderStateExpr(pred, ctx);
}

function _renderStateExpr(expr: StateExpr, ctx: ConditionContext): string {
  if (
    expr.kind === "is" ||
    expr.kind === "is_not" ||
    expr.kind === ">" ||
    expr.kind === ">=" ||
    expr.kind === "<" ||
    expr.kind === "<="
  ) {
    const verb = stateOpLabel(ctx.hass, expr.kind);
    // Use the entity's friendly_name when available (falls back to the
    // raw entity_id). Attribute-mode renders as `<name>.<attribute>`.
    const name = _entityDisplayName(ctx, expr.entity_id);
    const stateObj = (ctx.hass as HassWithStates | undefined)?.states?.[expr.entity_id];
    // For is/is_not: multi-value list joined with "/", each value humanised the
    // way HA displays it (e.g. `heat_cool` → "Heat/cool") so the summary matches
    // the editor's value dropdown. For numeric: a single threshold (states[0]),
    // left raw since it's a number, not a state key.
    const isNumeric = expr.kind !== "is" && expr.kind !== "is_not";
    const rhs = isNumeric
      ? (expr.states[0] ?? "")
      : expr.states.map((v) => stateValueLabel(ctx.hass, stateObj, expr.attribute, v)).join("/");
    // Humanise the attribute name so the summary matches the editor's "Where"
    // dropdown (e.g. `current_temperature` → "Current temperature") rather
    // than leaking the raw storage key.
    const lhs = expr.attribute
      ? `${name}.${stateAttributeLabel(ctx.hass, stateObj, expr.attribute)}`
      : name;
    const head = `${lhs} ${verb} ${rhs}`;
    if (expr.for && _hasStateDuration(expr.for)) {
      return `${head} ${localize(ctx.hass, "ui.for_prefix", "for")} ≥${_fmtStateDur(expr.for)}`;
    }
    return head;
  }
  if (expr.kind === "and" || expr.kind === "or") {
    const sep = ` ${stateOpLabel(ctx.hass, expr.kind)} `;
    return expr.items.map((it) => _wrapStateIfGroup(it, ctx)).join(sep);
  }
  if (expr.kind === "not") {
    // For an atom-as-item, no parens — "NOT a is on" reads cleanly. For a
    // group-as-item, keep parens so the scope of the NOT is unambiguous.
    return `${stateOpLabel(ctx.hass, "not")} ${_wrapStateIfGroup(expr.item, ctx)}`;
  }
  return "";
}

function _wrapStateIfGroup(expr: StateExpr, ctx: ConditionContext): string {
  if (expr.kind === "and" || expr.kind === "or") {
    return `(${_renderStateExpr(expr, ctx)})`;
  }
  return _renderStateExpr(expr, ctx);
}

function _hasStateDuration(d: { h: number; m: number; s: number }): boolean {
  return d.h > 0 || d.m > 0 || d.s > 0;
}

function _fmtStateDur(d: { h: number; m: number; s: number }): string {
  const parts: string[] = [];
  if (d.h) parts.push(`${d.h}h`);
  if (d.m) parts.push(`${d.m}m`);
  if (d.s) parts.push(`${d.s}s`);
  return parts.length ? parts.join(" ") : "0s";
}

export function summariseTimeOfDay(pred: TimeOfDayPredicate, ctx: ConditionContext): string {
  if (pred === null) return localize(ctx.hass, "ui.summary_any", "any");
  const list = Array.isArray(pred) ? pred : [pred];
  const customMap = ctx.periods?.custom ?? {};
  return list
    .map((item) => {
      if ("period" in item) {
        return periodLabel(ctx.hass, item.period, customMap);
      }
      return `${_fmtEndpoint(item.from, ctx)} → ${_fmtEndpoint(item.to, ctx)}`;
    })
    .join(", ");
}

function _fmtEndpoint(ep: TimeEndpoint, ctx: ConditionContext): string {
  if (ep.kind === "time") {
    return `${String(ep.hh).padStart(2, "0")}:${String(ep.mm).padStart(2, "0")}`;
  }
  const anchor = anchorLabel(ctx.hass, ep.anchor);
  let base = anchor;
  if (ep.offset_min !== 0) {
    const abs = Math.abs(ep.offset_min);
    const unit =
      abs % 60 === 0
        ? `${abs / 60}${localize(ctx.hass, "ui.unit_hour_abbr", "h")}`
        : `${abs}${localize(ctx.hass, "ui.unit_min_abbr", "m")}`;
    base = `${anchor}${ep.offset_min < 0 ? "-" : "+"}${unit}`;
  }
  if (ep.clamp) {
    const word =
      ep.clamp.dir === "not_before"
        ? localize(ctx.hass, "ui.clamp_not_before", "not before")
        : localize(ctx.hass, "ui.clamp_not_after", "not after");
    const t = `${String(ep.clamp.hh).padStart(2, "0")}:${String(ep.clamp.mm).padStart(2, "0")}`;
    base = `${base} (${word} ${t})`;
  }
  return base;
}

/**
 * Render-friendly name for an action. Prefers the user-supplied label from
 * the exposed-actions list; falls back to actionLabel (which itself falls
 * back to the snake-case → title-case form of the service id).
 */
function _actionDisplayName(action: ActionSpec, ctx: ActionContext): string {
  const exposed = ctx.exposedActions?.find((e) => e.id === action.service);
  if (exposed?.label?.trim()) return exposed.label;
  return actionLabel(ctx.hass, action.service);
}

/**
 * Pluralisation noun for the target count summary. Derived from the TARGET
 * entities' domain ("light" from "light.lounge"), not the service's domain —
 * an integration's service may act on another domain's entities (e.g.
 * `fado.fade_lights` targets `light.*`, so the noun is "light", not "fado").
 * Falls back to a generic noun when targets span multiple domains or carry no
 * domain prefix.
 */
function _targetNoun(action: ActionSpec, ctx: ActionContext): string {
  const domains = new Set<string>();
  for (const id of action.entity_ids) {
    const dot = id.indexOf(".");
    if (dot > 0) domains.add(id.slice(0, dot));
  }
  if (domains.size === 1) return [...domains][0];
  return localize(ctx.hass, "ui.target_noun", "target");
}

export function summariseAction(action: ActionSpec, ctx: ActionContext): string {
  const name = _actionDisplayName(action, ctx);
  const noun = _targetNoun(action, ctx);
  const n = action.entity_ids.length;
  let targets: string;
  if (n === 0) targets = localize(ctx.hass, "ui.no_targets", "(no targets)");
  else if (n === 1) targets = `1 ${noun}`;
  else targets = `${n} ${noun}s`;
  const params = Object.entries(action.params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(
      ([k, v]) => `${paramLabel(k, action.service, ctx.schemas)}: ${formatArgValue(ctx.hass, v)}`,
    )
    .join(", ");
  return params ? `${name}: ${targets}, ${params}` : `${name}: ${targets}`;
}
