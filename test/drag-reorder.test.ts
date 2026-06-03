import type { ReactiveControllerHost } from "lit";
import { describe, expect, test, vi } from "vitest";
import { DragReorderController } from "../frontend/src/drag-reorder";

/** Minimal ReactiveControllerHost that counts requestUpdate() calls. */
function fakeHost() {
  const host = {
    updates: 0,
    addController() {},
    removeController() {},
    requestUpdate() {
      host.updates++;
    },
    updateComplete: Promise.resolve(true),
  };
  return host as unknown as ReactiveControllerHost & { updates: number };
}

/** A stand-in DragEvent — jsdom has no real DragEvent/DataTransfer. */
function dragEvent() {
  return {
    prevented: false,
    preventDefault() {
      (this as { prevented: boolean }).prevented = true;
    },
    dataTransfer: { effectAllowed: "", setDragImage: vi.fn() },
  } as unknown as DragEvent & {
    prevented: boolean;
    dataTransfer: { effectAllowed: string; setDragImage: ReturnType<typeof vi.fn> };
  };
}

describe("DragReorderController", () => {
  test("start records the source index and re-renders", () => {
    const host = fakeHost();
    const ctrl = new DragReorderController(host, vi.fn());

    ctrl.start(2);

    expect(ctrl.from).toBe(2);
    expect(ctrl.over).toBeNull();
    expect(host.updates).toBe(1);
  });

  test("start sets a custom drag image when given an event and element", () => {
    const host = fakeHost();
    const ctrl = new DragReorderController(host, vi.fn());
    const e = dragEvent();
    const img = {} as HTMLElement;

    ctrl.start(1, e, img);

    expect(e.dataTransfer.effectAllowed).toBe("move");
    expect(e.dataTransfer.setDragImage).toHaveBeenCalledWith(img, 16, 16);
  });

  test("start without a drag image leaves dataTransfer untouched", () => {
    const host = fakeHost();
    const ctrl = new DragReorderController(host, vi.fn());
    const e = dragEvent();

    ctrl.start(0, e, null);

    expect(e.dataTransfer.setDragImage).not.toHaveBeenCalled();
  });

  test("dragOver marks the hovered index and allows the drop", () => {
    const host = fakeHost();
    const ctrl = new DragReorderController(host, vi.fn());
    ctrl.start(0);
    const e = dragEvent();

    ctrl.dragOver(e, 2);

    expect(ctrl.over).toBe(2);
    expect((e as unknown as { prevented: boolean }).prevented).toBe(true);
  });

  test("dragOver on the source index is ignored", () => {
    const host = fakeHost();
    const ctrl = new DragReorderController(host, vi.fn());
    ctrl.start(1);
    const e = dragEvent();

    ctrl.dragOver(e, 1);

    expect(ctrl.over).toBeNull();
    expect((e as unknown as { prevented: boolean }).prevented).toBe(false);
  });

  test("dragOver before any drag has started is ignored", () => {
    const host = fakeHost();
    const ctrl = new DragReorderController(host, vi.fn());
    const e = dragEvent();

    ctrl.dragOver(e, 2);

    expect(ctrl.over).toBeNull();
    expect((e as unknown as { prevented: boolean }).prevented).toBe(false);
  });

  test("drop reorders from→to and clears state", () => {
    const host = fakeHost();
    const onReorder = vi.fn();
    const ctrl = new DragReorderController(host, onReorder);
    ctrl.start(0);
    ctrl.dragOver(dragEvent(), 3);

    ctrl.drop(3);

    expect(onReorder).toHaveBeenCalledWith(0, 3);
    expect(ctrl.from).toBeNull();
    expect(ctrl.over).toBeNull();
  });

  test("drop on the source index does not reorder", () => {
    const host = fakeHost();
    const onReorder = vi.fn();
    const ctrl = new DragReorderController(host, onReorder);
    ctrl.start(2);

    ctrl.drop(2);

    expect(onReorder).not.toHaveBeenCalled();
    expect(ctrl.from).toBeNull();
  });

  test("drop without an active drag does nothing", () => {
    const host = fakeHost();
    const onReorder = vi.fn();
    const ctrl = new DragReorderController(host, onReorder);

    ctrl.drop(1);

    expect(onReorder).not.toHaveBeenCalled();
  });

  test("end abandons the drag without reordering", () => {
    const host = fakeHost();
    const onReorder = vi.fn();
    const ctrl = new DragReorderController(host, onReorder);
    ctrl.start(1);
    ctrl.dragOver(dragEvent(), 2);

    ctrl.end();

    expect(onReorder).not.toHaveBeenCalled();
    expect(ctrl.from).toBeNull();
    expect(ctrl.over).toBeNull();
  });

  test("hostDisconnected clears any in-flight drag state", () => {
    const host = fakeHost();
    const ctrl = new DragReorderController(host, vi.fn());
    ctrl.start(1);
    ctrl.dragOver(dragEvent(), 2);

    ctrl.hostDisconnected();

    expect(ctrl.from).toBeNull();
    expect(ctrl.over).toBeNull();
  });
});
