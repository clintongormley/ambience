import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import type { DayConfig, DayItem, DayPredicate } from "../types.js";

const KINDS: DayItem["kind"][] = [
  "weekday", "day_of_month", "date", "date_range",
  "last_day", "workday", "holiday", "first_workday", "last_workday",
];

const KIND_LABEL: Record<DayItem["kind"], string> = {
  weekday: "Day of week",
  day_of_month: "Day of month",
  date: "Date (annual)",
  date_range: "Date range (annual)",
  last_day: "Last day of month",
  workday: "Workday",
  holiday: "Holiday",
  first_workday: "First workday of month",
  last_workday: "Last workday of month",
};

const SENSOR_DEPENDENT = new Set<DayItem["kind"]>(["workday", "holiday"]);
const CALENDAR_DEPENDENT = new Set<DayItem["kind"]>(["first_workday", "last_workday"]);

const WEEKDAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function _defaultItem(kind: DayItem["kind"]): DayItem {
  switch (kind) {
    case "weekday": return { kind, days: [] };
    case "day_of_month": return { kind, days: [] };
    case "date": return { kind, month: 1, day: 1 };
    case "date_range": return { kind, from: { month: 1, day: 1 }, to: { month: 12, day: 31 } };
    default: return { kind } as DayItem;
  }
}

@customElement("ambience-day-predicate-input")
export class AmbienceDayPredicateInput extends LitElement {
  static override styles = css`
    :host { display: block; }
    .section { margin-bottom: 1rem; }
    .section h4 { margin: 0 0 0.5rem 0; font-size: 0.95em; }
    .hint { color: var(--secondary-text-color, #888); font-size: 0.85em; }
    .item {
      display: flex; align-items: center; gap: 0.5rem;
      padding: 0.4rem; border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px; margin-bottom: 0.4rem;
      background: var(--card-background-color, #fff);
    }
    .item select, .item input[type="number"], .item input[type="text"] { padding: 0.25rem; }
    .item .body { flex: 1; display: flex; flex-wrap: wrap; gap: 0.4rem; align-items: center; }
    .remove {
      background: none; border: none; color: var(--secondary-text-color);
      cursor: pointer; font-size: 1em; padding: 0;
    }
    label.day-pill {
      display: inline-flex; align-items: center; gap: 0.25rem;
      padding: 0.15rem 0.4rem; border-radius: 3px;
      background: var(--secondary-background-color, #f5f5f5);
      cursor: pointer;
    }
  `;

  @property({ attribute: false }) value: DayPredicate = null;
  @property({ attribute: false }) dayConfig: DayConfig = { workday_sensor: null, workday_calendar: null };

  private _current(): { include: DayItem[]; exclude: DayItem[] } {
    if (this.value === null) return { include: [], exclude: [] };
    return { include: [...this.value.include], exclude: [...this.value.exclude] };
  }

  private _emit(next: { include: DayItem[]; exclude: DayItem[] }) {
    const isEmpty = next.include.length === 0 && next.exclude.length === 0;
    this.value = isEmpty ? null : next;
    this.dispatchEvent(new CustomEvent("value-changed", {
      detail: { value: this.value },
      bubbles: true, composed: true,
    }));
  }

  _addItem(section: "include" | "exclude", kind: DayItem["kind"]) {
    const next = this._current();
    next[section] = [...next[section], _defaultItem(kind)];
    this._emit(next);
  }

  _removeItem(section: "include" | "exclude", idx: number) {
    const next = this._current();
    next[section] = next[section].filter((_, i) => i !== idx);
    this._emit(next);
  }

  _updateItem(section: "include" | "exclude", idx: number, patch: Partial<DayItem>) {
    const next = this._current();
    next[section] = next[section].map((it, i) => (i === idx ? { ...it, ...patch } as DayItem : it));
    this._emit(next);
  }

  _kindDisabled(kind: DayItem["kind"]): boolean {
    if (SENSOR_DEPENDENT.has(kind) && !this.dayConfig.workday_sensor) return true;
    if (CALENDAR_DEPENDENT.has(kind) && !this.dayConfig.workday_calendar) return true;
    return false;
  }

  private _renderItem(section: "include" | "exclude", idx: number, item: DayItem) {
    return html`
      <div class="item">
        <select
          .value=${item.kind}
          @change=${(e: Event) => {
            const kind = (e.target as HTMLSelectElement).value as DayItem["kind"];
            this._updateItem(section, idx, _defaultItem(kind));
          }}
        >
          ${KINDS.map(k => html`<option value=${k} ?disabled=${this._kindDisabled(k)}>${KIND_LABEL[k]}</option>`)}
        </select>
        <div class="body">${this._renderItemBody(section, idx, item)}</div>
        <button class="remove" title="Remove" @click=${() => this._removeItem(section, idx)}>✕</button>
      </div>
    `;
  }

