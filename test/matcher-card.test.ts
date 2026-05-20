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
});
