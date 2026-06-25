import { entityName, type HassWithStates } from "./views/entity-row.js";

/** Structural view of the registry maps we read to resolve an entity's area —
 *  avoids depending on the full HomeAssistant interface (mirrors the pattern in
 *  entities-for-scope.ts / scope-icon.ts). */
export type AreaRegistry = {
  entities?: Record<string, { area_id?: string | null; device_id?: string | null }>;
  devices?: Record<string, { area_id?: string | null }>;
  areas?: Record<string, { name?: string | null }>;
};

/** hass with both state attributes (for the friendly name) and registry maps. */
export type EntityAreaHass = HassWithStates & AreaRegistry;

/** An entity's effective area: its own `area_id`, else its device's `area_id`,
 *  else null. Single source of truth, shared with entities-for-scope.ts. Reads
 *  only the entity/device maps — the `areas` map isn't needed to resolve the id. */
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

/** Lowercased alphanumeric word tokens. Unicode-aware (`\p{L}\p{N}` + `u`) so
 *  accented names — e.g. Spanish "Salón" — tokenise correctly, unlike `\b`. */
function tokens(s: string): string[] {
  return s
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
}

/** True when the area's word sequence appears as a contiguous run of whole words
 *  in the name (so prefixing the area would be redundant). An empty area name
 *  counts as contained (nothing meaningful to add). */
export function nameContainsArea(name: string, area: string): boolean {
  const nt = tokens(name);
  const at = tokens(area);
  if (at.length === 0) return true;
  for (let i = 0; i + at.length <= nt.length; i++) {
    if (at.every((t, j) => nt[i + j] === t)) return true;
  }
  return false;
}

/** Entity friendly name prefixed with its area ("Area · Name"), suppressing the
 *  prefix when the name already contains the area. Falls back to the bare name
 *  when the entity has no area or the registry is unavailable. */
export function entityNameWithArea(hass: EntityAreaHass | undefined, entity_id: string): string {
  const name = entityName(hass, entity_id);
  if (!hass) return name;
  const areaId = effectiveAreaId(hass, entity_id);
  const area = areaId ? (hass.areas?.[areaId]?.name ?? "") : "";
  if (!area || nameContainsArea(name, area)) return name;
  return `${area} · ${name}`;
}
