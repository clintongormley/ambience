import { css, html, LitElement, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import type { HassConnection } from "../api.js";
import { localize } from "../i18n.js";
import { scopeLabel } from "../scope-label.js";

export type NamedDefView<Def> = {
  builtins: Record<string, Def>;
  custom: Record<string, Def>;
  hidden: string[];
};

export type DefWarning = {
  scope_kind: string;
  scope_id: string | null;
  scene_name: string;
  missing_id: string; // the referenced builtin/custom id that no longer exists
};

export type ModalState<Def> =
  | { mode: "closed" }
  | { mode: "add" }
  | { mode: "edit"; id: string; initial: Def };

/** The visible, selectable ids of a named-def view: built-ins (minus hidden)
 *  then custom-only ids. `sortBuiltins` orders the built-ins when a display
 *  order differs from storage order (e.g. time-of-day periods); omit it to keep
 *  storage order (e.g. lux ranges). Shared by the predicate-input dropdowns. */
export function effectiveDefIds<Def>(
  view:
    | { builtins: Record<string, Def>; custom: Record<string, Def>; hidden: string[] }
    | undefined,
  sortBuiltins?: (a: string, b: string) => number,
): string[] {
  if (!view) return [];
  const builtinIds = Object.keys(view.builtins ?? {});
  const ordered = sortBuiltins ? builtinIds.slice().sort(sortBuiltins) : builtinIds;
  const hidden = new Set(view.hidden ?? []);
  const customOnly = Object.keys(view.custom ?? {}).filter((id) => !(id in (view.builtins ?? {})));
  return [...ordered.filter((id) => !hidden.has(id)), ...customOnly];
}

/**
 * Abstract base for a named-definition management screen (periods, lux ranges):
 * effective list with provenance badges, per-row override/edit/delete actions,
 * an Add button, dangling-reference warnings, and the add/edit modal. Subclasses
 * supply the api calls, the label/format helpers, the i18n keys, and the modal
 * element (via {@link _renderModal}).
 */
export abstract class AmbienceNamedDefConfig<Def> extends LitElement {
  static override styles = css`
    :host { display: block; }
    header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
    h2 { margin: 0; font-size: 1rem; font-weight: 600; }
    /* Fixed badge + actions columns so every row shares the same column
       boundaries (an override row has two icons, a built-in one). */
    .row {
      display: grid; grid-template-columns: 1fr 2fr 5rem 4rem; align-items: center;
      gap: 0.5rem; padding: 0.5rem 0; border-bottom: 1px solid var(--divider-color, #eee);
    }
    .name { font-weight: 500; }
    .def { color: var(--secondary-text-color); font-family: monospace; font-size: 0.9em; }
    .row.overridden .name, .row.overridden .def {
      text-decoration: line-through; opacity: 0.55;
    }
    .badge {
      justify-self: end;
      font-size: 0.7em; padding: 0.1em 0.5em; border-radius: 3px;
      background: var(--secondary-background-color, #eee); color: var(--secondary-text-color);
    }
    .actions { display: flex; gap: 0.3rem; }
    button.icon {
      background: none; border: none; padding: 0.2rem 0.4rem; cursor: pointer;
      color: var(--secondary-text-color); font-size: 1em;
    }
    button.icon:hover { color: var(--primary-color); }
    button.add { margin-top: 1rem; padding: 0.5rem 1rem; cursor: pointer; }
    .warnings {
      background: var(--warning-color, #ffd); border: 1px solid var(--warning-color, #cc9);
      padding: 0.5rem 1rem; border-radius: 4px; margin-bottom: 1rem;
    }
    .warnings ul { margin: 0.3rem 0 0 0; padding-left: 1.2rem; }
  `;

  @property({ attribute: false }) hass!: HassConnection;

  @state() protected _view: NamedDefView<Def> = { builtins: {}, custom: {}, hidden: [] };
  @state() protected _modal: ModalState<Def> = { mode: "closed" };
  @state() protected _warnings: DefWarning[] = [];

  // --- subclass hooks ------------------------------------------------------
  protected abstract _list(): Promise<NamedDefView<Def>>;
  protected abstract _save(
    custom: Record<string, Def>,
    hidden: string[],
  ): Promise<{ warnings: DefWarning[] }>;
  protected abstract _label(id: string, custom: Record<string, Def>): string;
  protected abstract _formatDef(defn: Def): string;
  protected abstract _headingKey(): [string, string];
  protected abstract _addKey(): [string, string];
  protected abstract _warningTextKey(): [string, string];
  protected abstract _renderModal(): TemplateResult;

  override async connectedCallback(): Promise<void> {
    super.connectedCallback();
    await this._reload();
  }

  private async _reload() {
    this._view = await this._list();
  }

  // `hidden` is preserved as-is; there is no UI to hide built-ins.
  protected async _saveState(custom: Record<string, Def>) {
    const res = await this._save(custom, this._view.hidden);
    this._warnings = res.warnings;
    await this._reload();
  }

  protected _onEdit(id: string, defn: Def) {
    this._modal = { mode: "edit", id, initial: defn };
  }

  protected async _onDelete(id: string) {
    const newCustom = { ...this._view.custom };
    delete newCustom[id];
    await this._saveState(newCustom);
  }

  protected _onAdd() {
    this._modal = { mode: "add" };
  }

  protected async _onModalSave(e: CustomEvent<{ id: string; definition: Def }>) {
    e.stopPropagation();
    const { id, definition } = e.detail;
    this._modal = { mode: "closed" };
    await this._saveState({ ...this._view.custom, [id]: definition });
  }

  protected _onModalCancel() {
    this._modal = { mode: "closed" };
  }

  protected _takenIds(): Set<string> {
    return new Set([...Object.keys(this._view.builtins), ...Object.keys(this._view.custom)]);
  }

  /** A built-in row: read-only, with an "Override" action unless already
   *  overridden (then it's struck through and the custom row renders below). */
  private _renderBuiltinRow(id: string, defn: Def, overridden: boolean) {
    return html`
      <div class="row ${overridden ? "overridden" : ""}">
        <span class="name">${this._label(id, {})}</span>
        <span class="def">${this._formatDef(defn)}</span>
        <span class="badge">${localize(this.hass, "ui.badge_builtin", "builtin")}</span>
        <span class="actions">
          ${
            overridden
              ? ""
              : html`<button class="icon" title=${localize(this.hass, "ui.title_override", "Override")} @click=${() => this._onEdit(id, defn)}>✎</button>`
          }
        </span>
      </div>
    `;
  }

  /** A custom row — an override of a built-in or a standalone custom entry. */
  private _renderCustomRow(id: string, defn: Def) {
    return html`
      <div class="row custom">
        <span class="name">${this._label(id, this._view.custom)}</span>
        <span class="def">${this._formatDef(defn)}</span>
        <span class="badge">${localize(this.hass, "ui.badge_custom", "custom")}</span>
        <span class="actions">
          <button class="icon" title=${localize(this.hass, "ui.title_edit", "Edit")} @click=${() => this._onEdit(id, defn)}>✎</button>
          <button class="icon" title=${localize(this.hass, "ui.title_delete", "Delete")} @click=${() => this._onDelete(id)}>✕</button>
        </span>
      </div>
    `;
  }

  override render() {
    const custom = this._view.custom;
    const [headingKey, headingFb] = this._headingKey();
    const [addKey, addFb] = this._addKey();
    const [warnKey, warnFb] = this._warningTextKey();
    return html`
      <header>
        <h2>${localize(this.hass, headingKey, headingFb)}</h2>
      </header>
      ${
        this._warnings.length
          ? html`<div class="warnings">
            <strong>${localize(this.hass, "ui.period_warning_prefix", "Warning:")}</strong> ${localize(this.hass, warnKey, warnFb)}
            <ul>
              ${this._warnings.map(
                (w) => html`<li>${scopeLabel(w)} / "${w.scene_name}" → ${w.missing_id}</li>`,
              )}
            </ul>
          </div>`
          : ""
      }
      ${Object.entries(this._view.builtins).map(([id, defn]) => {
        const override = custom[id];
        return html`
          ${this._renderBuiltinRow(id, defn, override != null)}
          ${override != null ? this._renderCustomRow(id, override) : ""}
        `;
      })}
      ${Object.entries(custom)
        .filter(([id]) => !(id in this._view.builtins))
        .map(([id, defn]) => this._renderCustomRow(id, defn))}
      <button class="add" @click=${this._onAdd}>${localize(this.hass, addKey, addFb)}</button>
      ${this._renderModal()}
    `;
  }
}
