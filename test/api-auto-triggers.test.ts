import { describe, test, expect, vi } from "vitest";
import { listAutoTriggers, setAutoTrigger } from "../frontend/src/api";

function makeFakeHass(): { callWS: ReturnType<typeof vi.fn>; sent: any[] } {
  const sent: any[] = [];
  const callWS = vi.fn(async (msg: any) => {
    sent.push(msg);
    if (msg.type === "ambience/auto_triggers/list") {
      return {
        triggers: [
          { key: "entity:binary_sensor.motion", kind: "entity", entity_id: "binary_sensor.motion", enabled: true },
        ],
        opaque: false,
      };
    }
    if (msg.type === "ambience/auto_triggers/set_trigger") {
      return { ok: true };
    }
  });
  return { callWS, sent };
}

describe("auto-trigger API", () => {
  test("listAutoTriggers omits scope_id for house", async () => {
    const { callWS, sent } = makeFakeHass();
    const res = await listAutoTriggers({ callWS } as any, "house");
    expect(sent[0]).toEqual({ type: "ambience/auto_triggers/list", scope_kind: "house" });
    expect(res.triggers[0].key).toBe("entity:binary_sensor.motion");
    expect(res.opaque).toBe(false);
  });

  test("listAutoTriggers includes scope_id for area", async () => {
    const { sent } = makeFakeHass();
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

  test("setAutoTrigger sends key + enabled", async () => {
    const { callWS, sent } = makeFakeHass();
    const res = await setAutoTrigger({ callWS } as any, "area", "lr", "clock:18:00", false);
    expect(sent[0]).toEqual({
      type: "ambience/auto_triggers/set_trigger",
      scope_kind: "area",
      scope_id: "lr",
      key: "clock:18:00",
      enabled: false,
    });
    expect(res.ok).toBe(true);
  });
});
