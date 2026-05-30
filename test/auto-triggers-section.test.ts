import { describe, test, expect, afterEach, vi, beforeEach } from "vitest";

vi.mock("../frontend/src/api", () => ({
  listAutoTriggers: vi.fn(),
  setAutoTrigger: vi.fn(async () => ({ ok: true })),
}));

import "../frontend/src/views/auto-triggers-section";
import * as api from "../frontend/src/api";
import type { AutoTrigger } from "../frontend/src/types";

const sampleTriggers: AutoTrigger[] = [
  {
    key: "entity:binary_sensor.motion",
    kind: "entity",
    entity_id: "binary_sensor.motion",
    enabled: true,
  },
  { key: "clock:18:00", kind: "clock", hour: 18, minute: 0, enabled: true },
  { key: "sun:sunset:30", kind: "sun", anchor: "sunset", offset: 30, enabled: false },
  { key: "date_rollover", kind: "date_rollover", enabled: true },
  { key: "has_time", kind: "has_time", enabled: true },
];

async function mount(opts: {
  triggers?: AutoTrigger[];
  opaque?: boolean;
  hass?: any;
}): Promise<any> {
  (api.listAutoTriggers as any).mockResolvedValue({
    triggers: opts.triggers ?? sampleTriggers,
    opaque: opts.opaque ?? false,
  });
  const el: any = document.createElement("ambience-auto-triggers-section");
  el.hass = opts.hass ?? { states: {} };
  el.scope = { kind: "area", id: "lr" };
  el.rules = [];
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe("ambience-auto-triggers-section", () => {
  let el: any;
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => el?.remove());

  test("does not fetch while collapsed", async () => {
    el = await mount({});
    expect(api.listAutoTriggers).not.toHaveBeenCalled();
  });

  test("fetches and lists triggers when expanded", async () => {
    el = await mount({});
    el.shadowRoot.querySelector('[data-test="auto-triggers-header"]').click();
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(api.listAutoTriggers).toHaveBeenCalledWith(el.hass, "area", "lr");
    const text = el.shadowRoot.textContent;
    expect(text).toContain("18:00");
    expect(text).toContain("Sunset");
  });

  test("entity row uses friendly name when available", async () => {
    el = await mount({
      hass: { states: { "binary_sensor.motion": { attributes: { friendly_name: "Hall motion" } } } },
    });
    el.shadowRoot.querySelector('[data-test="auto-triggers-header"]').click();
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(el.shadowRoot.textContent).toContain("Hall motion");
  });

  test("checkbox reflects enabled and toggling calls setAutoTrigger", async () => {
    el = await mount({});
    el.shadowRoot.querySelector('[data-test="auto-triggers-header"]').click();
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    const motion = el.shadowRoot.querySelector(
      '[data-test="trigger-cb-entity:binary_sensor.motion"]',
    );
    expect(motion.checked).toBe(true);
    const sunset = el.shadowRoot.querySelector('[data-test="trigger-cb-sun:sunset:30"]');
    expect(sunset.checked).toBe(false);
    // toggle motion off
    motion.checked = false;
    motion.dispatchEvent(new Event("change"));
    await el.updateComplete;
    expect(api.setAutoTrigger).toHaveBeenCalledWith(
      el.hass,
      "area",
      "lr",
      "entity:binary_sensor.motion",
      false,
    );
  });

  test("empty trigger list shows a placeholder", async () => {
    el = await mount({ triggers: [] });
    el.shadowRoot.querySelector('[data-test="auto-triggers-header"]').click();
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(el.shadowRoot.textContent.toLowerCase()).toContain("no automatic triggers");
  });

  test("opaque scope shows a warning note", async () => {
    el = await mount({ opaque: true });
    el.shadowRoot.querySelector('[data-test="auto-triggers-header"]').click();
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(el.shadowRoot.textContent.toLowerCase()).toContain("script");
  });
});
