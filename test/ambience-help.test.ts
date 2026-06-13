import { beforeEach, describe, expect, it } from "vitest";
import "../frontend/src/views/ambience-help";

async function mount(text = "Helpful explanation") {
  const el = document.createElement("ambience-help") as any;
  el.text = text;
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
});
