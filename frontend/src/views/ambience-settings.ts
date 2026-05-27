import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import {
  getSwitchDefaults,
  saveSwitchDefaults,
  listAreas,
  listFloors,
  getArea,
  getFloor,
  getHouse,
  saveHouseSwitch,
  saveFloorSwitch,
  saveAreaSwitch,
  type HassConnection,
} from "../api.js";
import { localize } from "../i18n.js";
import type {
  AreaListItem,
  FloorListItem,
  ScopeConfig,
  ScopeSwitchOverride,
  SwitchDefaults,
} from "../types.js";

type Row = {
  kind: "house" | "floor" | "area";
  id: string | null;
  name: string;
  override: ScopeSwitchOverride;
  expanded: boolean;
};

function _rowKey(r: Row): string {
  return r.kind === "house" ? "house" : `${r.kind}-${r.id}`;
}

@customElement("ambience-ambience-settings")
export class AmbienceAmbienceSettings extends LitElement {
  static override styles = css`
    :host { display: block; }
    .card {
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 6px;
      background: var(--card-background-color, #fff);
      margin-bottom: 1rem;
      padding: 1rem;
    }
    h3 { margin: 0 0 0.75rem; }
    .row { margin-bottom: 0.75rem; }
    label { display: block; font-weight: 600; margin-bottom: 0.25rem; }
    .help { color: var(--secondary-text-color, #888); font-size: 0.85em; margin-top: 0.25rem; }
    input[type=text], input[type=number] {
      width: 100%;
      padding: 0.4rem 0.6rem;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, inherit);
    }
    .scope-row {
      border-top: 1px solid var(--divider-color, #e0e0e0);
      padding: 0.6rem 0;
    }
    .scope-row:first-of-type { border-top: none; }
    .scope-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }
    .chevron {
      color: var(--secondary-text-color, #888);
      width: 0.8em;
      transition: transform 0.15s ease;
    }
    .chevron.open { transform: rotate(90deg); }
    .scope-name { flex: 1; font-weight: 600; }
    .scope-status { color: var(--secondary-text-color, #888); font-size: 0.85em; }
    .scope-body { padding: 0.5rem 0 0.5rem 1.3rem; }
    button.reset {
      background: transparent;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      padding: 0.3rem 0.7rem;
      cursor: pointer;
      color: var(--primary-text-color, inherit);
      margin-top: 0.5rem;
    }
  `;

  @property({ attribute: false }) hass!: HassConnection;

  @state() private _defaults: SwitchDefaults = { name: "Ambience", auto_on_delay_seconds: 7200 };
  @state() private _rows: Row[] = [];
  @state() private _error = "";

  override async connectedCallback() {
    super.connectedCallback();
    try {
      const [defaults, areas, floors, house] = await Promise.all([
        getSwitchDefaults(this.hass),
        listAreas(this.hass),
        listFloors(this.hass),
        getHouse(this.hass),
      ]);
      this._defaults = defaults;

      const houseRow: Row = {
        kind: "house",
        id: null,
        name: localize(this.hass, "ui.settings_ambience_house_row", "Global"),
        override: this._toOverride((house as ScopeConfig).switch),
        expanded: false,
      };

      const sortedFloors = floors.slice().sort((a, b) => a.name.localeCompare(b.name));
      const floorConfigs = await Promise.all(sortedFloors.map((f) => getFloor(this.hass, f.floor_id)));
      const floorPrefix = localize(this.hass, "ui.settings_ambience_floor_prefix", "Floor: ");
      const floorRows: Row[] = sortedFloors.map((f: FloorListItem, i) => ({
        kind: "floor",
        id: f.floor_id,
        name: `${floorPrefix}${f.name}`,
        override: this._toOverride((floorConfigs[i] as ScopeConfig).switch),
        expanded: false,
      }));

      const sortedAreas = areas.slice().sort((a, b) => a.name.localeCompare(b.name));
      const areaConfigs = await Promise.all(sortedAreas.map((a) => getArea(this.hass, a.area_id)));
      const areaPrefix = localize(this.hass, "ui.settings_ambience_area_prefix", "Area: ");
      const areaRows: Row[] = sortedAreas.map((a: AreaListItem, i) => ({
        kind: "area",
        id: a.area_id,
        name: `${areaPrefix}${a.name}`,
        override: this._toOverride((areaConfigs[i] as ScopeConfig).switch),
        expanded: false,
      }));

      this._rows = [houseRow, ...floorRows, ...areaRows];
    } catch (e) {
      this._error = (e as Error).message || String(e);
    }
  }

  private _toOverride(sw: { name?: string | null; auto_on_delay_seconds?: number | null } | undefined): ScopeSwitchOverride {
    return {
      name: sw?.name ?? null,
      auto_on_delay_seconds: sw?.auto_on_delay_seconds ?? null,
    };
  }

  // --- defaults ---

  private _onDefaultName(e: Event) {
    const value = (e.target as HTMLInputElement).value.trim();
    if (!value) return;
    this._defaults = { ...this._defaults, name: value };
    void saveSwitchDefaults(this.hass, this._defaults.name, this._defaults.auto_on_delay_seconds);
  }

