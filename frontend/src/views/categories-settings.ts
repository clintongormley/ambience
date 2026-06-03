import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { deleteCategory, type HassConnection, listCategories, saveCategories } from "../api.js";
import { CATEGORY_COLORS, colorHex } from "../category-colors.js";
import { localize } from "../i18n.js";
import type { SceneCategory } from "../types.js";

@customElement("ambience-categories-settings")
export class AmbienceCategoriesSettings extends LitElement {
  static override styles = css`
    :host { display: block; }
    .list {
      display: flex; flex-direction: column;
      margin-bottom: 0.75rem;
    }
    button.category-row {
      display: flex; align-items: center; gap: 1rem;
      width: 100%; text-align: left;
      background: none; border: none; border-top: 1px solid var(--divider-color, #e0e0e0);
      padding: 0.75rem 0.5rem; cursor: pointer; color: inherit; font: inherit;
    }
    button.category-row:last-of-type { border-bottom: 1px solid var(--divider-color, #e0e0e0); }
    .row-icon {
      flex: 0 0 1.5rem; display: inline-flex; justify-content: center;
      color: var(--secondary-text-color, #555);
    }
    .row-icon ha-icon { --mdc-icon-size: 24px; }
    .row-swatch {
      flex: 0 0 auto; width: 1.75rem; height: 1.75rem; border-radius: 8px;
      background: var(--secondary-background-color, #e0e0e0);
    }
    .row-swatch.none { background: transparent; border: 1px dashed var(--divider-color, #ccc); }
    .row-name { flex: 1; }
    button.add {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      border: none;
      padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;
    }
    .error { color: var(--error-color, #d32f2f); }

    /* Modal overlay (mirrors ambience-scene-editor) */
    .overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.4); z-index: 100;
      display: flex; align-items: center; justify-content: center;
    }
    .modal {
      background: var(--card-background-color, #fff); color: inherit;
      width: 90%; max-width: 28rem;
      max-height: 90vh; overflow-y: auto;
      border-radius: 6px;
      display: flex; flex-direction: column;
    }
    .modal-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
    }
    .modal-header h3 { margin: 0; }
    .modal-content { padding: 1.5rem; }
    .modal-footer {
      display: flex; justify-content: space-between; gap: 0.5rem;
      padding: 1rem 1.5rem;
      border-top: 1px solid var(--divider-color, #e0e0e0);
    }
    .modal-footer .right { display: flex; gap: 0.5rem; }
    label {
      display: block; font-weight: 600; margin: 0.75rem 0 0.25rem 0;
    }
    input.name, input.icon-input {
      width: 100%; box-sizing: border-box; padding: 0.5rem;
      border: 1px solid var(--divider-color, #ccc); border-radius: 4px;
      background: var(--card-background-color, #fff); color: inherit;
    }
    .swatches {
      display: grid; grid-template-columns: repeat(auto-fill, 2rem);
      gap: 0.4rem; margin-top: 0.25rem;
    }
    button.swatch {
      width: 2rem; height: 2rem; padding: 0;
      border: 2px solid transparent; border-radius: 50%;
      cursor: pointer;
    }
    button.swatch.selected {
      border-color: var(--primary-text-color, #000);
      box-shadow: 0 0 0 1px var(--card-background-color, #fff);
    }
    button.swatch.none {
      background: var(--secondary-background-color, #e0e0e0);
      color: var(--secondary-text-color, #888);
      border: 1px dashed var(--divider-color, #ccc);
      display: inline-flex; align-items: center; justify-content: center;
      font-size: 0.7em;
    }
    button.close {
      background: none; border: none; cursor: pointer;
      color: var(--secondary-text-color, #888); font-size: 1.2em;
      padding: 0; line-height: 1;
    }
    button {
      padding: 0.5rem 1rem; border: 0; border-radius: 4px; cursor: pointer;
    }
    .modal-footer .primary {
      background: var(--primary-color, #03a9f4); color: var(--text-primary-color, #fff);
    }
    .modal-footer .delete {
      background: transparent; color: var(--error-color, #d32f2f);
      border: 1px solid var(--error-color, #d32f2f);
    }
    .modal-error {
      color: var(--error-color, #d32f2f); margin-top: 0.75rem; font-size: 0.9em;
    }
  `;

