import type { Scope } from "./types.js";

/**
 * The mdi icon shown in a scope header. Mirrors how HA itself icons areas and
 * floors: use the icon the user assigned in HA's area/floor registry, and when
 * none is set fall back to a sensible per-kind default. The "house" scope is
 * Ambience-specific (no HA registry entry) so it always uses its default.
 */
const DEFAULT_ICON = {
  house: "mdi:home",
  floor: "mdi:layers",
  area: "mdi:texture-box",
} as const;

// HA's registries hang off `hass` as `areas` / `floors`, each a map of id →
// entry carrying an optional `icon`. We only need that one field, so accept a
// permissive shape (the full HassConnection satisfies it structurally).
type IconRegistry = Record<string, { icon?: string | null } | undefined>;
type Registries = { areas?: IconRegistry; floors?: IconRegistry };

export function scopeIcon(scope: Scope, registries?: Registries): string {
  if (scope.kind === "house") return DEFAULT_ICON.house;
  if (scope.kind === "floor") {
    return registries?.floors?.[scope.id]?.icon || DEFAULT_ICON.floor;
  }
  return registries?.areas?.[scope.id]?.icon || DEFAULT_ICON.area;
}
