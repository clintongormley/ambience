import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import type { HassConnection } from "../api.js";
import { localize } from "../i18n.js";
import type { DayConfig, MatcherInfo, PeriodStoreView } from "../types.js";
import "./scene-combobox.js";
import "./time-of-day-input.js";
import "./day-predicate-input.js";
import "./weather-predicate-input.js";

/**
 * Dispatcher element for one matcher's predicate input. Given a matcher's
 * `input` hint and the current predicate value, renders the right widget:
 *
 *   "scene_combobox" -> <ambience-scene-combobox>
 *   "text" / unknown -> free-text input + the matcher's predicate_help
 *
 * Emits `value-changed` with `{ value: unknown }`. A `null` value means the
 * matcher is unconstrained (wildcard) for this rule.
 */
@customElement("ambience-matcher-input")
export class AmbienceMatcherInput extends LitElement {
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

  @property({ attribute: false }) matcher!: MatcherInfo;
  @property({ attribute: false }) value: unknown = null;
  @property({ attribute: false }) sceneSuggestions: string[] = [];
  @property({ attribute: false }) periods?: PeriodStoreView;
  @property({ attribute: false }) dayConfig?: DayConfig;
  @property({ attribute: false }) hass?: HassConnection;

  private _emit(value: unknown) {
    this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _onText(e: InputEvent) {
    const raw = (e.target as HTMLInputElement).value;
    this._emit(raw.trim() === "" ? null : raw);
  }

  override render() {
    if (this.matcher.input === "time_of_day") {
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
    if (this.matcher.input === "scene_combobox") {
      return html`
        <ambience-scene-combobox
          .hass=${this.hass}
          .value=${(this.value as string | null) ?? null}
          .suggestions=${this.sceneSuggestions}
          @value-changed=${(e: CustomEvent<{ value: string | null }>) => {
            e.stopPropagation();
            this._emit(e.detail.value);
          }}
        ></ambience-scene-combobox>
      `;
    }
    if (this.matcher.input === "day_predicate") {
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
    if (this.matcher.input === "weather_predicate") {
      return html`
        <ambience-weather-predicate-input
          .hass=${this.hass}
          .value=${this.value as any}
          @value-changed=${(e: CustomEvent<{ value: unknown }>) => {
            e.stopPropagation();
            this._emit(e.detail.value);
          }}
        ></ambience-weather-predicate-input>
      `;
    }
    return html`
      <input
        type="text"
        placeholder=${localize(this.hass, "ui.any_placeholder", "(any)")}
        .value=${this.value == null ? "" : String(this.value)}
        @input=${this._onText}
      />
      <div class="help">${this.matcher.predicate_help}</div>
    `;
  }
}
