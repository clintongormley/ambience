import { actionTarget } from "./action-target.js";
import { type EntityAreaHass, entityNameWithArea } from "./entity-area.js";
import {
  actionLabel,
  anchorLabel,
  conditionLabel,
  exposedActionLabel,
  humanizeId,
  localize,
  luxLabel,
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
  LuxPredicate,
  LuxRangeStoreView,
  OccupancyPredicate,
  PeoplePredicate,
  PeriodStoreView,
  Scene,
  ScriptPredicate,
  ServiceSchema,
  StateAtom,
  StateExpr,
  StateGroup,
  StatePredicate,
  SunPredicate,
  TemplatePredicate,
  TimeEndpoint,
  TimeOfDayPredicate,
  UnavailablePredicate,
  WeatherGroup,
  WeatherPredicate,
} from "./types.js";
import type { HassWithStates } from "./views/entity-row.js";
import { forComparatorSymbol } from "./views/for-duration.js";

interface HassLike {
  localize?: (k: string) => string | undefined;
  [key: string]: unknown;
}

export interface ConditionContext {
  hass?: HassLike;
  periods?: PeriodStoreView;
  luxRanges?: LuxRangeStoreView;
  weatherGroups?: WeatherGroup[];
  priorities?: ReadonlyMap<string, number>;
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
  return humanizeId(fieldId);
}

/**
 * Display name for a scene: explicit `name`, or a default placeholder.
 *
 * When no explicit `defaultPlaceholder` is given, the localized "New scene"
 * default is used (resolved from `hass`, falling back to the English text).
 */
