import { actionLabel, anchorLabel, periodLabel } from "./i18n.js";
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
    return summariseDay(predicate as DayPredicate);
  }
  return String(predicate);
}

const _WEEKDAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function summariseDay(pred: DayPredicate): string {
  if (pred === null) return "any";
  const include = pred.include ?? [];
  const exclude = pred.exclude ?? [];
  const inc = include.length === 0 ? "any day" : include.map(_fmtDayItem).join(", ");
  if (exclude.length === 0) return inc;
  return `${inc} (except ${exclude.map(_fmtDayItem).join(", ")})`;
}

function _fmtDayItem(item: DayItem): string {
  switch (item.kind) {
    case "weekday":
      return item.days.map((d) => _WEEKDAY_NAMES[d]).join("/");
    case "day_of_month":
      return `day ${item.days.join(",")}`;
    case "date":
      return `${item.month}/${item.day}`;
    case "date_range":
      return `${item.from.month}/${item.from.day} → ${item.to.month}/${item.to.day}`;
    case "last_day":
      return "last day";
    case "workday":
      return "workday";
    case "holiday":
      return "holiday";
    case "first_workday":
      return "first workday";
    case "last_workday":
      return "last workday";
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
