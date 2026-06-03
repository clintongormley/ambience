import { afterEach, beforeAll, describe, expect, test, vi } from "vitest";

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
import "../frontend/src/views/scenes-list";
import { colorHex } from "../frontend/src/category-colors";
import type {
  ConditionInfo,
  ExposedAction,
  PeriodStoreView,
  Scene,
  SceneCategory,
} from "../frontend/src/types";

const conditions: ConditionInfo[] = [
  { name: "mode", description: "", predicate_help: "", input: "text", priority: 1000 },
  { name: "day", description: "", predicate_help: "", input: "day_predicate", priority: 900 },
  { name: "time_of_day", description: "", predicate_help: "", input: "time_of_day", priority: 800 },
  {
    name: "weather",
    description: "",
    predicate_help: "",
    input: "weather_predicate",
    priority: 700,
  },
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

const movieScene: Scene = {
  name: "Movie scene",
  when: { mode: "movie" },
  actions: [{ service: "light.turn_on", entity_ids: ["light.lamp"], params: { brightness: 30 } }],
};

const eveningScene: Scene = {
  name: "Evening",
  when: { time_of_day: { period: "morning" } },
  actions: [],
};

const testHass = {
  localize: (k: string) => {
    if (k === "component.ambience.condition.mode") return "Mode";
    if (k === "component.ambience.condition.time_of_day") return "Time of day";
    if (k === "component.ambience.condition.day") return "Day";
    if (k === "component.ambience.condition.weather") return "Weather";
    return undefined;
  },
};

async function mount(
  scenes: Scene[] = [],
  availableActions: ExposedAction[] = [],
  schemas: Record<string, unknown> = {},
  categories: SceneCategory[] = [],
): Promise<any> {
  const el: any = document.createElement("ambience-scenes-list");
  el.scenes = scenes;
  el.periods = periods;
  el.conditions = conditions;
  el.hass = testHass;
  el.availableActions = availableActions;
  el.schemas = schemas;
  el.categories = categories;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function captureEvent(el: HTMLElement, name: string) {
  let detail: any;
  el.addEventListener(name, (e: Event) => {
    detail = (e as CustomEvent).detail;
  });
  return () => detail;
}

async function pickFromKebab(el: any, rowIndex: number, action: string) {
  const rows = el.shadowRoot.querySelectorAll("li");
  const kebab: any = rows[rowIndex].querySelector("ambience-kebab-menu");
  (kebab.shadowRoot.querySelector(".kebab-trigger") as HTMLButtonElement).click();
  await kebab.updateComplete;
  (kebab.shadowRoot.querySelector(`[data-action='${action}']`) as HTMLButtonElement).click();
  await kebab.updateComplete;
}

async function pickCategoryKebab(el: any, action: string) {
  const kebab: any = el.shadowRoot.querySelector(".category-section-header ambience-kebab-menu");
  (kebab.shadowRoot.querySelector(".kebab-trigger") as HTMLButtonElement).click();
  await kebab.updateComplete;
  (kebab.shadowRoot.querySelector(`[data-action='${action}']`) as HTMLButtonElement).click();
  await kebab.updateComplete;
}

describe("ambience-scenes-list", () => {
  let el: any;
  afterEach(() => {
    el?.remove();
  });

  test("renders 'No scenes yet' when empty", async () => {
    el = await mount([]);
    expect(el.shadowRoot.textContent).toContain("No scenes yet");
  });

  test("renders an Add scene button when empty", async () => {
    el = await mount([]);
    const btn = el.shadowRoot.querySelector("button.add") as HTMLButtonElement;
    expect(btn).toBeTruthy();
    expect(btn.textContent).toContain("Add scene");
  });

  test("emits add-scene when Add button clicked (empty state)", async () => {
    el = await mount([]);
    const get = captureEvent(el, "add-scene");
    (el.shadowRoot.querySelector("button.add") as HTMLButtonElement).click();
    expect(get()).toBeDefined();
  });

  test("renders scene list with correct count", async () => {
    el = await mount([movieScene, eveningScene]);
    const items = el.shadowRoot.querySelectorAll("li");
    expect(items.length).toBe(2);
  });

  test("renders scene names in list items", async () => {
    el = await mount([movieScene]);
    expect(el.shadowRoot.textContent).toContain("Movie scene");
  });

  test("clicking the scene name toggles expansion (does NOT emit edit-scene)", async () => {
    el = await mount([movieScene]);
    const get = captureEvent(el, "edit-scene");
    expect(el.shadowRoot.querySelector(".scene-detail")).toBeFalsy();
    (el.shadowRoot.querySelector(".name") as HTMLElement).click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".scene-detail")).toBeTruthy();
    expect(get()).toBeUndefined();
  });

  test("expanded scene does not show the action count", async () => {
    el = await mount([movieScene]);
    (el.shadowRoot.querySelector(".name") as HTMLElement).click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".action-count")).toBeNull();
  });

  test("picking Edit from the kebab does NOT toggle expansion", async () => {
    el = await mount([movieScene]);
    await pickFromKebab(el, 0, "edit");
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".scene-detail")).toBeFalsy();
  });

  test("scene row no longer renders standalone duplicate/run/delete buttons", async () => {
    el = await mount([movieScene]);
    expect(el.shadowRoot.querySelector("button[title='Duplicate']")).toBeNull();
    expect(el.shadowRoot.querySelector("button[title='Run actions']")).toBeNull();
    expect(el.shadowRoot.querySelector("button[title='Delete']")).toBeNull();
  });

  test("scene row renders no standalone edit button; edit is in the kebab", async () => {
    el = await mount([movieScene]);
    expect(el.shadowRoot.querySelector("button[title='Edit']")).toBeNull();
    expect(el.shadowRoot.querySelector("ambience-kebab-menu")).toBeTruthy();
  });

  test("kebab Edit emits edit-scene with index", async () => {
    el = await mount([movieScene, eveningScene]);
    const get = captureEvent(el, "edit-scene");
    await pickFromKebab(el, 1, "edit");
    expect(get()).toEqual({ index: 1 });
  });

  test("kebab Duplicate emits duplicate-scene with index", async () => {
    el = await mount([movieScene, eveningScene]);
    const get = captureEvent(el, "duplicate-scene");
    await pickFromKebab(el, 1, "duplicate");
    expect(get()).toEqual({ index: 1 });
  });

  test("kebab Run actions emits run-scene-actions with index", async () => {
    el = await mount([movieScene, eveningScene]);
    const get = captureEvent(el, "run-scene-actions");
    await pickFromKebab(el, 0, "run");
    expect(get()).toEqual({ index: 0 });
  });

  test("kebab Delete emits delete-scene directly, without confirm", async () => {
    el = await mount([movieScene, eveningScene]);
    const get = captureEvent(el, "delete-scene");
    const confirmSpy = vi.spyOn(window, "confirm");
    await pickFromKebab(el, 1, "delete");
    expect(get()).toEqual({ index: 1 });
    expect(confirmSpy).not.toHaveBeenCalled();
  });

  test("emits add-scene when Add scene button clicked (non-empty state)", async () => {
    el = await mount([movieScene]);
    const get = captureEvent(el, "add-scene");
    const btn = el.shadowRoot.querySelector("button.add") as HTMLButtonElement;
    btn.click();
    expect(get()).toBeDefined();
  });

  test("unpinned rows show a drag handle", async () => {
    el = await mount([movieScene, eveningScene]);
    expect(el.shadowRoot.querySelectorAll(".handle").length).toBe(2);
  });

  test("pinned row shows a pin in place of the drag handle; clicking it emits unpin-scene", async () => {
    const pinned: Scene = { ...movieScene, pinned: true, priority: 2048 };
    el = await mount([pinned]);
    const pin = el.shadowRoot.querySelector(".pin");
    expect(pin).toBeTruthy();
    // The pin replaces the drag handle on a pinned row.
    expect(el.shadowRoot.querySelector(".handle")).toBeFalsy();
    const getDetail = captureEvent(el, "unpin-scene");
    pin.click();
    expect(getDetail()).toEqual({ index: 0 });
  });

  test("unpinned row shows no pin icon", async () => {
    el = await mount([movieScene]);
    expect(el.shadowRoot.querySelector(".pin")).toBeFalsy();
  });

  test("shadowed row shows a warning badge", async () => {
    const shadowed: Scene = { ...eveningScene, shadowed_by: 0 };
    el = await mount([movieScene, shadowed]);
    expect(el.shadowRoot.querySelector(".shadow-warning")).toBeTruthy();
  });

  test("unshadowed row shows no warning badge", async () => {
    el = await mount([movieScene]);
    expect(el.shadowRoot.querySelector(".shadow-warning")).toBeFalsy();
  });

  test("the manual-sort toggle is gone", async () => {
    el = await mount([movieScene]);
    expect(el.shadowRoot.querySelector(".autosort")).toBeFalsy();
  });

  test("summary shows 'any' for scene with no when predicates", async () => {
    const noPredicateScene: Scene = { name: "Catch all", when: {}, actions: [] };
    el = await mount([noPredicateScene]);
    expect(el.shadowRoot.querySelector(".summary")?.textContent).toContain("any");
  });

  test("summary shows mode predicate value", async () => {
    el = await mount([movieScene]);
    expect(el.shadowRoot.querySelector(".summary")?.textContent).toContain("movie");
  });

  test("summary shows 0 actions for empty actions", async () => {
    const r: Scene = { name: "x", when: {}, actions: [] };
    el = await mount([r]);
    expect(el.shadowRoot.querySelector(".summary")?.textContent).toContain("0 actions");
  });

  test("summary shows period label for time_of_day predicate", async () => {
    el = await mount([eveningScene]);
    const summary = el.shadowRoot.querySelector(".summary")?.textContent ?? "";
    // periodLabel capitalises the first letter: "morning" -> "Morning"
    expect(summary.toLowerCase()).toContain("morning");
  });

  test("drag start sets _dragFrom index", async () => {
    el = await mount([movieScene, eveningScene]);
    const items = el.shadowRoot.querySelectorAll("li");
    items[0].dispatchEvent(new DragEvent("dragstart", { bubbles: true }));
    await el.updateComplete;
    // _dragFrom should be 0 — verified indirectly by drop emitting reorder
    // (we can't read private state directly, but we can test the side effect)
    expect(el._drag.from).toBe(0);
  });

  test("drag over a different item allows drop and sets _dragOver", async () => {
    el = await mount([movieScene, eveningScene]);
    const items = el.shadowRoot.querySelectorAll("li");
    items[0].dispatchEvent(new DragEvent("dragstart", { bubbles: true }));

    const dragOverEvent = new DragEvent("dragover", { bubbles: true, cancelable: true });
    items[1].dispatchEvent(dragOverEvent);
    await el.updateComplete;
    expect(el._drag.over).toBe(1);
  });

  test("drag over the same item is a no-op", async () => {
    el = await mount([movieScene, eveningScene]);
    const items = el.shadowRoot.querySelectorAll("li");
    items[0].dispatchEvent(new DragEvent("dragstart", { bubbles: true }));
    items[0].dispatchEvent(new DragEvent("dragover", { bubbles: true }));
    await el.updateComplete;
    expect(el._drag.over).toBeNull();
  });

  test("drop emits reorder-scenes and resets drag state", async () => {
    el = await mount([movieScene, eveningScene]);
    const get = captureEvent(el, "reorder-scenes");
    const items = el.shadowRoot.querySelectorAll("li");
    items[0].dispatchEvent(new DragEvent("dragstart", { bubbles: true }));
    items[1].dispatchEvent(new DragEvent("dragover", { bubbles: true, cancelable: true }));
    items[1].dispatchEvent(new DragEvent("drop", { bubbles: true }));
    await el.updateComplete;

    expect(get()).toEqual({ from: 0, to: 1 });
    expect(el._drag.from).toBeNull();
    expect(el._drag.over).toBeNull();
  });

  test("drop on the same index is a no-op", async () => {
    el = await mount([movieScene, eveningScene]);
    const get = captureEvent(el, "reorder-scenes");
    const items = el.shadowRoot.querySelectorAll("li");
    items[0].dispatchEvent(new DragEvent("dragstart", { bubbles: true }));
    // Drop on same item (from=0, to=0)
    items[0].dispatchEvent(new DragEvent("drop", { bubbles: true }));
    await el.updateComplete;
    expect(get()).toBeUndefined();
  });

  test("dragend resets drag state", async () => {
    el = await mount([movieScene, eveningScene]);
    const items = el.shadowRoot.querySelectorAll("li");
    items[0].dispatchEvent(new DragEvent("dragstart", { bubbles: true }));
    items[0].dispatchEvent(new DragEvent("dragend", { bubbles: true }));
    await el.updateComplete;
    expect(el._drag.from).toBeNull();
    expect(el._drag.over).toBeNull();
  });

  test("time range predicate renders arrow format in summary", async () => {
    const rangeScene: Scene = {
      name: "Range",
      when: {
        time_of_day: {
          from: { kind: "time", hh: 9, mm: 0 },
          to: { kind: "time", hh: 17, mm: 30 },
        },
      },
      actions: [],
    };
    el = await mount([rangeScene]);
    const summary = el.shadowRoot.querySelector(".summary")?.textContent ?? "";
    expect(summary).toContain("→");
  });

  test("sun endpoint renders anchor+offset in summary", async () => {
    const sunScene: Scene = {
      name: "Sun",
      when: {
        time_of_day: {
          from: { kind: "sun", anchor: "sunrise", offset_min: 30 },
          to: { kind: "sun", anchor: "sunset", offset_min: 0 },
        },
      },
      actions: [],
    };
    el = await mount([sunScene]);
    const summary = el.shadowRoot.querySelector(".summary")?.textContent ?? "";
    expect(summary).toContain("Sunrise");
  });

  test("scenes-list shows 'Scene 1' when scene name is empty, even if mode is set", async () => {
    el = await mount([{ name: "", when: { mode: "Cozy evening" }, actions: [] }]);
    const name = el.shadowRoot.querySelector(".name")?.textContent?.trim();
    expect(name).toBe("Scene 1");
  });

  test("scenes-list shows default Scene N when both name and mode are empty", async () => {
    el = await mount([{ name: "", when: {}, actions: [] }]);
    const name = el.shadowRoot.querySelector(".name")?.textContent?.trim();
    expect(name).toBe("Scene 1");
  });

  test("scenes-list prefers explicit name over mode", async () => {
    el = await mount([{ name: "My scene", when: { mode: "Cozy evening" }, actions: [] }]);
    const name = el.shadowRoot.querySelector(".name")?.textContent?.trim();
    expect(name).toBe("My scene");
  });

  test("summary uses friendly condition labels", async () => {
    const scenes: Scene[] = [
      {
        name: "test",
        when: { time_of_day: { period: "afternoon" }, mode: "movie" },
        actions: [
          { service: "light.turn_on", entity_ids: ["light.a"], params: { brightness: 80 } },
        ],
      },
    ];
    el = await mount(scenes);
    const summary = el.shadowRoot.querySelector(".summary")?.textContent ?? "";
    expect(summary).toContain("Time of day:");
    expect(summary).toContain("Afternoon");
    expect(summary).toContain("Mode:");
    expect(summary).toContain("movie");
  });

  test("condition labels in the summary are wrapped in <strong>", async () => {
    const scenes: Scene[] = [
      {
        name: "test",
        when: { time_of_day: { period: "afternoon" }, mode: "movie" },
        actions: [],
      },
    ];
    el = await mount(scenes);
    const strongs = Array.from(el.shadowRoot.querySelectorAll(".summary strong")).map((s: any) =>
      s.textContent?.trim(),
    );
    expect(strongs).toContain("Time of day:");
    expect(strongs).toContain("Mode:");
  });

  test("clicking the summary expands the whole scene", async () => {
    const scenes: Scene[] = [
      {
        name: "r",
        when: { time_of_day: { period: "afternoon" }, mode: "movie" },
        actions: [{ service: "light.turn_on", entity_ids: ["light.a"], params: {} }],
      },
    ];
    el = await mount(scenes);
    expect(el.shadowRoot.querySelector(".scene-detail")).toBeFalsy();
    const summary = el.shadowRoot.querySelector(".summary") as HTMLElement;
    summary.click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".scene-detail")).toBeTruthy();
  });

  test("expanded scene renders each condition on its own line", async () => {
    const scenes: Scene[] = [
      {
        name: "r",
        when: { time_of_day: { period: "afternoon" }, mode: "movie" },
        actions: [],
      },
    ];
    el = await mount(scenes);
    (el.shadowRoot.querySelector(".summary") as HTMLElement).click();
    await el.updateComplete;
    const lines = Array.from(el.shadowRoot.querySelectorAll(".scene-detail .condition-line"));
    expect(lines.length).toBe(2);
    const texts = lines.map((n: any) => n.textContent?.trim() ?? "");
    expect(texts.some((t: string) => t.startsWith("Mode:"))).toBe(true);
    expect(texts.some((t: string) => t.startsWith("Time of day:"))).toBe(true);
  });

  test("expanded scene still shows the per-action detail", async () => {
    const scenes: Scene[] = [
      {
        name: "r",
        when: {},
        actions: [
          {
            service: "light.turn_on",
            entity_ids: ["light.a"],
            params: { brightness: 80 },
          },
        ],
      },
    ];
    const availableActions: ExposedAction[] = [
      { id: "light.turn_on", label: "Set light", visible_fields: ["brightness"], defaults: {} },
    ];
    el = await mount(scenes, availableActions);
    (el.shadowRoot.querySelector(".summary") as HTMLElement).click();
    await el.updateComplete;
    const item = el.shadowRoot.querySelector(".actions-detail-item");
    expect(item).toBeTruthy();
    expect(item.textContent).toContain("Set light");
    expect(item.textContent).toContain("Brightness: 80");
  });

  test("action count is rendered as a clickable element", async () => {
    el = await mount([movieScene]);
    const actionCount = el.shadowRoot.querySelector(".action-count");
    expect(actionCount).toBeTruthy();
    expect(actionCount.textContent).toContain("1 action");
  });

  test("clicking action count expands the actions inline", async () => {
    const availableActions: ExposedAction[] = [
      { id: "light.turn_on", label: "Set light", visible_fields: ["brightness"], defaults: {} },
    ];
    el = await mount([movieScene], availableActions);
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
    const scene: Scene = {
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
    el = await mount([scene], availableActions);
    const actionCount = el.shadowRoot.querySelector(".action-count") as HTMLElement;
    actionCount.click();
    await el.updateComplete;
    const detail = el.shadowRoot.querySelector(".actions-detail");
    expect(detail.textContent).toContain("Rgb color: [210,81,81]");
    expect(detail.textContent).toContain("Brightness pct: 31");
  });

  test("expanded action header uses HA's field.name from schemas when present", async () => {
    const scene: Scene = {
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
    el = await mount([scene], availableActions, schemas);
    const actionCount = el.shadowRoot.querySelector(".action-count") as HTMLElement;
    actionCount.click();
    await el.updateComplete;
    const detail = el.shadowRoot.querySelector(".actions-detail");
    expect(detail.textContent).toContain("Brightness: 31");
    expect(detail.textContent).toContain("RGB Color: [210,81,81]");
    expect(detail.textContent).not.toContain("Brightness pct");
  });

  test("expanded action lists target entity ids", async () => {
    const scene: Scene = {
      name: "multi",
      when: {},
      actions: [
        { service: "light.turn_on", entity_ids: ["light.lamp", "light.kitchen"], params: {} },
      ],
    };
    el = await mount([scene]);
    (el.shadowRoot.querySelector(".action-count") as HTMLElement).click();
    await el.updateComplete;
    const items = el.shadowRoot.querySelectorAll(".entity-list li");
    expect(items.length).toBe(2);
    expect(items[0].textContent).toContain("light.lamp");
    expect(items[1].textContent).toContain("light.kitchen");
  });

  test("expanded action uses friendly_name from hass.states when available", async () => {
    const scene: Scene = {
      name: "named",
      when: {},
      actions: [
        { service: "light.turn_on", entity_ids: ["light.lamp", "light.kitchen"], params: {} },
      ],
    };
    const el2: any = document.createElement("ambience-scenes-list");
    el2.scenes = [scene];
    el2.periods = periods;
    el2.conditions = conditions;
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

  test("clicking the summary again collapses the scene", async () => {
    el = await mount([movieScene]);
    (el.shadowRoot.querySelector(".summary") as HTMLElement).click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".scene-detail")).toBeTruthy();
    // Re-query after re-render before the second click.
    (el.shadowRoot.querySelector(".summary") as HTMLElement).click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".scene-detail")).toBeFalsy();
  });

  test("clicking action count does not emit edit-scene", async () => {
    el = await mount([movieScene]);
    const get = captureEvent(el, "edit-scene");
    const actionCount = el.shadowRoot.querySelector(".action-count") as HTMLElement;
    actionCount.click();
    await el.updateComplete;
    expect(get()).toBeUndefined();
  });

  test("expanding actions for one scene does not expand actions for others", async () => {
    el = await mount([movieScene, eveningScene]);
    const counts = el.shadowRoot.querySelectorAll(".action-count");
    (counts[0] as HTMLElement).click();
    await el.updateComplete;
    const details = el.shadowRoot.querySelectorAll(".actions-detail");
    expect(details.length).toBe(1);
    // The expanded one should be inside the first scene's li
    const firstLi = el.shadowRoot.querySelectorAll("li")[0];
    expect(firstLi.querySelector(".actions-detail")).toBeTruthy();
  });

  test("expanded action with 0 entity_ids renders '(no targets)'", async () => {
    const scene: Scene = {
      name: "no targets",
      when: {},
      actions: [{ service: "light.turn_on", entity_ids: [], params: {} }],
    };
    el = await mount([scene]);
    (el.shadowRoot.querySelector(".action-count") as HTMLElement).click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".actions-detail")?.textContent).toContain("(no targets)");
    expect(el.shadowRoot.querySelector(".entity-list")).toBeFalsy();
  });

  test("summary lists conditions in priority order (mode, day, time_of_day, weather)", async () => {
    const scenes: Scene[] = [
      {
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
      },
    ];
    el = await mount(scenes);
    await el.updateComplete;
    const summary = el.shadowRoot.querySelector(".summary")?.textContent ?? "";
    const iMode = summary.indexOf("Mode:");
    const iDay = summary.indexOf("Day:");
    const iTod = summary.indexOf("Time of day:");
    const iWeather = summary.indexOf("Weather:");
    // Most-important condition (mode=1000) must appear first; least-important (weather=700) last.
    expect(iMode).toBeGreaterThanOrEqual(0);
    expect(iDay).toBeGreaterThan(iMode);
    expect(iTod).toBeGreaterThan(iDay);
    expect(iWeather).toBeGreaterThan(iTod);
  });

  // --- category sections ------------------------------------------------------

  test("All view groups scenes into categories, sorted by category name, numbered per category", async () => {
    const groups = [
      { id: "b", name: "Blinds" },
      { id: "a", name: "Awnings" },
    ];
    const scenes = [
      { when: {}, actions: [], category: "b" }, // Blinds 1
      { when: {}, actions: [], category: "a" }, // Awnings 1
      { when: {}, actions: [], category: "b" }, // Blinds 2
    ];
    el = await mount(scenes, [], {}, groups); // filterCategory defaults to "" (All)
    const headers = Array.from(el.shadowRoot.querySelectorAll(".category-section-header")).map(
      (h: any) => h.textContent!.trim(),
    );
    // alphabetical by NAME: Awnings before Blinds
    expect(headers.some((h: string) => h.includes("Awnings"))).toBe(true);
    expect(headers.findIndex((h: string) => h.includes("Awnings"))).toBeLessThan(
      headers.findIndex((h: string) => h.includes("Blinds")),
    );
    // Within the Blinds section the rows are numbered 1, 2.
    const blindsSection = Array.from(el.shadowRoot.querySelectorAll(".category-section")).find(
      (s: any) => s.querySelector(".category-section-header")!.textContent!.includes("Blinds"),
    )! as Element;
    const nums = Array.from(blindsSection.querySelectorAll(".idx")).map((n: any) =>
      n.textContent!.trim(),
    );
    expect(nums).toEqual(["1", "2"]);
  });

  test("single-category filter shows only that category, with its header, numbered 1..N", async () => {
    const groups = [
      { id: "a", name: "A" },
      { id: "b", name: "B" },
    ];
    const scenes = [
      { when: {}, actions: [], category: "a" },
      { when: {}, actions: [], category: "b" },
    ];
    el = await mount(scenes, [], {}, groups);
    el.filterCategory = "a";
    await el.updateComplete;
    // The single visible section still shows its category header bar.
    const headers = Array.from(el.shadowRoot.querySelectorAll(".category-section-header"));
    expect(headers.length).toBe(1);
    expect(headers[0].textContent).toContain("A");
    expect(el.shadowRoot.querySelectorAll("li").length).toBe(1);
  });

  test("filtering to a category with no scenes in this scope shows no header bar", async () => {
    const groups = [
      { id: "a", name: "A" },
      { id: "b", name: "B" },
    ];
    const scenes = [{ when: {}, actions: [], category: "a" }];
    el = await mount(scenes, [], {}, groups);
    el.filterCategory = "b"; // scope has no category-b scenes
    await el.updateComplete;
    expect(el.shadowRoot.querySelectorAll(".category-section-header").length).toBe(0);
    expect(el.shadowRoot.querySelectorAll("li").length).toBe(0);
  });

  test("editing a row in a section emits the scene's ORIGINAL index", async () => {
    const groups = [
      { id: "a", name: "A" },
      { id: "b", name: "B" },
    ];
    const scenes = [
      { when: {}, actions: [], category: "b" }, // original index 0
      { when: {}, actions: [], category: "a" }, // original index 1
    ];
    el = await mount(scenes, [], {}, groups);
    const events: number[] = [];
    el.addEventListener("edit-scene", (e: any) => events.push(e.detail.index));
    const aSection = Array.from(el.shadowRoot.querySelectorAll(".category-section")).find(
      (s: any) => s.querySelector(".category-section-header")!.textContent!.includes("A"),
    )! as Element;
    const kebab: any = aSection.querySelector("li ambience-kebab-menu");
    (kebab.shadowRoot.querySelector(".kebab-trigger") as HTMLButtonElement).click();
    await kebab.updateComplete;
    (kebab.shadowRoot.querySelector("[data-action='edit']") as HTMLButtonElement).click();
    await kebab.updateComplete;
    expect(events).toEqual([1]);
  });

  test("scenes no longer render a per-row category lozenge", async () => {
    const scene: Scene = { name: "R", category: "g1", when: {}, actions: [] };
    el = await mount([scene], [], {}, [
      { id: "g1", name: "Lights", color: "green", icon: "mdi:lightbulb" },
    ]);
    expect(el.shadowRoot.querySelector("ambience-category-chip")).toBeNull();
    const nameEl = el.shadowRoot.querySelector(".name") as HTMLElement;
    expect(nameEl.querySelector("ambience-category-chip")).toBeNull();
    expect(nameEl.textContent!.trim()).toBe("R");
  });

  test("the category section header is a full-width coloured bar with the category's colour, icon and name", async () => {
    const category: SceneCategory = {
      id: "g1",
      name: "Lights",
      color: "green",
      icon: "mdi:lightbulb",
    };
    el = await mount([{ name: "R", category: "g1", when: {}, actions: [] }], [], {}, [category]);
    const header = el.shadowRoot.querySelector(".category-section-header") as HTMLElement;
    expect(header).toBeTruthy();
    // Category colour applied inline as the bar background.
    expect(header.getAttribute("style") || "").toContain(colorHex("green")!);
    // Icon + name rendered inside the bar.
    expect(header.querySelector('ha-icon[icon="mdi:lightbulb"]')).toBeTruthy();
    expect(header.textContent).toContain("Lights");
  });

  test("a colourless category renders a header with no inline background (neutral fallback)", async () => {
    const category: SceneCategory = { id: "g1", name: "Plain" };
    el = await mount([{ name: "R", category: "g1", when: {}, actions: [] }], [], {}, [category]);
    const header = el.shadowRoot.querySelector(".category-section-header") as HTMLElement;
    expect(header.getAttribute("style") || "").toBe("");
    expect(header.textContent).toContain("Plain");
  });

  test("category header renders a kebab (no standalone apply/traces buttons)", async () => {
    const category = { id: "g1", name: "Evening", color: "blue", icon: "" } as SceneCategory;
    const sceneInCategory = { ...movieScene, category: "g1" } as Scene;
    el = await mount([sceneInCategory], [], {}, [category]);
    const header = el.shadowRoot.querySelector(".category-section-header") as HTMLElement;
    expect(header.querySelector("ambience-kebab-menu")).toBeTruthy();
    expect(header.querySelector(".apply-category")).toBeNull();
    expect(header.querySelector(".traces-btn")).toBeNull();
  });

  test("category kebab Run emits apply-category with the category id", async () => {
    const category = { id: "g1", name: "Evening", color: "blue", icon: "" } as SceneCategory;
    const sceneInCategory = { ...movieScene, category: "g1" } as Scene;
    el = await mount([sceneInCategory], [], {}, [category]);
    const get = captureEvent(el, "apply-category");
    await pickCategoryKebab(el, "run");
    expect(get()).toEqual({ categoryId: "g1" });
  });

  test("category kebab Traces emits show-traces with the category id", async () => {
    const category = { id: "g1", name: "Evening", color: "blue", icon: "" } as SceneCategory;
    const sceneInCategory = { ...movieScene, category: "g1" } as Scene;
    el = await mount([sceneInCategory], [], {}, [category]);
    const get = captureEvent(el, "show-traces");
    await pickCategoryKebab(el, "traces");
    expect(get()).toEqual({ category: "g1" });
  });

  test("renders a toggle that emits toggle-scene-enabled {index, enabled:false} for an enabled scene", async () => {
    el = await mount([movieScene]);
    const get = captureEvent(el, "toggle-scene-enabled");
    const toggle = el.shadowRoot.querySelector("button.toggle") as HTMLButtonElement;
    expect(toggle).toBeTruthy();
    toggle.click();
    expect(get()).toEqual({ index: 0, enabled: false });
  });

  test("a disabled scene: toggle emits enabled:true, row is dimmed, no shadow warning", async () => {
    const disabled: Scene = { ...movieScene, enabled: false, shadowed_by: 0 };
    el = await mount([disabled]);
    const get = captureEvent(el, "toggle-scene-enabled");
    const li = el.shadowRoot.querySelector("li") as HTMLElement;
    expect(li.classList.contains("disabled")).toBe(true);
    expect(el.shadowRoot.querySelector(".shadow-warning")).toBeNull();
    (el.shadowRoot.querySelector("button.toggle") as HTMLButtonElement).click();
    expect(get()).toEqual({ index: 0, enabled: true });
  });

  test("category kebab Simulate emits show-simulator with the category id", async () => {
    const category = { id: "g1", name: "Evening", color: "blue", icon: "" } as SceneCategory;
    const sceneInCategory = { ...movieScene, category: "g1" } as Scene;
    el = await mount([sceneInCategory], [], {}, [category]);
    const get = captureEvent(el, "show-simulator");
    await pickCategoryKebab(el, "simulate");
    expect(get()).toEqual({ category: "g1" });
  });
});