  private _renderItemBody(section: "include" | "exclude", idx: number, item: DayItem) {
    if (item.kind === "weekday") {
      return html`${WEEKDAY_NAMES.map((name, dayIdx) => html`
        <label class="day-pill">
          <input
            type="checkbox"
            .checked=${item.days.includes(dayIdx)}
            @change=${(e: Event) => {
              const on = (e.target as HTMLInputElement).checked;
              const days = on
                ? [...item.days, dayIdx].sort((a, b) => a - b)
                : item.days.filter(d => d !== dayIdx);
              this._updateItem(section, idx, { kind: "weekday", days });
            }}
          />${name}
        </label>
      `)}`;
    }
    if (item.kind === "day_of_month") {
      return html`<input
        type="text" placeholder="e.g. 1, 15, 31"
        .value=${item.days.join(", ")}
        @change=${(e: Event) => {
          const days = (e.target as HTMLInputElement).value
            .split(",").map(s => parseInt(s.trim(), 10)).filter(n => Number.isFinite(n));
          this._updateItem(section, idx, { kind: "day_of_month", days });
        }}
      />`;
    }
    if (item.kind === "date") {
      return html`
        <input type="number" min="1" max="12" .value=${String(item.month)}
          @change=${(e: Event) => this._updateItem(section, idx,
            { kind: "date", month: parseInt((e.target as HTMLInputElement).value, 10), day: item.day })} />
        /
        <input type="number" min="1" max="31" .value=${String(item.day)}
          @change=${(e: Event) => this._updateItem(section, idx,
            { kind: "date", month: item.month, day: parseInt((e.target as HTMLInputElement).value, 10) })} />
      `;
    }
    if (item.kind === "date_range") {
      const fromM = item.from.month, fromD = item.from.day;
      const toM = item.to.month, toD = item.to.day;
      return html`
        <span>from</span>
        <input type="number" min="1" max="12" .value=${String(fromM)}
          @change=${(e: Event) => this._updateItem(section, idx, {
            kind: "date_range",
            from: { month: parseInt((e.target as HTMLInputElement).value, 10), day: fromD },
            to: item.to,
          })} />
        /
        <input type="number" min="1" max="31" .value=${String(fromD)}
          @change=${(e: Event) => this._updateItem(section, idx, {
            kind: "date_range",
            from: { month: fromM, day: parseInt((e.target as HTMLInputElement).value, 10) },
            to: item.to,
          })} />
        <span>to</span>
        <input type="number" min="1" max="12" .value=${String(toM)}
          @change=${(e: Event) => this._updateItem(section, idx, {
            kind: "date_range",
            from: item.from,
            to: { month: parseInt((e.target as HTMLInputElement).value, 10), day: toD },
          })} />
        /
        <input type="number" min="1" max="31" .value=${String(toD)}
          @change=${(e: Event) => this._updateItem(section, idx, {
            kind: "date_range",
            from: item.from,
            to: { month: toM, day: parseInt((e.target as HTMLInputElement).value, 10) },
          })} />
      `;
    }
    return html``;  // last_day, workday, holiday, first_workday, last_workday have no extra UI
  }

  private _renderSection(name: "include" | "exclude", items: DayItem[]) {
    return html`
      <div class="section">
        <h4>${name === "include" ? "Include" : "Exclude"}</h4>
        ${items.length === 0 && name === "include"
          ? html`<div class="hint">(empty → all days)</div>`
          : ""}
        ${items.map((it, i) => this._renderItem(name, i, it))}
        <select
          .value=${""}
          @change=${(e: Event) => {
            const kind = (e.target as HTMLSelectElement).value as DayItem["kind"];
            if (!kind) return;
            this._addItem(name, kind);
            (e.target as HTMLSelectElement).value = "";
          }}
        >
          <option value="">+ Add ${name} item</option>
          ${KINDS.map(k => html`<option value=${k} ?disabled=${this._kindDisabled(k)}>${KIND_LABEL[k]}</option>`)}
        </select>
      </div>
    `;
  }

  override render() {
    const { include, exclude } = this._current();
    return html`
      ${this._renderSection("include", include)}
      ${this._renderSection("exclude", exclude)}
    `;
  }
}
