import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import type { HassConnection } from "../api.js";
import { localize } from "../i18n.js";
import type { PeoplePredicate, PeopleQuant } from "../types.js";

const QUANTS: PeopleQuant[] = ["any", "everyone", "nobody"];

type HaFormSchema = { name: string; required?: boolean; selector: Record<string, unknown> };

/**
 * Editor for a `people` predicate: who is home / away / in a named zone, with a
 * scoped quantifier and an optional per-person `for` duration.
 *
 *   {who?: person.*[]   // empty/absent = the whole household
 *    quant?: any|everyone|nobody   // default "any"
 *    where?: home|away|zone.*      // default "home"
 *    for?: {h,m,s}|null}
 *
 * Mirrors `day-predicate-input.ts` for the value/_emit round-trip (default
 * selection collapses to `null` = wildcard) and `state-expr-atom.ts` for the
 * ha-form-with-native-fallback `for` duration. Person/zone options are read
 * straight from `hass.states`, like `state-expr-atom.ts`.
 *
 * Emits `value-changed` with `{ value: PeoplePredicate | null }`.
 */
@customElement("ambience-people-predicate-input")
export class AmbiencePeoplePredicateInput extends LitElement {
  static override styles = css`
    :host { display: block; }
    .field { margin-bottom: 0.6rem; }
    .field-label {
      display: block; font-size: 0.85em;
      color: var(--secondary-text-color, #888); margin-bottom: 0.25rem;
    }
    .people-list { display: flex; flex-wrap: wrap; gap: 0.4rem; }
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

  /** True when `next` carries no constraint (the wildcard default). */
  private _isDefault(next: PeoplePredicate): boolean {
    return (
      (!next.who || next.who.length === 0) &&
      (next.quant ?? "any") === "any" &&
      (next.where ?? "home") === "home" &&
      !this._hasFor(next.for)
    );
  }

  private _hasFor(dur: PeoplePredicate["for"]): boolean {
    return !!dur && (dur.h !== 0 || dur.m !== 0 || dur.s !== 0);
  }

  /** Normalise + emit. An empty `who`/`{h:0,m:0,s:0}` `for` is dropped, and a
   *  fully-default predicate collapses to `null` (wildcard). */
  private _emit(next: PeoplePredicate) {
    const out: PeoplePredicate = { ...next };
    if (out.who && out.who.length === 0) delete out.who;
    if (!this._hasFor(out.for)) delete out.for;
    this.value = this._isDefault(next) ? null : out;
    this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _setQuant(quant: PeopleQuant) {
    this._emit({ ...this._cur(), quant });
  }

  private _setWhere(where: string) {
    this._emit({ ...this._cur(), where });
  }

  private _togglePerson(id: string, on: boolean) {
    const cur = this._cur();
    const who = cur.who ?? [];
    const next = on ? [...who, id] : who.filter((x) => x !== id);
    this._emit({ ...cur, who: next });
  }

  private _setFor(dur: { h: number; m: number; s: number }) {
    this._emit({ ...this._cur(), for: dur });
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

  private _quantLabel(q: PeopleQuant): string {
    switch (q) {
      case "any": return localize(this.hass, "ui.people_quant_any", "Any");
      case "everyone": return localize(this.hass, "ui.people_quant_everyone", "Everyone");
      case "nobody": return localize(this.hass, "ui.people_quant_nobody", "Nobody");
    }
  }

  private _renderQuant(quant: PeopleQuant) {
    /* v8 ignore start -- ha-form path (real HA only) */
    if (customElements.get("ha-form")) {
      const schema: HaFormSchema[] = [{
        name: "quant",
        required: true,
        selector: {
          select: {
            mode: "dropdown",
            options: QUANTS.map((q) => ({ value: q, label: this._quantLabel(q) })),
          },
        },
      }];
      return html`<ha-form
        class="quant"
        .hass=${this.hass}
        .schema=${schema}
        .data=${{ quant }}
        .computeLabel=${() => localize(this.hass, "ui.people_quant_label", "How many")}
        @value-changed=${(e: CustomEvent<{ value: { quant?: PeopleQuant } }>) => {
          e.stopPropagation();
          if (e.detail.value.quant) this._setQuant(e.detail.value.quant);
        }}
      ></ha-form>`;
    }
    /* v8 ignore stop */
    return html`<select
      class="quant"
      @change=${(e: Event) => this._setQuant((e.target as HTMLSelectElement).value as PeopleQuant)}
    >
      ${QUANTS.map((q) => html`<option value=${q} ?selected=${q === quant}>${this._quantLabel(q)}</option>`)}
    </select>`;
  }

  private _renderPeople(who: string[]) {
    const persons = this._persons();
    if (persons.length === 0) {
      return html`<div class="hint">${localize(this.hass, "ui.people_none_tracked", "No people tracked")}</div>`;
    }
    return html`<div class="people-list">
      ${persons.map((p) => html`<label class="person-pill">
        <input
          type="checkbox"
          .checked=${who.includes(p.id)}
          @change=${(e: Event) => this._togglePerson(p.id, (e.target as HTMLInputElement).checked)}
        />${p.name}
      </label>`)}
    </div>`;
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
        .computeLabel=${() => localize(this.hass, "ui.people_where_label", "Location")}
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
    const quant = cur.quant ?? "any";
    const where = cur.where ?? "home";
    const who = cur.who ?? [];
    return html`
      <section class="field">
        <label class="field-label">${localize(this.hass, "ui.people_quant_label", "How many")}</label>
        ${this._renderQuant(quant)}
      </section>
      <section class="field">
        <label class="field-label">${localize(this.hass, "ui.people_who_label", "Who (none = anyone in the household)")}</label>
        ${this._renderPeople(who)}
      </section>
      <section class="field">
        <label class="field-label">${localize(this.hass, "ui.people_where_label", "Location")}</label>
        ${this._renderWhere(where)}
      </section>
      <section class="field">
        <label class="field-label">${localize(this.hass, "ui.people_for_label", "For (optional)")}</label>
        ${this._renderFor()}
      </section>
    `;
  }
}
