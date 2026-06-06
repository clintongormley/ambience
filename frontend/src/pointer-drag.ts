/**
 * Pointer-driven drag primitives.
 *
 * The HTML5 native drag-and-drop API (`draggable` + `dragstart`/`drop`) is
 * never dispatched for touch input on mobile browsers, so every drag surface
 * built on it is dead on a phone. These helpers drive dragging with Pointer
 * Events instead, which unify mouse, touch and pen — the one mechanism that
 * works everywhere.
 */

export interface PointerDragCallbacks {
  /** Pointer moved to viewport coordinates (x, y). */
  onMove(x: number, y: number): void;
  /** Pointer released at (x, y) — commit the drop. */
  onEnd(x: number, y: number): void;
  /** Drag aborted (pointercancel, e.g. the OS hijacked the gesture). */
  onCancel(): void;
}

export interface PointerDragOptions {
  /**
   * Element to drag under the pointer for visual feedback (the equivalent of
   * native DnD's drag image). It's translated to track the pointer and made
   * `pointer-events: none` so the hit-test sees the element *beneath* it; the
   * drag styles are cleared automatically when the drag ends.
   */
  follow?: Element | null;
}

/** Apply the *mechanism* styles to a {@link PointerDragOptions.follow} element:
 *  make it transparent to the hit-test (so elementFromPoint reaches the drop
 *  target beneath) and hint the compositor for the per-move transform. The
 *  *visual* lift — opacity, shadow, and the stacking (`position`/`z-index`,
 *  which only the surface knows how to place safely in its own stacking
 *  context) — is left to each surface's `.dragging` rule. Returns a closure
 *  that clears the styles again (including the per-move `transform`). */
function liftFollow(el: HTMLElement): () => void {
  el.style.pointerEvents = "none"; // let elementFromPoint reach the drop target
  el.style.willChange = "transform";
  return () => {
    el.style.pointerEvents = "";
    el.style.willChange = "";
    el.style.transform = "";
  };
}

/**
 * Begin a pointer-driven drag from a `pointerdown` event. Wires window-level
 * pointermove/up/cancel listeners scoped to this pointer's id and tears them
 * down automatically on up/cancel.
 *
 * Touch implicitly captures the pointer to the `pointerdown` target, so sibling
 * elements never see the move — callers must hit-test with
 * {@link deepElementFromPoint} rather than relying on enter/over events.
 *
 * Pass `opts.follow` to drag a real element under the pointer for feedback (the
 * stand-in for native DnD's drag image).
 *
 * Returns a canceller that detaches the listeners without firing any callback,
 * for a host that needs to abandon the drag early (e.g. it disconnects).
 */
export function startPointerDrag(
  e: PointerEvent,
  cb: PointerDragCallbacks,
  opts: PointerDragOptions = {},
): () => void {
  const id = e.pointerId;
  // Make the (implicit-on-touch) capture explicit for mouse/pen too. Guarded:
  // jsdom — and some elements — don't implement setPointerCapture.
  try {
    (e.target as Element | null)?.setPointerCapture?.(id);
  } catch {
    /* capture is a nicety, not a requirement */
  }

  const follow = (opts.follow as HTMLElement | null) ?? null;
  const startX = e.clientX;
  const startY = e.clientY;
  const resetFollow = follow ? liftFollow(follow) : null;

  const onMove = (ev: PointerEvent) => {
    if (ev.pointerId !== id) return;
    // Hit-test on the settled layout FIRST, then move the follow element — a
    // transform write before the elementFromPoint read would force a sync
    // reflow every move. (The follow is pointer-events:none, so its position
    // never affects the hit-test result.)
    cb.onMove(ev.clientX, ev.clientY);
    if (follow)
      follow.style.transform = `translate(${ev.clientX - startX}px, ${ev.clientY - startY}px)`;
  };
  const onUp = (ev: PointerEvent) => {
    if (ev.pointerId !== id) return;
    cleanup();
    cb.onEnd(ev.clientX, ev.clientY);
  };
  const onCancel = (ev: PointerEvent) => {
    if (ev.pointerId !== id) return;
    cleanup();
    cb.onCancel();
  };
  const cleanup = () => {
    window.removeEventListener("pointermove", onMove, true);
    window.removeEventListener("pointerup", onUp, true);
    window.removeEventListener("pointercancel", onCancel, true);
    resetFollow?.();
  };

  window.addEventListener("pointermove", onMove, true);
  window.addEventListener("pointerup", onUp, true);
  window.addEventListener("pointercancel", onCancel, true);

  return cleanup;
}

/**
 * Hit-test at viewport coordinates, piercing nested shadow roots to return the
 * deepest element actually under the point. `document.elementFromPoint` stops
 * at a shadow host; we recurse into each host's shadow root to reach the real
 * target. Returns null in environments without layout (e.g. jsdom).
 */
export function deepElementFromPoint(x: number, y: number): Element | null {
  let el = document.elementFromPoint?.(x, y) ?? null;
  if (!el) return null;
  while (el.shadowRoot) {
    const inner = el.shadowRoot.elementFromPoint?.(x, y);
    if (!inner || inner === el) break;
    el = inner;
  }
  return el;
}
