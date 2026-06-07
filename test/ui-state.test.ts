import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import {
  getConditionsHintDismissed,
  getExpandedScopes,
  getFilterCategory,
  setConditionsHintDismissed,
  setExpandedScopes,
  setFilterCategory,
} from "../frontend/src/ui-state";

describe("ui-state persistence", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("filter category", () => {
    test('defaults to "" when nothing stored', () => {
      expect(getFilterCategory()).toBe("");
    });

    test("round-trips a stored category id", () => {
      setFilterCategory("relax");
      expect(getFilterCategory()).toBe("relax");
    });

    test('"" overwrites a previously stored id', () => {
      setFilterCategory("relax");
      setFilterCategory("");
      expect(getFilterCategory()).toBe("");
    });

    test('returns "" when reading throws (storage disabled)', () => {
      vi.spyOn(window.localStorage, "getItem").mockImplementation(() => {
        throw new Error("storage disabled");
      });
      expect(getFilterCategory()).toBe("");
    });

    test("swallows errors when writing throws (storage disabled)", () => {
      vi.spyOn(window.localStorage, "setItem").mockImplementation(() => {
        throw new Error("storage disabled");
      });
      expect(() => setFilterCategory("relax")).not.toThrow();
    });
  });

  describe("expanded scopes", () => {
    test("defaults to [] when nothing stored", () => {
      expect(getExpandedScopes()).toEqual([]);
    });

    test("round-trips a list of scope keys", () => {
      setExpandedScopes(["house", "area:kitchen", "floor:ground"]);
      expect(getExpandedScopes()).toEqual(["house", "area:kitchen", "floor:ground"]);
    });

    test("an empty list overwrites a previously stored list", () => {
      setExpandedScopes(["house"]);
      setExpandedScopes([]);
      expect(getExpandedScopes()).toEqual([]);
    });

    test("returns [] for malformed JSON", () => {
      window.localStorage.setItem("ambience-expanded-scopes", "{not json");
      expect(getExpandedScopes()).toEqual([]);
    });

    test("returns [] when the stored value is not an array (e.g. an object)", () => {
      window.localStorage.setItem("ambience-expanded-scopes", '{"house":true}');
      expect(getExpandedScopes()).toEqual([]);
    });

    test("recovers the valid string keys from an array with mixed entries", () => {
      window.localStorage.setItem(
        "ambience-expanded-scopes",
        JSON.stringify(["house", 123, null, "area:kitchen"]),
      );
      expect(getExpandedScopes()).toEqual(["house", "area:kitchen"]);
    });

    test("returns [] when reading throws (storage disabled)", () => {
      vi.spyOn(window.localStorage, "getItem").mockImplementation(() => {
        throw new Error("storage disabled");
      });
      expect(getExpandedScopes()).toEqual([]);
    });

    test("swallows errors when writing throws (storage disabled)", () => {
      vi.spyOn(window.localStorage, "setItem").mockImplementation(() => {
        throw new Error("storage disabled");
      });
      expect(() => setExpandedScopes(["house"])).not.toThrow();
    });
  });

  describe("conditions hint dismissed", () => {
    test("defaults to false when nothing stored", () => {
      expect(getConditionsHintDismissed()).toBe(false);
    });

    test("round-trips the dismissed flag", () => {
      setConditionsHintDismissed();
      expect(getConditionsHintDismissed()).toBe(true);
    });

    test("returns false when reading throws (storage disabled)", () => {
      vi.spyOn(window.localStorage, "getItem").mockImplementation(() => {
        throw new Error("storage disabled");
      });
      expect(getConditionsHintDismissed()).toBe(false);
    });

    test("swallows errors when writing throws (storage disabled)", () => {
      vi.spyOn(window.localStorage, "setItem").mockImplementation(() => {
        throw new Error("storage disabled");
      });
      expect(() => setConditionsHintDismissed()).not.toThrow();
    });
  });
});
