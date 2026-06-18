import { describe, expect, test, vi } from "vitest";

import { listAutoTriggers } from "../frontend/src/api";

describe("listAutoTriggers (read-only)", () => {
  test("omits scope_id for house", async () => {
    const sent: any[] = [];
    const callWS = vi.fn(async (msg: any) => {
      sent.push(msg);
      return {
        triggers: [
          { key: "entity:binary_sensor.motion", kind: "entity", entity_id: "binary_sensor.motion" },
        ],
        opaque: false,
      };
    });
    const res = await listAutoTriggers({ callWS } as any, "house");
    expect(sent[0]).toEqual({ type: "ambience/auto_triggers/list", scope_kind: "house" });
    expect(res.triggers[0].key).toBe("entity:binary_sensor.motion");
    expect(res.opaque).toBe(false);
  });

  test("includes scope_id for area/floor", async () => {
    const sent: any[] = [];
    const callWS = vi.fn(async (msg: any) => {
      sent.push(msg);
      return { triggers: [], opaque: false };
    });
    await listAutoTriggers({ callWS } as any, "area", "lr");
    expect(sent[0]).toEqual({
      type: "ambience/auto_triggers/list",
      scope_kind: "area",
      scope_id: "lr",
    });
  });

  test("includes category when provided", async () => {
    const sent: any[] = [];
    const callWS = vi.fn(async (msg: any) => {
      sent.push(msg);
      return { triggers: [], opaque: false };
    });
    await listAutoTriggers({ callWS } as any, "area", "lr", "lighting");
    expect(sent[0]).toEqual({
      type: "ambience/auto_triggers/list",
      scope_kind: "area",
      scope_id: "lr",
      category: "lighting",
    });
  });
});
