import { describe, test, expect } from "vitest";
import { parseReapplyMinutes, reapplySecondsToMinutes } from "../frontend/src/reapply.js";

describe("parseReapplyMinutes", () => {
  test("returns null for empty string", () => {
    expect(parseReapplyMinutes("")).toBeNull();
  });

  test("returns null for whitespace-only string", () => {
    expect(parseReapplyMinutes("   ")).toBeNull();
  });

  test("returns null for non-numeric string", () => {
    expect(parseReapplyMinutes("abc")).toBeNull();
    expect(parseReapplyMinutes("--")).toBeNull();
  });

  test("clamps sub-1 minute values up to 60 seconds", () => {
    // 0.4 minutes → rounds to 0 → clamps up to 1 → 60s
    expect(parseReapplyMinutes("0.4")).toBe(60);
    // 0 minutes → clamps up to 1 → 60s
    expect(parseReapplyMinutes("0")).toBe(60);
    // negative → rounds to ≤0 → clamps up to 1 → 60s
    expect(parseReapplyMinutes("-5")).toBe(60);
  });

  test("rounds fractional minutes before clamping", () => {
    // 0.6 rounds to 1 → not clamped → 60s
    expect(parseReapplyMinutes("0.6")).toBe(60);
    // 1.4 rounds to 1 → 60s
    expect(parseReapplyMinutes("1.4")).toBe(60);
    // 1.6 rounds to 2 → 120s
    expect(parseReapplyMinutes("1.6")).toBe(120);
  });

  test("returns correct seconds for whole minutes", () => {
    expect(parseReapplyMinutes("1")).toBe(60);
    expect(parseReapplyMinutes("5")).toBe(300);
    expect(parseReapplyMinutes("60")).toBe(3600);
  });

  test("handles leading/trailing whitespace", () => {
    expect(parseReapplyMinutes("  5  ")).toBe(300);
  });
});

describe("reapplySecondsToMinutes", () => {
  test("converts seconds to whole minutes", () => {
    expect(reapplySecondsToMinutes(60)).toBe(1);
    expect(reapplySecondsToMinutes(300)).toBe(5);
    expect(reapplySecondsToMinutes(3600)).toBe(60);
  });

  test("rounds to nearest minute", () => {
    expect(reapplySecondsToMinutes(90)).toBe(2);  // 1.5 → 2
    expect(reapplySecondsToMinutes(89)).toBe(1);  // 1.48 → 1
  });
});
