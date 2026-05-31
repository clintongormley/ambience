import { describe, test, expect, afterEach, vi, beforeAll } from "vitest";

// jsdom doesn't include DragEvent — polyfill it with a minimal MouseEvent subclass.
beforeAll(() => {
  if (typeof DragEvent === "undefined") {
    // @ts-expect-error -- test-only polyfill
    globalThis.DragEvent = class DragEvent extends MouseEvent {
      constructor(type: string, init?: EventInit & { cancelable?: boolean }) {
        super(type, { bubbles: true, cancelable: true, ...init });
      }
    };
  }
});
import "../frontend/src/views/rules-list";
import { colorHex } from "../frontend/src/group-colors";
import type { ExposedAction, MatcherInfo, Rule, RuleGroup, PeriodStoreView } from "../frontend/src/types";

const matchers: MatcherInfo[] = [
  { name: "mode",       description: "", predicate_help: "", input: "text",    priority: 1000 },
  { name: "day",         description: "", predicate_help: "", input: "day_predicate",     priority: 900 },
  { name: "time_of_day", description: "", predicate_help: "", input: "time_of_day",       priority: 800 },
  { name: "weather",     description: "", predicate_help: "", input: "weather_predicate", priority: 700 },
];

const periods: PeriodStoreView = {
  builtins: {
    morning: {
      from: { kind: "sun", anchor: "sunrise", offset_min: 0 },
      to: { kind: "sun", anchor: "noon", offset_min: 0 },
    },
  },
  custom: {},
  hidden: [],
};

const movieRule: Rule = {
  name: "Movie rule",
  when: { mode: "movie" },
  actions: [{ service: "light.turn_on", entity_ids: ["light.lamp"], params: { brightness: 30 } }],
};

const eveningRule: Rule = {
  name: "Evening",
  when: { time_of_day: { period: "morning" } },
  actions: [],
};

const testHass = {
  localize: (k: string) => {
    if (k === "component.ambience.matcher.mode") return "Mode";
    if (k === "component.ambience.matcher.time_of_day") return "Time of day";
    if (k === "component.ambience.matcher.day") return "Day";
    if (k === "component.ambience.matcher.weather") return "Weather";
    return undefined;
  },
};

