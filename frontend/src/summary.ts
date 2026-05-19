import { actionLabel, anchorLabel, periodLabel } from "./i18n.js";
import type {
  ActionInfo,
  ActionSpec,
  PeriodStoreView,
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

export function summariseMatcher(
  matcherName: string,
  predicate: unknown,
  ctx: MatcherContext,
): string {
  if (predicate == null) return "(any)";
  if (matcherName === "time_of_day") {
    return summariseTimeOfDay(predicate as TimeOfDayPredicate, ctx);
  }
  return String(predicate);
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
      return `${_fmtEndpoint(item.from, ctx)}→${_fmtEndpoint(item.to, ctx)}`;
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
  const params = Object.entries(action.params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${k} ${v}`)
    .join(", ");
  return params ? `${name}: ${targets}, ${params}` : `${name}: ${targets}`;
}
