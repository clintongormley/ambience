import { describe, expect, test } from "vitest";

import { entitiesUsedByOtherActions } from "../frontend/src/scene";
import type { ActionSpec } from "../frontend/src/types";

function action(service: string, entity_ids: string[]): ActionSpec {
  return { service, entity_ids, params: {} };
}

describe("entitiesUsedByOtherActions", () => {
  test("returns empty when there are no other actions", () => {
    const actions = [action("light.turn_on", ["light.lamp_a", "light.lamp_b"])];
    expect(entitiesUsedByOtherActions(actions, 0)).toEqual([]);
  });

  test("returns the entities used by another action", () => {
    const actions = [
      action("light.turn_on", ["light.lamp_a"]),
      action("light.turn_on", ["light.lamp_b"]),
    ];
    // From action 1's perspective, lamp_a is taken by action 0.
    expect(entitiesUsedByOtherActions(actions, 1)).toEqual(["light.lamp_a"]);
  });

  test("excludes the action's own entities even when a sibling also uses them", () => {
    // Legacy/overlap case: lamp_b is in BOTH action 0 and action 1.
    // For action 1, lamp_b must NOT be reported as used-by-others, so it
    // stays visible and checkable in action 1's own picker.
    const actions = [
      action("light.turn_on", ["light.lamp_a", "light.lamp_b"]),
      action("light.turn_on", ["light.lamp_b"]),
    ];
    expect(entitiesUsedByOtherActions(actions, 1)).toEqual(["light.lamp_a"]);
  });

  test("unions and de-duplicates entities across multiple sibling actions", () => {
    const actions = [
      action("light.turn_on", ["light.lamp_a"]),
      action("light.turn_off", ["light.lamp_b", "light.lamp_a"]),
      action("light.turn_on", ["light.lamp_c"]),
    ];
    // For action 2: union of action 0 + action 1, de-duplicated.
    expect(entitiesUsedByOtherActions(actions, 2).sort()).toEqual(["light.lamp_a", "light.lamp_b"]);
  });

  test("returns empty for an out-of-range index", () => {
    const actions = [action("light.turn_on", ["light.lamp_a"])];
    expect(entitiesUsedByOtherActions(actions, 5)).toEqual([]);
  });

  test("tolerates a sibling action with missing entity_ids", () => {
    const actions = [
      { service: "scene.turn_on", params: {} } as unknown as ActionSpec,
      action("light.turn_on", ["light.lamp_a"]),
    ];
    expect(entitiesUsedByOtherActions(actions, 1)).toEqual([]);
  });

  test("tolerates the current action having missing entity_ids", () => {
    const actions = [
      { service: "scene.turn_on", params: {} } as unknown as ActionSpec,
      action("light.turn_on", ["light.lamp_a"]),
    ];
    // Current action (idx 0) has no entity_ids; sibling lamp_a is still reported.
    expect(entitiesUsedByOtherActions(actions, 0)).toEqual(["light.lamp_a"]);
  });
});