async function mount(
  rules: Rule[] = [],
  availableActions: ExposedAction[] = [],
  schemas: Record<string, unknown> = {},
  groups: RuleGroup[] = [],
): Promise<any> {
  const el: any = document.createElement("ambience-rules-list");
  el.rules = rules;
  el.periods = periods;
  el.matchers = matchers;
  el.hass = testHass;
  el.availableActions = availableActions;
  el.schemas = schemas;
  el.groups = groups;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function captureEvent(el: HTMLElement, name: string) {
  let detail: any;
  el.addEventListener(name, (e: Event) => { detail = (e as CustomEvent).detail; });
  return () => detail;
}

describe("ambience-rules-list", () => {
  let el: any;
  afterEach(() => { el?.remove(); });

  test("renders 'No rules yet' when empty", async () => {
    el = await mount([]);
    expect(el.shadowRoot.textContent).toContain("No rules yet");
  });

  test("renders an Add rule button when empty", async () => {
    el = await mount([]);
    const btn = el.shadowRoot.querySelector("button.add") as HTMLButtonElement;
    expect(btn).toBeTruthy();
    expect(btn.textContent).toContain("Add rule");
  });

  test("emits add-rule when Add button clicked (empty state)", async () => {
    el = await mount([]);
    const get = captureEvent(el, "add-rule");
    (el.shadowRoot.querySelector("button.add") as HTMLButtonElement).click();
    expect(get()).toBeDefined();
  });

  test("renders rule list with correct count", async () => {
    el = await mount([movieRule, eveningRule]);
    const items = el.shadowRoot.querySelectorAll("li");
    expect(items.length).toBe(2);
  });

  test("renders rule names in list items", async () => {
    el = await mount([movieRule]);
    expect(el.shadowRoot.textContent).toContain("Movie rule");
  });

  test("emits edit-rule with index when the edit button clicked", async () => {
    el = await mount([movieRule, eveningRule]);
    const get = captureEvent(el, "edit-rule");
    const btns = el.shadowRoot.querySelectorAll("button[title='Edit']");
    (btns[1] as HTMLButtonElement).click();
    expect(get()).toEqual({ index: 1 });
  });

  test("clicking the rule name toggles expansion (does NOT emit edit-rule)", async () => {
    el = await mount([movieRule]);
    const get = captureEvent(el, "edit-rule");
    expect(el.shadowRoot.querySelector(".rule-detail")).toBeFalsy();
    (el.shadowRoot.querySelector(".name") as HTMLElement).click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".rule-detail")).toBeTruthy();
    expect(get()).toBeUndefined();
  });

  test("expanded rule does not show the action count", async () => {
    el = await mount([movieRule]);
    (el.shadowRoot.querySelector(".name") as HTMLElement).click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".action-count")).toBeNull();
  });

  test("clicking the edit button does NOT toggle expansion", async () => {
    el = await mount([movieRule]);
    const btn = el.shadowRoot.querySelector("button[title='Edit']") as HTMLButtonElement;
    btn.click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".rule-detail")).toBeFalsy();
  });

  test("emits duplicate-rule with index when duplicate button clicked", async () => {
    el = await mount([movieRule]);
    const get = captureEvent(el, "duplicate-rule");
    const btn = el.shadowRoot.querySelector("button[title='Duplicate']") as HTMLButtonElement;
    btn.click();
    expect(get()).toEqual({ index: 0 });
  });

  test("emits delete-rule after confirm dialog", async () => {
    el = await mount([movieRule]);
    const get = captureEvent(el, "delete-rule");
    vi.spyOn(window, "confirm").mockReturnValue(true);
    const btn = el.shadowRoot.querySelector("button[title='Delete']") as HTMLButtonElement;
    btn.click();
    expect(get()).toEqual({ index: 0 });
  });

  test("does not emit delete-rule when confirm is cancelled", async () => {
    el = await mount([movieRule]);
    const get = captureEvent(el, "delete-rule");
    vi.spyOn(window, "confirm").mockReturnValue(false);
    const btn = el.shadowRoot.querySelector("button[title='Delete']") as HTMLButtonElement;
    btn.click();
    expect(get()).toBeUndefined();
  });

  test("emits add-rule when Add rule button clicked (non-empty state)", async () => {
    el = await mount([movieRule]);
    const get = captureEvent(el, "add-rule");
    const btn = el.shadowRoot.querySelector("button.add") as HTMLButtonElement;
    btn.click();
    expect(get()).toBeDefined();
  });

  test("unpinned rows show a drag handle", async () => {
    el = await mount([movieRule, eveningRule]);
    expect(el.shadowRoot.querySelectorAll(".handle").length).toBe(2);
  });

  test("pinned row shows a pin in place of the drag handle; clicking it emits unpin-rule", async () => {
    const pinned: Rule = { ...movieRule, pinned: true, priority: 2048 };
    el = await mount([pinned]);
    const pin = el.shadowRoot.querySelector(".pin");
    expect(pin).toBeTruthy();
    // The pin replaces the drag handle on a pinned row.
    expect(el.shadowRoot.querySelector(".handle")).toBeFalsy();
    const getDetail = captureEvent(el, "unpin-rule");
    pin.click();
    expect(getDetail()).toEqual({ index: 0 });
  });

  test("unpinned row shows no pin icon", async () => {
    el = await mount([movieRule]);
    expect(el.shadowRoot.querySelector(".pin")).toBeFalsy();
  });

  test("shadowed row shows a warning badge", async () => {
    const shadowed: Rule = { ...eveningRule, shadowed_by: 0 };
    el = await mount([movieRule, shadowed]);
    expect(el.shadowRoot.querySelector(".shadow-warning")).toBeTruthy();
  });

  test("unshadowed row shows no warning badge", async () => {
    el = await mount([movieRule]);
    expect(el.shadowRoot.querySelector(".shadow-warning")).toBeFalsy();
  });

  test("the manual-sort toggle is gone", async () => {
    el = await mount([movieRule]);
    expect(el.shadowRoot.querySelector(".autosort")).toBeFalsy();
  });

  test("summary shows 'any' for rule with no when predicates", async () => {
    const noPredicateRule: Rule = { name: "Catch all", when: {}, actions: [] };
    el = await mount([noPredicateRule]);
    expect(el.shadowRoot.querySelector(".summary")?.textContent).toContain("any");
  });

  test("summary shows mode predicate value", async () => {
    el = await mount([movieRule]);
    expect(el.shadowRoot.querySelector(".summary")?.textContent).toContain("movie");
  });

  test("summary shows 0 actions for empty actions", async () => {
    const r: Rule = { name: "x", when: {}, actions: [] };
    el = await mount([r]);
    expect(el.shadowRoot.querySelector(".summary")?.textContent).toContain("0 actions");
  });

  test("summary shows period label for time_of_day predicate", async () => {
    el = await mount([eveningRule]);
    const summary = el.shadowRoot.querySelector(".summary")?.textContent ?? "";
    // periodLabel capitalises the first letter: "morning" -> "Morning"
    expect(summary.toLowerCase()).toContain("morning");
  });


  test("confirm dialog uses rule name", async () => {
    el = await mount([movieRule]);
    const spy = vi.spyOn(window, "confirm").mockReturnValue(false);
    const btn = el.shadowRoot.querySelector("button[title='Delete']") as HTMLButtonElement;
    btn.click();
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("Movie rule"));
  });

  test("delete label falls back to 'Rule N' when rule has no name", async () => {
    const unnamed: Rule = { when: {}, actions: [] };
    el = await mount([unnamed]);
    const spy = vi.spyOn(window, "confirm").mockReturnValue(false);
    const btn = el.shadowRoot.querySelector("button[title='Delete']") as HTMLButtonElement;
    btn.click();
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("Rule 1"));
  });

  test("drag start sets _dragFrom index", async () => {
    el = await mount([movieRule, eveningRule]);
    const items = el.shadowRoot.querySelectorAll("li");
    items[0].dispatchEvent(new DragEvent("dragstart", { bubbles: true }));
    await el.updateComplete;
    // _dragFrom should be 0 — verified indirectly by drop emitting reorder
    // (we can't read private state directly, but we can test the side effect)
    expect(el._dragFrom).toBe(0);
  });

  test("drag over a different item allows drop and sets _dragOver", async () => {
    el = await mount([movieRule, eveningRule]);
    const items = el.shadowRoot.querySelectorAll("li");
    items[0].dispatchEvent(new DragEvent("dragstart", { bubbles: true }));

    const dragOverEvent = new DragEvent("dragover", { bubbles: true, cancelable: true });
    items[1].dispatchEvent(dragOverEvent);
    await el.updateComplete;
    expect(el._dragOver).toBe(1);
  });

  test("drag over the same item is a no-op", async () => {
    el = await mount([movieRule, eveningRule]);
    const items = el.shadowRoot.querySelectorAll("li");
    items[0].dispatchEvent(new DragEvent("dragstart", { bubbles: true }));
    items[0].dispatchEvent(new DragEvent("dragover", { bubbles: true }));
    await el.updateComplete;
    expect(el._dragOver).toBeNull();
  });

  test("drop emits reorder-rules and resets drag state", async () => {
    el = await mount([movieRule, eveningRule]);
    const get = captureEvent(el, "reorder-rules");
    const items = el.shadowRoot.querySelectorAll("li");
    items[0].dispatchEvent(new DragEvent("dragstart", { bubbles: true }));
    items[1].dispatchEvent(new DragEvent("dragover", { bubbles: true, cancelable: true }));
    items[1].dispatchEvent(new DragEvent("drop", { bubbles: true }));
    await el.updateComplete;

    expect(get()).toEqual({ from: 0, to: 1 });
    expect(el._dragFrom).toBeNull();
    expect(el._dragOver).toBeNull();
  });

  test("drop on the same index is a no-op", async () => {
    el = await mount([movieRule, eveningRule]);
    const get = captureEvent(el, "reorder-rules");
    const items = el.shadowRoot.querySelectorAll("li");
    items[0].dispatchEvent(new DragEvent("dragstart", { bubbles: true }));
    // Drop on same item (from=0, to=0)
    items[0].dispatchEvent(new DragEvent("drop", { bubbles: true }));
    await el.updateComplete;
    expect(get()).toBeUndefined();
  });

  test("dragend resets drag state", async () => {
    el = await mount([movieRule, eveningRule]);
    const items = el.shadowRoot.querySelectorAll("li");
    items[0].dispatchEvent(new DragEvent("dragstart", { bubbles: true }));
    items[0].dispatchEvent(new DragEvent("dragend", { bubbles: true }));
    await el.updateComplete;
    expect(el._dragFrom).toBeNull();
    expect(el._dragOver).toBeNull();
  });

  test("time range predicate renders arrow format in summary", async () => {
    const rangeRule: Rule = {
      name: "Range",
      when: {
        time_of_day: {
          from: { kind: "time", hh: 9, mm: 0 },
          to: { kind: "time", hh: 17, mm: 30 },
        },
      },
      actions: [],
    };
    el = await mount([rangeRule]);
    const summary = el.shadowRoot.querySelector(".summary")?.textContent ?? "";
    expect(summary).toContain("→");
  });

  test("sun endpoint renders anchor+offset in summary", async () => {
    const sunRule: Rule = {
      name: "Sun",
      when: {
        time_of_day: {
          from: { kind: "sun", anchor: "sunrise", offset_min: 30 },
          to: { kind: "sun", anchor: "sunset", offset_min: 0 },
        },
      },
      actions: [],
    };
    el = await mount([sunRule]);
    const summary = el.shadowRoot.querySelector(".summary")?.textContent ?? "";
    expect(summary).toContain("Sunrise");
  });

  test("rules-list shows 'Rule 1' when rule name is empty, even if mode is set", async () => {
    el = await mount([
      { name: "", when: { mode: "Cozy evening" }, actions: [] },
    ]);
    const name = el.shadowRoot.querySelector(".name")?.textContent?.trim();
    expect(name).toBe("Rule 1");
  });

  test("rules-list shows default Rule N when both name and mode are empty", async () => {
    el = await mount([
      { name: "", when: {}, actions: [] },
    ]);
    const name = el.shadowRoot.querySelector(".name")?.textContent?.trim();
    expect(name).toBe("Rule 1");
  });

  test("rules-list prefers explicit name over mode", async () => {
    el = await mount([
      { name: "My rule", when: { mode: "Cozy evening" }, actions: [] },
    ]);
    const name = el.shadowRoot.querySelector(".name")?.textContent?.trim();
    expect(name).toBe("My rule");
  });

  test("summary uses friendly matcher labels", async () => {
    const rules: Rule[] = [{
      name: "test",
      when: { time_of_day: { period: "afternoon" }, mode: "movie" },
      actions: [{ service: "light.turn_on", entity_ids: ["light.a"], params: { brightness: 80 } }],
    }];
    el = await mount(rules);
    const summary = el.shadowRoot.querySelector(".summary")?.textContent ?? "";
    expect(summary).toContain("Time of day:");
    expect(summary).toContain("Afternoon");
    expect(summary).toContain("Mode:");
    expect(summary).toContain("movie");
  });

  test("matcher labels in the summary are wrapped in <strong>", async () => {
    const rules: Rule[] = [{
      name: "test",
      when: { time_of_day: { period: "afternoon" }, mode: "movie" },
      actions: [],
    }];
    el = await mount(rules);
    const strongs = Array.from(
      el.shadowRoot.querySelectorAll(".summary strong"),
    ).map((s: any) => s.textContent?.trim());
    expect(strongs).toContain("Time of day:");
    expect(strongs).toContain("Mode:");
  });

  test("clicking the summary expands the whole rule", async () => {
    const rules: Rule[] = [{
      name: "r",
      when: { time_of_day: { period: "afternoon" }, mode: "movie" },
      actions: [{ service: "light.turn_on", entity_ids: ["light.a"], params: {} }],
    }];
    el = await mount(rules);
    expect(el.shadowRoot.querySelector(".rule-detail")).toBeFalsy();
    const summary = el.shadowRoot.querySelector(".summary") as HTMLElement;
    summary.click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".rule-detail")).toBeTruthy();
  });

  test("expanded rule renders each matcher on its own line", async () => {
    const rules: Rule[] = [{
      name: "r",
      when: { time_of_day: { period: "afternoon" }, mode: "movie" },
      actions: [],
    }];
    el = await mount(rules);
    (el.shadowRoot.querySelector(".summary") as HTMLElement).click();
    await el.updateComplete;
    const lines = Array.from(
      el.shadowRoot.querySelectorAll(".rule-detail .matcher-line"),
    );
    expect(lines.length).toBe(2);
    const texts = lines.map((n: any) => n.textContent?.trim() ?? "");
    expect(texts.some((t: string) => t.startsWith("Mode:"))).toBe(true);
    expect(texts.some((t: string) => t.startsWith("Time of day:"))).toBe(true);
  });

  test("expanded rule still shows the per-action detail", async () => {
    const rules: Rule[] = [{
      name: "r",
      when: {},
      actions: [{
        service: "light.turn_on",
        entity_ids: ["light.a"],
        params: { brightness: 80 },
      }],
    }];
    const availableActions: ExposedAction[] = [
      { id: "light.turn_on", label: "Set light", visible_fields: ["brightness"], defaults: {} },
    ];
    el = await mount(rules, availableActions);
    (el.shadowRoot.querySelector(".summary") as HTMLElement).click();
    await el.updateComplete;
    const item = el.shadowRoot.querySelector(".actions-detail-item");
    expect(item).toBeTruthy();
    expect(item.textContent).toContain("Set light");
    expect(item.textContent).toContain("Brightness: 80");
  });

  test("action count is rendered as a clickable element", async () => {
    el = await mount([movieRule]);
    const actionCount = el.shadowRoot.querySelector(".action-count");
    expect(actionCount).toBeTruthy();
    expect(actionCount.textContent).toContain("1 action");
  });

  test("clicking action count expands the actions inline", async () => {
    const availableActions: ExposedAction[] = [
      { id: "light.turn_on", label: "Set light", visible_fields: ["brightness"], defaults: {} },
    ];
    el = await mount([movieRule], availableActions);
    expect(el.shadowRoot.querySelector(".actions-detail")).toBeFalsy();
    const actionCount = el.shadowRoot.querySelector(".action-count") as HTMLElement;
    actionCount.click();
    await el.updateComplete;
    const detail = el.shadowRoot.querySelector(".actions-detail");
    expect(detail).toBeTruthy();
    expect(detail.textContent).toContain("Set light");
    expect(detail.textContent).toContain("Brightness: 30");
  });

  test("expanded action header renders array params with brackets and humanized keys", async () => {
    const rule: Rule = {
      name: "test",
      when: {},
      actions: [
        {
          service: "light.turn_on",
          entity_ids: ["light.a"],
          params: { rgb_color: [210, 81, 81], brightness_pct: 31 },
        },
      ],
    };
    const availableActions: ExposedAction[] = [
      {
        id: "light.turn_on",
        label: "Turn on light",
        visible_fields: ["rgb_color", "brightness_pct"],
        defaults: {},
      },
    ];
    el = await mount([rule], availableActions);
    const actionCount = el.shadowRoot.querySelector(".action-count") as HTMLElement;
    actionCount.click();
    await el.updateComplete;
    const detail = el.shadowRoot.querySelector(".actions-detail");
    expect(detail.textContent).toContain("Rgb color: [210,81,81]");
    expect(detail.textContent).toContain("Brightness pct: 31");
  });

  test("expanded action header uses HA's field.name from schemas when present", async () => {
    const rule: Rule = {
      name: "test",
      when: {},
      actions: [
        {
          service: "light.turn_on",
          entity_ids: ["light.a"],
          params: { brightness_pct: 31, rgb_color: [210, 81, 81] },
        },
      ],
    };
    const availableActions: ExposedAction[] = [
      {
        id: "light.turn_on",
        label: "Turn on light",
        visible_fields: ["brightness_pct", "rgb_color"],
        defaults: {},
      },
    ];
    const schemas = {
      "light.turn_on": {
        fields: {
          brightness_pct: { name: "Brightness", selector: {} },
          rgb_color: { name: "RGB Color", selector: {} },
        },
        target: null,
      },
    };
    el = await mount([rule], availableActions, schemas);
    const actionCount = el.shadowRoot.querySelector(".action-count") as HTMLElement;
    actionCount.click();
    await el.updateComplete;
    const detail = el.shadowRoot.querySelector(".actions-detail");
    expect(detail.textContent).toContain("Brightness: 31");
    expect(detail.textContent).toContain("RGB Color: [210,81,81]");
    expect(detail.textContent).not.toContain("Brightness pct");
  });

  test("expanded action lists target entity ids", async () => {
    const rule: Rule = {
      name: "multi",
      when: {},
      actions: [{ service: "light.turn_on", entity_ids: ["light.lamp", "light.kitchen"], params: {} }],
    };
    el = await mount([rule]);
    (el.shadowRoot.querySelector(".action-count") as HTMLElement).click();
    await el.updateComplete;
    const items = el.shadowRoot.querySelectorAll(".entity-list li");
    expect(items.length).toBe(2);
    expect(items[0].textContent).toContain("light.lamp");
    expect(items[1].textContent).toContain("light.kitchen");
  });

  test("expanded action uses friendly_name from hass.states when available", async () => {
    const rule: Rule = {
      name: "named",
      when: {},
      actions: [{ service: "light.turn_on", entity_ids: ["light.lamp", "light.kitchen"], params: {} }],
    };
    const el2: any = document.createElement("ambience-rules-list");
    el2.rules = [rule];
    el2.periods = periods;
    el2.matchers = matchers;
    el2.availableActions = [];
    el2.hass = {
      ...testHass,
      states: {
        "light.lamp": { attributes: { friendly_name: "Bedroom Lamp" } },
        // light.kitchen deliberately omitted — falls back to entity_id
      },
    };
    document.body.appendChild(el2);
    await el2.updateComplete;
    el = el2;
    (el.shadowRoot.querySelector(".action-count") as HTMLElement).click();
    await el.updateComplete;
    const items = el.shadowRoot.querySelectorAll(".entity-list li");
    expect(items[0].textContent).toContain("Bedroom Lamp");
    expect(items[0].textContent).not.toContain("light.lamp");
    expect(items[1].textContent).toContain("light.kitchen");
  });

  test("clicking the summary again collapses the rule", async () => {
    el = await mount([movieRule]);
    (el.shadowRoot.querySelector(".summary") as HTMLElement).click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".rule-detail")).toBeTruthy();
    // Re-query after re-render before the second click.
    (el.shadowRoot.querySelector(".summary") as HTMLElement).click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".rule-detail")).toBeFalsy();
  });

  test("clicking action count does not emit edit-rule", async () => {
    el = await mount([movieRule]);
    const get = captureEvent(el, "edit-rule");
    const actionCount = el.shadowRoot.querySelector(".action-count") as HTMLElement;
    actionCount.click();
    await el.updateComplete;
    expect(get()).toBeUndefined();
  });

  test("expanding actions for one rule does not expand actions for others", async () => {
    el = await mount([movieRule, eveningRule]);
    const counts = el.shadowRoot.querySelectorAll(".action-count");
    (counts[0] as HTMLElement).click();
    await el.updateComplete;
    const details = el.shadowRoot.querySelectorAll(".actions-detail");
    expect(details.length).toBe(1);
    // The expanded one should be inside the first rule's li
    const firstLi = el.shadowRoot.querySelectorAll("li")[0];
    expect(firstLi.querySelector(".actions-detail")).toBeTruthy();
  });

  test("expanded action with 0 entity_ids renders '(no targets)'", async () => {
    const rule: Rule = {
      name: "no targets",
      when: {},
      actions: [{ service: "light.turn_on", entity_ids: [], params: {} }],
    };
    el = await mount([rule]);
    (el.shadowRoot.querySelector(".action-count") as HTMLElement).click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".actions-detail")?.textContent).toContain("(no targets)");
    expect(el.shadowRoot.querySelector(".entity-list")).toBeFalsy();
  });

  test("summary lists matchers in priority order (mode, day, time_of_day, weather)", async () => {
    const rules: Rule[] = [{
      name: "test",
      // Deliberately interleave the `when` keys to confirm the summary does
      // NOT follow insertion order. Higher priority number = more important = shown first.
      when: {
        weather: { groups: [], thresholds: [{ attribute: "temperature", op: "<", value: 5 }] },
        time_of_day: { period: "afternoon" },
        mode: "movie",
        day: [{ kind: "weekday", days: [0] }],
      },
      actions: [],
    }];
    el = await mount(rules);
    await el.updateComplete;
    const summary = el.shadowRoot.querySelector(".summary")?.textContent ?? "";
    const iMode = summary.indexOf("Mode:");
    const iDay = summary.indexOf("Day:");
    const iTod = summary.indexOf("Time of day:");
    const iWeather = summary.indexOf("Weather:");
    // Most-important matcher (mode=1000) must appear first; least-important (weather=700) last.
    expect(iMode).toBeGreaterThanOrEqual(0);
    expect(iDay).toBeGreaterThan(iMode);
    expect(iTod).toBeGreaterThan(iDay);
    expect(iWeather).toBeGreaterThan(iTod);
  });

  // --- group sections ------------------------------------------------------

  test("All view groups rules by group, sorted by group name, numbered per group", async () => {
    const groups = [{ id: "b", name: "Blinds" }, { id: "a", name: "Awnings" }];
    const rules = [
      { when: {}, actions: [], group: "b" },   // Blinds 1
      { when: {}, actions: [], group: "a" },   // Awnings 1
      { when: {}, actions: [], group: "b" },   // Blinds 2
    ];
    el = await mount(rules, [], {}, groups);   // filterGroup defaults to "" (All)
    const headers = Array.from(el.shadowRoot.querySelectorAll(".group-section-header"))
      .map((h: any) => h.textContent!.trim());
    // alphabetical by NAME: Awnings before Blinds
    expect(headers.some((h: string) => h.includes("Awnings"))).toBe(true);
    expect(headers.findIndex((h: string) => h.includes("Awnings"))).toBeLessThan(
      headers.findIndex((h: string) => h.includes("Blinds")),
    );
    // Within the Blinds section the rows are numbered 1, 2.
    const blindsSection = Array.from(el.shadowRoot.querySelectorAll(".group-section"))
      .find((s: any) => s.querySelector(".group-section-header")!.textContent!.includes("Blinds"))! as Element;
    const nums = Array.from(blindsSection.querySelectorAll(".idx")).map((n: any) => n.textContent!.trim());
    expect(nums).toEqual(["1", "2"]);
  });

  test("single-group filter shows only that group, with its header, numbered 1..N", async () => {
    const groups = [{ id: "a", name: "A" }, { id: "b", name: "B" }];
    const rules = [
      { when: {}, actions: [], group: "a" },
      { when: {}, actions: [], group: "b" },
    ];
    el = await mount(rules, [], {}, groups);
    el.filterGroup = "a";
    await el.updateComplete;
    // The single visible section still shows its group header bar.
    const headers = Array.from(el.shadowRoot.querySelectorAll(".group-section-header"));
    expect(headers.length).toBe(1);
    expect(headers[0].textContent).toContain("A");
    expect(el.shadowRoot.querySelectorAll("li").length).toBe(1);
  });

  test("filtering to a group with no rules in this scope shows no header bar", async () => {
    const groups = [{ id: "a", name: "A" }, { id: "b", name: "B" }];
    const rules = [{ when: {}, actions: [], group: "a" }];
    el = await mount(rules, [], {}, groups);
    el.filterGroup = "b"; // scope has no group-b rules
    await el.updateComplete;
    expect(el.shadowRoot.querySelectorAll(".group-section-header").length).toBe(0);
    expect(el.shadowRoot.querySelectorAll("li").length).toBe(0);
  });

  test("editing a row in a section emits the rule's ORIGINAL index", async () => {
    const groups = [{ id: "a", name: "A" }, { id: "b", name: "B" }];
    const rules = [
      { when: {}, actions: [], group: "b" },   // original index 0
      { when: {}, actions: [], group: "a" },   // original index 1
    ];
    el = await mount(rules, [], {}, groups);
    const events: number[] = [];
    el.addEventListener("edit-rule", (e: any) => events.push(e.detail.index));
    const aSection = Array.from(el.shadowRoot.querySelectorAll(".group-section"))
      .find((s: any) => s.querySelector(".group-section-header")!.textContent!.includes("A"))! as Element;
    (aSection.querySelector("button[title='Edit']") as HTMLButtonElement).click();
    expect(events).toEqual([1]);
  });

  test("rules no longer render a per-row group lozenge", async () => {
    const rule: Rule = { name: "R", group: "g1", when: {}, actions: [] };
    el = await mount([rule], [], {}, [{ id: "g1", name: "Lights", color: "green", icon: "mdi:lightbulb" }]);
    expect(el.shadowRoot.querySelector("ambience-group-chip")).toBeNull();
    const nameEl = el.shadowRoot.querySelector(".name") as HTMLElement;
    expect(nameEl.querySelector("ambience-group-chip")).toBeNull();
    expect(nameEl.textContent!.trim()).toBe("R");
  });

  test("the group section header is a full-width coloured bar with the group's colour, icon and name", async () => {
    const group: RuleGroup = { id: "g1", name: "Lights", color: "green", icon: "mdi:lightbulb" };
    el = await mount([{ name: "R", group: "g1", when: {}, actions: [] }], [], {}, [group]);
    const header = el.shadowRoot.querySelector(".group-section-header") as HTMLElement;
    expect(header).toBeTruthy();
    // Group colour applied inline as the bar background.
    expect(header.getAttribute("style") || "").toContain(colorHex("green")!);
    // Icon + name rendered inside the bar.
    expect(header.querySelector('ha-icon[icon="mdi:lightbulb"]')).toBeTruthy();
    expect(header.textContent).toContain("Lights");
  });

  test("a colourless group renders a header with no inline background (neutral fallback)", async () => {
    const group: RuleGroup = { id: "g1", name: "Plain" };
    el = await mount([{ name: "R", group: "g1", when: {}, actions: [] }], [], {}, [group]);
    const header = el.shadowRoot.querySelector(".group-section-header") as HTMLElement;
    expect(header.getAttribute("style") || "").toBe("");
    expect(header.textContent).toContain("Plain");
  });
});
