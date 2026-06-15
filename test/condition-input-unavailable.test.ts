import { afterEach, describe, expect, test } from "vitest";
import "../frontend/src/views/condition-input";

describe("ambience-condition-input — unavailable dispatch", () => {
  let el: any;
  afterEach(() => el?.remove());

  async function mount(input: string): Promise<any> {
    el = document.createElement("ambience-condition-input");
    el.condition = { name: "x", description: "", predicate_help: "", input, priority: 0 };
    el.value = null;
    document.body.appendChild(el);
    await el.updateComplete;
    return el;
  }

  test("renders the widget for input=unavailable_predicate", async () => {
    await mount("unavailable_predicate");
    expect(el.shadowRoot.querySelector("ambience-unavailable-predicate-input")).not.toBeNull();
  });

  test("does not render it for other inputs", async () => {
    await mount("text");
    expect(el.shadowRoot.querySelector("ambience-unavailable-predicate-input")).toBeNull();
  });
});
