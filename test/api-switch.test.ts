import { describe, expect, test, vi } from "vitest";
import {
  getExposedAssistants,
  getSwitchDefaults,
  listSwitches,
  saveExposedAssistants,
  saveSwitchDefaults,
  setScopeEnabled,
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

  test("getExposedAssistants", async () => {
    const hass = mockHass(() => ({
      expose_assist: true,
      expose_google: false,
      expose_alexa: false,
    }));
    const r = await getExposedAssistants(hass);
    expect(hass.callWS).toHaveBeenCalledWith({ type: "ambience/exposed_assistants/list" });
    expect(r).toEqual({ expose_assist: true, expose_google: false, expose_alexa: false });
  });

  test("saveExposedAssistants", async () => {
    const hass = mockHass(() => ({ ok: true }));
    await saveExposedAssistants(hass, false, true, false);
    expect(hass.callWS).toHaveBeenCalledWith({
      type: "ambience/exposed_assistants/save",
      expose_assist: false,
      expose_google: true,
      expose_alexa: false,
    });
  });
});

describe("setScopeEnabled", () => {
  test("area scope", async () => {
    const hass = mockHass(() => ({ ok: true }));
    await setScopeEnabled(hass, { kind: "area", id: "living_room" }, false);
    expect(hass.callWS).toHaveBeenCalledWith({
      type: "ambience/set_scope_enabled",
      area_id: "living_room",
      enabled: false,
    });
  });

  test("house scope", async () => {
    const hass = mockHass(() => ({ ok: true }));
    await setScopeEnabled(hass, { kind: "house" }, true);
    expect(hass.callWS).toHaveBeenCalledWith({
      type: "ambience/set_scope_enabled",
      house: true,
      enabled: true,
    });
  });
});
