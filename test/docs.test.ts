import { describe, expect, it } from "vitest";
import { conditionDocPath, DOCS_BASE_URL, docUrl } from "../frontend/src/docs";

describe("docUrl", () => {
  it("builds an absolute, trailing-slash URL from a site-relative path", () => {
    expect(docUrl("conditions/lux")).toBe(`${DOCS_BASE_URL}/conditions/lux/`);
  });

  it("returns the site root for an empty path", () => {
    expect(docUrl("")).toBe(`${DOCS_BASE_URL}/`);
  });

  it("normalises stray leading/trailing slashes", () => {
    expect(docUrl("/conditions/lux/")).toBe(`${DOCS_BASE_URL}/conditions/lux/`);
  });
});

describe("conditionDocPath", () => {
  it("maps an identity-named condition kind to its conditions/ page", () => {
    expect(conditionDocPath("lux")).toBe("conditions/lux");
  });

  it("maps the entity-state kind 'state' to the entity-state slug", () => {
    expect(conditionDocPath("state")).toBe("conditions/entity-state");
  });

  it("maps the underscored 'time_of_day' kind to the hyphenated slug", () => {
    expect(conditionDocPath("time_of_day")).toBe("conditions/time-of-day");
  });

  it("returns undefined for an unknown condition kind", () => {
    expect(conditionDocPath("not-a-real-kind")).toBeUndefined();
  });
});
