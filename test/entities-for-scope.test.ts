import { describe, test, expect } from "vitest";
import { entitiesForScope } from "../frontend/src/entities-for-scope";

const hass = {
  entities: {
    "light.up_lamp":   { entity_id: "light.up_lamp",   area_id: "bedroom" },
    "light.up_other":  { entity_id: "light.up_other",  area_id: null, device_id: "dev_up" },
    "light.down_lamp": { entity_id: "light.down_lamp", area_id: "kitchen" },
    "switch.fan":      { entity_id: "switch.fan",      area_id: "bedroom" },
    "light.orphan":    { entity_id: "light.orphan",    area_id: null, device_id: null },
  },
  devices: {
    dev_up: { id: "dev_up", area_id: "bedroom" },
  },
  areas: {
    bedroom: { area_id: "bedroom", floor_id: "upstairs" },
    kitchen: { area_id: "kitchen", floor_id: "downstairs" },
  },
} as any;

describe("entitiesForScope — area scope (today's behaviour)", () => {
  test("returns entities directly in the area", () => {
    const r = entitiesForScope(hass, { kind: "area", id: "bedroom" }, ["light"]);
    expect(r).toContain("light.up_lamp");
  });

  test("includes device-assigned entities", () => {
    const r = entitiesForScope(hass, { kind: "area", id: "bedroom" }, ["light"]);
    expect(r).toContain("light.up_other");
  });

  test("excludes other-area entities", () => {
    const r = entitiesForScope(hass, { kind: "area", id: "bedroom" }, ["light"]);
    expect(r).not.toContain("light.down_lamp");
  });

  test("filters by domain", () => {
    const r = entitiesForScope(hass, { kind: "area", id: "bedroom" }, ["light"]);
    expect(r).not.toContain("switch.fan");
  });
});

describe("entitiesForScope — floor scope", () => {
  test("includes entities in any area on that floor", () => {
    const r = entitiesForScope(hass, { kind: "floor", id: "upstairs" }, ["light"]);
    expect(r).toEqual(["light.up_lamp", "light.up_other"]);
  });

  test("excludes entities in areas on other floors", () => {
    const r = entitiesForScope(hass, { kind: "floor", id: "upstairs" }, ["light"]);
    expect(r).not.toContain("light.down_lamp");
  });

  test("returns empty when no areas belong to the floor", () => {
    expect(entitiesForScope(hass, { kind: "floor", id: "nonexistent" }, ["light"])).toEqual([]);
  });
});

describe("entitiesForScope — house scope", () => {
  test("includes entities in any area", () => {
    const r = entitiesForScope(hass, { kind: "house" }, ["light"]);
    expect(r).toContain("light.up_lamp");
    expect(r).toContain("light.up_other");
    expect(r).toContain("light.down_lamp");
  });

  test("excludes orphan entities (no area, no device area)", () => {
    const r = entitiesForScope(hass, { kind: "house" }, ["light"]);
    expect(r).not.toContain("light.orphan");
  });
});

describe("entitiesForScope — output stability", () => {
  test("results are sorted", () => {
    const r = entitiesForScope(hass, { kind: "house" }, ["light", "switch"]);
    expect([...r].sort()).toEqual(r);
  });

  test("returns empty when hass.entities is missing", () => {
    expect(entitiesForScope({} as any, { kind: "house" }, ["light"])).toEqual([]);
  });
});
