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
});

describe("resolveTargetInScope", () => {
  const hass: any = {
    entities: {
      "light.k": { entity_id: "light.k", area_id: "kitchen", labels: ["reading"] },
      "light.o": { entity_id: "light.o", area_id: "office", labels: ["reading"] },
    },
    devices: {},
    areas: { kitchen: { area_id: "kitchen" }, office: { area_id: "office" } },
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
});
