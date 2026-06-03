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
