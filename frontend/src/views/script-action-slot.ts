import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import type { HassConnection } from "../api.js";
import { entitiesForScope } from "../entities-for-scope.js";
import { watchHaComponents } from "../ha-components.js";
import { localize } from "../i18n.js";
import type { Scope } from "../types.js";
import "./target-picker.js";

type ScriptField = {
  name?: string;
  description?: string;
  required?: boolean;
  default?: unknown;
  example?: unknown;
  selector?: Record<string, unknown>;
};

type ScriptServiceMeta = {
  name?: string;
  description?: string;
  fields?: Record<string, ScriptField>;
  target?: { entity?: { domain?: string | string[]; [k: string]: unknown }; [k: string]: unknown };
};

type EditMode = "ui" | "yaml";

/**
 * Body of a "script" action slot. Renders:
 *
 *   1. A script picker (always shown).
 *   2. UI | YAML mode toggle (local state; not persisted to ActionSpec).
 *   3. UI mode: an optional target picker (if the script defines a target)
 *      plus an optional fields form (if the script declares fields).
 *   4. YAML mode: a YAML editor over the combined object
 *      `{ entity_id?: [...], ...params }`.
 *
 * Events:
 *   - `script-changed`     { script: string }
 *   - `entity-ids-changed` { entityIds: string[] }
 *   - `params-changed`     { params: Record<string, unknown> }
 */
@customElement("ambience-script-action-slot")
export class AmbienceScriptActionSlot extends LitElement {
  static override styles = css`
    :host { display: block; }
    .script-picker {
      margin-bottom: 0.5rem;
    }
    label {
      display: block; font-weight: 600; margin: 0.5rem 0 0.25rem 0;
    }
    .mode-toggle {
      display: inline-flex;
      gap: 0;
      margin: 0.5rem 0;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      overflow: hidden;
    }
    .mode-toggle button {
      padding: 0.3rem 0.75rem;
      border: 0;
      background: transparent;
      color: inherit;
      cursor: pointer;
      font: inherit;
    }
    .mode-toggle button.active {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
    }
    .target-picker, .fields-form {
      margin-top: 0.5rem;
    }
    .not-found {
      color: var(--error-color, #c62828);
      font-size: 0.9em;
      padding: 0.3rem 0;
    }
    .yaml-error {
      color: var(--error-color, #c62828);
      font-size: 0.9em;
      padding: 0.3rem 0;
    }
    .no-params {
      color: var(--secondary-text-color, #888);
      font-style: italic;
      padding: 0.5rem 0;
    }
    input, select, textarea {
      width: 100%; box-sizing: border-box; padding: 0.5rem;
      border: 1px solid var(--divider-color, #ccc); border-radius: 4px;
      background: var(--card-background-color, #fff); color: inherit;
      font: inherit;
    }
    textarea {
      min-height: 8rem;
      font-family: monospace;
    }
    .field-row {
      margin-bottom: 0.5rem;
    }
  `;

  @property({ attribute: false }) hass?: HassConnection;
  @property({ attribute: false }) scope?: Scope;
  @property() script?: string;
  @property({ attribute: false }) entityIds: string[] = [];
  @property({ attribute: false }) params: Record<string, unknown> = {};

  @state() private _mode: EditMode = "ui";
  @state() private _yamlError: string | null = null;

  override connectedCallback() {
    super.connectedCallback();
    watchHaComponents(this, this.hass);
  }

  // --- helpers -------------------------------------------------------------

  private _scriptMeta(): ScriptServiceMeta | undefined {
    if (!this.script) return undefined;
    const objectId = this.script.includes(".") ? this.script.split(".").slice(1).join(".") : this.script;
    const services = (this.hass as any)?.services?.script as Record<string, ScriptServiceMeta> | undefined;
    return services?.[objectId];
  }

