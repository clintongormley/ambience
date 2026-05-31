/**
 * Tests for the remaining api.ts functions not covered by api.test.ts
 * (listAreas, getArea, saveArea, listMatchers, listActions, validateConfig, dryRun)
 */
import { describe, test, expect, vi } from "vitest";
import {
  listAreas,
  getArea,
  saveArea,
  listMatchers,
  listExposedActions,
  listServices,
  getServiceSchema,
  saveExposedActions,
  validateConfig,
  dryRun,
  listFloors,
  getFloor,
  saveFloor,
  getHouse,
  saveHouse,
} from "../frontend/src/api";
import type { AreaConfig } from "../frontend/src/types";

function makeFakeHass() {
  const sent: any[] = [];
  const callWS = vi.fn(async (msg: any) => {
    sent.push(msg);
    if (msg.type === "ambience/areas/list") {
      return [{ area_id: "living_room", name: "Living Room" }];
    }
    if (msg.type === "ambience/area/get") {
      return { rules: [] };
    }
    if (msg.type === "ambience/area/save") {
      return { ok: true, config: msg.config };
    }
    if (msg.type === "ambience/matchers/list") {
      return [{ name: "scene" }];
    }
    if (msg.type === "ambience/exposed_actions/list") {
      return [
        { id: "light.turn_on", label: "", visible_fields: [], defaults: {} },
      ];
    }
    if (msg.type === "ambience/exposed_actions/save") {
      return { ok: true, warnings: [] };
    }
    if (msg.type === "ambience/services/list") {
      return [{ id: "light.turn_on", description: "Turn on", target: null }];
    }
    if (msg.type === "ambience/services/get_schema") {
      return { fields: { brightness_pct: { selector: { number: {} } } }, target: null };
    }
    if (msg.type === "ambience/validate") {
      return { ok: true };
    }
    if (msg.type === "ambience/dry_run") {
      return { matched_rule_index: null, rule_name: null, actions: [] };
    }
  });
  return { callWS, sent };
}

describe("API: listAreas", () => {
  test("sends correct WS message and returns areas", async () => {
    const { callWS, sent } = makeFakeHass();
    const res = await listAreas({ callWS } as any);
    expect(sent[0]).toEqual({ type: "ambience/areas/list" });
    expect(res).toEqual([{ area_id: "living_room", name: "Living Room" }]);
  });
});

describe("API: getArea", () => {
  test("sends correct WS message with area_id", async () => {
    const { callWS, sent } = makeFakeHass();
    const res = await getArea({ callWS } as any, "living_room");
    expect(sent[0]).toEqual({ type: "ambience/area/get", area_id: "living_room" });
    expect(res).toEqual({ rules: [] });
  });
});

describe("API: saveArea", () => {
  test("sends area config via WS and returns result", async () => {
    const { callWS, sent } = makeFakeHass();
    const config: AreaConfig = { rules: [] };
    const res = await saveArea({ callWS } as any, "living_room", config);
    expect(sent[0]).toMatchObject({
      type: "ambience/area/save",
      area_id: "living_room",
      config,
    });
    expect(res.ok).toBe(true);
  });
});

describe("API: listMatchers", () => {
  test("sends correct WS message and returns matchers", async () => {
    const { callWS, sent } = makeFakeHass();
    const res = await listMatchers({ callWS } as any);
    expect(sent[0]).toEqual({ type: "ambience/matchers/list" });
    expect(res).toEqual([{ name: "scene" }]);
  });
});

describe("API: listExposedActions", () => {
  test("sends correct WS message and returns exposed actions", async () => {
    const { callWS, sent } = makeFakeHass();
    const res = await listExposedActions({ callWS } as any);
    expect(sent[0]).toEqual({ type: "ambience/exposed_actions/list" });
    expect(res).toEqual([
      { id: "light.turn_on", label: "", visible_fields: [], defaults: {} },
    ]);
  });
});

describe("API: saveExposedActions", () => {
  test("sends actions list and returns warnings result", async () => {
    const { callWS, sent } = makeFakeHass();
    const actions = [
      { id: "light.turn_on", label: "", visible_fields: ["brightness_pct"], defaults: {} },
    ];
    const res = await saveExposedActions({ callWS } as any, actions);
    expect(sent[0]).toEqual({ type: "ambience/exposed_actions/save", actions });
    expect(res).toEqual({ ok: true, warnings: [] });
  });
});

describe("API: listServices", () => {
  test("sends correct WS message and returns the service catalog", async () => {
    const { callWS, sent } = makeFakeHass();
    const res = await listServices({ callWS } as any);
    expect(sent[0]).toEqual({ type: "ambience/services/list" });
    expect(res).toEqual([{ id: "light.turn_on", description: "Turn on", target: null }]);
  });
});

