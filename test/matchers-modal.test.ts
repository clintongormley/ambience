import { describe, test, expect, afterEach } from "vitest";
import "../frontend/src/views/matchers-modal";
import type { MatcherInfo } from "../frontend/src/types";

const toggleable: MatcherInfo[] = [
  {
    name: "time_of_day",
    description: "Matches time",
    predicate_help: "use period id",
    toggleable: true,
    input: "time_of_day",
    priority: 100,
  },
  {
    name: "weather",
    description: "Matches weather",
    predicate_help: "use weather code",
    toggleable: true,
    input: "text",
    priority: 200,
  },
];

// scene is always-on (toggleable: false) and should be filtered out
const allMatchers: MatcherInfo[] = [
  {
    name: "scene",
    description: "Scene",
    predicate_help: "",
    toggleable: false,
    input: "scene_combobox",
    priority: 0,
  },
  ...toggleable,
];

async function mount(opts: {
  matchers?: MatcherInfo[];
  selected?: string[];
  open?: boolean;
} = {}): Promise<any> {
  const el: any = document.createElement("ambience-matchers-modal");
  el.matchers = opts.matchers ?? allMatchers;
  el.selected = opts.selected ?? [];
  if (opts.open !== undefined) el.open = opts.open;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function captureEvent(el: HTMLElement, name: string) {
  let detail: any;
  el.addEventListener(name, (e: Event) => { detail = (e as CustomEvent).detail; });
  return () => detail;
}

describe("ambience-matchers-modal", () => {
  let el: any;
  afterEach(() => { el?.remove(); });

  test("non-toggleable matchers (scene) are not rendered", async () => {
    el = await mount({ open: true });
    const rows = el.shadowRoot.querySelectorAll(".matcher-row");
    const names = [...rows].map((r: any) => r.querySelector(".matcher-name").textContent);
    expect(names).not.toContain("scene");
    expect(names).toContain("time_of_day");
    expect(names).toContain("weather");
  });

  test("selected matchers start checked", async () => {
    el = await mount({ selected: ["time_of_day"], open: true });
    const rows = el.shadowRoot.querySelectorAll(".matcher-row");
    const first = rows[0];
    const checkbox = first.querySelector("input[type=checkbox]") as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  test("unselected matchers start unchecked", async () => {
    el = await mount({ selected: [], open: true });
    const rows = el.shadowRoot.querySelectorAll(".matcher-row");
    const first = rows[0];
    const checkbox = first.querySelector("input[type=checkbox]") as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
  });

  test("toggling a checkbox updates the draft", async () => {
    el = await mount({ selected: [], open: true });
    const rows = el.shadowRoot.querySelectorAll(".matcher-row");
    const checkbox = rows[0].querySelector("input[type=checkbox]") as HTMLInputElement;
    // simulate checking it
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;
    expect(checkbox.checked).toBe(true);
  });

  test("apply emits apply-matchers with draft selection", async () => {
    el = await mount({ selected: ["time_of_day"], open: true });
    const get = captureEvent(el, "apply-matchers");

    const buttons = el.shadowRoot.querySelectorAll(".actions-bar button");
    const applyBtn = [...buttons].find((b: any) => b.textContent.includes("Apply")) as HTMLButtonElement;
    applyBtn.click();

    expect(get()).toEqual({ matchers: ["time_of_day"] });
  });

  test("cancel emits cancel-matchers", async () => {
    el = await mount({ open: true });
    let cancelled = false;
    el.addEventListener("cancel-matchers", () => { cancelled = true; });

    const buttons = el.shadowRoot.querySelectorAll(".actions-bar button");
    const cancelBtn = [...buttons].find((b: any) => b.textContent.includes("Cancel")) as HTMLButtonElement;
    cancelBtn.click();

    expect(cancelled).toBe(true);
  });

  test("draft is re-seeded when selected prop changes", async () => {
    el = await mount({ selected: [], open: true });
    const get = captureEvent(el, "apply-matchers");

    // Update selected
    el.selected = ["weather"];
    await el.updateComplete;

    const buttons = el.shadowRoot.querySelectorAll(".actions-bar button");
    const applyBtn = [...buttons].find((b: any) => b.textContent.includes("Apply")) as HTMLButtonElement;
    applyBtn.click();

    expect(get().matchers).toContain("weather");
  });

  test("unchecking a previously-checked matcher removes it from draft", async () => {
    el = await mount({ selected: ["time_of_day", "weather"], open: true });
    const get = captureEvent(el, "apply-matchers");

    const rows = el.shadowRoot.querySelectorAll(".matcher-row");
    const weatherCheckbox = rows[1].querySelector("input[type=checkbox]") as HTMLInputElement;
    weatherCheckbox.checked = false;
    weatherCheckbox.dispatchEvent(new Event("change", { bubbles: true }));
    await el.updateComplete;

    const buttons = el.shadowRoot.querySelectorAll(".actions-bar button");
    const applyBtn = [...buttons].find((b: any) => b.textContent.includes("Apply")) as HTMLButtonElement;
    applyBtn.click();

    expect(get().matchers).not.toContain("weather");
  });
});