  private _emit(name: string, detail: Record<string, unknown>) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }

  // --- script picker -------------------------------------------------------

  private _onScriptPicked = (e: Event) => {
    e.stopPropagation();
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const value = target.value;
    if (!value) return;
    this._emit("script-changed", { script: value });
  };

  /* v8 ignore start -- ha-form is eagerly registered in HA 2026.05+, not in jsdom */
  private _onScriptPickedHaForm = (e: CustomEvent<{ value: { script: string } }>) => {
    e.stopPropagation();
    const value = e.detail.value?.script ?? "";
    if (!value) return;
    this._emit("script-changed", { script: value });
  };
  /* v8 ignore stop */

  private _renderScriptPicker() {
    /* v8 ignore start -- ha-form path (real HA only) */
    if (customElements.get("ha-form")) {
      const schema = [{
        name: "script",
        selector: { entity: { filter: { domain: "script" } } },
      }];
      return html`
        <div class="script-picker">
          <label>${localize(this.hass, "ui.script_entity", "Script")}</label>
          <ha-form
            .hass=${this.hass}
            .schema=${schema}
            .data=${{ script: this.script ?? "" }}
            .computeLabel=${() => ""}
            @value-changed=${this._onScriptPickedHaForm}
          ></ha-form>
        </div>
      `;
    }
    /* v8 ignore stop */
    // Fallback: a select listing script.* entities from hass.entities (or a
    // plain text input if none are visible).
    const candidates = this._scriptCandidates();
    if (candidates.length === 0) {
      return html`
        <div class="script-picker">
          <label>${localize(this.hass, "ui.script_entity", "Script")}</label>
          <input
            type="text"
            placeholder="script.foo"
            .value=${this.script ?? ""}
            @change=${this._onScriptPicked}
          />
        </div>
      `;
    }
    return html`
      <div class="script-picker">
        <label>${localize(this.hass, "ui.script_entity", "Script")}</label>
        <select @change=${this._onScriptPicked}>
          <option value="">${localize(this.hass, "ui.pick_script", "— select a script —")}</option>
          ${candidates.map((s) => html`
            <option value=${s} ?selected=${s === this.script}>${s}</option>
          `)}
        </select>
      </div>
    `;
  }

  private _scriptCandidates(): string[] {
    const services = (this.hass as any)?.services?.script as Record<string, unknown> | undefined;
    if (services) {
      return Object.keys(services).map((id) => `script.${id}`).sort();
    }
    /* v8 ignore start -- hass.entities-only path; tests stub services */
    const entities = (this.hass as any)?.entities as Record<string, { entity_id: string }> | undefined;
    if (!entities) return [];
    return Object.keys(entities)
      .filter((id) => id.startsWith("script."))
      .sort();
    /* v8 ignore stop */
  }

  // --- mode toggle ---------------------------------------------------------

  private _setMode(mode: EditMode) {
    this._mode = mode;
    this._yamlError = null;
  }

  private _renderModeToggle() {
    return html`
      <div class="mode-toggle">
        <button
          class=${this._mode === "ui" ? "active" : ""}
          @click=${() => this._setMode("ui")}
        >UI</button>
        <button
          class=${this._mode === "yaml" ? "active" : ""}
          @click=${() => this._setMode("yaml")}
        >YAML</button>
      </div>
    `;
  }

  // --- UI mode -------------------------------------------------------------

  private _targetEntities(meta: ScriptServiceMeta): string[] {
    const targetDomain = meta.target?.entity?.domain;
    let domains: string[];
    if (Array.isArray(targetDomain)) domains = targetDomain;
    else if (typeof targetDomain === "string") domains = [targetDomain];
    else {
      // No domain restriction → accept all domains visible in the area.
      const entities = (this.hass as any)?.entities as Record<string, { entity_id: string }> | undefined;
      const seen = new Set<string>();
      for (const id of Object.keys(entities ?? {})) {
        const dom = id.split(".")[0];
        if (dom) seen.add(dom);
      }
      domains = [...seen];
    }
    if (!this.scope) return [];
    return entitiesForScope(this.hass as any, this.scope, domains);
  }

  private _onTargetChanged = (e: CustomEvent<{ value: string[] }>) => {
    e.stopPropagation();
    this._emit("entity-ids-changed", { entityIds: e.detail.value });
  };

  private _renderTargetPicker(meta: ScriptServiceMeta) {
    if (!meta.target || Object.keys(meta.target).length === 0) return "";
    const entities = this._targetEntities(meta);
    const label = localize(this.hass, "ui.target", "Target");
    return html`
      <div class="target-picker">
        <ambience-target-picker
          .hass=${this.hass}
          .entities=${entities}
          .value=${this.entityIds}
          .label=${label}
          @value-changed=${this._onTargetChanged}
        ></ambience-target-picker>
      </div>
    `;
  }

  private _fieldLabel(key: string, field: ScriptField): string {
    if (field.name) return field.name;
    const spaced = key.replaceAll("_", " ").toLowerCase();
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
  }

  private _onFieldInput = (key: string) => (e: Event) => {
    e.stopPropagation();
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const next = { ...this.params, [key]: target.value };
    this._emit("params-changed", { params: next });
  };

  /* v8 ignore start -- ha-form path (real HA only) */
  private _onFieldsHaFormChanged = (e: CustomEvent<{ value: Record<string, unknown> }>) => {
    e.stopPropagation();
    this._emit("params-changed", { params: { ...this.params, ...e.detail.value } });
  };
  /* v8 ignore stop */

  private _renderFieldsForm(meta: ScriptServiceMeta) {
    const fields = meta.fields;
    if (!fields || Object.keys(fields).length === 0) return "";
    /* v8 ignore start -- ha-form path (real HA only) */
    if (customElements.get("ha-form")) {
      const schema = Object.entries(fields).map(([key, field]) => ({
        name: key,
        required: !!field.required,
        default: field.default,
        description: { suggested_value: field.default },
        selector: field.selector ?? { text: {} },
      }));
      const data: Record<string, unknown> = {};
      for (const [key, field] of Object.entries(fields)) {
        data[key] = this.params[key] ?? field.default ?? "";
      }
      return html`
        <div class="fields-form">
          <ha-form
            .hass=${this.hass}
            .schema=${schema}
            .data=${data}
            @value-changed=${this._onFieldsHaFormChanged}
          ></ha-form>
        </div>
      `;
    }
    /* v8 ignore stop */
    // Fallback: plain inputs (text). Good enough for jsdom + emergency fallback.
    return html`
      <div class="fields-form">
        ${Object.entries(fields).map(([key, field]) => html`
          <div class="field-row">
            <label>${this._fieldLabel(key, field)}${field.required ? " *" : ""}</label>
            <input
              type="text"
              placeholder=${field.description ?? ""}
              .value=${String(this.params[key] ?? "")}
              @input=${this._onFieldInput(key)}
            />
          </div>
        `)}
      </div>
    `;
  }

  private _renderUiMode() {
    if (!this.script) return "";
    const meta = this._scriptMeta();
    if (!meta) {
      return html`
        <div class="not-found">
          ${localize(this.hass, "ui.script_not_found_prefix", "Script")}
          <code>${this.script}</code>
          ${localize(this.hass, "ui.script_not_found_suffix", "not found. It may have been removed.")}
        </div>
        ${this._renderYamlEditor()}
      `;
    }
    const targetSection = this._renderTargetPicker(meta);
    const fieldsSection = this._renderFieldsForm(meta);
    if (targetSection === "" && fieldsSection === "") {
      return html`<div class="no-params">${localize(this.hass, "ui.script_no_parameters", "This script has no parameters.")}</div>`;
    }
    return html`${targetSection}${fieldsSection}`;
  }

  // --- YAML mode -----------------------------------------------------------

  private _combinedObject(): Record<string, unknown> {
    const combined: Record<string, unknown> = { ...this.params };
    if (this.entityIds.length > 0) combined.entity_id = this.entityIds;
    return combined;
  }

  private _serializeYaml(): string {
    return JSON.stringify(this._combinedObject(), null, 2);
  }

  private _onYamlInput = (e: Event) => {
    e.stopPropagation();
    const target = e.target as HTMLTextAreaElement;
    const raw = target.value;
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      this._yamlError = err instanceof Error ? err.message : String(err);
      return;
    }
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      this._yamlError = localize(this.hass, "ui.yaml_must_be_object", "Top-level value must be a mapping.");
      return;
    }
    this._yamlError = null;
    const obj = parsed as Record<string, unknown>;
    const { entity_id, ...rest } = obj;
    const entityIds = Array.isArray(entity_id)
      ? (entity_id as unknown[]).filter((x) => typeof x === "string") as string[]
      : (typeof entity_id === "string" ? [entity_id] : []);
    this._emit("entity-ids-changed", { entityIds });
    this._emit("params-changed", { params: rest });
  };

  /* v8 ignore start -- ha-yaml-editor not registered in jsdom */
  private _onHaYamlChanged = (e: CustomEvent<{ value: unknown; isValid?: boolean }>) => {
    e.stopPropagation();
    if (e.detail.isValid === false) {
      this._yamlError = localize(this.hass, "ui.invalid_yaml", "Invalid YAML.");
      return;
    }
    const parsed = e.detail.value;
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      this._yamlError = localize(this.hass, "ui.yaml_must_be_object", "Top-level value must be a mapping.");
      return;
    }
    this._yamlError = null;
    const obj = parsed as Record<string, unknown>;
    const { entity_id, ...rest } = obj;
    const entityIds = Array.isArray(entity_id)
      ? (entity_id as unknown[]).filter((x) => typeof x === "string") as string[]
      : (typeof entity_id === "string" ? [entity_id] : []);
    this._emit("entity-ids-changed", { entityIds });
    this._emit("params-changed", { params: rest });
  };
  /* v8 ignore stop */

  private _renderYamlEditor() {
    if (customElements.get("ha-yaml-editor")) {
      return html`
        <ha-yaml-editor
          .hass=${this.hass}
          .value=${this._combinedObject()}
          @value-changed=${this._onHaYamlChanged}
        ></ha-yaml-editor>
        ${this._yamlError ? html`<div class="yaml-error">${this._yamlError}</div>` : ""}
      `;
    }
    return html`
      <textarea
        spellcheck="false"
        .value=${this._serializeYaml()}
        @input=${this._onYamlInput}
      ></textarea>
      ${this._yamlError ? html`<div class="yaml-error">${this._yamlError}</div>` : ""}
    `;
  }

  // --- render --------------------------------------------------------------

  override render() {
    return html`
      ${this._renderScriptPicker()}
      ${this._renderModeToggle()}
      ${this._mode === "ui" ? this._renderUiMode() : this._renderYamlEditor()}
    `;
  }
}
