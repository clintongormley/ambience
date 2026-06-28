import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

import type { HassConnection } from "../api.js";
import { emitValueChanged } from "../dom.js";
import { localize } from "../i18n.js";
import type { ForMode, PeoplePredicate, PeopleQuant } from "../types.js";
import { type ForDurationValue, hasForDuration, persistedForMode } from "./for-duration.js";
import { renderSelect } from "./form-controls.js";
import { entitiesOfDomain } from "./hass-states.js";

/** The six user-facing modes. The first three ("base") emit no `who`; the last
 *  three ("…these people") carry the selected person ids. Each maps to a
 *  `{quant, who?}` pair on the wire (the backend predicate model is unchanged). */
type Mode = "everybody" | "anybody" | "nobody" | "any" | "all" | "none";

const MODES: Mode[] = ["everybody", "anybody", "nobody", "any", "all", "none"];
const PEOPLE_MODES = new Set<Mode>(["any", "all", "none"]);

/** Wire `quant` each mode emits. */
const MODE_QUANT: Record<Mode, PeopleQuant> = {
  everybody: "everyone",
  anybody: "any",
  nobody: "nobody",
  any: "any",
  all: "everyone",
  none: "nobody",
};

/**
 * Editor for a `people` predicate: a single mode dropdown (everybody / nobody /
 * any|all|none of these people), an optional person checklist (shown only for
 * the "…these people" modes), a two-part location control (an "Is at"/"Is not
 * at" toggle driving `negate`, plus a home/zone location dropdown), and an
 * optional per-scene `for` duration.
 *
 *   {who?: person.*[]   // empty/absent = the whole household
 *    quant?: any|everyone|nobody
 *    where?: home|zone.*           // the POSITIVE location, default "home"
 *    negate?: boolean              // default false; true = NOT at `where`
 *    for?: {h,m,s}|null}
 *
 * The mode / "Is at" / location dropdowns use the shared `renderSelect` helper
 * (like `occupancy-predicate-input.ts`); the editor follows
 * `day-predicate-input.ts` for the localize + emit-on-interaction pattern.
 * Person/zone options are read straight from `hass.states`.
 *
 * Modes are distinguished by the PRESENCE of the `who` key, not its contents:
 *   who absent:  "everyone" → Everybody, "any" → Anybody, "nobody" → Nobody
 *   who present: "any" → Any of:, "everyone" → All of:, "nobody" → None of:
 *                (the array may be empty — that's an unfinished, invalid
 *                 selection, NOT a collapse back to a base mode)
 *
 * Because a present-but-empty `who:[]` round-trips back to its own "X of:" mode,
 * the mode is derived purely from `value` — no reactive override machinery.
 *
 * `null` value = the condition isn't yet constrained: we show Everybody + Home but
 * do NOT emit on mount (the scene editor removes the condition via its own
 * control). Every explicit selection is a real constraint, so we emit the
 * corresponding predicate on change.
 *
 * Emits `value-changed` with `{ value: PeoplePredicate }`.
 */
@customElement("ambience-people-predicate-input")
export class AmbiencePeoplePredicateInput extends LitElement {
  static override styles = css`
    :host { display: block; }
    .row {
      display: flex; flex-wrap: wrap; align-items: center;
      gap: 0.5rem; margin-bottom: 0.6rem;
    }
    .label {
      color: var(--secondary-text-color, #888); font-size: 0.9em;
    }
    .people-list {
      display: flex; flex-direction: column; align-items: flex-start;
      gap: 0.3rem; margin-bottom: 0.6rem;
    }
    .hint { color: var(--secondary-text-color, #888); font-size: 0.85em; }
    .field-error {
      width: 100%; color: var(--error-color, #d32f2f); font-size: 0.85em; margin-top: 0.2rem;
      min-height: 1.2em;
    }
    select, input[type="number"], input[type="text"] {
      padding: 0.25rem; border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px; background: var(--card-background-color, #fff);
      color: inherit;
    }
    label.person-pill {
      display: inline-flex; align-items: center; gap: 0.25rem;
      padding: 0.15rem 0; cursor: pointer;
    }
    .for-row { display: flex; gap: 0.25rem; align-items: center; }
    .for-row input[type='number'] { width: 3.5rem; }
  `;

  @property({ attribute: false }) hass?: HassConnection;
  @property({ attribute: false }) value: PeoplePredicate | null = null;

  /** A plain memory of the last non-empty selection, used only to repopulate
   *  the checklist when switching from a base mode into an "X of:" mode. Not
   *  reactive and never drives the rendered selection — that comes from
   *  `value.who`. Updated in the toggle handler. */
  private _lastSelected: string[] = [];

  // --- hass entity listing -------------------------------------------------

