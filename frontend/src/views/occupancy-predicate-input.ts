import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

import type { HassConnection } from "../api.js";
import { emitValueChanged } from "../dom.js";
import type { HaFormSchema } from "../ha-form.js";
import { localize } from "../i18n.js";
import type { OccupancyPredicate, OccupancyQuant } from "../types.js";

/**
 * Editor for an `occupancy` predicate: a presence-sensor picker (binary_sensor
 * entities filtered to occupancy/presence/motion device classes), an
 * Occupied/Vacant toggle, an Any/All quantifier (shown only when more than one
 * sensor is selected), and an optional per-scene `for` duration.
 *
 *   { sensors: binary_sensor.*[]   // empty = match-anything
 *     occupied?: boolean           // default true; false = vacant
 *     quant?: "any" | "all"        // default "any"
 *     for?: {h,m,s} | null }
 *
 * Mirrors `people-predicate-input.ts` for the ha-form-with-native-fallback
 * controls and the emit-on-interaction pattern. `null` value = the condition
 * isn't yet constrained; we render an empty picker and only emit on change.
 *
 * Emits `value-changed` with `{ value: OccupancyPredicate }`.
 */
@customElement("ambience-occupancy-predicate-input")
export class AmbienceOccupancyPredicateInput extends LitElement {
  static override styles = css`
    :host { display: block; }
    .row {
      display: flex; flex-wrap: wrap; align-items: center;
      gap: 0.5rem; margin-bottom: 0.6rem;
    }
    .label { color: var(--secondary-text-color, #888); font-size: 0.9em; }
    select, input[type="number"], input[type="text"] {
      padding: 0.25rem; border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px; background: var(--card-background-color, #fff);
      color: inherit;
    }
    .field { width: 100%; }
    .for-row { display: flex; gap: 0.25rem; align-items: center; }
    .for-row input[type='number'] { width: 3.5rem; }
  `;

  @property({ attribute: false }) hass?: HassConnection;
  @property({ attribute: false }) value: OccupancyPredicate | null = null;

  // --- value round-trip ----------------------------------------------------

  private _cur(): OccupancyPredicate {
    return this.value ?? { sensors: [] };
  }

  private _sensors(): string[] {
    return this._cur().sensors ?? [];
  }

  /** The quant control only makes sense (and only differs) with >1 sensor. */
  _showQuant(): boolean {
    return this._sensors().length > 1;
  }

  private _hasFor(dur: OccupancyPredicate["for"]): boolean {
    return !!dur && (dur.h !== 0 || dur.m !== 0 || dur.s !== 0);
  }

  /** Build a clean predicate from the current value + overrides. Defaults
   *  (occupied:true, quant:"any") and a zero `for` are dropped to keep the
   *  wire format small. */
  private _build(overrides: Partial<OccupancyPredicate>): OccupancyPredicate {
    const merged = { ...this._cur(), ...overrides };
    const out: OccupancyPredicate = { sensors: merged.sensors ?? [] };
    if (merged.occupied === false) out.occupied = false;
    if (merged.quant === "all") out.quant = "all";
    if (this._hasFor(merged.for)) out.for = merged.for;
    return out;
  }

  private _emit(value: OccupancyPredicate) {
    this.value = value;
    emitValueChanged(this, value);
  }

  _setSensors(sensors: string[]) {
    this._emit(this._build({ sensors }));
  }

  _setOccupied(occupied: boolean) {
    this._emit(this._build({ occupied }));
  }

  _setQuant(quant: OccupancyQuant) {
    this._emit(this._build({ quant }));
  }

  _setFor(dur: { h: number; m: number; s: number }) {
    this._emit(this._build({ for: dur }));
  }

  // --- schemas -------------------------------------------------------------

  _sensorSchema(): HaFormSchema[] {
    return [
      {
        name: "sensors",
        selector: {
          entity: {
            domain: "binary_sensor",
            device_class: ["occupancy", "presence", "motion"],
            multiple: true,
          },
        },
      },
    ];
  }

  _forSchema(): HaFormSchema[] {
    return [{ name: "duration", selector: { duration: { enable_day: false } } }];
  }

  _forData(): { duration: { hours: number; minutes: number; seconds: number } } {
    const d = this._cur().for ?? { h: 0, m: 0, s: 0 };
    return { duration: { hours: d.h, minutes: d.m, seconds: d.s } };
  }

  _setForFromHaForm(d: { hours?: number; minutes?: number; seconds?: number } | undefined) {
    this._setFor({ h: d?.hours ?? 0, m: d?.minutes ?? 0, s: d?.seconds ?? 0 });
  }

  // --- render --------------------------------------------------------------

