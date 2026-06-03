/**
 * Tests for scope-label.ts — scopeLabel pure function.
 */
import { describe, expect, test } from "vitest";
import { scopeLabel } from "../frontend/src/scope-label";

describe("scopeLabel", () => {
  // ── house ────────────────────────────────────────────────────────────────

  test("house scope returns 'House' regardless of scope_id", () => {
    expect(scopeLabel({ scope_kind: "house", scope_id: null })).toBe("House");
  });

  test("house scope with non-null scope_id still returns 'House'", () => {
    expect(scopeLabel({ scope_kind: "house", scope_id: "some-id" })).toBe("House");
  });

  // ── floor ────────────────────────────────────────────────────────────────

  test("floor scope with a non-null id returns 'Floor: <id>'", () => {
    expect(scopeLabel({ scope_kind: "floor", scope_id: "3" })).toBe("Floor: 3");
  });

  test("floor scope with null id returns 'Floor: ' (empty after prefix)", () => {
    // Exercises the null branch of `scope_id ?? ""`  on line 10
    expect(scopeLabel({ scope_kind: "floor", scope_id: null })).toBe("Floor: ");
  });

  // ── area (and other / unknown scope kinds) ────────────────────────────────

  test("area scope returns the scope_id string", () => {
    expect(scopeLabel({ scope_kind: "area", scope_id: "living_room" })).toBe("living_room");
  });

  test("unknown scope kind with null scope_id returns empty string", () => {
    // Exercises the null branch of `scope_id ?? ""` on line 11
    expect(scopeLabel({ scope_kind: "unknown", scope_id: null })).toBe("");
  });

  test("unknown scope kind with a non-null scope_id returns that id", () => {
    expect(scopeLabel({ scope_kind: "room", scope_id: "bedroom" })).toBe("bedroom");
  });
});
