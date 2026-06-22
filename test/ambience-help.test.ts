import { beforeEach, describe, expect, it } from "vitest";
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
});
