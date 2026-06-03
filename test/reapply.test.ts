import { describe, expect, test } from "vitest";
import {
  MIN_REAPPLY_SECONDS,
  parseReapplyConfigSeconds,
  parseReapplyOverrideSeconds,
} from "../frontend/src/reapply.js";

describe("MIN_REAPPLY_SECONDS", () => {
  test("is 10", () => {
    expect(MIN_REAPPLY_SECONDS).toBe(10);
  });
});

describe("parseReapplyConfigSeconds", () => {
  test("returns null for empty string", () => {
    expect(parseReapplyConfigSeconds("")).toBeNull();
  });

  test("returns null for whitespace-only string", () => {
    expect(parseReapplyConfigSeconds("   ")).toBeNull();
  });

  test("returns null for non-numeric string", () => {
    expect(parseReapplyConfigSeconds("abc")).toBeNull();
    expect(parseReapplyConfigSeconds("--")).toBeNull();
  });

  test("returns null for zero", () => {
    expect(parseReapplyConfigSeconds("0")).toBeNull();
  });

  test("returns null for negative values", () => {
    expect(parseReapplyConfigSeconds("-5")).toBeNull();
    expect(parseReapplyConfigSeconds("-0.1")).toBeNull();
  });

  test("clamps positive-but-below-floor values up to MIN_REAPPLY_SECONDS (10)", () => {
    // 5 < 10 → clamps up to 10
    expect(parseReapplyConfigSeconds("5")).toBe(10);
    expect(parseReapplyConfigSeconds("1")).toBe(10);
    expect(parseReapplyConfigSeconds("9")).toBe(10);
  });

  test("returns value as-is when at or above the floor", () => {
    expect(parseReapplyConfigSeconds("10")).toBe(10);
    expect(parseReapplyConfigSeconds("300")).toBe(300);
    expect(parseReapplyConfigSeconds("3600")).toBe(3600);
  });

  test("rounds fractional values before clamping", () => {
    // 9.4 rounds to 9 < 10 → clamps to 10
    expect(parseReapplyConfigSeconds("9.4")).toBe(10);
    // 9.6 rounds to 10 → exactly at floor
    expect(parseReapplyConfigSeconds("9.6")).toBe(10);
    // 10.4 rounds to 10
    expect(parseReapplyConfigSeconds("10.4")).toBe(10);
    // 10.6 rounds to 11
    expect(parseReapplyConfigSeconds("10.6")).toBe(11);
  });

  test("handles leading/trailing whitespace", () => {
    expect(parseReapplyConfigSeconds("  300  ")).toBe(300);
  });
});

describe("parseReapplyOverrideSeconds", () => {
  test("returns null for empty string (inherit — remove key)", () => {
    expect(parseReapplyOverrideSeconds("")).toBeNull();
  });

  test("returns null for whitespace-only string", () => {
    expect(parseReapplyOverrideSeconds("   ")).toBeNull();
  });

  test("returns null for non-numeric string", () => {
    expect(parseReapplyOverrideSeconds("abc")).toBeNull();
    expect(parseReapplyOverrideSeconds("--")).toBeNull();
  });

  test("returns 0 for '0' (disable for this scene)", () => {
    expect(parseReapplyOverrideSeconds("0")).toBe(0);
  });

  test("returns 0 for negative values (disable for this scene)", () => {
    expect(parseReapplyOverrideSeconds("-5")).toBe(0);
    expect(parseReapplyOverrideSeconds("-0.1")).toBe(0);
  });

  test("clamps positive-but-below-floor values up to MIN_REAPPLY_SECONDS (10)", () => {
    // 5 > 0 but < 10 → clamps up to 10
    expect(parseReapplyOverrideSeconds("5")).toBe(10);
    expect(parseReapplyOverrideSeconds("1")).toBe(10);
    expect(parseReapplyOverrideSeconds("9")).toBe(10);
  });

  test("returns value as-is when at or above the floor", () => {
    expect(parseReapplyOverrideSeconds("10")).toBe(10);
    expect(parseReapplyOverrideSeconds("120")).toBe(120);
    expect(parseReapplyOverrideSeconds("300")).toBe(300);
  });

  test("rounds fractional values before clamping", () => {
    // 9.4 rounds to 9 < 10 → clamps to 10
    expect(parseReapplyOverrideSeconds("9.4")).toBe(10);
    // 9.6 rounds to 10 → at floor
    expect(parseReapplyOverrideSeconds("9.6")).toBe(10);
    // 10.6 rounds to 11
    expect(parseReapplyOverrideSeconds("10.6")).toBe(11);
  });

  test("handles leading/trailing whitespace", () => {
    expect(parseReapplyOverrideSeconds("  120  ")).toBe(120);
  });
});
