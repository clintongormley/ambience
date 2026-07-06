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
import { docUrl } from "../docs.js";
import { GITHUB_REPO_URL } from "../github.js";
import { localize, localizeWsError } from "../i18n.js";
import {
  computeImportPreview,
  ImportError,
  type ImportPreview,
  parseImport,
} from "../import-config.js";
import type { SceneCategory } from "../types.js";

// The user guide for the AI feature (install steps + workflow), shown as a link
// in the AI tab. Built from DOCS_BASE_URL via docUrl() so it tracks the docs
// origin in one place and can't drift; points at the published docs, not a branch.
const AI_DOCS_URL = docUrl("reference/ai-assisted-scenes");

// Where to send "the AI got it wrong, here's a better answer" feedback — used to
// improve the cookbook the AI learns from.
const AI_ISSUES_URL = `${GITHUB_REPO_URL}/issues/new`;

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
    .header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.25rem; }
    .header .title { font-size: 1.1rem; font-weight: 500; }
    .beta {
      font-size: 0.7rem; font-weight: 600; letter-spacing: 0.03em; text-transform: uppercase;
      padding: 0.05rem 0.4rem; border-radius: 999px;
      background: var(--label-badge-yellow, #f4b400); color: var(--text-primary-color, #fff);
    }
    .help-link { color: var(--primary-color, #03a9f4); }
    .feedback {
      margin-top: 1.5rem; padding: 0.75rem 1rem; border-radius: 6px;
      background: var(--secondary-background-color, #f5f5f5);
      border: 1px solid var(--divider-color, #e0e0e0);
    }
    .feedback .fb-title { font-weight: 600; margin-bottom: 0.25rem; }
    .feedback .fb-body { color: var(--secondary-text-color, #666); }
    .feedback a { color: var(--primary-color, #03a9f4); }
    ol.steps { margin: 0.25rem 0 0; padding-left: 1.5rem; }
    ol.steps > li { margin-bottom: 1.1rem; }
    ol.steps > li::marker { font-weight: 600; color: var(--primary-text-color, inherit); }
    .step-title { font-weight: 600; margin-bottom: 0.2rem; }
    .step-body { color: var(--secondary-text-color, #666); margin-bottom: 0.45rem; }
    input.file { font: inherit; max-width: 100%; }
    button {
      background: var(--primary-color, #03a9f4); color: var(--text-primary-color, #fff);
      border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font: inherit;
    }
    button[disabled] { opacity: 0.5; cursor: not-allowed; }
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

  // Step 3: the user uploads the file the AI produced. Reading it immediately
  // previews the import (parse + classify) — no separate paste/preview step.
  private async _onFile(e: Event): Promise<void> {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = ""; // let the same file be re-selected after a fix
    if (!file) return;
    this.error = null;
    this.done = null;
    this.preview = null;
    try {
      this.text = await file.text();
    } catch (err) {
      this.error = localizeWsError(this.hass, err);
      return;
    }
    await this._doPreview();
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
      await saveScopeConfig(
        this.hass,
        p.scope,
        p.resultConfig,
        { action: "import", scene_name: null },
        { minimisePins: true },
      );
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
      <div class="header">
        <span class="title">${localize(this.hass, "ui.import_title", "Author & fix scenes with AI")}</span>
        <span class="beta">${localize(this.hass, "ui.import_beta", "Beta")}</span>
      </div>
      <ol class="steps">
        <li>
          <div class="step-title">${localize(this.hass, "ui.import_step1", "Install the skill or plugin")}</div>
          <div class="step-body">
            ${localize(this.hass, "ui.import_step1_desc", "Add the Ambience AI pack to your AI — a Claude Code plugin, a claude.ai skill, or a guide to paste into any AI.")}
            <a class="help-link" href=${AI_DOCS_URL} target="_blank" rel="noopener noreferrer"
              >${localize(this.hass, "ui.import_help_link", "Install & usage guide")}</a
            >
          </div>
        </li>
        <li>
          <div class="step-title">${localize(this.hass, "ui.import_step2", "Download your AI bundle")}</div>
          <div class="step-body">
            ${localize(this.hass, "ui.import_step2_desc", "A snapshot of your areas, entities and exposed actions (location data redacted) for the AI to author against. Give it to the AI with your request.")}
          </div>
          <button class="download" @click=${() => this._download()}>
            ${localize(this.hass, "ui.import_download_bundle", "Download AI bundle")}
          </button>
        </li>
        <li>
          <div class="step-title">${localize(this.hass, "ui.import_step3", "Upload the result")}</div>
          <div class="step-body">
            ${localize(this.hass, "ui.import_step3_desc", "Upload the YAML or JSON file the AI gives you. It's previewed before anything is saved.")}
          </div>
          <input
            class="file"
            type="file"
            accept=".yaml,.yml,.json,.txt"
            @change=${(e: Event) => this._onFile(e)}
          />
        </li>
      </ol>
      ${this.error ? html`<div class="error">${this.error}</div>` : nothing}
      ${this.preview ? this._renderPreview(this.preview) : nothing}
      ${this.done ? html`<div class="done">${this.done}</div>` : nothing}
      <div class="feedback">
        <div class="fb-title">${localize(this.hass, "ui.import_feedback_title", "Can you do better than the AI?")}</div>
        <div class="fb-body">
          ${localize(this.hass, "ui.import_feedback_body", "If the AI gives you bad advice, share its suggestion, your corrected version, and a short note on what was wrong — it's used to improve the cookbook the AI learns from.")}
          <a class="fb-link" href=${AI_ISSUES_URL} target="_blank" rel="noopener noreferrer"
            >${localize(this.hass, "ui.import_feedback_link", "Report it on GitHub")}</a
          >
        </div>
      </div>
    `;
  }
}
