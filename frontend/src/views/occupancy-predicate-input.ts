import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

import type { HassConnection } from "../api.js";
import { emitValueChanged } from "../dom.js";
import type { HaFormSchema } from "../ha-form.js";
import { localize } from "../i18n.js";
import type { ForMode, OccupancyPredicate, OccupancyQuant } from "../types.js";
import { type ForDurationValue, hasForDuration, persistedForMode } from "./for-duration.js";
import { renderSelect, renderSensorField } from "./form-controls.js";

/**
 * Editor for an `occupancy` predicate: a presence-sensor picker (binary_sensor
 * entities filtered to occupancy/presence/motion device classes), a
 * Detected/Clear toggle (matching the Detected/Clear labels HA gives presence
 * binary_sensors in the entity-state condition), an Any/All quantifier (shown
 * only when more than one sensor is selected), and an optional per-scene `for`
 * duration.
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

  /** Build a clean predicate from the current value + overrides. Defaults
   *  (occupied:true, quant:"any") and a zero `for` are dropped to keep the
   *  wire format small. `for_mode` is dropped unless `for` is non-zero AND the
   *  mode is "less_than" (mirroring the zero-`for` normalisation). */
  private _build(overrides: Partial<OccupancyPredicate>): OccupancyPredicate {
    const merged = { ...this._cur(), ...overrides };
    const out: OccupancyPredicate = { sensors: merged.sensors ?? [] };
    if (merged.occupied === false) out.occupied = false;
    if (merged.quant === "all") out.quant = "all";
    if (hasForDuration(merged.for)) {
      out.for = merged.for;
      const m = persistedForMode(merged.for, merged.for_mode);
      if (m) out.for_mode = m;
    }
    if (merged.negate === true) out.negate = true;
    return out;
  }

  private _emit(value: OccupancyPredicate) {
    // No sensors selected = match-anything; collapse to null (the "condition
    // removed" sentinel) so the editor drops the row, like the unavailable widget.
    const next = value.sensors?.length ? value : null;
    this.value = next;
    emitValueChanged(this, next);
  }

  _setSensors(sensors: string[]) {
    this._emit(this._build({ sensors }));
  }

  _setOccupied(occupied: boolean) {
    this._emit(this._build({ occupied }));
  }

  _setNegate(negate: boolean) {
    this._emit(this._build({ negate }));
  }

  _setQuant(quant: OccupancyQuant) {
    this._emit(this._build({ quant }));
  }

  _setFor(dur: { h: number; m: number; s: number; mode?: ForMode }) {
    const { mode, ...d } = dur;
    this._emit(this._build({ for: d, for_mode: mode ?? "at_least" }));
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

  // --- render --------------------------------------------------------------

  private _renderSensors() {
    return renderSensorField(
      this.hass,
      this._sensorSchema(),
      this._sensors(),
      "binary_sensor.a, binary_sensor.b",
      (ids) => this._setSensors(ids),
    );
  }

  private _renderNegate(negate: boolean) {
    return renderSelect(
      this.hass,
      "negate",
      "negate",
      negate ? "is_not" : "is",
      [
        { value: "is", label: localize(this.hass, "ui.occupancy_is", "is") },
        { value: "is_not", label: localize(this.hass, "ui.occupancy_is_not", "is not") },
      ],
      (v) => this._setNegate(v === "is_not"),
    );
  }

  private _renderOccupied(occupied: boolean) {
    return renderSelect(
      this.hass,
      "state",
      "state",
      occupied ? "occupied" : "vacant",
      [
        { value: "occupied", label: localize(this.hass, "ui.occupancy_detected", "Detected") },
        { value: "vacant", label: localize(this.hass, "ui.occupancy_clear", "Clear") },
      ],
      (v) => this._setOccupied(v === "occupied"),
    );
  }

  private _renderQuant(quant: OccupancyQuant) {
    return renderSelect(
      this.hass,
      "quant",
      "quant",
      quant,
      [
        { value: "any", label: localize(this.hass, "ui.occupancy_any", "Any of") },
        { value: "all", label: localize(this.hass, "ui.occupancy_all", "All of") },
      ],
      (v) => this._setQuant(v as OccupancyQuant),
    );
  }

  private _renderFor() {
    // Shared h:m:s editor with the at-least/less-than mode toggle (see
    // for-duration.ts).
    return html`<ambience-for-duration
      data-field="for"
      .hass=${this.hass}
      .value=${this._cur().for ?? null}
      .mode=${this._cur().for_mode ?? "at_least"}
      @value-changed=${(e: CustomEvent<{ value: ForDurationValue }>) => {
        e.stopPropagation();
        this._setFor(e.detail.value);
      }}
    ></ambience-for-duration>`;
  }

  override render() {
    const cur = this._cur();
    const occupied = cur.occupied !== false;
    const negate = cur.negate === true;
    const quant: OccupancyQuant = cur.quant === "all" ? "all" : "any";
    // Quant goes above the (full-width) sensor picker so the controls read
    // top-to-bottom as "Any of <these sensors> is Detected". It only shows with
    // 2+ sensors (where any/all actually differ).
    return html`
      ${this._showQuant() ? html`<div class="row">${this._renderQuant(quant)}</div>` : ""}
      <div class="row">${this._renderSensors()}</div>
      <div class="row">
        ${this._renderNegate(negate)}
        ${this._renderOccupied(occupied)}
      </div>
      <div class="row">
        <span class="label">${localize(this.hass, "ui.occupancy_for", "for")}</span>
        ${this._renderFor()}
      </div>
    `;
  }
}
