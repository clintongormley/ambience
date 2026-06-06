import { afterEach, describe, expect, test, vi } from "vitest";
import { deepElementFromPoint, startPointerDrag } from "../frontend/src/pointer-drag";

/** Dispatch a window-level pointer event of the given type. jsdom constructs
 *  PointerEvent (pointerId/clientX/clientY survive), so we can drive the helper
 *  exactly as a real browser would. */
function firePointer(
  type: string,
  init: { pointerId?: number; clientX?: number; clientY?: number },
) {
  window.dispatchEvent(new PointerEvent(type, { bubbles: true, ...init }));
}

describe("startPointerDrag", () => {
  test("forwards pointermove coordinates for the originating pointer", () => {
    const onMove = vi.fn();
    const down = new PointerEvent("pointerdown", { pointerId: 1, clientX: 0, clientY: 0 });
    startPointerDrag(down, { onMove, onEnd: vi.fn(), onCancel: vi.fn() });

    firePointer("pointermove", { pointerId: 1, clientX: 30, clientY: 40 });

    expect(onMove).toHaveBeenCalledWith(30, 40);
  });

  test("ignores events from a different pointerId", () => {
    const onMove = vi.fn();
    const onEnd = vi.fn();
    const down = new PointerEvent("pointerdown", { pointerId: 1 });
    startPointerDrag(down, { onMove, onEnd, onCancel: vi.fn() });

    firePointer("pointermove", { pointerId: 2, clientX: 5, clientY: 5 });
    firePointer("pointerup", { pointerId: 2 });

    expect(onMove).not.toHaveBeenCalled();
    expect(onEnd).not.toHaveBeenCalled();
  });

  test("pointerup ends the drag with the final coordinates and detaches listeners", () => {
    const onMove = vi.fn();
    const onEnd = vi.fn();
    const down = new PointerEvent("pointerdown", { pointerId: 1 });
    startPointerDrag(down, { onMove, onEnd, onCancel: vi.fn() });

    firePointer("pointerup", { pointerId: 1, clientX: 7, clientY: 9 });
    expect(onEnd).toHaveBeenCalledWith(7, 9);

    // Listeners gone: a later move must not fire onMove.
    firePointer("pointermove", { pointerId: 1, clientX: 1, clientY: 1 });
    expect(onMove).not.toHaveBeenCalled();
  });

  test("pointercancel aborts the drag and detaches listeners", () => {
    const onCancel = vi.fn();
    const onMove = vi.fn();
    const down = new PointerEvent("pointerdown", { pointerId: 1 });
    startPointerDrag(down, { onMove, onEnd: vi.fn(), onCancel });

    firePointer("pointercancel", { pointerId: 1 });
    expect(onCancel).toHaveBeenCalledTimes(1);

    firePointer("pointermove", { pointerId: 1, clientX: 1, clientY: 1 });
    expect(onMove).not.toHaveBeenCalled();
  });

  test("the returned canceller detaches listeners without firing callbacks", () => {
    const onMove = vi.fn();
    const onEnd = vi.fn();
    const onCancel = vi.fn();
    const down = new PointerEvent("pointerdown", { pointerId: 1 });
    const cancel = startPointerDrag(down, { onMove, onEnd, onCancel });

    cancel();

    firePointer("pointermove", { pointerId: 1, clientX: 2, clientY: 2 });
    firePointer("pointerup", { pointerId: 1 });
    expect(onMove).not.toHaveBeenCalled();
    expect(onEnd).not.toHaveBeenCalled();
    expect(onCancel).not.toHaveBeenCalled();
  });

  test("a follow element tracks the pointer via transform and is neutralised for hit-testing", () => {
    const follow = document.createElement("div");
    document.body.appendChild(follow);
    const down = new PointerEvent("pointerdown", { pointerId: 1, clientX: 10, clientY: 20 });

    startPointerDrag(down, { onMove: vi.fn(), onEnd: vi.fn(), onCancel: vi.fn() }, { follow });
    // Lifted out of the way of the hit-test so elementFromPoint sees what's beneath.
    expect(follow.style.pointerEvents).toBe("none");

    firePointer("pointermove", { pointerId: 1, clientX: 35, clientY: 60 });
    expect(follow.style.transform).toBe("translate(25px, 40px)");

    follow.remove();
  });

  test("the follow element's drag styles are cleared when the drag ends", () => {
    const follow = document.createElement("div");
    document.body.appendChild(follow);
    const down = new PointerEvent("pointerdown", { pointerId: 1, clientX: 0, clientY: 0 });

    startPointerDrag(down, { onMove: vi.fn(), onEnd: vi.fn(), onCancel: vi.fn() }, { follow });
    firePointer("pointermove", { pointerId: 1, clientX: 5, clientY: 5 });
    firePointer("pointerup", { pointerId: 1, clientX: 5, clientY: 5 });

    expect(follow.style.transform).toBe("");
    expect(follow.style.pointerEvents).toBe("");
    follow.remove();
  });

  test("the follow element is reset on pointercancel too", () => {
    const follow = document.createElement("div");
    document.body.appendChild(follow);
    const down = new PointerEvent("pointerdown", { pointerId: 1, clientX: 0, clientY: 0 });

    startPointerDrag(down, { onMove: vi.fn(), onEnd: vi.fn(), onCancel: vi.fn() }, { follow });
    firePointer("pointercancel", { pointerId: 1 });

    expect(follow.style.transform).toBe("");
    follow.remove();
  });

  test("captures the pointer on its target when supported, ignoring its absence", () => {
    const setPointerCapture = vi.fn();
    const target = { setPointerCapture } as unknown as Element;
    const down = new PointerEvent("pointerdown", { pointerId: 3 });
    Object.defineProperty(down, "target", { value: target });

    expect(() =>
      startPointerDrag(down, { onMove: vi.fn(), onEnd: vi.fn(), onCancel: vi.fn() }),
    ).not.toThrow();
    expect(setPointerCapture).toHaveBeenCalledWith(3);
  });
});

describe("deepElementFromPoint", () => {
  const original = Object.getOwnPropertyDescriptor(Document.prototype, "elementFromPoint");
  afterEach(() => {
    if (original) Object.defineProperty(Document.prototype, "elementFromPoint", original);
    else delete (Document.prototype as unknown as Record<string, unknown>).elementFromPoint;
  });

  test("returns null when the environment lacks elementFromPoint", () => {
    // jsdom does not implement elementFromPoint — the helper must degrade safely.
    expect(deepElementFromPoint(10, 10)).toBeNull();
  });

  test("pierces nested shadow roots to find the deepest element at the point", () => {
    // Build host → shadow(child) → shadow(grandchild) and stub elementFromPoint
    // at each level to model a real browser's hit-test.
    const host = document.createElement("div");
    const child = document.createElement("div");
    const grandchild = document.createElement("div");
    const hostShadow = host.attachShadow({ mode: "open" });
    const childShadow = child.attachShadow({ mode: "open" });
    hostShadow.appendChild(child);
    childShadow.appendChild(grandchild);

    Object.defineProperty(Document.prototype, "elementFromPoint", {
      configurable: true,
      value: () => host,
    });
    (hostShadow as unknown as { elementFromPoint: () => Element }).elementFromPoint = () => child;
    (childShadow as unknown as { elementFromPoint: () => Element }).elementFromPoint = () =>
      grandchild;

    expect(deepElementFromPoint(1, 1)).toBe(grandchild);
  });
});
