import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("../frontend/src/api.js", () => ({
  getWeatherConfig: vi.fn(async () => ({
    entity: null,
    groups: [
      { id: "sunny", label: "Sunny", conditions: ["sunny"] },
      { id: "wet", label: "Wet", conditions: ["rainy"] },
    ],
  })),
  saveWeatherConfig: vi.fn(async () => ({ ok: true, warnings: [] })),
}));

import "../frontend/src/views/weather-config";
import { saveWeatherConfig } from "../frontend/src/api.js";

describe("ambience-weather-config", () => {
  let el: any;
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => el?.remove());

  async function mount() {
    el = document.createElement("ambience-weather-config");
    el.hass = {};
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    return el;
  }

  test("renders the weather entity row and group rows", async () => {
    el = await mount();
    expect(el.shadowRoot.textContent).toContain("Weather entity");
    expect(el.shadowRoot.textContent).toContain("Groups");
    expect(el.shadowRoot.textContent).toContain("Sunny");
    expect(el.shadowRoot.textContent).toContain("Wet");
  });

  test("changing the entity calls saveWeatherConfig with current groups", async () => {
    el = await mount();
    el._onEntityChange({ detail: { value: "weather.home" } });
    expect(saveWeatherConfig).toHaveBeenCalledWith(
      expect.anything(),
      "weather.home",
      el._config.groups,
    );
  });

  test("a successful save fires ambience-conditions-changed so views refetch", async () => {
    el = await mount();
    const seen = vi.fn();
    window.addEventListener("ambience-conditions-changed", seen);
    el._onEntityChange({ detail: { value: "weather.home" } });
    await new Promise((r) => setTimeout(r, 0));
    expect(seen).toHaveBeenCalledTimes(1);
    window.removeEventListener("ambience-conditions-changed", seen);
  });

  test("_addGroup appends a new group with a unique id", async () => {
    el = await mount();
    el._addGroup();
    const ids = el._config.groups.map((g: any) => g.id);
    expect(ids).toContain("group_1");
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("_nextGroupId picks the smallest free index", () => {
    const fn = (existing: any[]) => {
      const el2: any = document.createElement("ambience-weather-config");
      try {
        return el2._nextGroupId(existing);
      } finally {
        el2.remove?.();
      }
    };
    expect(fn([])).toBe("group_1");
    expect(fn([{ id: "group_1" }])).toBe("group_2");
    expect(fn([{ id: "group_2" }])).toBe("group_1");
    expect(fn([{ id: "wet" }])).toBe("group_1");
  });

  test("_updateGroup applies a label patch", async () => {
    el = await mount();
    el._updateGroup(0, { label: "Sun ☀" });
    expect(el._config.groups[0].label).toBe("Sun ☀");
  });

  test("_updateGroup toggles a condition on a group", async () => {
    el = await mount();
    const next = [...el._config.groups[0].conditions, "cloudy"];
    el._updateGroup(0, { conditions: next });
    expect(el._config.groups[0].conditions).toEqual(["sunny", "cloudy"]);
  });

  test("_removeGroup deletes a row and saves", async () => {
    el = await mount();
    el._removeGroup(1);
    expect(el._config.groups.map((g: any) => g.id)).toEqual(["sunny"]);
    expect(saveWeatherConfig).toHaveBeenCalled();
  });

  test("_conditionsSchema is a select(dropdown) multi-select listing all 15 HA conditions", async () => {
    el = await mount();
    const schema = el._conditionsSchema();
    expect(schema).toHaveLength(1);
    expect(schema[0].name).toBe("conditions");
    const sel = schema[0].selector.select;
    expect(sel.multiple).toBe(true);
    expect(sel.mode).toBe("dropdown");
    expect(sel.options).toHaveLength(15);
    // Each option has a value + a (resolved-via-i18n) label.
    expect(sel.options[0]).toEqual({ value: expect.any(String), label: expect.any(String) });
  });

  test("native fallback lists only the selected condition labels per group", async () => {
    el = await mount();
    // The "wet" group has conditions: ["rainy"] → only "Rainy" should appear in
    // its body; the other 14 HA condition labels must NOT appear (no checkbox grid).
    const txt = el.shadowRoot.textContent ?? "";
    expect(txt).toContain("Rainy"); // selected condition rendered
    expect(txt).not.toContain("Lightning"); // unselected condition not rendered
    expect(txt).not.toContain("Hail"); // unselected condition not rendered
  });

  test("groups are collapsed by default (no edit body rendered)", async () => {
    el = await mount();
    expect(el.shadowRoot.querySelector(".group .body")).toBeNull();
  });

  test("clicking a group header expands it", async () => {
    el = await mount();
    const header = el.shadowRoot.querySelector(".group .group-header") as HTMLElement;
    header.click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".group .body")).toBeTruthy();
    // Click again to collapse
    header.click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".group .body")).toBeNull();
  });

  test("clicking the delete button does not toggle expand", async () => {
    el = await mount();
    // Trigger removal via the click handler; the bubbling click must not expand.
    const btn = el.shadowRoot.querySelector(
      ".group .group-header button.icon",
    ) as HTMLButtonElement;
    btn.click();
    await el.updateComplete;
    // The deletion handler ran, AND no group is left expanded.
    expect(el._config.groups.length).toBe(1);
    expect(el.shadowRoot.querySelector(".group .body")).toBeNull();
  });

  test("_addGroup auto-expands the new row", async () => {
    el = await mount();
    el._addGroup();
    await el.updateComplete;
    // Exactly one expanded row — the newly added one (last in the list).
    const bodies = el.shadowRoot.querySelectorAll(".group .body");
    expect(bodies.length).toBe(1);
    const groups = el.shadowRoot.querySelectorAll(".group");
    expect(groups[groups.length - 1].querySelector(".body")).toBeTruthy();
  });

  test("collapsed header shows label and condition labels", async () => {
    el = await mount();
    const headers = el.shadowRoot.querySelectorAll(".group .group-header");
    const wetHeader = headers[1] as HTMLElement;
    const text = wetHeader.textContent ?? "";
    expect(text).toContain("Wet"); // group label
    expect(text).toContain("Rainy"); // selected condition label
  });

  test("renders dangling warnings with scope labels for area, floor and house", async () => {
    vi.mocked(saveWeatherConfig).mockResolvedValueOnce({
      ok: true,
      warnings: [
        {
          scope_kind: "area",
          scope_id: "lounge",
          scene_name: "Area scene",
          reason: "missing entity",
        },
        {
          scope_kind: "floor",
          scope_id: "ground",
          scene_name: "Floor scene",
          reason: "missing entity",
        },
        {
          scope_kind: "house",
          scope_id: null,
          scene_name: "House scene",
          reason: "missing entity",
        },
      ],
    });
    el = await mount();
    el._onEntityChange({ detail: { value: "weather.home" } });
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    const txt = el.shadowRoot.querySelector(".warnings").textContent;
    expect(txt).toContain("lounge"); // area scope renders the id
    expect(txt).toContain("Floor: ground"); // floor scope renders with prefix
    expect(txt).toContain("House"); // house scope renders the literal label
    expect(txt).not.toContain("undefined");
  });
});
