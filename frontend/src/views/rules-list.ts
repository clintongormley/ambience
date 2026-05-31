import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { actionLabel, localize, matcherLabel } from "../i18n.js";
import { formatParamValue, paramLabel, ruleDisplayName, summariseMatcher } from "../summary.js";
import type {
  ActionSpec,
  ExposedAction,
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
      cursor: pointer;
    }
    .name {
      font-weight: 600;
    }
    .summary {
      font-size: 0.85em;
      color: var(--secondary-text-color, #888);
    }
    .rule-detail {
      margin-top: 0.35rem;
      padding-left: 0.75rem;
      border-left: 2px solid var(--divider-color, #e0e0e0);
      font-size: 0.85em;
      color: var(--secondary-text-color, #888);
    }
    .matcher-line {
      padding: 0.05rem 0;
      /* Wrap continuation lines indented to align under the matcher body
         (after the bold "Matcher:" label). */
      padding-left: 1.25rem;
      text-indent: -1.25rem;
    }
    .actions-detail {
      margin-top: 0.35rem;
      padding-top: 0.35rem;
      border-top: 1px dashed var(--divider-color, #e0e0e0);
    }
    .actions-detail-item {
      padding: 0.15rem 0;
    }
    .actions-detail-item .action-header {
      color: var(--primary-text-color, #212121);
    }
    .entity-list {
      list-style: disc;
      padding-left: 1.25rem;
      margin: 0.1rem 0 0.25rem 0;
    }
    .entity-list li {
      padding: 0;
      margin: 0;
      border: 0;
      background: transparent;
      display: list-item;
    }
    .no-targets {
      font-style: italic;
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
    /* Fixed-width status gutter so pin/warning icons never displace the rule
       title — every row reserves the same slot whether or not it has icons.
       Sized to hold both a pin and a warning (a rule can be both). */
    .status {
      display: inline-flex;
      align-items: center;
      gap: 0.15rem;
      flex: 0 0 2.75em;
    }
    .pin {
      padding: 0;
    }
    .shadow-warning {
      color: var(--error-color, #db4437);
      cursor: help;
      line-height: 1;
    }
  `;

  @property({ attribute: false }) rules: Rule[] = [];
  @property({ attribute: false }) periods?: PeriodStoreView;
  @property({ attribute: false }) weatherConfig?: import("../types.js").WeatherConfig;
  @property({ attribute: false }) hass?: { localize?: (k: string) => string | undefined; [key: string]: unknown };
  // Matcher registry — used to sort `when` keys by `priority` in the summary
  // so it reads in the same order as the linearisation tiebreaker (higher
  // priority first). Undefined → falls back to `when`-dict insertion order.
  @property({ attribute: false }) matchers?: MatcherInfo[];
  // Exposed-actions registry — used to resolve a friendly label for each
  // action when rendering the expanded detail under a rule. Optional;
  // when missing, falls back to the service id (snake-case → title-case).
  @property({ attribute: false }) availableActions: ExposedAction[] = [];
  // Per-service schemas — used to look up HA's `field.name` attribute
  // for each param key in the expanded action detail. Optional; when
  // missing, the param key is humanized (snake_case → "Title case").
  @property({ attribute: false }) schemas: Record<string, import("../types.js").ServiceSchema> = {};

  // Index of the row currently being dragged, or null.
  @state() private _dragFrom: number | null = null;
  // Index of the row a drag is currently hovering over, or null.
  @state() private _dragOver: number | null = null;
  // Rule indices whose action list is expanded inline.
  @state() private _expanded = new Set<number>();

  private _emit(name: string, detail: unknown) {
    this.dispatchEvent(
      new CustomEvent(name, { detail, bubbles: true, composed: true }),
    );
  }

  /** Sorted list of active `when` keys (higher priority first). */
  private _whenKeys(rule: Rule): string[] {
    const priorityOf = new Map((this.matchers ?? []).map((m) => [m.name, m.priority]));
    return Object.keys(rule.when)
      .filter((k) => rule.when[k] != null)
      .sort((a, b) => (priorityOf.get(b) ?? -Infinity) - (priorityOf.get(a) ?? -Infinity));
  }

  /** Inline (collapsed) "when" summary: matcher entries joined by `, ` with
   *  each matcher label wrapped in <strong>. */
  private _whenSummary(rule: Rule) {
    const keys = this._whenKeys(rule);
    if (keys.length === 0) return localize(this.hass, "ui.summary_any", "any");
    return keys.map((k, i) => {
      const label = matcherLabel(this.hass as any, k);
      const body = summariseMatcher(k, rule.when[k], {
        hass: this.hass as any,
        periods: this.periods,
        weatherGroups: this.weatherConfig?.groups,
      });
      const sep = i === 0 ? "" : ", ";
      return html`${sep}<strong>${label}:</strong> ${body}`;
    });
  }

  /** Expanded "when" detail: one matcher per line. */
  private _whenStacked(rule: Rule) {
    const keys = this._whenKeys(rule);
    if (keys.length === 0) {
      return html`<div class="matcher-line">${localize(this.hass, "ui.summary_any", "any")}</div>`;
    }
    return keys.map((k) => {
      const label = matcherLabel(this.hass as any, k);
      const body = summariseMatcher(k, rule.when[k], {
        hass: this.hass as any,
        periods: this.periods,
        weatherGroups: this.weatherConfig?.groups,
      });
      return html`<div class="matcher-line"><strong>${label}:</strong> ${body}</div>`;
    });
  }

  /** "N actions" / "1 action" / "0 actions" label. */
  private _actionCountLabel(rule: Rule): string {
    const n = rule.actions.length;
    const word = n === 1
      ? localize(this.hass, "ui.action_singular", "action")
      : localize(this.hass, "ui.action_plural", "actions");
    return `${n} ${word}`;
  }

  private _toggleRule(i: number) {
    const next = new Set(this._expanded);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    this._expanded = next;
  }

  /** Render-friendly name for an entity: friendly_name attribute, else entity_id. */
  private _entityName(entity_id: string): string {
    const states = (this.hass as { states?: Record<string, { attributes?: Record<string, unknown> }> } | undefined)?.states;
    const name = states?.[entity_id]?.attributes?.friendly_name;
    return typeof name === "string" && name ? name : entity_id;
  }

  /** "Key: value, ..." string for the expanded action header. Keys use
   *  HA's `field.name` from the schema when available, otherwise the
   *  humanized field id ("brightness_pct" → "Brightness pct"). Array
   *  values are wrapped in [ ] via formatParamValue. */
  private _actionParamsString(action: ActionSpec): string {
    return Object.entries(action.params)
      .filter(([, v]) => v !== undefined && v !== null && v !== "")
      .map(([k, v]) => `${paramLabel(k, action.service, this.schemas)}: ${formatParamValue(v)}`)
      .join(", ");
  }

  /** Friendly label for an action: user-provided ExposedAction.label when
   *  set, otherwise the service id rendered via actionLabel (which is
   *  snake-case → title-case for unknown ids). */
  private _actionLabel(action: ActionSpec): string {
    const exposed = this.availableActions.find((e) => e.id === action.service);
    if (exposed?.label && exposed.label.trim()) return exposed.label;
    return actionLabel(this.hass as any, action.service);
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
              draggable="true"
              @dragstart=${() => this._onDragStart(i)}
              @dragover=${(e: DragEvent) => this._onDragOver(e, i)}
              @drop=${() => this._onDrop(i)}
              @dragend=${this._onDragEnd}
            >
              <span class="handle" title=${localize(this.hass, "ui.drag_to_reorder", "Drag to reorder")}>⠿</span>
              <span class="idx">${i + 1}</span>
              <span class="status">
                ${rule.pinned
                  ? html`<button
                      class="pin"
                      title=${localize(this.hass, "ui.unpin", "Unpin (return to automatic order)")}
                      aria-label=${localize(this.hass, "ui.unpin", "Unpin (return to automatic order)")}
                      @click=${(e: Event) => {
                        e.stopPropagation();
                        this._emit("unpin-rule", { index: i });
                      }}
                    >📌</button>`
                  : ""}
                ${rule.shadowed_by != null
                  ? html`<span
                      class="shadow-warning"
                      title=${localize(this.hass, "ui.shadowed", "Never fires — shadowed by an earlier rule.")}
                    >⚠️</span>`
                  : ""}
              </span>
              <div class="body" @click=${() => this._toggleRule(i)}>
                <div class="name">
                  ${ruleDisplayName(rule, localize(this.hass, "ui.rule_n", "Rule {n}").replace("{n}", String(i + 1)))}
                </div>
                <div class="summary">
                  ${this._expanded.has(i)
                    ? ""
                    : html`${this._whenSummary(rule)} · <span class="action-count">${this._actionCountLabel(rule)}</span>`}
                </div>
                ${this._expanded.has(i)
                  ? html`
                      <div class="rule-detail">
                        ${this._whenStacked(rule)}
                        ${rule.actions.length === 0
                          ? ""
                          : html`<div class="actions-detail">
                              ${rule.actions.map((a) => {
                                const params = this._actionParamsString(a);
                                const label = this._actionLabel(a);
                                const header = params ? `${label} · ${params}` : label;
                                return html`
                                  <div class="actions-detail-item">
                                    <div class="action-header">${header}</div>
                                    ${a.entity_ids.length === 0
                                      ? html`<div class="no-targets">${localize(this.hass, "ui.no_targets", "(no targets)")}</div>`
                                      : html`<ul class="entity-list">
                                          ${a.entity_ids.map((eid) => html`<li>${this._entityName(eid)}</li>`)}
                                        </ul>`}
                                  </div>
                                `;
                              })}
                            </div>`}
                      </div>
                    `
                  : ""}
              </div>
              <button
                @click=${(e: Event) => {
                  e.stopPropagation();
                  this._emit("edit-rule", { index: i });
                }}
                title=${localize(this.hass, "ui.edit", "Edit")}
              >
                ✎
              </button>
              <button
                @click=${(e: Event) => {
                  e.stopPropagation();
                  this._emit("duplicate-rule", { index: i });
                }}
                title=${localize(this.hass, "ui.duplicate", "Duplicate")}
              >
                ⧉
              </button>
              <button
                @click=${(e: Event) => {
                  e.stopPropagation();
                  this._confirmDelete(i, rule);
                }}
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
