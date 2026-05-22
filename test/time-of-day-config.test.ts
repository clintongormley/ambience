import { describe, test, expect, afterEach, vi } from "vitest";
import type { PeriodStoreView } from "../frontend/src/types";

// Mock the api module — the component imports listPeriods/savePeriods/resetPeriods
// as standalone functions from "../api.js". Mock them at the module level. Each
// test (or the mount helper) overrides the return values as needed.
vi.mock("../frontend/src/api.js", () => ({
  listPeriods: vi.fn(async () => ({
    builtins: {
      morning: { from: { kind: "sun", anchor: "sunrise", offset_min: 0 }, to: { kind: "sun", anchor: "noon", offset_min: 0 } },
    },
    custom: {},
    hidden: [],
  })),
  savePeriods: vi.fn(async () => ({ ok: true, warnings: [] })),
  resetPeriods: vi.fn(async () => ({ ok: true })),
}));

import "../frontend/src/views/time-of-day-config";
import * as api from "../frontend/src/api.js";

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
  const el: any = document.createElement("ambience-time-of-day-config");
  el.hass = {} as any;  // not used by the mocked api
  document.body.appendChild(el);
  await el.updateComplete;
  // wait for the listPeriods microtask
  await new Promise(r => setTimeout(r, 0));
  await el.updateComplete;
  return el;
}

describe("ambience-time-of-day-config", () => {
  let el: any;
  afterEach(() => { el?.remove(); vi.clearAllMocks(); });

  test("renders the builtin morning row after load", async () => {
    el = document.createElement("ambience-time-of-day-config");
    el.hass = {};
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(el.shadowRoot.textContent).toContain("Morning");
  });

  test("renders the effective list on mount", async () => {
    el = await mount();
    const rows = el.shadowRoot.querySelectorAll(".row");
    expect(rows.length).toBe(3); // morning, afternoon, day
  });

  test("built-ins are not deletable, only overridable", async () => {
    el = await mount();
    const rows = el.shadowRoot.querySelectorAll(".row");
    // No delete on any built-in row; each offers an Override action instead.
    expect(rows[0].querySelector('button[title="Delete"]')).toBeNull();
    expect(rows[0].querySelector('button[title="Override"]')).toBeTruthy();
  });

  test("overriding a built-in opens the editor pre-filled with its definition", async () => {
    el = await mount();
    const rows = el.shadowRoot.querySelectorAll(".row");
    (rows[0].querySelector('button[title="Override"]') as HTMLButtonElement).click();
    await el.updateComplete;
    const modal = el.shadowRoot.querySelector("ambience-period-edit-modal") as any;
    expect(modal).toBeTruthy();
    expect(modal.existingId).toBe("morning");
    expect(modal.initial).toEqual(baseView.builtins.morning);
  });

  test("a custom override strikes the built-in and shows the custom below it", async () => {
    const view = { ...baseView, custom: {
      afternoon: { from: {kind:"time",hh:13,mm:0} as const, to: {kind:"time",hh:17,mm:0} as const, label: null },
    }};
    el = await mount(view);
    const rows = Array.from(el.shadowRoot.querySelectorAll(".row")) as HTMLElement[];
    // 3 built-ins + 1 override row = 4 rows
    expect(rows.length).toBe(4);
    const overridden = rows.find((r) => r.classList.contains("overridden"))!;
    expect(overridden).toBeTruthy();
    // the overridden built-in has no actions; the custom row that follows is editable/deletable
    const customRow = overridden.nextElementSibling as HTMLElement;
    expect(customRow.classList.contains("custom")).toBe(true);
    expect(customRow.querySelector('button[title="Delete"]')).toBeTruthy();
  });

  test("deleting a custom override reverts to the built-in", async () => {
    const view = { ...baseView, custom: {
      afternoon: { from: {kind:"time",hh:13,mm:0} as const, to: {kind:"time",hh:17,mm:0} as const, label: null },
    }};
    el = await mount(view);
    const customRow = Array.from(el.shadowRoot.querySelectorAll(".row.custom"))[0] as HTMLElement;
    (customRow.querySelector('button[title="Delete"]') as HTMLButtonElement).click();
    await new Promise(r => setTimeout(r, 0));
    expect(api.savePeriods).toHaveBeenCalledWith(expect.anything(), {}, []);
  });

  test("custom-only entry deletion removes it from the custom map", async () => {
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

  test("there is no reset-defaults button", async () => {
    el = await mount();
    expect(el.shadowRoot.querySelector("header button")).toBeNull();
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
    const view = { ...baseView, custom: {
      wind_down: { from: {kind:"time",hh:20,mm:0} as const, to: {kind:"time",hh:22,mm:0} as const, label: "Wind down" },
    }};
    el = await mount(view);
    vi.mocked(api.savePeriods).mockResolvedValueOnce({
      ok: true,
      warnings: [{ area_id: "abc", rule_name: "Evening rule", missing_period: "evening" }],
    });
    const customRow = Array.from(el.shadowRoot.querySelectorAll(".row.custom"))[0] as HTMLElement;
    (customRow.querySelector('button[title="Delete"]') as HTMLButtonElement).click();
    await new Promise(r => setTimeout(r, 0));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".warnings")).toBeTruthy();
    expect(el.shadowRoot.querySelector(".warnings").textContent).toContain("Evening rule");
  });
});
