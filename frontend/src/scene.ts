import type { Scene } from "./types.js";

/**
 * Drop the fields that fix a scene to a position within its category — the
 * backend-assigned `priority`, the user `pinned` flag, and the transient
 * `shadowed_by`. Used whenever a scene lands "fresh" (duplicated, moved to a new
 * scope, or moved to a new category) so the backend assigns it a new position.
 */
export function stripPositionMetadata(scene: Scene): Scene {
  const { priority: _priority, pinned: _pinned, shadowed_by: _shadowedBy, ...rest } = scene;
  return rest;
}
