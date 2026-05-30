import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import type { HassConnection } from "../api.js";
import { localize } from "../i18n.js";
import type { PeoplePredicate, PeopleQuant } from "../types.js";

type HaFormSchema = { name: string; required?: boolean; selector: Record<string, unknown> };

/** The five user-facing modes. The first two ("base") emit no `who`; the last
 *  three ("…these people") carry the selected person ids. Each maps to a
 *  `{quant, who?}` pair on the wire (the backend predicate model is unchanged). */
type Mode = "everybody" | "nobody" | "any" | "all" | "none";

const MODES: Mode[] = ["everybody", "nobody", "any", "all", "none"];
const PEOPLE_MODES = new Set<Mode>(["any", "all", "none"]);

/** Wire `quant` each mode emits. */
const MODE_QUANT: Record<Mode, PeopleQuant> = {
  everybody: "everyone",
  nobody: "nobody",
  any: "any",
  all: "everyone",
  none: "nobody",
};

/**
 * Editor for a `people` predicate: a single mode dropdown (everybody / nobody /
 * any|all|none of these people), an optional person checklist (shown only for
 * the "…these people" modes), a location dropdown ("Is" home/away/zone), and an
 * optional per-rule `for` duration.
 *
 *   {who?: person.*[]   // empty/absent = the whole household
 *    quant?: any|everyone|nobody
 *    where?: home|away|zone.*      // default "home"
 *    for?: {h,m,s}|null}
 *
 * Mirrors `state-expr-atom.ts` for the ha-form-with-native-fallback controls
 * and `day-predicate-input.ts` for the localize + emit-on-interaction pattern.
 * Person/zone options are read straight from `hass.states`.
 *
 * Round-trip (load `value` into the controls):
 *   who empty/absent: quant "nobody" → Nobody, else → Everybody
 *   who non-empty:    "any" → Any, "everyone" → All, "nobody" → None
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
      display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.6rem;
    }
    .hint { color: var(--secondary-text-color, #888); font-size: 0.85em; }
    select, input[type="number"], input[type="text"] {
      padding: 0.25rem; border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px; background: var(--card-background-color, #fff);
      color: inherit;
    }
    label.person-pill {
      display: inline-flex; align-items: center; gap: 0.25rem;
      padding: 0.15rem 0.4rem; border-radius: 3px;
      background: var(--secondary-background-color, #f5f5f5); cursor: pointer;
    }
    .for-row { display: flex; gap: 0.25rem; align-items: center; }
    .for-row input[type='number'] { width: 3.5rem; }
  `;

  @property({ attribute: false }) hass?: HassConnection;
  @property({ attribute: false }) value: PeoplePredicate | null = null;

  /** Selected people, tracked internally so switching to a base mode and back
   *  preserves the list. Seeded from `value.who` whenever `value` changes. */
  @state() private _who: string[] = [];

  /** The display mode, tracked internally so a "…these people" mode with no
   *  one ticked yet still shows the checklist (an empty `who` would otherwise
   *  round-trip to a base mode). Set on user interaction; otherwise derived
   *  from `value`. `null` = derive from `value`. */
  @state() private _modeOverride: Mode | null = null;

  /** True while a `value` change originates from our own `_emit`, so willUpdate
   *  can tell internal updates from a fresh external value. */
  private _selfEmitting = false;

  override willUpdate(changed: Map<string, unknown>): void {
    if (changed.has("value")) {
      const who = this.value?.who ?? [];
      if (who.length > 0) {
        this._who = [...who];
      } else if (!this._selfEmitting) {
        // A genuinely new external value with empty `who` clears any stale
        // prior selection (so it can't reappear on a later base↔people toggle).
        this._who = [];
      }
      // A fresh *external* value supersedes any prior interactive override;
      // our own emits keep the override (so an empty "…these people" mode
      // doesn't snap back to a base mode).
      if (!this._selfEmitting) this._modeOverride = null;
    }
    this._selfEmitting = false;
  }

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

  /** Current display mode: the interactive override if set, else derived from
   *  the loaded `value`. */
  private _mode(): Mode {
    return this._modeOverride ?? this._deriveMode();
  }

  /** Derive a display mode purely from the loaded `value`. */
  private _deriveMode(): Mode {
    const cur = this._cur();
    const who = cur.who ?? [];
    const quant = cur.quant ?? "any";
    if (who.length === 0) {
      return quant === "nobody" ? "nobody" : "everybody";
    }
    switch (quant) {
      case "any": return "any";
      case "everyone": return "all";
      case "nobody": return "none";
    }
  }

  private _hasFor(dur: PeoplePredicate["for"]): boolean {
    return !!dur && (dur.h !== 0 || dur.m !== 0 || dur.s !== 0);
  }

  /** Build + emit a predicate from a mode + the current where/for/people. A
   *  base mode drops `who`; a "…these people" mode includes the selected ids.
   *  `for` is included only when non-zero. */
  private _emitMode(mode: Mode) {
    const cur = this._cur();
    const where = cur.where ?? "home";
    const out: PeoplePredicate = { quant: MODE_QUANT[mode], where };
    if (PEOPLE_MODES.has(mode)) out.who = [...this._who];
    if (this._hasFor(cur.for)) out.for = cur.for;
    this._emit(out);
  }

  private _emit(value: PeoplePredicate) {
    this._selfEmitting = true;
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
    this._modeOverride = mode;
    this._emitMode(mode);
  }

  private _setWhere(where: string) {
    const cur = this._cur();
    const out: PeoplePredicate = { quant: cur.quant ?? "everyone", where };
    if (cur.who && cur.who.length > 0) out.who = [...cur.who];
    if (this._hasFor(cur.for)) out.for = cur.for;
    this._emit(out);
  }

  private _togglePerson(id: string, on: boolean) {
    this._who = on ? [...this._who, id] : this._who.filter((x) => x !== id);
    // Pin the current people-mode as an override so unchecking the last person
    // (emptying `who`) doesn't let the mode round-trip back to a base mode.
    const mode = this._mode();
    this._modeOverride = mode;
    this._emitMode(mode);
  }

  private _setFor(dur: { h: number; m: number; s: number }) {
    const cur = this._cur();
    const out: PeoplePredicate = { quant: cur.quant ?? "everyone", where: cur.where ?? "home" };
    if (cur.who && cur.who.length > 0) out.who = [...cur.who];
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
      case "nobody": return localize(this.hass, "ui.people_mode_nobody", "Nobody");
      case "any": return localize(this.hass, "ui.people_mode_any", "Any of these people");
      case "all": return localize(this.hass, "ui.people_mode_all", "All of these people");
      case "none": return localize(this.hass, "ui.people_mode_none", "None of these people");
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
    return html`<div class="people-list">
      ${persons.map((p) => html`<label class="person-pill">
        <input
          type="checkbox"
          .checked=${this._who.includes(p.id)}
          @change=${(e: Event) => this._togglePerson(p.id, (e.target as HTMLInputElement).checked)}
        />${p.name}
      </label>`)}
    </div>
    ${this._who.length === 0
      ? html`<div class="hint">${localize(this.hass, "ui.people_none_selected", "No one selected — matches anyone in the household")}</div>`
      : ""}`;
  }

  private _renderWhere(where: string) {
    const zones = this._zones().filter((z) => z.id !== "zone.home");
    const options = [
      { value: "home", label: localize(this.hass, "ui.people_where_home", "Home") },
      { value: "away", label: localize(this.hass, "ui.people_where_away", "Away") },
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
    return html`
      <div class="row">${this._renderMode(mode)}</div>
      ${PEOPLE_MODES.has(mode) ? this._renderPeople() : ""}
      <div class="row">
        <span class="label">${localize(this.hass, "ui.people_is", "Is")}</span>
        ${this._renderWhere(where)}
      </div>
      <div class="row">
        <span class="label">${localize(this.hass, "ui.people_for", "for")}</span>
        ${this._renderFor()}
      </div>
    `;
  }
}
