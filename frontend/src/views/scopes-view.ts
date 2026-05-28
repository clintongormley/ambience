import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import type {
  AreaRegistryEvent,
  FloorRegistryEvent,
  HassConnection,
} from "../api.js";
import { localize } from "../i18n.js";
import {
  getArea,
  getDayConfig,
  getFloor,
  getHouse,
  getWeatherConfig,
  listAreas,
  listExposedActions,
  listFloors,
  listMatchers,
  listPeriods,
  saveArea,
  saveFloor,
  saveHouse,
} from "../api.js";
import type {
  AreaListItem,
  DayConfig,
  ExposedAction,
  FloorListItem,
  MatcherInfo,
  PeriodStoreView,
  Rule,
  Scope,
  ScopeConfig,
  WeatherConfig,
} from "../types.js";
import "./rules-list.js";
import "./rule-editor.js";

type EditingState = { scope: Scope; index: number; isNew: boolean };

/**
 * Stable key for a scope, used in `_expanded` and for `data-id` attributes.
 * `area:<id>` | `floor:<id>` | `house`
 */
function _scopeKey(scope: Scope): string {
  if (scope.kind === "house") return "house";
  return `${scope.kind}:${scope.id}`;
}

/**
 * Normalise so `cfg.auto_sort` is always a defined boolean. Older stored
 * configs predate the field; without this, `!undefined === true` would render
 * the "Order rules manually" checkbox as checked, AND sends to *-save would
 * drop the undefined key so the backend's own default (True) would re-sort
 * the rules — silently undoing manual reorders.
 */
function _normalize(cfg: ScopeConfig): ScopeConfig {
  return {
    rules: cfg.rules ?? [],
    auto_sort: cfg.auto_sort ?? true,
  };
}

