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
  {
    key: "group:time",
    kind: "time",
    clocks: [
      { hour: 7, minute: 0 },
      { hour: 22, minute: 0 },
    ],
    has_time: false,
    date_rollover: true,
    enabled: true,
  },
  {
    key: "group:sun",
    kind: "sun",
    suns: [
      { anchor: "dawn", offset: 0 },
      { anchor: "sunset", offset: 30 },
    ],
    enabled: false,
  },
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

  test("fetches and lists grouped triggers when expanded", async () => {
    el = await mount({});
    el.shadowRoot.querySelector('[data-test="auto-triggers-header"]').click();
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    expect(api.listAutoTriggers).toHaveBeenCalledWith(el.hass, "area", "lr");
    const text = el.shadowRoot.textContent;
    // Time group lists both clock times + the folded-in date rollover on one row.
    const timeLabel = el.shadowRoot
      .querySelector('[data-test="trigger-cb-group:time"]')
      .closest("li")
      .textContent.toLowerCase();
    expect(timeLabel).toContain("time:");
    expect(timeLabel).toContain("07:00");
    expect(timeLabel).toContain("22:00");
    expect(timeLabel).toContain("date rollover");
    // Sun group lists sun events only.
    expect(text).toContain("Sun:");
    expect(text).toContain("Dawn");
    expect(text).toContain("Sunset +30 min");
    // Only one checkbox per group (not per item).
    expect(el.shadowRoot.querySelectorAll('[data-test^="trigger-cb-"]').length).toBe(3);
  });

  test("entity rows are sorted alphabetically by display name", async () => {
    el = await mount({
      triggers: [
        { key: "entity:z.zebra", kind: "entity", entity_id: "z.zebra", enabled: true },
        { key: "entity:a.apple", kind: "entity", entity_id: "a.apple", enabled: true },
        { key: "group:time", kind: "time", clocks: [{ hour: 7, minute: 0 }], has_time: false, date_rollover: false, enabled: true },
      ] as AutoTrigger[],
      hass: {
        states: {
          "z.zebra": { attributes: { friendly_name: "Aardvark" } },
          "a.apple": { attributes: { friendly_name: "Banana" } },
        },
      },
    });
    el.shadowRoot.querySelector('[data-test="auto-triggers-header"]').click();
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    const labels = [...el.shadowRoot.querySelectorAll("li .label")].map((n: any) =>
      n.textContent.trim(),
    );
    // "Aardvark" (friendly name of z.zebra) sorts before "Banana"; group last.
    expect(labels[0]).toContain("Aardvark");
    expect(labels[1]).toContain("Banana");
    expect(labels[2]).toContain("Time:");
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
    const sun = el.shadowRoot.querySelector('[data-test="trigger-cb-group:sun"]');
    expect(sun.checked).toBe(false);
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

  test("reapply row renders read-only with interval and no checkbox", async () => {
    el = await mount({
      triggers: [
        ...sampleTriggers,
        {
          key: "reapply:300",
          kind: "reapply",
          interval_seconds: 300,
          enabled: true,
        } as AutoTrigger,
      ],
    });
    el.shadowRoot.querySelector('[data-test="auto-triggers-header"]').click();
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    // Read-only marker element exists
    const roEl = el.shadowRoot.querySelector('[data-test="trigger-ro-reapply:300"]');
    expect(roEl).not.toBeNull();

    // Interval text is present (5 min = 300 sec)
    expect(roEl.textContent).toContain("5 min");

    // No checkbox for the reapply row
    expect(
      el.shadowRoot.querySelector('[data-test="trigger-cb-reapply:300"]'),
    ).toBeNull();
  });

  test("reapply row with sub-minute interval renders seconds", async () => {
    el = await mount({
      triggers: [
        {
          key: "reapply:30",
          kind: "reapply",
          interval_seconds: 30,
          enabled: true,
        } as AutoTrigger,
      ],
    });
    el.shadowRoot.querySelector('[data-test="auto-triggers-header"]').click();
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    const roEl = el.shadowRoot.querySelector('[data-test="trigger-ro-reapply:30"]');
    expect(roEl).not.toBeNull();
    expect(roEl.textContent).toContain("30 sec");
  });

  test("reapply row with mixed interval renders min + sec", async () => {
    el = await mount({
      triggers: [
        {
          key: "reapply:90",
          kind: "reapply",
          interval_seconds: 90,
          enabled: true,
        } as AutoTrigger,
      ],
    });
    el.shadowRoot.querySelector('[data-test="auto-triggers-header"]').click();
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    const roEl = el.shadowRoot.querySelector('[data-test="trigger-ro-reapply:90"]');
    expect(roEl).not.toBeNull();
    expect(roEl.textContent).toContain("1 min 30 sec");
  });
});
