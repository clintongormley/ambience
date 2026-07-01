import { type AreaRegistry, effectiveAreaId } from "./entity-registry.js";
import type { HassWithStates } from "./views/entity-row.js";

/** hass with both state attributes (for the friendly name) and registry maps. */
export type EntityAreaHass = HassWithStates & AreaRegistry;

/** Lowercased alphanumeric word tokens. Unicode-aware (`\p{L}\p{N}` + `u`) so
 *  accented names — e.g. Spanish "Salón" — tokenise correctly, unlike `\b`.
 *  NFC-normalised first so a decomposed accent (NFD: base + combining mark)
 *  doesn't split into two tokens and defeat suppression when the area and name
 *  arrive in different normal forms. */
function tokens(s: string): string[] {
  return s
    .normalize("NFC")
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
}

/** True when the area's word sequence appears as a contiguous run of whole words
 *  in the name (so prefixing the area would be redundant). An area that tokenises
 *  to nothing (empty, or punctuation-only like "—") counts as contained — there's
 *  no meaningful prefix to add. */
export function nameContainsArea(name: string, area: string): boolean {
  const nt = tokens(name);
  const at = tokens(area);
  if (at.length === 0) return true;
  for (let i = 0; i + at.length <= nt.length; i++) {
    if (at.every((t, j) => nt[i + j] === t)) return true;
  }
  return false;
}

/** Best display name for an entity in summary prose. Prefers the live-state
 *  `friendly_name` (HA's own computed name); when the entity has no live
 *  state — unavailable, not loaded — it falls back to the
 *  entity/device registry (name override → original name → device name), the
 *  same source the entity picker and the area prefix read, so the summary keeps
 *  showing the real name instead of leaking the raw entity_id. The raw id is
 *  only the honest last resort for a truly unknown entity (e.g. a stale
 *  reference to one that's been deleted from the registry). */
export function entityDisplayName(hass: EntityAreaHass | undefined, entity_id: string): string {
  const friendly = hass?.states?.[entity_id]?.attributes?.friendly_name;
  if (typeof friendly === "string" && friendly) return friendly;
  const entry = hass?.entities?.[entity_id];
  if (typeof entry?.name === "string" && entry.name) return entry.name;
  if (typeof entry?.original_name === "string" && entry.original_name) return entry.original_name;
  // Device display name is `name_by_user ?? name` (a device rename lands in
  // name_by_user), matching how HA and the entity picker resolve it.
  const device = entry?.device_id ? hass?.devices?.[entry.device_id] : undefined;
  if (typeof device?.name_by_user === "string" && device.name_by_user) return device.name_by_user;
  if (typeof device?.name === "string" && device.name) return device.name;
  return entity_id;
}

/** Entity display name prefixed with its area ("Area · Name"), suppressing the
 *  prefix when the name already contains the area. Falls back to the bare name
 *  when the entity has no area or the registry is unavailable. */
export function entityNameWithArea(hass: EntityAreaHass | undefined, entity_id: string): string {
  const name = entityDisplayName(hass, entity_id);
  if (!hass) return name;
  const areaId = effectiveAreaId(hass, entity_id);
  const area = areaId ? (hass.areas?.[areaId]?.name ?? "") : "";
  if (!area || nameContainsArea(name, area)) return name;
  return `${area} · ${name}`;
}
