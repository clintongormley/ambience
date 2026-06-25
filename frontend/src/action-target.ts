import { entitiesForScope } from "./entities-for-scope.js";
import { effectiveAreaId } from "./entity-registry.js";
import type { ActionSpec, ActionTargetValue, Scope } from "./types.js";

export type ActionTarget = ActionTargetValue;

const KEYS = ["entity_id", "device_id", "area_id", "label_id"] as const;

/** The action's target, normalizing legacy `entity_ids` and dropping empties. */
export function actionTarget(action: ActionSpec): ActionTarget {
  const raw: Record<string, unknown> =
    action.target && typeof action.target === "object"
      ? (action.target as Record<string, unknown>)
      : action.entity_ids?.length
        ? { entity_id: action.entity_ids }
        : {};
  const out: ActionTarget = {};
  for (const key of KEYS) {
    const v = raw[key];
    const ids = Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
    if (ids.length) out[key] = ids;
  }
  return out;
}

export function targetIsEmpty(t: ActionTarget): boolean {
  return KEYS.every((k) => !t[k]?.length);
}

type Reg = {
  entities?: Record<string, { entity_id: string; device_id?: string | null; labels?: string[] }>;
};

/** Client-side mirror of the backend resolver, for the count preview only.
 *  Advisory — the backend resolution is authoritative. */
export function resolveTargetInScope(
  hass: Reg & Parameters<typeof entitiesForScope>[0],
  scope: Scope,
  target: ActionTarget,
): string[] {
  if (targetIsEmpty(target)) return [];
  const scopeSet = new Set(entitiesForScope(hass, scope, []));
  const ent = new Set(target.entity_id ?? []);
  const dev = new Set(target.device_id ?? []);
  const area = new Set(target.area_id ?? []);
  const label = new Set(target.label_id ?? []);
  const out: string[] = [];
  for (const eid of scopeSet) {
    const e = hass.entities?.[eid];
    const matches =
      ent.has(eid) ||
      (e?.device_id ? dev.has(e.device_id) : false) ||
      (effectiveAreaId(hass as any, eid)
        ? area.has(effectiveAreaId(hass as any, eid) as string)
        : false) ||
      (e?.labels?.some((l) => label.has(l)) ?? false);
    if (matches) out.push(eid);
  }
  return out.sort();
}
