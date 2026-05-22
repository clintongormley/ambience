import { describe, test, expect, afterEach } from "vitest";
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
    el.addEventListener("value-changed", (e: Event) => { detail = (e as CustomEvent).detail; });
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
    el = await mount({ dayConfig: { workday_sensor: "binary_sensor.workday", workday_calendar: "calendar.workday" } });
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
      "weekday", "day_of_month", "date", "date_range",
      "last_day", "workday", "holiday", "first_workday", "last_workday",
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
    el = await mount({ dayConfig: { workday_sensor: "binary_sensor.workday", workday_calendar: "calendar.workday" } });
    const disabled = el._kindSchema()[0].selector.select.options.map((o: any) => o.disabled);
    expect(disabled.every((d: boolean) => d === false)).toBe(true);
  });

  test("_bodySchema returns a text selector for day_of_month", async () => {
    el = await mount();
    const schema = el._bodySchema({ kind: "day_of_month", days: [] });
    expect(schema).toHaveLength(1);
    expect(schema[0].name).toBe("days");
    expect(schema[0].selector.text).toBeDefined();
  });

  test("_bodySchema returns two number selectors for date", async () => {
    el = await mount();
    const schema = el._bodySchema({ kind: "date", month: 1, day: 1 });
    expect(schema.map((s: any) => s.name)).toEqual(["month", "day"]);
    expect(schema[0].selector.number.max).toBe(12);
    expect(schema[1].selector.number.max).toBe(31);
  });

  test("_bodySchema returns four number selectors for date_range", async () => {
    el = await mount();
    const schema = el._bodySchema({
      kind: "date_range",
      from: { month: 1, day: 1 },
      to: { month: 12, day: 31 },
    });
    expect(schema.map((s: any) => s.name)).toEqual(["from_month", "from_day", "to_month", "to_day"]);
  });

  test("_bodySchema returns null for weekday and bodyless kinds", async () => {
    el = await mount();
    expect(el._bodySchema({ kind: "weekday", days: [] })).toBeNull();
    expect(el._bodySchema({ kind: "last_day" })).toBeNull();
    expect(el._bodySchema({ kind: "workday" })).toBeNull();
  });

  // --- ha-form data + parsers --------------------------------------------

  test("_bodyData maps each item kind to ha-form data", async () => {
    el = await mount();
    expect(el._bodyData({ kind: "day_of_month", days: [1, 15] })).toEqual({ days: "1, 15" });
    expect(el._bodyData({ kind: "date", month: 12, day: 25 })).toEqual({ month: 12, day: 25 });
    expect(el._bodyData({
      kind: "date_range",
      from: { month: 7, day: 15 },
      to: { month: 8, day: 31 },
    })).toEqual({ from_month: 7, from_day: 15, to_month: 8, to_day: 31 });
  });

  test("_bodyPatch parses day_of_month text into a number array", async () => {
    el = await mount();
    expect(el._bodyPatch({ kind: "day_of_month", days: [] }, { days: "1, 15, 31" }))
      .toEqual({ kind: "day_of_month", days: [1, 15, 31] });
  });

  test("_bodyPatch parses date numbers", async () => {
    el = await mount();
    expect(el._bodyPatch({ kind: "date", month: 1, day: 1 }, { month: 12, day: 25 }))
      .toEqual({ kind: "date", month: 12, day: 25 });
  });

  test("_bodyPatch parses date_range numbers", async () => {
    el = await mount();
    expect(el._bodyPatch(
      { kind: "date_range", from: { month: 1, day: 1 }, to: { month: 12, day: 31 } },
      { from_month: 7, from_day: 15, to_month: 8, to_day: 31 },
    )).toEqual({
      kind: "date_range",
      from: { month: 7, day: 15 },
      to: { month: 8, day: 31 },
    });
  });

  test("_onKindForm ignores switching to a disabled kind", async () => {
    el = await mount();  // no entities → workday disabled
    let detail: any;
    el.addEventListener("value-changed", (e: Event) => { detail = (e as CustomEvent).detail; });
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
});
