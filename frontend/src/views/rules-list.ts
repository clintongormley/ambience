import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { matcherLabel } from "../i18n.js";
import { ruleDisplayName, summariseMatcher } from "../summary.js";
import type {
  PeriodStoreView,
  Rule,
} from "../types.js";

@customElement("ambience-rules-list")
export class AmbienceRulesList extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }
    .empty {
      color: var(--secondary-text-color, #888);
      padding: 1rem;
      text-align: center;
    }
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    li {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.75rem 1rem;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      margin-bottom: 0.5rem;
      background: var(--card-background-color, #fff);
    }
    li.drag-over {
      border-color: var(--primary-color, #03a9f4);
    }
    .handle {
      cursor: grab;
      color: var(--secondary-text-color, #888);
      padding: 0 0.25rem;
      user-select: none;
    }
    .idx {
      font-family: monospace;
      color: var(--secondary-text-color, #888);
      margin-right: 0.5rem;
      min-width: 2em;
    }
    .body {
      flex: 1;
    }
    .name {
      cursor: pointer;
    }
    .name:hover {
      text-decoration: underline;
    }
    .summary {
      font-size: 0.85em;
      color: var(--secondary-text-color, #888);
    }
    button {
      background: transparent;
      border: 0;
      color: var(--primary-color, #03a9f4);
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      font-size: 1rem;
    }
    .add {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      padding: 0.5rem 1rem;
      border-radius: 4px;
      margin-top: 0.5rem;
    }
  `;

  @property({ attribute: false }) rules: Rule[] = [];
  @property({ type: Boolean }) autoSort = true;
  @property({ attribute: false }) periods?: PeriodStoreView;
  @property({ attribute: false }) hass?: { localize?: (k: string) => string | undefined; [key: string]: unknown };

  // Index of the row currently being dragged, or null.
  @state() private _dragFrom: number | null = null;
  // Index of the row a drag is currently hovering over, or null.
  @state() private _dragOver: number | null = null;

  private _emit(name: string, detail: unknown) {
    this.dispatchEvent(
      new CustomEvent(name, { detail, bubbles: true, composed: true }),
    );
  }

  /** Human-readable one-line summary of a rule's `when` map + action count. */
  private _summary(rule: Rule): string {
    const keys = Object.keys(rule.when).filter((k) => rule.when[k] != null);
    const when =
      keys.length === 0
        ? "any"
        : keys
            .map(
              (k) =>
                `${matcherLabel(this.hass as any, k)}: ${summariseMatcher(k, rule.when[k], { hass: this.hass as any, periods: this.periods })}`,
            )
            .join(", ");
    const n = rule.actions.length;
    return `${when} · ${n} action${n === 1 ? "" : "s"}`;
  }

  private _onDragStart(i: number) {
    this._dragFrom = i;
  }

  private _onDragOver(e: DragEvent, i: number) {
    if (this._dragFrom === null || i === this._dragFrom) return;
    e.preventDefault(); // allow drop
    this._dragOver = i;
  }

  private _onDrop(i: number) {
    const from = this._dragFrom;
    this._dragFrom = null;
    this._dragOver = null;
    if (from === null || from === i) return;
    this._emit("reorder-rules", { from, to: i });
  }

  private _onDragEnd() {
    this._dragFrom = null;
    this._dragOver = null;
  }

  private _confirmDelete(i: number, rule: Rule) {
    const label = rule.name || `Rule ${i + 1}`;
    if (window.confirm(`Delete "${label}"?`)) {
      this._emit("delete-rule", { index: i });
    }
  }

  override render() {
    if (this.rules.length === 0) {
      return html`
        <p class="empty">No rules yet.</p>
        <button class="add" @click=${() => this._emit("add-rule", {})}>
          + Add rule
        </button>
      `;
    }
    return html`
      <ul>
        ${this.rules.map(
          (rule, i) => html`
            <li
              class=${this._dragOver === i ? "drag-over" : ""}
              draggable=${!this.autoSort}
              @dragstart=${() => this._onDragStart(i)}
              @dragover=${(e: DragEvent) => this._onDragOver(e, i)}
              @drop=${() => this._onDrop(i)}
              @dragend=${this._onDragEnd}
            >
              ${!this.autoSort
                ? html`<span class="handle" title="Drag to reorder">⠿</span>`
                : ""}
              <span class="idx">${i + 1}</span>
              <div class="body">
                <div
                  class="name"
                  @click=${() => this._emit("edit-rule", { index: i })}
                >
                  ${ruleDisplayName(rule, `Rule ${i + 1}`)}
                </div>
                <div class="summary">${this._summary(rule)}</div>
              </div>
              <button
                @click=${() => this._emit("duplicate-rule", { index: i })}
                title="Duplicate"
              >
                ⧉
              </button>
              <button
                @click=${() => this._confirmDelete(i, rule)}
                title="Delete"
              >
                🗑
              </button>
            </li>
          `,
        )}
      </ul>
      <button class="add" @click=${() => this._emit("add-rule", {})}>
        + Add rule
      </button>
    `;
  }
}
