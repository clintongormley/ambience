import type { ReactiveControllerHost } from "lit";
import { afterEach, describe, expect, test, vi } from "vitest";
import { DragReorderController } from "../frontend/src/drag-reorder";

/** Minimal ReactiveControllerHost that counts requestUpdate() calls and can
 *  carry a fake renderRoot for exercising the default DOM hit-test. */
function fakeHost(renderRoot?: unknown) {
  const host = {
    updates: 0,
    renderRoot,
    addController() {},
    removeController() {},
    requestUpdate() {
      host.updates++;
    },
    updateComplete: Promise.resolve(true),
  };
  return host as unknown as ReactiveControllerHost & { updates: number };
}

/** A stand-in primary pointerdown event. jsdom lacks setPointerCapture, so omit
 *  a target — the controller guards its absence. */
function pointerDown(pointerId = 1): PointerEvent {
  return new PointerEvent("pointerdown", { pointerId, isPrimary: true, button: 0 });
}

function firePointer(
  type: string,
  init: { pointerId?: number; clientX?: number; clientY?: number },
) {
  window.dispatchEvent(new PointerEvent(type, { bubbles: true, ...init }));
}

describe("DragReorderController", () => {
  // Each test starts a real pointer drag wired to window listeners; abandon any
  // in-flight drag so listeners can't bleed across tests.
  let active: DragReorderController | null = null;
  afterEach(() => {
    active?.end();
    active = null;
  });

  test("start records the source index and re-renders", () => {
    const host = fakeHost();
    const ctrl = new DragReorderController(host, vi.fn(), { locate: () => null });
    active = ctrl;

    ctrl.start(2, pointerDown());

    expect(ctrl.from).toBe(2);
    expect(ctrl.over).toBeNull();
    expect(host.updates).toBe(1);
  });

  test("pointer movement over another index marks it as the drop target", () => {
    const host = fakeHost();
    let at: number | null = null;
    const ctrl = new DragReorderController(host, vi.fn(), { locate: () => at });
    active = ctrl;
    ctrl.start(0, pointerDown());

    at = 2;
    firePointer("pointermove", { pointerId: 1, clientX: 5, clientY: 5 });

    expect(ctrl.over).toBe(2);
  });

  test("hovering the source index does not mark a drop target", () => {
    const host = fakeHost();
    const ctrl = new DragReorderController(host, vi.fn(), { locate: () => 1 });
    active = ctrl;
    ctrl.start(1, pointerDown());

    firePointer("pointermove", { pointerId: 1, clientX: 5, clientY: 5 });

    expect(ctrl.over).toBeNull();
  });

  test("hovering nothing droppable clears any previous target", () => {
    const host = fakeHost();
    let at: number | null = 3;
    const ctrl = new DragReorderController(host, vi.fn(), { locate: () => at });
    active = ctrl;
    ctrl.start(0, pointerDown());
    firePointer("pointermove", { pointerId: 1, clientX: 5, clientY: 5 });
    expect(ctrl.over).toBe(3);

    at = null;
    firePointer("pointermove", { pointerId: 1, clientX: 9, clientY: 9 });
    expect(ctrl.over).toBeNull();
  });

  test("releasing over a target reorders from→to and clears state", () => {
    const host = fakeHost();
    const onReorder = vi.fn();
    const ctrl = new DragReorderController(host, onReorder, { locate: () => 3 });
    active = ctrl;
    ctrl.start(0, pointerDown());

    firePointer("pointerup", { pointerId: 1, clientX: 5, clientY: 5 });

    expect(onReorder).toHaveBeenCalledWith(0, 3);
    expect(ctrl.from).toBeNull();
    expect(ctrl.over).toBeNull();
  });

  test("releasing over the source index does not reorder", () => {
    const host = fakeHost();
    const onReorder = vi.fn();
    const ctrl = new DragReorderController(host, onReorder, { locate: () => 2 });
    active = ctrl;
    ctrl.start(2, pointerDown());

    firePointer("pointerup", { pointerId: 1, clientX: 5, clientY: 5 });

    expect(onReorder).not.toHaveBeenCalled();
    expect(ctrl.from).toBeNull();
  });

  test("releasing over nothing droppable does not reorder", () => {
    const host = fakeHost();
    const onReorder = vi.fn();
    const ctrl = new DragReorderController(host, onReorder, { locate: () => null });
    active = ctrl;
    ctrl.start(1, pointerDown());

    firePointer("pointerup", { pointerId: 1, clientX: 5, clientY: 5 });

    expect(onReorder).not.toHaveBeenCalled();
    expect(ctrl.from).toBeNull();
  });

  test("pointercancel abandons the drag without reordering", () => {
    const host = fakeHost();
    const onReorder = vi.fn();
    const ctrl = new DragReorderController(host, onReorder, { locate: () => 2 });
    active = ctrl;
    ctrl.start(1, pointerDown());

    firePointer("pointercancel", { pointerId: 1 });

    expect(onReorder).not.toHaveBeenCalled();
    expect(ctrl.from).toBeNull();
    expect(ctrl.over).toBeNull();
  });

  test("hostDisconnected clears in-flight drag state and detaches listeners", () => {
    const host = fakeHost();
    const onReorder = vi.fn();
    const ctrl = new DragReorderController(host, onReorder, { locate: () => 2 });
    active = ctrl;
    ctrl.start(1, pointerDown());

    ctrl.hostDisconnected();
    expect(ctrl.from).toBeNull();
    expect(ctrl.over).toBeNull();

    // A late pointerup must not resurrect the drag.
    firePointer("pointerup", { pointerId: 1, clientX: 5, clientY: 5 });
    expect(onReorder).not.toHaveBeenCalled();
  });

  test("a non-primary pointer (second touch) does not start a drag", () => {
    const host = fakeHost();
    const ctrl = new DragReorderController(host, vi.fn(), { locate: () => 2 });
    active = ctrl;

    ctrl.start(0, new PointerEvent("pointerdown", { pointerId: 2, isPrimary: false }));

    expect(ctrl.from).toBeNull();
  });

  test("a secondary mouse button does not start a drag", () => {
    const host = fakeHost();
    const ctrl = new DragReorderController(host, vi.fn(), { locate: () => 2 });
    active = ctrl;

    ctrl.start(0, new PointerEvent("pointerdown", { pointerId: 1, isPrimary: true, button: 2 }));

    expect(ctrl.from).toBeNull();
  });

  test("starting a new drag tears down a previous in-flight one (no leaked listeners, single reorder)", () => {
    const host = fakeHost();
    const onReorder = vi.fn();
    const ctrl = new DragReorderController(host, onReorder, { locate: () => 2 });
    active = ctrl;

    ctrl.start(0, pointerDown()); // first drag, never released
    ctrl.start(1, pointerDown()); // second drag supersedes it
    firePointer("pointerup", { pointerId: 1, clientX: 5, clientY: 5 });

    // The first drag's listeners were detached, so only the second drop fires.
    expect(onReorder).toHaveBeenCalledTimes(1);
    expect(onReorder).toHaveBeenCalledWith(1, 2);
  });

  test("default hit-test ignores a null hit instead of falling through to the document", () => {
    // elementFromPoint EXISTS but returns null (point over a gap) — must yield
    // no target, never a document-wide deep hit-test that could match another list.
    const renderRoot = { elementFromPoint: (_x: number, _y: number) => null };
    const host = fakeHost(renderRoot);
    const ctrl = new DragReorderController(host, vi.fn());
    active = ctrl;
    ctrl.start(0, pointerDown());

    firePointer("pointermove", { pointerId: 1, clientX: 5, clientY: 5 });

    expect(ctrl.over).toBeNull();
  });

  // --- default DOM hit-test (no injected locate) ---

  test("default hit-test maps the point to the nearest [data-drag-index]", () => {
    const item = {
      getAttribute: (n: string) => (n === "data-drag-index" ? "4" : null),
    };
    const hit = { closest: (sel: string) => (sel === "[data-drag-index]" ? item : null) };
    const renderRoot = { elementFromPoint: (_x: number, _y: number) => hit };
    const host = fakeHost(renderRoot);
    const ctrl = new DragReorderController(host, vi.fn());
    active = ctrl;
    ctrl.start(0, pointerDown());

    firePointer("pointermove", { pointerId: 1, clientX: 5, clientY: 5 });

    expect(ctrl.over).toBe(4);
  });

  test("default hit-test yields no target when the point hits no item", () => {
    const renderRoot = { elementFromPoint: () => ({ closest: () => null }) };
    const host = fakeHost(renderRoot);
    const ctrl = new DragReorderController(host, vi.fn());
    active = ctrl;
    ctrl.start(0, pointerDown());

    firePointer("pointermove", { pointerId: 1, clientX: 5, clientY: 5 });

    expect(ctrl.over).toBeNull();
  });
});
