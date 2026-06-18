import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("../frontend/src/api", () => ({
  listAutoTriggers: vi.fn(),
}));

import "../frontend/src/views/auto-triggers-modal";
import * as api from "../frontend/src/api";
import type { AutoTrigger } from "../frontend/src/types";

const sampleTriggers: AutoTrigger[] = [
  { key: "entity:binary_sensor.motion", kind: "entity", entity_id: "binary_sensor.motion" },
  {
    key: "group:time",
    kind: "time",
    clocks: [
      { hour: 7, minute: 0 },
      { hour: 22, minute: 0 },
    ],
    has_time: false,
    date_rollover: true,
  },
  {
    key: "group:sun",
    kind: "sun",
    suns: [
      { anchor: "dawn", offset: 0 },
      { anchor: "sunset", offset: 30 },
    ],
  },
];

async function mount(opts: {
  triggers?: AutoTrigger[];
  opaque?: boolean;
  hass?: any;
  open?: boolean;
  category?: string;
  categoryName?: string;
}): Promise<any> {
  (api.listAutoTriggers as any).mockResolvedValue({
    triggers: opts.triggers ?? sampleTriggers,
    opaque: opts.opaque ?? false,
  });
  const el: any = document.createElement("ambience-auto-triggers-modal");
  el.hass = opts.hass ?? { states: {} };
  el.scope = { kind: "area", id: "lr" };
  el.scenes = [];
  if (opts.category !== undefined) el.category = opts.category;
  if (opts.categoryName !== undefined) el.categoryName = opts.categoryName;
  document.body.appendChild(el);
  await el.updateComplete;
  if (opts.open) {
    el.open = true;
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
  }
  return el;
}

