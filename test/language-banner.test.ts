import { beforeEach, describe, expect, it } from "vitest";
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

  it("shows for an uncovered, undismissed language", async () => {
    const el = await mount("fr");
    expect(innerBanner(el)).not.toBeNull();
    expect(el.shadowRoot.textContent.toLowerCase()).toContain("français");
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
    fr.shadowRoot.querySelector("ambience-banner").shadowRoot
      .querySelector('[data-test="banner-dismiss"]').click();
    await fr.updateComplete;
    const de = await mount("de");
    de.shadowRoot.querySelector("ambience-banner").shadowRoot
      .querySelector('[data-test="banner-dismiss"]').click();
    await de.updateComplete;
    const frAgain = await mount("fr");
    expect(frAgain.shadowRoot.querySelector("ambience-banner")).toBeNull();
  });
});
