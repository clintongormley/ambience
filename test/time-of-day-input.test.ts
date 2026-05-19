import { describe, test, expect, afterEach } from "vitest";
import "../frontend/src/views/time-of-day-input";
import type { PeriodStoreView, TimeOfDayPredicate } from "../frontend/src/types";

const periods: PeriodStoreView = {
  builtins: {
    morning:   { from: {kind:"sun",anchor:"sunrise",offset_min:30}, to: {kind:"sun",anchor:"noon",offset_min:-60} },
    afternoon: { from: {kind:"sun",anchor:"noon",offset_min:60}, to: {kind:"sun",anchor:"sunset",offset_min:-30} },
    evening:   { from: {kind:"sun",anchor:"sunset",offset_min:0}, to: {kind:"sun",anchor:"dusk",offset_min:0} },
  },
  custom: {
    wind_down: { from: {kind:"time",hh:20,mm:0}, to: {kind:"time",hh:22,mm:0}, label: "Wind down" },
  },
  hidden: ["morning"],
};

async function mount(value: TimeOfDayPredicate = null): Promise<any> {
  const el: any = document.createElement("ambience-time-of-day-input");
  el.value = value;
  el.periods = periods;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function captureEmit(el: HTMLElement): () => TimeOfDayPredicate | undefined {
  let detail: { value: TimeOfDayPredicate } | undefined;
  el.addEventListener("value-changed", ((e: CustomEvent) => { detail = e.detail; }) as any);
  return () => detail?.value;
}

function pickPeriod(el: any, idx: number, value: string) {
  const select = el.shadowRoot.querySelectorAll(".entry select")[idx] as HTMLSelectElement;
  select.value = value;
  select.dispatchEvent(new Event("change"));
}

describe("ambience-time-of-day-input", () => {
  let el: any;
  afterEach(() => { el?.remove(); });

  test("renders Any time option as first entry initial state", async () => {
    el = await mount(null);
    const select = el.shadowRoot.querySelector(".entry select") as HTMLSelectElement;
    expect(select.value).toBe("__any__");
  });

  test("dropdown lists effective periods (excludes hidden, includes custom)", async () => {
    el = await mount(null);
    const options = Array.from(el.shadowRoot.querySelectorAll(".entry option"))
      .map((o: any) => o.value);
    expect(options).toContain("afternoon");
    expect(options).toContain("evening");
    expect(options).toContain("wind_down");
    expect(options).not.toContain("morning"); // hidden
  });

  test("selecting a named period emits {period: id}", async () => {
    el = await mount(null);
    const get = captureEmit(el);
    pickPeriod(el, 0, "afternoon");
    expect(get()).toEqual({ period: "afternoon" });
  });

  test("selecting Any time emits null", async () => {
    el = await mount({ period: "afternoon" });
    const get = captureEmit(el);
    pickPeriod(el, 0, "__any__");
    expect(get()).toBeNull();
  });

  test("selecting Custom range emits a default from/to range", async () => {
    el = await mount(null);
    const get = captureEmit(el);
    pickPeriod(el, 0, "__custom__");
    const v = get() as any;
    expect(v).toHaveProperty("from");
    expect(v).toHaveProperty("to");
    expect(v.from.kind).toBe("time");
  });

  test("custom range editors render when Custom range selected", async () => {
    el = await mount({ from: {kind:"time",hh:9,mm:0}, to: {kind:"time",hh:17,mm:0} });
    expect(el.shadowRoot.querySelectorAll("ambience-time-endpoint").length).toBe(2);
  });

  test("loading a {period} predicate selects the right dropdown value", async () => {
    el = await mount({ period: "afternoon" });
    const select = el.shadowRoot.querySelector(".entry select") as HTMLSelectElement;
    expect(select.value).toBe("afternoon");
  });

  test("clicking add-another produces a list predicate", async () => {
    el = await mount({ period: "afternoon" });
    const get = captureEmit(el);
    const addBtn = el.shadowRoot.querySelector(".add-btn") as HTMLButtonElement;
    addBtn.click();
    await el.updateComplete;
    const v = get() as any;
    expect(Array.isArray(v)).toBe(true);
    expect(v.length).toBe(2);
    expect(v[0]).toEqual({ period: "afternoon" });
  });

  test("removing entries back to one normalises to single value", async () => {
    el = await mount([{ period: "afternoon" }, { period: "evening" }]);
    await el.updateComplete;
    const get = captureEmit(el);
    const removeBtn = el.shadowRoot.querySelectorAll(".remove")[1] as HTMLButtonElement;
    removeBtn.click();
    await el.updateComplete;
    expect(get()).toEqual({ period: "afternoon" });
  });

  test("removing the only entry normalises to null", async () => {
    el = await mount({ period: "afternoon" });
    const get = captureEmit(el);
    // Clear via dropdown to "Any time" (no remove button on the sole entry)
    pickPeriod(el, 0, "__any__");
    expect(get()).toBeNull();
  });

  test("single entry stays expanded — no summary chip", async () => {
    el = await mount({ period: "afternoon" });
    // No .summary-chip element for the single-entry case
    expect(el.shadowRoot.querySelectorAll(".summary-chip").length).toBe(0);
    // The select is rendered (expanded form)
    expect(el.shadowRoot.querySelector(".entry select")).toBeTruthy();
  });

  test("2+ entries render n-1 summaries and 1 expanded entry", async () => {
    el = await mount([{ period: "afternoon" }, { period: "evening" }]);
    await el.updateComplete;
    // One chip (the non-open entry) + one expanded form (the open one)
    expect(el.shadowRoot.querySelectorAll(".summary-chip").length).toBe(1);
    expect(el.shadowRoot.querySelectorAll(".entry select").length).toBe(1);
  });

  test("clicking add-another opens the newly added entry, collapses the previous", async () => {
    el = await mount({ period: "afternoon" });
    const addBtn = el.shadowRoot.querySelector(".add-btn") as HTMLButtonElement;
    addBtn.click();
    await el.updateComplete;
    // Two entries; the first should now be a summary chip, the second expanded
    expect(el.shadowRoot.querySelectorAll(".summary-chip").length).toBe(1);
    expect(el.shadowRoot.querySelectorAll(".entry select").length).toBe(1);
  });

  test("clicking a summary chip expands it and collapses the previously open one", async () => {
    el = await mount([{ period: "afternoon" }, { period: "evening" }]);
    await el.updateComplete;
    // The expanded entry is initially the last one (index 1 = evening)
    let expandedSelect = el.shadowRoot.querySelector(".entry select") as HTMLSelectElement;
    expect(expandedSelect.value).toBe("evening");
    // Click the summary chip (index 0 = afternoon)
    const chip = el.shadowRoot.querySelector(".summary-chip") as HTMLElement;
    chip.click();
    await el.updateComplete;
    // Now the expanded entry should be afternoon
    expandedSelect = el.shadowRoot.querySelector(".entry select") as HTMLSelectElement;
    expect(expandedSelect.value).toBe("afternoon");
  });
});
