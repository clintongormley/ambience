import { describe, expect, test } from "vitest";
import { actionTarget, resolveTargetInScope, targetIsEmpty } from "../frontend/src/action-target";

describe("actionTarget", () => {
  test("prefers explicit target", () => {
    expect(
      actionTarget({ service: "light.turn_on", target: { area_id: ["k"] }, params: {} } as any),
    ).toEqual({
      area_id: ["k"],
    });
  });
  test("falls back to legacy entity_ids", () => {
    expect(
      actionTarget({ service: "light.turn_on", entity_ids: ["light.a"], params: {} } as any),
    ).toEqual({
      entity_id: ["light.a"],
    });
  });
  test("drops empty selectors", () => {
    expect(
      actionTarget({
        service: "x.y",
        target: { area_id: [], entity_id: ["light.a"] },
        params: {},
      } as any),
    ).toEqual({ entity_id: ["light.a"] });
    expect(targetIsEmpty(actionTarget({ service: "x.y", params: {} } as any))).toBe(true);
  });

  // HA's ha-target-picker emits a SINGLE selection as a bare string (e.g.
  // area_id: "living_room") and multiple as an array. The frontend must coerce
  // scalars to arrays, mirroring the backend action_target — otherwise a
  // single-area/label/device pick is silently dropped and nothing displays.
  test("coerces a scalar selector value to a one-item array", () => {
    expect(
      actionTarget({
        service: "light.turn_on",
        target: { area_id: "living_room" },
        params: {},
      } as any),
    ).toEqual({ area_id: ["living_room"] });
  });

  test("coerces scalars in a mixed array/scalar target", () => {
    expect(
      actionTarget({
        service: "light.turn_on",
        target: { entity_id: ["light.lounge"], area_id: "living_room" },
        params: {},
      } as any),
    ).toEqual({ entity_id: ["light.lounge"], area_id: ["living_room"] });
  });

  // Fix 1: floor_id is now a supported indirect action-target selector.
  test("keeps floor_id", () => {
    expect(
      actionTarget({ service: "x.y", target: { floor_id: ["ground"] }, params: {} } as any),
    ).toEqual({ floor_id: ["ground"] });
  });

  test("coerces scalar floor_id to array", () => {
    expect(
      actionTarget({ service: "x.y", target: { floor_id: "ground" }, params: {} } as any),
    ).toEqual({ floor_id: ["ground"] });
  });
});

describe("resolveTargetInScope", () => {
  const hass: any = {
    entities: {
      "light.k": { entity_id: "light.k", area_id: "kitchen", labels: ["reading"] },
      "light.o": { entity_id: "light.o", area_id: "office", labels: ["reading"] },
    },
    devices: {},
    areas: {
      kitchen: { area_id: "kitchen", floor_id: "ground" },
      office: { area_id: "office", floor_id: "upper" },
    },
  };
  test("area scope clips a label target", () => {
    const got = resolveTargetInScope(hass, { kind: "area", id: "kitchen" } as any, {
      label_id: ["reading"],
    });
    expect(got).toEqual(["light.k"]);
  });
  test("explicit entity in scope", () => {
    const got = resolveTargetInScope(hass, { kind: "area", id: "kitchen" } as any, {
      entity_id: ["light.k"],
    });
    expect(got).toEqual(["light.k"]);
  });
  test("empty target → empty", () => {
    expect(resolveTargetInScope(hass, { kind: "area", id: "kitchen" } as any, {})).toEqual([]);
  });
  test("direct entity_id out of scope is NOT clipped", () => {
    const got = resolveTargetInScope(hass, { kind: "area", id: "kitchen" } as any, {
      entity_id: ["light.o"],
    });
    expect(got).toEqual(["light.o"]);
  });

  // Fix 1: floor_id target resolution in scope.
  test("floor_id target clips to area scope", () => {
    // kitchen is on "ground" floor; scene is area-scoped to kitchen.
    // floor_id target "ground" covers both kitchen and office lights, but
    // the area scope clips it to kitchen only.
    const got = resolveTargetInScope(hass, { kind: "area", id: "kitchen" } as any, {
      floor_id: ["ground"],
    });
    expect(got).toEqual(["light.k"]);
  });

  test("floor_id target on non-matching floor returns empty", () => {
    // kitchen-scoped scene, floor "upper" target → kitchen light is on "ground", no match.
    const got = resolveTargetInScope(hass, { kind: "area", id: "kitchen" } as any, {
      floor_id: ["upper"],
    });
    expect(got).toEqual([]);
  });

  test("floor_id target at house scope includes all matching entities", () => {
    // House scope: both lights are on "ground", both should be returned.
    const hassHouse: any = {
      entities: {
        "light.k": { entity_id: "light.k", area_id: "kitchen", labels: [] },
        "light.o": { entity_id: "light.o", area_id: "office", labels: [] },
      },
      devices: {},
      areas: {
        kitchen: { area_id: "kitchen", floor_id: "ground" },
        office: { area_id: "office", floor_id: "ground" },
      },
    };
    const got = resolveTargetInScope(hassHouse, { kind: "house" } as any, {
      floor_id: ["ground"],
    });
    expect(got).toEqual(["light.k", "light.o"]);
  });
});
