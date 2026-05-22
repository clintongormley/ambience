import { describe, test, expect, afterEach } from "vitest";
import "../frontend/src/views/matcher-card";

async function mount(opts: { name?: string; enabled?: boolean; description?: string } = {}): Promise<any> {
  const el: any = document.createElement("ambience-matcher-card");
  el.matcherName = opts.name ?? "time_of_day";
  el.matcherDescription = opts.description ?? "Matches time";
  el.enabled = opts.enabled ?? true;
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

  test("checkbox reflects the enabled prop", async () => {
    el = await mount({ enabled: false });
    const cb = el.shadowRoot.querySelector("input[type='checkbox']") as HTMLInputElement;
    expect(cb.checked).toBe(false);
  });

  test("emits enable-changed when the user toggles", async () => {
    el = await mount({ enabled: false });
    const cb = el.shadowRoot.querySelector("input[type='checkbox']") as HTMLInputElement;
    let detail: any;
    el.addEventListener("enable-changed", (e: Event) => { detail = (e as CustomEvent).detail; });
    cb.checked = true;
    cb.dispatchEvent(new Event("change"));
    expect(detail).toEqual({ enabled: true });
  });

  test("body slot is greyed when disabled", async () => {
    el = await mount({ enabled: false });
    const body = el.shadowRoot.querySelector(".body") as HTMLElement;
    expect(body.classList.contains("disabled")).toBe(true);
  });

  test("is expanded by default", async () => {
    el = await mount();
    const body = el.shadowRoot.querySelector(".body") as HTMLElement;
    expect(body.classList.contains("collapsed")).toBe(false);
  });

  test("clicking the header toggles collapse", async () => {
    el = await mount();
    const header = el.shadowRoot.querySelector("header") as HTMLElement;
    header.click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".body").classList.contains("collapsed")).toBe(true);
    header.click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".body").classList.contains("collapsed")).toBe(false);
  });

  test("clicking the checkbox toggles enable, not collapse", async () => {
    el = await mount({ enabled: true });
    const cb = el.shadowRoot.querySelector("input[type='checkbox']") as HTMLInputElement;
    let detail: any;
    el.addEventListener("enable-changed", (e: Event) => { detail = (e as CustomEvent).detail; });
    cb.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));
    cb.checked = false;
    cb.dispatchEvent(new Event("change"));
    await el.updateComplete;
    expect(detail).toEqual({ enabled: false });
    // collapse state untouched by interacting with the checkbox
    expect(el.shadowRoot.querySelector(".body").classList.contains("collapsed")).toBe(false);
  });

  test("the enable checkbox sits after the label (right-hand side)", async () => {
    el = await mount();
    const header = el.shadowRoot.querySelector("header") as HTMLElement;
    const nodes = Array.from(header.children);
    const labelIdx = nodes.findIndex((n) => n.tagName === "LABEL");
    const cbIdx = nodes.findIndex((n) => n.querySelector?.("input[type='checkbox']") || n.matches?.("input[type='checkbox']"));
    expect(cbIdx).toBeGreaterThan(labelIdx);
  });
});
