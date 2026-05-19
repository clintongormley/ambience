import type { HassConnection } from "./api.js";

/**
 * Returns entity_ids in the given area that match one of the given domains.
 *
 * "In the area" means either:
 *   - the entity has `area_id === areaId` directly, OR
 *   - the entity's device has `area_id === areaId`.
 *
 * Returned list is sorted for stable rendering.
 *
 * Returns empty when areaId is undefined or hass.entities is unavailable.
 */
export function entitiesInArea(
  hass: HassConnection,
  areaId: string | undefined,
  domains: readonly string[],
): string[] {
  if (!hass || !(hass as any).entities || !areaId) return [];
  const entities = (hass as any).entities as Record<string, {
    entity_id: string;
    area_id?: string | null;
    device_id?: string | null;
  }>;
  const devices = ((hass as any).devices ?? {}) as Record<string, {
    id: string;
    area_id?: string | null;
  }>;
  return Object.values(entities)
    .filter((e) => {
      if (e.area_id === areaId) return true;
      if (e.device_id) {
        const dev = devices[e.device_id];
        if (dev?.area_id === areaId) return true;
      }
      return false;
    })
    .filter((e) => domains.includes(e.entity_id.split(".")[0]!))
    .map((e) => e.entity_id)
    .sort();
}
