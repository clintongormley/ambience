import { afterEach, describe, expect, test, vi } from "vitest";

import "../frontend/src/views/scenes-list";
import { colorHex } from "../frontend/src/category-colors";
import { scopeCategoryKey } from "../frontend/src/entities-for-scope.js";
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

describe("ambience-scenes-list — apply on every match", () => {
  let el: any;
  afterEach(() => el?.remove());

  const alwaysScene: Scene = {
    name: "Always scene",
    when: { mode: "movie" },
    actions: [{ service: "light.turn_on", entity_ids: ["light.lamp"], params: {} }],
    apply: "always",
  };

  test("shows 'Apply on every match' in the collapsed summary when apply=always", async () => {
    el = await mount([alwaysScene]);
    const summary = el.shadowRoot.querySelector(".summary") as HTMLElement;
    expect(summary.textContent).toContain("Apply on every match");
  });

  test("shows 'Apply on every match' in the expanded detail when apply=always", async () => {
    el = await mount([alwaysScene]);
    (el.shadowRoot.querySelector(".name") as HTMLElement).click();
    await el.updateComplete;
    const detail = el.shadowRoot.querySelector(".scene-detail") as HTMLElement;
    expect(detail.textContent).toContain("Apply on every match");
  });

  test("no indicator when apply is absent", async () => {
    el = await mount([movieScene]);
    expect((el.shadowRoot.querySelector(".summary") as HTMLElement).textContent).not.toContain(
      "Apply on every match",
    );
  });

  test("no indicator for a no-action blocker even when apply=always", async () => {
    el = await mount([
      { name: "Blocker", when: { mode: "movie" }, actions: [], apply: "always" } as Scene,
    ]);
    (el.shadowRoot.querySelector(".name") as HTMLElement).click();
    await el.updateComplete;
    expect(el.shadowRoot.textContent).not.toContain("Apply on every match");
  });
});

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

  test("each displayed category section has its own Add scene button", async () => {
    const groups = [
      { id: "a", name: "Awnings" },
      { id: "b", name: "Blinds" },
    ];
    const scenes: Scene[] = [
      { when: {}, actions: [], category: "a" },
      { when: {}, actions: [], category: "b" },
    ];
    el = await mount(scenes, [], {}, groups);
    const sections = el.shadowRoot.querySelectorAll(".category-section");
    expect(sections.length).toBe(2);
    for (const section of sections) {
      expect(section.querySelector("button.add")).toBeTruthy();
    }
    // No separate trailing global button outside the sections.
    const topLevelAdds = Array.from(el.shadowRoot.querySelectorAll("button.add")).filter(
      (b: any) => !b.closest(".category-section"),
    );
    expect(topLevelAdds.length).toBe(0);
  });

  test("a category's Add button emits add-scene with that category id", async () => {
    const groups = [
      { id: "a", name: "Awnings" },
      { id: "b", name: "Blinds" },
    ];
    const scenes: Scene[] = [
      { when: {}, actions: [], category: "a" },
      { when: {}, actions: [], category: "b" },
    ];
    el = await mount(scenes, [], {}, groups);
    const get = captureEvent(el, "add-scene");
    // Sections are sorted by name: Awnings(a), Blinds(b). Click the second.
    const sections = el.shadowRoot.querySelectorAll(".category-section");
    (sections[1].querySelector("button.add") as HTMLButtonElement).click();
    expect(get().category).toBe("b");
  });

  test("empty-state Add button emits add-scene with no category (fallback)", async () => {
    el = await mount([]);
    const get = captureEvent(el, "add-scene");
    (el.shadowRoot.querySelector("button.add") as HTMLButtonElement).click();
    expect(get().category).toBeUndefined();
  });

  test("a filter matching no scenes in this scope still offers an Add button for that category", async () => {
    const groups = [
      { id: "a", name: "Awnings" },
      { id: "b", name: "Blinds" },
    ];
    // Scope has scenes only in category "a", but the active filter is "b".
    const scenes: Scene[] = [{ when: {}, actions: [], category: "a" }];
    el = await mount(scenes, [], {}, groups);
    el.filterCategory = "b";
    await el.updateComplete;
    const btn = el.shadowRoot.querySelector("button.add") as HTMLButtonElement;
    expect(btn).toBeTruthy(); // not a dead-end blank panel
    const get = captureEvent(el, "add-scene");
    btn.click();
    expect(get().category).toBe("b");
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

  test("shadowed row shows a warning-severity problem flag", async () => {
    const shadowed: Scene = { ...eveningScene, shadowed_by: 0 };
    el = await mount([movieScene, shadowed]);
    const flag = el.shadowRoot.querySelector("ambience-problem-flag");
    expect(flag).toBeTruthy();
    expect(flag.severity).toBe("warning");
  });

  test("clean row shows no problem flag", async () => {
    el = await mount([movieScene]);
    expect(el.shadowRoot.querySelector("ambience-problem-flag")).toBeFalsy();
  });

  test("missing-entity row shows an error-severity flag naming the entity", async () => {
    const broken: Scene = { ...movieScene, missing_entities: ["light.ghost"] };
    el = await mount([broken]);
    const flag = el.shadowRoot.querySelector("ambience-problem-flag");
    expect(flag.severity).toBe("error");
    expect(flag.details.join(" ")).toContain("light.ghost");
  });

  test("overlap row shows a warning-severity flag listing the contested entity", async () => {
    const overlap: Scene = { ...movieScene, overlap_entities: ["light.kitchen"] };
    el = await mount([overlap]);
    const flag = el.shadowRoot.querySelector("ambience-problem-flag");
    expect(flag.severity).toBe("warning");
    expect(flag.details.join(" ")).toContain("light.kitchen");
  });

  test("tapping a scene's problem flag reveals the missing entity", async () => {
    const broken: Scene = { ...movieScene, missing_entities: ["light.ghost"] };
    el = await mount([broken]);
    const flag = el.shadowRoot.querySelector("ambience-problem-flag");
    (flag.shadowRoot.querySelector(".problem-flag") as HTMLElement).click();
    await flag.updateComplete;
    expect(flag.shadowRoot.querySelector(".details").textContent).toContain("light.ghost");
  });

  test("category header shows a problem indicator when a scene in it has a problem", async () => {
    const cats: SceneCategory[] = [{ id: "c1", name: "Cat one" }];
    const broken: Scene = { ...movieScene, category: "c1", missing_entities: ["light.ghost"] };
    el = await mount([broken], [], {}, cats);
    const header = el.shadowRoot.querySelector(".category-section-header");
    expect(header.querySelector("ambience-problem-flag")).toBeTruthy();
  });

  test("the manual-sort toggle is gone", async () => {
    el = await mount([movieScene]);
    expect(el.shadowRoot.querySelector(".autosort")).toBeFalsy();
  });

  test("summary reads 'Always' for a scene with no when predicates", async () => {
    const noPredicateScene: Scene = {
      name: "Catch all",
      when: {},
      actions: [{ service: "light.turn_on", entity_ids: ["light.a"], params: {} }],
    };
    el = await mount([noPredicateScene]);
    const summary = el.shadowRoot.querySelector(".summary")?.textContent ?? "";
    expect(summary).toContain("Always");
    expect(summary).not.toContain("any");
  });

  test("summary shows mode predicate value", async () => {
    el = await mount([movieScene]);
    expect(el.shadowRoot.querySelector(".summary")?.textContent).toContain("movie");
  });

  test("summary of a zero-condition blocker reads 'Block always'", async () => {
    const r: Scene = { name: "x", when: {}, actions: [] };
    el = await mount([r]);
    const summary = el.shadowRoot.querySelector(".summary")?.textContent ?? "";
    expect(summary).toContain("Block always");
    expect(summary).not.toContain("NOOP");
  });

  test("a blocker with a negated occupancy condition reads 'Block until … clear …'", async () => {
    const r: Scene = {
      name: "recently vacant",
      when: {
        occupancy: {
          sensors: ["binary_sensor.island"],
          occupied: false,
          for: { h: 0, m: 3, s: 0 },
          negate: true,
        },
      },
      actions: [],
    };
    el = await mount([r]);
    const summary = el.shadowRoot.querySelector(".summary")?.textContent ?? "";
    expect(summary).toContain("Block until");
    expect(summary).toContain("clear");
    expect(summary.toLowerCase()).not.toContain("not clear");
    expect(el.shadowRoot.querySelector(".action-count")).toBeNull();
  });

  test("summary shows period label for time_of_day predicate", async () => {
    el = await mount([eveningScene]);
    const summary = el.shadowRoot.querySelector(".summary")?.textContent ?? "";
    // periodLabel capitalises the first letter: "morning" -> "Morning"
    expect(summary.toLowerCase()).toContain("morning");
  });

  // --- drag-to-reorder (Pointer Events) ---
  //
  // jsdom has no layout, so the controller's default hit-test (elementFromPoint)
  // can't resolve a row. We stub the shadow root's elementFromPoint to return a
  // chosen row, driving the full host wiring exactly as a browser would.

  function rowsDraggable(el: any) {
    return el.shadowRoot.querySelectorAll("li[data-drag-index]");
  }

  function stubHitRow(el: any, index: number | null) {
    el.shadowRoot.elementFromPoint = (_x: number, _y: number) =>
      index === null ? null : el.shadowRoot.querySelector(`li[data-drag-index="${index}"]`);
  }

  function firePointer(type: string, init: { pointerId?: number } = {}) {
    window.dispatchEvent(new PointerEvent(type, { bubbles: true, pointerId: 1, ...init }));
  }

  /** Press the ⠿ grab handle of row `index` with a primary pointer. */
  function grabHandle(el: any, index: number) {
    (el.shadowRoot.querySelectorAll("li .handle")[index] as HTMLElement).dispatchEvent(
      new PointerEvent("pointerdown", { bubbles: true, pointerId: 1, isPrimary: true, button: 0 }),
    );
  }

  /** Press the 📌 pin button of row `index` with a primary pointer. */
  function grabPin(el: any, index: number) {
    (el.shadowRoot.querySelectorAll("li .pin")[index] as HTMLElement).dispatchEvent(
      new PointerEvent("pointerdown", { bubbles: true, pointerId: 1, isPrimary: true, button: 0 }),
    );
  }

  test("rows carry a data-drag-index for hit-testing", async () => {
    el = await mount([movieScene, eveningScene]);
    const rows = rowsDraggable(el);
    expect(rows.length).toBe(2);
    expect(rows[0].getAttribute("data-drag-index")).toBe("0");
    expect(rows[1].getAttribute("data-drag-index")).toBe("1");
  });

  test("pressing the ⠿ handle starts a drag from that row's index", async () => {
    el = await mount([movieScene, eveningScene]);
    grabHandle(el, 0);
    await el.updateComplete;
    expect(el._drag.from).toBe(0);
  });

  test("pressing the 📌 pin on a pinned row starts a drag from that row's index", async () => {
    const pinned: Scene = { ...movieScene, pinned: true, priority: 2048 };
    el = await mount([pinned]);
    grabPin(el, 0);
    await el.updateComplete;
    // A pinned row's pin doubles as its grab handle, so it can be re-dragged.
    expect(el._drag.from).toBe(0);
  });

  test("dragging a pinned row's 📌 onto another row emits reorder-scenes", async () => {
    const pinned: Scene = { ...movieScene, pinned: true, priority: 2048 };
    el = await mount([pinned, eveningScene]);
    const get = captureEvent(el, "reorder-scenes");
    grabPin(el, 0);
    stubHitRow(el, 1);
    firePointer("pointermove");
    firePointer("pointerup");
    await el.updateComplete;
    expect(get()).toEqual({ from: 0, to: 1 });
  });

  test("tapping the 📌 without dragging still emits unpin-scene", async () => {
    const pinned: Scene = { ...movieScene, pinned: true, priority: 2048 };
    el = await mount([pinned]);
    const get = captureEvent(el, "unpin-scene");
    const pin = el.shadowRoot.querySelector(".pin") as HTMLElement;
    grabPin(el, 0);
    stubHitRow(el, 0);
    firePointer("pointerup"); // released on the same row — no reorder
    pin.click();
    await el.updateComplete;
    expect(get()).toEqual({ index: 0 });
  });

  test("dragging the 📌 to reorder does NOT also unpin on the trailing click", async () => {
    const pinned: Scene = { ...movieScene, pinned: true, priority: 2048 };
    el = await mount([pinned, eveningScene]);
    const get = captureEvent(el, "unpin-scene");
    const pin = el.shadowRoot.querySelector(".pin") as HTMLElement;
    grabPin(el, 0);
    stubHitRow(el, 1);
    firePointer("pointermove"); // a genuine cross-row drag
    firePointer("pointerup");
    pin.click(); // the browser's trailing click after a drag must not unpin
    await el.updateComplete;
    expect(get()).toBeUndefined();
  });

  test("the post-drag click guard is one-shot: a later click still unpins", async () => {
    // Regression: the `moved` flag was only reset on the next pointerdown, so a
    // click that doesn't go through the handle (e.g. keyboard-activating the
    // pin) could stay suppressed after an earlier drag. The trailing click must
    // consume the flag so subsequent clicks unpin normally.
    const pinned: Scene = { ...movieScene, pinned: true, priority: 2048 };
    el = await mount([pinned, eveningScene]);
    const get = captureEvent(el, "unpin-scene");
    const pin = el.shadowRoot.querySelector(".pin") as HTMLElement;
    grabPin(el, 0);
    stubHitRow(el, 1);
    firePointer("pointermove");
    firePointer("pointerup");
    pin.click(); // trailing click — swallowed
    expect(get()).toBeUndefined();
    pin.click(); // a fresh, independent click — must unpin
    expect(get()).toEqual({ index: 0 });
  });

  test("dragging a row onto another marks it as the drop target", async () => {
    el = await mount([movieScene, eveningScene]);
    grabHandle(el, 0);
    stubHitRow(el, 1);
    firePointer("pointermove");
    await el.updateComplete;
    expect(el._drag.over).toBe(1);
  });

  test("releasing over another row emits reorder-scenes and resets drag state", async () => {
    el = await mount([movieScene, eveningScene]);
    const get = captureEvent(el, "reorder-scenes");
    grabHandle(el, 0);
    stubHitRow(el, 1);
    firePointer("pointerup");
    await el.updateComplete;

    expect(get()).toEqual({ from: 0, to: 1 });
    expect(el._drag.from).toBeNull();
    expect(el._drag.over).toBeNull();
  });

  test("releasing on the same row is a no-op", async () => {
    el = await mount([movieScene, eveningScene]);
    const get = captureEvent(el, "reorder-scenes");
    grabHandle(el, 0);
    stubHitRow(el, 0);
    firePointer("pointerup");
    await el.updateComplete;
    expect(get()).toBeUndefined();
  });

  test("pointercancel resets drag state without reordering", async () => {
    el = await mount([movieScene, eveningScene]);
    const get = captureEvent(el, "reorder-scenes");
    grabHandle(el, 0);
    firePointer("pointercancel");
    await el.updateComplete;
    expect(get()).toBeUndefined();
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
        actions: [{ service: "light.turn_on", entity_ids: ["light.a"], params: {} }],
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

  test("expanded scene with no conditions reads 'Always' on its own line", async () => {
    const scenes: Scene[] = [
      {
        name: "Catch all",
        when: {},
        actions: [{ service: "light.turn_on", entity_ids: ["light.a"], params: {} }],
      },
    ];
    el = await mount(scenes);
    (el.shadowRoot.querySelector(".summary") as HTMLElement).click();
    await el.updateComplete;
    const lines = Array.from(el.shadowRoot.querySelectorAll(".scene-detail .condition-line"));
    expect(lines.length).toBe(1);
    expect((lines[0] as HTMLElement).textContent?.trim()).toBe("Always");
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

  test("empty-label exposed action uses catalog schema name in expanded detail", async () => {
    // An action seeded with label="" should fall back to schemas[id].name ("Turn on"),
    // not the humanized service id ("Ambience Turn On").
    const scene: Scene = {
      name: "r",
      when: {},
      actions: [{ service: "ambience.turn_on", entity_ids: ["light.a"], params: {} }],
    };
    const availableActions: ExposedAction[] = [
      { id: "ambience.turn_on", label: "", visible_fields: [], defaults: {} },
    ];
    const schemas = {
      "ambience.turn_on": { name: "Turn on", fields: {}, target: null },
    };
    el = await mount([scene], availableActions, schemas);
    (el.shadowRoot.querySelector(".summary") as HTMLElement).click();
    await el.updateComplete;
    const item = el.shadowRoot.querySelector(".actions-detail-item");
    expect(item).toBeTruthy();
    expect(item.textContent).toContain("Turn on");
    expect(item.textContent).not.toContain("Ambience");
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
    const secondScene: Scene = { ...movieScene, name: "Second movie" };
    el = await mount([movieScene, secondScene]);
    const counts = el.shadowRoot.querySelectorAll(".action-count");
    // Both scenes must carry an action-count span for this test to be meaningful
    expect(counts.length).toBe(2);
    (counts[0] as HTMLElement).click();
    await el.updateComplete;
    const details = el.shadowRoot.querySelectorAll(".actions-detail");
    expect(details.length).toBe(1);
    // The expanded one should be inside the first scene's li
    const [firstLi, secondLi] = el.shadowRoot.querySelectorAll("li");
    expect(firstLi.querySelector(".actions-detail")).toBeTruthy();
    expect(secondLi.querySelector(".actions-detail")).toBeFalsy();
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

  test("expanded blocker shows the 'Block …' summary in the detail", async () => {
    const r: Scene = { name: "x", when: {}, actions: [] };
    el = await mount([r]);
    (el.shadowRoot.querySelector(".name") as HTMLElement).click();
    await el.updateComplete;
    const detail = el.shadowRoot.querySelector(".scene-detail");
    expect(detail).toBeTruthy();
    expect(detail?.textContent).toContain("Block always");
    expect(detail?.textContent).not.toContain("NOOP");
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
        actions: [{ service: "light.turn_on", entity_ids: ["light.a"], params: {} }],
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

  test("a disabled scene: toggle emits enabled:true, row is dimmed, no problem flag", async () => {
    const disabled: Scene = { ...movieScene, enabled: false, shadowed_by: 0 };
    el = await mount([disabled]);
    const get = captureEvent(el, "toggle-scene-enabled");
    const li = el.shadowRoot.querySelector("li") as HTMLElement;
    expect(li.classList.contains("disabled")).toBe(true);
    expect(el.shadowRoot.querySelector("ambience-problem-flag")).toBeNull();
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

  test("category kebab Auto-triggers emits show-auto-triggers with the category id", async () => {
    const cats: SceneCategory[] = [{ id: "c1", name: "Cat one" }];
    el = await mount([{ name: "S", category: "c1", when: {}, actions: [] }], [], {}, cats);
    const detail = captureEvent(el, "show-auto-triggers");
    await pickCategoryKebab(el, "auto");
    expect(detail()).toEqual({ category: "c1" });
  });

  // --- collapsible category sections -----------------------------------------

  test("clicking a category header emits toggle-category-collapse with the category id", async () => {
    const category = { id: "g1", name: "Evening", color: "blue", icon: "" } as SceneCategory;
    el = await mount([{ ...movieScene, category: "g1" }], [], {}, [category]);
    const get = captureEvent(el, "toggle-category-collapse");
    const header = el.shadowRoot.querySelector(".category-section-header") as HTMLElement;
    header.click();
    expect(get()).toEqual({ categoryId: "g1" });
  });

  test("opening the category kebab does not toggle the section", async () => {
    const category = { id: "g1", name: "Evening", color: "blue", icon: "" } as SceneCategory;
    el = await mount([{ ...movieScene, category: "g1" }], [], {}, [category]);
    const get = captureEvent(el, "toggle-category-collapse");
    const kebab = el.shadowRoot.querySelector(
      ".category-section-header ambience-kebab-menu",
    ) as HTMLElement;
    // Click the kebab host itself (not its inner trigger) so the header's
    // stopPropagation wrapper is what's under test, not the kebab's own guard.
    kebab.click();
    await el.updateComplete;
    expect(get()).toBeUndefined();
  });

  test("a collapsed category hides its scenes and add button but keeps the header", async () => {
    const category = { id: "g1", name: "Evening", color: "blue", icon: "" } as SceneCategory;
    el = await mount([{ ...movieScene, category: "g1" }], [], {}, [category]);
    // Sanity: while expanded the row and its add button render.
    expect(el.shadowRoot.querySelectorAll("li").length).toBe(1);
    el.collapsedCategories = ["g1"];
    await el.updateComplete;
    const section = el.shadowRoot.querySelector(".category-section") as HTMLElement;
    expect(section.querySelector(".category-section-header")).toBeTruthy();
    expect(section.querySelectorAll("li").length).toBe(0);
    expect(section.querySelector(".add")).toBeNull();
  });

  test("the category header chevron reflects expanded/collapsed state", async () => {
    const category = { id: "g1", name: "Evening" } as SceneCategory;
    el = await mount([{ ...movieScene, category: "g1" }], [], {}, [category]);
    const chevron = () =>
      el.shadowRoot.querySelector(".category-section-header .category-chevron") as HTMLElement;
    expect(chevron().classList.contains("open")).toBe(true);
    el.collapsedCategories = ["g1"];
    await el.updateComplete;
    expect(chevron().classList.contains("open")).toBe(false);
  });

  test("collapsing one category leaves other categories' scenes visible", async () => {
    const groups = [
      { id: "a", name: "A" },
      { id: "b", name: "B" },
    ];
    const scenes = [
      { when: {}, actions: [], category: "a" },
      { when: {}, actions: [], category: "b" },
    ];
    el = await mount(scenes, [], {}, groups);
    el.collapsedCategories = ["a"];
    await el.updateComplete;
    const sectionFor = (name: string) =>
      Array.from(el.shadowRoot.querySelectorAll(".category-section")).find((s: any) =>
        s.querySelector(".category-section-header")!.textContent!.includes(name),
      ) as Element;
    expect(sectionFor("A").querySelectorAll("li").length).toBe(0);
    expect(sectionFor("B").querySelectorAll("li").length).toBe(1);
  });
});

describe("expanded-state reconciliation (review fix)", () => {
  test("changing the scenes prop clears index-keyed expansion state", async () => {
    const el: any = document.createElement("ambience-scenes-list");
    el.hass = {};
    el.scenes = [
      { name: "A", category: "g", when: {}, actions: [] },
      { name: "B", category: "g", when: {}, actions: [] },
      { name: "C", category: "g", when: {}, actions: [] },
    ];
    el.categories = [{ id: "g", name: "General" }];
    document.body.appendChild(el);
    await el.updateComplete;
    el._toggleScene(1);
    await el.updateComplete;
    expect(el._expanded.has(1)).toBe(true);
    // Delete scene 0: indices shift, so the stale entry would move the
    // expansion onto a different scene.
    el.scenes = el.scenes.slice(1);
    await el.updateComplete;
    expect(el._expanded.size).toBe(0);
    el.remove();
  });
});

// --- live dots ---

test("renders a solid live dot on the matched scene", async () => {
  const scenes = [
    { name: "Evening", category: "g", when: {}, actions: [] },
    { name: "Movie", category: "g", when: {}, actions: [] },
  ] as any;
  const el = await mount(scenes);
  el.scope = { kind: "area", id: "a" };
  el.live = new Map([
    [scopeCategoryKey({ kind: "area", id: "a" }, "g"), { matched: 0, applied: 0 }],
  ]);
  await el.updateComplete;

  expect(el.shadowRoot.querySelectorAll('ambience-live-dot[kind="matched"]').length).toBe(1);
  expect(el.shadowRoot.querySelectorAll('ambience-live-dot[kind="stale"]').length).toBe(0);
});

test("renders a stale dot on a diverged applied scene", async () => {
  const scenes = [
    { name: "Evening", category: "g", when: {}, actions: [] },
    { name: "Blocker", category: "g", when: {}, actions: [] },
  ] as any;
  const el = await mount(scenes);
  el.scope = { kind: "area", id: "a" };
  // Blocker (idx 1) currently matches; Evening (idx 0) is still applied.
  el.live = new Map([
    [scopeCategoryKey({ kind: "area", id: "a" }, "g"), { matched: 1, applied: 0 }],
  ]);
  await el.updateComplete;

  const rows = el.shadowRoot.querySelectorAll("li");
  expect(rows[1].querySelector('ambience-live-dot[kind="matched"]')).not.toBeNull();
  expect(rows[0].querySelector('ambience-live-dot[kind="stale"]')).not.toBeNull();
});

test("shows no dots when suppressed (switch off)", async () => {
  const scenes = [{ name: "Evening", category: "g", when: {}, actions: [] }] as any;
  const el = await mount(scenes);
  el.scope = { kind: "area", id: "a" };
  el.live = new Map([
    [scopeCategoryKey({ kind: "area", id: "a" }, "g"), { matched: 0, applied: 0 }],
  ]);
  el.liveSuppressed = true;
  await el.updateComplete;

  expect(el.shadowRoot.querySelectorAll("ambience-live-dot").length).toBe(0);
});

test("a scene's warning flag takes precedence over its live dot", async () => {
  // The dot shares the warn slot with the problem flag; a scene that is both the
  // live match AND has a problem shows the warning, not the dot.
  const scenes = [
    { name: "Evening", category: "g", when: {}, actions: [], missing_entities: ["light.ghost"] },
  ] as any;
  const el = await mount(scenes);
  el.scope = { kind: "area", id: "a" };
  el.live = new Map([
    [scopeCategoryKey({ kind: "area", id: "a" }, "g"), { matched: 0, applied: 0 }],
  ]);
  await el.updateComplete;

  expect(el.shadowRoot.querySelector("ambience-problem-flag")).not.toBeNull();
  expect(el.shadowRoot.querySelectorAll("ambience-live-dot").length).toBe(0);
});

describe("ambience-scenes-list — description", () => {
  let el: any;
  afterEach(() => el?.remove());

  const describedScene: Scene = {
    name: "Described",
    description: "Evening lights.\nWarm + dim.",
    when: { mode: "movie" },
    actions: [{ service: "light.turn_on", entity_ids: ["light.lamp"], params: {} }],
  };
  const plainScene: Scene = {
    name: "Plain",
    when: { mode: "movie" },
    actions: [{ service: "light.turn_on", entity_ids: ["light.lamp"], params: {} }],
  };

  test("renders a (?) help next to the name only when a description exists", async () => {
    el = await mount([describedScene]);
    const name = el.shadowRoot.querySelector(".name") as HTMLElement;
    expect(name.querySelector("ambience-help")).not.toBeNull();

    el.remove();
    el = await mount([plainScene]);
    const name2 = el.shadowRoot.querySelector(".name") as HTMLElement;
    expect(name2.querySelector("ambience-help")).toBeNull();
  });

  test("clicking the (?) does not expand the row", async () => {
    el = await mount([describedScene]);
    const help: any = el.shadowRoot.querySelector(".name ambience-help");
    (help.shadowRoot.querySelector('[data-test="help-trigger"]') as HTMLButtonElement).click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".scene-detail")).toBeFalsy();
    expect(help.shadowRoot.querySelector('[data-test="help-popover"]')).not.toBeNull();
  });

  test("shows the description inline when the row is expanded", async () => {
    el = await mount([describedScene]);
    expect(el.shadowRoot.querySelector(".scene-description")).toBeFalsy();
    (el.shadowRoot.querySelector(".name") as HTMLElement).click();
    await el.updateComplete;
    const inline = el.shadowRoot.querySelector(".scene-description") as HTMLElement;
    expect(inline).not.toBeNull();
    expect(inline.textContent).toContain("Evening lights.");
    expect(inline.textContent).toContain("Warm + dim.");
  });

  test("hides the (?) help when expanded (the description shows inline instead)", async () => {
    el = await mount([describedScene]);
    // Collapsed: the (?) is shown next to the name.
    expect(el.shadowRoot.querySelector(".name ambience-help")).not.toBeNull();
    // Expand the row.
    (el.shadowRoot.querySelector(".name") as HTMLElement).click();
    await el.updateComplete;
    // Expanded: the (?) is gone; the inline description takes over.
    expect(el.shadowRoot.querySelector(".name ambience-help")).toBeNull();
    expect(el.shadowRoot.querySelector(".scene-description")).not.toBeNull();
  });
});
