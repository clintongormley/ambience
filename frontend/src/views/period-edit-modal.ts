import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import type { PeriodDef, TimeEndpoint } from "../types.js";
import "./time-endpoint.js";

const ID_RE = /^[a-z][a-z0-9_]*$/;

/**
 * Modal form for adding or editing a period. Emits `period-save` with
 * `{ id, definition }` on commit, `period-cancel` on dismiss.
 *
 * For Edit mode, pass `existingId` (readonly); the id field is hidden.
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

  @state() private _id = "";
  @state() private _label = "";
  @state() private _def: PeriodDef = this.initial;
  @state() private _error = "";

  override connectedCallback(): void {
    super.connectedCallback();
    this._id = this.existingId ?? "";
    this._label = this.initial.label ?? "";
    this._def = this.initial;
  }

  private _onIdInput(e: Event) {
    this._id = (e.target as HTMLInputElement).value;
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

  private _validate(): string {
    if (!this.existingId) {
      if (!ID_RE.test(this._id)) {
        return "Id must be lowercase, start with a letter, and contain only letters, digits, and underscores.";
      }
      if (this.takenIds.has(this._id)) {
        return "An id already exists with this name. To shadow a built-in, use Edit on the built-in row.";
      }
    }
    return "";
  }

  private _onSave() {
    const err = this._validate();
    if (err) {
      this._error = err;
      // Flush synchronously so the updated error message is in the DOM
      // immediately (tests may read shadowRoot without awaiting updateComplete).
      this.performUpdate();
      return;
    }
    const id = this.existingId ?? this._id;
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
    return html`
      <div class="modal" role="dialog" aria-modal="true">
        <h3>${this.existingId ? `Edit ${this.existingId}` : "Add custom period"}</h3>
        ${!this.existingId ? html`
          <div class="field">
            <label for="id">Id</label>
            <input id="id" type="text" .value=${this._id} @input=${this._onIdInput} placeholder="e.g. wind_down" />
          </div>` : ""}
        <div class="field">
          <label for="label">Label (display name)</label>
          <input id="label" type="text" .value=${this._label} @input=${this._onLabelInput} placeholder="e.g. Wind down" />
        </div>
        <div class="row">
          <label style="min-width: 3em;">From</label>
          <ambience-time-endpoint .hass=${this.hass} .value=${this._def.from} @value-changed=${this._onFromChange}></ambience-time-endpoint>
        </div>
        <div class="row">
          <label style="min-width: 3em;">To</label>
          <ambience-time-endpoint .hass=${this.hass} .value=${this._def.to} @value-changed=${this._onToChange}></ambience-time-endpoint>
        </div>
        <div class="error">${this._error}</div>
        <div class="actions">
          <button @click=${this._onCancel}>Cancel</button>
          <button @click=${this._onSave}>Save</button>
        </div>
      </div>
    `;
  }
}