  private _onDefaultDelay(e: Event) {
    const raw = (e.target as HTMLInputElement).value;
    if (raw === "" || !Number.isFinite(Number(raw)) || Number(raw) < 0) return;
    this._defaults = { ...this._defaults, auto_on_delay_seconds: Math.floor(Number(raw)) };
    void saveSwitchDefaults(this.hass, this._defaults.name, this._defaults.auto_on_delay_seconds);
  }

  // --- per-row ---

  private _toggle(idx: number) {
    this._rows = this._rows.map((r, i) => (i === idx ? { ...r, expanded: !r.expanded } : r));
  }

  private _saveRow(row: Row) {
    const { name, auto_on_delay_seconds } = row.override;
    if (row.kind === "house") void saveHouseSwitch(this.hass, name, auto_on_delay_seconds);
    else if (row.kind === "floor") void saveFloorSwitch(this.hass, row.id!, name, auto_on_delay_seconds);
    else void saveAreaSwitch(this.hass, row.id!, name, auto_on_delay_seconds);
  }

  private _onOverrideName(idx: number, e: Event) {
    const raw = (e.target as HTMLInputElement).value.trim();
    const value = raw === "" ? null : raw;
    this._rows = this._rows.map((r, i) =>
      i === idx ? { ...r, override: { ...r.override, name: value } } : r,
    );
    this._saveRow(this._rows[idx]);
  }

  private _onOverrideDelay(idx: number, e: Event) {
    const raw = (e.target as HTMLInputElement).value;
    if (raw !== "" && (!Number.isFinite(Number(raw)) || Number(raw) < 0)) return;
    const value = raw === "" ? null : Math.floor(Number(raw));
    this._rows = this._rows.map((r, i) =>
      i === idx ? { ...r, override: { ...r.override, auto_on_delay_seconds: value } } : r,
    );
    this._saveRow(this._rows[idx]);
  }

  private _reset(idx: number) {
    this._rows = this._rows.map((r, i) =>
      i === idx ? { ...r, override: { name: null, auto_on_delay_seconds: null } } : r,
    );
    this._saveRow(this._rows[idx]);
  }

  private _statusLabel(o: ScopeSwitchOverride): string {
    if (o.name === null && o.auto_on_delay_seconds === null) {
      return localize(this.hass, "ui.settings_ambience_using_defaults", "Using defaults");
    }
    return localize(this.hass, "ui.settings_ambience_overridden", "Overridden");
  }

  override render() {
    return html`
      ${this._error ? html`<p style="color: var(--error-color, #d32f2f)">${this._error}</p>` : ""}

      <div class="card">
        <h3>${localize(this.hass, "ui.settings_ambience_defaults_card", "Defaults")}</h3>
        <div class="row">
          <label>${localize(this.hass, "ui.settings_ambience_field_name", "Switch name")}</label>
          <input data-test="defaults-name" type="text" .value=${this._defaults.name} @change=${(e: Event) => this._onDefaultName(e)} />
        </div>
        <div class="row">
          <label>${localize(this.hass, "ui.settings_ambience_field_delay", "Auto-on delay (seconds)")}</label>
          <input data-test="defaults-delay-seconds" type="number" min="0" .value=${String(this._defaults.auto_on_delay_seconds)} @change=${(e: Event) => this._onDefaultDelay(e)} />
          <div class="help">${localize(this.hass, "ui.settings_ambience_delay_help", "0 = never auto-on")}</div>
        </div>
      </div>

      <div class="card">
        <h3>${localize(this.hass, "ui.settings_ambience_overrides_card", "Per-scope overrides")}</h3>
        ${this._rows.map((r, idx) => {
          const key = _rowKey(r);
          return html`
            <div class="scope-row" data-test="scope-row">
              <div class="scope-header" data-test="expand" @click=${() => this._toggle(idx)}>
                <span class="chevron ${r.expanded ? "open" : ""}">▶</span>
                <div class="scope-name">${r.name}</div>
                <div class="scope-status">${this._statusLabel(r.override)}</div>
              </div>
              ${r.expanded ? html`
                <div class="scope-body">
                  <div class="row">
                    <label>${localize(this.hass, "ui.settings_ambience_field_name", "Switch name")}</label>
                    <input data-test=${`override-name-${key}`} type="text" .value=${r.override.name ?? ""} placeholder=${this._defaults.name} @change=${(e: Event) => this._onOverrideName(idx, e)} />
                  </div>
                  <div class="row">
                    <label>${localize(this.hass, "ui.settings_ambience_field_delay", "Auto-on delay (seconds)")}</label>
                    <input data-test=${`override-delay-${key}`} type="number" min="0" .value=${r.override.auto_on_delay_seconds === null ? "" : String(r.override.auto_on_delay_seconds)} placeholder=${String(this._defaults.auto_on_delay_seconds)} @change=${(e: Event) => this._onOverrideDelay(idx, e)} />
                  </div>
                  <button class="reset" data-test=${`reset-${key}`} @click=${() => this._reset(idx)}>${localize(this.hass, "ui.settings_ambience_reset_to_defaults", "Reset to defaults")}</button>
                </div>
              ` : ""}
            </div>
          `;
        })}
      </div>
    `;
  }
}
