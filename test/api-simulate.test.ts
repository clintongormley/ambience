import { describe, expect, test, vi } from "vitest";

import { simulate, simulateInputs, simulateSunAnchors } from "../frontend/src/api";

describe("simulate api", () => {
  test("simulateInputs sends scope + category", async () => {
    const callWS = vi.fn().mockResolvedValue({ knobs: [], has_time: true });
    const hass: any = { callWS };
    const res = await simulateInputs(hass, { scope_kind: "area", scope_id: "kitchen" }, "g1");
    expect(callWS).toHaveBeenCalledWith({
      type: "ambience/simulate/inputs",
      scope_kind: "area",
      scope_id: "kitchen",
      category: "g1",
    });
    expect(res.has_time).toBe(true);
  });

  test("simulate unwraps the result", async () => {
    const unit = { category: "g1", outcome: "acted" };
    const callWS = vi.fn().mockResolvedValue({ result: unit, applied_index: 3 });
    const hass: any = { callWS };
    const res = await simulate(
      hass,
      { scope_kind: "area", scope_id: "kitchen" },
      "g1",
      "2026-12-21T17:30:00.000Z",
      { "binary_sensor.motion": { state: "on" } },
      {},
      null,
    );
    expect(callWS).toHaveBeenCalledWith({
      type: "ambience/simulate",
      scope_kind: "area",
      scope_id: "kitchen",
      category: "g1",
      now: "2026-12-21T17:30:00.000Z",
      overrides: { "binary_sensor.motion": { state: "on" } },
      verdicts: {},
      prev_applied: null,
    });
    expect(res.result).toEqual(unit);
    expect(res.applied_index).toBe(3);
  });

  test("simulate sends verdicts alongside overrides", async () => {
    const callWS = vi.fn().mockResolvedValue({ result: { category: "g1" }, applied_index: null });
    const hass: any = { callWS };
    await simulate(
      hass,
      { scope_kind: "area", scope_id: "kitchen" },
      "g1",
      "2026-12-21T17:30:00.000Z",
      { "binary_sensor.motion": { state: "on" } },
      { script: { k: true } },
      2,
    );
    expect(callWS).toHaveBeenCalledWith({
      type: "ambience/simulate",
      scope_kind: "area",
      scope_id: "kitchen",
      category: "g1",
      now: "2026-12-21T17:30:00.000Z",
      overrides: { "binary_sensor.motion": { state: "on" } },
      verdicts: { script: { k: true } },
      prev_applied: 2,
    });
  });

  test("simulateSunAnchors sends the date and unwraps anchors", async () => {
    const anchors = {
      sunrise: "2026-07-04T03:47:00+00:00",
      sunset: "2026-07-04T20:21:00+00:00",
      noon: "2026-07-04T12:04:00+00:00",
      midnight: "2026-07-04T00:04:00+00:00",
      dawn: "2026-07-04T03:02:00+00:00",
      dusk: "2026-07-04T21:06:00+00:00",
    };
    const callWS = vi.fn().mockResolvedValue({ anchors });
    const hass: any = { callWS };
    const res = await simulateSunAnchors(hass, "2026-07-04");
    expect(callWS).toHaveBeenCalledWith({
      type: "ambience/simulate/sun_anchors",
      date: "2026-07-04",
    });
    expect(res).toEqual(anchors);
  });
});
