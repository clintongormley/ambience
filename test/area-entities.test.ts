import { describe, test, expect } from "vitest";
import { entitiesInArea } from "../frontend/src/area-entities";

const hass = {
  entities: {
    "light.lamp_a": { entity_id: "light.lamp_a", area_id: "living_room" },
    "light.lamp_b": { entity_id: "light.lamp_b", area_id: null, device_id: "dev1" },
    "light.lamp_c": { entity_id: "light.lamp_c", area_id: "bedroom" },
    "switch.fan":   { entity_id: "switch.fan",   area_id: "living_room" },
    "light.no_area": { entity_id: "light.no_area", area_id: null, device_id: null },
  },
  devices: {
    dev1: { id: "dev1", area_id: "living_room" },
  },
} as any;

describe("entitiesInArea", () => {
  test("returns entities directly assigned to the area", () => {
    expect(entitiesInArea(hass, "living_room", ["light"])).toContain("light.lamp_a");
  });

  test("returns entities whose device is assigned to the area", () => {
    expect(entitiesInArea(hass, "living_room", ["light"])).toContain("light.lamp_b");
  });

  test("filters by domain", () => {
    const result = entitiesInArea(hass, "living_room", ["light"]);
    expect(result).not.toContain("switch.fan");
  });

  test("excludes entities in other areas", () => {
    expect(entitiesInArea(hass, "living_room", ["light"])).not.toContain("light.lamp_c");
  });

  test("excludes entities with no area assignment", () => {
    expect(entitiesInArea(hass, "living_room", ["light"])).not.toContain("light.no_area");
  });

  test("returns empty when areaId is undefined", () => {
    expect(entitiesInArea(hass, undefined, ["light"])).toEqual([]);
  });

  test("returns empty when hass.entities is missing", () => {
    expect(entitiesInArea({} as any, "living_room", ["light"])).toEqual([]);
  });

  test("supports multiple domains", () => {
    const result = entitiesInArea(hass, "living_room", ["light", "switch"]);
    expect(result).toContain("light.lamp_a");
    expect(result).toContain("switch.fan");
  });

  test("results are sorted for stable rendering", () => {
    const result = entitiesInArea(hass, "living_room", ["light", "switch"]);
    const sorted = [...result].sort();
    expect(result).toEqual(sorted);
  });
});
