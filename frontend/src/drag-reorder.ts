import type { ReactiveController, ReactiveControllerHost } from "lit";

/**
 * Reactive controller for index-based drag-to-reorder of a flat list.
 *
 * Tracks the dragged source index ({@link from}) and the current drop-target
 * index ({@link over}), requesting a host re-render whenever either changes so
 * the host template can reflect `.drag-over` / `.dragging` styling. On a valid
 * drop it invokes the `onReorder(from, to)` callback supplied by the host — the
 * host decides what reordering *means* (emit an event, splice + save, …).
 *
 * Wire it up in a template like:
 * ```ts
 *   private _drag = new DragReorderController(this, (from, to) => { ... });
 *
 *   html`<li
 *     class=${this._drag.over === i ? "drag-over" : ""}
 *     draggable="true"
 *     @dragstart=${() => this._drag.start(i)}
 *     @dragover=${(e: DragEvent) => this._drag.dragOver(e, i)}
 *     @drop=${() => this._drag.drop(i)}
 *     @dragend=${() => this._drag.end()}
 *   >`
 * ```
 */
export class DragReorderController implements ReactiveController {
  /** Index currently being dragged, or null when no drag is in progress. */
  from: number | null = null;
  /** Index currently hovered as the drop target, or null. */
  over: number | null = null;

  constructor(
    private readonly host: ReactiveControllerHost,
    private readonly onReorder: (from: number, to: number) => void,
  ) {
    host.addController(this);
  }

  hostDisconnected() {
    this._reset();
  }

  /**
   * Begin dragging item `i`. Pass the originating event and an element to use
   * as the drag image — handy when the drag handle is a tiny glyph and you want
   * the browser to show the whole row/card being moved instead.
   */
  start(i: number, e?: DragEvent, dragImage?: HTMLElement | null) {
    this.from = i;
    if (e?.dataTransfer && dragImage) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setDragImage(dragImage, 16, 16);
    }
    this.host.requestUpdate();
  }

  /** Mark item `i` as the current drop target and allow the drop. No-op while
   *  nothing is being dragged or when hovering the source itself. */
  dragOver(e: DragEvent, i: number) {
    if (this.from === null || i === this.from) return;
    e.preventDefault(); // allow drop
    if (this.over !== i) {
      this.over = i;
      this.host.requestUpdate();
    }
  }

  /** Complete a drop on item `i`; fires onReorder for a genuine move. */
  drop(i: number) {
    const from = this.from;
    this._reset();
    if (from === null || from === i) return;
    this.onReorder(from, i);
  }

  /** Abandon the drag (Esc, or a drop outside any target). */
  end() {
    this._reset();
  }

  private _reset() {
    const wasActive = this.from !== null || this.over !== null;
    this.from = null;
    this.over = null;
    if (wasActive) this.host.requestUpdate();
  }
}
