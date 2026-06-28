import { css, html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import {
  downloadAiBundle,
  getScopeConfig,
  type HassConnection,
  listCategories,
  saveCategories,
  saveScopeConfig,
  validateScopeConfig,
} from "../api.js";
import { localize, localizeWsError } from "../i18n.js";
import {
  computeImportPreview,
  ImportError,
  type ImportPreview,
  parseImport,
} from "../import-config.js";
import type { SceneCategory } from "../types.js";

/**
 * Paste-and-import view for AI-authored config blocks.
 *
 * Flow: download the AI bundle (hand to an AI) → paste the returned single-scope
 * block → Preview (parse + classify adds/updates/removes + new/unknown
 * categories) → Import (create any new category, validate, save). Saving goes
 * through the normal scope-save command, so an import is undoable via history.
 */
@customElement("ambience-import-config")
export class AmbienceImportConfig extends LitElement {
  @property({ attribute: false }) hass!: HassConnection;

  @state() private text = "";
  @state() private error: string | null = null;
  @state() private preview: ImportPreview | null = null;
  @state() private categories: SceneCategory[] = [];
  @state() private busy = false;
  @state() private done: string | null = null;

  static override styles = css`
    :host { display: block; }
    .intro { color: var(--secondary-text-color, #666); margin-bottom: 0.75rem; }
    textarea.block {
      width: 100%; box-sizing: border-box; min-height: 12rem;
      font-family: var(--code-font-family, monospace); font-size: 0.85rem;
      background: var(--secondary-background-color, #f5f5f5); color: inherit;
      border: 1px solid var(--divider-color, #e0e0e0); border-radius: 6px;
      padding: 0.5rem; margin: 0.5rem 0;
    }
    button {
      background: var(--primary-color, #03a9f4); color: var(--text-primary-color, #fff);
      border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font: inherit;
    }
    button[disabled] { opacity: 0.5; cursor: not-allowed; }
    button.download { background: var(--secondary-background-color, #e0e0e0); color: inherit; }
    .preview-panel {
      margin-top: 1rem; padding: 0.75rem;
      border: 1px solid var(--divider-color, #e0e0e0); border-radius: 6px;
    }
    .preview-panel ul { margin: 0.25rem 0 0.5rem 1.25rem; }
    .new-category { color: var(--primary-color, #03a9f4); }
    .error { color: var(--error-color, #d32f2f); margin-top: 0.5rem; }
    .done { color: var(--success-color, #43a047); margin-top: 0.5rem; }
    .target { color: var(--secondary-text-color, #666); margin-bottom: 0.5rem; }
    .controls { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
    .upload {
      display: inline-flex; align-items: center; gap: 0.4rem;
      color: var(--secondary-text-color, #666); font-size: 0.85rem; cursor: pointer;
    }
    .upload input[type="file"] { max-width: 14rem; font: inherit; }
  `;

  private async _download(): Promise<void> {
    try {
      await downloadAiBundle(this.hass);
    } catch (err) {
      this.error = localizeWsError(this.hass, err);
    }
  }

  private _setText(value: string): void {
    this.text = value;
    this.error = null;
    this.done = null;
    // Drop any stale preview so Import can't save a block the text no longer shows.
    this.preview = null;
  }

  private _onInput(e: Event): void {
    this._setText((e.target as HTMLTextAreaElement).value);
  }

  // Load a block the AI saved as a file, so the user can upload it instead of
  // copy-pasting a long block.
  private async _onFile(e: Event): Promise<void> {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    try {
      this._setText(await file.text());
    } catch (err) {
      this.error = localizeWsError(this.hass, err);
    }
    input.value = ""; // let the same file be re-selected after an edit
  }

  private async _doPreview(): Promise<void> {
    this.done = null;
    try {
      const env = parseImport(this.text);
      const [config, categories] = await Promise.all([
        getScopeConfig(this.hass, env.scope),
        listCategories(this.hass),
      ]);
      this.categories = categories;
      this.preview = computeImportPreview(env, config, categories);
      this.error = null;
    } catch (err) {
      this.preview = null;
      this.error = err instanceof ImportError ? err.message : localizeWsError(this.hass, err);
    }
  }

  private async _confirm(): Promise<void> {
    const p = this.preview;
    if (!p || p.unknownCategories.length > 0 || this.busy) return;
    this.busy = true;
    try {
      // Validate first so a shape error doesn't leave an orphaned new category.
      await validateScopeConfig(this.hass, p.resultConfig);
      if (p.newCategory) {
        await saveCategories(this.hass, [...this.categories, p.newCategory]);
      }
      await saveScopeConfig(this.hass, p.scope, p.resultConfig, {
        action: "import",
        scene_name: null,
      });
      // The import saves with is_self=true, so the scopes-view's history path
      // skips its auto-reload — tell the panel to refetch scope configs (so the
      // scenes show) and, if a category was created, the category list too. Both
      // mirror what the in-panel editors dispatch.
      window.dispatchEvent(new CustomEvent("ambience-config-imported"));
      if (p.newCategory) {
        window.dispatchEvent(new CustomEvent("ambience-categories-changed"));
      }
      this.done = localize(this.hass, "ui.import_done", "Imported successfully.");
      this.preview = null;
      this.text = "";
    } catch (err) {
      this.error = localizeWsError(this.hass, err);
    } finally {
      this.busy = false;
    }
  }

  private _list(label: string, names: string[]) {
    if (names.length === 0) return nothing;
    return html`<div>${label}<ul>${names.map((n) => html`<li>${n}</li>`)}</ul></div>`;
  }

  private _renderPreview(p: ImportPreview) {
    const scopeLabel = p.scope.kind === "house" ? p.scope.kind : `${p.scope.kind} ${p.scope.id}`;
    return html`
      <div class="preview-panel">
        <div class="target">${localize(this.hass, "ui.import_target", "Target")}: ${scopeLabel} · ${p.mode}</div>
        ${
          p.newCategory
            ? html`<div class="new-category">${localize(this.hass, "ui.import_new_category", "New category to create")}: ${p.newCategory.name}</div>`
            : nothing
        }
        ${
          p.unknownCategories.length > 0
            ? html`<div class="error unknown">${localize(this.hass, "ui.import_unknown_categories", "Unknown categories (create them first)")}: ${p.unknownCategories.join(", ")}</div>`
            : nothing
        }
        ${this._list(localize(this.hass, "ui.import_adds", "Add"), p.adds)}
        ${this._list(localize(this.hass, "ui.import_updates", "Update"), p.updates)}
        ${this._list(localize(this.hass, "ui.import_removes", "Remove"), p.removes)}
        <button
          class="confirm"
          ?disabled=${this.busy || p.unknownCategories.length > 0}
          @click=${() => this._confirm()}
        >
          ${localize(this.hass, "ui.import_confirm", "Import")}
        </button>
      </div>
    `;
  }

  override render() {
    return html`
      <div class="intro">
        ${localize(this.hass, "ui.import_intro", "Download your AI bundle, give it to an AI with the Ambience skill, then paste the block it returns below.")}
      </div>
      <button class="download" @click=${() => this._download()}>
        ${localize(this.hass, "ui.import_download_bundle", "Download AI bundle")}
      </button>
      <textarea
        class="block"
        .value=${this.text}
        @input=${this._onInput}
        placeholder=${localize(this.hass, "ui.import_placeholder", "Paste the YAML or JSON import block here")}
      ></textarea>
      <div class="controls">
        <button class="preview" @click=${() => this._doPreview()}>
          ${localize(this.hass, "ui.import_preview", "Preview")}
        </button>
        <label class="upload">
          ${localize(this.hass, "ui.import_upload_file", "…or upload a file")}
          <input
            type="file"
            accept=".yaml,.yml,.json,.txt"
            @change=${(e: Event) => this._onFile(e)}
          />
        </label>
      </div>
      ${this.error ? html`<div class="error">${this.error}</div>` : nothing}
      ${this.preview ? this._renderPreview(this.preview) : nothing}
      ${this.done ? html`<div class="done">${this.done}</div>` : nothing}
    `;
  }
}
