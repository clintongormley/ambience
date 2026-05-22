import { describe, test, expect } from "vitest";
import { isValidDaySpec } from "../frontend/src/day-spec";

describe("isValidDaySpec", () => {
  test.each([
    "1",
    "1, 15, 31",
    "1-10",
    "1-10, 15",
    " 2 - 4 , 20 ",
    "1,,15", // lenient: empty tokens ignored
  ])("accepts %j", (spec) => {
    expect(isValidDaySpec(spec)).toBe(true);
  });

  test.each([
    "",
    "   ",
    "0",
    "32",
    "abc",
    "5-",
    "-5",
    "10-2", // reversed range
    "1-2-3",
    "1.5",
  ])("rejects %j", (spec) => {
    expect(isValidDaySpec(spec)).toBe(false);
  });
});