export function sceneDisplayName(
  scene: Scene,
  defaultPlaceholder?: string,
  hass?: HassLike,
): string {
  if (scene.name?.trim()) return scene.name;
  return defaultPlaceholder ?? localize(hass, "ui.new_scene_default", "New scene");
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
  if (conditionName === "occupancy") {
    return summariseOccupancy(predicate as OccupancyPredicate, ctx);
  }
  if (conditionName === "unavailable") {
    return summariseUnavailable(predicate as UnavailablePredicate, ctx);
  }
  if (conditionName === "lux") {
    return summariseLux(predicate as LuxPredicate, ctx);
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
  return typeof alias === "string" && alias ? alias : humanizeId(fieldId);
}

/** Display name for an entity from a domain-prefixed id, falling back to a
 *  humanised local id (`person.alice` → "Alice", `zone.gym` → "Gym") when no
 *  friendly_name is set. Deliberately NOT area-prefixed (unlike
 *  {@link _entityDisplayName}): its callers are people, zones, scripts and
 *  action targets — presence/identity subjects, not the area-scoped sensor
 *  clauses where disambiguation by area matters. */
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
      return `${head} ${localize(ctx.hass, "ui.for_prefix", "for")} ${forComparatorSymbol(pred.for_mode)}${_fmtStateDur(pred.for)}`;
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
    return `${head} ${localize(ctx.hass, "ui.for_prefix", "for")} ${forComparatorSymbol(pred.for_mode)}${_fmtStateDur(pred.for)}`;
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
    .map(
      (t) =>
        `${weatherAttrLabel(ctx.hass, t.attribute)} ${stateOpLabel(ctx.hass, t.op)} ${t.value}`,
    )
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

/** Display name for an entity in summary prose: its area-prefixed friendly name
 *  ("Area · Name"), with the prefix suppressed when the name already contains
 *  the area, and falling back to the raw entity_id. Ctx-first adapter over
 *  {@link entityNameWithArea}. Summary prose only — surfaces that must match a
 *  backend-baked name (e.g. trace-detail link matching) use the bare
 *  {@link entityName} instead. */
function _entityDisplayName(ctx: ConditionContext, entity_id: string): string {
  return entityNameWithArea(ctx.hass as unknown as EntityAreaHass | undefined, entity_id);
}

/**
 * "<Sensor> is detected/clear" for one sensor, or
 * "any of (A, B) detected" / "all of (A, B) clear" for several, with an
 * optional "for ≥20m" / "for <20m" suffix (the comparator follows
 * `for_mode`). Sensor names use friendly_name when set.
 */
export function summariseOccupancy(pred: OccupancyPredicate, ctx: ConditionContext = {}): string {
  if (pred == null || !pred.sensors?.length) return localize(ctx.hass, "ui.summary_any", "any");
  const names = pred.sensors.map((id) => _entityDisplayName(ctx, id));
  const verb =
    pred.occupied === false
      ? localize(ctx.hass, "occupancy_summary.clear", "clear")
      : localize(ctx.hass, "occupancy_summary.detected", "detected");
  // `negate` wraps the whole predicate; phrase it like the state condition's
  // inline negation ("Lounge is not clear for ≥20m"), not a flipped polarity.
  const not = pred.negate ? `${localize(ctx.hass, "occupancy_summary.not", "not")} ` : "";
  let head: string;
  if (names.length === 1) {
    head = `${names[0]} is ${not}${verb}`;
  } else {
    const q =
      pred.quant === "all"
        ? localize(ctx.hass, "occupancy_summary.all_of", "all of")
        : localize(ctx.hass, "occupancy_summary.any_of", "any of");
    head = `${q} (${names.join(", ")}) ${not}${verb}`;
  }
  if (pred.for && _hasStateDuration(pred.for)) {
    return `${head} ${localize(ctx.hass, "ui.for_prefix", "for")} ${forComparatorSymbol(pred.for_mode)}${_fmtStateDur(pred.for)}`;
  }
  return head;
}

/** Is this condition stored in its negated form? In a blocker, negated
 *  conditions are RELEASES ("until <positive>") and non-negated ones are
 *  GUARDS ("while <as-is>"). De-negation (see `deNegateCondition`) just drops
 *  the negation flag, which only yields the correct complement when the negation
 *  wraps the WHOLE match. That holds for occupancy (`kleene_not` outside the
 *  quantifier). It does NOT hold for people, where `negate` is applied
 *  per-person INSIDE the quantifier — complementing a multi-person
 *  `everyone`/`any` predicate needs a de Morgan quantifier swap, not a flag
 *  drop. So only a SINGLE-person negated people predicate is a release (the
 *  quantifier is moot with one person); multi-person / all-persons stay guards,
 *  where `summarisePeople` renders the negated form truthfully. `state` is not
 *  handled here — its richer boolean shape is split by `_holdStateParts`. */
function isReleaseCondition(name: string, predicate: unknown): boolean {
  if (predicate == null || typeof predicate !== "object") return false;
  if (name === "occupancy") {
    return Boolean((predicate as { negate?: unknown }).negate);
  }
  if (name === "people") {
    const p = predicate as { negate?: unknown; who?: unknown };
    return Boolean(p.negate) && Array.isArray(p.who) && p.who.length === 1;
  }
  return false;
}

/** The positive form of an occupancy/people release condition (only called when
 *  isReleaseCondition is true): drop the `negate` flag. `state` releases are
 *  de-negated separately by `_asStateRelease`. */
function deNegateCondition(predicate: unknown): unknown {
  return { ...(predicate as object), negate: false };
}

/** Collapse a degenerate single-child `and`/`or` group to its sole item,
 *  recursively. An `AND`/`OR` of one element *is* that element, so this is a
 *  pure simplification — it lets a redundant editor wrapper (e.g. the
 *  `AND[ NOT(AND[…]) ]` the UI produces when negating the root group) classify
 *  by its meaningful core. */
function _collapseSingleChild(expr: StateExpr): StateExpr {
  if (expr.kind === "and" || expr.kind === "or") {
    const items = expr.items.map(_collapseSingleChild);
    return items.length === 1 ? items[0] : { ...expr, items };
  }
  if (expr.kind === "not") {
    return { ...expr, item: _collapseSingleChild(expr.item) };
  }
  return expr;
}

/** If this expression has a clean positive complement, return that complement
 *  (its "until" release form); otherwise null. The shapes that decompose to a
 *  positive release are: a non-durational `is_not` atom (flipped back to `is`);
 *  a `not` wrapping an atom or a group (the inner expression is the release —
 *  ¬(A∧B) releases when A∧B, ¬(A∨B) when A∨B); and an all-negated `or` (de
 *  Morgan: ¬A ∨ ¬B = ¬(A∧B), returning a synthetic `and` of the de-negated
 *  disjuncts). A double negation (a `not`/`is_not` directly inside the `not`),
 *  a mixed or all-positive `or`, and a durational `is_not` all return null and
 *  stay guards. Returning null only means "not a clean release"; the caller
 *  (`_holdStateParts`) then renders the node as a guard.
 *
 *  Duration asymmetry: a `not` wrapping an `is X for D` carries `D` through
 *  correctly — the engine gates `for` on the positive `is`, so the release is
 *  genuinely "X for D". But an `is_not X for D` atom gates `for` on the NEGATED
 *  test (`not (X in states)`, see conditions/state.py `_atom_instant` /
 *  `_eval_atom`): it holds while "(not X) has lasted D" and releases the instant
 *  X returns, so the dwell does NOT transfer to "until X for D". Rather than drop
 *  the user's `D` silently and overstate the release, a durational `is_not` atom
 *  returns null and stays a truthful guard; only a bare `is_not` (clean
 *  instantaneous complement) becomes a release. */
function _asStateRelease(expr: StateExpr): StateExpr | null {
  if (expr.kind === "is_not") {
    if (expr.for && _hasStateDuration(expr.for)) return null;
    return { ...(expr as StateAtom), kind: "is" };
  }
  if (expr.kind === "not") {
    // not(atom) → the atom; not(group) → the inner group. The complement of a
    // negated group is a single positive release: ¬(A∧B) ⇒ until (A∧B),
    // ¬(A∨B) ⇒ until (A∨B).
    const k = expr.item.kind;
    if (k === "is" || k === ">" || k === ">=" || k === "<" || k === "<=") return expr.item;
    if (k === "and" || k === "or") return expr.item;
    return null;
  }
  if (expr.kind === "or") {
    // All-negated OR ⇒ a single AND release (de Morgan): ¬A ∨ ¬B = ¬(A ∧ B), so
    // the block releases when A AND B both hold. Only when EVERY disjunct is a
    // clean release — a durational `is_not` disjunct fails this, keeping the OR a
    // guard (its dwell would not transfer to a positive "until").
    const inner: StateExpr[] = [];
    for (const it of expr.items) {
      const rel = _asStateRelease(it);
      if (!rel) return null;
      inner.push(rel);
    }
    return inner.length === 1 ? inner[0] : { kind: "and" as const, items: inner };
  }
  return null;
}

/** A release expression rendered for embedding after "until": a compound
 *  (multi-item) `and`/`or` group is parenthesised so the "OR until …" boundary is
 *  unambiguous; a single atom (or 1-item group) renders bare. */
function _renderReleaseGroup(expr: StateExpr, ctx: ConditionContext): string {
  const body = _blockerConditionText("state", expr, ctx);
  if ((expr.kind === "and" || expr.kind === "or") && expr.items.length > 1) {
    return `(${body})`;
  }
  return body;
}

/** Render an `or` group as blocker hold-prose:
 *  "<positives joined OR> OR until <releases joined AND>". Negated disjuncts are
 *  de-negated (via `_asStateRelease`) and collapsed under one "until" (de Morgan);
 *  positive disjuncts render as-is. `paren` wraps the whole term when it is
 *  embedded beside sibling terms and has more than one part.
 *
 *  Precondition: `expr` is an OR group. Every caller guards `kind === "or"`
 *  first; the param can't be tightened to `{ kind: "or" }` because narrowing
 *  `StateExpr` by `kind === "or"` yields `StateGroup` (whose `kind` stays
 *  "and" | "or"), so passing an `and` group would render its items joined by
 *  OR — don't. */
function _renderDisjHold(expr: StateGroup, ctx: ConditionContext, paren: boolean): string {
  const positives: StateExpr[] = [];
  const releaseExprs: StateExpr[] = [];
  for (const it of expr.items) {
    const rel = _asStateRelease(it);
    if (rel) releaseExprs.push(rel);
    else positives.push(it);
  }
  const orSep = ` ${stateOpLabel(ctx.hass, "or")} `;
  const posStr = positives.map((p) => _wrapHoldIfGroup(p, ctx)).join(orSep);
  let untilStr = "";
  if (releaseExprs.length) {
    const relExpr: StateExpr =
      releaseExprs.length === 1 ? releaseExprs[0] : { kind: "and" as const, items: releaseExprs };
    untilStr = `${localize(ctx.hass, "blocker_summary.until", "until")} ${_renderReleaseGroup(relExpr, ctx)}`;
  }
  const joined = [posStr, untilStr].filter((s) => s !== "").join(orSep);
  const termCount = positives.length + (releaseExprs.length ? 1 : 0);
  return paren && termCount > 1 ? `(${joined})` : joined;
}

/** Blocker-mode mirror of `_renderStateExpr`: identical to the raw renderer
 *  except an `or` group is rendered with while/until prose via `_renderDisjHold`
 *  (a negated disjunct reads "until <positive>"). Used to render blocker guards so
 *  a nested OR inside a guard reads naturally. */
function _renderHoldTerm(expr: StateExpr, ctx: ConditionContext): string {
  if (
    expr.kind === "is" ||
    expr.kind === "is_not" ||
    expr.kind === ">" ||
    expr.kind === ">=" ||
    expr.kind === "<" ||
    expr.kind === "<="
  ) {
    return _renderAtomClause(expr, ctx, false);
  }
  if (expr.kind === "and") {
    const sep = ` ${stateOpLabel(ctx.hass, "and")} `;
    return expr.items.map((it) => _wrapHoldIfGroup(it, ctx)).join(sep);
  }
  if (expr.kind === "or") {
    return _renderDisjHold(expr, ctx, false);
  }
  // not(...)
  if (expr.kind === "not") {
    const item = expr.item;
    if (item.kind === "is") {
      return _renderAtomClause(item, ctx, true);
    }
    return `${stateOpLabel(ctx.hass, "not")} ${_wrapHoldIfGroup(item, ctx)}`;
  }
  return "";
}

/** Parenthesise a nested group for hold-prose: an `or` defers to `_renderDisjHold`
 *  (which decides its own parens), an `and` is wrapped, atoms render bare. */
function _wrapHoldIfGroup(expr: StateExpr, ctx: ConditionContext): string {
  if (expr.kind === "or") return _renderDisjHold(expr, ctx, true);
  if (expr.kind === "and") return `(${_renderHoldTerm(expr, ctx)})`;
  return _renderHoldTerm(expr, ctx);
}

/** Split a blocker's `state` predicate into rendered guard strings (held "while
 *  …") and release strings (de-negated, "until …"), recursing into OR groups so a
 *  disjunction reads "while <positives> OR until <releases>". A flat top-level AND
 *  is decomposed atom-by-atom; a mixed/all-positive OR renders as one
 *  self-contained guard string; a bare negation or
 *  all-negated OR is a whole-predicate release. */
function _holdStateParts(
  pred: StateExpr,
  ctx: ConditionContext,
  sole: boolean,
): { guards: string[]; releases: string[] } {
  const expr = _collapseSingleChild(pred);
  if (expr.kind === "and") {
    const guardItems: StateExpr[] = [];
    const releaseExprs: StateExpr[] = [];
    for (const it of expr.items) {
      const rel = _asStateRelease(it);
      if (rel) releaseExprs.push(rel);
      else guardItems.push(it);
    }
    let guards: string[] = [];
    if (guardItems.length > 0) {
      const guardItem: StateExpr =
        guardItems.length === 1 ? guardItems[0] : { kind: "and", items: guardItems };
      // A lone OR guard must be parenthesised when it sits beside other
      // conditions (sole=false), so "While (A OR B) and Daytime, …" can't be
      // misread — the same !sole rule the top-level OR branch uses. A re-grouped
      // multi-item AND guard renders its OR children parenthesised already (via
      // _wrapHoldIfGroup), so only the single-OR case needs this.
      guards = [
        guardItem.kind === "or"
          ? _renderDisjHold(guardItem, ctx, !sole)
          : _renderHoldTerm(guardItem, ctx),
      ];
    }
    const releases = releaseExprs.map((r) => _blockerConditionText("state", r, ctx));
    return { guards, releases };
  }
  if (expr.kind === "or") {
    const rel = _asStateRelease(expr);
    if (rel) return { guards: [], releases: [_blockerConditionText("state", rel, ctx)] };
    return { guards: [_renderDisjHold(expr, ctx, !sole)], releases: [] };
  }
  const rel = _asStateRelease(expr);
  if (rel) return { guards: [], releases: [_blockerConditionText("state", rel, ctx)] };
  return { guards: [_renderHoldTerm(expr, ctx)], releases: [] };
}

// Condition types whose summary already names a concrete entity (occupancy,
// people, state, lux, unavailable, script) or reads as a recognizable word
// (day → "Mon/Tue", time_of_day → "Daytime", weather → "Rainy"). These render
// bare in the blocker sentence. Every OTHER type — notably `sun`, whose body is
// abstract geometry like "N/NE", plus any future/opaque type — gets a "<Type>:"
// prefix so the value makes sense in prose. Defaulting the unknown case to
// labelled means a new opaque condition can never render as an orphan value.
const _BLOCKER_BARE_CONDITIONS = new Set([
  "occupancy",
  "people",
  "state",
  "lux",
  "unavailable",
  "script",
  "template",
  "day",
  "time_of_day",
  "weather",
]);

/** One condition's text for the blocker sentence: the bare body for a
 *  self-describing type, else "<Type>: <body>" so an abstract value (e.g. the
 *  sun's "N/NE") is legible. */
function _blockerConditionText(name: string, predicate: unknown, ctx: ConditionContext): string {
  const body = summariseCondition(name, predicate, ctx);
  if (_BLOCKER_BARE_CONDITIONS.has(name)) return body;
  return `${conditionLabel(ctx.hass, name)}: ${body}`;
}

/**
 * Positive "Block until <releases> while <guards>" summary for a zero-action
 * scene (a pure blocker). A blocker matches the COMPLEMENT of the world it is
 * waiting for, so its negated conditions are RELEASES (de-negated, joined by
 * "or" — the hold ends when any fires) and its non-negated conditions are
 * GUARDS (rendered as-is, joined by "and" — the hold applies while all hold).
 * Callers gate on `scene.actions.length === 0`.
 */
export function summariseBlocker(scene: Scene, ctx: ConditionContext = {}): string {
  const block = localize(ctx.hass, "blocker_summary.block", "Block");
  let keys = Object.keys(scene.when).filter((k) => scene.when[k] != null);
  if (ctx.priorities) {
    const p = ctx.priorities;
    keys = keys.sort((a, b) => {
      const pa = p.get(a);
      const pb = p.get(b);
      // Both unknown → equal, so the stable sort keeps insertion order (never
      // `-Infinity - -Infinity = NaN`, which is an inconsistent comparator).
      if (pa === undefined && pb === undefined) return 0;
      return (pb ?? -Infinity) - (pa ?? -Infinity);
    });
  }
  const releases: string[] = [];
  const guards: string[] = [];
  for (const k of keys) {
    const pred = scene.when[k];
    // pred is already non-null — filtered above
    if (k === "state") {
      // `state` carries a boolean expression, so it can contribute BOTH guards
      // and releases. An OR predicate renders as one self-contained guard string;
      // `sole` (state is the only condition) drops its outer parens.
      const parts = _holdStateParts(pred as StateExpr, ctx, keys.length === 1);
      guards.push(...parts.guards);
      releases.push(...parts.releases);
      continue;
    }
    if (isReleaseCondition(k, pred)) {
      releases.push(_blockerConditionText(k, deNegateCondition(pred), ctx));
    } else {
      guards.push(_blockerConditionText(k, pred, ctx));
    }
  }

  const until = localize(ctx.hass, "blocker_summary.until", "until");
  const or = ` ${localize(ctx.hass, "blocker_summary.or", "or")} `;
  const and = ` ${localize(ctx.hass, "blocker_summary.and", "and")} `;
  const releaseStr = releases.join(or);
  const guardStr = guards.join(and);

  // Lead with the guard/context when there is BOTH a guard and a release:
  // "While <guards>, block until <releases>" reads more naturally than
  // "Block until <releases> while <guards>" — the guard sets the context, then
  // the hold. The guard-only and release-only forms keep "Block …" first:
  // "While <guard>, block" reads truncated with no "until" to follow, and a
  // release-only block has no guard to lead with.
  if (releases.length && guards.length) {
    const whileLead = localize(ctx.hass, "blocker_summary.while_lead", "While");
    const blockMid = localize(ctx.hass, "blocker_summary.block_mid", "block");
    return `${whileLead} ${guardStr}, ${blockMid} ${until} ${releaseStr}`;
  }
  if (releases.length) {
    return `${block} ${until} ${releaseStr}`;
  }
  if (guards.length) {
    const whileWord = localize(ctx.hass, "blocker_summary.while", "while");
    return `${block} ${whileWord} ${guardStr}`;
  }
  return `${block} ${localize(ctx.hass, "blocker_summary.always", "always")}`;
}

/**
 * "<Entity> unavailable" for one entity, or "any of (A, B) unavailable" for
 * several — matching the condition's "any of these is down" semantics. Names use
 * friendly_name when set, else the raw entity_id.
 */
export function summariseUnavailable(
  pred: UnavailablePredicate,
  ctx: ConditionContext = {},
): string {
  if (pred == null || !pred.entities?.length) return localize(ctx.hass, "ui.summary_any", "any");
  const names = pred.entities.map((id) => _entityDisplayName(ctx, id));
  const word = localize(ctx.hass, "unavailable_summary.unavailable", "unavailable");
  if (names.length === 1) {
    return `${names[0]} ${word}`;
  }
  const anyOf = localize(ctx.hass, "unavailable_summary.any_of", "any of");
  return `${anyOf} (${names.join(", ")}) ${word}`;
}

/** Render an inline lux band: "<10 lx", "≥1000 lx", "50–300 lx". `empty` is the
 *  label when neither bound is set. */
export function fmtLuxBand(
  min: number | null | undefined,
  max: number | null | undefined,
  empty = "any lux",
): string {
  if (min != null && max != null) return `${min}–${max} lx`;
  if (max != null) return `<${max} lx`;
  if (min != null) return `≥${min} lx`;
  return empty;
}

/**
 * "<Sensor> dark" / "<Sensor> 50–300 lx" for one sensor, or
 * "any of (A, B) bright" for several. Named ranges resolve via luxLabel.
 */
export function summariseLux(pred: LuxPredicate, ctx: ConditionContext = {}): string {
  if (pred == null || !pred.sensors?.length) return localize(ctx.hass, "ui.summary_any", "any");
  const names = pred.sensors.map((id) => _entityDisplayName(ctx, id));
  const band =
    pred.range != null
      ? luxLabel(ctx.hass, pred.range, ctx.luxRanges?.custom ?? {})
      : fmtLuxBand(pred.min, pred.max);
  if (names.length === 1) {
    return `${names[0]} ${band}`;
  }
  const q =
    pred.quant === "all"
      ? localize(ctx.hass, "lux_summary.all_of", "all of")
      : localize(ctx.hass, "lux_summary.any_of", "any of");
  return `${q} (${names.join(", ")}) ${band}`;
}

export function summariseState(pred: StatePredicate, ctx: ConditionContext = {}): string {
  if (pred == null) return localize(ctx.hass, "ui.summary_any", "any");
  return _renderStateExpr(pred, ctx);
}

/** One atom clause: `<entity[.attr]> <verb> [NOT ]<value> [for ≥…|<…]`. When
 *  `negate` is set the NOT sits inline before the value ("a is NOT on"), which
 *  reads more naturally than a leading "NOT a is on" for a simple `is` clause. */
function _renderAtomClause(expr: StateAtom, ctx: ConditionContext, negate: boolean): string {
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
  // dropdown (e.g. `current_temperature` → "Current temperature") rather than
  // leaking the raw storage key.
  const lhs = expr.attribute
    ? `${name}.${stateAttributeLabel(ctx.hass, stateObj, expr.attribute)}`
    : name;
  const not = negate ? `${stateOpLabel(ctx.hass, "not")} ` : "";
  const head = `${lhs} ${verb} ${not}${rhs}`;
  if (expr.for && _hasStateDuration(expr.for)) {
    return `${head} ${localize(ctx.hass, "ui.for_prefix", "for")} ${forComparatorSymbol(expr.for_mode)}${_fmtStateDur(expr.for)}`;
  }
  return head;
}

// Raw state-expression renderer (used by `summariseState`, the non-blocker path).
// `_renderHoldTerm` is the blocker-mode twin: it must stay in sync with this for
// every non-`or` node, so changes to the atom/`and`/`not` arms below belong in
// both functions.
function _renderStateExpr(expr: StateExpr, ctx: ConditionContext): string {
  if (
    expr.kind === "is" ||
    expr.kind === "is_not" ||
    expr.kind === ">" ||
    expr.kind === ">=" ||
    expr.kind === "<" ||
    expr.kind === "<="
  ) {
    return _renderAtomClause(expr, ctx, false);
  }
  if (expr.kind === "and" || expr.kind === "or") {
    const sep = ` ${stateOpLabel(ctx.hass, expr.kind)} `;
    return expr.items.map((it) => _wrapStateIfGroup(it, ctx)).join(sep);
  }
  if (expr.kind === "not") {
    // Inline the negation for a simple `is` clause — "a is NOT on" reads more
    // naturally than "NOT a is on". Other shapes keep the leading "NOT …":
    // numeric ("NOT a ≥ 20" beats "a ≥ NOT 20"), is_not (avoids a double
    // negative), and groups (parens keep the NOT's scope unambiguous).
    const item = expr.item;
    if (item.kind === "is") {
      return _renderAtomClause(item, ctx, true);
    }
    return `${stateOpLabel(ctx.hass, "not")} ${_wrapStateIfGroup(item, ctx)}`;
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
  return exposedActionLabel(
    action.service,
    ctx.exposedActions,
    () => ctx.schemas?.[action.service]?.name?.trim() || actionLabel(ctx.hass, action.service),
  );
}

/**
 * Pluralisation noun for the target count summary. Derived from the TARGET
 * entities' domain ("light" from "light.lounge"), not the service's domain —
 * an integration's service may act on another domain's entities (e.g.
 * `fado.fade_lights` targets `light.*`, so the noun is "light", not "fado").
 * Falls back to a generic noun when targets span multiple domains or carry no
 * domain prefix.
 */
function _targetNoun(entityIds: string[], ctx: ActionContext): string {
  const domains = new Set<string>();
  for (const id of entityIds) {
    const dot = id.indexOf(".");
    if (dot > 0) domains.add(id.slice(0, dot));
  }
  if (domains.size === 1) return [...domains][0];
  return localize(ctx.hass, "ui.target_noun", "target");
}

/** Look up an area name from hass.areas, falling back to the raw id. */
function _areaName(hass: { [key: string]: unknown } | undefined, areaId: string): string {
  const areas = hass?.areas as Record<string, { name?: string | null }> | undefined;
  return areas?.[areaId]?.name ?? areaId;
}

/** Look up a label name from hass.labels, falling back to the raw id. */
function _labelName(hass: { [key: string]: unknown } | undefined, labelId: string): string {
  const labels = hass?.labels as Record<string, { name?: string | null }> | undefined;
  return labels?.[labelId]?.name ?? labelId;
}

/** Look up a device name from hass.devices, falling back to the raw id. */
function _deviceName(hass: { [key: string]: unknown } | undefined, deviceId: string): string {
  const devices = hass?.devices as Record<string, { name?: string | null }> | undefined;
  return devices?.[deviceId]?.name ?? deviceId;
}

export function summariseAction(action: ActionSpec, ctx: ActionContext): string {
  const name = _actionDisplayName(action, ctx);
  const target = actionTarget(action);
  const entityIds = target.entity_id ?? [];
  const areaIds = target.area_id ?? [];
  const labelIds = target.label_id ?? [];
  const deviceIds = target.device_id ?? [];
  const hasAny =
    entityIds.length > 0 || areaIds.length > 0 || labelIds.length > 0 || deviceIds.length > 0;

  let targets: string;
  if (!hasAny) {
    targets = localize(ctx.hass, "ui.no_targets", "(no targets)");
  } else {
    const parts: string[] = [];
    if (entityIds.length > 0) {
      const noun = _targetNoun(entityIds, ctx);
      if (entityIds.length === 1) parts.push(`1 ${noun}`);
      else parts.push(`${entityIds.length} ${noun}s`);
    }
    const hass = ctx.hass as { [key: string]: unknown } | undefined;
    for (const id of areaIds) {
      parts.push(`${_areaName(hass, id)} ${localize(ctx.hass, "ui.target_type_area", "(area)")}`);
    }
    for (const id of labelIds) {
      parts.push(
        `${_labelName(hass, id)} ${localize(ctx.hass, "ui.target_type_label", "(label)")}`,
      );
    }
    for (const id of deviceIds) {
      parts.push(
        `${_deviceName(hass, id)} ${localize(ctx.hass, "ui.target_type_device", "(device)")}`,
      );
    }
    targets = parts.join(", ");
  }
  const params = Object.entries(action.params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(
      ([k, v]) => `${paramLabel(k, action.service, ctx.schemas)}: ${formatArgValue(ctx.hass, v)}`,
    )
    .join(", ");
  return params ? `${name}: ${targets}, ${params}` : `${name}: ${targets}`;
}
