import { describe, expect, it } from "vitest";
import { buildTranslationRequestUrl, GITHUB_REPO_URL } from "../frontend/src/github";

describe("buildTranslationRequestUrl", () => {
  it("targets the repo's new-issue path", () => {
    const url = buildTranslationRequestUrl("fr", "français");
    expect(url.startsWith(`${GITHUB_REPO_URL}/issues/new?`)).toBe(true);
  });
  it("adds the translation label and a titled, prefilled body", () => {
    const url = new URL(buildTranslationRequestUrl("fr", "français"));
    expect(url.searchParams.get("labels")).toBe("translation");
    expect(url.searchParams.get("title")).toBe("Translation request: français (fr)");
    expect(url.searchParams.get("body")).toContain("français");
    // prefilled via ?body=, NOT ?template=
    expect(url.searchParams.has("template")).toBe(false);
    expect(url.searchParams.get("body")).toBeTruthy();
  });
  it("encodes region variants and special characters", () => {
    const url = new URL(buildTranslationRequestUrl("pt-BR", "português (Brasil)"));
    expect(url.searchParams.get("title")).toBe("Translation request: português (Brasil) (pt-BR)");
  });
});
