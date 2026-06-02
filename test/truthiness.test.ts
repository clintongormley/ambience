import { describe, test, expect } from "vitest";

import { resultAsBoolean } from "../frontend/src/truthiness";

// Mirrors homeassistant.helpers.template.result_as_boolean — keep in sync with
// the backend TemplateCondition's truthiness rule.
describe("resultAsBoolean", () => {
  test("native booleans pass through", () => {
    expect(resultAsBoolean(true)).toBe(true);
    expect(resultAsBoolean(false)).toBe(false);
  });

  test("numbers are truthy iff non-zero", () => {
    expect(resultAsBoolean(42)).toBe(true);
    expect(resultAsBoolean(0)).toBe(false);
    expect(resultAsBoolean(-1)).toBe(true);
  });

  test("recognised truthy strings (case/space-insensitive)", () => {
    for (const s of ["1", "true", "yes", "on", "enable", " TRUE ", "On"]) {
      expect(resultAsBoolean(s)).toBe(true);
    }
  });

  test("recognised falsy strings", () => {
    for (const s of ["0", "false", "no", "off", "disable", "FALSE"]) {
      expect(resultAsBoolean(s)).toBe(false);
    }
  });

  test("unrecognised strings are falsy (forgiving default), incl. numeric strings", () => {
    // A bare sensor value like "42" is NOT truthy — matches the backend, which
    // is exactly why the UI surfaces the boolean.
    expect(resultAsBoolean("42")).toBe(false);
    expect(resultAsBoolean("hello")).toBe(false);
    expect(resultAsBoolean("")).toBe(false);
    expect(resultAsBoolean("unknown")).toBe(false);
  });

  test("null/undefined are falsy", () => {
    expect(resultAsBoolean(null)).toBe(false);
    expect(resultAsBoolean(undefined)).toBe(false);
  });

  test("objects/arrays are falsy", () => {
    expect(resultAsBoolean({})).toBe(false);
    expect(resultAsBoolean([1, 2])).toBe(false);
  });
});
