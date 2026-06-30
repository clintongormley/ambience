import { describe, expect, it } from "vitest";
import { _hashInternals, feFromUrl } from "../frontend/src/frontend-hash";

describe("feFromUrl", () => {
  it("returns the fe param", () => {
    expect(feFromUrl("/x/ambience-frontend.js?fe=abc123")).toBe("abc123");
  });
  it("returns the fe param among others", () => {
    expect(feFromUrl("/x/ambience-frontend.js?hash=zzz&fe=abc123")).toBe("abc123");
  });
  it("returns empty string when there is no query", () => {
    expect(feFromUrl("/x/ambience-frontend.js")).toBe("");
  });
  it("returns empty string when fe is absent", () => {
    expect(feFromUrl("/x/ambience-frontend.js?hash=zzz")).toBe("");
  });
});

describe("_hashInternals.runningFrontendHash", () => {
  it("returns a string (empty under the test module URL, which has no fe)", () => {
    expect(typeof _hashInternals.runningFrontendHash()).toBe("string");
  });
});
