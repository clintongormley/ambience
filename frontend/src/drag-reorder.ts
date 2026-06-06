import type { ReactiveController, ReactiveControllerHost } from "lit";
import { deepElementFromPoint, startPointerDrag } from "./pointer-drag.js";

/** Locate the list index under a viewport point, or null if none. */
type Locate = (x: number, y: number) => number | null;

/**
 * Reactive controller for index-based drag-to-reorder of a flat list.
 *
 * Driven by Pointer Events (mouse + touch + pen) so it works on phones, where
 * the HTML5 native drag API never fires. The host renders a grab handle wired
 * to {@link start} on `pointerdown` and tags each list item with
 * `data-drag-index="<i>"`; the controller tracks the dragged source index
 * ({@link from}) and the current drop-target index ({@link over}), requesting a
 * re-render whenever either changes so the template can reflect `.drag-over` /
 * `.dragging` styling. On a valid drop it invokes the `onReorder(from, to)`
 * callback supplied by the host — the host decides what reordering *means*
 * (emit an event, splice + save, …).
 *
 * Wire it up in a template like:
 * ```ts
 *   private _drag = new DragReorderController(this, (from, to) => { ... });
 *
 *   html`<li
 *     data-drag-index=${i}
 *     class=${this._drag.over === i ? "drag-over" : ""}
 *   >
 *     <span class="drag-handle" style="touch-action:none"
 *       @pointerdown=${(e: PointerEvent) => this._drag.start(i, e)}>⠿</span>
 *   </li>`
 * ```
 */
export class DragReorderController implements ReactiveController {
  /** Index currently being dragged, or null when no drag is in progress. */
  from: number | null = null;
  /** Index currently hovered as the drop target, or null. */
  over: number | null = null;
  /**
   * True once the pointer has hovered a row other than the source during the
   * current/just-finished drag — i.e. a genuine reorder gesture rather than a
   * stationary tap. Reset at {@link start}, set in {@link _hover}, and
   * deliberately NOT cleared by {@link _reset}, so a handler running on the
   * trailing `click` (the browser still fires one after a pointer drag) can
   * distinguish "dragged" from "tapped" and suppress its tap action. */
  moved = false;

  private readonly _locate: Locate;
  /** Tears down the active pointer drag's listeners; null when idle. */
  private _cancelDrag: (() => void) | null = null;

  constructor(
    private readonly host: ReactiveControllerHost,
    private readonly onReorder: (from: number, to: number) => void,
    opts: { locate?: Locate } = {},
  ) {
    this._locate = opts.locate ?? ((x, y) => this._domLocate(x, y));
    host.addController(this);
  }

  hostDisconnected() {
    this._reset();
  }

  /**
   * Begin dragging item `i` from a grab handle's `pointerdown`. Captures the
   * pointer and tracks movement until release, hit-testing each move to update
   * the drop target.
   */
  start(i: number, e: PointerEvent) {
    // Only a primary pointer with the main (left/touch/pen) button starts a
    // drag — ignore right/middle clicks and secondary touches.
    if (!e.isPrimary || e.button > 0) return;
    // Tear down any drag still in flight (a lost pointerup, or a second
    // pointer) so its window listeners and lifted element can't leak.
    this._reset();
    // No preventDefault(): on touch that would also swallow a tap's `click`,
    // breaking buttons that share the handle area (e.g. the pin toggle).
    // Scroll-suppression is the handle's `touch-action: none` instead.
    this.from = i;
    this.moved = false;
    this.host.requestUpdate();
    // Drag the whole row/card under the pointer for feedback (its `[data-drag-index]`
    // element, the same marker the hit-test uses).
    const follow = (e.target as Element | null)?.closest("[data-drag-index]");
    this._cancelDrag = startPointerDrag(
      e,
      {
        onMove: (x, y) => this._hover(this._locate(x, y)),
        onEnd: (x, y) => this.drop(this._locate(x, y)),
        onCancel: () => this.end(),
      },
      { follow },
    );
  }

  /** Mark `i` as the current drop target (null, or the source itself, clears
   *  it). No-op while nothing is being dragged. */
  private _hover(i: number | null) {
    if (this.from === null) return;
    const next = i === null || i === this.from ? null : i;
    if (next !== null) this.moved = true;
    if (this.over !== next) {
      this.over = next;
      this.host.requestUpdate();
    }
  }

  /** Complete a drop on index `i`; fires onReorder for a genuine move. */
  drop(i: number | null) {
    const from = this.from;
    this._reset();
    if (from === null || i === null || from === i) return;
    this.onReorder(from, i);
  }

  /** Abandon the drag (pointercancel, or a drop outside any target). */
  end() {
    this._reset();
  }

  /** Default hit-test: the nearest `[data-drag-index]` ancestor of the element
   *  under the point, within the host's own shadow root. */
  private _domLocate(x: number, y: number): number | null {
    const root = (this.host as unknown as { renderRoot?: DocumentOrShadowRoot }).renderRoot;
    // Prefer the host's own shadow root so we only match THIS list's items; a
    // null hit (point over a gap) means "no item here", not "no layout" — only
    // fall back to a document-wide deep hit-test when there's no method at all
    // (jsdom), never when the method returned null.
    const el = root?.elementFromPoint ? root.elementFromPoint(x, y) : deepElementFromPoint(x, y);
    const item = el?.closest?.("[data-drag-index]");
    if (!item) return null;
    const idx = Number(item.getAttribute("data-drag-index"));
    return Number.isNaN(idx) ? null : idx;
  }

  private _reset() {
    this._cancelDrag?.();
    this._cancelDrag = null;
    const wasActive = this.from !== null || this.over !== null;
    this.from = null;
    this.over = null;
    if (wasActive) this.host.requestUpdate();
  }
}
