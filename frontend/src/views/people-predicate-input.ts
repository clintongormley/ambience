import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import type { HassConnection } from "../api.js";
import { localize } from "../i18n.js";
import type { PeoplePredicate, PeopleQuant } from "../types.js";
import type { HaFormSchema } from "../ha-form.js";

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
 * optional per-rule `for` duration.
 *
 *   {who?: person.*[]   // empty/absent = the whole household
 *    quant?: any|everyone|nobody
 *    where?: home|zone.*           // the POSITIVE location, default "home"
 *    negate?: boolean              // default false; true = NOT at `where`
 *    for?: {h,m,s}|null}
 *
 * Mirrors `state-expr-atom.ts` for the ha-form-with-native-fallback controls
 * and `day-predicate-input.ts` for the localize + emit-on-interaction pattern.
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
 * `null` value = the matcher isn't yet constrained: we show Everybody + Home but
 * do NOT emit on mount (the rule editor removes the condition via its own
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

  // --- hass entity listing (mirrors state-expr-atom's hass.states access) --

  private _statesMap(): Record<string, { attributes?: Record<string, unknown> }> {
    return (
      (this.hass as { states?: Record<string, { attributes?: Record<string, unknown> }> } | undefined)
        ?.states ?? {}
    );
  }

  private _entitiesOfDomain(domain: string): { id: string; name: string }[] {
    const states = this._statesMap();
    const prefix = `${domain}.`;
    return Object.keys(states)
      .filter((id) => id.startsWith(prefix))
      .sort()
      .map((id) => ({
        id,
        name: (states[id]?.attributes?.friendly_name as string | undefined) ?? id,
      }));
  }

  _persons(): { id: string; name: string }[] {
    return this._entitiesOfDomain("person");
  }

  _zones(): { id: string; name: string }[] {
    return this._entitiesOfDomain("zone");
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
        case "any": return "any";
        case "everyone": return "all";
        case "nobody": return "none";
      }
    }
    // Base modes: everyone→Everybody, any→Anybody, nobody→Nobody.
    switch (this._cur().quant ?? "everyone") {
      case "nobody": return "nobody";
      case "any": return "anybody";
      default: return "everybody";
    }
  }

  private _hasFor(dur: PeoplePredicate["for"]): boolean {
    return !!dur && (dur.h !== 0 || dur.m !== 0 || dur.s !== 0);
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
    if (this._hasFor(cur.for)) out.for = cur.for;
    this._emit(out);
  }

  private _emit(value: PeoplePredicate) {
    this.value = value;
    this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _setMode(mode: Mode) {
    this._emitMode(mode);
  }

  private _setWhere(where: string) {
    const cur = this._cur();
    const out: PeoplePredicate = { quant: cur.quant ?? "everyone", where };
    if (this._effectiveNegate()) out.negate = true;
    if (this._hasWhoKey()) out.who = [...this._who()];
    if (this._hasFor(cur.for)) out.for = cur.for;
    this._emit(out);
  }

  private _setNegate(negate: boolean) {
    const cur = this._cur();
    const out: PeoplePredicate = { quant: cur.quant ?? "everyone", where: cur.where ?? "home" };
    if (negate) out.negate = true;
    if (this._hasWhoKey()) out.who = [...this._who()];
    if (this._hasFor(cur.for)) out.for = cur.for;
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
    if (this._hasFor(cur.for)) out.for = cur.for;
    this._emit(out);
  }

  private _setFor(dur: { h: number; m: number; s: number }) {
    const cur = this._cur();
    const out: PeoplePredicate = { quant: cur.quant ?? "everyone", where: cur.where ?? "home" };
    if (this._effectiveNegate()) out.negate = true;
    if (this._hasWhoKey()) out.who = [...this._who()];
    if (this._hasFor(dur)) out.for = dur;
    this._emit(out);
  }

  // --- for duration (mirrors state-expr-atom) ------------------------------

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

  private _modeLabel(m: Mode): string {
    switch (m) {
      case "everybody": return localize(this.hass, "ui.people_mode_everybody", "Everybody");
      case "anybody": return localize(this.hass, "ui.people_mode_anybody", "Anybody");
      case "nobody": return localize(this.hass, "ui.people_mode_nobody", "Nobody");
      case "any": return localize(this.hass, "ui.people_mode_any", "Any of:");
      case "all": return localize(this.hass, "ui.people_mode_all", "All of:");
      case "none": return localize(this.hass, "ui.people_mode_none", "None of:");
    }
  }

  private _renderMode(mode: Mode) {
    /* v8 ignore start -- ha-form path (real HA only) */
    if (customElements.get("ha-form")) {
      const schema: HaFormSchema[] = [{
        name: "mode",
        required: true,
        selector: {
          select: {
            mode: "dropdown",
            options: MODES.map((m) => ({ value: m, label: this._modeLabel(m) })),
          },
        },
      }];
      return html`<ha-form
        class="mode"
        .hass=${this.hass}
        .schema=${schema}
        .data=${{ mode }}
        .computeLabel=${() => ""}
        @value-changed=${(e: CustomEvent<{ value: { mode?: Mode } }>) => {
          e.stopPropagation();
          if (e.detail.value.mode) this._setMode(e.detail.value.mode);
        }}
      ></ha-form>`;
    }
    /* v8 ignore stop */
    return html`<select
      class="mode"
      @change=${(e: Event) => this._setMode((e.target as HTMLSelectElement).value as Mode)}
    >
      ${MODES.map((m) => html`<option value=${m} ?selected=${m === mode}>${this._modeLabel(m)}</option>`)}
    </select>`;
  }

  private _renderPeople() {
    const persons = this._persons();
    if (persons.length === 0) {
      return html`<div class="hint">${localize(this.hass, "ui.people_none_tracked", "No people tracked")}</div>`;
    }
    const who = this._who();
    return html`<div class="people-list">
      ${persons.map((p) => html`<label class="person-pill">
        <input
          type="checkbox"
          .checked=${who.includes(p.id)}
          @change=${(e: Event) => this._togglePerson(p.id, (e.target as HTMLInputElement).checked)}
        />${p.name}
      </label>`)}
    </div>
    <div class="field-error">${who.length === 0
      ? localize(this.hass, "ui.people_select_one", "Select at least one person")
      : ""}</div>`;
  }

  private _renderNegate(negate: boolean) {
    const options = [
      { value: "false", label: localize(this.hass, "ui.people_is_at", "Is at") },
      { value: "true", label: localize(this.hass, "ui.people_is_not_at", "Is not at") },
    ];
    const onChange = (v: string) => this._setNegate(v === "true");
    /* v8 ignore start -- ha-form path (real HA only) */
    if (customElements.get("ha-form")) {
      const schema: HaFormSchema[] = [{
        name: "negate",
        required: true,
        selector: { select: { mode: "dropdown", options } },
      }];
      return html`<ha-form
        class="negate"
        .hass=${this.hass}
        .schema=${schema}
        .data=${{ negate: negate ? "true" : "false" }}
        .computeLabel=${() => ""}
        @value-changed=${(e: CustomEvent<{ value: { negate?: string } }>) => {
          e.stopPropagation();
          if (e.detail.value.negate != null) onChange(e.detail.value.negate);
        }}
      ></ha-form>`;
    }
    /* v8 ignore stop */
    return html`<select
      class="negate"
      @change=${(e: Event) => onChange((e.target as HTMLSelectElement).value)}
    >
      ${options.map((o) => html`<option value=${o.value} ?selected=${o.value === (negate ? "true" : "false")}>${o.label}</option>`)}
    </select>`;
  }

  private _renderWhere(where: string) {
    const zones = this._zones().filter((z) => z.id !== "zone.home");
    const options = [
      { value: "home", label: localize(this.hass, "ui.people_where_home", "Home") },
      ...zones.map((z) => ({ value: z.id, label: z.name })),
    ];
    /* v8 ignore start -- ha-form path (real HA only) */
    if (customElements.get("ha-form")) {
      const schema: HaFormSchema[] = [{
        name: "where",
        required: true,
        selector: { select: { mode: "dropdown", options } },
      }];
      return html`<ha-form
        class="where"
        .hass=${this.hass}
        .schema=${schema}
        .data=${{ where }}
        .computeLabel=${() => ""}
        @value-changed=${(e: CustomEvent<{ value: { where?: string } }>) => {
          e.stopPropagation();
          if (e.detail.value.where) this._setWhere(e.detail.value.where);
        }}
      ></ha-form>`;
    }
    /* v8 ignore stop */
    return html`<select
      class="where"
      @change=${(e: Event) => this._setWhere((e.target as HTMLSelectElement).value)}
    >
      ${options.map((o) => html`<option value=${o.value} ?selected=${o.value === where}>${o.label}</option>`)}
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
        @value-changed=${(e: CustomEvent<{ value: { duration?: { hours?: number; minutes?: number; seconds?: number } } }>) => {
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
        ${showNegate
          ? this._renderNegate(negate)
          : html`<span class="label negate-static">${localize(this.hass, "ui.people_is_at_static", "is at")}</span>`}
        ${this._renderWhere(where)}
      </div>
      <div class="row">
        <span class="label">${localize(this.hass, "ui.people_for", "for")}</span>
        ${this._renderFor()}
      </div>
    `;
  }
}
