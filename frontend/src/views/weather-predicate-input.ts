import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import type { HassConnection } from "../api.js";
import { localize, weatherAttrLabel, weatherConditionLabel } from "../i18n.js";
import type { WeatherPredicate, WeatherThreshold } from "../types.js";

const CONDITIONS = [
  "clear-night", "cloudy", "fog", "hail", "lightning", "lightning-rainy",
  "partlycloudy", "pouring", "rainy", "snowy", "snowy-rainy", "sunny",
  "windy", "windy-variant", "exceptional",
];
const ATTRIBUTES = ["temperature", "apparent_temperature", "humidity", "wind_speed", "pressure"];
const OPS: WeatherThreshold["op"][] = ["<", "<=", ">", ">="];

type HaFormSchema = { name: string; selector: Record<string, unknown> };

@customElement("ambience-weather-predicate-input")
export class AmbienceWeatherPredicateInput extends LitElement {
  static override styles = css`
    :host { display: block; }
    .section { margin-bottom: 1rem; }
    .section h4 { margin: 0 0 0.5rem 0; font-size: 0.95em; }
    .threshold {
      display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.4rem;
    }
    .threshold select, .threshold input { padding: 0.25rem; }
    .remove {
      background: none; border: none; color: var(--secondary-text-color);
      cursor: pointer; font-size: 1em; padding: 0;
    }
    button.add {
      background: transparent; border: 1px dashed var(--divider-color, #ccc);
      padding: 0.4rem 0.75rem; border-radius: 4px; cursor: pointer;
      color: var(--primary-text-color, inherit);
    }
  `;

  @property({ attribute: false }) hass?: HassConnection;
  @property({ attribute: false }) value: WeatherPredicate = null;

  private _current(): { conditions: string[]; thresholds: WeatherThreshold[] } {
    if (this.value === null) return { conditions: [], thresholds: [] };
    return { conditions: [...this.value.conditions], thresholds: [...this.value.thresholds] };
  }

  private _emit(next: { conditions: string[]; thresholds: WeatherThreshold[] }) {
    const empty = next.conditions.length === 0 && next.thresholds.length === 0;
    this.value = empty ? null : next;
    this.dispatchEvent(new CustomEvent("value-changed", {
      detail: { value: this.value }, bubbles: true, composed: true,
    }));
  }

  _setConditions(conditions: string[]) {
    this._emit({ ...this._current(), conditions });
  }

  _addThreshold() {
    const next = this._current();
    next.thresholds = [...next.thresholds, { attribute: "temperature", op: "<", value: 0 }];
    this._emit(next);
  }

  _updateThreshold(idx: number, t: WeatherThreshold) {
    const next = this._current();
    next.thresholds = next.thresholds.map((it, i) => (i === idx ? t : it));
    this._emit(next);
  }

  _removeThreshold(idx: number) {
    const next = this._current();
    next.thresholds = next.thresholds.filter((_, i) => i !== idx);
    this._emit(next);
  }

  _conditionsSchema(): HaFormSchema[] {
    return [{
      name: "conditions",
      selector: {
        select: {
          multiple: true,
          mode: "list",
          options: CONDITIONS.map((c) => ({ value: c, label: weatherConditionLabel(this.hass, c) })),
        },
      },
    }];
  }

  /* v8 ignore start -- ha-form path (real HA only) */
  private _renderConditions(conditions: string[]) {
    if (customElements.get("ha-form")) {
      return html`<ha-form
        .hass=${this.hass}
        .schema=${this._conditionsSchema()}
        .data=${{ conditions }}
        .computeLabel=${() => ""}
        @value-changed=${(e: CustomEvent<{ value: { conditions?: string[] } }>) => {
          e.stopPropagation();
          this._setConditions(e.detail.value.conditions ?? []);
        }}
      ></ha-form>`;
    }
    return html`${CONDITIONS.map((c) => html`
      <label style="display:inline-flex;gap:0.25rem;margin:0 0.5rem 0.25rem 0;">
        <input type="checkbox" .checked=${conditions.includes(c)}
          @change=${(e: Event) => {
            const on = (e.target as HTMLInputElement).checked;
            this._setConditions(on ? [...conditions, c] : conditions.filter((x) => x !== c));
          }} />${weatherConditionLabel(this.hass, c)}
      </label>`)}`;
  }
  /* v8 ignore stop */

  private _renderThreshold(idx: number, t: WeatherThreshold) {
    return html`
      <div class="threshold">
        <select @change=${(e: Event) => this._updateThreshold(idx, { ...t, attribute: (e.target as HTMLSelectElement).value })}>
          ${ATTRIBUTES.map((a) => html`<option value=${a} ?selected=${a === t.attribute}>${weatherAttrLabel(this.hass, a)}</option>`)}
        </select>
        <select @change=${(e: Event) => this._updateThreshold(idx, { ...t, op: (e.target as HTMLSelectElement).value as WeatherThreshold["op"] })}>
          ${OPS.map((o) => html`<option value=${o} ?selected=${o === t.op}>${o}</option>`)}
        </select>
        <input type="number" .value=${String(t.value)}
          @change=${(e: Event) => {
            const v = Number((e.target as HTMLInputElement).value);
            if (Number.isFinite(v)) this._updateThreshold(idx, { ...t, value: v });
          }} />
        <button class="remove" title=${localize(this.hass, "ui.remove", "Remove")} @click=${() => this._removeThreshold(idx)}>✕</button>
      </div>
    `;
  }

  override render() {
    const { conditions, thresholds } = this._current();
    return html`
      <div class="section">
        <h4>${localize(this.hass, "ui.conditions", "Conditions")}</h4>
        ${this._renderConditions(conditions)}
      </div>
      <div class="section">
        <h4>${localize(this.hass, "ui.thresholds", "Thresholds")}</h4>
        ${thresholds.map((t, i) => this._renderThreshold(i, t))}
        <button class="add" @click=${() => this._addThreshold()}>${localize(this.hass, "ui.add_threshold", "+ Add threshold")}</button>
      </div>
    `;
  }
}