  private _renderSensors() {
    const current = this._sensors();
    /* v8 ignore start -- ha-form path (real HA only) */
    if (customElements.get("ha-form")) {
      return html`<ha-form
        class="field"
        data-field="sensors"
        .hass=${this.hass}
        .schema=${this._sensorSchema()}
        .data=${{ sensors: current }}
        .computeLabel=${() => ""}
        @value-changed=${(e: CustomEvent<{ value: { sensors?: string[] } }>) => {
          e.stopPropagation();
          this._setSensors(e.detail.value.sensors ?? []);
        }}
      ></ha-form>`;
    }
    /* v8 ignore stop */
    return html`<input
      class="field"
      data-field="sensors"
      type="text"
      placeholder="binary_sensor.a, binary_sensor.b"
      .value=${current.join(", ")}
      @change=${(e: Event) =>
        this._setSensors(
          (e.target as HTMLInputElement).value
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s !== ""),
        )}
    />`;
  }

  private _renderOccupied(occupied: boolean) {
    const options = [
      { value: "occupied", label: localize(this.hass, "ui.occupancy_occupied", "Occupied") },
      { value: "vacant", label: localize(this.hass, "ui.occupancy_vacant", "Vacant") },
    ];
    const onChange = (v: string) => this._setOccupied(v === "occupied");
    const data = occupied ? "occupied" : "vacant";
    /* v8 ignore start -- ha-form path (real HA only) */
    if (customElements.get("ha-form")) {
      const schema: HaFormSchema[] = [
        { name: "state", required: true, selector: { select: { mode: "dropdown", options } } },
      ];
      return html`<ha-form
        class="state"
        .hass=${this.hass}
        .schema=${schema}
        .data=${{ state: data }}
        .computeLabel=${() => ""}
        @value-changed=${(e: CustomEvent<{ value: { state?: string } }>) => {
          e.stopPropagation();
          if (e.detail.value.state) onChange(e.detail.value.state);
        }}
      ></ha-form>`;
    }
    /* v8 ignore stop */
    return html`<select
      class="state"
      @change=${(e: Event) => onChange((e.target as HTMLSelectElement).value)}
    >
      ${options.map((o) => html`<option value=${o.value} ?selected=${o.value === data}>${o.label}</option>`)}
    </select>`;
  }

  private _renderQuant(quant: OccupancyQuant) {
    const options = [
      { value: "any", label: localize(this.hass, "ui.occupancy_any", "Any of") },
      { value: "all", label: localize(this.hass, "ui.occupancy_all", "All of") },
    ];
    const onChange = (v: string) => this._setQuant(v as OccupancyQuant);
    /* v8 ignore start -- ha-form path (real HA only) */
    if (customElements.get("ha-form")) {
      const schema: HaFormSchema[] = [
        { name: "quant", required: true, selector: { select: { mode: "dropdown", options } } },
      ];
      return html`<ha-form
        class="quant"
        .hass=${this.hass}
        .schema=${schema}
        .data=${{ quant }}
        .computeLabel=${() => ""}
        @value-changed=${(e: CustomEvent<{ value: { quant?: string } }>) => {
          e.stopPropagation();
          if (e.detail.value.quant) onChange(e.detail.value.quant);
        }}
      ></ha-form>`;
    }
    /* v8 ignore stop */
    return html`<select
      class="quant"
      @change=${(e: Event) => onChange((e.target as HTMLSelectElement).value)}
    >
      ${options.map((o) => html`<option value=${o.value} ?selected=${o.value === quant}>${o.label}</option>`)}
    </select>`;
  }

  private _renderFor() {
    /* v8 ignore start -- ha-form path (real HA only) */
    if (customElements.get("ha-form")) {
      return html`<ha-form
        data-field="for"
        .hass=${this.hass}
        .schema=${this._forSchema()}
        .data=${this._forData()}
        .computeLabel=${() => ""}
        @value-changed=${(
          e: CustomEvent<{
            value: { duration?: { hours?: number; minutes?: number; seconds?: number } };
          }>,
        ) => {
          e.stopPropagation();
          this._setForFromHaForm(e.detail.value.duration);
        }}
      ></ha-form>`;
    }
    /* v8 ignore stop */
    const d = this._cur().for ?? { h: 0, m: 0, s: 0 };
    return html`<div class="for-row" data-field="for">
      <input type="number" min="0" .value=${String(d.h)}
        @change=${(e: Event) => this._setFor({ ...d, h: Number((e.target as HTMLInputElement).value) || 0 })} />
      <span>:</span>
      <input type="number" min="0" .value=${String(d.m)}
        @change=${(e: Event) => this._setFor({ ...d, m: Number((e.target as HTMLInputElement).value) || 0 })} />
      <span>:</span>
      <input type="number" min="0" .value=${String(d.s)}
        @change=${(e: Event) => this._setFor({ ...d, s: Number((e.target as HTMLInputElement).value) || 0 })} />
    </div>`;
  }

  override render() {
    const cur = this._cur();
    const occupied = cur.occupied !== false;
    const quant: OccupancyQuant = cur.quant === "all" ? "all" : "any";
    return html`
      <div class="row">${this._renderSensors()}</div>
      <div class="row">
        ${this._renderOccupied(occupied)}
        ${this._showQuant() ? this._renderQuant(quant) : ""}
      </div>
      <div class="row">
        <span class="label">${localize(this.hass, "ui.occupancy_for", "for")}</span>
        ${this._renderFor()}
      </div>
    `;
  }
}
