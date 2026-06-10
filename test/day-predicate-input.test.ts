import { afterEach, describe, expect, test } from "vitest";
import "../frontend/src/views/day-predicate-input";
import type { DayPredicate } from "../frontend/src/types";

async function mount(opts: { value?: DayPredicate; dayConfig?: any } = {}): Promise<any> {
  const el: any = document.createElement("ambience-day-predicate-input");
  el.value = opts.value ?? null;
  el.dayConfig = opts.dayConfig ?? { workday_sensor: null, workday_calendar: null };
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe("ambience-day-predicate-input", () => {
  let el: any;
  afterEach(() => el?.remove());

  test("shows include and exclude sections", async () => {
    el = await mount();
    expect(el.shadowRoot.textContent).toContain("Include");
    expect(el.shadowRoot.textContent).toContain("Exclude");
  });

  test("renders empty-include hint when include is empty", async () => {
    el = await mount();
    expect(el.shadowRoot.textContent).toContain("empty → all days");
  });

  test("adding a weekday item to include emits value-changed with the new shape", async () => {
    el = await mount();
    let detail: any;
    el.addEventListener("value-changed", (e: Event) => {
      detail = (e as CustomEvent).detail;
    });
    el._addItem("include", "weekday");
    await el.updateComplete;
    expect(detail.value).toEqual({
      include: [{ kind: "weekday", days: [] }],
      exclude: [],
    });
  });

  test("workday item kinds are disabled when no sensor configured", async () => {
    el = await mount();
    expect(el._kindDisabled("workday")).toBe(true);
    expect(el._kindDisabled("first_workday")).toBe(true);
    expect(el._kindDisabled("last_day")).toBe(false);
  });

  test("workday item kinds enabled when sensor configured", async () => {
    el = await mount({
      dayConfig: { workday_sensor: "binary_sensor.workday", workday_calendar: "calendar.workday" },
    });
    expect(el._kindDisabled("workday")).toBe(false);
    expect(el._kindDisabled("first_workday")).toBe(false);
  });

  // --- ha-form schema builders -------------------------------------------

  test("_kindSchema is a single select(dropdown) listing all kinds", async () => {
    el = await mount();
    const schema = el._kindSchema();
    expect(schema).toHaveLength(1);
    expect(schema[0].name).toBe("kind");
    expect(schema[0].selector.select.mode).toBe("dropdown");
    const values = schema[0].selector.select.options.map((o: any) => o.value);
    expect(values).toEqual([
      "weekday",
      "day_of_month",
      "date",
      "date_range",
      "last_day",
      "workday",
      "holiday",
      "first_workday",
      "last_workday",
    ]);
  });

  test("_kindSchema marks entity-dependent kinds disabled when unconfigured", async () => {
    el = await mount();
    const byValue = Object.fromEntries(
      el._kindSchema()[0].selector.select.options.map((o: any) => [o.value, o.disabled]),
    );
    expect(byValue.workday).toBe(true);
    expect(byValue.holiday).toBe(true);
    expect(byValue.first_workday).toBe(true);
    expect(byValue.last_workday).toBe(true);
    expect(byValue.last_day).toBe(false);
    expect(byValue.weekday).toBe(false);
  });

  test("_kindSchema enables all kinds when entities configured", async () => {
    el = await mount({
      dayConfig: { workday_sensor: "binary_sensor.workday", workday_calendar: "calendar.workday" },
    });
    const disabled = el._kindSchema()[0].selector.select.options.map((o: any) => o.disabled);
    expect(disabled.every((d: boolean) => d === false)).toBe(true);
  });

  test("day-of-month is a free-text spec field (preserves commas and dashes)", async () => {
    el = await mount();
    const schema = el._bodySchema({ kind: "day_of_month", days: "" });
    expect(schema).toHaveLength(1);
    expect(schema[0].name).toBe("days");
    expect(schema[0].selector.text).toBeDefined();
    // data is the raw string; patch stores it verbatim (no number round-trip)
    expect(el._bodyData({ kind: "day_of_month", days: "1-10, 15" })).toEqual({ days: "1-10, 15" });
    expect(el._bodyPatch({ kind: "day_of_month", days: "" }, { days: "1-10, 15" })).toEqual({
      kind: "day_of_month",
      days: "1-10, 15",
    });
  });

  test("_bodySchema returns null for kinds rendered without a single ha-form body", async () => {
    el = await mount();
    expect(el._bodySchema({ kind: "weekday", days: [] })).toBeNull();
    expect(el._bodySchema({ kind: "date", month: 1, day: 1 })).toBeNull();
    expect(
      el._bodySchema({
        kind: "date_range",
        from: { month: 1, day: 1 },
        to: { month: 12, day: 31 },
      }),
    ).toBeNull();
    expect(el._bodySchema({ kind: "last_day" })).toBeNull();
    expect(el._bodySchema({ kind: "workday" })).toBeNull();
  });

  // --- date controls: month dropdown + month-aware day field ---------------

  test("_monthSelector lists twelve month options with string values", async () => {
    el = await mount();
    const sel = el._monthSelector();
    expect(sel.select.options).toHaveLength(12);
    expect(sel.select.options[0].value).toBe("1");
    expect(sel.select.options[11].value).toBe("12");
  });

  test("_daySelector max depends on the month (Feb=29)", async () => {
    el = await mount();
    expect(el._daySelector(1).number.max).toBe(31); // Jan
    expect(el._daySelector(2).number.max).toBe(29); // Feb — leap day allowed
    expect(el._daySelector(4).number.max).toBe(30); // Apr
  });

  test("_setDatePart updates a date field and clamps the day to the new month", async () => {
    el = await mount();
    expect(el._setDatePart({ kind: "date", month: 1, day: 25 }, "month", "12")).toEqual({
      kind: "date",
      month: 12,
      day: 25,
    });
    // switching to Feb while day is 31 → clamp to 29
    expect(el._setDatePart({ kind: "date", month: 1, day: 31 }, "month", "2")).toEqual({
      kind: "date",
      month: 2,
      day: 29,
    });
    expect(el._setDatePart({ kind: "date", month: 5, day: 1 }, "day", "20")).toEqual({
      kind: "date",
      month: 5,
      day: 20,
    });
  });

  test("_setDatePart ignores a cleared (non-numeric) value and keeps the item", async () => {
    el = await mount();
    const item = { kind: "date", month: 5, day: 10 };
    expect(el._setDatePart(item, "month", undefined)).toEqual(item);
    expect(el._setDatePart(item, "day", "")).toEqual(item);
    expect(el._setDatePart(item, "month", "0")).toEqual(item); // 0 is not a valid month/day
  });

  test("_setDatePart updates date_range from/to parts with clamping", async () => {
    el = await mount();
    const item = { kind: "date_range", from: { month: 1, day: 31 }, to: { month: 1, day: 31 } };
    expect(el._setDatePart(item, "from_month", "2")).toEqual({
      kind: "date_range",
      from: { month: 2, day: 29 },
      to: { month: 1, day: 31 },
    });
    expect(el._setDatePart(item, "to_day", "10")).toEqual({
      kind: "date_range",
      from: { month: 1, day: 31 },
      to: { month: 1, day: 10 },
    });
  });

  test("_onKindForm ignores switching to a disabled kind", async () => {
    el = await mount(); // no entities → workday disabled
    let detail: any;
    el.addEventListener("value-changed", (e: Event) => {
      detail = (e as CustomEvent).detail;
    });
    el._addItem("include", "weekday");
    detail = undefined;
    el._onKindForm("include", 0, { kind: "workday" });
    // disabled kind rejected → no emit, item unchanged
    expect(detail).toBeUndefined();
    expect(el.value.include[0].kind).toBe("weekday");
  });

  test("_onKindForm switches to an enabled kind with its default shape", async () => {
    el = await mount();
    el._addItem("include", "weekday");
    el._onKindForm("include", 0, { kind: "date" });
    expect(el.value.include[0]).toEqual({ kind: "date", month: 1, day: 1 });
  });

  test("_onKindForm removes the item when the kind selector is cleared", async () => {
    el = await mount();
    el._addItem("include", "weekday");
    expect(el.value.include).toHaveLength(1);
    el._onKindForm("include", 0, {}); // cleared (no kind)
    expect(el.value).toBeNull(); // last item removed → empty predicate
  });

  // --- day-of-month validation -------------------------------------------

  test("_dayOfMonthError is null for empty (defers to hint) and valid specs", async () => {
    el = await mount();
    expect(el._dayOfMonthError("")).toBeNull();
    expect(el._dayOfMonthError("   ")).toBeNull();
    expect(el._dayOfMonthError("1-10, 15")).toBeNull();
  });

  test("_dayOfMonthError returns a message for invalid non-empty specs", async () => {
    el = await mount();
    expect(el._dayOfMonthError("abc")).toBeTruthy();
    expect(el._dayOfMonthError("10-2")).toBeTruthy();
    expect(el._dayOfMonthError("0")).toBeTruthy();
  });

  test("_computeFieldHelper shows the day-of-month format for the days field", async () => {
    el = await mount();
    expect(el._computeFieldHelper({ name: "days" })).toBe("e.g. 1-10, 15");
  });

  test("_computeFieldHelper returns no helper for other fields", async () => {
    el = await mount();
    expect(el._computeFieldHelper({ name: "month" })).toBe("");
    expect(el._computeFieldHelper({ name: "kind" })).toBe("");
  });

  // --- _defaultItem exhaustive coverage -----------------------------------

  test("_defaultItem returns correct shape for day_of_month", async () => {
    el = await mount();
    // internal function tested indirectly; call _addItem to trigger it
    let detail: any;
    el.addEventListener("value-changed", (e: Event) => {
      detail = (e as CustomEvent).detail;
    });
    el._addItem("include", "day_of_month");
    expect(detail.value.include[0]).toEqual({ kind: "day_of_month", days: "" });
  });

  test("_defaultItem returns correct shape for date_range", async () => {
    el = await mount();
    let detail: any;
    el.addEventListener("value-changed", (e: Event) => {
      detail = (e as CustomEvent).detail;
    });
    el._addItem("include", "date_range");
    expect(detail.value.include[0]).toEqual({
      kind: "date_range",
      from: { month: 1, day: 1 },
      to: { month: 12, day: 31 },
    });
  });

  test("_defaultItem returns bare kind object for entity-only kinds (last_day, workday, etc.)", async () => {
    // These kinds have no body fields; default is just { kind }.
    el = await mount({
      dayConfig: { workday_sensor: "binary_sensor.workday", workday_calendar: "calendar.workday" },
    });
    let detail: any;
    el.addEventListener("value-changed", (e: Event) => {
      detail = (e as CustomEvent).detail;
    });
    for (const kind of [
      "last_day",
      "workday",
      "holiday",
      "first_workday",
      "last_workday",
    ] as const) {
      el._addItem("include", kind);
      expect(detail.value.include[detail.value.include.length - 1]).toEqual({ kind });
    }
  });

  // --- _bodyData / _bodyPatch non-day_of_month paths ----------------------

  test("_bodyData returns empty object for non-day_of_month kinds", async () => {
    el = await mount();
    expect(el._bodyData({ kind: "weekday", days: [] })).toEqual({});
    expect(el._bodyData({ kind: "last_day" })).toEqual({});
    expect(el._bodyData({ kind: "date", month: 1, day: 1 })).toEqual({});
  });

  test("_bodyPatch returns item unchanged for non-day_of_month kinds", async () => {
    el = await mount();
    const weekdayItem = { kind: "weekday", days: [1, 2] };
    expect(el._bodyPatch(weekdayItem, { some: "value" })).toBe(weekdayItem);
    const lastDayItem = { kind: "last_day" };
    expect(el._bodyPatch(lastDayItem, {})).toBe(lastDayItem);
  });

  // --- _setDatePart returns item unchanged for non-date/date_range kinds --

  test("_setDatePart returns item unchanged for kinds that have no date parts", async () => {
    el = await mount();
    const item = { kind: "last_day" };
    // Providing a valid numeric value should still return the original item
    // because the kind is neither 'date' nor 'date_range'.
    expect(el._setDatePart(item, "month", "3")).toBe(item);
  });

  // --- _onBodyForm (ha-form body change) ----------------------------------

  test("_onBodyForm applies _bodyPatch and updates the item at the given index", async () => {
    el = await mount({
      value: { include: [{ kind: "day_of_month", days: "" }], exclude: [] },
    });
    let detail: any;
    el.addEventListener("value-changed", (e: Event) => {
      detail = (e as CustomEvent).detail;
    });
    el._onBodyForm("include", 0, { kind: "day_of_month", days: "" }, { days: "5, 10-15" });
    expect(detail.value.include[0]).toEqual({ kind: "day_of_month", days: "5, 10-15" });
  });

  // --- _renderWeekday checkbox DOM interaction ----------------------------

  test("checking a weekday checkbox adds it to the days array and emits", async () => {
    el = await mount({
      value: { include: [{ kind: "weekday", days: [] }], exclude: [] },
    });
    let detail: any;
    el.addEventListener("value-changed", (e: Event) => {
      detail = (e as CustomEvent).detail;
    });
    // Get the first checkbox (day 0 = Monday)
    const checkbox = el.shadowRoot.querySelector('input[type="checkbox"]') as HTMLInputElement;
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    expect(detail.value.include[0].days).toContain(0);
  });

  test("unchecking a weekday checkbox removes it from the days array", async () => {
    el = await mount({
      value: { include: [{ kind: "weekday", days: [0, 1, 2] }], exclude: [] },
    });
    let detail: any;
    el.addEventListener("value-changed", (e: Event) => {
      detail = (e as CustomEvent).detail;
    });
    // Uncheck day 0
    const checkbox = el.shadowRoot.querySelector('input[type="checkbox"]') as HTMLInputElement;
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    expect(detail.value.include[0].days).not.toContain(0);
    expect(detail.value.include[0].days).toEqual([1, 2]);
  });

  // --- kind picker native select DOM interaction --------------------------

  test("kind select change to a new enabled kind switches the item", async () => {
    el = await mount({
      value: { include: [{ kind: "weekday", days: [] }], exclude: [] },
    });
    let detail: any;
    el.addEventListener("value-changed", (e: Event) => {
      detail = (e as CustomEvent).detail;
    });
    const select = el.shadowRoot.querySelector("select.kind") as HTMLSelectElement;
    select.value = "date";
    select.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    expect(detail.value.include[0]).toEqual({ kind: "date", month: 1, day: 1 });
  });

  test("kind select change to the same kind is a no-op (no emit)", async () => {
    el = await mount({
      value: { include: [{ kind: "date", month: 3, day: 15 }], exclude: [] },
    });
    let detail: any;
    el.addEventListener("value-changed", (e: Event) => {
      detail = (e as CustomEvent).detail;
    });
    const select = el.shadowRoot.querySelector("select.kind") as HTMLSelectElement;
    select.value = "date"; // same kind
    select.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    expect(detail).toBeUndefined();
  });

  test("kind select change to a disabled kind is a no-op (no emit)", async () => {
    el = await mount({
      value: { include: [{ kind: "weekday", days: [] }], exclude: [] },
    });
    let detail: any;
    el.addEventListener("value-changed", (e: Event) => {
      detail = (e as CustomEvent).detail;
    });
    const select = el.shadowRoot.querySelector("select.kind") as HTMLSelectElement;
    // workday is disabled with no sensor
    select.value = "workday";
    select.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    expect(detail).toBeUndefined();
  });

  // --- _renderNativeBody DOM rendering ------------------------------------

  test("native body for day_of_month renders a text input with the current days value", async () => {
    el = await mount({
      value: { include: [{ kind: "day_of_month", days: "1-5" }], exclude: [] },
    });
    const input = el.shadowRoot.querySelector('input[type="text"]') as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.value).toBe("1-5");
  });

  test("native body day_of_month shows error div for invalid spec", async () => {
    el = await mount({
      value: { include: [{ kind: "day_of_month", days: "abc" }], exclude: [] },
    });
    const err = el.shadowRoot.querySelector(".field-error");
    expect(err).not.toBeNull();
    expect(err.textContent).toBeTruthy();
  });

  test("native body day_of_month shows no error div for empty spec", async () => {
    el = await mount({
      value: { include: [{ kind: "day_of_month", days: "" }], exclude: [] },
    });
    const err = el.shadowRoot.querySelector(".field-error");
    expect(err).toBeNull();
  });

  test("native body day_of_month change event updates the days value and emits", async () => {
    el = await mount({
      value: { include: [{ kind: "day_of_month", days: "" }], exclude: [] },
    });
    let detail: any;
    el.addEventListener("value-changed", (e: Event) => {
      detail = (e as CustomEvent).detail;
    });
    const input = el.shadowRoot.querySelector('input[type="text"]') as HTMLInputElement;
    input.value = "3, 7-10";
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    expect(detail.value.include[0]).toEqual({ kind: "day_of_month", days: "3, 7-10" });
  });

  test("native body for date renders two number inputs (month and day)", async () => {
    el = await mount({
      value: { include: [{ kind: "date", month: 3, day: 15 }], exclude: [] },
    });
    const inputs = el.shadowRoot.querySelectorAll('input[type="number"]');
    expect(inputs.length).toBeGreaterThanOrEqual(2);
  });

  test("native body date month input change updates month and clamps day", async () => {
    el = await mount({
      value: { include: [{ kind: "date", month: 1, day: 31 }], exclude: [] },
    });
    let detail: any;
    el.addEventListener("value-changed", (e: Event) => {
      detail = (e as CustomEvent).detail;
    });
    const [monthInput] = Array.from(
      el.shadowRoot.querySelectorAll('input[type="number"]'),
    ) as HTMLInputElement[];
    monthInput.value = "2"; // Feb — day 31 → clamp to 29
    monthInput.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    expect(detail.value.include[0]).toEqual({ kind: "date", month: 2, day: 29 });
  });

  test("native body date day input change updates day", async () => {
    el = await mount({
      value: { include: [{ kind: "date", month: 6, day: 1 }], exclude: [] },
    });
    let detail: any;
    el.addEventListener("value-changed", (e: Event) => {
      detail = (e as CustomEvent).detail;
    });
    const inputs = Array.from(
      el.shadowRoot.querySelectorAll('input[type="number"]'),
    ) as HTMLInputElement[];
    const dayInput = inputs[1]; // second number input is day
    dayInput.value = "15";
    dayInput.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    expect(detail.value.include[0]).toEqual({ kind: "date", month: 6, day: 15 });
  });

  test("native body for date_range renders four number inputs (from/to month+day)", async () => {
    el = await mount({
      value: {
        include: [{ kind: "date_range", from: { month: 3, day: 1 }, to: { month: 6, day: 30 } }],
        exclude: [],
      },
    });
    const inputs = el.shadowRoot.querySelectorAll('input[type="number"]');
    expect(inputs.length).toBeGreaterThanOrEqual(4);
  });

  test("native body date_range to_month change updates the to month with clamping", async () => {
    el = await mount({
      value: {
        include: [{ kind: "date_range", from: { month: 1, day: 31 }, to: { month: 1, day: 31 } }],
        exclude: [],
      },
    });
    let detail: any;
    el.addEventListener("value-changed", (e: Event) => {
      detail = (e as CustomEvent).detail;
    });
    const inputs = Array.from(
      el.shadowRoot.querySelectorAll('input[type="number"]'),
    ) as HTMLInputElement[];
    // Inputs: from_month[0], from_day[1], to_month[2], to_day[3]
    const toMonthInput = inputs[2];
    toMonthInput.value = "2"; // Feb — day 31 → clamp to 29
    toMonthInput.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    expect(detail.value.include[0].to).toEqual({ month: 2, day: 29 });
  });

  // --- _renderAddPicker native select empty value guard -------------------

  test("add picker select ignores empty value (no emit)", async () => {
    el = await mount();
    let detail: any;
    el.addEventListener("value-changed", (e: Event) => {
      detail = (e as CustomEvent).detail;
    });
    // The add-picker selects are in the include/exclude sections.
    // Find the last select in include section (the add-picker).
    // When value is empty string, the handler returns immediately without adding.
    const selects = Array.from(el.shadowRoot.querySelectorAll("select")) as HTMLSelectElement[];
    // With no items, the only select is the add picker for include section.
    const addPicker = selects[0];
    addPicker.value = ""; // empty option selected
    addPicker.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    expect(detail).toBeUndefined();
    expect(el.value).toBeNull();
  });

  test("add picker select with a valid kind adds the item and resets the select", async () => {
    el = await mount();
    let detail: any;
    el.addEventListener("value-changed", (e: Event) => {
      detail = (e as CustomEvent).detail;
    });
    const selects = Array.from(el.shadowRoot.querySelectorAll("select")) as HTMLSelectElement[];
    const addPicker = selects[0]; // include section add picker
    addPicker.value = "weekday";
    addPicker.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    expect(detail.value.include[0]).toEqual({ kind: "weekday", days: [] });
    // The select should be reset to empty after adding
    expect(addPicker.value).toBe("");
  });

  // --- branch coverage gaps -----------------------------------------------

  test("_bodyPatch falls back to empty string when value.days is undefined", async () => {
    el = await mount();
    // The `value.days ?? ""` branch fires when days is undefined.
    expect(el._bodyPatch({ kind: "day_of_month", days: "old" }, {})).toEqual({
      kind: "day_of_month",
      days: "",
    });
  });

  test("_setDatePart handles from_day part on a date_range item", async () => {
    el = await mount();
    const item = { kind: "date_range", from: { month: 3, day: 1 }, to: { month: 6, day: 30 } };
    const result = el._setDatePart(item, "from_day", "20");
    expect(result.from.day).toBe(20);
    expect(result.to).toEqual({ month: 6, day: 30 });
  });

  test("_onKindForm with the same kind as current item is a no-op (no emit)", async () => {
    el = await mount({
      value: { include: [{ kind: "weekday", days: [1] }], exclude: [] },
    });
    let detail: any;
    el.addEventListener("value-changed", (e: Event) => {
      detail = (e as CustomEvent).detail;
    });
    // Pass the same kind — _onKindForm guards against same-kind updates
    el._onKindForm("include", 0, { kind: "weekday" });
    expect(detail).toBeUndefined();
    expect(el.value.include[0].days).toEqual([1]);
  });

  test("_daySelector caps at 31 for out-of-range month (internal _daysInMonth fallback)", async () => {
    el = await mount();
    // Month 13 is out-of-range; _daysInMonth falls back to 31.
    expect(el._daySelector(13).number.max).toBe(31);
    expect(el._daySelector(0).number.max).toBe(31);
  });

  test("_updateItem leaves items at other indices unchanged (ternary false branch)", async () => {
    el = await mount({
      value: {
        include: [{ kind: "weekday", days: [0] }, { kind: "last_day" }],
        exclude: [],
      },
    });
    // Update only index 0; index 1 must remain untouched.
    el._updateItem("include", 0, { kind: "weekday", days: [1] });
    expect(el.value.include[0]).toEqual({ kind: "weekday", days: [1] });
    expect(el.value.include[1]).toEqual({ kind: "last_day" });
  });
});

describe("review fixes", () => {
  test("native kind picker selects the item's kind, not the first option", async () => {
    const el = await mount({
      value: { include: [{ kind: "date", month: 5, day: 13 }], exclude: [] },
    });
    const select = el.shadowRoot.querySelector("select.kind") as HTMLSelectElement;
    expect(select).not.toBeNull();
    // lit commits .value before the option children exist, so the browser fell
    // back to the first option ("weekday") — ?selected on the matching option
    // is the reliable form (see form-controls.renderSelect).
    expect(select.value).toBe("date");
  });

  test("a typed month above 12 clamps instead of storing an invalid date", async () => {
    const el = await mount({});
    const out = el._setDatePart({ kind: "date", month: 5, day: 31 }, "month", "13");
    expect(out).toEqual({ kind: "date", month: 12, day: 31 });
  });
});
