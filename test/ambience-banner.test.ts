import { beforeEach, describe, expect, it } from "vitest";
import "../frontend/src/views/banner";

async function mount(props: Record<string, unknown> = {}) {
  const el = document.createElement("ambience-banner") as any;
  Object.assign(el, props);
  el.innerHTML = "<strong>Title</strong><span>Body</span>";
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe("ambience-banner", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("renders the leading icon and slotted text", async () => {
    const el = await mount({ icon: "mdi:translate" });
    expect(el.shadowRoot.querySelector("ha-icon").getAttribute("icon")).toBe("mdi:translate");
    expect(el.textContent).toContain("Title");
    expect(el.textContent).toContain("Body");
  });

  it("CTA is an external link when ctaHref is set", async () => {
    const el = await mount({ ctaLabel: "Go", ctaHref: "https://example.com/x" });
    const cta = el.shadowRoot.querySelector('[data-test="banner-cta"]');
    expect(cta.tagName).toBe("A");
    expect(cta.getAttribute("href")).toBe("https://example.com/x");
    expect(cta.getAttribute("target")).toBe("_blank");
    expect(cta.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("CTA is a button that emits banner-cta when no href", async () => {
    const el = await mount({ ctaLabel: "Go" });
    const cta = el.shadowRoot.querySelector('[data-test="banner-cta"]');
    expect(cta.tagName).toBe("BUTTON");
    let fired = false;
    el.addEventListener("banner-cta", () => (fired = true));
    cta.click();
    expect(fired).toBe(true);
  });

  it("dismiss emits banner-dismiss, stops propagation, and exposes the label", async () => {
    const el = await mount({ dismissLabel: "Dismiss" });
    const dismiss = el.shadowRoot.querySelector('[data-test="banner-dismiss"]');
    expect(dismiss.getAttribute("aria-label")).toBe("Dismiss");
    let parentSawClick = false;
    el.addEventListener("click", () => (parentSawClick = true));
    let dismissed = false;
    el.addEventListener("banner-dismiss", () => (dismissed = true));
    dismiss.click();
    expect(dismissed).toBe(true);
    expect(parentSawClick).toBe(false); // stopPropagation
  });
});
