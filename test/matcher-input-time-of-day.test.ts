import { describe, test, expect, afterEach } from "vitest";
import "../frontend/src/views/matcher-input";
import type { MatcherInfo, PeriodStoreView } from "../frontend/src/types";

const periods: PeriodStoreView = { builtins: {}, custom: {}, hidden: [] };

async function mount(matcher: MatcherInfo): Promise<any> {
  const el: any = document.createElement("ambience-matcher-input");
  el.matcher = matcher;
  el.value = null;
  el.periods = periods;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

const baseMatcher = {
  name: "time_of_day",
  description: "",
  predicate_help: "",
  toggleable: true,
  input: "time_of_day",
  priority: 100,
} satisfies MatcherInfo;

describe("matcher-input dispatcher", () => {
  let el: any;
  afterEach(() => { el?.remove(); });

  test("renders ambience-time-of-day-input when matcher.input is 'time_of_day'", async () => {
    el = await mount(baseMatcher);
    expect(el.shadowRoot.querySelector("ambience-time-of-day-input")).toBeTruthy();
  });

  test("does NOT render ambience-time-of-day-input for non-time-of-day matchers", async () => {
    el = await mount({ ...baseMatcher, input: "text", name: "other" });
    expect(el.shadowRoot.querySelector("ambience-time-of-day-input")).toBeNull();
  });

  test("passes periods through to the widget", async () => {
    el = await mount(baseMatcher);
    const widget = el.shadowRoot.querySelector("ambience-time-of-day-input") as any;
    expect(widget.periods).toBe(periods);
  });

  test("re-emits value-changed from the widget", async () => {
    el = await mount(baseMatcher);
    let received: any;
    el.addEventListener("value-changed", (e: CustomEvent) => { received = e.detail; });
    const widget = el.shadowRoot.querySelector("ambience-time-of-day-input")!;
    widget.dispatchEvent(new CustomEvent("value-changed", {
      detail: { value: { period: "afternoon" } },
      bubbles: true, composed: true,
    }));
    expect(received).toEqual({ value: { period: "afternoon" } });
  });
});
