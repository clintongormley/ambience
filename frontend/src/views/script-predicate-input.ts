import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { load as yamlLoad, dump as yamlDump } from "js-yaml";

import type { HassConnection } from "../api.js";
import { localize } from "../i18n.js";
import type { ScriptPredicate } from "../types.js";

type ScriptField = {
  name?: string;
  description?: string;
  required?: boolean;
  default?: unknown;
  selector?: Record<string, unknown>;
};

type ScriptDef = { fields?: Record<string, ScriptField> };

type HaFormSchema = {
  name: string;
  required?: boolean;
  selector: Record<string, unknown>;
};

@customElement("ambience-script-predicate-input")
export class AmbienceScriptPredicateInput extends LitElement {
  static override styles = css`
    :host { display: block; }
    .section { margin-bottom: 1rem; }
    .section h4 { margin: 0 0 0.5rem 0; font-size: 0.95em; }
    .tabs { display: flex; gap: 0.5rem; margin-bottom: 0.5rem; }
    .tabs button {
      background: transparent;
      border: 1px solid var(--divider-color, #ccc);
      padding: 0.25rem 0.6rem;
      border-radius: 4px;
      cursor: pointer;
      color: var(--primary-text-color, inherit);
    }
    .tabs button.active {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      border-color: transparent;
    }
    .tabs button[disabled] { opacity: 0.4; cursor: not-allowed; }
    .error {
      color: var(--error-color, #d32f2f);
      font-size: 0.85em;
      margin-top: 0.25rem;
      white-space: pre-wrap;
    }
  `;

  @property({ attribute: false }) hass?: HassConnection;
  @property({ attribute: false }) value: ScriptPredicate = null;

  @state() private _mode: "form" | "yaml" = "form";
  @state() private _yamlText = "";
  @state() private _yamlError: string | null = null;

