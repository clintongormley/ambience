import { afterEach, describe, expect, test } from "vitest";

import "../frontend/src/views/live-dot";

let el: any;

afterEach(() => el?.remove());

async function mount(kind: "matched" | "stale", label: string): Promise<any> {
  el = document.createElement("ambience-live-dot");
  el.kind = kind;
  el.label = label;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe("ambience-live-dot", () => {
  test("renders a dot of the given kind, label as aria-label, no popover until clicked", async () => {
    const el = await mount("matched", "Live now — matches and applied");
    const btn = el.shadowRoot.querySelector("button.dot.matched");
    expect(btn).not.toBeNull();
    expect(btn.getAttribute("aria-label")).toBe("Live now — matches and applied");
    expect(el.shadowRoot.querySelector(".popover")).toBeNull();
  });

  test("clicking the dot toggles a popover containing the label", async () => {
    const el = await mount("stale", "Still applied — no longer matching");
    const btn = el.shadowRoot.querySelector("button.dot");

    btn.click();
    await el.updateComplete;
    const pop = el.shadowRoot.querySelector(".popover");
    expect(pop).not.toBeNull();
    expect(pop.textContent).toContain("Still applied");

    btn.click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".popover")).toBeNull();
  });

  test("an outside click closes the popover", async () => {
    const el = await mount("matched", "Live now");
    el.shadowRoot.querySelector("button.dot").click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".popover")).not.toBeNull();

    document.body.click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".popover")).toBeNull();
  });
});
