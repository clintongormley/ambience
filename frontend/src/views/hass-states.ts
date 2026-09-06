import { entityName, type HassWithStates } from "./entity-row.js";

/** Minimal shape of a single entry in `hass.states`. */
export type StateObj = {
  state?: unknown;
  attributes?: Record<string, unknown>;
};

/**
 * `hass.states` as a typed map (or `{}` when hass/states is absent). Centralises
 * the structural cast the editor components would otherwise each repeat.
 */
export function statesMap(hass: unknown): Record<string, StateObj> {
  return (hass as { states?: Record<string, StateObj> } | undefined)?.states ?? {};
}

/**
 * Does the entity's state read as a number? `Number("")`, `Number("unknown")`
 * and `Number("unavailable")` are all NaN, so the trim-and-finite test excludes
 * them without naming them.
 */
export function hasNumericState(st: StateObj | undefined): boolean {
  const s = st?.state;
  return typeof s === "string" && s.trim() !== "" && Number.isFinite(Number(s));
}

/**
 * All entities in `domain` (e.g. "person", "zone"), as `{id, name}` sorted by id.
 */
export function entitiesOfDomain(
  hass: HassWithStates | undefined,
  domain: string,
): { id: string; name: string }[] {
  const prefix = `${domain}.`;
  return Object.keys(statesMap(hass))
    .filter((id) => id.startsWith(prefix))
    .sort()
    .map((id) => ({ id, name: entityName(hass, id) }));
}
