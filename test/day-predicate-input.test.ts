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
});
