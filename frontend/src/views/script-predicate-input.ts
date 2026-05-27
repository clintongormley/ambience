import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

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
  `;

  @property({ attribute: false }) hass?: HassConnection;
  @property({ attribute: false }) value: ScriptPredicate = null;

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

  override render() {
    const picked = (this.value && typeof this.value === "object") ? this.value.script : null;
    return html`
      <div class="section">
        <h4>${localize(this.hass, "ui.script", "Script")}</h4>
        ${this._renderPicker(picked)}
      </div>
    `;
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
