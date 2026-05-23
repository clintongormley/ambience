import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import type { HassConnection } from "../api.js";
import { localize, weatherAttrLabel } from "../i18n.js";
import type { WeatherGroup, WeatherPredicate, WeatherThreshold } from "../types.js";

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
  @property({ attribute: false }) groups: WeatherGroup[] = [];

  private _current(): { groups: string[]; thresholds: WeatherThreshold[] } {
    if (this.value === null) return { groups: [], thresholds: [] };
    return { groups: [...this.value.groups], thresholds: [...this.value.thresholds] };
  }

  private _emit(next: { groups: string[]; thresholds: WeatherThreshold[] }) {
    const empty = next.groups.length === 0 && next.thresholds.length === 0;
    this.value = empty ? null : next;
    this.dispatchEvent(new CustomEvent("value-changed", {
      detail: { value: this.value }, bubbles: true, composed: true,
    }));
  }

  _setGroups(groups: string[]) {
    this._emit({ ...this._current(), groups });
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

  _groupsSchema(): HaFormSchema[] {
    return [{
      name: "groups",
      selector: {
        select: {
          multiple: true,
          mode: "list",
          options: this.groups.map((g) => ({ value: g.id, label: g.label })),
        },
      },
    }];
  }

  /* v8 ignore start -- ha-form path (real HA only) */
  private _renderGroups(groups: string[]) {
    if (customElements.get("ha-form")) {
      return html`<ha-form
        .hass=${this.hass}
        .schema=${this._groupsSchema()}
        .data=${{ groups }}
        .computeLabel=${() => ""}
        @value-changed=${(e: CustomEvent<{ value: { groups?: string[] } }>) => {
          e.stopPropagation();
          this._setGroups(e.detail.value.groups ?? []);
        }}
      ></ha-form>`;
    }
    return html`${this.groups.map((g) => html`
      <label style="display:inline-flex;gap:0.25rem;margin:0 0.5rem 0.25rem 0;">
        <input type="checkbox" .checked=${groups.includes(g.id)}
          @change=${(e: Event) => {
            const on = (e.target as HTMLInputElement).checked;
            this._setGroups(on ? [...groups, g.id] : groups.filter((x) => x !== g.id));
          }} />${g.label}
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
    const { groups, thresholds } = this._current();
    return html`
      <div class="section">
        <h4>${localize(this.hass, "ui.groups", "Groups")}</h4>
        ${this._renderGroups(groups)}
      </div>
      <div class="section">
        <h4>${localize(this.hass, "ui.thresholds", "Thresholds")}</h4>
        ${thresholds.map((t, i) => this._renderThreshold(i, t))}
        <button class="add" @click=${() => this._addThreshold()}>${localize(this.hass, "ui.add_threshold", "+ Add threshold")}</button>
      </div>
    `;
  }
}
