import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import {
  getArea,
  listActions,
  listMatchers,
  saveArea,
  type HassConnection,
} from "../api.js";
import type { ActionInfo, AreaConfig, MatcherInfo, Rule } from "../types.js";
import "./rules-list.js";
import "./rule-editor.js";

type Tab = "scenes" | "matchers" | "rules";

@customElement("ambience-area-editor")
export class AmbienceAreaEditor extends LitElement {
  static override styles = css`
    :host {
      display: block;
      padding: 1rem;
      max-width: 60rem;
      margin: 0 auto;
    }
    .tabs {
      display: flex;
      gap: 0;
      border-bottom: 2px solid var(--divider-color, #e0e0e0);
      margin-bottom: 1rem;
    }
    .tab {
      padding: 0.75rem 1.25rem;
      cursor: pointer;
      border: 0;
      background: transparent;
      color: var(--primary-text-color, inherit);
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
    }
    .tab.active {
      border-bottom-color: var(--primary-color, #03a9f4);
      font-weight: 600;
    }
    .field {
      margin-bottom: 1rem;
    }
    label {
      display: block;
      margin-bottom: 0.25rem;
      font-weight: 600;
    }
    input, select, textarea {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: inherit;
      box-sizing: border-box;
    }
    button {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      border: 0;
      border-radius: 4px;
      padding: 0.5rem 1rem;
      cursor: pointer;
    }
    button.secondary {
      background: transparent;
      color: var(--primary-color, #03a9f4);
    }
    .row {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .row input {
      flex: 1;
    }
    .save-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      border-top: 1px solid var(--divider-color, #e0e0e0);
      margin-top: 1rem;
    }
    .matcher-row {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      padding: 0.5rem;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      margin-bottom: 0.5rem;
    }
    .matcher-row input[type="checkbox"] {
      width: auto;
      margin-top: 0.25rem;
    }
    .matcher-meta {
      flex: 1;
    }
    .matcher-name {
      font-weight: 600;
    }
    .matcher-help {
      white-space: pre-wrap;
      font-size: 0.85em;
      color: var(--secondary-text-color, #888);
    }
    .error {
      color: var(--error-color, #d32f2f);
      margin-left: 1rem;
    }
    .saved {
      color: var(--success-color, #4caf50);
      margin-left: 1rem;
    }
  `;

  @property({ attribute: false }) hass!: HassConnection;
  @property() areaId = "";
  @state() private _config: AreaConfig | null = null;
  @state() private _matchers: MatcherInfo[] = [];
  @state() private _tab: Tab = "scenes";
  @state() private _error = "";
  @state() private _saved = false;
  @state() private _editingRuleIdx: number | null = null;
  @state() private _availableActions: ActionInfo[] = [];

  override async connectedCallback() {
    super.connectedCallback();
    await this._load();
  }

  private async _load() {
    try {
      const [cfg, matchers, actions] = await Promise.all([
        getArea(this.hass, this.areaId),
        listMatchers(this.hass),
        listActions(this.hass),
      ]);
      this._config = cfg;
      this._matchers = matchers;
      this._availableActions = actions;
    } catch (e) {
      this._error = (e as Error).message || String(e);
    }
  }

  private _setTab(tab: Tab) {
    this._tab = tab;
    this._saved = false;
    this._error = "";
  }

  private _addScene() {
    if (!this._config) return;
    this._config = {
      ...this._config,
      scenes: [...this._config.scenes, ""],
    };
  }

  private _updateScene(index: number, value: string) {
    if (!this._config) return;
    const scenes = [...this._config.scenes];
    scenes[index] = value;
    this._config = { ...this._config, scenes };
  }

  private _removeScene(index: number) {
    if (!this._config) return;
    const scenes = this._config.scenes.filter((_, i) => i !== index);
    this._config = { ...this._config, scenes };
  }

  private _toggleMatcher(name: string, on: boolean) {
    if (!this._config) return;
    const set = new Set(this._config.matchers);
    if (on) set.add(name);
    else set.delete(name);
    this._config = { ...this._config, matchers: [...set] };
  }

  private async _save() {
    if (!this._config) return;
    this._error = "";
    this._saved = false;
    try {
      await saveArea(this.hass, this.areaId, this._config);
      this._saved = true;
    } catch (e) {
      this._error = (e as Error).message || String(e);
    }
  }

