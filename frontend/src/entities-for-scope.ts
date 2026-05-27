import type { HassConnection } from "./api.js";
import type { Scope } from "./types.js";

/**
 * Returns entity_ids in the given scope that match one of the given domains.
 *
 * Scope semantics:
 *   - area: entity directly or via its device has area_id === scope.id.
 *   - floor: entity belongs to any area whose floor_id === scope.id.
 *   - house: entity belongs to any area (directly or via device). Orphan
 *     entities (no area, no device area) are excluded.
 *
 * Returned list is sorted for stable rendering.
 */
export function entitiesForScope(
  hass: HassConnection,
  scope: Scope,
  domains: readonly string[],
): string[] {
  const anyHass = hass as any;
  if (!anyHass?.entities) return [];

  const entities = anyHass.entities as Record<string, {
    entity_id: string;
    area_id?: string | null;
    device_id?: string | null;
  }>;
  const devices = (anyHass.devices ?? {}) as Record<string, {
    id: string;
    area_id?: string | null;
  }>;
  const areas = (anyHass.areas ?? {}) as Record<string, {
    area_id: string;
    floor_id?: string | null;
  }>;

  // Resolve scope to a predicate over an entity's effective area_id (own or via device).
  const targetAreaIds: Set<string> | null =
    scope.kind === "area"
      ? new Set([scope.id])
      : scope.kind === "floor"
      ? new Set(
          Object.values(areas)
            .filter((a) => a.floor_id === scope.id)
            .map((a) => a.area_id),
        )
      : null; // house: any non-empty effective area

  const inScope = (e: { area_id?: string | null; device_id?: string | null }): boolean => {
    const effAreaId =
      e.area_id ?? (e.device_id ? devices[e.device_id]?.area_id ?? null : null);
    if (effAreaId == null) return false;
    if (targetAreaIds === null) return true; // house
    return targetAreaIds.has(effAreaId);
  };

  return Object.values(entities)
    .filter(inScope)
    .filter((e) => domains.includes(e.entity_id.split(".")[0]!))
    .map((e) => e.entity_id)
    .sort();
}
