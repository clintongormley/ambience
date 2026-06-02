import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { localize, periodLabel } from "../i18n.js";
import { summariseTimeOfDay } from "../summary.js";
import type {
  PeriodStoreView,
  TimeEndpoint,
  TimeOfDayPredicate,
  TimeRange,
} from "../types.js";
import "./time-endpoint.js";

type Entry =
  | { kind: "any" }
  | { kind: "period"; period: string }
  | { kind: "range"; from: TimeEndpoint; to: TimeEndpoint };

const ANY: Entry = { kind: "any" };

const DEFAULT_RANGE: TimeRange = {
  from: { kind: "time", hh: 9, mm: 0 },
  to: { kind: "time", hh: 17, mm: 0 },
};

/**
 * Predicate input for the time_of_day condition.
 *
 * UI: a primary dropdown ("Any time" / "Custom range" / named periods). When
 * "Custom range" is selected, the from/to editors render below. Entries can be
 * stacked via "+ add another time range" to produce an OR-list predicate.
 *
 * Emits `value-changed` with `{ value: TimeOfDayPredicate }` (null, single
 * value, or list — auto-normalised).
 */
@customElement("ambience-time-of-day-input")
export class AmbienceTimeOfDayInput extends LitElement {
  static override styles = css`
    :host { display: block; }
    .entry {
      display: flex; flex-direction: column; gap: 0.5rem;
      margin-bottom: 0.5rem;
    }
    .entry-header { display: flex; align-items: center; gap: 0.5rem; }
    select { padding: 0.4rem; flex: 1; }
    .remove {
      background: none; border: none; color: var(--secondary-text-color, #888);
      cursor: pointer; font-size: 1.1em;
    }
    .range-row { display: flex; align-items: center; gap: 0.5rem; }
    .range-row label { min-width: 3em; font-size: 0.9em; color: var(--secondary-text-color); }
    .add-btn {
      background: none; border: 1px dashed var(--divider-color, #ccc);
      padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer; color: inherit;
    }
    .summary-chip {
      display: flex; align-items: center; gap: 0.5rem;
      padding: 0.4rem 0.6rem;
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 4px;
      margin-bottom: 0.5rem;
      background: var(--secondary-background-color, #f5f5f5);
      cursor: pointer;
    }
    .summary-chip:hover { border-color: var(--primary-color, #03a9f4); }
    .chip-label { flex: 1; }
  `;

  @property({ attribute: false }) value: TimeOfDayPredicate = null;
  @property({ attribute: false }) periods?: PeriodStoreView;
  @property({ attribute: false }) hass?: { localize?: (k: string) => string | undefined; [key: string]: unknown };

  @state() private _entries: Entry[] = [ANY];
  @state() private _openIdx: number = 0;

  override willUpdate(changed: Map<string, unknown>): void {
    if (changed.has("value")) {
      this._entries = this._predicateToEntries(this.value);
      if (this._entries.length === 0) this._entries = [ANY];
      // Default open index to last entry when loading from value
      this._openIdx = Math.max(0, this._entries.length - 1);
    }
    if (this._openIdx >= this._entries.length) {
      this._openIdx = Math.max(0, this._entries.length - 1);
    }
  }

  override updated(): void {
    // Imperatively sync each expanded entry's select value after DOM is committed.
    // Needed because the <select>.value property must be set after <option>
    // children exist (jsdom and some browsers require this ordering).
    // In multi-entry mode only one entry is expanded (at _openIdx), so there
    // is at most one .entry select in the DOM.
    const selects = this.shadowRoot?.querySelectorAll<HTMLSelectElement>(".entry select");
    selects?.forEach((sel) => {
      const entry = this._entries[this._openIdx];
      if (!entry) return;
      const target =
        entry.kind === "any" ? "__any__"
        : entry.kind === "range" ? "__custom__"
        : entry.period;
      if (sel.value !== target) sel.value = target;
    });
  }

  private _predicateToEntries(pred: TimeOfDayPredicate): Entry[] {
    if (pred === null) return [ANY];
    const list = Array.isArray(pred) ? pred : [pred];
    return list.map((item) => {
      if ("period" in item) return { kind: "period", period: item.period };
      return { kind: "range", from: item.from, to: item.to };
    });
  }

