import { entitiesForScope } from "./entities-for-scope.js";
import { effectiveAreaId } from "./entity-registry.js";
import type { ActionTargetValue, Scope } from "./types.js";

export type ActionTarget = ActionTargetValue;

/** Minimal contract for actionTarget(): any object with an optional target and
 *  optional legacy entity_ids array. Both ActionSpec and TraceAction satisfy this. */
export type TargetCarrier = { target?: ActionTargetValue; entity_ids?: string[] };

const KEYS = ["entity_id", "device_id", "area_id", "label_id", "floor_id"] as const;

/** The action's target, normalizing legacy `entity_ids` and dropping empties. */
export function actionTarget(action: TargetCarrier): ActionTarget {
  const raw: Record<string, unknown> =
    action.target && typeof action.target === "object"
      ? (action.target as Record<string, unknown>)
      : action.entity_ids?.length
        ? { entity_id: action.entity_ids }
        : {};
  const out: ActionTarget = {};
  for (const key of KEYS) {
    const v = raw[key];
    // HA's ha-target-picker emits a single selection as a bare string and
    // multiple as an array; coerce scalars to a one-item array (mirrors the
    // backend action_target) so a single area/label/device pick isn't dropped.
    const ids =
      typeof v === "string"
        ? [v]
        : Array.isArray(v)
          ? v.filter((x): x is string => typeof x === "string")
          : [];
    if (ids.length) out[key] = ids;
  }
  return out;
}

export function targetIsEmpty(t: ActionTarget): boolean {
  return KEYS.every((k) => !t[k]?.length);
}

type Reg = {
  entities?: Record<string, { entity_id: string; device_id?: string | null; labels?: string[] }>;
  areas?: Record<string, { floor_id?: string | null }>;
};

/** Client-side mirror of the backend resolver, for the count preview only.
 *  Advisory — the backend resolution is authoritative. */
export function resolveTargetInScope(
  hass: Reg & Parameters<typeof entitiesForScope>[0],
  scope: Scope,
  target: ActionTarget,
): string[] {
  if (targetIsEmpty(target)) return [];
  // Direct entity_id: never scope-clipped (mirrors backend semantics).
  const direct = new Set(target.entity_id ?? []);
  const dev = new Set(target.device_id ?? []);
  const area = new Set(target.area_id ?? []);
  const label = new Set(target.label_id ?? []);
  const floor = new Set(target.floor_id ?? []);
  const result = new Set<string>(direct);
  if (dev.size || area.size || label.size || floor.size) {
    // Indirect selectors: intersect with the scene's scope. Note: at house scope
    // entitiesForScope excludes area-less / ambience-platform entities, so the
    // advisory count may differ slightly from the backend for those orphan entities.
    for (const eid of entitiesForScope(hass, scope, [])) {
      const e = hass.entities?.[eid];
      const effArea = effectiveAreaId(hass as any, eid);
      const entityFloor = effArea ? hass.areas?.[effArea]?.floor_id : undefined;
      const matches =
        (e?.device_id ? dev.has(e.device_id) : false) ||
        (effArea ? area.has(effArea) : false) ||
        (e?.labels?.some((l) => label.has(l)) ?? false) ||
        (entityFloor ? floor.has(entityFloor) : false);
      if (matches) result.add(eid);
    }
  }
  return [...result].sort();
}
