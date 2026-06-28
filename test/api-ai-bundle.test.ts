import { afterEach, describe, expect, test, vi } from "vitest";
import {
  downloadAiBundle,
  getScopeConfig,
  saveScopeConfig,
  validateScopeConfig,
} from "../frontend/src/api";

describe("validateScopeConfig", () => {
  test("sends the config to ambience/validate", async () => {
    const callWS = vi.fn(async () => ({ ok: true }));
    const hass: any = { callWS };
    await validateScopeConfig(hass, { scenes: [] });
    expect(callWS).toHaveBeenCalledWith({ type: "ambience/validate", config: { scenes: [] } });
  });
});

describe("getScopeConfig / saveScopeConfig dispatch by scope kind", () => {
  test("area", async () => {
    const callWS = vi.fn(async () => ({ ok: true, config: { scenes: [] } }));
    const hass: any = { callWS };
    await getScopeConfig(hass, { kind: "area", id: "lr" });
    expect(callWS).toHaveBeenCalledWith({ type: "ambience/area/get", area_id: "lr" });
    await saveScopeConfig(hass, { kind: "area", id: "lr" }, { scenes: [] });
    expect(callWS).toHaveBeenCalledWith(
      expect.objectContaining({ type: "ambience/area/save", area_id: "lr" }),
    );
  });

  test("floor", async () => {
    const callWS = vi.fn(async () => ({ ok: true, config: { scenes: [] } }));
    const hass: any = { callWS };
    await saveScopeConfig(hass, { kind: "floor", id: "up" }, { scenes: [] });
    expect(callWS).toHaveBeenCalledWith(
      expect.objectContaining({ type: "ambience/floor/save", floor_id: "up" }),
    );
  });

  test("house", async () => {
    const callWS = vi.fn(async () => ({ ok: true, config: { scenes: [] } }));
    const hass: any = { callWS };
    await getScopeConfig(hass, { kind: "house" });
    expect(callWS).toHaveBeenCalledWith({ type: "ambience/house/get" });
    await saveScopeConfig(hass, { kind: "house" }, { scenes: [] });
    expect(callWS).toHaveBeenCalledWith(expect.objectContaining({ type: "ambience/house/save" }));
  });
});

describe("downloadAiBundle", () => {
  afterEach(() => vi.restoreAllMocks());

  test("requests the bundle and triggers a JSON download", async () => {
    const callWS = vi.fn(async () => ({ ambience_ai_bundle: 1, catalog: {} }));
    const hass: any = { callWS };
    vi.spyOn(URL, "createObjectURL").mockImplementation(() => "blob:x");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
    const clicks: HTMLAnchorElement[] = [];
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
      this: HTMLAnchorElement,
    ) {
      clicks.push(this);
    });

    await downloadAiBundle(hass);

    expect(callWS).toHaveBeenCalledWith({ type: "ambience/ai_bundle" });
    expect(clicks).toHaveLength(1);
    expect(clicks[0].download).toBe("ambience-ai-bundle.json");
  });
});