  override render() {
    if (!this._config) {
      return html`<p>Loading…</p>`;
    }
    return html`
      <div class="tabs">
        <button
          class="tab ${this._tab === "scenes" ? "active" : ""}"
          @click=${() => this._setTab("scenes")}
        >
          Scenes
        </button>
        <button
          class="tab ${this._tab === "matchers" ? "active" : ""}"
          @click=${() => this._setTab("matchers")}
        >
          Matchers
        </button>
        <button
          class="tab ${this._tab === "rules" ? "active" : ""}"
          @click=${() => this._setTab("rules")}
        >
          Rules
        </button>
      </div>

      ${this._tab === "scenes" ? this._renderScenes() : ""}
      ${this._tab === "matchers" ? this._renderMatchers() : ""}
      ${this._tab === "rules" ? this._renderRules() : ""}

      <div class="save-bar">
        <button @click=${this._save}>Save</button>
        ${this._error ? html`<span class="error">${this._error}</span>` : ""}
        ${this._saved ? html`<span class="saved">Saved.</span>` : ""}
      </div>

      <ambience-rule-editor
        ?open=${this._editingRuleIdx !== null}
        .rule=${this._editingRule}
        .scenes=${this._config.scenes}
        .activeMatchers=${this._activeMatcherInfos}
        .availableActions=${this._availableActions}
        @save-rule=${this._saveRule}
        @cancel-rule=${this._cancelRule}
      ></ambience-rule-editor>
    `;
  }

  private _renderScenes() {
    return html`
      <div class="field">
        <label>Display name</label>
        <input
          type="text"
          .value=${this._config!.name}
          @input=${(e: InputEvent) => {
            this._config = {
              ...this._config!,
              name: (e.target as HTMLInputElement).value,
            };
          }}
        />
      </div>
      <h3>Scenes</h3>
      ${this._config!.scenes.map(
        (scene, i) => html`
          <div class="row">
            <input
              type="text"
              .value=${scene}
              @input=${(e: InputEvent) =>
                this._updateScene(i, (e.target as HTMLInputElement).value)}
            />
            <button class="secondary" @click=${() => this._removeScene(i)}>×</button>
          </div>
        `,
      )}
      <button class="secondary" @click=${this._addScene}>+ Add scene</button>
    `;
  }

  private _renderMatchers() {
    return html`
      <h3>Matchers</h3>
      <p>Select which matchers can be used in this area's rule predicates.</p>
      ${this._matchers.map(
        (m) => html`
          <div class="matcher-row">
            <input
              type="checkbox"
              .checked=${this._config!.matchers.includes(m.name)}
              @change=${(e: Event) =>
                this._toggleMatcher(
                  m.name,
                  (e.target as HTMLInputElement).checked,
                )}
            />
            <div class="matcher-meta">
              <div class="matcher-name">${m.name}</div>
              <div>${m.description}</div>
              <div class="matcher-help">${m.predicate_help}</div>
            </div>
          </div>
        `,
      )}
    `;
  }

  private _renderRules() {
    return html`
      <h3>Rules</h3>
      <p>Rules are evaluated in order — the first match wins.</p>
      <ambience-rules-list
        .rules=${this._config!.rules}
        @add-rule=${this._addRule}
        @delete-rule=${this._deleteRule}
        @move-rule=${this._moveRule}
        @edit-rule=${this._editRule}
      ></ambience-rules-list>
    `;
  }

  private _addRule() {
    if (!this._config) return;
    const blank: Rule = {
      when: { scene: null },
      actions: [],
    };
    this._config = {
      ...this._config,
      rules: [...this._config.rules, blank],
    };
    this._editingRuleIdx = this._config.rules.length - 1;
  }

  private _editRule(e: CustomEvent<{ index: number }>) {
    this._editingRuleIdx = e.detail.index;
  }

  private _saveRule(e: CustomEvent<Rule>) {
    if (!this._config || this._editingRuleIdx === null) return;
    const rules = [...this._config.rules];
    rules[this._editingRuleIdx] = e.detail;
    this._config = { ...this._config, rules };
    this._editingRuleIdx = null;
  }

  private _cancelRule() {
    this._editingRuleIdx = null;
  }

  private get _editingRule(): Rule | null {
    if (this._editingRuleIdx === null || !this._config) return null;
    return this._config.rules[this._editingRuleIdx] ?? null;
  }

  private get _activeMatcherInfos(): MatcherInfo[] {
    if (!this._config) return [];
    const active = new Set(this._config.matchers);
    return this._matchers.filter((m) => active.has(m.name));
  }

  private _deleteRule(e: CustomEvent<{ index: number }>) {
    if (!this._config) return;
    const rules = this._config.rules.filter((_, i) => i !== e.detail.index);
    this._config = { ...this._config, rules };
  }

  private _moveRule(e: CustomEvent<{ index: number; delta: number }>) {
    if (!this._config) return;
    const { index, delta } = e.detail;
    const target = index + delta;
    if (target < 0 || target >= this._config.rules.length) return;
    const rules = [...this._config.rules];
    [rules[index], rules[target]] = [rules[target], rules[index]];
    this._config = { ...this._config, rules };
  }
}
