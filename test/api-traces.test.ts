import { describe, expect, test, vi } from "vitest";

import { listTraces } from "../frontend/src/api";

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
});
