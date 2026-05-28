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
import type { ExposedAction, MatcherInfo, Rule, PeriodStoreView } from "../frontend/src/types";

const matchers: MatcherInfo[] = [
  { name: "scene",       description: "", predicate_help: "", input: "scene_combobox",    priority: 0 },
  { name: "day",         description: "", predicate_help: "", input: "day_predicate",     priority: 100 },
  { name: "time_of_day", description: "", predicate_help: "", input: "time_of_day",       priority: 200 },
  { name: "weather",     description: "", predicate_help: "", input: "weather_predicate", priority: 300 },
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
  when: { scene: "movie" },
  actions: [{ service: "light.turn_on", entity_ids: ["light.lamp"], params: { brightness: 30 } }],
};

const eveningRule: Rule = {
  name: "Evening",
  when: { time_of_day: { period: "morning" } },
  actions: [],
};

const testHass = {
  localize: (k: string) => {
    if (k === "component.ambience.matcher.scene") return "Scene";
    if (k === "component.ambience.matcher.time_of_day") return "Time of day";
    if (k === "component.ambience.matcher.day") return "Day";
    if (k === "component.ambience.matcher.weather") return "Weather";
    return undefined;
  },
};

async function mount(
  rules: Rule[] = [],
  autoSort = true,
  availableActions: ExposedAction[] = [],
): Promise<any> {
  const el: any = document.createElement("ambience-rules-list");
  el.rules = rules;
  el.autoSort = autoSort;
  el.periods = periods;
  el.matchers = matchers;
  el.hass = testHass;
  el.availableActions = availableActions;
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

  test("emits edit-rule with index when rule name clicked", async () => {
    el = await mount([movieRule, eveningRule]);
    const get = captureEvent(el, "edit-rule");
    const names = el.shadowRoot.querySelectorAll(".name");
    (names[1] as HTMLElement).click();
    expect(get()).toEqual({ index: 1 });
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

  test("shows drag handle when autoSort is false", async () => {
    el = await mount([movieRule], false);
    expect(el.shadowRoot.querySelector(".handle")).toBeTruthy();
  });

  test("no drag handle when autoSort is true", async () => {
    el = await mount([movieRule], true);
    expect(el.shadowRoot.querySelector(".handle")).toBeFalsy();
  });

  test("summary shows 'any' for rule with no when predicates", async () => {
    const noPredicateRule: Rule = { name: "Catch all", when: {}, actions: [] };
    el = await mount([noPredicateRule]);
    expect(el.shadowRoot.querySelector(".summary")?.textContent).toContain("any");
  });

  test("summary shows scene predicate value", async () => {
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
    el = await mount([movieRule, eveningRule], false);
    const items = el.shadowRoot.querySelectorAll("li");
    items[0].dispatchEvent(new DragEvent("dragstart", { bubbles: true }));
    await el.updateComplete;
    // _dragFrom should be 0 — verified indirectly by drop emitting reorder
    // (we can't read private state directly, but we can test the side effect)
    expect(el._dragFrom).toBe(0);
  });

  test("drag over a different item allows drop and sets _dragOver", async () => {
    el = await mount([movieRule, eveningRule], false);
    const items = el.shadowRoot.querySelectorAll("li");
    items[0].dispatchEvent(new DragEvent("dragstart", { bubbles: true }));

    const dragOverEvent = new DragEvent("dragover", { bubbles: true, cancelable: true });
    items[1].dispatchEvent(dragOverEvent);
    await el.updateComplete;
    expect(el._dragOver).toBe(1);
  });

  test("drag over the same item is a no-op", async () => {
    el = await mount([movieRule, eveningRule], false);
    const items = el.shadowRoot.querySelectorAll("li");
    items[0].dispatchEvent(new DragEvent("dragstart", { bubbles: true }));
    items[0].dispatchEvent(new DragEvent("dragover", { bubbles: true }));
    await el.updateComplete;
    expect(el._dragOver).toBeNull();
  });

  test("drop emits reorder-rules and resets drag state", async () => {
    el = await mount([movieRule, eveningRule], false);
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
    el = await mount([movieRule, eveningRule], false);
    const get = captureEvent(el, "reorder-rules");
    const items = el.shadowRoot.querySelectorAll("li");
    items[0].dispatchEvent(new DragEvent("dragstart", { bubbles: true }));
    // Drop on same item (from=0, to=0)
    items[0].dispatchEvent(new DragEvent("drop", { bubbles: true }));
    await el.updateComplete;
    expect(get()).toBeUndefined();
  });

  test("dragend resets drag state", async () => {
    el = await mount([movieRule, eveningRule], false);
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

  test("rules-list shows 'Rule 1' when rule name is empty, even if scene is set", async () => {
    el = await mount([
      { name: "", when: { scene: "Cozy evening" }, actions: [] },
    ]);
    const name = el.shadowRoot.querySelector(".name")?.textContent?.trim();
    expect(name).toBe("Rule 1");
  });

  test("rules-list shows default Rule N when both name and scene are empty", async () => {
    el = await mount([
      { name: "", when: {}, actions: [] },
    ]);
    const name = el.shadowRoot.querySelector(".name")?.textContent?.trim();
    expect(name).toBe("Rule 1");
  });

  test("rules-list prefers explicit name over scene", async () => {
    el = await mount([
      { name: "My rule", when: { scene: "Cozy evening" }, actions: [] },
    ]);
    const name = el.shadowRoot.querySelector(".name")?.textContent?.trim();
    expect(name).toBe("My rule");
  });

  test("summary uses friendly matcher labels", async () => {
    const rules: Rule[] = [{
      name: "test",
      when: { time_of_day: { period: "afternoon" }, scene: "movie" },
      actions: [{ service: "light.turn_on", entity_ids: ["light.a"], params: { brightness: 80 } }],
    }];
    el = await mount(rules);
    const summary = el.shadowRoot.querySelector(".summary")?.textContent ?? "";
    expect(summary).toContain("Time of day:");
    expect(summary).toContain("Afternoon");
    expect(summary).toContain("Scene:");
    expect(summary).toContain("movie");
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
    el = await mount([movieRule], true, availableActions);
    expect(el.shadowRoot.querySelector(".actions-detail")).toBeFalsy();
    const actionCount = el.shadowRoot.querySelector(".action-count") as HTMLElement;
    actionCount.click();
    await el.updateComplete;
    const detail = el.shadowRoot.querySelector(".actions-detail");
    expect(detail).toBeTruthy();
    expect(detail.textContent).toContain("Set light");
    expect(detail.textContent).toContain("brightness 30");
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
    el2.autoSort = true;
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

  test("clicking action count again collapses the actions", async () => {
    el = await mount([movieRule]);
    const actionCount = el.shadowRoot.querySelector(".action-count") as HTMLElement;
    actionCount.click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".actions-detail")).toBeTruthy();
    actionCount.click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".actions-detail")).toBeFalsy();
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

  test("summary lists matchers in priority order (scene, day, time_of_day, weather)", async () => {
    const rules: Rule[] = [{
      name: "test",
      // Deliberately interleave the `when` keys to confirm the summary does
      // NOT follow insertion order.
      when: {
        weather: { groups: [], thresholds: [{ attribute: "temperature", op: "<", value: 5 }] },
        time_of_day: { period: "afternoon" },
        scene: "movie",
        day: [{ kind: "weekday", days: [0] }],
      },
      actions: [],
    }];
    el = await mount(rules);
    await el.updateComplete;
    const summary = el.shadowRoot.querySelector(".summary")?.textContent ?? "";
    const iScene = summary.indexOf("Scene:");
    const iDay = summary.indexOf("Day:");
    const iTod = summary.indexOf("Time of day:");
    const iWeather = summary.indexOf("Weather:");
    expect(iScene).toBeGreaterThanOrEqual(0);
    expect(iDay).toBeGreaterThan(iScene);
    expect(iTod).toBeGreaterThan(iDay);
    expect(iWeather).toBeGreaterThan(iTod);
  });
});
