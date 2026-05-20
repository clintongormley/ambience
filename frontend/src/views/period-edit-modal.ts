import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import type { PeriodDef, TimeEndpoint } from "../types.js";
import { localize } from "../i18n.js";
import "./time-endpoint.js";

const ID_RE = /^[a-z][a-z0-9_]*$/;

function _labelToId(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")   // any run of non-[a-z0-9] → single underscore
    .replace(/^_+|_+$/g, "");      // trim leading/trailing underscores
}

/**
 * Modal form for adding or editing a period. Emits `period-save` with
 * `{ id, definition }` on commit, `period-cancel` on dismiss.
 *
 * For Edit mode, pass `existingId` (readonly); the id is preserved as-is.
 * In Add mode the id is derived automatically from the entered name.
 */
@customElement("ambience-period-edit-modal")
export class AmbiencePeriodEditModal extends LitElement {
  static override styles = css`
    :host {
      position: fixed; inset: 0;
      display: flex; align-items: center; justify-content: center;
      background: rgba(0,0,0,0.45); z-index: 1000;
    }
    .modal {
      background: var(--card-background-color, #fff);
      border-radius: 8px; padding: 1.5rem;
      max-width: 500px; width: 90%;
      display: flex; flex-direction: column; gap: 1rem;
    }
    h3 { margin: 0; }
    .field { display: flex; flex-direction: column; gap: 0.3rem; }
    label { font-size: 0.85em; color: var(--secondary-text-color); }
    input[type="text"] {
      padding: 0.5rem; border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px; background: var(--card-background-color, #fff); color: inherit;
    }
    .row { display: flex; align-items: center; gap: 0.5rem; }
    .error { color: var(--error-color, #c00); font-size: 0.85em; min-height: 1em; }
    .actions { display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 0.5rem; }
    button { padding: 0.5rem 1rem; cursor: pointer; }
  `;

  @property({ attribute: false }) hass?: { localize?: (k: string) => string | undefined; [key: string]: unknown };
  @property({ attribute: false }) existingId?: string;
  @property({ attribute: false }) initial: PeriodDef = {
    from: { kind: "time", hh: 9, mm: 0 },
    to:   { kind: "time", hh: 17, mm: 0 },
    label: null,
  };
  @property({ attribute: false }) takenIds: Set<string> = new Set();

  @state() private _label = "";
  @state() private _def: PeriodDef = this.initial;
  @state() private _error = "";

  override connectedCallback(): void {
    super.connectedCallback();
    this._label = this.initial.label ?? "";
    this._def = this.initial;
  }

  private _onLabelInput(e: Event) {
    this._label = (e.target as HTMLInputElement).value;
  }
  private _onFromChange(e: CustomEvent<{ value: TimeEndpoint }>) {
    e.stopPropagation();
    this._def = { ...this._def, from: e.detail.value };
  }
  private _onToChange(e: CustomEvent<{ value: TimeEndpoint }>) {
    e.stopPropagation();
    this._def = { ...this._def, to: e.detail.value };
  }

  private _validate(id: string): string {
    if (!this.existingId) {
      if (!this._label.trim()) return localize(this.hass, "ui.error_enter_name", "Please enter a name.");
      if (!id) return localize(this.hass, "ui.error_start_letter", "Name must start with a letter.");
      if (!ID_RE.test(id)) return localize(this.hass, "ui.error_start_letter", "Name must start with a letter.");
      if (this.takenIds.has(id)) return localize(this.hass, "ui.error_name_exists", "A period with this name already exists. Choose a different name.");
    }
    return "";
  }

  private _onSave() {
    const id = this.existingId ?? _labelToId(this._label);
    const err = this._validate(id);
    if (err) {
      this._error = err;
      // Flush synchronously so the updated error message is in the DOM
      // immediately (tests may read shadowRoot without awaiting updateComplete).
      this.performUpdate();
      return;
    }
    const definition: PeriodDef = {
      from: this._def.from,
      to:   this._def.to,
      label: this._label.trim() || null,
    };
    this.dispatchEvent(new CustomEvent("period-save", {
      detail: { id, definition },
      bubbles: true, composed: true,
    }));
  }

  private _onCancel() {
    this.dispatchEvent(new CustomEvent("period-cancel", {
      bubbles: true, composed: true,
    }));
  }

  override render() {
    const heading = this.existingId
      ? localize(this.hass, "ui.period_modal_edit_title", 'Edit "{name}"').replace("{name}", this.initial?.label ?? this.existingId)
      : localize(this.hass, "ui.period_modal_add_title", "Add custom period");
    return html`
      <div class="modal" role="dialog" aria-modal="true">
        <h3>${heading}</h3>
        <div class="field">
          <label for="label">${localize(this.hass, "ui.name", "Name")}</label>
          <input id="label" type="text" .value=${this._label} @input=${this._onLabelInput} placeholder=${localize(this.hass, "ui.name_placeholder", "e.g. Wind down")} />
        </div>
        <div class="row">
          <label style="min-width: 3em;">${localize(this.hass, "ui.from_label", "From")}</label>
          <ambience-time-endpoint .hass=${this.hass} .value=${this._def.from} @value-changed=${this._onFromChange}></ambience-time-endpoint>
        </div>
        <div class="row">
          <label style="min-width: 3em;">${localize(this.hass, "ui.to_label", "To")}</label>
          <ambience-time-endpoint .hass=${this.hass} .value=${this._def.to} @value-changed=${this._onToChange}></ambience-time-endpoint>
        </div>
        <div class="error">${this._error}</div>
        <div class="actions">
          <button @click=${this._onCancel}>${localize(this.hass, "ui.cancel", "Cancel")}</button>
          <button @click=${this._onSave}>${localize(this.hass, "ui.save", "Save")}</button>
        </div>
      </div>
    `;
  }
}