  _persons(): { id: string; name: string }[] {
    return entitiesOfDomain(this.hass, "person");
  }

  _zones(): { id: string; name: string }[] {
    return entitiesOfDomain(this.hass, "zone");
  }

  // --- value round-trip ----------------------------------------------------

  private _cur(): PeoplePredicate {
    return this.value ?? {};
  }

  /** The currently-selected people, read straight from the predicate. */
  private _who(): string[] {
    return this.value?.who ?? [];
  }

  /** True when the predicate carries a `who` key (even if empty) — i.e. it's
   *  one of the "X of:" modes rather than a base mode. */
  private _hasWhoKey(): boolean {
    return this.value != null && Array.isArray(this.value.who);
  }

  /** Display mode, derived purely from `value`. The PRESENCE of the `who` key
   *  selects base vs "X of:"; an empty array stays an "X of:" mode (it's just
   *  an unfinished selection). */
  private _mode(): Mode {
    // An "X of:" mode (who key present) defaults a missing quant to "any";
    // a base mode (no who key) defaults a missing quant to "everyone", so a
    // fresh/`{}` value lands on Everybody rather than Anybody.
    if (this._hasWhoKey()) {
      switch (this._cur().quant ?? "any") {
        case "any":
          return "any";
        case "everyone":
          return "all";
        case "nobody":
          return "none";
      }
    }
    // Base modes: everyone→Everybody, any→Anybody, nobody→Nobody.
    switch (this._cur().quant ?? "everyone") {
      case "nobody":
        return "nobody";
      case "any":
        return "anybody";
      default:
        return "everybody";
    }
  }

  /** Copy `for` (and, when non-zero + "less_than", `for_mode`) from a source
   *  duration/mode onto an outgoing predicate. Mirrors the zero-`for`
   *  normalisation: `for_mode` is omitted whenever `for` is dropped or the mode
   *  is "at_least". The single point that decides the on-wire `for`/`for_mode`
   *  shape, so every build path stays consistent. */
  private _applyFor(
    out: PeoplePredicate,
    dur: PeoplePredicate["for"],
    mode: ForMode | null | undefined,
  ): void {
    if (hasForDuration(dur)) {
      out.for = dur;
      const m = persistedForMode(dur, mode);
      if (m) out.for_mode = m;
    }
  }

  /** True for the "negative quant" modes — Nobody and None of: (quant
   *  "nobody"). For these, combining with "Is not at" produces a confusing
   *  double negative, so the is-at/is-not-at toggle is hidden and `negate` is
   *  forced off. A `negate:true` carried by a loaded value is ignored. */
  private _isNegativeQuant(): boolean {
    return MODE_QUANT[this._mode()] === "nobody";
  }

  /** The effective `negate`, honouring the toggle only when it's shown. Always
   *  false for Nobody / None of:. */
  private _effectiveNegate(): boolean {
    return !this._isNegativeQuant() && Boolean(this._cur().negate);
  }

  /** Build + emit a predicate from a mode + the current where/for/people. A
   *  base mode drops `who`; an "X of:" mode ALWAYS carries a `who` key,
   *  repopulated from the last selection when switching in from a base mode.
   *  `for` is included only when non-zero. */
  private _emitMode(mode: Mode) {
    const cur = this._cur();
    const where = cur.where ?? "home";
    const out: PeoplePredicate = { quant: MODE_QUANT[mode], where };
    // Drop `negate` when switching into a negative-quant mode (Nobody / None
    // of:) — those hide the toggle and would otherwise read as a double
    // negative.
    if (cur.negate && MODE_QUANT[mode] !== "nobody") out.negate = true;
    if (PEOPLE_MODES.has(mode)) {
      if (this._hasWhoKey()) {
        // An explicit selection is already present (incl. an explicit empty
        // who:[] from a loaded value) — keep it exactly.
        out.who = [...this._who()];
      } else if (this._lastSelected.length > 0) {
        // Switching in from a base/fresh state, but we remember a prior
        // selection — repopulate it.
        out.who = [...this._lastSelected];
      } else {
        // First time into an "X of:" mode with nothing remembered: default to
        // everyone ticked, so the list shows fully selected and valid rather
        // than empty. Falls to [] only if there genuinely are no persons.
        out.who = this._persons().map((p) => p.id);
      }
    }
    this._applyFor(out, cur.for, cur.for_mode);
    this._emit(out);
  }

  private _emit(value: PeoplePredicate) {
    this.value = value;
    emitValueChanged(this, value);
  }

  private _setMode(mode: Mode) {
    this._emitMode(mode);
  }

  private _setWhere(where: string) {
    const cur = this._cur();
    const out: PeoplePredicate = { quant: cur.quant ?? "everyone", where };
    if (this._effectiveNegate()) out.negate = true;
    if (this._hasWhoKey()) out.who = [...this._who()];
    this._applyFor(out, cur.for, cur.for_mode);
    this._emit(out);
  }

