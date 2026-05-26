import { describe, test, expect, afterEach } from "vitest";
import "../frontend/src/views/matcher-card";

async function mount(opts: { name?: string; description?: string } = {}): Promise<any> {
  const el: any = document.createElement("ambience-matcher-card");
  el.matcherName = opts.name ?? "time_of_day";
  el.matcherDescription = opts.description ?? "Matches time";
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe("ambience-matcher-card", () => {
  let el: any;
  afterEach(() => el?.remove());

  test("renders the header text", async () => {
    el = await mount({ name: "day", description: "Matches days" });
    expect(el.shadowRoot.textContent).toContain("Day");
    expect(el.shadowRoot.textContent).toContain("Matches days");
  });

  test("is collapsed by default", async () => {
    el = await mount();
    const body = el.shadowRoot.querySelector(".body") as HTMLElement;
    expect(body.classList.contains("collapsed")).toBe(true);
  });

  test("clicking the header toggles collapse", async () => {
    el = await mount();
    const header = el.shadowRoot.querySelector("header") as HTMLElement;
    header.click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".body").classList.contains("collapsed")).toBe(false);
    header.click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".body").classList.contains("collapsed")).toBe(true);
  });

  test("does not render a checkbox or emit enable-changed", async () => {
    el = await mount();
    expect(el.shadowRoot.querySelector("input[type='checkbox']")).toBeNull();
  });
});
