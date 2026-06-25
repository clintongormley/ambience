import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import {
  getCollapsedCategories,
  getConditionsHintDismissed,
  getExpandedScopes,
  getFadoNoticeDismissed,
  getFilterCategory,
  setCollapsedCategories,
  setConditionsHintDismissed,
  setExpandedScopes,
  setFadoNoticeDismissed,
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

  describe("collapsed categories", () => {
    test("defaults to [] when nothing stored", () => {
      expect(getCollapsedCategories()).toEqual([]);
    });

    test("round-trips a list of scope+category keys", () => {
      setCollapsedCategories(["house\u0000relax", "area:kitchen\u0000night"]);
      expect(getCollapsedCategories()).toEqual(["house\u0000relax", "area:kitchen\u0000night"]);
    });

    test("an empty list overwrites a previously stored list", () => {
      setCollapsedCategories(["house\u0000relax"]);
      setCollapsedCategories([]);
      expect(getCollapsedCategories()).toEqual([]);
    });

    test("returns [] for malformed JSON", () => {
      window.localStorage.setItem("ambience-collapsed-categories", "{not json");
      expect(getCollapsedCategories()).toEqual([]);
    });

    test("returns [] when the stored value is not an array (e.g. an object)", () => {
      window.localStorage.setItem("ambience-collapsed-categories", '{"house":true}');
      expect(getCollapsedCategories()).toEqual([]);
    });

    test("recovers the valid string keys from an array with mixed entries", () => {
      window.localStorage.setItem(
        "ambience-collapsed-categories",
        JSON.stringify(["house\u0000relax", 123, null, "area:kitchen\u0000night"]),
      );
      expect(getCollapsedCategories()).toEqual(["house\u0000relax", "area:kitchen\u0000night"]);
    });

    test("returns [] when reading throws (storage disabled)", () => {
      vi.spyOn(window.localStorage, "getItem").mockImplementation(() => {
        throw new Error("storage disabled");
      });
      expect(getCollapsedCategories()).toEqual([]);
    });

    test("swallows errors when writing throws (storage disabled)", () => {
      vi.spyOn(window.localStorage, "setItem").mockImplementation(() => {
        throw new Error("storage disabled");
      });
      expect(() => setCollapsedCategories(["house\u0000relax"])).not.toThrow();
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

  describe("fado notice dismissed", () => {
    test("defaults to false when nothing stored", () => {
      expect(getFadoNoticeDismissed()).toBe(false);
    });

    test("set then get returns true", () => {
      setFadoNoticeDismissed();
      expect(getFadoNoticeDismissed()).toBe(true);
    });

    test("returns false when reading throws (storage disabled)", () => {
      vi.spyOn(window.localStorage, "getItem").mockImplementation(() => {
        throw new Error("storage disabled");
      });
      expect(getFadoNoticeDismissed()).toBe(false);
    });

    test("swallows errors when writing throws (storage disabled)", () => {
      vi.spyOn(window.localStorage, "setItem").mockImplementation(() => {
        throw new Error("storage disabled");
      });
      expect(() => setFadoNoticeDismissed()).not.toThrow();
    });
  });
});
