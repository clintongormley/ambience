/** Registry-only helpers for resolving an entity's area. Deliberately free of
 *  any view-layer (`lit`) imports so registry/query consumers — e.g.
 *  entities-for-scope.ts — don't pull UI dependencies into their bundle chunk.
 *  The display-layer area helpers live in entity-area.ts. */

/** Structural view of the registry maps we read to resolve an entity's area and
 *  its display name (entity/device `name`, `original_name`) — avoids depending on
 *  the full HomeAssistant interface (mirrors the pattern in entities-for-scope.ts
 *  / scope-icon.ts). Not a pure area-registry type despite the name. */
export type AreaRegistry = {
  entities?: Record<
    string,
    {
      area_id?: string | null;
      device_id?: string | null;
      name?: string | null;
      original_name?: string | null;
    }
  >;
  devices?: Record<
    string,
    { area_id?: string | null; name?: string | null; name_by_user?: string | null }
  >;
  areas?: Record<string, { name?: string | null }>;
};

/** An entity's effective area: its own `area_id`, else its device's `area_id`,
 *  else null. Single source of truth, shared by entity-area.ts and
 *  entities-for-scope.ts. Reads only the entity/device maps — the `areas` map
 *  isn't needed to resolve the id. */
export function effectiveAreaId(
  reg: Pick<AreaRegistry, "entities" | "devices">,
  entity_id: string,
): string | null {
  const e = reg.entities?.[entity_id];
  if (!e) return null;
  if (e.area_id != null) return e.area_id;
  if (e.device_id) return reg.devices?.[e.device_id]?.area_id ?? null;
  return null;
}
