import { beforeEach, describe, expect, it } from "vitest";
import { DOCS_BASE_URL } from "../frontend/src/docs";
import "../frontend/src/views/ambience-help";

async function mount(text = "Helpful explanation", multiline = false) {
  const el = document.createElement("ambience-help") as any;
  el.text = text;
  el.multiline = multiline;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe("ambience-help", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("opens on trigger click and shows the text", async () => {
    const el = await mount();
    expect(el.shadowRoot.querySelector('[data-test="help-popover"]')).toBeNull();
    el.shadowRoot.querySelector('[data-test="help-trigger"]').click();
    await el.updateComplete;
    const pop = el.shadowRoot.querySelector('[data-test="help-popover"]');
    expect(pop).not.toBeNull();
    expect(pop.textContent).toContain("Helpful explanation");
  });

  it("closes on Escape", async () => {
    const el = await mount();
    el.shadowRoot.querySelector('[data-test="help-trigger"]').click();
    await el.updateComplete;
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('[data-test="help-popover"]')).toBeNull();
  });

  it("closes on outside click", async () => {
    const el = await mount();
    el.shadowRoot.querySelector('[data-test="help-trigger"]').click();
    await el.updateComplete;
    document.body.click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('[data-test="help-popover"]')).toBeNull();
  });

  it("closes on outside click even inside a container that stops click propagation", async () => {
    // The settings panel lives inside a modal whose `.modal` stops click
    // propagation in the bubble phase. A capture-phase document listener must
    // still see the click so the popover dismisses. This reproduces that.
    document.body.innerHTML = "";
    const modal = document.createElement("div");
    modal.addEventListener("click", (e) => e.stopPropagation());
    const el = document.createElement("ambience-help") as any;
    el.text = "Helpful explanation";
    const elsewhere = document.createElement("button");
    modal.append(el, elsewhere);
    document.body.appendChild(modal);
    await el.updateComplete;

    el.shadowRoot.querySelector('[data-test="help-trigger"]').click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('[data-test="help-popover"]')).not.toBeNull();

    elsewhere.click(); // bubble is stopped at `modal`, but capture still reaches document
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('[data-test="help-popover"]')).toBeNull();
  });

  it("marks the popover multiline when the multiline property is set", async () => {
    const el = await mount("Line one\nLine two", true);
    el.shadowRoot.querySelector('[data-test="help-trigger"]').click();
    await el.updateComplete;
    const pop = el.shadowRoot.querySelector('[data-test="help-popover"]') as HTMLElement;
    expect(pop.classList.contains("multiline")).toBe(true);
  });

  it("does not mark the popover multiline by default", async () => {
    const el = await mount();
    el.shadowRoot.querySelector('[data-test="help-trigger"]').click();
    await el.updateComplete;
    const pop = el.shadowRoot.querySelector('[data-test="help-popover"]') as HTMLElement;
    expect(pop.classList.contains("multiline")).toBe(false);
  });

  it("renders the text with no surrounding structural whitespace", async () => {
    // Under `multiline` the popover is pre-wrap, so any newline/indentation the
    // Lit template puts around the slotted text would render as a visible
    // leading offset. The popover's text content must be exactly the value.
    const el = await mount("Line one\nLine two", true);
    el.shadowRoot.querySelector('[data-test="help-trigger"]').click();
    await el.updateComplete;
    const pop = el.shadowRoot.querySelector('[data-test="help-popover"]') as HTMLElement;
    expect(pop.textContent).toBe("Line one\nLine two");
  });
});

async function mountDoc(docPath: string, text = "") {
  const el = document.createElement("ambience-help") as any;
  el.text = text;
  el.docPath = docPath;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe("ambience-help docs link", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("renders the (?) as a direct external link when there is no text", async () => {
    const el = await mountDoc("conditions/lux");
    expect(el.shadowRoot.querySelector('[data-test="help-popover"]')).toBeNull();
    const a = el.shadowRoot.querySelector('[data-test="help-doc-link"]') as HTMLAnchorElement;
    expect(a).not.toBeNull();
    expect(a.tagName).toBe("A");
    expect(a.getAttribute("href")).toBe(`${DOCS_BASE_URL}/conditions/lux/`);
    expect(a.getAttribute("target")).toBe("_blank");
    expect(a.getAttribute("rel")).toBe("noopener noreferrer");
    expect(a.getAttribute("aria-label")).toBe("Open documentation");
  });

  it("direct link stops click propagation so a parent toggle does not fire", async () => {
    const parent = document.createElement("div");
    let parentClicked = false;
    parent.addEventListener("click", () => {
      parentClicked = true;
    });
    const el = document.createElement("ambience-help") as any;
    el.docPath = "conditions/lux";
    parent.appendChild(el);
    document.body.appendChild(parent);
    await el.updateComplete;
    const suppressNav = (e: Event) => e.preventDefault();
    document.addEventListener("click", suppressNav, true);
    el.shadowRoot.querySelector('[data-test="help-doc-link"]').click();
    document.removeEventListener("click", suppressNav, true);
    await el.updateComplete;
    expect(parentClicked).toBe(false);
  });

  it("renders nothing when neither text nor docPath is set", async () => {
    const el = await mountDoc("");
    expect(el.shadowRoot.querySelector('[data-test="help-trigger"]')).toBeNull();
    expect(el.shadowRoot.querySelector('[data-test="help-doc-link"]')).toBeNull();
  });

  it("popover gains a Read more docs link when text and docPath are both set", async () => {
    const el = await mountDoc("conditions/lux", "Lux is light level");
    el.shadowRoot.querySelector('[data-test="help-trigger"]').click();
    await el.updateComplete;
    const pop = el.shadowRoot.querySelector('[data-test="help-popover"]');
    expect(pop.textContent).toContain("Lux is light level");
    const a = pop.querySelector('[data-test="help-doc-link"]') as HTMLAnchorElement;
    expect(a.getAttribute("href")).toBe(`${DOCS_BASE_URL}/conditions/lux/`);
    expect(a.getAttribute("target")).toBe("_blank");
  });

  it("does not close the popover when the Read more link is clicked", async () => {
    const el = await mountDoc("conditions/lux", "Lux is light level");
    el.shadowRoot.querySelector('[data-test="help-trigger"]').click();
    await el.updateComplete;
    const suppressNav = (e: Event) => e.preventDefault();
    document.addEventListener("click", suppressNav, true);
    el.shadowRoot.querySelector('[data-test="help-doc-link"]').click();
    document.removeEventListener("click", suppressNav, true);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('[data-test="help-popover"]')).not.toBeNull();
  });
});
