import { describe, test, expect, vi } from "vitest";
import { listCategories, saveCategories, deleteCategory } from "../frontend/src/api";
import type { RuleCategory } from "../frontend/src/types";

function makeFakeHass(): { callWS: ReturnType<typeof vi.fn>; sent: any[] } {
  const sent: any[] = [];
  const callWS = vi.fn(async (msg: any) => {
    sent.push(msg);
    if (msg.type === "ambience/categories/list") {
      return {
        categories: [
          { id: "g1", name: "Evening" },
          { id: "g2", name: "Morning" },
        ],
      };
    }
    if (msg.type === "ambience/categories/save") {
      return { ok: true };
    }
    if (msg.type === "ambience/categories/delete") {
      return { ok: true };
    }
  });
  return { callWS, sent };
}

describe("categories API", () => {
  test("listCategories sends correct message and returns parsed categories", async () => {
    const { callWS, sent } = makeFakeHass();
    const res = await listCategories({ callWS } as any);
    expect(sent[0]).toEqual({ type: "ambience/categories/list" });
    expect(res).toEqual([
      { id: "g1", name: "Evening" },
      { id: "g2", name: "Morning" },
    ]);
  });

  test("saveCategories sends the categories payload", async () => {
    const { callWS, sent } = makeFakeHass();
    const categories: RuleCategory[] = [{ id: "g1", name: "Evening" }];
    await saveCategories({ callWS } as any, categories);
    expect(sent[0]).toEqual({ type: "ambience/categories/save", categories });
  });

  test("deleteCategory sends the category_id", async () => {
    const { callWS, sent } = makeFakeHass();
    await deleteCategory({ callWS } as any, "g1");
    expect(sent[0]).toEqual({ type: "ambience/categories/delete", category_id: "g1" });
  });
});
