import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { getDayConfig, type HassConnection, saveDayConfig } from "../api.js";
import { watchHaComponents } from "../ha-components.js";
import { localize } from "../i18n.js";
import type { DayConfig } from "../types.js";
import { renderEntityPicker } from "./form-controls.js";

@customElement("ambience-day-config")
export class AmbienceDayConfig extends LitElement {
  static override styles = css`
    :host { display: block; }
    .row { margin-bottom: 0.75rem; }
    label { display: block; font-weight: 600; margin-bottom: 0.25rem; }
  `;

  @property({ attribute: false }) hass!: HassConnection;
  @state() private _config: DayConfig = { workday_sensor: null, workday_calendar: null };
  @state() private _error = "";

  override async connectedCallback() {
    super.connectedCallback();
    // Re-render when ha-form registers so the native fallback upgrades.
    watchHaComponents(this);
    try {
      this._config = await getDayConfig(this.hass);
    } catch (e) {
      // A failed fetch must not leave a blank panel + unhandled rejection.
      this._error = (e as Error).message || String(e);
    }
  }

  private async _save(next: DayConfig) {
    this._config = next;
    try {
      await saveDayConfig(this.hass, next.workday_sensor, next.workday_calendar);
      this._error = "";
    } catch (e) {
      this._error = (e as Error).message || String(e);
      return;
    }
    // Tell the scopes view to re-evaluate its conditions hint against live state.
    window.dispatchEvent(new CustomEvent("ambience-conditions-changed"));
  }

  _onSensorChange(e: { detail: { value: string | null } }) {
    void this._save({ ...this._config, workday_sensor: e.detail.value || null });
  }

  _onCalendarChange(e: { detail: { value: string | null } }) {
    void this._save({ ...this._config, workday_calendar: e.detail.value || null });
  }

  override render() {
    const errorBanner = this._error
      ? html`<p style="color: var(--error-color, #d32f2f)">${this._error}</p>`
      : "";
    // Filter both pickers to entities provided by the Workday integration so
    // the lists stay short (not every binary_sensor / calendar).
    return html`
      ${errorBanner}
      <div class="row">
        <label>${localize(this.hass, "ui.workday_sensor", "Workday sensor")}</label>
        ${renderEntityPicker(
          this.hass,
          "workday_sensor",
          this._config.workday_sensor,
          { entity: { integration: "workday", domain: "binary_sensor" } },
          "binary_sensor.workday",
          (value) => this._onSensorChange({ detail: { value } }),
        )}
      </div>
      <div class="row">
        <label>${localize(this.hass, "ui.workday_calendar", "Workday calendar")}</label>
        ${renderEntityPicker(
          this.hass,
          "workday_calendar",
          this._config.workday_calendar,
          { entity: { integration: "workday", domain: "calendar" } },
          "calendar.workday",
          (value) => this._onCalendarChange({ detail: { value } }),
        )}
      </div>
    `;
  }
}
