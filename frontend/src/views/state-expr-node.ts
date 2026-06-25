import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

import "./state-expr-atom.js";
import type { HassConnection } from "../api.js";
import { localize, stateOpLabel } from "../i18n.js";
import { summariseState } from "../summary.js";
import type { DropPos, StateAtom, StateExpr, StateGroup, StateNot } from "../types.js";

function _samePath(a: number[] | null, b: number[] | null): boolean {
  if (a === null || b === null) return false;
  if (a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
}

/**
 * Recursive node renderer. Atoms render as <ambience-state-expr-atom>; groups
 * render a header (and/or switch) + each child wrapped in a child-row with
 * NOT/wrap/remove buttons + an "Add clause" button. Mutations bubble up
 * as `node-*` events tagged with `path: number[]`; the root component
 * (state-predicate-input) applies them via a single `_patch` helper.
 */
@customElement("ambience-state-expr-node")
export class AmbienceStateExprNode extends LitElement {
  static override styles = css`
    :host { display: block; }
    .group {
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      padding: 0.4rem; margin: 0.25rem 0;
      background: var(--secondary-background-color, transparent);
    }
    .group-header {
      display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem;
      font-weight: 500;
    }
    .group-op {
      padding: 0.15rem 0.5rem; border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px; background: var(--card-background-color, #fff);
      color: inherit;
    }
    /* Nested groups no longer indent — the bordered card already conveys
       hierarchy. This keeps the form full-width regardless of depth. */
    .group-children { display: flex; flex-direction: column; gap: 0.25rem; }
    .actions button {
      background: transparent; border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px; padding: 0.15rem 0.4rem; cursor: pointer;
      font-size: 0.85em; color: inherit;
    }
    .actions { display: flex; gap: 0.25rem; margin-top: 0.5rem; }

    .atom-card {
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
    }
    .atom-header {
      display: flex; align-items: center; gap: 0.5rem;
      padding: 0.4rem 0.6rem; cursor: pointer; user-select: none;
    }
    .atom-card.expanded .atom-header { border-bottom: 1px solid var(--divider-color, #eee); }
    .atom-card.collapsed .atom-header:hover {
      background: var(--secondary-background-color, #f5f5f5);
    }
    .atom-header .summary {
      flex: 1; min-width: 0;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .atom-header .summary.placeholder {
      color: var(--secondary-text-color, #888); font-style: italic;
    }
    .atom-header .remove {
      background: none; border: none; color: var(--secondary-text-color, #888);
      cursor: pointer; font-size: 1em; padding: 0 0.25rem;
    }
    .atom-header .not-toggle,
    .atom-header .wrap,
    .group-header .not-toggle,
    .group-header .wrap,
    .group-header .unwrap {
      background: transparent; border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px; padding: 0.1rem 0.35rem; cursor: pointer;
      font-size: 0.85em; color: inherit;
    }
    /* When NOT is OFF it's a quiet, low-contrast affordance — the
       border fades into the card and the label uses secondary text
       colour so it doesn't compete with the summary. */
    .atom-header .not-toggle,
    .group-header .not-toggle {
      border-color: transparent;
      color: var(--secondary-text-color, #888);
      opacity: 0.6;
    }
    .atom-header .not-toggle:hover,
    .group-header .not-toggle:hover {
      opacity: 1;
      border-color: var(--divider-color, #ccc);
    }
    /* Active state is loud — the negation is in effect, the user should
       see it at a glance. */
    .atom-header .not-toggle.on,
    .group-header .not-toggle.on {
      background: var(--warning-color, #ffd);
      border-color: var(--warning-color, #cc9);
      color: inherit;
      opacity: 1;
      font-weight: 600;
    }
    .group-header .unwrap {
      margin-left: auto;
      border: none; background: none; padding: 0 0.25rem;
      color: var(--secondary-text-color, #888); font-size: 1em;
    }
    .atom-body { padding: 0.5rem 0.75rem; }
    /* Drag-over highlight — applied to either an atom card or a group
       card. The active outline overrides the default border so the drop
       target is unmistakable. */
    .atom-card.drag-over,
    .group.drag-over {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: -2px;
    }
    /* Insertion line for a before/after (sibling) drop — a thin bar with a
       leading dot, drawn just above/below the node. */
    .drop-line { position: relative; height: 0; margin: 1px 0; }
    .drop-line::before {
      content: ""; position: absolute; left: 0; right: 0; top: -1px;
      height: 3px; border-radius: 2px; background: var(--primary-color, #03a9f4);
    }
    .drop-line::after {
      content: ""; position: absolute; left: -2px; top: -3px;
      width: 7px; height: 7px; border-radius: 50%;
      background: var(--primary-color, #03a9f4);
    }
    /* The node currently being dragged lifts (solid, with a shadow) as it
       tracks the pointer — matching the scene/action lists' dragged-item
       treatment. */
    .atom-card.dragging,
    .group.dragging {
      opacity: 0.8; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
      position: relative; z-index: 1000;
    }
    /* The drag handle (⠿) is the only grabbable part of a row. Pointer
       Events drive the drag (so it works on touch, unlike native HTML5
       DnD); touch-action:none stops the browser panning when a drag
       begins on a touchscreen, while the rest of the header still scrolls
       and clicks normally. */
    .drag-handle {
      flex: 0 0 auto;
      cursor: grab;
      touch-action: none;
      user-select: none;
      color: var(--secondary-text-color, #888);
      font-size: 1em; line-height: 1;
    }
    .drag-handle:active { cursor: grabbing; }
    .atom-error {
      margin-top: 0.5rem;
      color: var(--error-color, #b71c1c);
      font-size: 0.9em;
    }
  `;

  @property({ attribute: false }) hass?: HassConnection;
  @property({ attribute: false }) value!: StateExpr;
  /** Path of this node from the root. The root passes []. */
  @property({ attribute: false }) path: number[] = [];
  /** Path of the node the pointer is currently hovering as a drop target
   *  during a drag, owned and set by the root (state-predicate-input) and
   *  threaded down the tree. When it equals this node's path, this card
   *  renders the .drag-over highlight. */
  @property({ attribute: false }) dragOverPath: number[] | null = null;
  /** Which zone of the drop-target node the pointer is in (set by the root):
   *  `into` outlines the card, `before`/`after` draw an insertion line. */
  @property({ attribute: false }) dragOverPos: DropPos | null = null;
  /** Path of the node currently being dragged (set by the root). When it
   *  equals this node's path, the card dims to show it's the one moving. */
  @property({ attribute: false }) dragFromPath: number[] | null = null;
  /** Path of the currently-open atom (set by the root). When this node is
   *  an atom and its path matches, it renders expanded. Incomplete atoms
   *  render expanded regardless. */
  @property({ attribute: false }) openPath: number[] | null = null;
  /** Path of an atom that currently has a surfaced validation error.
   *  Combined with `errorMessage`, this drives the inline error display. */
  @property({ attribute: false }) errorPath: number[] | null = null;
  @property({ attribute: false }) errorMessage: string | null = null;

  private _emit(name: string, detail: Record<string, unknown> = {}) {
    this.dispatchEvent(
      new CustomEvent(name, {
        detail: { path: this.path, ...detail },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _atomIsComplete(atom: StateAtom): boolean {
    return Boolean(atom.entity_id) && atom.states.some((s) => s !== "");
  }

  private _isErrorTarget(): boolean {
    return _samePath(this.path, this.errorPath);
  }

  // --- drag-and-drop ----------------------------------------------------

  /** True when the pointer is hovering THIS node as the drop target. */
  private _isDropTarget(): boolean {
    return _samePath(this.path, this.dragOverPath);
  }

  /** The drop zone for THIS node during a drag, or null when it isn't the
   *  target. `into` highlights the card outline; `before`/`after` draw an
   *  insertion line above/below it. */
  private _dropPos(): DropPos | null {
    return this._isDropTarget() ? this.dragOverPos : null;
  }

  /** True while THIS node is the one being dragged. */
  private _isDragging(): boolean {
    return _samePath(this.path, this.dragFromPath);
  }

  /** Begin a drag from the grab handle. The root (state-predicate-input)
   *  runs the actual Pointer-Events drag — hit-testing, highlighting and
   *  the move — so all this node does is announce its path and hand over
   *  the originating pointer event. */
  private _onDragHandleDown(e: PointerEvent) {
    if (this.path.length === 0) return; // root can't be moved
    // Only a primary pointer with the main button drags — ignore right/middle
    // clicks and secondary touches.
    if (!e.isPrimary || e.button > 0) return;
    e.stopPropagation();
    this.dispatchEvent(
      new CustomEvent("node-drag-start", {
        detail: { path: this.path, pointer: e },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /** The ⠿ grab handle, shown on every node except the root (which has no
   *  parent to be moved within). */
  private _dragHandle() {
    if (this.path.length === 0) return "";
    return html`<span
      class="drag-handle"
      title=${localize(this.hass, "ui.drag_to_reorder", "Drag to reorder")}
      @pointerdown=${this._onDragHandleDown}
      @click=${(e: Event) => e.stopPropagation()}
      >⠿</span
    >`;
  }

  /** The NOT toggle shared by atoms and groups — both own it in their card
   *  header (an atom before its summary, a group before its AND/OR select).
   *  `e.stopPropagation()` matters on the atom (its header click opens the
   *  atom) and is harmless on the group (its header isn't clickable), so a
   *  single button serves both and the two can't drift apart. */
  private _notToggle(isNot: boolean) {
    return html`<button class="not-toggle ${isNot ? "on" : ""}"
      title=${localize(this.hass, "ui.state_not_toggle", "Negate (NOT)")}
      @click=${(e: Event) => {
        e.stopPropagation();
        this._emit("node-toggle-not");
      }}>${stateOpLabel(this.hass, "not")}</button>`;
  }

  private _renderAtomCard(atom: StateAtom, isNot: boolean) {
    const isComplete = this._atomIsComplete(atom);
    const expanded = _samePath(this.path, this.openPath);
    const summary = isComplete
      ? summariseState(atom, { hass: this.hass })
      : localize(this.hass, "ui.state_new_condition", "(new condition)");
    return html`
      <div class="atom-card ${expanded ? "expanded" : "collapsed"} ${this._dropPos() === "into" ? "drag-over" : ""} ${this._isDragging() ? "dragging" : ""}">
        <div class="atom-header"
          @click=${() => this._emit("node-open")}>
          ${this._dragHandle()}
          ${this._notToggle(isNot)}
          <span class="summary ${isComplete ? "" : "placeholder"}">${summary}</span>
          <button class="wrap"
            title=${localize(this.hass, "ui.state_wrap", "Wrap in group")}
            @click=${(e: Event) => {
              e.stopPropagation();
              this._emit("node-wrap");
            }}>(…)</button>
          <button class="remove"
            title=${localize(this.hass, "ui.remove", "Remove")}
            @click=${(e: Event) => {
              e.stopPropagation();
              this._emit("node-remove");
            }}>✕</button>
        </div>
        ${
          expanded
            ? html`
          <div class="atom-body">
            <ambience-state-expr-atom
              .hass=${this.hass}
              .value=${atom}
              @value-changed=${(e: CustomEvent<{ value: StateAtom }>) => {
                e.stopPropagation();
                // The editor emits the bare inner atom; re-wrap it in NOT so an
                // edit doesn't silently drop the node's negation.
                const edited = e.detail.value;
                const value: StateExpr = isNot ? { kind: "not", item: edited } : edited;
                this._emit("node-change", { value });
              }}
            ></ambience-state-expr-atom>
            ${
              this._isErrorTarget() && this.errorMessage
                ? html`<div class="atom-error">${this.errorMessage}</div>`
                : ""
            }
          </div>
        `
            : ""
        }
      </div>
    `;
  }

  private _renderChildRow(child: StateExpr, index: number) {
    // No external toolbar — the child node owns its own NOT/wrap/remove
    // controls in its card header. Pass the wrapped value (with NOT, if
    // any) through so the child can render the toggle state itself.
    const childPath = [...this.path, index];
    return html`
      <ambience-state-expr-node
        .hass=${this.hass}
        .value=${child}
        .path=${childPath}
        .openPath=${this.openPath}
        .dragOverPath=${this.dragOverPath}
        .dragOverPos=${this.dragOverPos}
        .dragFromPath=${this.dragFromPath}
        .errorPath=${this.errorPath}
        .errorMessage=${this.errorMessage}
      ></ambience-state-expr-node>
    `;
  }

  /** Group header: NOT toggle + AND/OR dropdown + ✕ (unwrap). The NOT
   *  toggle sits just before the AND/OR select (no left-hand gutter), so
   *  the header reads "NOT AND…" — the negation scopes to the whole group,
   *  mirroring the atom's in-header NOT. It's shown for every group,
   *  including the root: the data model allows a top-level `not`, and
   *  without it the only way to negate a whole expression was to nest a
   *  redundant inner group just to wrap it. Behaviour of X (unwrap):
   *  - Nested: promote children to parent's items list.
   *  - Root with 1 child: become that child (undoes a wrap).
   *  - Root with 2+ children: clear the predicate (set to null). */
  private _renderGroup(group: StateGroup, isNot: boolean) {
    return html`
      <div class="group ${this._dropPos() === "into" ? "drag-over" : ""} ${this._isDragging() ? "dragging" : ""}">
        <div class="group-header">
          ${this._dragHandle()}
          ${this._notToggle(isNot)}
          <select class="group-op"
            @change=${(e: Event) =>
              this._emit("node-set-op", {
                op: (e.target as HTMLSelectElement).value,
              })}>
            <option value="and" ?selected=${group.kind === "and"}>${stateOpLabel(this.hass, "and")}</option>
            <option value="or"  ?selected=${group.kind === "or"} >${stateOpLabel(this.hass, "or")}</option>
          </select>
          <button class="wrap"
            title=${localize(this.hass, "ui.state_wrap_group", "Wrap these clauses in parentheses")}
            @click=${(e: Event) => {
              e.stopPropagation();
              this._emit("node-wrap");
            }}>()</button>
          <button class="unwrap"
            title=${localize(this.hass, "ui.state_unwrap_group", "Remove these parens (promote children to parent)")}
            @click=${() => this._emit("node-unwrap")}>✕</button>
        </div>
        <div class="group-children">
          ${group.items.map((child, i) => this._renderChildRow(child, i))}
        </div>
        <div class="actions">
          <button @click=${() => this._emit("node-add-child")}>
            + ${localize(this.hass, "ui.state_add_condition", "Add clause")}
          </button>
        </div>
      </div>
    `;
  }

  override render() {
    // Both atoms and groups own their NOT toggle in the card header (an
    // atom before its summary, a group before its AND/OR select), so a
    // negation reads "NOT …" inline with no left-hand gutter. Both unwrap
    // the {kind:'not'} envelope before rendering the inner content; the
    // isNot flag drives the toggle's 'on' class.
    const isNot = this.value.kind === "not";
    const inner = isNot ? (this.value as StateNot).item : this.value;
    const content =
      inner.kind === "and" || inner.kind === "or"
        ? this._renderGroup(inner as StateGroup, isNot)
        : this._renderAtomCard(inner as StateAtom, isNot);
    // A `before`/`after` drop draws an insertion line above/below this node;
    // an `into` drop highlights the card outline (handled inside the card).
    const pos = this._dropPos();
    return html`
      ${pos === "before" ? html`<div class="drop-line before"></div>` : ""}
      ${content}
      ${pos === "after" ? html`<div class="drop-line after"></div>` : ""}
    `;
  }
}
