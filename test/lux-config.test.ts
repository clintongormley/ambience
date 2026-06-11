import { afterEach, describe, expect, test, vi } from "vitest";
import type { LuxRangeStoreView } from "../frontend/src/types";

vi.mock("../frontend/src/api.js", () => ({
  listLuxRanges: vi.fn(async () => ({ builtins: {}, custom: {}, hidden: [] })),
  saveLuxRanges: vi.fn(async () => ({ ok: true, warnings: [] })),
  resetLuxRanges: vi.fn(async () => ({ ok: true })),
}));

import "../frontend/src/views/lux-config";
import * as api from "../frontend/src/api.js";

const baseView: LuxRangeStoreView = {
  builtins: {
    dark: { max: 10 },
    dim: { min: 10, max: 50 },
    bright: { min: 300, max: 1000 },
  },
  custom: {},
  hidden: [],
};

async function mount(view: LuxRangeStoreView = baseView): Promise<any> {
  vi.mocked(api.listLuxRanges).mockResolvedValue(structuredClone(view));
  vi.mocked(api.saveLuxRanges).mockResolvedValue({ ok: true as const, warnings: [] });
  vi.mocked(api.resetLuxRanges).mockResolvedValue({ ok: true as const });
  const el: any = document.createElement("ambience-lux-config");
  el.hass = {} as any;
  document.body.appendChild(el);
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 0));
  await el.updateComplete;
  return el;
}

describe("ambience-lux-config", () => {
  let el: any;
  afterEach(() => {
    el?.remove();
    vi.clearAllMocks();
  });

  test("renders the effective list on mount", async () => {
    el = await mount();
    const rows = el.shadowRoot.querySelectorAll(".row");
    expect(rows.length).toBe(3);
    expect(el.shadowRoot.textContent).toContain("Dark");
    expect(el.shadowRoot.textContent).toContain("<10 lx");
  });

  test("built-ins are not deletable, only overridable", async () => {
    el = await mount();
    const row = el.shadowRoot.querySelector(".row");
    expect(row.querySelector('button[title="Delete"]')).toBeNull();
    expect(row.querySelector('button[title="Override"]')).toBeTruthy();
  });

  test("overriding a built-in opens the editor pre-filled", async () => {
    el = await mount();
    const row = el.shadowRoot.querySelector(".row");
    (row.querySelector('button[title="Override"]') as HTMLButtonElement).click();
    await el.updateComplete;
    const modal = el.shadowRoot.querySelector("ambience-lux-edit-modal") as any;
    expect(modal).toBeTruthy();
    expect(modal.existingId).toBe("dark");
    expect(modal.initial).toEqual(baseView.builtins.dark);
  });

  test("a custom override strikes the built-in and shows the custom below it", async () => {
    el = await mount({ ...baseView, custom: { dark: { max: 5, label: null } } });
    const rows = Array.from(el.shadowRoot.querySelectorAll(".row")) as HTMLElement[];
    expect(rows.length).toBe(4);
    const overridden = rows.find((r) => r.classList.contains("overridden"))!;
    const customRow = overridden.nextElementSibling as HTMLElement;
    expect(customRow.classList.contains("custom")).toBe(true);
    expect(customRow.querySelector('button[title="Delete"]')).toBeTruthy();
  });

  test("deleting a custom override reverts to the built-in", async () => {
    el = await mount({ ...baseView, custom: { dark: { max: 5, label: null } } });
    const customRow = el.shadowRoot.querySelector(".row.custom") as HTMLElement;
    (customRow.querySelector('button[title="Delete"]') as HTMLButtonElement).click();
    await new Promise((r) => setTimeout(r, 0));
    expect(api.saveLuxRanges).toHaveBeenCalledWith(expect.anything(), {}, []);
  });

  test("custom-only entries render and are deletable", async () => {
    el = await mount({ ...baseView, custom: { gloomy: { min: 5, max: 30, label: "Gloomy" } } });
    expect(el.shadowRoot.textContent).toContain("Gloomy");
    const customRow = el.shadowRoot.querySelector(".row.custom") as HTMLElement;
    expect(customRow.querySelector('button[title="Delete"]')).toBeTruthy();
  });

  test("add button opens the add modal", async () => {
    el = await mount();
    (el.shadowRoot.querySelector("button.add") as HTMLButtonElement).click();
    await el.updateComplete;
    const modal = el.shadowRoot.querySelector("ambience-lux-edit-modal") as any;
    expect(modal).toBeTruthy();
    expect(modal.existingId).toBeUndefined();
  });

  test("modal save persists the new custom entry with preserved hidden", async () => {
    el = await mount({ ...baseView, hidden: ["dim"] });
    el.shadowRoot.querySelector("button.add").dispatchEvent(new MouseEvent("click"));
    await el.updateComplete;
    el.shadowRoot.querySelector("ambience-lux-edit-modal").dispatchEvent(
      new CustomEvent("lux-range-save", {
        detail: { id: "gloomy", definition: { min: 5, max: 30, label: "Gloomy" } },
        bubbles: true,
        composed: true,
      }),
    );
    await new Promise((r) => setTimeout(r, 0));
    expect(api.saveLuxRanges).toHaveBeenCalledWith(
      expect.anything(),
      { gloomy: { min: 5, max: 30, label: "Gloomy" } },
      ["dim"],
    );
  });

  test("warnings render when a save reports dangling references", async () => {
    el = await mount();
    vi.mocked(api.saveLuxRanges).mockResolvedValueOnce({
      ok: true as const,
      warnings: [
        {
          scope_kind: "area",
          scope_id: "lr",
          scene_name: "Movie",
          missing_id: "gloomy",
        },
      ],
    });
    await el._saveState({});
    await el.updateComplete;
    expect(el.shadowRoot.textContent).toContain("gloomy");
  });
});

describe("error handling (review fixes)", () => {
  let el: any;
  afterEach(() => {
    el?.remove();
    vi.clearAllMocks();
  });

  test("a failed list shows an error instead of a blank panel", async () => {
    vi.mocked(api.listLuxRanges).mockRejectedValue(new Error("list boom"));
    el = document.createElement("ambience-lux-config");
    el.hass = {} as any;
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(el.shadowRoot.textContent).toContain("list boom");
  });

  test("a failed modal save keeps the modal open (the edit isn't discarded)", async () => {
    el = await mount();
    vi.mocked(api.saveLuxRanges).mockRejectedValue(new Error("save boom"));
    el._modal = { mode: "add" };
    await el.updateComplete;
    await el._onModalSave(
      new CustomEvent("save", { detail: { id: "gloomy", definition: { min: 1, max: 2 } } }),
    );
    await el.updateComplete;
    expect(el._modal.mode).not.toBe("closed");
    expect(el.shadowRoot.textContent).toContain("save boom");
  });
});
