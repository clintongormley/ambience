import { afterEach, describe, expect, test } from "vitest";

import { randomId } from "../frontend/src/random-id.js";

describe("randomId", () => {
  const original = globalThis.crypto;
  afterEach(() => {
    // Restore the real crypto after any per-test stubbing.
    Object.defineProperty(globalThis, "crypto", { value: original, configurable: true });
  });

  test("returns a non-empty id with no dashes", () => {
    const id = randomId();
    expect(id.length).toBeGreaterThan(0);
    expect(id).not.toContain("-");
  });

  test("returns distinct ids across calls", () => {
    const ids = new Set(Array.from({ length: 100 }, () => randomId()));
    expect(ids.size).toBe(100);
  });

  test("works without crypto.randomUUID (non-secure-context, e.g. HA over plain HTTP)", () => {
    // crypto.randomUUID only exists in secure contexts; HA over http:// has none,
    // so the helper must not depend on it. getRandomValues is still present.
    Object.defineProperty(globalThis, "crypto", {
      value: { getRandomValues: original.getRandomValues.bind(original) },
      configurable: true,
    });
    const id = randomId();
    expect(id.length).toBeGreaterThan(0);
    expect(id).not.toContain("-");
  });

  test("works with no crypto at all (last-resort fallback)", () => {
    Object.defineProperty(globalThis, "crypto", { value: undefined, configurable: true });
    const id = randomId();
    expect(id.length).toBeGreaterThan(0);
    expect(id).not.toContain("-");
  });
});
