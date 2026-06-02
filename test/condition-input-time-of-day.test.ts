import { describe, test, expect, afterEach } from "vitest";
import "../frontend/src/views/condition-input";
import type { ConditionInfo, PeriodStoreView } from "../frontend/src/types";

const periods: PeriodStoreView = { builtins: {}, custom: {}, hidden: [] };

async function mount(condition: ConditionInfo): Promise<any> {
  const el: any = document.createElement("ambience-condition-input");
  el.condition = condition;
  el.value = null;
  el.periods = periods;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

const baseCondition = {
  name: "time_of_day",
  description: "",
  predicate_help: "",
  input: "time_of_day",
  priority: 200,
} satisfies ConditionInfo;

describe("condition-input dispatcher", () => {
  let el: any;
  afterEach(() => { el?.remove(); });

  test("renders ambience-time-of-day-input when condition.input is 'time_of_day'", async () => {
    el = await mount(baseCondition);
    expect(el.shadowRoot.querySelector("ambience-time-of-day-input")).toBeTruthy();
  });

  test("does NOT render ambience-time-of-day-input for non-time-of-day conditions", async () => {
    el = await mount({ ...baseCondition, input: "text", name: "other" });
    expect(el.shadowRoot.querySelector("ambience-time-of-day-input")).toBeNull();
  });

  test("passes periods through to the widget", async () => {
    el = await mount(baseCondition);
    const widget = el.shadowRoot.querySelector("ambience-time-of-day-input") as any;
    expect(widget.periods).toBe(periods);
  });

  test("re-emits value-changed from the widget", async () => {
    el = await mount(baseCondition);
    let received: any;
    el.addEventListener("value-changed", (e: CustomEvent) => { received = e.detail; });
    const widget = el.shadowRoot.querySelector("ambience-time-of-day-input")!;
    widget.dispatchEvent(new CustomEvent("value-changed", {
      detail: { value: { period: "afternoon" } },
      bubbles: true, composed: true,
    }));
    expect(received).toEqual({ value: { period: "afternoon" } });
  });

  test("renders text input for unknown condition.input", async () => {
    el = await mount({ ...baseCondition, input: "text", name: "custom" });
    expect(el.shadowRoot.querySelector("input[type='text']")).toBeTruthy();
  });

  test("text input emits value-changed with null when empty", async () => {
    el = await mount({ ...baseCondition, input: "text", name: "custom" });
    let received: any;
    el.addEventListener("value-changed", (e: CustomEvent) => { received = e.detail; });
    const input = el.shadowRoot.querySelector("input[type='text']") as HTMLInputElement;
    input.value = "  ";
    input.dispatchEvent(new InputEvent("input", { bubbles: true }));
    expect(received?.value).toBeNull();
  });

  test("text input emits value-changed with non-empty value", async () => {
    el = await mount({ ...baseCondition, input: "text", name: "custom" });
    let received: any;
    el.addEventListener("value-changed", (e: CustomEvent) => { received = e.detail; });
    const input = el.shadowRoot.querySelector("input[type='text']") as HTMLInputElement;
    input.value = "hello";
    input.dispatchEvent(new InputEvent("input", { bubbles: true }));
    expect(received?.value).toBe("hello");
  });
});
