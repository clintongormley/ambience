import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { localize, matcherLabel } from "../i18n.js";
import { ruleDisplayName, summariseMatcher } from "../summary.js";
import type {
  MatcherInfo,
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
  @property({ attribute: false }) weatherConfig?: import("../types.js").WeatherConfig;
  @property({ attribute: false }) hass?: { localize?: (k: string) => string | undefined; [key: string]: unknown };
  // Names of globally-enabled matchers. When set, predicates for disabled
  // matchers are hidden from the summary (`scene` is always shown). Undefined
  // means "show all" (e.g. standalone tests that don't supply it).
  @property({ attribute: false }) enabledMatchers?: string[];
  // Matcher registry — used to sort `when` keys by `priority` in the summary
  // so it reads in the same order as the linearisation tiebreaker (lower
  // priority first). Undefined → falls back to `when`-dict insertion order.
  @property({ attribute: false }) matchers?: MatcherInfo[];

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
    const priorityOf = new Map((this.matchers ?? []).map((m) => [m.name, m.priority]));
    const keys = Object.keys(rule.when)
      .filter(
        (k) =>
          rule.when[k] != null &&
          (k === "scene" || !this.enabledMatchers || this.enabledMatchers.includes(k)),
      )
      // Stable sort by matcher priority (lower first); unknown matchers go last.
      .sort((a, b) => (priorityOf.get(a) ?? Infinity) - (priorityOf.get(b) ?? Infinity));
    const when =
      keys.length === 0
        ? localize(this.hass, "ui.summary_any", "any")
        : keys
            .map(
              (k) =>
                `${matcherLabel(this.hass as any, k)}: ${summariseMatcher(k, rule.when[k], { hass: this.hass as any, periods: this.periods, weatherGroups: this.weatherConfig?.groups })}`,
            )
            .join(", ");
    const n = rule.actions.length;
    const actionWord = n === 1
      ? localize(this.hass, "ui.action_singular", "action")
      : localize(this.hass, "ui.action_plural", "actions");
    return `${when} · ${n} ${actionWord}`;
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
    const label = rule.name || localize(this.hass, "ui.rule_n", "Rule {n}").replace("{n}", String(i + 1));
    if (window.confirm(localize(this.hass, "ui.confirm_delete", 'Delete "{name}"?').replace("{name}", label))) {
      this._emit("delete-rule", { index: i });
    }
  }

  override render() {
    if (this.rules.length === 0) {
      return html`
        <p class="empty">${localize(this.hass, "ui.no_rules_yet", "No rules yet.")}</p>
        <button class="add" @click=${() => this._emit("add-rule", {})}>
          ${localize(this.hass, "ui.add_rule", "+ Add rule")}
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
                ? html`<span class="handle" title=${localize(this.hass, "ui.drag_to_reorder", "Drag to reorder")}>⠿</span>`
                : ""}
              <span class="idx">${i + 1}</span>
              <div class="body">
                <div
                  class="name"
                  @click=${() => this._emit("edit-rule", { index: i })}
                >
                  ${ruleDisplayName(rule, localize(this.hass, "ui.rule_n", "Rule {n}").replace("{n}", String(i + 1)))}
                </div>
                <div class="summary">${this._summary(rule)}</div>
              </div>
              <button
                @click=${() => this._emit("duplicate-rule", { index: i })}
                title=${localize(this.hass, "ui.duplicate", "Duplicate")}
              >
                ⧉
              </button>
              <button
                @click=${() => this._confirmDelete(i, rule)}
                title=${localize(this.hass, "ui.title_delete", "Delete")}
              >
                🗑
              </button>
            </li>
          `,
        )}
      </ul>
      <button class="add" @click=${() => this._emit("add-rule", {})}>
        ${localize(this.hass, "ui.add_rule", "+ Add rule")}
      </button>
    `;
  }
}