describe("API: getServiceSchema", () => {
  test("sends the service id and returns its schema", async () => {
    const { callWS, sent } = makeFakeHass();
    const res = await getServiceSchema({ callWS } as any, "light.turn_on");
    expect(sent[0]).toEqual({
      type: "ambience/services/get_schema",
      service: "light.turn_on",
    });
    expect(res).toEqual({
      fields: { brightness_pct: { selector: { number: {} } } },
      target: null,
    });
  });
});

describe("API: validateConfig", () => {
  test("sends config to validate endpoint", async () => {
    const { callWS, sent } = makeFakeHass();
    const config: AreaConfig = { rules: [] };
    const res = await validateConfig({ callWS } as any, config);
    expect(sent[0]).toEqual({ type: "ambience/validate", config });
    expect(res.ok).toBe(true);
  });
});

describe("API: dryRun", () => {
  test("sends area_id and scene to dry_run endpoint", async () => {
    const { callWS, sent } = makeFakeHass();
    const res = await dryRun(
      { callWS } as any,
      { kind: "area", id: "living_room" },
      "movie",
    );
    expect(sent[0]).toEqual({
      type: "ambience/dry_run",
      area_id: "living_room",
      scene: "movie",
    });
    expect(res).toEqual({ matched_rule_index: null, rule_name: null, actions: [] });
  });

  test("dryRun omits the scene field when called without one", async () => {
    const { callWS, sent } = makeFakeHass();
    const res = await dryRun(
      { callWS } as any,
      { kind: "area", id: "living_room" },
    );
    expect(sent[0]).toEqual({
      type: "ambience/dry_run",
      area_id: "living_room",
    });
    expect(res).toEqual({ matched_rule_index: null, rule_name: null, actions: [] });
  });

  test("dryRun includes the scene field when given", async () => {
    const { callWS, sent } = makeFakeHass();
    const res = await dryRun(
      { callWS } as any,
      { kind: "area", id: "living_room" },
      "movie_night",
    );
    expect(sent[0]).toEqual({
      type: "ambience/dry_run",
      area_id: "living_room",
      scene: "movie_night",
    });
    expect(res).toEqual({ matched_rule_index: null, rule_name: null, actions: [] });
  });

  test("dryRun area sends area_id", async () => {
    const calls: any[] = [];
    const hass = {
      callWS: async (msg: any) => { calls.push(msg); return {}; },
      connection: {} as any,
    };
    await dryRun(hass as any, { kind: "area", id: "kitchen" });
    expect(calls[0]).toEqual({ type: "ambience/dry_run", area_id: "kitchen" });
  });

  test("dryRun floor sends floor_id", async () => {
    const calls: any[] = [];
    const hass = {
      callWS: async (msg: any) => { calls.push(msg); return {}; },
      connection: {} as any,
    };
    await dryRun(hass as any, { kind: "floor", id: "upstairs" }, "movie");
    expect(calls[0]).toEqual({
      type: "ambience/dry_run",
      floor_id: "upstairs",
      scene: "movie",
    });
  });

  test("dryRun house sends house:true", async () => {
    const calls: any[] = [];
    const hass = {
      callWS: async (msg: any) => { calls.push(msg); return {}; },
      connection: {} as any,
    };
    await dryRun(hass as any, { kind: "house" });
    expect(calls[0]).toEqual({ type: "ambience/dry_run", house: true });
  });
});

test("listFloors calls ambience/floors/list", async () => {
  const calls: any[] = [];
  const hass = {
    callWS: async (msg: any) => { calls.push(msg); return []; },
    connection: {} as any,
  };
  await listFloors(hass as any);
  expect(calls[0]).toEqual({ type: "ambience/floors/list" });
});

test("getFloor passes floor_id", async () => {
  const calls: any[] = [];
  const hass = {
    callWS: async (msg: any) => { calls.push(msg); return { rules: [] }; },
    connection: {} as any,
  };
  await getFloor(hass as any, "upstairs");
  expect(calls[0]).toEqual({ type: "ambience/floor/get", floor_id: "upstairs" });
});

test("saveFloor sends config", async () => {
  const calls: any[] = [];
  const hass = {
    callWS: async (msg: any) => { calls.push(msg); return { ok: true, config: msg.config }; },
    connection: {} as any,
  };
  await saveFloor(hass as any, "upstairs", { rules: [] });
  expect(calls[0]).toEqual({
    type: "ambience/floor/save",
    floor_id: "upstairs",
    config: { rules: [] },
  });
});

test("getHouse calls ambience/house/get", async () => {
  const calls: any[] = [];
  const hass = {
    callWS: async (msg: any) => { calls.push(msg); return { rules: [] }; },
    connection: {} as any,
  };
  await getHouse(hass as any);
  expect(calls[0]).toEqual({ type: "ambience/house/get" });
});

test("saveHouse calls ambience/house/save", async () => {
  const calls: any[] = [];
  const hass = {
    callWS: async (msg: any) => { calls.push(msg); return { ok: true, config: msg.config }; },
    connection: {} as any,
  };
  await saveHouse(hass as any, { rules: [] });
  expect(calls[0]).toEqual({
    type: "ambience/house/save",
    config: { rules: [] },
  });
});
