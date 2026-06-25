import type { HassConnection } from "./api.js";
import { effectiveAreaId } from "./entity-registry.js";
import type { Scope } from "./types.js";

/** Stable identity string for a scope: "house", or "<kind>:<id>". The single
 *  definition of scope equality used across the frontend. */
export function scopeKey(scope: Scope): string {
  return scope.kind === "house" ? "house" : `${scope.kind}:${scope.id}`;
}

/** Rebuild a Scope from the backend's (scope_kind, scope_id) parts. A null id
 *  means the house scope. Inverse of scopeKey for keying the live-state map. */
export function scopeFromParts(kind: string, id: string | null): Scope {
  return id == null ? { kind: "house" } : { kind: kind as "area" | "floor", id };
}

/** Join a scope's identity with a sub-key using a NUL separator. NUL can't
 *  appear in a scope id, category id, or scene category, so the parts never
 *  collide. Single-sources the separator for the composite keys below. */
function scopedKey(scope: Scope, part: string): string {
  return `${scopeKey(scope)}\u0000${part}`;
}

/** Composite key identifying a (scope, category) section, used to persist which
 *  category sections are collapsed within each scope. */
export function scopeCategoryKey(scope: Scope, categoryId: string): string {
  return scopedKey(scope, categoryId);
}

/** Composite key identifying the (scope, category) pair within which scene
 *  names must be unique. */
export function sceneNameKey(scope: Scope, category: string): string {
  return scopedKey(scope, category);
}

/**
 * HA service target metadata. Mirrors the shape of the `target` field in
 * HA's services.yaml descriptions (and what HA returns from
 * `async_get_all_descriptions`). All keys are optional.
 *
 * For now we honour only `target.entity[*].domain` for filtering; other keys
 * (integration, device_class, supported_features, etc.) are accepted as a
 * pass-through for future use.
 */
export type HaTargetEntry = {
  domain?: string | string[];
  integration?: string;
  device_class?: string | string[];
  [key: string]: unknown;
};

export type HaTarget =
  | null
  | undefined
  | {
      entity?: HaTargetEntry | HaTargetEntry[];
      device?: unknown;
      area?: unknown;
      [key: string]: unknown;
    };

/**
 * Filter a pre-scoped list of entity_ids by HA's target metadata.
 *
 * If `target` is null/undefined or has no `entity` constraints, returns
 * the input unchanged. Otherwise, builds the union of allowed domains
 * across all entries in `target.entity` and keeps only entities whose
 * domain is in that set. An entry without a `domain` accepts any domain
 * (and thus collapses the filter to "all input entities").
 *
 * Pure function — exported separately from `entitiesForScope` so callers
 * can compose scope-filtering with target-filtering, or skip target
 * filtering entirely (e.g. for services with no target metadata).
 */
export function filterEntities(entityIds: readonly string[], target: HaTarget): string[] {
  if (!target || target.entity == null) return [...entityIds];
  const entries = Array.isArray(target.entity) ? target.entity : [target.entity];
  if (entries.length === 0) return [...entityIds];
  const allowedDomains = new Set<string>();
  let anyDomain = false;
  for (const entry of entries) {
    if (!entry || typeof entry !== "object") continue;
    const domain = entry.domain;
    if (domain == null) {
      anyDomain = true;
      continue;
    }
    if (Array.isArray(domain)) {
      for (const d of domain) {
        if (typeof d === "string") allowedDomains.add(d);
      }
    } else if (typeof domain === "string") {
      allowedDomains.add(domain);
    }
  }
  if (anyDomain || allowedDomains.size === 0) return [...entityIds];
  return entityIds.filter((id) => {
    const dot = id.indexOf(".");
    if (dot < 0) return false;
    return allowedDomains.has(id.slice(0, dot));
  });
}

/**
 * Returns entity_ids in the given scope that match one of the given domains.
 *
 * Scope semantics:
 *   - area: entity directly or via its device has area_id === scope.id.
 *   - floor: entity belongs to any area whose floor_id === scope.id.
 *   - house: entity belongs to any area (directly or via device). Orphan
 *     entities (no area, no device area) are excluded.
 *
 * Returned list is sorted for stable rendering. When `domains` is empty or
 * omitted, no domain filter is applied (every in-scope entity is returned).
 */
// Structural view of the hass registry maps we read — avoids `as any` while
// staying agnostic of the full HomeAssistant interface (see scope-icon.ts for
// the same pattern).
type RegistryHass = {
  entities?: Record<
    string,
    {
      entity_id: string;
      area_id?: string | null;
      device_id?: string | null;
      platform?: string;
    }
  >;
  devices?: Record<string, { id: string; area_id?: string | null }>;
  areas?: Record<string, { area_id: string; floor_id?: string | null }>;
};

export function entitiesForScope(
  hass: HassConnection,
  scope: Scope,
  domains: readonly string[] = [],
): string[] {
  const reg = hass as unknown as RegistryHass;
  if (!reg?.entities) return [];

  const entities = reg.entities;
  const areas = reg.areas ?? {};

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

  const inScope = (e: { entity_id: string }): boolean => {
    const effAreaId = effectiveAreaId(reg, e.entity_id);
    if (effAreaId == null) return false;
    if (targetAreaIds === null) return true; // house
    return targetAreaIds.has(effAreaId);
  };

  return Object.values(entities)
    .filter(inScope)
    .filter((e) => e.platform !== "ambience")
    .filter((e) => domains.length === 0 || domains.includes(e.entity_id.split(".")[0]!))
    .map((e) => e.entity_id)
    .sort();
}
