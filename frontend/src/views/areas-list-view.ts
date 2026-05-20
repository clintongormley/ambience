import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import type { AreaRegistryEvent, HassConnection } from "../api.js";
import {
  getArea,
  getDayConfig,
  listActions,
  listAreas,
  listEnabledMatchers,
  listMatchers,
  listPeriods,
  saveArea,
} from "../api.js";
import type {
  ActionInfo,
  AreaConfig,
  AreaListItem,
  DayConfig,
  MatcherInfo,
  PeriodStoreView,
  Rule,
} from "../types.js";
import "./rules-list.js";
import "./rule-editor.js";

type EditingState = { areaId: string; index: number; isNew: boolean };

@customElement("ambience-areas-list")
export class AmbienceAreasList extends LitElement {
  static override styles = css`
    :host {
      display: block;
      padding: 1rem;
      max-width: 60rem;
      margin: 0 auto;
    }
    .empty {
      color: var(--secondary-text-color, #888);
      text-align: center;
      padding: 2rem;
    }
    .error {
      color: var(--error-color, #d32f2f);
      margin: 0.5rem 0;
    }
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    li {
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      margin-bottom: 0.5rem;
      background: var(--card-background-color, #fff);
    }
    .area-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      cursor: pointer;
    }
    .chevron {
      width: 1em;
      color: var(--secondary-text-color, #888);
      transition: transform 0.1s;
    }
    .chevron.open {
      transform: rotate(90deg);
    }
    .area-name {
      flex: 1;
      font-weight: 600;
    }
    .area-summary {
      font-size: 0.85em;
      color: var(--secondary-text-color, #888);
    }
    .area-body {
      padding: 0.5rem 1rem 1rem 1rem;
      border-top: 1px solid var(--divider-color, #e0e0e0);
    }
    .autosort {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0.5rem 0 1rem 0;
      font-size: 0.9em;
    }
  `;

  @property({ attribute: false }) hass!: HassConnection;

  @state() private _areas: AreaListItem[] = [];
  @state() private _matchers: MatcherInfo[] = [];
  @state() private _actions: ActionInfo[] = [];
  @state() private _periods?: PeriodStoreView;
  @state() private _dayConfig?: DayConfig;
  @state() private _configs = new Map<string, AreaConfig>();
  @state() private _expanded = new Set<string>();
  @state() private _error = "";
  @state() private _editing: EditingState | null = null;
  @state() private _enabledMatchers = new Set<string>();
  private _unsub?: () => void;

  override async connectedCallback() {
    super.connectedCallback();
    await this._loadStatic();
    await this._refreshAreas();
    await this._subscribe();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._unsub?.();
    this._unsub = undefined;
  }

  private async _loadStatic() {
    try {
      const [matchers, actions, periods, enabled, dayConfig] = await Promise.all([
        listMatchers(this.hass),
        listActions(this.hass),
        listPeriods(this.hass),
        listEnabledMatchers(this.hass),
        getDayConfig(this.hass),
      ]);
      if (!this.isConnected) return;
      this._matchers = matchers;
      this._actions = actions;
      this._periods = periods;
      this._enabledMatchers = new Set(enabled.enabled);
      this._dayConfig = dayConfig;
    } catch (e) {
      this._error = (e as Error).message || String(e);
    }
  }

  private async _refreshAreas() {
    try {
      const areas = await listAreas(this.hass);
      const configs = new Map<string, AreaConfig>();
      await Promise.all(
        areas.map(async (a) => {
          configs.set(
            a.area_id,
            this._normalize(await getArea(this.hass, a.area_id)),
          );
        }),
      );
      if (!this.isConnected) return;
      this._areas = areas;
      this._configs = configs;
    } catch (e) {
      this._error = (e as Error).message || String(e);
    }
  }

  /**
   * Defaults missing keys so `cfg.auto_sort` is always a defined boolean.
   * Older stored areas predate the field; without this, `!undefined === true`
   * would render the "Order rules manually" checkbox as checked, AND sends
   * to area/save would drop the undefined key so the backend's own default
   * (True) would re-sort the rules — silently undoing manual reorders.
   */
  private _normalize(cfg: AreaConfig): AreaConfig {
    return {
      rules: cfg.rules ?? [],
      auto_sort: cfg.auto_sort ?? true,
    };
  }

