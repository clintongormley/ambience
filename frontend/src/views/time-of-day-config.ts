import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { listPeriods, resetPeriods, savePeriods } from "../api.js";
import type { HassConnection } from "../api.js";
import { localize, periodLabel } from "../i18n.js";
import type { PeriodDef, PeriodStoreView, TimeEndpoint } from "../types.js";
import "./period-edit-modal.js";

function formatEndpoint(ep: TimeEndpoint): string {
  if (ep.kind === "time") return `${String(ep.hh).padStart(2, "0")}:${String(ep.mm).padStart(2, "0")}`;
  if (ep.offset_min === 0) return ep.anchor;
  const abs = Math.abs(ep.offset_min);
  const unit = abs % 60 === 0 ? `${abs / 60}h` : `${abs}m`;
  return `${ep.anchor}${ep.offset_min < 0 ? "-" : "+"}${unit}`;
}

function formatDef(d: PeriodDef): string {
  return `${formatEndpoint(d.from)} → ${formatEndpoint(d.to)}`;
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
    :host { display: block; padding: 1rem; }
    header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
    h2 { margin: 0; }
    .row {
      display: grid; grid-template-columns: 1fr 2fr auto auto; align-items: center;
      gap: 0.5rem; padding: 0.5rem 0; border-bottom: 1px solid var(--divider-color, #eee);
    }
    .name { font-weight: 500; }
    .def { color: var(--secondary-text-color); font-family: monospace; font-size: 0.9em; }
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

  private _effective(): Array<{ id: string; defn: PeriodDef; provenance: "builtin" | "builtin-edited" | "custom" }> {
    const hidden = new Set(this._view.hidden);
    const out: Array<{ id: string; defn: PeriodDef; provenance: "builtin" | "builtin-edited" | "custom" }> = [];
    for (const [id, defn] of Object.entries(this._view.builtins)) {
      if (hidden.has(id)) continue;
      const custom = this._view.custom[id];
      if (custom) out.push({ id, defn: custom, provenance: "builtin-edited" });
      else out.push({ id, defn, provenance: "builtin" });
    }
    for (const [id, defn] of Object.entries(this._view.custom)) {
      if (id in this._view.builtins) continue;
      out.push({ id, defn, provenance: "custom" });
    }
    return out;
  }

  private async _saveState(custom: Record<string, PeriodDef>, hidden: string[]) {
    const res = await savePeriods(this.hass, custom, hidden);
    this._warnings = res.warnings;
    await this._reload();
  }

  private _onEdit(id: string, defn: PeriodDef) {
    this._modal = { mode: "edit", id, initial: defn };
  }

  private async _onDelete(id: string) {
    const isBuiltin = id in this._view.builtins;
    if (isBuiltin) {
      const newCustom = { ...this._view.custom };
      delete newCustom[id];
      await this._saveState(newCustom, [...this._view.hidden, id]);
    } else {
      const newCustom = { ...this._view.custom };
      delete newCustom[id];
      await this._saveState(newCustom, this._view.hidden);
    }
  }

  private async _onRevertEdited(id: string) {
    const newCustom = { ...this._view.custom };
    delete newCustom[id];
    await this._saveState(newCustom, this._view.hidden);
  }

  private async _onRevertHidden(id: string) {
    await this._saveState(this._view.custom, this._view.hidden.filter((h) => h !== id));
  }

  private async _onResetAll() {
    const custom = Object.keys(this._view.custom).length;
    const hidden = this._view.hidden.length;
    const msg = `This will clear ${custom} custom period(s) and restore ${hidden} hidden built-in(s). Continue?`;
    if (!confirm(msg)) return;
    await resetPeriods(this.hass);
    this._warnings = [];
    await this._reload();
  }

  private _onAdd() { this._modal = { mode: "add" }; }

  private async _onModalSave(e: CustomEvent<{ id: string; definition: PeriodDef }>) {
    e.stopPropagation();
    const { id, definition } = e.detail;
    const newCustom = { ...this._view.custom, [id]: definition };
    const newHidden = this._view.hidden.filter((h) => h !== id);
    this._modal = { mode: "closed" };
    await this._saveState(newCustom, newHidden);
  }

  private _onModalCancel() { this._modal = { mode: "closed" }; }

  private _renderRow(item: { id: string; defn: PeriodDef; provenance: string }) {
    const customMap = this._view.custom;
    const isBuiltinEdited = item.provenance === "builtin-edited";
    const isCustom = item.provenance === "custom";
    return html`
      <div class="row">
        <span class="name">${periodLabel(this.hass as any, item.id, customMap)}</span>
        <span class="def">${formatDef(item.defn)}</span>
        <span class="badge">${item.provenance === "builtin"
          ? localize(this.hass, "ui.badge_builtin", "builtin")
          : item.provenance === "builtin-edited"
          ? localize(this.hass, "ui.badge_builtin_edited", "builtin, edited")
          : localize(this.hass, "ui.badge_custom", "custom")}</span>
        <span class="actions">
          <button class="icon" title=${localize(this.hass, "ui.title_edit", "Edit")} @click=${() => this._onEdit(item.id, item.defn)}>✎</button>
          ${isBuiltinEdited
            ? html`<button class="icon" title=${localize(this.hass, "ui.title_revert", "Revert to default")} @click=${() => this._onRevertEdited(item.id)}>↺</button>`
            : ""}
          ${isCustom || item.provenance === "builtin" || isBuiltinEdited
            ? html`<button class="icon" title=${localize(this.hass, "ui.title_delete", "Delete")} @click=${() => this._onDelete(item.id)}>✕</button>`
            : ""}
        </span>
      </div>
    `;
  }

  private _renderHiddenRow(id: string) {
    return html`
      <div class="row">
        <span class="name">${periodLabel(this.hass as any, id, {})}</span>
        <span class="def">${localize(this.hass, "ui.hidden_marker", "(hidden)")}</span>
        <span class="badge">${localize(this.hass, "ui.badge_hidden", "hidden")}</span>
        <span class="actions">
          <button class="icon" title=${localize(this.hass, "ui.title_restore", "Restore")} @click=${() => this._onRevertHidden(id)}>↺</button>
        </span>
      </div>
    `;
  }

  override render() {
    const effective = this._effective();
    return html`
      <header>
        <h2>${localize(this.hass, "ui.periods_heading", "Periods")}</h2>
        <button @click=${this._onResetAll}>${localize(this.hass, "ui.reset_all_to_defaults", "Reset all to defaults")}</button>
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
      ${effective.map((item) => this._renderRow(item))}
      ${this._view.hidden.map((id) => this._renderHiddenRow(id))}
      <button class="add" @click=${this._onAdd}>${localize(this.hass, "ui.add_custom_period", "+ Add custom period")}</button>
      ${this._modal.mode === "edit"
        ? html`<ambience-period-edit-modal
            .existingId=${this._modal.id}
            .initial=${this._modal.initial}
            .takenIds=${new Set([...Object.keys(this._view.builtins), ...Object.keys(this._view.custom)])}
            @period-save=${this._onModalSave}
            @period-cancel=${this._onModalCancel}
          ></ambience-period-edit-modal>`
        : this._modal.mode === "add"
        ? html`<ambience-period-edit-modal
            .takenIds=${new Set([...Object.keys(this._view.builtins), ...Object.keys(this._view.custom)])}
            @period-save=${this._onModalSave}
            @period-cancel=${this._onModalCancel}
          ></ambience-period-edit-modal>`
        : ""}
    `;
  }
}
