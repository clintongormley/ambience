import type { ActionSpec, Scene } from "./types.js";

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

/**
 * Entities targeted by every action in the scene OTHER than `idx`, with the
 * action at `idx`'s own targets removed. Used by the scene editor to hide
 * already-claimed entities from an action's target picker so the same entity
 * can't be driven by two concurrently-dispatched actions (which would race).
 *
 * The action's own entities are excluded from the result so they stay visible
 * and editable in its picker — including any pre-existing overlap inherited
 * from imported/hand-edited scenes, which the user can then resolve.
 */
export function entitiesUsedByOtherActions(actions: ActionSpec[], idx: number): string[] {
  // No identifiable current action → hide nothing.
  if (idx < 0 || idx >= actions.length) return [];
  const own = new Set(actions[idx].entity_ids ?? []);
  const used = new Set<string>();
  actions.forEach((action, i) => {
    if (i === idx) return;
    for (const id of action.entity_ids ?? []) {
      if (!own.has(id)) used.add(id);
    }
  });
  return [...used];
}
