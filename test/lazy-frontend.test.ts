// test/lazy-frontend.test.ts
import { beforeEach, describe, expect, test, vi } from "vitest";
import { _internals, _resetForTests, loadFrontend } from "../frontend/src/lazy-frontend";

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

  test("does not memoise a rejected import — a later call retries", async () => {
    _internals.importer = vi
      .fn()
      .mockRejectedValueOnce(new Error("network"))
      .mockResolvedValueOnce({});

    await expect(loadFrontend("http://ha.local/x/ambience-card.js")).rejects.toThrow("network");
    // Second call must retry rather than return the cached rejected promise.
    await expect(loadFrontend("http://ha.local/x/ambience-card.js")).resolves.toBeUndefined();
    expect(_internals.importer).toHaveBeenCalledTimes(2);
  });
});
