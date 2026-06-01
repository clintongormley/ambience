import { describe, test, expect } from "vitest";
import { defineElement } from "../frontend/src/define-element";

describe("defineElement", () => {
  test("registers the element", () => {
    class A extends HTMLElement {}
    defineElement("de-a", A);
    expect(customElements.get("de-a")).toBe(A);
  });

  test("a second call for the same name does not throw", () => {
    class B extends HTMLElement {}
    defineElement("de-b", B);
    // A re-evaluation (different ctor) must be swallowed, not thrown.
    expect(() => defineElement("de-b", class extends HTMLElement {})).not.toThrow();
    expect(customElements.get("de-b")).toBe(B); // first definition wins
  });
});
