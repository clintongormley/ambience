import { afterEach, describe, expect, test } from "vitest";
import "../frontend/src/views/condition-input";

async function mount(conditionInput: string): Promise<any> {
  const el: any = document.createElement("ambience-condition-input");
  el.condition = {
    name: "day",
    description: "",
    predicate_help: "",
    input: conditionInput,
    priority: 100,
  };
  el.value = null;
  el.dayConfig = { workday_sensor: null, workday_calendar: null };
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe("condition-input day dispatch", () => {
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
