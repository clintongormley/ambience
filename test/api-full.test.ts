/**
 * Tests for the remaining api.ts functions not covered by api.test.ts
 * (listAreas, getArea, saveArea, listConditions, listActions,
 *  applyScenes, runSceneActions, getDayConfig, saveDayConfig,
 *  getWeatherConfig, saveWeatherConfig, getKnownStates)
 */
import { describe, expect, test, vi } from "vitest";
import {
  applyScenes,
  getArea,
  getDayConfig,
  getFloor,
  getHouse,
  getKnownStates,
  getServiceSchema,
  getWeatherConfig,
  listAreas,
  listConditions,
  listExposedActions,
  listFloors,
  listServices,
  runSceneActions,
  saveArea,
  saveDayConfig,
  saveExposedActions,
  saveFloor,
  saveHouse,
  saveWeatherConfig,
} from "../frontend/src/api";
import type { AreaConfig, WeatherGroup } from "../frontend/src/types";

function makeFakeHass() {
  const sent: any[] = [];
  const callWS = vi.fn(async (msg: any) => {
    sent.push(msg);
    if (msg.type === "ambience/areas/list") {
      return [{ area_id: "living_room", name: "Living Room" }];
    }
    if (msg.type === "ambience/area/get") {
      return { scenes: [] };
    }
    if (msg.type === "ambience/area/save") {
      return { ok: true, config: msg.config };
    }
    if (msg.type === "ambience/conditions/list") {
      return [{ name: "time_of_day" }];
    }
    if (msg.type === "ambience/exposed_actions/list") {
      return [{ id: "light.turn_on", label: "", visible_fields: [], defaults: {} }];
    }
    if (msg.type === "ambience/exposed_actions/save") {
      return { ok: true };
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
      return { matched_scene_index: null, scene_name: null, actions: [] };
    }
    if (msg.type === "ambience/apply") {
      return { ok: true };
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
    expect(res).toEqual({ scenes: [] });
  });
});

describe("API: saveArea", () => {
  test("sends area config via WS and returns result", async () => {
    const { callWS, sent } = makeFakeHass();
    const config: AreaConfig = { scenes: [] };
    const res = await saveArea({ callWS } as any, "living_room", config);
    expect(sent[0]).toMatchObject({
      type: "ambience/area/save",
      area_id: "living_room",
      config,
    });
    expect(res.ok).toBe(true);
  });
});

describe("API: listConditions", () => {
  test("sends correct WS message and returns conditions", async () => {
    const { callWS, sent } = makeFakeHass();
    const res = await listConditions({ callWS } as any);
    expect(sent[0]).toEqual({ type: "ambience/conditions/list" });
    expect(res).toEqual([{ name: "time_of_day" }]);
  });
});

describe("API: listExposedActions", () => {
  test("sends correct WS message and returns exposed actions", async () => {
    const { callWS, sent } = makeFakeHass();
    const res = await listExposedActions({ callWS } as any);
    expect(sent[0]).toEqual({ type: "ambience/exposed_actions/list" });
    expect(res).toEqual([{ id: "light.turn_on", label: "", visible_fields: [], defaults: {} }]);
  });
});

