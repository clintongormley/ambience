import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "../frontend/src/views/language-banner";
import { buildTranslationRequestUrl } from "../frontend/src/github";

async function mount(language: string | undefined) {
  const el = document.createElement("ambience-language-banner") as any;
  el.hass = language === undefined ? {} : { language };
  document.body.appendChild(el);
  await el.updateComplete;
  const inner = el.shadowRoot.querySelector("ambience-banner");
  if (inner) await inner.updateComplete;
  return el;
}
const innerBanner = (el: any) => el.shadowRoot.querySelector("ambience-banner");

describe("ambience-language-banner", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    window.localStorage.clear();
  });
  afterEach(() => vi.restoreAllMocks());

  it("shows for an uncovered, undismissed language", async () => {
    const el = await mount("fr");
    expect(innerBanner(el)).not.toBeNull();
    expect(el.shadowRoot.textContent.toLowerCase()).toContain("français");
    // the language name and product are bolded (not just present as plain text)
    const bolded = [...el.shadowRoot.querySelectorAll("strong")].map((s: Element) =>
      s.textContent?.toLowerCase(),
    );
    expect(bolded).toContain("français");
    expect(bolded).toContain("ambience");
  });

  it("hidden for a covered language", async () => {
    const el = await mount("es");
    expect(innerBanner(el)).toBeNull();
  });

  it("hidden for an undeterminable language", async () => {
    const el = await mount(undefined);
    expect(innerBanner(el)).toBeNull();
  });

  it("CTA href is the built translation-request URL", async () => {
    const el = await mount("fr");
    const cta = innerBanner(el).shadowRoot.querySelector('[data-test="banner-cta"]');
    expect(cta.getAttribute("href")).toBe(buildTranslationRequestUrl("fr", "français"));
  });

  it("dismiss persists and hides the banner", async () => {
    const el = await mount("fr");
    innerBanner(el).shadowRoot.querySelector('[data-test="banner-dismiss"]').click();
    await el.updateComplete;
    expect(innerBanner(el)).toBeNull();
    // persisted: a fresh element for the same locale stays hidden
    const el2 = await mount("fr");
    expect(innerBanner(el2)).toBeNull();
  });

  it("reappears for a DIFFERENT uncovered locale after dismissing one", async () => {
    const el = await mount("fr");
    innerBanner(el).shadowRoot.querySelector('[data-test="banner-dismiss"]').click();
    await el.updateComplete;
    el.hass = { language: "de" };
    await el.updateComplete;
    await innerBanner(el)?.updateComplete;
    expect(innerBanner(el)).not.toBeNull();
    expect(el.shadowRoot.textContent.toLowerCase()).toContain("deutsch");
  });

  it("STAYS dismissed for an earlier locale after dismissing another", async () => {
    // dismiss fr, dismiss de, switch back to fr → still hidden (set, not single)
    const fr = await mount("fr");
    fr.shadowRoot
      .querySelector("ambience-banner")
      .shadowRoot.querySelector('[data-test="banner-dismiss"]')
      .click();
    await fr.updateComplete;
    const de = await mount("de");
    de.shadowRoot
      .querySelector("ambience-banner")
      .shadowRoot.querySelector('[data-test="banner-dismiss"]')
      .click();
    await de.updateComplete;
    const frAgain = await mount("fr");
    expect(frAgain.shadowRoot.querySelector("ambience-banner")).toBeNull();
  });

  it("keeps each dismissed locale hidden for the session even when storage is unavailable", async () => {
    // Private-mode style: localStorage throws, so nothing persists — only the
    // in-memory dismissed-set can keep an earlier locale hidden on return.
    vi.spyOn(window.localStorage, "setItem").mockImplementation(() => {
      throw new Error("denied");
    });
    vi.spyOn(window.localStorage, "getItem").mockImplementation(() => {
      throw new Error("denied");
    });
    const el = await mount("fr");
    innerBanner(el).shadowRoot.querySelector('[data-test="banner-dismiss"]').click();
    await el.updateComplete;
    // switch to a second uncovered locale and dismiss it too
    el.hass = { language: "de" };
    await el.updateComplete;
    await innerBanner(el)?.updateComplete;
    innerBanner(el).shadowRoot.querySelector('[data-test="banner-dismiss"]').click();
    await el.updateComplete;
    // back to the first locale — still hidden (a single-value store would re-nag)
    el.hass = { language: "fr" };
    await el.updateComplete;
    expect(innerBanner(el)).toBeNull();
  });
});
