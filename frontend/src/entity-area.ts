import { type AreaRegistry, effectiveAreaId } from "./entity-registry.js";
import { entityName, type HassWithStates } from "./views/entity-row.js";

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
