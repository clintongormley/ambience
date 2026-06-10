import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { getDayConfig, type HassConnection, saveDayConfig } from "../api.js";
import { watchHaComponents } from "../ha-components.js";
import { localize } from "../i18n.js";
import { scopeLabel } from "../scope-label.js";
import type { DayConfig } from "../types.js";

type Warning = { scope_kind: string; scope_id: string | null; scene_name: string; reason: string };

@customElement("ambience-day-config")
export class AmbienceDayConfig extends LitElement {
  static override styles = css`
    :host { display: block; }
    .row { margin-bottom: 0.75rem; }
    label { display: block; font-weight: 600; margin-bottom: 0.25rem; }
    .warnings {
      background: var(--warning-color, #ffd);
      border: 1px solid var(--warning-color, #cc9);
      padding: 0.5rem 1rem; border-radius: 4px; margin-top: 0.5rem;
    }
    .warnings ul { margin: 0.3rem 0 0 0; padding-left: 1.2rem; }
  `;

  @property({ attribute: false }) hass!: HassConnection;
  @state() private _config: DayConfig = { workday_sensor: null, workday_calendar: null };
  @state() private _warnings: Warning[] = [];
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
      const res = await saveDayConfig(this.hass, next.workday_sensor, next.workday_calendar);
      this._warnings = res.warnings ?? [];
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
    // Filter both pickers to entities provided by the Workday integration so
    // the lists stay short (not every binary_sensor / calendar).
    const sensorSchema = [
      {
        name: "workday_sensor",
        selector: { entity: { integration: "workday", domain: "binary_sensor" } },
      },
    ];
    const calendarSchema = [
      {
        name: "workday_calendar",
        selector: { entity: { integration: "workday", domain: "calendar" } },
      },
    ];
    const errorBanner = this._error
      ? html`<p style="color: var(--error-color, #d32f2f)">${this._error}</p>`
      : "";
    return html`
      ${errorBanner}
      <div class="row">
        <label>${localize(this.hass, "ui.workday_sensor", "Workday sensor")}</label>
        ${
          customElements.get("ha-form")
            ? html`<ha-form
                .hass=${this.hass as any}
                .schema=${sensorSchema}
                .data=${{ workday_sensor: this._config.workday_sensor ?? "" }}
                .computeLabel=${() => ""}
                @value-changed=${(e: CustomEvent) => {
                  e.stopPropagation();
                  this._onSensorChange({
                    detail: { value: (e.detail.value?.workday_sensor as string) || null },
                  });
                }}
              ></ha-form>`
            : html`<input
                type="text"
                placeholder="binary_sensor.workday"
                .value=${this._config.workday_sensor ?? ""}
                @change=${(e: Event) =>
                  this._onSensorChange({
                    detail: { value: (e.target as HTMLInputElement).value || null },
                  })}
              />`
        }
      </div>
      <div class="row">
        <label>${localize(this.hass, "ui.workday_calendar", "Workday calendar")}</label>
        ${
          customElements.get("ha-form")
            ? html`<ha-form
                .hass=${this.hass as any}
                .schema=${calendarSchema}
                .data=${{ workday_calendar: this._config.workday_calendar ?? "" }}
                .computeLabel=${() => ""}
                @value-changed=${(e: CustomEvent) => {
                  e.stopPropagation();
                  this._onCalendarChange({
                    detail: { value: (e.detail.value?.workday_calendar as string) || null },
                  });
                }}
              ></ha-form>`
            : html`<input
                type="text"
                placeholder="calendar.workday"
                .value=${this._config.workday_calendar ?? ""}
                @change=${(e: Event) =>
                  this._onCalendarChange({
                    detail: { value: (e.target as HTMLInputElement).value || null },
                  })}
              />`
        }
      </div>
      ${
        this._warnings.length
          ? html`
        <div class="warnings">
          <strong>${localize(this.hass, "ui.day_warning_prefix", "Warning:")}</strong> ${localize(this.hass, "ui.day_warning_text", "scenes now reference unconfigured entities:")}
          <ul>
            ${this._warnings.map((w) => html`<li>${scopeLabel(w)} / "${w.scene_name}" → ${w.reason}</li>`)}
          </ul>
        </div>
      `
          : ""
      }
    `;
  }
}
