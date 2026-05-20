import { actionLabel, anchorLabel, localize, periodLabel, weekdayLabel } from "./i18n.js";
import type {
  ActionInfo,
  ActionSpec,
  DayItem,
  DayPredicate,
  PeriodStoreView,
  Rule,
  TimeEndpoint,
  TimeOfDayPredicate,
} from "./types.js";

interface HassLike {
  localize?: (k: string) => string | undefined;
  [key: string]: unknown;
}

interface MatcherContext {
  hass?: HassLike;
  periods?: PeriodStoreView;
}

interface ActionContext {
  hass?: HassLike;
}

/**
 * Display name for a rule: explicit `name` first, then scene predicate as
 * a fallback, then a default placeholder.
 */
export function ruleDisplayName(rule: Rule, defaultPlaceholder = "New rule"): string {
  if (rule.name && rule.name.trim()) return rule.name;
  const scene = rule.when?.scene;
  if (typeof scene === "string" && scene.trim()) return scene;
  return defaultPlaceholder;
}

export function summariseMatcher(
  matcherName: string,
  predicate: unknown,
  ctx: MatcherContext,
): string {
  if (predicate == null) return "(any)";
  if (matcherName === "time_of_day") {
    return summariseTimeOfDay(predicate as TimeOfDayPredicate, ctx);
  }
  if (matcherName === "day") {
    return summariseDay(predicate as DayPredicate, ctx);
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
      return `${localize(ctx.hass, "day_summary.day_prefix", "day")} ${item.days.join(",")}`;
    case "date":
      return `${item.month}/${item.day}`;
    case "date_range":
      return `${item.from.month}/${item.from.day} → ${item.to.month}/${item.to.day}`;
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

export function summariseTimeOfDay(
  pred: TimeOfDayPredicate,
  ctx: MatcherContext,
): string {
  if (pred === null) return "any";
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
  const unit = abs % 60 === 0 ? `${abs / 60}h` : `${abs}m`;
  return `${anchor}${ep.offset_min < 0 ? "-" : "+"}${unit}`;
}

export function summariseAction(
  action: ActionSpec,
  info: ActionInfo | undefined,
  ctx: ActionContext,
): string {
  const name = actionLabel(ctx.hass, action.action);
  const noun = info?.domains?.[0] ?? "target";
  const n = action.entity_ids.length;
  let targets: string;
  if (n === 0) targets = "(no targets)";
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
