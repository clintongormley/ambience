import { type CSSResultGroup, css, html, LitElement, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { localize } from "../i18n.js";

const ID_RE = /^[a-z][a-z0-9_]*$/;

/** Derive a stable id from a free-text label: lowercase, runs of non-[a-z0-9]
 *  collapse to `_`, leading/trailing underscores trimmed. */
function labelToId(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

/** Styles shared by every named-definition edit modal. Subclasses append their
 *  own `.row` layout via `static styles = [MODAL_STYLES, css\`…\`]`. */
export const MODAL_STYLES = css`
  :host {
    position: fixed; inset: 0;
    display: flex; align-items: center; justify-content: center;
    background: rgba(0, 0, 0, 0.45); z-index: 1000;
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
  input {
    padding: 0.5rem; border: 1px solid var(--divider-color, #ccc);
    border-radius: 4px; background: var(--card-background-color, #fff); color: inherit;
  }
  .error { color: var(--error-color, #c00); font-size: 0.85em; min-height: 1em; }
  .actions { display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 0.5rem; }
  button { padding: 0.5rem 1rem; cursor: pointer; }
`;

type WithLabel = { label?: string | null };

/**
 * Abstract base for "add / edit a named definition" modals (periods, lux
 * ranges). Owns the name field, id derivation, name validation, error display,
 * and the save/cancel scaffolding. Subclasses supply the definition-specific
 * fields, the build/validate of the definition, the event names, and the
 * titles. Emits the subclass's save event with `{ id, definition }` on commit.
 */
export abstract class AmbienceNamedDefEditModal<Def extends WithLabel> extends LitElement {
  static override styles: CSSResultGroup = MODAL_STYLES;

  @property({ attribute: false }) hass?: {
    localize?: (k: string) => string | undefined;
    [key: string]: unknown;
  };
  @property({ attribute: false }) existingId?: string;
  @property({ attribute: false }) takenIds: Set<string> = new Set();

  @state() protected _label = "";
  @state() protected _error = "";

  // --- subclass hooks ------------------------------------------------------
  protected abstract get _saveEvent(): string;
  protected abstract get _cancelEvent(): string;
  protected abstract _addTitle(): string;
  protected abstract _editTitleTemplate(): string; // localized, contains "{name}"
  protected abstract _namePlaceholder(): string;
  protected abstract _initialLabel(): string | null | undefined;
  protected abstract _renderFields(): TemplateResult;
  /** Validate the definition-specific fields; "" when valid. */
  protected abstract _validateDef(): string;
  protected abstract _buildDefinition(): Def;

  override connectedCallback(): void {
    super.connectedCallback();
    this._label = this._initialLabel() ?? "";
  }

  protected _onLabelInput(e: Event) {
    this._label = (e.target as HTMLInputElement).value;
  }

  private _validateName(id: string): string {
    if (this.existingId) return ""; // edit mode: id is readonly, name is free
    if (!this._label.trim())
      return localize(this.hass, "ui.error_enter_name", "Please enter a name.");
    if (!id || !ID_RE.test(id))
      return localize(this.hass, "ui.error_start_letter", "Name must start with a letter.");
    if (this.takenIds.has(id))
      return localize(
        this.hass,
        "ui.error_name_exists",
        "An entry with this name already exists. Choose a different name.",
      );
    return "";
  }

  private _onSave() {
    const id = this.existingId ?? labelToId(this._label);
    const err = this._validateName(id) || this._validateDef();
    if (err) {
      this._error = err;
      // Flush synchronously so the error is in the DOM immediately (tests may
      // read shadowRoot without awaiting updateComplete).
      this.performUpdate();
      return;
    }
    this.dispatchEvent(
      new CustomEvent(this._saveEvent, {
        detail: { id, definition: this._buildDefinition() },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _onCancel() {
    this.dispatchEvent(new CustomEvent(this._cancelEvent, { bubbles: true, composed: true }));
  }

  override render() {
    const heading = this.existingId
      ? this._editTitleTemplate().replace("{name}", this._initialLabel() ?? this.existingId)
      : this._addTitle();
    return html`
      <div class="modal" role="dialog" aria-modal="true">
        <h3>${heading}</h3>
        <div class="field">
          <label for="label">${localize(this.hass, "ui.name", "Name")}</label>
          <input id="label" type="text" .value=${this._label} @input=${this._onLabelInput}
            placeholder=${this._namePlaceholder()} />
        </div>
        ${this._renderFields()}
        <div class="error">${this._error}</div>
        <div class="actions">
          <button @click=${this._onCancel}>${localize(this.hass, "ui.cancel", "Cancel")}</button>
          <button @click=${this._onSave}>${localize(this.hass, "ui.save", "Save")}</button>
        </div>
      </div>
    `;
  }
}
