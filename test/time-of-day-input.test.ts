import { afterEach, describe, expect, test } from "vitest";
import "../frontend/src/views/time-of-day-input";
import type { PeriodStoreView, TimeOfDayPredicate } from "../frontend/src/types";

const periods: PeriodStoreView = {
  builtins: {
    morning: {
      from: { kind: "sun", anchor: "sunrise", offset_min: 30 },
      to: { kind: "sun", anchor: "noon", offset_min: -60 },
    },
    afternoon: {
      from: { kind: "sun", anchor: "noon", offset_min: 60 },
      to: { kind: "sun", anchor: "sunset", offset_min: -30 },
    },
    evening: {
      from: { kind: "sun", anchor: "sunset", offset_min: 0 },
      to: { kind: "sun", anchor: "dusk", offset_min: 0 },
    },
  },
  custom: {
    wind_down: {
      from: { kind: "time", hh: 20, mm: 0 },
      to: { kind: "time", hh: 22, mm: 0 },
      label: "Wind down",
    },
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
  el.addEventListener("value-changed", ((e: CustomEvent) => {
    detail = e.detail;
  }) as any);
  return () => detail?.value;
}

function pickPeriod(el: any, idx: number, value: string) {
  const select = el.shadowRoot.querySelectorAll(".entry select")[idx] as HTMLSelectElement;
  select.value = value;
  select.dispatchEvent(new Event("change"));
}

describe("ambience-time-of-day-input", () => {
  let el: any;
  afterEach(() => {
    el?.remove();
  });

  test("renders Any time option as first entry initial state", async () => {
    el = await mount(null);
    const select = el.shadowRoot.querySelector(".entry select") as HTMLSelectElement;
    expect(select.value).toBe("__any__");
  });

  test("dropdown lists effective periods (excludes hidden, includes custom)", async () => {
    el = await mount(null);
    const options = Array.from(el.shadowRoot.querySelectorAll(".entry option")).map(
      (o: any) => o.value,
    );
    expect(options).toContain("afternoon");
    expect(options).toContain("evening");
    expect(options).toContain("wind_down");
    expect(options).not.toContain("morning"); // hidden
  });

  test("the chooser lists Daytime first, then the day's progression", async () => {
    const def = {
      from: { kind: "sun" as const, anchor: "dawn", offset_min: 0 },
      to: { kind: "sun" as const, anchor: "dusk", offset_min: 0 },
    };
    el = document.createElement("ambience-time-of-day-input");
    el.value = null;
    el.periods = {
      // Supplied in the backend's "specific-first" order; the chooser reorders.
      builtins: {
        dawn: def,
        morning: def,
        afternoon: def,
        evening: def,
        nighttime: def,
        daytime: def,
      },
      custom: {},
      hidden: [],
    } as PeriodStoreView;
    document.body.appendChild(el);
    await el.updateComplete;
    const builtinOpts = Array.from(el.shadowRoot.querySelectorAll(".entry option"))
      .map((o: any) => o.value)
      // Keep only period ids (drop the __any__/__custom__ sentinels and the
      // "──────" separator).
      .filter((v: string) => /^[a-z]/.test(v));
    expect(builtinOpts).toEqual([
      "daytime",
      "dawn",
      "morning",
      "afternoon",
      "evening",
      "nighttime",
    ]);
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
    el = await mount({ from: { kind: "time", hh: 9, mm: 0 }, to: { kind: "time", hh: 17, mm: 0 } });
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

  test("removing an entry before openIdx shifts openIdx down by one", async () => {
    // Start with 3 entries; openIdx = last (2)
    el = await mount([
      { period: "afternoon" },
      { period: "evening" },
      { from: { kind: "time", hh: 9, mm: 0 }, to: { kind: "time", hh: 10, mm: 0 } },
    ]);
    await el.updateComplete;
    // Chips are rendered for all non-open entries; remove the chip for index 0
    const chips = el.shadowRoot.querySelectorAll(".summary-chip") as NodeListOf<HTMLElement>;
    expect(chips.length).toBe(2); // indices 0 and 1 are chips; index 2 is expanded
    // Remove index 0 via its remove button inside the chip
    const removeInChip = chips[0].querySelector(".remove") as HTMLButtonElement;
    removeInChip.click();
    await el.updateComplete;
    // After removing index 0 (before openIdx=2), openIdx should shift to 1
    // The expanded entry should now be the range (previously at index 2, now index 1)
    const expandedEndpoints = el.shadowRoot.querySelectorAll("ambience-time-endpoint");
    expect(expandedEndpoints.length).toBe(2); // range entry is still expanded
  });

  test("summary chip for a range entry shows summarised text", async () => {
    // Two entries; range is at index 0 (chip), period at index 1 (open)
    el = await mount([
      { from: { kind: "time", hh: 9, mm: 0 }, to: { kind: "time", hh: 17, mm: 0 } },
      { period: "evening" },
    ]);
    await el.updateComplete;
    // Index 0 is rendered as a chip; index 1 is expanded
    const chip = el.shadowRoot.querySelector(".summary-chip .chip-label") as HTMLElement;
    expect(chip).toBeTruthy();
    // Should have some text (summariseTimeOfDay returns "09:00 – 17:00" or similar)
    expect(chip.textContent!.trim().length).toBeGreaterThan(0);
  });

  // ── missing-branch coverage ──────────────────────────────────────────────

  test("range value-changed from time-endpoint updates the from endpoint and emits", async () => {
    // Mount with a range entry so _onRangeChange happy path (lines 149-152) is hit
    el = await mount({ from: { kind: "time", hh: 9, mm: 0 }, to: { kind: "time", hh: 17, mm: 0 } });
    const get = captureEmit(el);
    (el as any)._onRangeChange(
      0,
      "from",
      new CustomEvent("value-changed", {
        detail: { value: { kind: "time", hh: 10, mm: 30 } },
      }),
    );
    const v = get() as any;
    expect(v).toHaveProperty("from", { kind: "time", hh: 10, mm: 30 });
    expect(v).toHaveProperty("to", { kind: "time", hh: 17, mm: 0 });
  });

  test("sun endpoint clamp survives time-of-day-input round-trip", async () => {
    // Mount with a range whose 'from' carries a clamp
    const clampedFrom = {
      kind: "sun" as const,
      anchor: "sunrise" as const,
      offset_min: 0,
      clamp: { dir: "not_before" as const, hh: 8, mm: 30 },
    };
    el = await mount({ from: clampedFrom, to: { kind: "sun", anchor: "dusk", offset_min: 0 } });
    const get = captureEmit(el);
    // Trigger a change on the 'to' endpoint (leaves 'from' and its clamp untouched)
    (el as any)._onRangeChange(
      0,
      "to",
      new CustomEvent("value-changed", {
        detail: { value: { kind: "sun", anchor: "dusk", offset_min: 5 } },
      }),
    );
    const v = get() as any;
    expect(v).toHaveProperty("from");
    expect(v.from).toEqual(clampedFrom);
    expect(v.from.clamp).toEqual({ dir: "not_before", hh: 8, mm: 30 });
  });

  test("_onRangeChange guard: does not emit when entry is not a range", async () => {
    // Mount with a period entry so the first entry is kind:"period", not kind:"range"
    el = await mount({ period: "afternoon" });
    const get = captureEmit(el);
    // Fire a synthetic value-changed event targeting the element itself;
    // _onRangeChange is only wired to ambience-time-endpoint children, so call
    // the private handler directly with idx=0 (period entry).
    (el as any)._onRangeChange(
      0,
      "from",
      new CustomEvent("value-changed", {
        detail: { value: { kind: "time", hh: 10, mm: 0 } },
      }),
    );
    expect(get()).toBeUndefined();
  });

  test("willUpdate clamps openIdx when a non-value property change leaves it out of bounds", async () => {
    // mount with a range entry so add-btn is shown, then add a second entry (openIdx=1)
    el = await mount({ from: { kind: "time", hh: 9, mm: 0 }, to: { kind: "time", hh: 17, mm: 0 } });
    const addBtn = el.shadowRoot.querySelector(".add-btn") as HTMLButtonElement;
    addBtn.click();
    await el.updateComplete;
    // openIdx is now 1 (last); forcibly set it out of bounds
    (el as any)._openIdx = 5;
    // trigger willUpdate with a non-value property change
    el.hass = {};
    await el.updateComplete;
    // willUpdate should have clamped _openIdx back to entries.length - 1 (= 1)
    expect((el as any)._openIdx).toBeLessThan((el as any)._entries.length);
  });

  test("removing an entry whose index is before openIdx (and openIdx stays in bounds) shifts openIdx down", async () => {
    // 3 entries with openIdx at the middle one (index 1)
    el = document.createElement("ambience-time-of-day-input") as any;
    el.value = [{ period: "afternoon" }, { period: "evening" }, { period: "wind_down" }];
    el.periods = periods;
    document.body.appendChild(el);
    await el.updateComplete;
    // openIdx starts at last (2); click the chip for index 1 to make openIdx=1
    const chips = el.shadowRoot.querySelectorAll(".summary-chip") as NodeListOf<HTMLElement>;
    // chips[0] = index 0 (afternoon), chips[1] = index 1 (evening); index 2 is expanded
    chips[1].click();
    await el.updateComplete;
    // openIdx is now 1; remove entry at index 0 via its chip remove button
    const updatedChips = el.shadowRoot.querySelectorAll(".summary-chip") as NodeListOf<HTMLElement>;
    // After changing openIdx to 1, chips for indices 0 and 2 should be visible
    const get = captureEmit(el);
    const chip0RemoveBtn = updatedChips[0].querySelector(".remove") as HTMLButtonElement;
    chip0RemoveBtn.click();
    await el.updateComplete;
    // openIdx should have shifted from 1 → 0; the expanded entry is now the one
    // that was at index 1 (evening), now at index 0
    const expandedSelect = el.shadowRoot.querySelector(".entry select") as HTMLSelectElement;
    expect(expandedSelect.value).toBe("evening");
    // Emit: 2 remaining entries (evening + wind_down), both non-any → array
    const v = get() as any;
    expect(Array.isArray(v)).toBe(true);
    expect(v[0]).toEqual({ period: "evening" });
  });

  test("summary chip for an 'any' entry shows '(any)'", async () => {
    // Start with a period so the add-btn appears, then add a second entry
    el = await mount({ period: "afternoon" });
    // Add a second entry (the first is now a chip, second is expanded range)
    el.shadowRoot.querySelector(".add-btn")!.dispatchEvent(new MouseEvent("click"));
    await el.updateComplete;
    // Now force the open entry (index 1, range) back to "any" — but that hides add-btn.
    // Instead, switch the chip (index 0, afternoon) to "any" by clicking it first
    // to expand it, then changing its dropdown.
    const chip = el.shadowRoot.querySelector(".summary-chip") as HTMLElement;
    chip.click();
    await el.updateComplete;
    // Now index 0 is expanded; change its dropdown to __any__
    pickPeriod(el, 0, "__any__");
    await el.updateComplete;
    // After that, index 0 is "any" and it's the open slot, so it renders as an entry not a chip.
    // We want to see the chip for the OTHER (non-open) entry. Let's click the add-btn on index 1.
    // Actually: switch to index 1 to open it, making index 0 (now "any") a chip.
    // The select at index 0 (currently open) shows __any__; click the other entry's chip.
    // Re-open via the period entry — click add-btn again to see what's visible now
    // Simpler: start with afternoon+evening, open index 0, switch it to __any__, open index 1
    el.remove();
    el = document.createElement("ambience-time-of-day-input") as any;
    el.value = [{ period: "afternoon" }, { period: "evening" }];
    el.periods = periods;
    document.body.appendChild(el);
    await el.updateComplete;
    // openIdx starts at 1 (last); chip for index 0 = afternoon. Switch chip 0 to "any" by expanding it.
    const chip0 = el.shadowRoot.querySelector(".summary-chip") as HTMLElement;
    chip0.click();
    await el.updateComplete;
    // index 0 is now open; change to __any__
    pickPeriod(el, 0, "__any__");
    await el.updateComplete;
    // Now click the chip for index 1 (evening) to make index 0 (any) a chip again
    const eveningChip = el.shadowRoot.querySelector(".summary-chip") as HTMLElement;
    eveningChip.click();
    await el.updateComplete;
    // Now index 1 is open; index 0 (any) is a chip — check its label
    const anyChipLabel = el.shadowRoot.querySelector(".summary-chip .chip-label") as HTMLElement;
    expect(anyChipLabel).toBeTruthy();
    expect(anyChipLabel.textContent!.trim()).toBe("(any)");
  });
});

describe("value echo (review fix)", () => {
  test("the parent's echo of an emitted value doesn't reset the open entry", async () => {
    const el = await mount([{ period: "morning" }, { period: "evening" }]);
    el._openIdx = 0; // user is editing the FIRST entry
    await el.updateComplete;
    let echoed: unknown;
    el.addEventListener("value-changed", (e: any) => {
      echoed = e.detail.value;
    });
    el._emit(el._entries); // a no-op edit of entry 0 emits a new value object
    el.value = echoed; // the parent re-binds .value with what was emitted
    await el.updateComplete;
    // Without assigning this.value before dispatch, the echo looked like an
    // external change and collapsed entry 0, expanding the last entry.
    expect(el._openIdx).toBe(0);
    el.remove();
  });
});
