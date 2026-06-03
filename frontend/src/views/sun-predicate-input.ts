import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

import type { HassConnection } from "../api.js";
import { emitValueChanged } from "../dom.js";
import { localize } from "../i18n.js";
import type { SunAzimuth, SunElevation, SunPredicate, SunRange } from "../types.js";

// 3×3 compass grid laid out as the sky looks from below — North at the top,
// `null` is the empty centre cell. Row-major order drives both the DOM and the
// visual layout:  NW N NE / W · E / SW S SE.
const COMPASS_LAYOUT: (string | null)[] = ["NW", "N", "NE", "W", null, "E", "SW", "S", "SE"];

type ElevationMode = "any" | "above" | "below" | "between";

@customElement("ambience-sun-predicate-input")
export class AmbienceSunPredicateInput extends LitElement {
  static override styles = css`
    :host { display: block; }
    .section { margin-bottom: 1rem; }
    .section h4 { margin: 0 0 0.5rem 0; font-size: 0.95em; }
    .row { display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.4rem; }
    select, input[type="number"] {
      padding: 0.25rem;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: inherit;
    }
    .deg { color: var(--secondary-text-color, #888); font-size: 0.9em; }
    .sectors {
      display: grid;
      /* Equal-width columns so every checkbox lines up vertically; left-aligned
         content keeps each checkbox flush at the start of its column. */
      grid-template-columns: repeat(3, 4rem);
      gap: 0.4rem 0.5rem;
      justify-items: start;
      width: max-content;
    }
    .sectors label {
      display: inline-flex; align-items: center; gap: 0.3rem; margin: 0;
    }
    .custom-range {
      display: inline-flex; align-items: center; gap: 0.3rem;
      margin: 0.75rem 0 0.4rem;
    }
  `;

  @property({ attribute: false }) hass?: HassConnection;
  @property({ attribute: false }) value: SunPredicate = null;

  private _current(): {
    elevation: SunElevation | null;
    sectors: string[];
    range: SunRange | null;
  } {
    const ranges = this.value?.azimuth?.ranges ?? [];
    return {
      elevation: this.value?.elevation ?? null,
      sectors: [...(this.value?.azimuth?.sectors ?? [])],
      range: ranges.length ? { ...ranges[0] } : null,
    };
  }

  private _emit(next: {
    elevation: SunElevation | null;
    sectors: string[];
    range: SunRange | null;
  }) {
    const pred: { elevation?: SunElevation; azimuth?: SunAzimuth } = {};
    if (next.elevation && (next.elevation.min != null || next.elevation.max != null)) {
      pred.elevation = next.elevation;
    }
    const az: SunAzimuth = {};
    if (next.sectors.length) az.sectors = next.sectors;
    if (next.range) az.ranges = [next.range];
    if (az.sectors || az.ranges) pred.azimuth = az;
    this.value = pred.elevation || pred.azimuth ? pred : null;
    emitValueChanged(this, this.value);
  }

  _setElevation(elevation: SunElevation | null) {
    this._emit({ ...this._current(), elevation });
  }

  _setSectors(sectors: string[]) {
    this._emit({ ...this._current(), sectors });
  }

  _setRange(range: SunRange | null) {
    this._emit({ ...this._current(), range });
  }

  private _mode(elevation: SunElevation | null): ElevationMode {
    if (!elevation || (elevation.min == null && elevation.max == null)) return "any";
    if (elevation.min != null && elevation.max != null) return "between";
    return elevation.min != null ? "above" : "below";
  }

  private _onModeChange(mode: ElevationMode, current: SunElevation | null) {
    const min = current?.min ?? 0;
    const max = current?.max ?? 0;
    if (mode === "any") this._setElevation(null);
    else if (mode === "above") this._setElevation({ min });
    else if (mode === "below") this._setElevation({ max });
    else this._setElevation({ min, max });
  }

  private _toggleSector(sectors: string[], s: string, on: boolean) {
    this._setSectors(on ? [...sectors, s] : sectors.filter((x) => x !== s));
  }

  private _renderSectors(sectors: string[]) {
    // 3×3 compass grid; the centre cell is empty. DOM order matches the
    // visual layout so tab order reads left-to-right, top-to-bottom.
    return html`<div class="sectors">${COMPASS_LAYOUT.map((s) =>
      s === null
        ? html`<span class="spacer"></span>`
        : html`<label>
            <input type="checkbox" .checked=${sectors.includes(s)}
              @change=${(e: Event) =>
                this._toggleSector(sectors, s, (e.target as HTMLInputElement).checked)} />${s}
          </label>`,
    )}</div>`;
  }

  private _renderElevation(elevation: SunElevation | null) {
    const mode = this._mode(elevation);
    const modes: ElevationMode[] = ["any", "above", "below", "between"];
    const labels: Record<ElevationMode, string> = {
      any: localize(this.hass, "ui.sun.any", "Any"),
      above: localize(this.hass, "ui.sun.above", "Above"),
      below: localize(this.hass, "ui.sun.below", "Below"),
      between: localize(this.hass, "ui.sun.between", "Between"),
    };
    return html`
      <div class="row">
        <select @change=${(e: Event) =>
          this._onModeChange((e.target as HTMLSelectElement).value as ElevationMode, elevation)}>
          ${modes.map((m) => html`<option value=${m} ?selected=${m === mode}>${labels[m]}</option>`)}
        </select>
        ${
          mode === "above" || mode === "between"
            ? html`<input type="number" class="min" .value=${String(elevation?.min ?? 0)}
              @change=${(e: Event) =>
                this._setElevation({
                  ...(mode === "between" ? { max: elevation?.max ?? 0 } : {}),
                  min: Number((e.target as HTMLInputElement).value),
                })} /><span class="deg">°</span>`
            : ""
        }
        ${
          mode === "below" || mode === "between"
            ? html`<input type="number" class="max" .value=${String(elevation?.max ?? 0)}
              @change=${(e: Event) =>
                this._setElevation({
                  ...(mode === "between" ? { min: elevation?.min ?? 0 } : {}),
                  max: Number((e.target as HTMLInputElement).value),
                })} /><span class="deg">°</span>`
            : ""
        }
      </div>
    `;
  }

  private _renderCustomRange(range: SunRange | null) {
    return html`
      <label class="custom-range">
        <input type="checkbox" class="custom-range-toggle" .checked=${range !== null}
          @change=${(e: Event) =>
            this._setRange((e.target as HTMLInputElement).checked ? { from: 0, to: 0 } : null)} />
        ${localize(this.hass, "ui.sun.custom_range", "Custom range")}
      </label>
      ${
        range === null
          ? ""
          : html`<div class="row range-row">
            <input type="number" class="from" .value=${String(range.from)}
              @change=${(e: Event) =>
                this._setRange({ ...range, from: Number((e.target as HTMLInputElement).value) })} />
            <span class="deg">°–</span>
            <input type="number" class="to" .value=${String(range.to)}
              @change=${(e: Event) =>
                this._setRange({ ...range, to: Number((e.target as HTMLInputElement).value) })} />
            <span class="deg">°</span>
          </div>`
      }
    `;
  }

  override render() {
    const { elevation, sectors, range } = this._current();
    return html`
      <div class="section">
        <h4>${localize(this.hass, "ui.sun.elevation", "Elevation")}</h4>
        ${this._renderElevation(elevation)}
      </div>
      <div class="section">
        <h4>${localize(this.hass, "ui.sun.azimuth", "Azimuth")}</h4>
        ${this._renderSectors(sectors)}
        ${this._renderCustomRange(range)}
      </div>
    `;
  }
}