describe("API: saveExposedActions", () => {
  test("sends actions list and returns ok", async () => {
    const { callWS, sent } = makeFakeHass();
    const actions = [
      { id: "light.turn_on", label: "", visible_fields: ["brightness_pct"], defaults: {} },
    ];
    const res = await saveExposedActions({ callWS } as any, actions);
    expect(sent[0]).toEqual({ type: "ambience/exposed_actions/save", actions });
    expect(res).toEqual({ ok: true });
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

describe("API: floor + house wrappers", () => {
  test("listFloors calls ambience/floors/list", async () => {
    const { callWS, sent } = makeFakeHass();
    await listFloors({ callWS } as any);
    expect(sent[0]).toEqual({ type: "ambience/floors/list" });
  });

  test("getFloor passes floor_id", async () => {
    const { callWS, sent } = makeFakeHass();
    await getFloor({ callWS } as any, "upstairs");
    expect(sent[0]).toEqual({ type: "ambience/floor/get", floor_id: "upstairs" });
  });

  test("saveFloor sends config", async () => {
    const { callWS, sent } = makeFakeHass();
    await saveFloor({ callWS } as any, "upstairs", { scenes: [] });
    expect(sent[0]).toEqual({
      type: "ambience/floor/save",
      floor_id: "upstairs",
      config: { scenes: [] },
    });
  });

  test("getHouse calls ambience/house/get", async () => {
    const { callWS, sent } = makeFakeHass();
    await getHouse({ callWS } as any);
    expect(sent[0]).toEqual({ type: "ambience/house/get" });
  });

  test("saveHouse sends config", async () => {
    const { callWS, sent } = makeFakeHass();
    await saveHouse({ callWS } as any, { scenes: [] });
    expect(sent[0]).toEqual({ type: "ambience/house/save", config: { scenes: [] } });
  });
});

describe("API: applyScenes", () => {
  test("applyScenes without categoryId sends no category_id field", async () => {
    const { callWS, sent } = makeFakeHass();
    const res = await applyScenes({ callWS } as any, { kind: "area", id: "living_room" });
    expect(sent[0]).toEqual({ type: "ambience/apply", area_id: "living_room" });
    expect(sent[0]).not.toHaveProperty("category_id");
    expect(res).toEqual({ ok: true });
  });

  test("applyScenes with categoryId includes category_id in message", async () => {
    const { callWS, sent } = makeFakeHass();
    await applyScenes({ callWS } as any, { kind: "area", id: "living_room" }, "evening");
    expect(sent[0]).toEqual({
      type: "ambience/apply",
      area_id: "living_room",
      category_id: "evening",
    });
  });

  test("applyScenes floor scope sends floor_id", async () => {
    const { callWS, sent } = makeFakeHass();
    await applyScenes({ callWS } as any, { kind: "floor", id: "upstairs" });
    expect(sent[0]).toEqual({ type: "ambience/apply", floor_id: "upstairs" });
  });

  test("applyScenes house scope sends house: true", async () => {
    const { callWS, sent } = makeFakeHass();
    await applyScenes({ callWS } as any, { kind: "house" });
    expect(sent[0]).toEqual({ type: "ambience/apply", house: true });
  });
});

// ---------------------------------------------------------------------------
// runSceneActions
// ---------------------------------------------------------------------------

describe("API: runSceneActions", () => {
  test("runSceneActions area scope sends scene_index and area_id", async () => {
    const callWS = vi.fn().mockResolvedValue({ ran: 1, scene_name: "Bright" });
    const res = await runSceneActions({ callWS } as any, { kind: "area", id: "kitchen" }, 2);
    expect(callWS).toHaveBeenCalledWith({
      type: "ambience/scene/run_actions",
      scene_index: 2,
      area_id: "kitchen",
    });
    expect(res).toEqual({ ran: 1, scene_name: "Bright" });
  });

  test("runSceneActions floor scope sends floor_id", async () => {
    const callWS = vi.fn().mockResolvedValue({ ran: 0, scene_name: null });
    await runSceneActions({ callWS } as any, { kind: "floor", id: "upstairs" }, 0);
    expect(callWS).toHaveBeenCalledWith({
      type: "ambience/scene/run_actions",
      scene_index: 0,
      floor_id: "upstairs",
    });
  });

  test("runSceneActions house scope sends house: true", async () => {
    const callWS = vi.fn().mockResolvedValue({ ran: 3, scene_name: "All On" });
    await runSceneActions({ callWS } as any, { kind: "house" }, 1);
    expect(callWS).toHaveBeenCalledWith({
      type: "ambience/scene/run_actions",
      scene_index: 1,
      house: true,
    });
  });
});

// ---------------------------------------------------------------------------
// getDayConfig / saveDayConfig
// ---------------------------------------------------------------------------

describe("API: getDayConfig", () => {
  test("sends correct WS message and returns config", async () => {
    const callWS = vi
      .fn()
      .mockResolvedValue({ workday_sensor: "binary_sensor.workday", workday_calendar: null });
    const res = await getDayConfig({ callWS } as any);
    expect(callWS).toHaveBeenCalledWith({ type: "ambience/conditions/day/config/list" });
    expect(res).toEqual({ workday_sensor: "binary_sensor.workday", workday_calendar: null });
  });
});

describe("API: saveDayConfig", () => {
  test("sends workday_sensor and workday_calendar and returns ok", async () => {
    const callWS = vi.fn().mockResolvedValue({ ok: true });
    const res = await saveDayConfig(
      { callWS } as any,
      "binary_sensor.workday",
      "calendar.holidays",
    );
    expect(callWS).toHaveBeenCalledWith({
      type: "ambience/conditions/day/config/save",
      workday_sensor: "binary_sensor.workday",
      workday_calendar: "calendar.holidays",
    });
    expect(res.ok).toBe(true);
  });

  test("saveDayConfig accepts null values for both sensor and calendar", async () => {
    const callWS = vi.fn().mockResolvedValue({ ok: true });
    await saveDayConfig({ callWS } as any, null, null);
    expect(callWS).toHaveBeenCalledWith({
      type: "ambience/conditions/day/config/save",
      workday_sensor: null,
      workday_calendar: null,
    });
  });
});

// ---------------------------------------------------------------------------
// getWeatherConfig / saveWeatherConfig
// ---------------------------------------------------------------------------

describe("API: getWeatherConfig", () => {
  test("sends correct WS message and returns weather config", async () => {
    const callWS = vi.fn().mockResolvedValue({
      entity: "weather.home",
      groups: [{ id: "sunny", label: "Sunny", conditions: ["sunny", "clear-night"] }],
    });
    const res = await getWeatherConfig({ callWS } as any);
    expect(callWS).toHaveBeenCalledWith({ type: "ambience/conditions/weather/config/list" });
    expect(res.entity).toBe("weather.home");
    expect(res.groups).toHaveLength(1);
  });
});

describe("API: saveWeatherConfig", () => {
  test("sends entity and groups and returns ok", async () => {
    const groups: WeatherGroup[] = [
      { id: "rainy", label: "Rainy", conditions: ["rainy", "pouring"] },
    ];
    const callWS = vi.fn().mockResolvedValue({ ok: true });
    const res = await saveWeatherConfig({ callWS } as any, "weather.home", groups);
    expect(callWS).toHaveBeenCalledWith({
      type: "ambience/conditions/weather/config/save",
      entity: "weather.home",
      groups,
    });
    expect(res.ok).toBe(true);
  });

  test("saveWeatherConfig accepts null entity", async () => {
    const callWS = vi.fn().mockResolvedValue({ ok: true });
    await saveWeatherConfig({ callWS } as any, null, []);
    expect(callWS).toHaveBeenCalledWith({
      type: "ambience/conditions/weather/config/save",
      entity: null,
      groups: [],
    });
  });
});

// ---------------------------------------------------------------------------
// getKnownStates
// ---------------------------------------------------------------------------

describe("API: getKnownStates", () => {
  test("sends entity_id and returns states array", async () => {
    const callWS = vi.fn().mockResolvedValue({ states: ["on", "off"] });
    const res = await getKnownStates({ callWS } as any, "light.kitchen");
    expect(callWS).toHaveBeenCalledWith({
      type: "ambience/state/known_states",
      entity_id: "light.kitchen",
    });
    expect(res).toEqual({ states: ["on", "off"] });
  });

  test("getKnownStates returns empty states array when no states known", async () => {
    const callWS = vi.fn().mockResolvedValue({ states: [] });
    const res = await getKnownStates({ callWS } as any, "sensor.unknown");
    expect(res).toEqual({ states: [] });
  });
});
