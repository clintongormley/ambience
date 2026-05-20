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
});