  @property({ attribute: false }) hass!: HassConnection;
  @state() private _categories: SceneCategory[] = [];
  @state() private _error = "";
  // The draft being edited; null = modal closed. When the draft's id matches an
  // existing category it's an edit, otherwise it's a new category.
  @state() private _editing: SceneCategory | null = null;
  // Validation error shown inside the open modal.
  @state() private _modalError = "";

  override async connectedCallback() {
    super.connectedCallback();
    try {
      this._categories = await listCategories(this.hass);
    } catch (e) {
      this._error = (e as Error).message || String(e);
    }
  }

  /** Categories shown alphabetically by name. */
  private _sorted(): SceneCategory[] {
    return [...this._categories].sort((a, b) => a.name.localeCompare(b.name));
  }

  /** Validate the draft against the OTHER categories; returns a localized error
   *  message, or "" if OK. */
  private _validate(draft: SceneCategory): string {
    const name = draft.name.trim();
    if (name === "") {
      return localize(this.hass, "ui.category_name_blank_error", "Category names can't be empty.");
    }
    const key = name.toLocaleLowerCase();
    const clash = this._categories.some(
      (g) => g.id !== draft.id && g.name.trim().toLocaleLowerCase() === key,
    );
    if (clash) {
      return localize(
        this.hass,
        "ui.category_name_duplicate_error",
        "Two categories can't have the same name.",
      );
    }
    return "";
  }

  // --- modal open/close ---

  _openEditor(category: SceneCategory) {
    // Edit an existing category: work on a copy so cancelling discards changes.
    this._editing = { ...category };
    this._modalError = "";
  }

  _addCategory() {
    // New categories start blank; not persisted until given a valid, unique name.
    const id = crypto.randomUUID().replace(/-/g, "");
    this._editing = { id, name: "" };
    this._modalError = "";
  }

  private _closeModal() {
    this._editing = null;
    this._modalError = "";
  }

  // --- draft mutation ---

  private _patchDraft(patch: Partial<SceneCategory>) {
    if (!this._editing) return;
    this._editing = { ...this._editing, ...patch };
  }

  private _onName(e: Event) {
    this._patchDraft({ name: (e.target as HTMLInputElement).value });
  }

  private _onIcon(icon: string) {
    this._patchDraft({ icon: icon || undefined });
  }

  private _onColor(color: string | undefined) {
    this._patchDraft({ color });
  }

  // --- persist ---

  _save() {
    if (!this._editing) return;
    const error = this._validate(this._editing);
    if (error) {
      this._modalError = error;
      return;
    }
    const draft = { ...this._editing, name: this._editing.name.trim() };
    const exists = this._categories.some((g) => g.id === draft.id);
    this._categories = exists
      ? this._categories.map((g) => (g.id === draft.id ? draft : g))
      : [...this._categories, draft];
    this._closeModal();
    void saveCategories(this.hass, this._categories)
      .then(() => {
        // Tell the scopes view to re-fetch so the scene list + editor pick up
        // the edit (mirrors the exposed-actions-changed pattern).
        window.dispatchEvent(new CustomEvent("ambience-categories-changed"));
      })
      .catch((e) => {
        this._error = (e as Error).message || String(e);
      });
  }

  _deleteCategory() {
    if (!this._editing) return;
    const id = this._editing.id;
    if (this._categories.length <= 1) {
      this._modalError = localize(
        this.hass,
        "ui.category_delete_blocked_last",
        "You can't delete the last category.",
      );
      return;
    }
    // Optimistic local removal, but keep the modal open until the server
    // confirms. If the server refuses (category still has scenes), restore and
    // show the reason — do not close.
    const previous = this._categories;
    this._categories = this._categories.filter((g) => g.id !== id);
    void deleteCategory(this.hass, id)
      .then(() => {
        this._closeModal();
        window.dispatchEvent(new CustomEvent("ambience-categories-changed"));
      })
      .catch((e) => {
        this._categories = previous;
        // The backend tags its refusals with stable error codes; localize the
        // known ones, and fall back to the raw message for anything unexpected.
        // `category_last` can still arrive despite the client-side guard above
        // when another client deletes a category concurrently (a delete race).
        const code = (e as { code?: string }).code;
        if (code === "category_in_use") {
          this._modalError = localize(
            this.hass,
            "ui.category_delete_blocked_in_use",
            "This category still has scenes — move or delete them first.",
          );
        } else if (code === "category_last") {
          this._modalError = localize(
            this.hass,
            "ui.category_delete_blocked_last",
            "You can't delete the last category.",
          );
        } else {
          this._modalError = (e as Error).message || String(e);
        }
      });
  }

