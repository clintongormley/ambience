import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import type { HassConnection } from "../api.js";
import { localize } from "../i18n.js";
import type { DayConfig, ConditionInfo, PeriodStoreView } from "../types.js";
import "./script-predicate-input.js";
import "./time-of-day-input.js";
import "./day-predicate-input.js";
import "./weather-predicate-input.js";
import "./sun-predicate-input.js";
import "./state-predicate-input.js";
import "./people-predicate-input.js";
import "./template-predicate-input.js";
import { emitValueChanged } from "../dom.js";

/**
 * Dispatcher element for one condition's predicate input. Given a condition's
 * `input` hint and the current predicate value, renders the right widget:
 *
 *   "text" / unknown -> free-text input + the condition's predicate_help
 *
 * Emits `value-changed` with `{ value: unknown }`. A `null` value means the
 * condition is unconstrained (wildcard) for this rule.
 */
@customElement("ambience-condition-input")
export class AmbienceConditionInput extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }
    input {
      width: 100%;
      box-sizing: border-box;
      padding: 0.5rem;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: inherit;
    }
    .help {
      font-size: 0.85em;
      color: var(--secondary-text-color, #888);
      white-space: pre-wrap;
      margin-top: 0.25rem;
    }
  `;

  @property({ attribute: false }) condition!: ConditionInfo;
  @property({ attribute: false }) value: unknown = null;
  @property({ attribute: false }) periods?: PeriodStoreView;
  @property({ attribute: false }) dayConfig?: DayConfig;
  @property({ attribute: false }) weatherConfig?: import("../types.js").WeatherConfig;
  @property({ attribute: false }) hass?: HassConnection;

  private _emit(value: unknown) {
    emitValueChanged(this, value);
  }

  private _onText(e: InputEvent) {
    const raw = (e.target as HTMLInputElement).value;
    this._emit(raw.trim() === "" ? null : raw);
  }

  override render() {
    if (this.condition.input === "time_of_day") {
      return html`
        <ambience-time-of-day-input
          .value=${this.value as any}
          .periods=${this.periods}
          .hass=${this.hass as any}
          @value-changed=${(e: CustomEvent<{ value: unknown }>) => {
            e.stopPropagation();
            this._emit(e.detail.value);
          }}
        ></ambience-time-of-day-input>
      `;
    }
    if (this.condition.input === "script_predicate") {
      return html`
        <ambience-script-predicate-input
          .hass=${this.hass}
          .value=${this.value as any}
          @value-changed=${(e: CustomEvent<{ value: unknown }>) => {
            e.stopPropagation();
            this._emit(e.detail.value);
          }}
        ></ambience-script-predicate-input>
      `;
    }
    if (this.condition.input === "day_predicate") {
      return html`
        <ambience-day-predicate-input
          .hass=${this.hass}
          .value=${this.value as any}
          .dayConfig=${this.dayConfig ?? { workday_sensor: null, workday_calendar: null }}
          @value-changed=${(e: CustomEvent<{ value: unknown }>) => {
            e.stopPropagation();
            this._emit(e.detail.value);
          }}
        ></ambience-day-predicate-input>
      `;
    }
    if (this.condition.input === "weather_predicate") {
      return html`
        <ambience-weather-predicate-input
          .hass=${this.hass}
          .value=${this.value as any}
          .groups=${this.weatherConfig?.groups ?? []}
          .weatherEntity=${this.weatherConfig?.entity ?? undefined}
          @value-changed=${(e: CustomEvent<{ value: unknown }>) => {
            e.stopPropagation();
            this._emit(e.detail.value);
          }}
        ></ambience-weather-predicate-input>
      `;
    }
    if (this.condition.input === "sun_predicate") {
      return html`
        <ambience-sun-predicate-input
          .hass=${this.hass}
          .value=${this.value as any}
          @value-changed=${(e: CustomEvent<{ value: unknown }>) => {
            e.stopPropagation();
            this._emit(e.detail.value);
          }}
        ></ambience-sun-predicate-input>
      `;
    }
    if (this.condition.input === "template_predicate") {
      return html`
        <ambience-template-predicate-input
          .hass=${this.hass}
          .value=${this.value as any}
          @value-changed=${(e: CustomEvent<{ value: unknown }>) => {
            e.stopPropagation();
            this._emit(e.detail.value);
          }}
        ></ambience-template-predicate-input>
      `;
    }
    if (this.condition.input === "state_predicate") {
      return html`
        <ambience-state-predicate-input
          .hass=${this.hass}
          .value=${this.value as any}
          @value-changed=${(e: CustomEvent<{ value: unknown }>) => {
            e.stopPropagation();
            this._emit(e.detail.value);
          }}
        ></ambience-state-predicate-input>
      `;
    }
    if (this.condition.input === "people_predicate") {
      return html`
        <ambience-people-predicate-input
          .hass=${this.hass}
          .value=${this.value as any}
          @value-changed=${(e: CustomEvent<{ value: unknown }>) => {
            e.stopPropagation();
            this._emit(e.detail.value);
          }}
        ></ambience-people-predicate-input>
      `;
    }
    return html`
      <input
        type="text"
        placeholder=${localize(this.hass, "ui.any_placeholder", "(any)")}
        .value=${this.value == null ? "" : String(this.value)}
        @input=${this._onText}
      />
      <div class="help">${this.condition.predicate_help}</div>
    `;
  }
}
