import { describe, test, expect, vi } from "vitest";
import { listGroups, saveGroups, deleteGroup } from "../frontend/src/api";
import type { RuleGroup } from "../frontend/src/types";

function makeFakeHass(): { callWS: ReturnType<typeof vi.fn>; sent: any[] } {
  const sent: any[] = [];
  const callWS = vi.fn(async (msg: any) => {
    sent.push(msg);
    if (msg.type === "ambience/groups/list") {
      return {
        groups: [
          { id: "g1", name: "Evening" },
          { id: "g2", name: "Morning" },
        ],
      };
    }
    if (msg.type === "ambience/groups/save") {
      return { ok: true };
    }
    if (msg.type === "ambience/groups/delete") {
      return { ok: true };
    }
  });
  return { callWS, sent };
}

describe("groups API", () => {
  test("listGroups sends correct message and returns parsed groups", async () => {
    const { callWS, sent } = makeFakeHass();
    const res = await listGroups({ callWS } as any);
    expect(sent[0]).toEqual({ type: "ambience/groups/list" });
    expect(res).toEqual([
      { id: "g1", name: "Evening" },
      { id: "g2", name: "Morning" },
    ]);
  });

  test("saveGroups sends the groups payload", async () => {
    const { callWS, sent } = makeFakeHass();
    const groups: RuleGroup[] = [{ id: "g1", name: "Evening" }];
    await saveGroups({ callWS } as any, groups);
    expect(sent[0]).toEqual({ type: "ambience/groups/save", groups });
  });

  test("deleteGroup sends the group_id", async () => {
    const { callWS, sent } = makeFakeHass();
    await deleteGroup({ callWS } as any, "g1");
    expect(sent[0]).toEqual({ type: "ambience/groups/delete", group_id: "g1" });
  });
});
