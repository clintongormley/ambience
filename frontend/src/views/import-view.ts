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
  `;

  private async _download(): Promise<void> {
    try {
      await downloadAiBundle(this.hass);
    } catch (err) {
      this.error = localizeWsError(this.hass, err);
    }
  }

  private _onInput(e: Event): void {
    this.text = (e.target as HTMLTextAreaElement).value;
    this.error = null;
    this.done = null;
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
      <div>
        <button class="preview" @click=${() => this._doPreview()}>
          ${localize(this.hass, "ui.import_preview", "Preview")}
        </button>
      </div>
      ${this.error ? html`<div class="error">${this.error}</div>` : nothing}
      ${this.preview ? this._renderPreview(this.preview) : nothing}
      ${this.done ? html`<div class="done">${this.done}</div>` : nothing}
    `;
  }
}
