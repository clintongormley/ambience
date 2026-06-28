import { afterEach, beforeEach, describe, expect, it, test, vi } from "vitest";

import {
  getCollapsedCategories,
  getConditionsHintDismissed,
  getDismissedLangRequests,
  getExpandedScopes,
  getFadoNoticeDismissed,
  getFilterCategory,
  isLangRequestDismissed,
  persistDismissedLangRequest,
  setCollapsedCategories,
  setConditionsHintDismissed,
  setExpandedScopes,
  setFadoNoticeDismissed,
  setFilterCategory,
} from "../frontend/src/ui-state";

describe("language-request dismissal set", () => {
  beforeEach(() => window.localStorage.clear());

  it("returns [] when nothing is stored", () => {
    expect(getDismissedLangRequests()).toEqual([]);
  });
  it("round-trips a dismissal", () => {
    persistDismissedLangRequest("fr");
    expect(isLangRequestDismissed("fr")).toBe(true);
    expect(isLangRequestDismissed("de")).toBe(false);
  });
  it("remembers EVERY dismissed locale (set, not single value)", () => {
    persistDismissedLangRequest("fr");
    persistDismissedLangRequest("de");
    expect(isLangRequestDismissed("fr")).toBe(true); // earlier one still dismissed
    expect(isLangRequestDismissed("de")).toBe(true);
    expect(getDismissedLangRequests().sort()).toEqual(["de", "fr"]);
  });
  it("de-dups repeats", () => {
    persistDismissedLangRequest("fr");
    persistDismissedLangRequest("fr");
    expect(getDismissedLangRequests()).toEqual(["fr"]);
  });
  it("returns [] on malformed JSON", () => {
    window.localStorage.setItem("ambience-lang-request-dismissed", "{not json");
    expect(getDismissedLangRequests()).toEqual([]);
  });
});

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

  describe("conditions hint dismissed (per install)", () => {
    test("not dismissed by default", () => {
      expect(getConditionsHintDismissed("entry-1")).toBe(false);
    });

    test("dismissed only for the install id it was dismissed against", () => {
      setConditionsHintDismissed("entry-1");
      expect(getConditionsHintDismissed("entry-1")).toBe(true);
      // A different install (delete + recreate ⇒ new entry_id) re-shows it.
      expect(getConditionsHintDismissed("entry-2")).toBe(false);
    });

    test("not dismissed when the current install id is unknown (null)", () => {
      setConditionsHintDismissed("entry-1");
      expect(getConditionsHintDismissed(null)).toBe(false);
    });

    test("a null install id is never persisted", () => {
      setConditionsHintDismissed(null);
      expect(window.localStorage.getItem("ambience-conditions-hint-dismissed")).toBeNull();
      expect(getConditionsHintDismissed("entry-1")).toBe(false);
    });

    test("returns false when reading throws (storage disabled)", () => {
      vi.spyOn(window.localStorage, "getItem").mockImplementation(() => {
        throw new Error("storage disabled");
      });
      expect(getConditionsHintDismissed("entry-1")).toBe(false);
    });

    test("swallows errors when writing throws (storage disabled)", () => {
      vi.spyOn(window.localStorage, "setItem").mockImplementation(() => {
        throw new Error("storage disabled");
      });
      expect(() => setConditionsHintDismissed("entry-1")).not.toThrow();
    });
  });

  describe("fado notice dismissed (per install)", () => {
    test("not dismissed by default", () => {
      expect(getFadoNoticeDismissed("entry-1")).toBe(false);
    });

    test("dismissed only for the install id it was dismissed against", () => {
      setFadoNoticeDismissed("entry-1");
      expect(getFadoNoticeDismissed("entry-1")).toBe(true);
      expect(getFadoNoticeDismissed("entry-2")).toBe(false);
    });

    test("not dismissed when the current install id is unknown (null)", () => {
      setFadoNoticeDismissed("entry-1");
      expect(getFadoNoticeDismissed(null)).toBe(false);
    });

    test("a null install id is never persisted", () => {
      setFadoNoticeDismissed(null);
      expect(window.localStorage.getItem("ambience-fado-notice-dismissed")).toBeNull();
      expect(getFadoNoticeDismissed("entry-1")).toBe(false);
    });

    test("returns false when reading throws (storage disabled)", () => {
      vi.spyOn(window.localStorage, "getItem").mockImplementation(() => {
        throw new Error("storage disabled");
      });
      expect(getFadoNoticeDismissed("entry-1")).toBe(false);
    });

    test("swallows errors when writing throws (storage disabled)", () => {
      vi.spyOn(window.localStorage, "setItem").mockImplementation(() => {
        throw new Error("storage disabled");
      });
      expect(() => setFadoNoticeDismissed("entry-1")).not.toThrow();
    });
  });
});
