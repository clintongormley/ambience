import { describe, test, expect, vi } from "vitest";
import {
  getSwitchDefaults,
  listSwitches,
  saveSwitchDefaults,
  saveHouseSwitch,
  saveFloorSwitch,
  saveAreaSwitch,
} from "../frontend/src/api.js";

function mockHass(impl: (msg: any) => any) {
  return { callWS: vi.fn(impl) } as any;
}

describe("switch API wrappers", () => {
  test("getSwitchDefaults", async () => {
    const hass = mockHass(() => ({ name: "X", auto_on_delay_seconds: 600 }));
    const r = await getSwitchDefaults(hass);
    expect(hass.callWS).toHaveBeenCalledWith({ type: "ambience/switch_defaults/list" });
    expect(r).toEqual({ name: "X", auto_on_delay_seconds: 600 });
  });

  test("saveSwitchDefaults", async () => {
    const hass = mockHass(() => ({ ok: true }));
    await saveSwitchDefaults(hass, "X", 600);
    expect(hass.callWS).toHaveBeenCalledWith({
      type: "ambience/switch_defaults/save",
      name: "X",
      auto_on_delay_seconds: 600,
    });
  });

  test("listSwitches", async () => {
    const rows = [{ scope_kind: "house", scope_id: null, entity_id: "switch.global_ambience" }];
    const hass = mockHass(() => rows);
    const r = await listSwitches(hass);
    expect(hass.callWS).toHaveBeenCalledWith({ type: "ambience/switches/list" });
    expect(r).toEqual(rows);
  });

  test("saveHouseSwitch", async () => {
    const hass = mockHass(() => ({ ok: true }));
    await saveHouseSwitch(hass, "Manor", 300);
    expect(hass.callWS).toHaveBeenCalledWith({
      type: "ambience/house/switch/save",
      name: "Manor",
      auto_on_delay_seconds: 300,
    });
  });

  test("saveFloorSwitch with nulls", async () => {
    const hass = mockHass(() => ({ ok: true }));
    await saveFloorSwitch(hass, "f1", null, null);
    expect(hass.callWS).toHaveBeenCalledWith({
      type: "ambience/floor/switch/save",
      floor_id: "f1",
      name: null,
      auto_on_delay_seconds: null,
    });
  });

  test("saveAreaSwitch with nulls", async () => {
    const hass = mockHass(() => ({ ok: true }));
    await saveAreaSwitch(hass, "a1", null, null);
    expect(hass.callWS).toHaveBeenCalledWith({
      type: "ambience/area/switch/save",
      area_id: "a1",
      name: null,
      auto_on_delay_seconds: null,
    });
  });
});