  private _setNegate(negate: boolean) {
    const cur = this._cur();
    const out: PeoplePredicate = { quant: cur.quant ?? "everyone", where: cur.where ?? "home" };
    if (negate) out.negate = true;
    if (this._hasWhoKey()) out.who = [...this._who()];
    this._applyFor(out, cur.for, cur.for_mode);
    this._emit(out);
  }

  private _togglePerson(id: string, on: boolean) {
    const next = on ? [...this._who(), id] : this._who().filter((x) => x !== id);
    if (next.length > 0) this._lastSelected = [...next];
    const cur = this._cur();
    const out: PeoplePredicate = {
      quant: cur.quant ?? "any",
      where: cur.where ?? "home",
      who: next,
    };
    if (this._effectiveNegate()) out.negate = true;
    this._applyFor(out, cur.for, cur.for_mode);
    this._emit(out);
  }

  private _setFor(dur: { h: number; m: number; s: number; mode?: ForMode }) {
    const { mode, ...d } = dur;
    const cur = this._cur();
    const out: PeoplePredicate = { quant: cur.quant ?? "everyone", where: cur.where ?? "home" };
    if (this._effectiveNegate()) out.negate = true;
    if (this._hasWhoKey()) out.who = [...this._who()];
    this._applyFor(out, d, mode ?? "at_least");
    this._emit(out);
  }

  // --- render --------------------------------------------------------------

  private _modeLabel(m: Mode): string {
    switch (m) {
      case "everybody":
        return localize(this.hass, "ui.people_mode_everybody", "Everybody");
      case "anybody":
        return localize(this.hass, "ui.people_mode_anybody", "Anybody");
      case "nobody":
        return localize(this.hass, "ui.people_mode_nobody", "Nobody");
      case "any":
        return localize(this.hass, "ui.people_mode_any", "Any of:");
      case "all":
        return localize(this.hass, "ui.people_mode_all", "All of:");
      case "none":
        return localize(this.hass, "ui.people_mode_none", "None of:");
    }
  }

  private _renderMode(mode: Mode) {
    return renderSelect(
      this.hass,
      "mode",
      mode,
      MODES.map((m) => ({ value: m, label: this._modeLabel(m) })),
      (v) => this._setMode(v as Mode),
    );
  }

  private _renderPeople() {
    const persons = this._persons();
    if (persons.length === 0) {
      return html`<div class="hint">${localize(this.hass, "ui.people_none_tracked", "No people tracked")}</div>`;
    }
    const who = this._who();
    return html`<div class="people-list">
      ${persons.map(
        (p) => html`<label class="person-pill">
        <input
          type="checkbox"
          .checked=${who.includes(p.id)}
          @change=${(e: Event) => this._togglePerson(p.id, (e.target as HTMLInputElement).checked)}
        />${p.name}
      </label>`,
      )}
    </div>
    <div class="field-error">${
      who.length === 0
        ? localize(this.hass, "ui.people_select_one", "Select at least one person")
        : ""
    }</div>`;
  }

  private _renderNegate(negate: boolean) {
    return renderSelect(
      this.hass,
      "negate",
      negate ? "true" : "false",
      [
        { value: "false", label: localize(this.hass, "ui.people_is_at", "Is at") },
        { value: "true", label: localize(this.hass, "ui.people_is_not_at", "Is not at") },
      ],
      (v) => this._setNegate(v === "true"),
    );
  }

  private _renderWhere(where: string) {
    const zones = this._zones().filter((z) => z.id !== "zone.home");
    return renderSelect(
      this.hass,
      "where",
      where,
      [
        { value: "home", label: localize(this.hass, "ui.people_where_home", "Home") },
        ...zones.map((z) => ({ value: z.id, label: z.name })),
      ],
      (v) => this._setWhere(v),
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
    const where = cur.where ?? "home";
    const mode = this._mode();
    // Hide the is-at/is-not-at toggle for the negative-quant modes (Nobody /
    // None of:), where it would only produce a double negative.
    const showNegate = !this._isNegativeQuant();
    const negate = this._effectiveNegate();
    return html`
      <div class="row">${this._renderMode(mode)}</div>
      ${PEOPLE_MODES.has(mode) ? this._renderPeople() : ""}
      <div class="row">
        ${
          showNegate
            ? this._renderNegate(negate)
            : html`<span class="label negate-static">${localize(this.hass, "ui.people_is_at_static", "is at")}</span>`
        }
        ${this._renderWhere(where)}
      </div>
      <div class="row">
        <span class="label">${localize(this.hass, "ui.people_for", "for")}</span>
        ${this._renderFor()}
      </div>
    `;
  }
}
