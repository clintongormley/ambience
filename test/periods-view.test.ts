import { describe, test, expect, afterEach, vi } from "vitest";
import "../frontend/src/views/periods-view";
import type { PeriodStoreView, PeriodDef } from "../frontend/src/types";

// Mock the api module — the component imports listPeriods/savePeriods/resetPeriods
// as standalone functions from "../api.js". Mock them at the module level.
vi.mock("../frontend/src/api", () => ({
  listPeriods: vi.fn(),
  savePeriods: vi.fn(),
  resetPeriods: vi.fn(),
}));

import * as api from "../frontend/src/api";

const baseView: PeriodStoreView = {
  builtins: {
    morning:   { from: {kind:"sun",anchor:"sunrise",offset_min:30}, to: {kind:"sun",anchor:"noon",offset_min:-60} },
    afternoon: { from: {kind:"sun",anchor:"noon",offset_min:60}, to: {kind:"sun",anchor:"sunset",offset_min:-30} },
    daytime:   { from: {kind:"sun",anchor:"sunrise",offset_min:0}, to: {kind:"sun",anchor:"sunset",offset_min:0} },
  },
  custom: {},
  hidden: [],
};

async function mount(view: PeriodStoreView = baseView): Promise<any> {
  vi.mocked(api.listPeriods).mockResolvedValue(structuredClone(view));
  vi.mocked(api.savePeriods).mockResolvedValue({ ok: true as const, warnings: [] });
  vi.mocked(api.resetPeriods).mockResolvedValue({ ok: true as const });
  const el: any = document.createElement("ambience-periods-view");
  el.hass = {} as any;  // not used by the mocked api
  document.body.appendChild(el);
  await el.updateComplete;
  // wait for the listPeriods microtask
  await new Promise(r => setTimeout(r, 0));
  await el.updateComplete;
  return el;
}

describe("ambience-periods-view", () => {
  let el: any;
  afterEach(() => { el?.remove(); vi.clearAllMocks(); });

  test("renders the effective list on mount", async () => {
    el = await mount();
    const rows = el.shadowRoot.querySelectorAll(".row");
    expect(rows.length).toBe(3); // morning, afternoon, day
  });

  test("delete on a built-in adds id to hidden", async () => {
    el = await mount();
    const rows = el.shadowRoot.querySelectorAll(".row");
    const delBtn = rows[0].querySelector('button[title="Delete"]') as HTMLButtonElement;
    delBtn.click();
    await new Promise(r => setTimeout(r, 0));
    await el.updateComplete;
    expect(api.savePeriods).toHaveBeenCalledWith(expect.anything(), {}, ["morning"]);
  });

  test("custom entry deletion removes from custom map", async () => {
    const view = { ...baseView, custom: {
      wind_down: { from: {kind:"time",hh:20,mm:0} as const, to: {kind:"time",hh:22,mm:0} as const, label: "Wind down" },
    }};
    el = await mount(view);
    const rows = el.shadowRoot.querySelectorAll(".row");
    const lastRow = rows[rows.length - 1];
    const delBtn = lastRow.querySelector('button[title="Delete"]') as HTMLButtonElement;
    delBtn.click();
    await new Promise(r => setTimeout(r, 0));
    expect(api.savePeriods).toHaveBeenCalledWith(expect.anything(), {}, []);
  });

  test("revert removes custom shadow for builtin-edited entry", async () => {
    const view = { ...baseView, custom: {
      afternoon: { from: {kind:"time",hh:13,mm:0} as const, to: {kind:"time",hh:17,mm:0} as const, label: null },
    }};
    el = await mount(view);
    const revertBtn = el.shadowRoot.querySelector('button[title="Revert to default"]') as HTMLButtonElement;
    revertBtn.click();
    await new Promise(r => setTimeout(r, 0));
    expect(api.savePeriods).toHaveBeenCalledWith(expect.anything(), {}, []);
  });

  test("revert on hidden builtin removes from hidden list", async () => {
    el = await mount({ ...baseView, hidden: ["daytime"] });
    const rows = el.shadowRoot.querySelectorAll(".row");
    const lastRow = rows[rows.length - 1];
    const revertBtn = lastRow.querySelector('button[title="Restore"]') as HTMLButtonElement;
    revertBtn.click();
    await new Promise(r => setTimeout(r, 0));
    expect(api.savePeriods).toHaveBeenCalledWith(expect.anything(), {}, []);
  });

  test("reset all calls resetPeriods after confirm", async () => {
    el = await mount({ ...baseView, hidden: ["daytime"] });
    vi.spyOn(window, "confirm").mockReturnValue(true);
    const resetBtn = el.shadowRoot.querySelector("header button") as HTMLButtonElement;
    resetBtn.click();
    await new Promise(r => setTimeout(r, 0));
    expect(api.resetPeriods).toHaveBeenCalled();
  });

  test("reset all is cancellable", async () => {
    el = await mount({ ...baseView, hidden: ["daytime"] });
    vi.spyOn(window, "confirm").mockReturnValue(false);
    const resetBtn = el.shadowRoot.querySelector("header button") as HTMLButtonElement;
    resetBtn.click();
    await new Promise(r => setTimeout(r, 0));
    expect(api.resetPeriods).not.toHaveBeenCalled();
  });

  test("Add opens the modal", async () => {
    el = await mount();
    const addBtn = el.shadowRoot.querySelector("button.add") as HTMLButtonElement;
    addBtn.click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("ambience-period-edit-modal")).toBeTruthy();
  });

  test("modal save persists new custom period", async () => {
    el = await mount();
    const addBtn = el.shadowRoot.querySelector("button.add") as HTMLButtonElement;
    addBtn.click();
    await el.updateComplete;
    const modal = el.shadowRoot.querySelector("ambience-period-edit-modal")!;
    modal.dispatchEvent(new CustomEvent("period-save", {
      bubbles: true, composed: true,
      detail: { id: "wind_down", definition: {
        from: {kind:"time",hh:20,mm:0}, to: {kind:"time",hh:22,mm:0}, label: "Wind down",
      }},
    }));
    await new Promise(r => setTimeout(r, 0));
    expect(api.savePeriods).toHaveBeenCalledWith(
      expect.anything(),
      { wind_down: { from: {kind:"time",hh:20,mm:0}, to: {kind:"time",hh:22,mm:0}, label: "Wind down" } },
      [],
    );
  });

  test("displays warnings banner when save returns warnings", async () => {
    el = await mount();
    vi.mocked(api.savePeriods).mockResolvedValueOnce({
      ok: true,
      warnings: [{ area_id: "abc", rule_name: "Evening rule", missing_period: "evening" }],
    });
    const rows = el.shadowRoot.querySelectorAll(".row");
    (rows[0].querySelector('button[title="Delete"]') as HTMLButtonElement).click();
    await new Promise(r => setTimeout(r, 0));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".warnings")).toBeTruthy();
    expect(el.shadowRoot.querySelector(".warnings").textContent).toContain("Evening rule");
  });
});
