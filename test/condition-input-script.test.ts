import { describe, test, expect, afterEach } from "vitest";
import "../frontend/src/views/condition-input";
import type { ConditionInfo } from "../frontend/src/types";

const SCRIPT_CONDITION: ConditionInfo = {
  name: "script",
  description: "x",
  predicate_help: "x",
  input: "script_predicate",
  priority: 25,
};

describe("condition-input dispatcher — script", () => {
  let el: any;
  afterEach(() => el?.remove());

  test("dispatches to ambience-script-predicate-input", async () => {
    el = document.createElement("ambience-condition-input");
    el.condition = SCRIPT_CONDITION;
    el.value = null;
    el.hass = { services: { script: { foo: {} } } };
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("ambience-script-predicate-input")).not.toBeNull();
  });
});