  private async _subscribe() {
    const unsub = await this.hass.connection.subscribeEvents<AreaRegistryEvent>(
      (event) => {
        if (event.data.action === "remove") {
          const id = event.data.area_id;
          const expanded = new Set(this._expanded);
          expanded.delete(id);
          this._expanded = expanded;
          if (this._editing?.areaId === id) this._editing = null;
        }
        void this._refreshAreas();
      },
      "area_registry_updated",
    );
    if (this.isConnected) this._unsub = unsub;
    else unsub();
  }

  // --- config mutation -----------------------------------------------------

  private _setConfig(areaId: string, config: AreaConfig) {
    const next = new Map(this._configs);
    next.set(areaId, config);
    this._configs = next;
  }

  /**
   * Apply `next` optimistically, persist, reconcile with the stored config.
   * Not serialised per area: overlapping saves to the same area could revert
   * to a stale intermediate config on error. In practice the UI serialises
   * mutations (one modal / one interaction at a time), so this is acceptable.
   */
  private async _mutate(areaId: string, next: AreaConfig) {
    const prev = this._configs.get(areaId);
    this._setConfig(areaId, next);
    this._error = "";
    try {
      const { config } = await saveArea(this.hass, areaId, next);
      this._setConfig(areaId, this._normalize(config));
    } catch (e) {
      if (prev) this._setConfig(areaId, prev);
      this._error = (e as Error).message || String(e);
    }
  }

  // --- expand --------------------------------------------------------------

  private _toggleExpand(areaId: string) {
    const next = new Set(this._expanded);
    if (next.has(areaId)) next.delete(areaId);
    else next.add(areaId);
    this._expanded = next;
  }

  // --- auto_sort -----------------------------------------------------------

  private _toggleAutoSort(areaId: string, on: boolean) {
    const cfg = this._configs.get(areaId);
    if (!cfg) return;
    void this._mutate(areaId, { ...cfg, auto_sort: on });
  }

  // --- rules ---------------------------------------------------------------

  private _addRule(areaId: string) {
    const cfg = this._configs.get(areaId);
    if (!cfg) return;
    this._editing = { areaId, index: cfg.rules.length, isNew: true };
  }

  private _editRule(areaId: string, e: CustomEvent<{ index: number }>) {
    this._editing = { areaId, index: e.detail.index, isNew: false };
  }

  private _duplicateRule(areaId: string, e: CustomEvent<{ index: number }>) {
    const cfg = this._configs.get(areaId);
    if (!cfg) return;
    const original = cfg.rules[e.detail.index];
    if (!original) return;
    const copy: Rule = JSON.parse(JSON.stringify(original));
    const rules = [...cfg.rules];
    rules.splice(e.detail.index + 1, 0, copy);
    void this._mutate(areaId, { ...cfg, rules });
  }

  private _deleteRule(areaId: string, e: CustomEvent<{ index: number }>) {
    const cfg = this._configs.get(areaId);
    if (!cfg) return;
    const rules = cfg.rules.filter((_, i) => i !== e.detail.index);
    void this._mutate(areaId, { ...cfg, rules });
  }

  private _reorderRules(
    areaId: string,
    e: CustomEvent<{ from: number; to: number }>,
  ) {
    const cfg = this._configs.get(areaId);
    if (!cfg) return;
    const { from, to } = e.detail;
    const rules = [...cfg.rules];
    const [moved] = rules.splice(from, 1);
    rules.splice(to, 0, moved);
    void this._mutate(areaId, { ...cfg, rules });
  }

  private _saveRule(e: CustomEvent<Rule>) {
    const editing = this._editing;
    this._editing = null;
    if (!editing) return;
    const cfg = this._configs.get(editing.areaId);
    if (!cfg) return;
    const rules = [...cfg.rules];
    if (editing.isNew) rules.push(e.detail);
    else rules[editing.index] = e.detail;
    void this._mutate(editing.areaId, { ...cfg, rules });
  }

  private _cancelRule() {
    // New rules are not added to the config until saved, so cancel is a no-op.
    this._editing = null;
  }