  override willUpdate(changed: Map<string, unknown>) {
    super.willUpdate?.(changed);
    if (changed.has("value")) {
      // Keep the YAML buffer in sync with externally-driven value changes
      // (e.g. picker change while in form mode).
      if (this._mode === "form") this._yamlText = yamlDump(this.value ?? {});
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    this._yamlText = yamlDump(this.value ?? {});
    // Scripts with no fields can only be edited as YAML.
    const picked = this.value && typeof this.value === "object" ? this.value.script : null;
    const fields = this._fieldsFor(picked);
    if (picked && (!fields || Object.keys(fields).length === 0)) {
      this._mode = "yaml";
    }
  }

  _setMode(mode: "form" | "yaml") {
    if (mode === "form" && this._yamlError !== null) return;   // blocked while invalid
    if (mode === "yaml") this._yamlText = yamlDump(this.value ?? {});
    this._mode = mode;
  }

  _onYamlInput(text: string) {
    this._yamlText = text;
    let parsed: unknown;
    try {
      parsed = yamlLoad(text);
    } catch (e) {
      this._yamlError = (e as Error).message;
      return;
    }
    if (parsed === null || parsed === undefined) {
      this._yamlError = null;
      this._emit(null);
      return;
    }
    if (typeof parsed !== "object" || Array.isArray(parsed)) {
      this._yamlError = "Expected an object";
      return;
    }
    const obj = parsed as Record<string, unknown>;
    const script = obj.script;
    if (typeof script !== "string" || !script.startsWith("script.")) {
      this._yamlError = "`script` must be a 'script.<name>' string";
      return;
    }
    const args = obj.args;
    if (args !== undefined && (typeof args !== "object" || Array.isArray(args) || args === null)) {
      this._yamlError = "`args` must be an object if present";
      return;
    }
    this._yamlError = null;
    this._emit({ script, args: (args ?? {}) as Record<string, unknown> });
  }

  private _emit(next: ScriptPredicate) {
    this.value = next;
    this.dispatchEvent(new CustomEvent("value-changed", {
      detail: { value: this.value }, bubbles: true, composed: true,
    }));
  }

  /** All registered `script.*` services, sorted alphabetically by entity_id. */
  private _scriptIds(): string[] {
    const services = (this.hass as { services?: Record<string, Record<string, unknown>> } | undefined)?.services;
    const names = Object.keys(services?.script ?? {});
    return names.sort().map((n) => `script.${n}`);
  }

  /** Friendly name for a script entity, or the entity_id if unset. */
  private _label(entityId: string): string {
    const states = (this.hass as { states?: Record<string, { attributes?: Record<string, unknown> }> } | undefined)?.states;
    const fn = states?.[entityId]?.attributes?.friendly_name;
    return typeof fn === "string" && fn ? fn : entityId;
  }

  /** Look up the fields:{} block of the picked script, or undefined. */
  private _fieldsFor(scriptEntityId: string | null | undefined): Record<string, ScriptField> | undefined {
    if (!scriptEntityId) return undefined;
    const name = scriptEntityId.replace(/^script\./, "");
    const services = (this.hass as { services?: Record<string, Record<string, ScriptDef>> } | undefined)?.services;
    return services?.script?.[name]?.fields;
  }

  /** Seed an args dict from a script's field defaults. */
  private _defaultArgs(scriptEntityId: string): Record<string, unknown> {
    const fields = this._fieldsFor(scriptEntityId) ?? {};
    const out: Record<string, unknown> = {};
    for (const [name, f] of Object.entries(fields)) {
      if (f && Object.prototype.hasOwnProperty.call(f, "default")) {
        out[name] = (f as ScriptField).default;
      }
    }
    return out;
  }

  _pickerSchema(): HaFormSchema[] {
    return [{
      name: "script",
      selector: {
        select: {
          mode: "dropdown",
          options: this._scriptIds().map((id) => ({ value: id, label: this._label(id) })),
        },
      },
    }];
  }

  _pickScript(scriptEntityId: string | null) {
    if (!scriptEntityId) {
      this._emit(null);
      return;
    }
    this._emit({ script: scriptEntityId, args: this._defaultArgs(scriptEntityId) });
  }

  /** Build an ha-form schema reflecting the picked script's fields. */
  _argsSchema(): HaFormSchema[] {
    const fields = this._fieldsFor(this.value && typeof this.value === "object" ? this.value.script : null);
    if (!fields) return [];
    return Object.entries(fields).map(([name, f]) => ({
      name,
      required: f.required,
      description: f.description ? { suffix: f.description } : undefined,
      selector: f.selector ?? { text: {} },
    } as HaFormSchema & { description?: { suffix: string } }));
  }

  /** Merge edited args into the predicate and emit. */
  _updateArgs(args: Record<string, unknown>) {
    if (!this.value || typeof this.value !== "object") return;
    this._emit({ script: this.value.script, args });
  }

  override render() {
    const picked = (this.value && typeof this.value === "object") ? this.value.script : null;
    const schema = this._argsSchema();
    const args = (this.value && typeof this.value === "object" ? this.value.args : {}) ?? {};
    const hasFields = schema.length > 0;
    return html`
      <div class="section">
        <h4>${localize(this.hass, "ui.script", "Script")}</h4>
        ${this._renderPicker(picked)}
      </div>
      ${picked ? html`
        <div class="tabs">
          <button
            type="button"
            ?disabled=${!hasFields || this._yamlError !== null}
            title=${this._yamlError ?? ""}
            class=${this._mode === "form" ? "active" : ""}
            @click=${() => this._setMode("form")}
          >${localize(this.hass, "ui.form", "Form")}</button>
          <button
            type="button"
            class=${this._mode === "yaml" ? "active" : ""}
            @click=${() => this._setMode("yaml")}
          >${localize(this.hass, "ui.yaml", "YAML")}</button>
        </div>
      ` : ""}
      ${picked && this._mode === "form" && hasFields ? html`
        <div class="section args">
          <h4>${localize(this.hass, "ui.arguments", "Arguments")}</h4>
          ${this._renderArgs(schema, args)}
        </div>
      ` : ""}
      ${picked && this._mode === "yaml" ? this._renderYaml() : ""}
    `;
  }

  /* v8 ignore start -- ha-code-editor path (real HA only) */
  private _renderYaml() {
    const onInput = (e: Event) => {
      const raw = ((e.target as HTMLTextAreaElement).value ?? (e as unknown as CustomEvent<{ value: string }>).detail?.value ?? "") as string;
      this._onYamlInput(raw);
    };
    if (customElements.get("ha-code-editor")) {
      return html`
        <ha-code-editor mode="yaml" .value=${this._yamlText} @value-changed=${onInput}></ha-code-editor>
        ${this._yamlError ? html`<div class="error">${this._yamlError}</div>` : ""}
      `;
    }
    /* v8 ignore stop */
    return html`
      <textarea
        rows="6"
        style="width:100%;font-family:monospace;"
        .value=${this._yamlText}
        @input=${onInput}
      ></textarea>
      ${this._yamlError ? html`<div class="error">${this._yamlError}</div>` : ""}
    `;
  }

  /* v8 ignore start -- ha-form path (real HA only) */
  private _renderArgs(schema: HaFormSchema[], args: Record<string, unknown>) {
    if (customElements.get("ha-form")) {
      return html`<ha-form
        .hass=${this.hass}
        .schema=${schema}
        .data=${args}
        @value-changed=${(e: CustomEvent<{ value: Record<string, unknown> }>) => {
          e.stopPropagation();
          this._updateArgs(e.detail.value);
        }}
      ></ha-form>`;
    }
    /* v8 ignore stop */
    // jsdom fallback: native inputs (keyed by field type) so headless tests
    // can still drive the component.
    return html`${schema.map((s) => {
      const v = args[s.name];
      return html`
        <label style="display:block;margin-bottom:0.4rem;">
          <span style="display:inline-block;min-width:8em;">${s.name}</span>
          <input
            .value=${v == null ? "" : String(v)}
            @change=${(e: Event) => {
              const raw = (e.target as HTMLInputElement).value;
              const next = { ...args, [s.name]: raw };
              this._updateArgs(next);
            }}
          />
        </label>
      `;
    })}`;
  }

  /* v8 ignore start -- ha-form path (real HA only) */
  private _renderPicker(picked: string | null) {
    if (customElements.get("ha-form")) {
      return html`<ha-form
        .hass=${this.hass}
        .schema=${this._pickerSchema()}
        .data=${{ script: picked ?? "" }}
        .computeLabel=${() => ""}
        @value-changed=${(e: CustomEvent<{ value: { script?: string } }>) => {
          e.stopPropagation();
          this._pickScript(e.detail.value.script || null);
        }}
      ></ha-form>`;
    }
    /* v8 ignore stop */
    return html`<select
      @change=${(e: Event) => this._pickScript((e.target as HTMLSelectElement).value || null)}>
      <option value="" ?selected=${!picked}>(none)</option>
      ${this._scriptIds().map((id) => html`<option value=${id} ?selected=${id === picked}>${this._label(id)}</option>`)}
    </select>`;
  }
}
