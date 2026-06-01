// test/lazy-frontend.test.ts
import { describe, test, expect, vi, beforeEach } from "vitest";
import { loadFrontend, _internals, _resetForTests } from "../frontend/src/lazy-frontend";

describe("loadFrontend", () => {
  beforeEach(() => {
    _resetForTests();
    _internals.importer = vi.fn().mockResolvedValue({});
  });

  test("imports the sibling ambience-frontend.js, forwarding the fe hash", async () => {
    await loadFrontend("http://ha.local/ambience-panel/ambience-card.js?fe=abc123");
    expect(_internals.importer).toHaveBeenCalledWith(
      "http://ha.local/ambience-panel/ambience-frontend.js?fe=abc123",
    );
  });

  test("omits the query when no fe hash is present", async () => {
    await loadFrontend("http://ha.local/ambience-panel/ambience-card.js");
    expect(_internals.importer).toHaveBeenCalledWith(
      "http://ha.local/ambience-panel/ambience-frontend.js",
    );
  });

  test("dedupes: importer runs only once across repeated calls", async () => {
    await loadFrontend("http://ha.local/x/ambience-card.js");
    await loadFrontend("http://ha.local/x/ambience-card.js");
    expect(_internals.importer).toHaveBeenCalledTimes(1);
  });
});
