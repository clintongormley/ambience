import { describe, test, expect, vi } from "vitest";

import { simulateInputs, simulate } from "../frontend/src/api";

describe("simulate api", () => {
  test("simulateInputs sends scope + group", async () => {
    const callWS = vi.fn().mockResolvedValue({ knobs: [], has_time: true, opaque: false });
    const hass: any = { callWS };
    const res = await simulateInputs(hass, { scope_kind: "area", scope_id: "kitchen" }, "g1");
    expect(callWS).toHaveBeenCalledWith({
      type: "ambience/simulate/inputs",
      scope_kind: "area",
      scope_id: "kitchen",
      group: "g1",
    });
    expect(res.has_time).toBe(true);
  });

  test("simulate unwraps the result", async () => {
    const unit = { group: "g1", outcome: "acted" };
    const callWS = vi.fn().mockResolvedValue({ result: unit });
    const hass: any = { callWS };
    const res = await simulate(
      hass,
      { scope_kind: "area", scope_id: "kitchen" },
      "g1",
      "2026-12-21T17:30:00.000Z",
      { "binary_sensor.motion": { state: "on" } },
    );
    expect(callWS).toHaveBeenCalledWith({
      type: "ambience/simulate",
      scope_kind: "area",
      scope_id: "kitchen",
      group: "g1",
      now: "2026-12-21T17:30:00.000Z",
      overrides: { "binary_sensor.motion": { state: "on" } },
    });
    expect(res).toEqual(unit);
  });
});
