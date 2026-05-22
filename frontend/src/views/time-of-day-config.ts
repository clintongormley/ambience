import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { listPeriods, savePeriods } from "../api.js";
import type { HassConnection } from "../api.js";
import { anchorLabel, localize, periodLabel } from "../i18n.js";
import type { PeriodDef, PeriodStoreView, TimeEndpoint } from "../types.js";
import "./period-edit-modal.js";

function formatEndpoint(ep: TimeEndpoint, hass?: HassConnection): string {
  if (ep.kind === "time") return `${String(ep.hh).padStart(2, "0")}:${String(ep.mm).padStart(2, "0")}`;
  const anchor = anchorLabel(hass, ep.anchor);
  if (ep.offset_min === 0) return anchor;
  const abs = Math.abs(ep.offset_min);
  const unit = abs % 60 === 0
    ? `${abs / 60}${localize(hass, "ui.unit_hour_abbr", "h")}`
    : `${abs}${localize(hass, "ui.unit_min_abbr", "m")}`;
  return `${anchor}${ep.offset_min < 0 ? "-" : "+"}${unit}`;
}

function formatDef(d: PeriodDef, hass?: HassConnection): string {
  return `${formatEndpoint(d.from, hass)} → ${formatEndpoint(d.to, hass)}`;
}

type ModalState =
  | { mode: "closed" }
  | { mode: "add" }
  | { mode: "edit"; id: string; initial: PeriodDef };

/**
 * Period management screen: shows effective periods with provenance badges and
 * per-row actions (edit / delete / revert), plus Add and Reset buttons.
 */
@customElement("ambience-time-of-day-config")
export class AmbienceTimeOfDayConfig extends LitElement {
  static override styles = css`
    :host { display: block; }
    header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
    h2 { margin: 0; font-size: 1rem; font-weight: 600; }
    .row {
      display: grid; grid-template-columns: 1fr 2fr auto auto; align-items: center;
      gap: 0.5rem; padding: 0.5rem 0; border-bottom: 1px solid var(--divider-color, #eee);
    }
    .name { font-weight: 500; }
    .def { color: var(--secondary-text-color); font-family: monospace; font-size: 0.9em; }
    .row.overridden .name, .row.overridden .def {
      text-decoration: line-through; opacity: 0.55;
    }
    .row.custom .name { padding-left: 0.75rem; }
    .badge {
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

  @state() private _view: PeriodStoreView = { builtins: {}, custom: {}, hidden: [] };
  @state() private _modal: ModalState = { mode: "closed" };
  @state() private _warnings: Array<{ area_id: string; rule_name: string; missing_period: string }> = [];

  override async connectedCallback(): Promise<void> {
    super.connectedCallback();
    await this._reload();
  }

  private async _reload() {
    this._view = await listPeriods(this.hass);
  }

  private async _saveState(custom: Record<string, PeriodDef>) {
    // `hidden` is preserved as-is; there is no longer a UI to hide built-ins.
    const res = await savePeriods(this.hass, custom, this._view.hidden);
    this._warnings = res.warnings;
    await this._reload();
  }

  /** Open the editor for a custom period (a new override of a built-in, or an
   * existing custom entry). The id is fixed to `id`. */
  private _onEdit(id: string, defn: PeriodDef) {
    this._modal = { mode: "edit", id, initial: defn };
  }

  /** Remove a custom entry. For an override this reverts to the built-in; for a
   * custom-only period it deletes it. Built-ins are never removed. */
  private async _onDelete(id: string) {
    const newCustom = { ...this._view.custom };
    delete newCustom[id];
    await this._saveState(newCustom);
  }

  private _onAdd() { this._modal = { mode: "add" }; }

  private async _onModalSave(e: CustomEvent<{ id: string; definition: PeriodDef }>) {
    e.stopPropagation();
    const { id, definition } = e.detail;
    const newCustom = { ...this._view.custom, [id]: definition };
    this._modal = { mode: "closed" };
    await this._saveState(newCustom);
  }

  private _onModalCancel() { this._modal = { mode: "closed" }; }

  /** A built-in row. Read-only; offers an "Override" action unless an override
   * already exists, in which case the row is struck through (the custom
   * override is rendered separately, below). */
  private _renderBuiltinRow(id: string, defn: PeriodDef, overridden: boolean) {
    return html`
      <div class="row ${overridden ? "overridden" : ""}">
        <span class="name">${periodLabel(this.hass as any, id, {})}</span>
        <span class="def">${formatDef(defn, this.hass)}</span>
        <span class="badge">${localize(this.hass, "ui.badge_builtin", "builtin")}</span>
        <span class="actions">
          ${overridden
            ? ""
            : html`<button class="icon" title=${localize(this.hass, "ui.title_override", "Override")} @click=${() => this._onEdit(id, defn)}>✎</button>`}
        </span>
      </div>
    `;
  }

  /** A custom row — either an override of a built-in or a standalone custom
   * period. Editable and deletable. */
  private _renderCustomRow(id: string, defn: PeriodDef) {
    return html`
      <div class="row custom">
        <span class="name">${periodLabel(this.hass as any, id, this._view.custom)}</span>
        <span class="def">${formatDef(defn, this.hass)}</span>
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
    return html`
      <header>
        <h2>${localize(this.hass, "ui.periods_heading", "Periods")}</h2>
      </header>
      ${this._warnings.length
        ? html`<div class="warnings">
            <strong>${localize(this.hass, "ui.period_warning_prefix", "Warning:")}</strong> ${localize(this.hass, "ui.period_warning_text", "some rules now reference missing periods:")}
            <ul>
              ${this._warnings.map(
                (w) => html`<li>${w.area_id} / "${w.rule_name}" → ${w.missing_period}</li>`,
              )}
            </ul>
          </div>`
        : ""}
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
      <button class="add" @click=${this._onAdd}>${localize(this.hass, "ui.add_custom_period", "+ Add custom period")}</button>
      ${this._modal.mode === "edit"
        ? html`<ambience-period-edit-modal
            .hass=${this.hass}
            .existingId=${this._modal.id}
            .initial=${this._modal.initial}
            .takenIds=${new Set([...Object.keys(this._view.builtins), ...Object.keys(this._view.custom)])}
            @period-save=${this._onModalSave}
            @period-cancel=${this._onModalCancel}
          ></ambience-period-edit-modal>`
        : this._modal.mode === "add"
        ? html`<ambience-period-edit-modal
            .hass=${this.hass}
            .takenIds=${new Set([...Object.keys(this._view.builtins), ...Object.keys(this._view.custom)])}
            @period-save=${this._onModalSave}
            @period-cancel=${this._onModalCancel}
          ></ambience-period-edit-modal>`
        : ""}
    `;
  }
}
