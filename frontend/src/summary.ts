import {
  actionLabel,
  anchorLabel,
  localize,
  monthLabel,
  periodLabel,
  stateOpLabel,
  weatherAttrLabel,
  weekdayLabel,
} from "./i18n.js";
import type {
  ActionInfo,
  ActionSpec,
  DayItem,
  DayPredicate,
  PeriodStoreView,
  Rule,
  StateExpr,
  StatePredicate,
  TimeEndpoint,
  TimeOfDayPredicate,
  WeatherGroup,
  WeatherPredicate,
} from "./types.js";

interface HassLike {
  localize?: (k: string) => string | undefined;
  [key: string]: unknown;
}

interface MatcherContext {
  hass?: HassLike;
  periods?: PeriodStoreView;
  weatherGroups?: WeatherGroup[];
}

interface ActionContext {
  hass?: HassLike;
}

/**
 * Display name for a rule: explicit `name`, or a default placeholder.
 */
export function ruleDisplayName(rule: Rule, defaultPlaceholder = "New rule"): string {
  if (rule.name && rule.name.trim()) return rule.name;
  return defaultPlaceholder;
}

export function summariseMatcher(
  matcherName: string,
  predicate: unknown,
  ctx: MatcherContext,
): string {
  if (predicate == null) return localize(ctx.hass, "ui.summary_any_paren", "(any)");
  if (matcherName === "time_of_day") {
    return summariseTimeOfDay(predicate as TimeOfDayPredicate, ctx);
  }
  if (matcherName === "day") {
    return summariseDay(predicate as DayPredicate, ctx);
  }
  if (matcherName === "weather") {
    return summariseWeather(predicate as WeatherPredicate, ctx);
  }
  if (matcherName === "state") {
    return summariseState(predicate as StatePredicate, ctx);
  }
  return String(predicate);
}

export function summariseDay(pred: DayPredicate, ctx: MatcherContext = {}): string {
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

function _fmtDayItem(item: DayItem, ctx: MatcherContext): string {
  switch (item.kind) {
    case "weekday":
      return item.days.map((d) => weekdayLabel(ctx.hass, d)).join("/");
    case "day_of_month":
      return `${localize(ctx.hass, "day_summary.day_prefix", "day")} ${item.days}`;
    case "date":
      return `${monthLabel(ctx.hass, item.month)} ${item.day}`;
    case "date_range":
      return `${monthLabel(ctx.hass, item.from.month)} ${item.from.day} → ${monthLabel(ctx.hass, item.to.month)} ${item.to.day}`;
    case "last_day":
      return localize(ctx.hass, "day_summary.last_day", "last day");
    case "workday":
      return localize(ctx.hass, "day_summary.workday", "workday");
    case "holiday":
      return localize(ctx.hass, "day_summary.holiday", "holiday");
    case "first_workday":
      return localize(ctx.hass, "day_summary.first_workday", "first workday");
    case "last_workday":
      return localize(ctx.hass, "day_summary.last_workday", "last workday");
  }
}

const _OP_LABEL: Record<string, string> = { "<": "<", "<=": "≤", ">": ">", ">=": "≥" };

/** Fallback display for a group id that no longer matches any configured
 *  group — split on `_`/`-`/whitespace and title-case each word. */
function _humaniseGroupId(id: string): string {
  return id
    .split(/[\s_-]+/)
    .filter((w) => w !== "")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export function summariseWeather(pred: WeatherPredicate, ctx: MatcherContext = {}): string {
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

/** Best-effort display name for an entity: friendly_name attribute when set,
 *  otherwise the raw entity_id. */
function _entityDisplayName(ctx: MatcherContext, entity_id: string): string {
  const states = (ctx.hass as { states?: Record<string, { attributes?: Record<string, unknown> }> } | undefined)?.states;
  const name = states?.[entity_id]?.attributes?.friendly_name;
  return typeof name === "string" && name ? name : entity_id;
}

export function summariseState(pred: StatePredicate, ctx: MatcherContext = {}): string {
  if (pred == null) return localize(ctx.hass, "ui.summary_any", "any");
  return _renderStateExpr(pred, ctx);
}

function _renderStateExpr(expr: StateExpr, ctx: MatcherContext): string {
  if (
    expr.kind === "is" || expr.kind === "is_not"
    || expr.kind === ">" || expr.kind === ">="
    || expr.kind === "<" || expr.kind === "<="
  ) {
    const verb = stateOpLabel(ctx.hass, expr.kind);
    // For is/is_not: multi-value list joined with "/". For numeric: a single
    // threshold value (states[0]).
    const isNumeric = expr.kind !== "is" && expr.kind !== "is_not";
    const rhs = isNumeric ? (expr.states[0] ?? "") : expr.states.join("/");
    // Use the entity's friendly_name when available (falls back to the
    // raw entity_id). Attribute-mode renders as `<name>.<attribute>`.
    const name = _entityDisplayName(ctx, expr.entity_id);
    const lhs = expr.attribute ? `${name}.${expr.attribute}` : name;
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

function _wrapStateIfGroup(expr: StateExpr, ctx: MatcherContext): string {
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

export function summariseTimeOfDay(
  pred: TimeOfDayPredicate,
  ctx: MatcherContext,
): string {
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

function _fmtEndpoint(ep: TimeEndpoint, ctx: MatcherContext): string {
  if (ep.kind === "time") {
    return `${String(ep.hh).padStart(2, "0")}:${String(ep.mm).padStart(2, "0")}`;
  }
  const anchor = anchorLabel(ctx.hass, ep.anchor);
  if (ep.offset_min === 0) return anchor;
  const abs = Math.abs(ep.offset_min);
  const unit = abs % 60 === 0
    ? `${abs / 60}${localize(ctx.hass, "ui.unit_hour_abbr", "h")}`
    : `${abs}${localize(ctx.hass, "ui.unit_min_abbr", "m")}`;
  return `${anchor}${ep.offset_min < 0 ? "-" : "+"}${unit}`;
}

export function summariseAction(
  action: ActionSpec,
  info: ActionInfo | undefined,
  ctx: ActionContext,
): string {
  const name = actionLabel(ctx.hass, action.action);
  const noun = info?.domains?.[0] ?? localize(ctx.hass, "ui.target_noun", "target");
  const n = action.entity_ids.length;
  let targets: string;
  if (n === 0) targets = localize(ctx.hass, "ui.no_targets", "(no targets)");
  else if (n === 1) targets = `1 ${noun}`;
  else targets = `${n} ${noun}s`;
  const unitFor: Record<string, string> = {};
  for (const p of info?.target_params ?? []) {
    if (p.unit) unitFor[p.name] = p.unit;
  }
  const params = Object.entries(action.params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${k} ${v}${unitFor[k] ?? ""}`)
    .join(", ");
  return params ? `${name}: ${targets}, ${params}` : `${name}: ${targets}`;
}
