import { describe, test, expect, afterEach } from "vitest";
import "../frontend/src/views/matcher-input";

async function mount(matcherInput: string): Promise<any> {
  const el: any = document.createElement("ambience-matcher-input");
  el.matcher = { name: "day", description: "", predicate_help: "", toggleable: true, input: matcherInput, priority: 100 };
  el.value = null;
  el.dayConfig = { workday_sensor: null, workday_calendar: null };
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe("matcher-input day dispatch", () => {
  let el: any;
  afterEach(() => el?.remove());

  test("renders ambience-day-predicate-input for input=day_predicate", async () => {
    el = await mount("day_predicate");
    expect(el.shadowRoot.querySelector("ambience-day-predicate-input")).not.toBeNull();
  });

  test("does not render day-predicate-input for other inputs", async () => {
    el = await mount("text");
    expect(el.shadowRoot.querySelector("ambience-day-predicate-input")).toBeNull();
  });
});