  // --- rendering ---

  private _renderIconField() {
    /* v8 ignore next 9 -- ha-icon-picker only in real HA; jsdom uses the native fallback */
    if (customElements.get("ha-icon-picker")) {
      return html`<ha-icon-picker
        .hass=${this.hass}
        .value=${this._editing!.icon ?? ""}
        @value-changed=${(e: CustomEvent<{ value: string }>) => {
          e.stopPropagation();
          this._onIcon(e.detail.value);
        }}
      ></ha-icon-picker>`;
    }
    return html`<input
      class="icon-input"
      .value=${this._editing!.icon ?? ""}
      placeholder=${localize(this.hass, "ui.category_icon", "Icon")}
      @change=${(e: Event) => this._onIcon((e.target as HTMLInputElement).value)}
    />`;
  }

  private _renderSwatches() {
    const current = this._editing!.color;
    return html`
      <div class="swatches">
        ${CATEGORY_COLORS.map(
          (c) => html`<button
            type="button"
            class="swatch ${current === c.id ? "selected" : ""}"
            style=${`background: ${c.hex}`}
            title=${c.label}
            aria-label=${c.label}
            aria-pressed=${current === c.id}
            @click=${() => this._onColor(c.id)}
          ></button>`,
        )}
        <button
          type="button"
          class="swatch none ${current == null ? "selected" : ""}"
          title=${localize(this.hass, "ui.category_color_none", "No colour")}
          aria-label=${localize(this.hass, "ui.category_color_none", "No colour")}
          aria-pressed=${current == null}
          @click=${() => this._onColor(undefined)}
        >✕</button>
      </div>
    `;
  }

  private _renderModal() {
    if (!this._editing) return "";
    const isEdit = this._categories.some((g) => g.id === this._editing!.id);
    const title = isEdit
      ? localize(this.hass, "ui.category_edit_title", "Edit category")
      : localize(this.hass, "ui.category_add_title", "Add category");
    return html`
      <div
        class="overlay"
        @click=${(e: MouseEvent) => {
          if ((e.target as HTMLElement).classList.contains("overlay")) this._closeModal();
        }}
      >
        <div class="modal">
          <div class="modal-header">
            <h3>${title}</h3>
            <button
              class="close"
              title=${localize(this.hass, "ui.cancel", "Cancel")}
              aria-label=${localize(this.hass, "ui.cancel", "Cancel")}
              @click=${() => this._closeModal()}
            >✕</button>
          </div>
          <div class="modal-content">
            <label>${localize(this.hass, "ui.category_name_placeholder", "Category name")}</label>
            <input
              class="name"
              .value=${this._editing.name}
              placeholder=${localize(this.hass, "ui.category_name_placeholder", "Category name")}
              aria-label=${localize(this.hass, "ui.category_name_placeholder", "Category name")}
              @input=${this._onName}
            />

            <label>${localize(this.hass, "ui.category_icon", "Icon")}</label>
            ${this._renderIconField()}

            <label>${localize(this.hass, "ui.category_color", "Colour")}</label>
            ${this._renderSwatches()}

            ${this._modalError ? html`<p class="modal-error">${this._modalError}</p>` : ""}
          </div>
          <div class="modal-footer">
            ${
              isEdit
                ? html`<button class="delete" @click=${() => this._deleteCategory()}>
                  ${localize(this.hass, "ui.title_delete", "Delete")}
                </button>`
                : html`<span></span>`
            }
            <div class="right">
              <button class="primary" @click=${() => this._save()}>
                ${localize(this.hass, "ui.category_save", "Save")}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  override render() {
    return html`
      ${this._error ? html`<p class="error">${this._error}</p>` : ""}
      <div class="list">
        ${this._sorted().map((g) => {
          const hex = colorHex(g.color);
          return html`<button class="category-row" @click=${() => this._openEditor(g)}>
            <span class="row-icon">${g.icon ? html`<ha-icon icon=${g.icon}></ha-icon>` : ""}</span>
            <span class="row-swatch ${hex ? "" : "none"}" style=${hex ? `background: ${hex}` : ""}></span>
            <span class="row-name">${g.name}</span>
          </button>`;
        })}
      </div>
      <button class="add" @click=${() => this._addCategory()}>
        ${localize(this.hass, "ui.category_add", "+ Add category")}
      </button>
      ${this._renderModal()}
    `;
  }
}