  // --- derived -------------------------------------------------------------

  private get _editingRule(): Rule | null {
    if (!this._editing) return null;
    if (this._editing.isNew) return { when: {}, actions: [] };
    const cfg = this._configs.get(this._editing.areaId);
    return cfg?.rules[this._editing.index] ?? null;
  }

  /** Scene names already used by the editing area's rules, case-insensitive sorted. */
  private get _sceneSuggestions(): string[] {
    if (!this._editing) return [];
    const cfg = this._configs.get(this._editing.areaId);
    if (!cfg) return [];
    const names = new Set<string>();
    for (const r of cfg.rules) {
      const s = r.when["scene"];
      if (typeof s === "string" && s) names.add(s);
    }
    return [...names].sort((a, b) =>
      a.toLowerCase().localeCompare(b.toLowerCase()),
    );
  }

  /** Matcher rows for the rule editor: `scene` first, then the globally enabled matchers. */
  private get _editorMatchers(): MatcherInfo[] {
    if (!this._editing) return [];
    const scene = this._matchers.find((m) => m.name === "scene");
    const enabled = this._matchers.filter(
      (m) => m.toggleable && this._enabledMatchers.has(m.name),
    );
    return scene ? [scene, ...enabled] : enabled;
  }

  private _summary(cfg: AreaConfig): string {
    const r = cfg.rules.length;
    if (r === 0) return "not configured";
    return `${r} rule${r === 1 ? "" : "s"}`;
  }

  // --- render --------------------------------------------------------------

  override render() {
    return html`
      ${this._error ? html`<p class="error">${this._error}</p>` : ""}
      ${this._areas.length === 0
        ? html`<p class="empty">No areas found in Home Assistant.</p>`
        : html`<ul>
            ${this._areas.map((a) => this._renderArea(a))}
          </ul>`}

      <ambience-rule-editor
        ?open=${this._editing !== null}
        .hass=${this.hass}
        .areaId=${this._editing?.areaId}
        .rule=${this._editingRule}
        .matchers=${this._editorMatchers}
        .sceneSuggestions=${this._sceneSuggestions}
        .periods=${this._periods}
        .dayConfig=${this._dayConfig}
        .availableActions=${this._actions}
        @save-rule=${this._saveRule}
        @cancel-rule=${this._cancelRule}
      ></ambience-rule-editor>
    `;
  }

  private _renderArea(a: AreaListItem) {
    const cfg = this._configs.get(a.area_id);
    if (!cfg) return html``;
    const open = this._expanded.has(a.area_id);
    return html`
      <li>
        <div
          class="area-header"
          @click=${() => this._toggleExpand(a.area_id)}
        >
          <span class="chevron ${open ? "open" : ""}">▶</span>
          <span class="area-name">${a.name}</span>
          <span class="area-summary">${this._summary(cfg)}</span>
        </div>
        ${open
          ? html`
              <div class="area-body">
                <label class="autosort">
                  <input
                    type="checkbox"
                    .checked=${!cfg.auto_sort}
                    @change=${(e: Event) =>
                      this._toggleAutoSort(
                        a.area_id,
                        !(e.target as HTMLInputElement).checked,
                      )}
                  />
                  Order rules manually
                </label>
                <ambience-rules-list
                  .rules=${cfg.rules}
                  .autoSort=${cfg.auto_sort}
                  .periods=${this._periods}
                  .hass=${this.hass}
                  @add-rule=${() => this._addRule(a.area_id)}
                  @edit-rule=${(e: CustomEvent<{ index: number }>) =>
                    this._editRule(a.area_id, e)}
                  @duplicate-rule=${(e: CustomEvent<{ index: number }>) =>
                    this._duplicateRule(a.area_id, e)}
                  @delete-rule=${(e: CustomEvent<{ index: number }>) =>
                    this._deleteRule(a.area_id, e)}
                  @reorder-rules=${(
                    e: CustomEvent<{ from: number; to: number }>,
                  ) => this._reorderRules(a.area_id, e)}
                ></ambience-rules-list>
              </div>
            `
          : ""}
      </li>
    `;
  }
}
