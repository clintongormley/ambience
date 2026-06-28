import { describe, expect, test, vi } from "vitest";
import {
  getInstallId,
  getOptions,
  listPeriods,
  resetPeriods,
  savePeriods,
} from "../frontend/src/api";
import type { PeriodDef } from "../frontend/src/types";

function makeFakeHass(): { callWS: ReturnType<typeof vi.fn>; sent: any[] } {
  const sent: any[] = [];
  const callWS = vi.fn(async (msg: any) => {
    sent.push(msg);
    if (msg.type === "ambience/time_of_day_periods/list") {
      return { builtins: {}, custom: {}, hidden: [] };
    }
    if (msg.type === "ambience/time_of_day_periods/save") {
      return { ok: true, warnings: [] };
    }
    if (msg.type === "ambience/time_of_day_periods/reset") {
      return { ok: true };
    }
  });
  return { callWS, sent };
}

describe("Ambience API period methods", () => {
  test("listPeriods sends the correct WS message", async () => {
    const { callWS, sent } = makeFakeHass();
    const fakeHass = { callWS } as any;
    const res = await listPeriods(fakeHass);
    expect(sent[0]).toEqual({ type: "ambience/time_of_day_periods/list" });
    expect(res).toEqual({ builtins: {}, custom: {}, hidden: [] });
  });

  test("savePeriods sends custom + hidden", async () => {
    const { callWS, sent } = makeFakeHass();
    const fakeHass = { callWS } as any;
    const custom: Record<string, PeriodDef> = {
      wind_down: {
        from: { kind: "time", hh: 20, mm: 0 },
        to: { kind: "time", hh: 22, mm: 0 },
        label: "Wind down",
      },
    };
    const res = await savePeriods(fakeHass, custom, ["daytime"]);
    expect(sent[0]).toEqual({
      type: "ambience/time_of_day_periods/save",
      custom,
      hidden: ["daytime"],
    });
    expect(res.ok).toBe(true);
  });

  test("resetPeriods sends the reset WS message", async () => {
    const { callWS, sent } = makeFakeHass();
    const fakeHass = { callWS } as any;
    const res = await resetPeriods(fakeHass);
    expect(sent[0]).toEqual({ type: "ambience/time_of_day_periods/reset" });
    expect(res.ok).toBe(true);
  });
});

describe("getInstallId", () => {
  test("sends the WS message and returns the install id", async () => {
    const callWS = vi.fn(async () => ({ install_id: "abc123" }));
    const res = await getInstallId({ callWS } as any);
    expect(callWS).toHaveBeenCalledWith({ type: "ambience/install_id" });
    expect(res).toBe("abc123");
  });

  test("returns null when the backend reports no install (mid-teardown)", async () => {
    const callWS = vi.fn(async () => ({ install_id: null }));
    expect(await getInstallId({ callWS } as any)).toBeNull();
  });
});

describe("getOptions", () => {
  test("sends the WS message and returns the panel options", async () => {
    const callWS = vi.fn(async () => ({ enable_ai_tab: true }));
    const res = await getOptions({ callWS } as any);
    expect(callWS).toHaveBeenCalledWith({ type: "ambience/options" });
    expect(res).toEqual({ enable_ai_tab: true });
  });
});