describe("ambience-auto-triggers-modal", () => {
  let el: any;
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => el?.remove());

  test("renders nothing when closed", async () => {
    el = await mount({});
    expect(el.shadowRoot.querySelector(".modal")).toBeNull();
  });

  test("opening fetches listAutoTriggers for the scope", async () => {
    el = await mount({ open: true });
    expect(api.listAutoTriggers).toHaveBeenCalledWith(el.hass, "area", "lr", undefined);
  });

  test("renders triggers as a read-only icon list with NO checkboxes", async () => {
    el = await mount({ open: true });
    const text = el.shadowRoot.textContent;
    expect(text).toContain("Time");
    expect(text).toContain("Sun");
    expect(text).toContain("07:00");
    // Each row has a leading icon (3 sample triggers).
    expect(el.shadowRoot.querySelectorAll("li ha-icon.row-icon").length).toBe(3);
    expect(el.shadowRoot.querySelectorAll("input[type=checkbox]").length).toBe(0);
  });

  test("entity rows show the entity id and a domain-derived icon", async () => {
    el = await mount({
      open: true,
      triggers: [{ key: "entity:light.kitchen", kind: "entity", entity_id: "light.kitchen" }],
    });
    const row = el.shadowRoot.querySelector("li[data-test='trigger-ro-entity:light.kitchen']");
    expect(row.textContent).toContain("light.kitchen");
    expect(row.querySelector("ha-icon.row-icon")?.getAttribute("icon")).toBe("mdi:lightbulb");
  });

  test("entity row prefers the entity's custom icon attribute", async () => {
    el = await mount({
      open: true,
      hass: { states: { "light.kitchen": { attributes: { icon: "mdi:custom" } } } },
      triggers: [{ key: "entity:light.kitchen", kind: "entity", entity_id: "light.kitchen" }],
    });
    const icon = el.shadowRoot.querySelector("li ha-icon.row-icon");
    expect(icon?.getAttribute("icon")).toBe("mdi:custom");
  });

  test("group rows render a representative icon", async () => {
    el = await mount({ open: true });
    const sun = el.shadowRoot.querySelector(
      "li[data-test='trigger-ro-group:sun'] ha-icon.row-icon",
    );
    expect(sun?.getAttribute("icon")).toBe("mdi:weather-sunny");
    const time = el.shadowRoot.querySelector(
      "li[data-test='trigger-ro-group:time'] ha-icon.row-icon",
    );
    expect(time?.getAttribute("icon")).toBe("mdi:clock-outline");
  });

  test("shows the opaque note when opaque is true", async () => {
    el = await mount({ open: true, opaque: true });
    expect(el.shadowRoot.textContent.toLowerCase()).toContain("script");
  });

  test("shows empty state when there are no triggers", async () => {
    el = await mount({ open: true, triggers: [] });
    expect(el.shadowRoot.textContent.toLowerCase()).toContain("no automatic triggers");
  });

  test("clicking an entity row fires hass-more-info for that entity", async () => {
    el = await mount({
      open: true,
      triggers: [{ key: "entity:light.kitchen", kind: "entity", entity_id: "light.kitchen" }],
    });
    let detail: any;
    el.addEventListener("hass-more-info", (e: any) => (detail = e.detail));
    el.shadowRoot.querySelector("li[data-test='trigger-ro-entity:light.kitchen']").click();
    expect(detail).toEqual({ entityId: "light.kitchen" });
  });

  test("Time/Re-apply rows are not clickable and fire no more-info", async () => {
    el = await mount({ open: true });
    let fired = false;
    el.addEventListener("hass-more-info", () => (fired = true));
    const timeRow = el.shadowRoot.querySelector("li[data-test='trigger-ro-group:time']");
    timeRow.click();
    expect(fired).toBe(false);
    expect(timeRow.getAttribute("role")).toBeNull();
  });

  test("the Sun row opens more-info for sun.sun when that entity exists", async () => {
    el = await mount({
      open: true,
      hass: {
        states: { "sun.sun": { entity_id: "sun.sun", state: "above_horizon", attributes: {} } },
      },
      triggers: [{ key: "group:sun", kind: "sun", suns: [{ anchor: "sunset", offset: 0 }] }],
    });
    let detail: any;
    el.addEventListener("hass-more-info", (e: any) => (detail = e.detail));
    el.shadowRoot.querySelector("li[data-test='trigger-ro-group:sun']").click();
    expect(detail).toEqual({ entityId: "sun.sun" });
  });

  test("the Sun row is not clickable when sun.sun is absent", async () => {
    el = await mount({
      open: true,
      hass: { states: {} },
      triggers: [{ key: "group:sun", kind: "sun", suns: [{ anchor: "sunset", offset: 0 }] }],
    });
    let fired = false;
    el.addEventListener("hass-more-info", () => (fired = true));
    el.shadowRoot.querySelector("li[data-test='trigger-ro-group:sun']").click();
    expect(fired).toBe(false);
  });

  test("close button dispatches a close event", async () => {
    el = await mount({ open: true });
    let fired = false;
    el.addEventListener("close", () => (fired = true));
    el.shadowRoot.querySelector(".close").click();
    expect(fired).toBe(true);
  });

  test("opening fetches with the category", async () => {
    el = await mount({ open: true, category: "lighting" });
    expect(api.listAutoTriggers).toHaveBeenCalledWith(el.hass, "area", "lr", "lighting");
  });

  test("shows the category name in the heading", async () => {
    el = await mount({ open: true, category: "lighting", categoryName: "Lighting" });
    expect(el.shadowRoot.querySelector(".header h3")?.textContent).toContain("Lighting");
  });

  test("reopening for a different scope does not flash the previous scope's rows", async () => {
    el = await mount({ open: true });
    expect(el.shadowRoot.textContent).toContain("binary_sensor.motion");

    // Close, switch scope, and re-open with a fetch that never resolves —
    // the stale rows from scope A must already be gone.
    el.open = false;
    await el.updateComplete;
    (api.listAutoTriggers as any).mockImplementation(() => new Promise(() => {}));
    el.scope = { kind: "area", id: "kitchen" };
    el.open = true;
    await el.updateComplete;
    expect(el.shadowRoot.textContent).not.toContain("binary_sensor.motion");
  });
});
