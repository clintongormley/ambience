import { describe, test, expect, vi } from "vitest";

import { listTraces, clearTraces, countTraces } from "../frontend/src/api";

function fakeHass(result: unknown) {
  return { callWS: vi.fn().mockResolvedValue(result) } as any;
}

describe("trace api", () => {
  test("listTraces unwraps the traces array", async () => {
    const hass = fakeHass({ traces: [{ event_id: "e1" }] });
    const out = await listTraces(hass);
    expect(hass.callWS).toHaveBeenCalledWith({ type: "ambience/traces/list" });
    expect(out).toEqual([{ event_id: "e1" }]);
  });

  test("clearTraces sends the clear command", async () => {
    const hass = fakeHass({});
    await clearTraces(hass);
    expect(hass.callWS).toHaveBeenCalledWith({ type: "ambience/traces/clear" });
  });

  test("countTraces returns the summary", async () => {
    const hass = fakeHass({ count: 3, latest: "2026-06-01T00:00:00" });
    const out = await countTraces(hass);
    expect(hass.callWS).toHaveBeenCalledWith({ type: "ambience/traces/count" });
    expect(out).toEqual({ count: 3, latest: "2026-06-01T00:00:00" });
  });
});
