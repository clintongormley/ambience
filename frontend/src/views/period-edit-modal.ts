import { css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { localize } from "../i18n.js";
import type { PeriodDef, TimeEndpoint } from "../types.js";
import { AmbienceNamedDefEditModal, MODAL_STYLES } from "./named-def-edit-modal.js";
import "./time-endpoint.js";

/**
 * Modal form for adding or editing a period. Emits `period-save` with
 * `{ id, definition }` on commit, `period-cancel` on dismiss. Shared modal
 * scaffolding (name, id derivation, validation, actions) lives in
 * {@link AmbienceNamedDefEditModal}; this class adds the from/to endpoints.
 */
@customElement("ambience-period-edit-modal")
export class AmbiencePeriodEditModal extends AmbienceNamedDefEditModal<PeriodDef> {
  static override styles = [
    MODAL_STYLES,
    css`
      .row { display: flex; align-items: center; gap: 0.5rem; }
    `,
  ];

  @property({ attribute: false }) initial: PeriodDef = {
    from: { kind: "time", hh: 9, mm: 0 },
    to: { kind: "time", hh: 17, mm: 0 },
    label: null,
  };

  @state() private _def: PeriodDef = this.initial;

  override connectedCallback(): void {
    super.connectedCallback();
    this._def = this.initial;
  }

  protected get _saveEvent() {
    return "period-save";
  }
  protected get _cancelEvent() {
    return "period-cancel";
  }
  protected _addTitle() {
    return localize(this.hass, "ui.period_modal_add_title", "Add custom period");
  }
  protected _editTitleTemplate() {
    return localize(this.hass, "ui.period_modal_edit_title", 'Edit "{name}"');
  }
  protected _namePlaceholder() {
    return localize(this.hass, "ui.name_placeholder", "e.g. Wind down");
  }
  protected _initialLabel() {
    return this.initial.label;
  }

  private _onFromChange(e: CustomEvent<{ value: TimeEndpoint }>) {
    e.stopPropagation();
    this._def = { ...this._def, from: e.detail.value };
  }
  private _onToChange(e: CustomEvent<{ value: TimeEndpoint }>) {
    e.stopPropagation();
    this._def = { ...this._def, to: e.detail.value };
  }

  protected _renderFields() {
    return html`
      <div class="row">
        <label style="min-width: 3em;">${localize(this.hass, "ui.from_label", "From")}</label>
        <ambience-time-endpoint .hass=${this.hass} .value=${this._def.from} @value-changed=${this._onFromChange}></ambience-time-endpoint>
      </div>
      <div class="row">
        <label style="min-width: 3em;">${localize(this.hass, "ui.to_label", "To")}</label>
        <ambience-time-endpoint .hass=${this.hass} .value=${this._def.to} @value-changed=${this._onToChange}></ambience-time-endpoint>
      </div>
    `;
  }

  // Endpoints are always well-formed (the sub-component constrains them).
  protected _validateDef() {
    return "";
  }

  protected _buildDefinition(): PeriodDef {
    return { from: this._def.from, to: this._def.to, label: this._label.trim() || null };
  }
}