@customElement("ambience-scopes-view")
export class AmbienceScopesView extends LitElement {
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
    li.scope-row {
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      margin-bottom: 0.5rem;
      background: var(--card-background-color, #fff);
    }
    .scope-header {
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
    .scope-name {
      flex: 1;
      font-weight: 600;
    }
    .scope-summary {
      font-size: 0.85em;
      color: var(--secondary-text-color, #888);
    }
    .scope-body {
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
  @state() private _floors: FloorListItem[] = [];
  @state() private _areaConfigs = new Map<string, ScopeConfig>();
  @state() private _floorConfigs = new Map<string, ScopeConfig>();
  @state() private _house: ScopeConfig = { rules: [], auto_sort: true };
  @state() private _matchers: MatcherInfo[] = [];
  @state() private _actions: ExposedAction[] = [];
  @state() private _periods?: PeriodStoreView;
  @state() private _dayConfig?: DayConfig;
  @state() private _weatherConfig?: WeatherConfig;
  // _expanded keys: "area:<id>" | "floor:<id>" | "house"
  @state() private _expanded = new Set<string>();
  @state() private _error = "";
  @state() private _editing: EditingState | null = null;
  private _unsubArea?: () => void;
  private _unsubFloor?: () => void;

  private _onExposedActionsChanged = async () => {
    try {
      const actions = await listExposedActions(this.hass);
      if (!this.isConnected) return;
      this._actions = actions;
    } catch {
      // Silent — the user just saw a successful save; transient refetch failures
      // are not worth surfacing here. The next manual reload will re-fetch.
    }
  };

  override async connectedCallback() {
    super.connectedCallback();
    window.addEventListener("ambience-exposed-actions-changed", this._onExposedActionsChanged);
    await this._loadStatic();
    await Promise.all([
      this._refreshAreas(),
      this._refreshFloors(),
      this._refreshHouse(),
    ]);
    await this._subscribe();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("ambience-exposed-actions-changed", this._onExposedActionsChanged);
    this._unsubArea?.();
    this._unsubArea = undefined;
    this._unsubFloor?.();
    this._unsubFloor = undefined;
  }

  // --- loading -------------------------------------------------------------

  private async _loadStatic() {
    try {
      const [matchers, actions, periods, dayConfig, weatherConfig] = await Promise.all([
        listMatchers(this.hass),
        listExposedActions(this.hass),
        listPeriods(this.hass),
        getDayConfig(this.hass),
        getWeatherConfig(this.hass),
      ]);
      if (!this.isConnected) return;
      this._matchers = matchers;
      this._actions = actions;
      this._periods = periods;
      this._dayConfig = dayConfig;
      this._weatherConfig = weatherConfig;
    } catch (e) {
      this._error = (e as Error).message || String(e);
    }
  }

  private async _refreshAreas() {
    try {
      const areas = await listAreas(this.hass);
      // Ambience configs only change when WE call saveArea — never via
      // area_registry_updated events. Reuse existing config references and
      // only fetch for newly-discovered areas, to keep Rule references
      // stable across rename/add/remove events.
      const previous = this._areaConfigs;
      const configs = new Map<string, ScopeConfig>();
      await Promise.all(
        areas.map(async (a) => {
          const existing = previous.get(a.area_id);
          if (existing) {
            configs.set(a.area_id, existing);
            return;
          }
          configs.set(
            a.area_id,
            _normalize(await getArea(this.hass, a.area_id)),
          );
        }),
      );
      if (!this.isConnected) return;
      this._areas = areas;
      this._areaConfigs = configs;
    } catch (e) {
      this._error = (e as Error).message || String(e);
    }
  }

  private async _refreshFloors() {
    try {
      const floors = (await listFloors(this.hass))
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name));
      const previous = this._floorConfigs;
      const configs = new Map<string, ScopeConfig>();
      await Promise.all(
        floors.map(async (f) => {
          const existing = previous.get(f.floor_id);
          if (existing) {
            configs.set(f.floor_id, existing);
            return;
          }
          configs.set(
            f.floor_id,
            _normalize(await getFloor(this.hass, f.floor_id)),
          );
        }),
      );
      if (!this.isConnected) return;
      this._floors = floors;
      this._floorConfigs = configs;
    } catch (e) {
      this._error = (e as Error).message || String(e);
    }
  }

  private async _refreshHouse() {
    try {
      const house = _normalize(await getHouse(this.hass));
      if (!this.isConnected) return;
      this._house = house;
    } catch (e) {
      this._error = (e as Error).message || String(e);
    }
  }

  private async _subscribe() {
    const subArea = this.hass.connection.subscribeEvents<AreaRegistryEvent>(
      (event) => {
        if (event.data.action === "remove") {
          const id = event.data.area_id;
          const expanded = new Set(this._expanded);
          expanded.delete(`area:${id}`);
          this._expanded = expanded;
          if (
            this._editing?.scope.kind === "area" &&
            this._editing.scope.id === id
          ) {
            this._editing = null;
          }
        }
        void this._refreshAreas();
      },
      "area_registry_updated",
    );
    const subFloor = this.hass.connection.subscribeEvents<FloorRegistryEvent>(
      (event) => {
        if (event.data.action === "remove") {
          const id = event.data.floor_id;
          const expanded = new Set(this._expanded);
          expanded.delete(`floor:${id}`);
          this._expanded = expanded;
          if (
            this._editing?.scope.kind === "floor" &&
            this._editing.scope.id === id
          ) {
            this._editing = null;
          }
        }
        void this._refreshFloors();
      },
      "floor_registry_updated",
    );
    const [unsubArea, unsubFloor] = await Promise.all([subArea, subFloor]);
    if (this.isConnected) {
      this._unsubArea = unsubArea;
      this._unsubFloor = unsubFloor;
    } else {
      unsubArea();
      unsubFloor();
    }
  }

  // --- config getter / setter ----------------------------------------------

  private _getConfig(scope: Scope): ScopeConfig | undefined {
    if (scope.kind === "house") return this._house;
    if (scope.kind === "area") return this._areaConfigs.get(scope.id);
    return this._floorConfigs.get(scope.id);
  }

  private _setConfig(scope: Scope, config: ScopeConfig) {
    if (scope.kind === "house") {
      this._house = config;
    } else if (scope.kind === "area") {
      const next = new Map(this._areaConfigs);
      next.set(scope.id, config);
      this._areaConfigs = next;
    } else {
      const next = new Map(this._floorConfigs);
      next.set(scope.id, config);
      this._floorConfigs = next;
    }
  }

  /**
   * Apply `next` optimistically, persist, reconcile with the stored config.
   * Not serialised per scope: overlapping saves could revert to a stale
   * intermediate config on error. In practice the UI serialises mutations
   * (one modal / one interaction at a time), so this is acceptable.
   */
  private async _mutate(scope: Scope, next: ScopeConfig) {
    const prev = this._getConfig(scope);
    this._setConfig(scope, next);
    this._error = "";
    try {
      let result: { ok: true; config: ScopeConfig };
      if (scope.kind === "house") result = await saveHouse(this.hass, next);
      else if (scope.kind === "area")
        result = await saveArea(this.hass, scope.id, next);
      else result = await saveFloor(this.hass, scope.id, next);
      this._setConfig(scope, _normalize(result.config));
    } catch (e) {
      if (prev) this._setConfig(scope, prev);
      this._error = (e as Error).message || String(e);
    }
  }

  // --- expand --------------------------------------------------------------

  private _toggleExpand(scope: Scope) {
    const key = _scopeKey(scope);
    const next = new Set(this._expanded);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    this._expanded = next;
  }

  // --- auto_sort -----------------------------------------------------------

  private _toggleAutoSort(scope: Scope, on: boolean) {
    const cfg = this._getConfig(scope);
    if (!cfg) return;
    void this._mutate(scope, { ...cfg, auto_sort: on });
  }

  // --- rules ---------------------------------------------------------------

  private _addRule(scope: Scope) {
    const cfg = this._getConfig(scope);
    if (!cfg) return;
    this._editing = { scope, index: cfg.rules.length, isNew: true };
  }

  private _editRule(scope: Scope, e: CustomEvent<{ index: number }>) {
    this._editing = { scope, index: e.detail.index, isNew: false };
  }

  private _duplicateRule(scope: Scope, e: CustomEvent<{ index: number }>) {
    const cfg = this._getConfig(scope);
    if (!cfg) return;
    const original = cfg.rules[e.detail.index];
    if (!original) return;
    const copy: Rule = JSON.parse(JSON.stringify(original));
    const rules = [...cfg.rules];
    rules.splice(e.detail.index + 1, 0, copy);
    void this._mutate(scope, { ...cfg, rules });
  }

  private _deleteRule(scope: Scope, e: CustomEvent<{ index: number }>) {
    const cfg = this._getConfig(scope);
    if (!cfg) return;
    const rules = cfg.rules.filter((_, i) => i !== e.detail.index);
    void this._mutate(scope, { ...cfg, rules });
  }

  private _reorderRules(
    scope: Scope,
    e: CustomEvent<{ from: number; to: number }>,
  ) {
    const cfg = this._getConfig(scope);
    if (!cfg) return;
    const { from, to } = e.detail;
    const rules = [...cfg.rules];
    const [moved] = rules.splice(from, 1);
    rules.splice(to, 0, moved);
    void this._mutate(scope, { ...cfg, rules });
  }

  private _saveRule(e: CustomEvent<Rule>) {
    const editing = this._editing;
    this._editing = null;
    if (!editing) return;
    const cfg = this._getConfig(editing.scope);
    if (!cfg) return;
    const rules = [...cfg.rules];
    if (editing.isNew) rules.push(e.detail);
    else rules[editing.index] = e.detail;
    void this._mutate(editing.scope, { ...cfg, rules });
  }

  private _cancelRule() {
    // New rules are not added to the config until saved, so cancel is a no-op.
    this._editing = null;
  }

  // --- derived -------------------------------------------------------------

  private get _editingRule(): Rule | null {
    if (!this._editing) return null;
    if (this._editing.isNew) return { when: {}, actions: [] };
    const cfg = this._getConfig(this._editing.scope);
    return cfg?.rules[this._editing.index] ?? null;
  }

  /** Scene names already used by the editing scope's rules, case-insensitive sorted. */
  private get _sceneSuggestions(): string[] {
    if (!this._editing) return [];
    const cfg = this._getConfig(this._editing.scope);
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

  /** Matcher rows for the rule editor — sorted by `priority` (lower first). */
  private get _editorMatchers(): MatcherInfo[] {
    if (!this._editing) return [];
    return this._matchers.slice().sort((a, b) => a.priority - b.priority);
  }

  private _summary(cfg: ScopeConfig): string {
    const r = cfg.rules.length;
    if (r === 0) return localize(this.hass, "ui.not_configured", "not configured");
    const noun =
      r === 1
        ? localize(this.hass, "ui.rule_singular", "rule")
        : localize(this.hass, "ui.rule_plural", "rules");
    return `${r} ${noun}`;
  }

  // --- render --------------------------------------------------------------

  override render() {
    const floorPrefix = localize(this.hass, "ui.scope_floor_prefix", "Floor: ");
    const areaPrefix = localize(this.hass, "ui.scope_area_prefix", "Area: ");
    return html`
      ${this._error ? html`<p class="error">${this._error}</p>` : ""}
      <ul>
        ${this._renderScopeRow(
          { kind: "house" },
          localize(this.hass, "ui.scope_global", "Global"),
          this._house,
          "house",
        )}
        ${this._floors.map((f) => {
          const cfg = this._floorConfigs.get(f.floor_id);
          if (!cfg) return html``;
          return this._renderScopeRow(
            { kind: "floor", id: f.floor_id },
            `${floorPrefix}${f.name}`,
            cfg,
            "floor",
          );
        })}
        ${this._areas.length === 0
          ? html`<li>
              <p class="empty">
                ${localize(
                  this.hass,
                  "ui.no_areas",
                  "No areas found in Home Assistant.",
                )}
              </p>
            </li>`
          : this._areas.map((a) => {
              const cfg = this._areaConfigs.get(a.area_id);
              if (!cfg) return html``;
              return this._renderScopeRow(
                { kind: "area", id: a.area_id },
                `${areaPrefix}${a.name}`,
                cfg,
                "area",
              );
            })}
      </ul>

      <ambience-rule-editor
        ?open=${this._editing !== null}
        .hass=${this.hass}
        .scope=${this._editing ? this._editing.scope : undefined}
        .rule=${this._editingRule}
        .matchers=${this._editorMatchers}
        .sceneSuggestions=${this._sceneSuggestions}
        .periods=${this._periods}
        .dayConfig=${this._dayConfig}
        .weatherConfig=${this._weatherConfig}
        .availableActions=${this._actions}
        @save-rule=${this._saveRule}
        @cancel-rule=${this._cancelRule}
      ></ambience-rule-editor>
    `;
  }

  private _renderScopeRow(
    scope: Scope,
    name: string,
    cfg: ScopeConfig,
    rowClass: "house" | "floor" | "area",
  ) {
    const open = this._expanded.has(_scopeKey(scope));
    const dataId = scope.kind === "house" ? "" : scope.id;
    return html`
      <li
        class="scope-row ${rowClass}"
        data-id=${dataId}
      >
        <div class="scope-header" @click=${() => this._toggleExpand(scope)}>
          <span class="chevron ${open ? "open" : ""}">▶</span>
          <span class="scope-name">${name}</span>
          <span class="scope-summary">${this._summary(cfg)}</span>
        </div>
        ${open
          ? html`
              <div class="scope-body">
                <label class="autosort">
                  <input
                    type="checkbox"
                    .checked=${!cfg.auto_sort}
                    @change=${(e: Event) =>
                      this._toggleAutoSort(
                        scope,
                        !(e.target as HTMLInputElement).checked,
                      )}
                  />
                  ${localize(
                    this.hass,
                    "ui.order_rules_manually",
                    "Order rules manually",
                  )}
                </label>
                <ambience-rules-list
                  .rules=${cfg.rules}
                  .autoSort=${cfg.auto_sort}
                  .periods=${this._periods}
                  .weatherConfig=${this._weatherConfig}
                  .matchers=${this._matchers}
                  .availableActions=${this._actions}
                  .hass=${this.hass}
                  @add-rule=${() => this._addRule(scope)}
                  @edit-rule=${(e: CustomEvent<{ index: number }>) =>
                    this._editRule(scope, e)}
                  @duplicate-rule=${(e: CustomEvent<{ index: number }>) =>
                    this._duplicateRule(scope, e)}
                  @delete-rule=${(e: CustomEvent<{ index: number }>) =>
                    this._deleteRule(scope, e)}
                  @reorder-rules=${(
                    e: CustomEvent<{ from: number; to: number }>,
                  ) => this._reorderRules(scope, e)}
                ></ambience-rules-list>
              </div>
            `
          : ""}
      </li>
    `;
  }
}
