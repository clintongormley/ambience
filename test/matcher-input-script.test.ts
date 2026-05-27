import { describe, test, expect, afterEach } from "vitest";
import "../frontend/src/views/matcher-input";
import type { MatcherInfo } from "../frontend/src/types";

const SCRIPT_MATCHER: MatcherInfo = {
  name: "script",
  description: "x",
  predicate_help: "x",
  input: "script_predicate",
  priority: 25,
};

describe("matcher-input dispatcher — script", () => {
  let el: any;
  afterEach(() => el?.remove());

  test("dispatches to ambience-script-predicate-input", async () => {
    el = document.createElement("ambience-matcher-input");
    el.matcher = SCRIPT_MATCHER;
    el.value = null;
    el.hass = { services: { script: { foo: {} } } };
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("ambience-script-predicate-input")).not.toBeNull();
  });
});
