import { describe, expect, test } from "vitest";
import {
  entitiesForScope,
  filterEntities,
  scopeCategoryKey,
} from "../frontend/src/entities-for-scope";

const hass = {
  entities: {
    "light.up_lamp": { entity_id: "light.up_lamp", area_id: "bedroom" },
    "light.up_other": { entity_id: "light.up_other", area_id: null, device_id: "dev_up" },
    "light.down_lamp": { entity_id: "light.down_lamp", area_id: "kitchen" },
    "switch.fan": { entity_id: "switch.fan", area_id: "bedroom" },
    "light.orphan": { entity_id: "light.orphan", area_id: null, device_id: null },
    "switch.scope_bedroom": {
      entity_id: "switch.scope_bedroom",
      area_id: "bedroom",
      platform: "ambience",
    },
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

  test("omitting domains returns every in-scope entity (no domain filter)", () => {
    const r = entitiesForScope(hass, { kind: "area", id: "bedroom" });
    // light.up_lamp, light.up_other (via device), switch.fan — all in bedroom
    expect(r).toEqual(["light.up_lamp", "light.up_other", "switch.fan"]);
  });
});

describe("filterEntities", () => {
  const entities = ["light.a", "light.b", "switch.fan", "media_player.tv"];

  test("null target returns input unchanged", () => {
    expect(filterEntities(entities, null)).toEqual(entities);
  });

  test("undefined target returns input unchanged", () => {
    expect(filterEntities(entities, undefined)).toEqual(entities);
  });

  test("target with no entity stanza returns input unchanged", () => {
    expect(filterEntities(entities, { device: {} })).toEqual(entities);
  });

  test("target.entity = {} returns input unchanged (no domain constraint)", () => {
    expect(filterEntities(entities, { entity: {} })).toEqual(entities);
  });

  test("single-domain string filter", () => {
    expect(filterEntities(entities, { entity: { domain: "light" } })).toEqual([
      "light.a",
      "light.b",
    ]);
  });

  test("multi-domain array filter (single entry)", () => {
    expect(filterEntities(entities, { entity: { domain: ["light", "switch"] } })).toEqual([
      "light.a",
      "light.b",
      "switch.fan",
    ]);
  });

  test("union across multiple entry objects", () => {
    expect(
      filterEntities(entities, {
        entity: [{ domain: "light" }, { domain: "media_player" }],
      }),
    ).toEqual(["light.a", "light.b", "media_player.tv"]);
  });

  test("entry without a domain disables the filter (accepts any)", () => {
    expect(
      filterEntities(entities, {
        entity: [{ domain: "light" }, { integration: "spotify" }],
      }),
    ).toEqual(entities);
  });

  test("empty entity array returns input unchanged", () => {
    expect(filterEntities(entities, { entity: [] })).toEqual(entities);
  });

  test("entity_id without a domain is dropped", () => {
    expect(filterEntities(["broken", "light.a"], { entity: { domain: "light" } })).toEqual([
      "light.a",
    ]);
  });
});

describe("entitiesForScope — excludes Ambience's own entities", () => {
  test("drops entities whose platform is 'ambience'", () => {
    const r = entitiesForScope(hass, { kind: "area", id: "bedroom" }, ["switch"]);
    expect(r).not.toContain("switch.scope_bedroom");
    expect(r).toContain("switch.fan"); // a normal switch in the same area survives
  });
});

describe("scopeCategoryKey", () => {
  test("joins the house scope key and category id with a NUL separator", () => {
    expect(scopeCategoryKey({ kind: "house" }, "relax")).toBe("house\u0000relax");
  });

  test("joins a kinded scope key and category id with a NUL separator", () => {
    expect(scopeCategoryKey({ kind: "area", id: "kitchen" }, "night")).toBe(
      "area:kitchen\u0000night",
    );
  });
});