  private _emit(entries: Entry[]) {
    const items = entries
      .filter((e) => e.kind !== "any")
      .map((e) =>
        e.kind === "period"
          ? { period: e.period }
          : { from: e.from, to: e.to },
      );
    const value: TimeOfDayPredicate =
      items.length === 0 ? null : items.length === 1 ? items[0]! : items;
    this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _effectiveIds(): string[] {
    if (!this.periods) return [];
    const builtinIds = Object.keys(this.periods.builtins);
    const customOnly = Object.keys(this.periods.custom).filter(
      (id) => !(id in this.periods!.builtins),
    );
    const hidden = new Set(this.periods.hidden);
    return [...builtinIds.filter((id) => !hidden.has(id)), ...customOnly];
  }

  private _onSelectChange(idx: number, e: Event) {
    const val = (e.target as HTMLSelectElement).value;
    const entries = [...this._entries];
    if (val === "__any__") entries[idx] = ANY;
    else if (val === "__custom__") entries[idx] = { kind: "range", ...DEFAULT_RANGE };
    else entries[idx] = { kind: "period", period: val };
    this._entries = entries;
    this._emit(entries);
  }

  private _onRangeChange(idx: number, which: "from" | "to", e: CustomEvent<{ value: TimeEndpoint }>) {
    e.stopPropagation();
    const entry = this._entries[idx];
    if (!entry || entry.kind !== "range") return;
    const entries = [...this._entries];
    entries[idx] = { ...entry, [which]: e.detail.value } as Entry;
    this._entries = entries;
    this._emit(entries);
  }

  private _onRemove(idx: number) {
    const entries = this._entries.filter((_, i) => i !== idx);
    this._entries = entries.length === 0 ? [ANY] : entries;
    if (this._openIdx >= this._entries.length) {
      this._openIdx = Math.max(0, this._entries.length - 1);
    } else if (idx < this._openIdx) {
      this._openIdx -= 1;
    }
    this._emit(this._entries);
  }

  private _onAdd() {
    const entries = [...this._entries, { kind: "range", ...DEFAULT_RANGE } as Entry];
    this._entries = entries;
    this._openIdx = entries.length - 1;
    this._emit(entries);
  }

  private _onChipClick(idx: number) {
    this._openIdx = idx;
  }

  private _renderChip(entry: Entry, idx: number) {
    let label: string;
    if (entry.kind === "any") {
      label = localize(this.hass, "ui.any_placeholder", "(any)");
    } else if (entry.kind === "period") {
      label = summariseTimeOfDay({ period: entry.period }, { hass: this.hass, periods: this.periods });
    } else {
      label = summariseTimeOfDay({ from: entry.from, to: entry.to }, { hass: this.hass, periods: this.periods });
    }
    return html`
      <div class="summary-chip" @click=${() => this._onChipClick(idx)}>
        <span class="chip-label">${label}</span>
        ${this._entries.length > 1
          ? html`<button class="remove" @click=${(e: Event) => { e.stopPropagation(); this._onRemove(idx); }} title=${localize(this.hass, "ui.remove", "Remove")}>✕</button>`
          : ""}
      </div>
    `;
  }

  private _renderEntry(entry: Entry, idx: number, allowAny: boolean) {
    const ids = this._effectiveIds();
    const customMap = this.periods?.custom ?? {};
    return html`
      <div class="entry">
        <div class="entry-header">
          <select @change=${(e: Event) => this._onSelectChange(idx, e)}>
            ${allowAny ? html`<option value="__any__">${localize(this.hass, "ui.any_time", "Any time")}</option>` : ""}
            <option value="__custom__">${localize(this.hass, "ui.custom_range", "Custom range")}</option>
            <option disabled>──────</option>
            ${ids.map(
              (id) => html`<option value=${id}>
                ${periodLabel(this.hass, id, customMap)}${customMap[id] && !this.periods?.builtins[id] ? localize(this.hass, "ui.custom_suffix", " (custom)") : ""}
              </option>`,
            )}
          </select>
          ${this._entries.length > 1
            ? html`<button class="remove" @click=${() => this._onRemove(idx)} title=${localize(this.hass, "ui.remove", "Remove")}>✕</button>`
            : ""}
        </div>
        ${entry.kind === "range"
          ? html`
              <div class="range-row">
                <label>${localize(this.hass, "ui.from_label", "From")}</label>
                <ambience-time-endpoint
                  .hass=${this.hass}
                  .value=${entry.from}
                  @value-changed=${(e: CustomEvent<{ value: TimeEndpoint }>) =>
                    this._onRangeChange(idx, "from", e)}
                ></ambience-time-endpoint>
              </div>
              <div class="range-row">
                <label>${localize(this.hass, "ui.to_label", "To")}</label>
                <ambience-time-endpoint
                  .hass=${this.hass}
                  .value=${entry.to}
                  @value-changed=${(e: CustomEvent<{ value: TimeEndpoint }>) =>
                    this._onRangeChange(idx, "to", e)}
                ></ambience-time-endpoint>
              </div>`
          : ""}
      </div>
    `;
  }

  override render() {
    const hasNonAny = this._entries.some((e) => e.kind !== "any");
    const multi = this._entries.length > 1;
    return html`
      ${this._entries.map((entry, idx) =>
        multi && idx !== this._openIdx
          ? this._renderChip(entry, idx)
          : this._renderEntry(entry, idx, idx === 0),
      )}
      ${hasNonAny ? html`<button class="add-btn" @click=${this._onAdd}>${localize(this.hass, "ui.add_time_range", "+ add another time range")}</button>` : ""}
    `;
  }
}
