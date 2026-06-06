import { css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { localize } from "../i18n.js";
import type { LuxRangeDef } from "../types.js";
import { AmbienceNamedDefEditModal, MODAL_STYLES } from "./named-def-edit-modal.js";

/**
 * Modal form for adding or editing a lux range. Emits `lux-range-save` with
 * `{ id, definition }` on commit, `lux-range-cancel` on dismiss. Shared modal
 * scaffolding lives in {@link AmbienceNamedDefEditModal}; this class adds the
 * half-open `min`/`max` band inputs.
 */
@customElement("ambience-lux-edit-modal")
export class AmbienceLuxEditModal extends AmbienceNamedDefEditModal<LuxRangeDef> {
  static override styles = [
    MODAL_STYLES,
    css`
      .row { display: flex; gap: 1rem; }
      .row .field { flex: 1; }
    `,
  ];

  @property({ attribute: false }) initial: LuxRangeDef = { min: 0, max: 100, label: null };

  @state() private _min: number | null = null;
  @state() private _max: number | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    this._min = this.initial.min ?? null;
    this._max = this.initial.max ?? null;
  }

  protected get _saveEvent() {
    return "lux-range-save";
  }
  protected get _cancelEvent() {
    return "lux-range-cancel";
  }
  protected _addTitle() {
    return localize(this.hass, "ui.lux_modal_add_title", "Add custom lux range");
  }
  protected _editTitleTemplate() {
    return localize(this.hass, "ui.lux_modal_edit_title", 'Edit "{name}"');
  }
  protected _namePlaceholder() {
    return localize(this.hass, "ui.lux_name_placeholder", "e.g. Gloomy");
  }
  protected _initialLabel() {
    return this.initial.label;
  }

  private _onMinInput(e: Event) {
    const raw = (e.target as HTMLInputElement).value;
    this._min = raw === "" ? null : Number(raw);
  }
  private _onMaxInput(e: Event) {
    const raw = (e.target as HTMLInputElement).value;
    this._max = raw === "" ? null : Number(raw);
  }

  protected _renderFields() {
    return html`
      <div class="row">
        <div class="field">
          <label for="min">${localize(this.hass, "ui.lux_min_label", "Min (lx)")}</label>
          <input id="min" type="number" min="0" step="1" .value=${this._min == null ? "" : String(this._min)}
            @input=${this._onMinInput} placeholder=${localize(this.hass, "ui.lux_min_placeholder", "0")} />
        </div>
        <div class="field">
          <label for="max">${localize(this.hass, "ui.lux_max_label", "Max (lx)")}</label>
          <input id="max" type="number" min="0" step="1" .value=${this._max == null ? "" : String(this._max)}
            @input=${this._onMaxInput} placeholder=${localize(this.hass, "ui.lux_max_placeholder", "∞")} />
        </div>
      </div>
    `;
  }

  protected _validateDef() {
    if (this._min == null && this._max == null)
      return localize(this.hass, "ui.lux_error_need_bound", "Enter a min, a max, or both.");
    if ((this._min != null && this._min < 0) || (this._max != null && this._max < 0))
      return localize(this.hass, "ui.lux_error_negative", "Bounds must be 0 or greater.");
    if (this._min != null && this._max != null && this._min >= this._max)
      return localize(this.hass, "ui.lux_error_order", "Min must be less than max.");
    return "";
  }

  protected _buildDefinition(): LuxRangeDef {
    const definition: LuxRangeDef = { label: this._label.trim() || null };
    if (this._min != null) definition.min = this._min;
    if (this._max != null) definition.max = this._max;
    return definition;
  }
}
