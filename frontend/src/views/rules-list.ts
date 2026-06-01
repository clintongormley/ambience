import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { groupSwatchStyle } from "../group-colors.js";
import { actionLabel, localize, matcherLabel } from "../i18n.js";
import { formatArgValue, paramLabel, ruleDisplayName, summariseMatcher } from "../summary.js";
import { DragReorderController } from "../drag-reorder.js";
import type {
  ActionSpec,
  ExposedAction,
  MatcherInfo,
  PeriodStoreView,
  Rule,
  RuleGroup,
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
    li.disabled .body,
    li.disabled .idx {
      opacity: 0.5;
    }
    .toggle {
      padding: 0.25rem 0.5rem;
    }
    .toggle ha-icon {
      --mdc-icon-size: 20px;
    }
    .handle {
      cursor: grab;
      color: var(--secondary-text-color, #888);
      user-select: none;
    }
    .idx {
      font-family: monospace;
      color: var(--secondary-text-color, #888);
      margin-right: 0.25rem;
      /* Wide enough for two digits — we don't expect >99 rules. */
      min-width: 1.4em;
      text-align: right;
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
    /* The lead slot holds either the drag handle (unpinned) or the pin button
       (pinned) — one fixed width, so swapping them never shifts the row. */
    .lead {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 1.5em;
    }
    /* Fixed-width slot for the shadow warning so the title aligns whether or
       not a row is shadowed. */
    .warn-slot {
      display: inline-flex;
      align-items: center;
      justify-content: flex-start;
      flex: 0 0 1.4em;
    }
    .pin {
      padding: 0;
    }
    .shadow-warning {
      color: var(--error-color, #db4437);
      cursor: help;
      line-height: 1;
    }
    /* Full-width coloured bar before each group's rules. The colour + text
       colour are set inline per group; this rule carries layout + the neutral
       fallback used when a group has no colour. */
    .group-section-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
      box-sizing: border-box;
      padding: 0.4rem 0.75rem;
      margin: 0.75rem 0 0.5rem 0;
      border-radius: 4px;
      font-weight: 600;
      background: var(--secondary-background-color, #e0e0e0);
      color: var(--primary-text-color, #212121);
    }
    .group-section:first-of-type .group-section-header {
      margin-top: 0;
    }
    .group-section-header ha-icon {
      --mdc-icon-size: 20px;
    }
    .group-section-header .apply-group {
      margin-left: auto;
      background: none;
      border: none;
      cursor: pointer;
      color: inherit;
      padding: 0 0.25rem;
      line-height: 1;
    }
    .traces-btn {
      background: none;
      border: none;
      color: inherit;
      cursor: pointer;
      padding: 0 0.25rem;
      display: inline-flex;
      align-items: center;
    }
    .traces-btn ha-icon {
      --mdc-icon-size: 18px;
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
  // Available rule groups, used to render the section header bars. Empty ⇒ no
  // group sections (every rule rendered as one flat list).
  @property({ attribute: false }) groups: RuleGroup[] = [];

  // The active group filter, OWNED BY THE PARENT (scopes-view): "" = All,
  // otherwise a group id. Presentation-only.
  @property({ attribute: false }) filterGroup: string = "";

  // Drag-to-reorder controller. On drop it emits "reorder-rules" {from,to};
  // the parent (scopes-view) performs the actual move.
  private _drag = new DragReorderController(this, (from, to) =>
    this._emit("reorder-rules", { from, to }),
  );
  // Rule indices whose action list is expanded inline.
  @state() private _expanded = new Set<number>();

  /** A full-width coloured header bar for a group's section: the group's colour
   *  as background (auto-contrast text), its icon, then its name. Falls back to
   *  neutral theme colours when the group has no colour. */
  private _renderSectionHeader(group: RuleGroup) {
    return html`<div class="group-section-header" style=${groupSwatchStyle(group.color)}>
      ${group.icon ? html`<ha-icon icon=${group.icon}></ha-icon>` : ""}
      <span>${group.name}</span>
      <button
        class="apply-group"
        @click=${(e: Event) => {
          e.stopPropagation();
          this._emit("apply-group", { groupId: group.id });
        }}
        title=${localize(this.hass, "ui.apply_group", "Apply this group")}
      >
        ▶
      </button>
      <button
        class="traces-btn"
        title=${localize(this.hass, "ui.view_traces", "View traces")}
        aria-label=${localize(this.hass, "ui.view_traces", "View traces")}
        @click=${(e: Event) => { e.stopPropagation(); this._emit("show-traces", { group: group.id }); }}
      ><ha-icon icon="mdi:history"></ha-icon></button>
    </div>`;
  }

  /**
   * Rules paired with their ORIGINAL index, partitioned into render sections.
   * filterGroup="" (All) → one section per group that has rules, sorted by
   * group name; each labelled. filterGroup=<id> → a single unlabelled section
   * with only that group's rules. Original indices are preserved so
   * edit/delete/duplicate/reorder reference the correct underlying entry.
   */
  private _sections(): Array<{ group: RuleGroup | undefined; rows: Array<[number, Rule]> }> {
    const pairs = this.rules.map((rule, i) => [i, rule] as [number, Rule]);
    if (this.filterGroup !== "") {
      return [{
        group: this.groups.find((g) => g.id === this.filterGroup),
        rows: pairs.filter(([, r]) => r.group === this.filterGroup),
      }];
    }
    const byId = new Map<string, Array<[number, Rule]>>();
    for (const [i, r] of pairs) {
      const list = byId.get(r.group) ?? [];
      list.push([i, r]);
      byId.set(r.group, list);
    }
    return [...byId.entries()]
      .map(([gid, rows]) => ({ group: this.groups.find((g) => g.id === gid), rows }))
      .sort((a, b) => (a.group?.name ?? "").localeCompare(b.group?.name ?? ""));
  }

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
   *  humanized field id ("brightness_pct" → "Brightness pct"). Values use
   *  formatArgValue: HA target objects become friendly entity names, arrays
   *  are wrapped in [ ], other objects render as JSON. */
  private _actionParamsString(action: ActionSpec): string {
    return Object.entries(action.params)
      .filter(([, v]) => v !== undefined && v !== null && v !== "")
      .map(([k, v]) => `${paramLabel(k, action.service, this.schemas)}: ${formatArgValue(this.hass, v)}`)
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

  private _confirmDelete(i: number, rule: Rule, displayNum: number) {
    const label = rule.name || localize(this.hass, "ui.rule_n", "Rule {n}").replace("{n}", String(displayNum));
    if (window.confirm(localize(this.hass, "ui.confirm_delete", 'Delete "{name}"?').replace("{name}", label))) {
      this._emit("delete-rule", { index: i });
    }
  }

  /** A single rule row. `i` is the rule's ORIGINAL index in `this.rules`
   *  (used for every emitted event and drag handler); `displayNum` is the
   *  1-based position WITHIN its render section. */
  private _renderRow(i: number, rule: Rule, displayNum: number) {
    const unpinLabel = localize(this.hass, "ui.unpin", "Unpin (return to automatic order)");
    const isDisabled = rule.enabled === false;
    const toggleLabel = isDisabled
      ? localize(this.hass, "ui.enable_rule", "Enable rule")
      : localize(this.hass, "ui.disable_rule", "Disable rule");
    return html`
      <li
        class="${this._drag.over === i ? "drag-over " : ""}${isDisabled ? "disabled" : ""}"
        draggable="true"
        @dragstart=${() => this._drag.start(i)}
        @dragover=${(e: DragEvent) => this._drag.dragOver(e, i)}
        @drop=${() => this._drag.drop(i)}
        @dragend=${() => this._drag.end()}
      >
        <span class="lead">
          ${rule.pinned
            ? html`<button
                class="pin"
                title=${unpinLabel}
                aria-label=${unpinLabel}
                @click=${(e: Event) => {
                  e.stopPropagation();
                  this._emit("unpin-rule", { index: i });
                }}
              >📌</button>`
            : html`<span class="handle" title=${localize(this.hass, "ui.drag_to_reorder", "Drag to reorder")}>⠿</span>`}
        </span>
        <span class="idx">${displayNum}</span>
        <span class="warn-slot">
          ${rule.shadowed_by != null && !isDisabled
            ? html`<span
                class="shadow-warning"
                title=${localize(this.hass, "ui.shadowed", "Never fires — shadowed by an earlier rule.")}
              >⚠️</span>`
            : ""}
        </span>
        <div class="body" @click=${() => this._toggleRule(i)}>
          <div class="name">
            ${ruleDisplayName(rule, localize(this.hass, "ui.rule_n", "Rule {n}").replace("{n}", String(displayNum)))}
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
          class="toggle"
          @click=${(e: Event) => {
            e.stopPropagation();
            this._emit("toggle-rule-enabled", { index: i, enabled: isDisabled });
          }}
          title=${toggleLabel}
          aria-label=${toggleLabel}
        >
          <ha-icon icon=${isDisabled ? "mdi:toggle-switch-off-outline" : "mdi:toggle-switch"}></ha-icon>
        </button>
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
          class="run"
          @click=${(e: Event) => {
            e.stopPropagation();
            this._emit("run-rule-actions", { index: i });
          }}
          title=${localize(this.hass, "ui.run_actions", "Run actions")}
        >
          ▶
        </button>
        <button
          @click=${(e: Event) => {
            e.stopPropagation();
            this._confirmDelete(i, rule, displayNum);
          }}
          title=${localize(this.hass, "ui.title_delete", "Delete")}
        >
          🗑
        </button>
      </li>
    `;
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
    // Only render sections that actually have rules — when filtering to a
    // single group, a scope with no rules in that group shows nothing (no
    // empty header bar).
    const sections = this._sections().filter((section) => section.rows.length > 0);
    // Show the coloured group header for every section, including when a single
    // group is filtered — the bar labels which group these rules belong to.
    const showHeaders = this.groups.length > 0;
    return html`
      ${sections.map(
        (section) => html`
          <div class="group-section">
            ${showHeaders && section.group ? this._renderSectionHeader(section.group) : ""}
            <ul>
              ${section.rows.map(([i, rule], n) => this._renderRow(i, rule, n + 1))}
            </ul>
          </div>
        `,
      )}
      <button class="add" @click=${() => this._emit("add-rule", {})}>
        ${localize(this.hass, "ui.add_rule", "+ Add rule")}
      </button>
    `;
  }
}
