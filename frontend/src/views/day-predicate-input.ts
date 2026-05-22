import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import type { HassConnection } from "../api.js";
import { isValidDaySpec } from "../day-spec.js";
import { dayItemKindLabel, localize, monthLabel, weekdayLabel } from "../i18n.js";
import type { DayConfig, DayItem, DayPredicate } from "../types.js";

const KINDS: DayItem["kind"][] = [
  "weekday", "day_of_month", "date", "date_range",
  "last_day", "workday", "holiday", "first_workday", "last_workday",
];

const SENSOR_DEPENDENT = new Set<DayItem["kind"]>(["workday", "holiday"]);
const CALENDAR_DEPENDENT = new Set<DayItem["kind"]>(["first_workday", "last_workday"]);

// Annual day caps; February allows 29 so leap-day dates can be targeted.
const _DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/** Days in the given month (1-12), Feb=29. Out-of-range months cap at 31. */
function _daysInMonth(month: number): number {
  return _DAYS_IN_MONTH[month - 1] ?? 31;
}

/** Loose ha-form schema item — the selector is passed through to HA. */
type HaFormSchema = { name: string; required?: boolean; selector: Record<string, unknown> };

/** Parts of a date / date_range item that an ha-form field can set. */
type DatePart = "month" | "day" | "from_month" | "from_day" | "to_month" | "to_day";

function _defaultItem(kind: DayItem["kind"]): DayItem {
  switch (kind) {
    case "weekday": return { kind, days: [] };
    case "day_of_month": return { kind, days: "" };
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
      display: flex; align-items: flex-start; gap: 0.5rem;
      padding: 0.4rem; border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px; margin-bottom: 0.4rem;
      background: var(--card-background-color, #fff);
    }
    .item select, .item input[type="number"], .item input[type="text"] { padding: 0.25rem; }
    .item .kind { min-width: 12rem; }
    .item .body { flex: 1; display: flex; flex-wrap: wrap; gap: 0.4rem; align-items: flex-start; }
    .item ha-form { display: block; flex: 1; }
    .date-row {
      display: flex; gap: 0.5rem; align-items: flex-start; width: 100%;
    }
    .date-row ha-form { flex: 1 1 8rem; }
    .field-error {
      width: 100%; color: var(--error-color, #d32f2f); font-size: 0.85em; margin-top: 0.2rem;
    }
    .remove {
      background: none; border: none; color: var(--secondary-text-color);
      cursor: pointer; font-size: 1em; padding: 0.25rem 0 0 0;
    }
    label.day-pill {
      display: inline-flex; align-items: center; gap: 0.25rem;
      padding: 0.15rem 0.4rem; border-radius: 3px;
      background: var(--secondary-background-color, #f5f5f5);
      cursor: pointer;
    }
  `;

  @property({ attribute: false }) hass?: HassConnection;
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

  /** Replace the item at idx with a full DayItem (callers always pass a complete item). */
  _updateItem(section: "include" | "exclude", idx: number, item: DayItem) {
    const next = this._current();
    next[section] = next[section].map((it, i) => (i === idx ? item : it));
    this._emit(next);
  }

  _kindDisabled(kind: DayItem["kind"]): boolean {
    if (SENSOR_DEPENDENT.has(kind) && !this.dayConfig.workday_sensor) return true;
    if (CALENDAR_DEPENDENT.has(kind) && !this.dayConfig.workday_calendar) return true;
    return false;
  }

  // --- ha-form schemas / data / parsers -----------------------------------

  /** select(dropdown) over every kind; entity-dependent kinds carry `disabled`. */
  _kindSchema(): HaFormSchema[] {
    return [
      {
        name: "kind",
        selector: {
          select: {
            mode: "dropdown",
            options: KINDS.map((k) => ({
              value: k,
              label: dayItemKindLabel(this.hass, k),
              disabled: this._kindDisabled(k),
            })),
          },
        },
      },
    ];
  }

  /** A month dropdown selector with localized January…December options. */
  _monthSelector(): Record<string, unknown> {
    return {
      select: {
        mode: "dropdown",
        options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => ({
          value: String(m),
          label: monthLabel(this.hass, m),
        })),
      },
    };
  }

  /** A day number selector whose max is the number of days in `month`. */
  _daySelector(month: number): Record<string, unknown> {
    return { number: { min: 1, max: _daysInMonth(month), mode: "box" } };
  }

  /** The body schema for the single-field ha-form bodies. Only day_of_month
   * uses one (a free-text spec); weekday is native checkboxes, date/date_range
   * are rendered as their own month+day field pairs, and the remaining kinds
   * have no body. */
  _bodySchema(item: DayItem): HaFormSchema[] | null {
    if (item.kind === "day_of_month") {
      return [{ name: "days", selector: { text: {} } }];
    }
    return null;
  }

  /** Flat ha-form `data` for a single-field body (day_of_month only). */
  _bodyData(item: DayItem): Record<string, unknown> {
    if (item.kind === "day_of_month") return { days: item.days };
    return {};
  }

  /** Parse a single-field ha-form body `value` (day_of_month only). The raw
   * spec string is stored verbatim — parsing/validation happens on the backend,
   * so the field never fights the user's commas/dashes mid-edit. */
  _bodyPatch(item: DayItem, value: Record<string, unknown>): DayItem {
    if (item.kind === "day_of_month") {
      return { kind: "day_of_month", days: String(value.days ?? "") };
    }
    return item;
  }

  /** Set one month/day part of a date or date_range item, clamping the day to
   * the (possibly just-changed) month's maximum. A cleared/invalid value
   * (e.g. ha-form's clear button sending `undefined` → NaN) is ignored so the
   * item is never written with NaN. */
  _setDatePart(item: DayItem, part: DatePart, raw: unknown): DayItem {
    const n = Number(raw);
    if (!Number.isFinite(n) || n < 1) return item;
    if (item.kind === "date") {
      let { month, day } = item;
      if (part === "month") month = n;
      if (part === "day") day = n;
      return { kind: "date", month, day: Math.min(day, _daysInMonth(month)) };
    }
    if (item.kind === "date_range") {
      const from = { ...item.from };
      const to = { ...item.to };
      if (part === "from_month") from.month = n;
      if (part === "from_day") from.day = n;
      if (part === "to_month") to.month = n;
      if (part === "to_day") to.day = n;
      from.day = Math.min(from.day, _daysInMonth(from.month));
      to.day = Math.min(to.day, _daysInMonth(to.month));
      return { kind: "date_range", from, to };
    }
    return item;
  }

  /** ha-form kind-picker change: clearing the kind removes the item; otherwise
   * switch the item to the chosen kind's default, ignoring disabled kinds. */
  _onKindForm(section: "include" | "exclude", idx: number, value: { kind?: DayItem["kind"] }) {
    const kind = value.kind;
    if (!kind) {
      this._removeItem(section, idx);
      return;
    }
    if (this._kindDisabled(kind)) return;
    const current = this._current()[section][idx];
    if (current && current.kind === kind) return;
    this._updateItem(section, idx, _defaultItem(kind));
  }

  /** Inline validation message for a day-of-month spec, or null. Empty defers
   * to the format hint (no error); a non-empty invalid spec gets a message. */
  _dayOfMonthError(days: string): string | null {
    if (days.trim() === "" || isValidDaySpec(days)) return null;
    return localize(
      this.hass,
      "ui.day_spec_error",
      "Use days 1–31 and ranges like 1-10, separated by commas",
    );
  }

  /** ha-form body change: apply the parsed patch for the item's kind. */
  _onBodyForm(
    section: "include" | "exclude",
    idx: number,
    item: DayItem,
    value: Record<string, unknown>,
  ) {
    this._updateItem(section, idx, this._bodyPatch(item, value));
  }

  /** Helper text shown beneath an ha-form field. Only day-of-month needs a
   * format hint; everything else has none. */
  _computeFieldHelper = (schema: { name: string }): string => {
    if (schema.name === "days") {
      return localize(this.hass, "ui.day_of_month_placeholder", "e.g. 1-10, 15");
    }
    return "";
  };

  /* v8 ignore start -- ha-form is eagerly registered in HA 2026.05+, not in jsdom */
  private _computeFieldLabel = (schema: { name: string }): string => {
    switch (schema.name) {
      case "kind": return localize(this.hass, "ui.field_kind", "Kind");
      case "days": return localize(this.hass, "ui.field_days_of_month", "Days of month");
      case "month": return localize(this.hass, "ui.field_month", "Month");
      case "day": return localize(this.hass, "ui.field_day", "Day");
      case "from_month": return localize(this.hass, "ui.field_from_month", "From month");
      case "from_day": return localize(this.hass, "ui.field_from_day", "From day");
      case "to_month": return localize(this.hass, "ui.field_to_month", "To month");
      case "to_day": return localize(this.hass, "ui.field_to_day", "To day");
      default: return schema.name;
    }
  };
  /* v8 ignore stop */

  // --- weekday body (native checkboxes, unchanged) ------------------------

  private _renderWeekday(section: "include" | "exclude", idx: number, item: DayItem & { kind: "weekday" }) {
    return html`${[0, 1, 2, 3, 4, 5, 6].map((dayIdx) => html`
      <label class="day-pill">
        <input
          type="checkbox"
          .checked=${item.days.includes(dayIdx)}
          @change=${(e: Event) => {
            const on = (e.target as HTMLInputElement).checked;
            const days = on
              ? [...item.days, dayIdx].sort((a, b) => a - b)
              : item.days.filter((d) => d !== dayIdx);
            this._updateItem(section, idx, { kind: "weekday", days });
          }}
        />${weekdayLabel(this.hass, dayIdx)}
      </label>
    `)}`;
  }

  // --- kind picker --------------------------------------------------------

  private _renderKindPicker(section: "include" | "exclude", idx: number, item: DayItem) {
    /* v8 ignore start -- ha-form path (real HA only) */
    if (customElements.get("ha-form")) {
      return html`<ha-form
        class="kind"
        .hass=${this.hass}
        .schema=${this._kindSchema()}
        .data=${{ kind: item.kind }}
        .computeLabel=${this._computeFieldLabel}
        @value-changed=${(e: CustomEvent<{ value: { kind?: DayItem["kind"] } }>) => {
          e.stopPropagation();
          this._onKindForm(section, idx, e.detail.value);
        }}
      ></ha-form>`;
    }
    /* v8 ignore stop */
    return html`
      <select
        class="kind"
        .value=${item.kind}
        @change=${(e: Event) => {
          const kind = (e.target as HTMLSelectElement).value as DayItem["kind"];
          if (this._kindDisabled(kind) || kind === item.kind) return;
          this._updateItem(section, idx, _defaultItem(kind));
        }}
      >
        ${KINDS.map((k) => html`<option value=${k} ?disabled=${this._kindDisabled(k)}>${dayItemKindLabel(this.hass, k)}</option>`)}
      </select>
    `;
  }

  // --- item body ----------------------------------------------------------

  private _renderItemBody(section: "include" | "exclude", idx: number, item: DayItem) {
    if (item.kind === "weekday") return this._renderWeekday(section, idx, item);
    /* v8 ignore start -- ha-form path (real HA only) */
    if (customElements.get("ha-form")) {
      // date / date_range use one ha-form per field so a month change can resize
      // the day field without re-initialising (and resetting) the month dropdown.
      if (item.kind === "date") return this._renderDateRow(section, idx, item, "month", "day", item.month, item.day);
      if (item.kind === "date_range") {
        return html`
          ${this._renderDateRow(section, idx, item, "from_month", "from_day", item.from.month, item.from.day)}
          ${this._renderDateRow(section, idx, item, "to_month", "to_day", item.to.month, item.to.day)}
        `;
      }
      const schema = this._bodySchema(item);
      if (!schema) return html``;
      const err = item.kind === "day_of_month" ? this._dayOfMonthError(item.days) : null;
      return html`<ha-form
        .hass=${this.hass}
        .schema=${schema}
        .data=${this._bodyData(item)}
        .error=${err ? { days: err } : undefined}
        .computeLabel=${this._computeFieldLabel}
        .computeHelper=${this._computeFieldHelper}
        @value-changed=${(e: CustomEvent<{ value: Record<string, unknown> }>) => {
          e.stopPropagation();
          this._onBodyForm(section, idx, item, e.detail.value);
        }}
      ></ha-form>`;
    }
    /* v8 ignore stop */
    return this._renderNativeBody(section, idx, item);
  }

  /* v8 ignore start -- ha-form path (real HA only) */
  private _renderDateRow(
    section: "include" | "exclude",
    idx: number,
    item: DayItem,
    monthPart: DatePart,
    dayPart: DatePart,
    month: number,
    day: number,
  ) {
    const onPart = (part: DatePart, value: Record<string, unknown>) => {
      this._updateItem(section, idx, this._setDatePart(item, part, value[part]));
    };
    return html`
      <div class="date-row">
        <ha-form
          .hass=${this.hass}
          .schema=${[{ name: monthPart, required: true, selector: this._monthSelector() }]}
          .data=${{ [monthPart]: String(month) }}
          .computeLabel=${this._computeFieldLabel}
          @value-changed=${(e: CustomEvent<{ value: Record<string, unknown> }>) => {
            e.stopPropagation();
            onPart(monthPart, e.detail.value);
          }}
        ></ha-form>
        <ha-form
          .hass=${this.hass}
          .schema=${[{ name: dayPart, required: true, selector: this._daySelector(month) }]}
          .data=${{ [dayPart]: day }}
          .computeLabel=${this._computeFieldLabel}
          @value-changed=${(e: CustomEvent<{ value: Record<string, unknown> }>) => {
            e.stopPropagation();
            onPart(dayPart, e.detail.value);
          }}
        ></ha-form>
      </div>
    `;
  }
  /* v8 ignore stop */

  private _renderNativeBody(section: "include" | "exclude", idx: number, item: DayItem) {
    if (item.kind === "day_of_month") {
      const err = this._dayOfMonthError(item.days);
      return html`<input
        type="text" placeholder=${localize(this.hass, "ui.day_of_month_placeholder", "e.g. 1-10, 15")}
        .value=${item.days}
        @change=${(e: Event) =>
          this._updateItem(section, idx, this._bodyPatch(item, { days: (e.target as HTMLInputElement).value }))}
      />${err ? html`<div class="field-error">${err}</div>` : ""}`;
    }
    const monthInput = (part: DatePart, month: number) => html`
      <input type="number" min="1" max="12" .value=${String(month)}
        @change=${(e: Event) => this._updateItem(section, idx,
          this._setDatePart(item, part, (e.target as HTMLInputElement).value))} />
    `;
    const dayInput = (part: DatePart, month: number, day: number) => html`
      <input type="number" min="1" max=${String(_daysInMonth(month))} .value=${String(day)}
        @change=${(e: Event) => this._updateItem(section, idx,
          this._setDatePart(item, part, (e.target as HTMLInputElement).value))} />
    `;
    if (item.kind === "date") {
      return html`${monthInput("month", item.month)} / ${dayInput("day", item.month, item.day)}`;
    }
    if (item.kind === "date_range") {
      return html`
        <span>${localize(this.hass, "ui.from", "from")}</span>
        ${monthInput("from_month", item.from.month)} / ${dayInput("from_day", item.from.month, item.from.day)}
        <span>${localize(this.hass, "ui.to", "to")}</span>
        ${monthInput("to_month", item.to.month)} / ${dayInput("to_day", item.to.month, item.to.day)}
      `;
    }
    return html``;
  }

  // --- add-item picker ----------------------------------------------------

  private _renderAddPicker(name: "include" | "exclude") {
    const addLabel = name === "include"
      ? localize(this.hass, "ui.add_include_item", "+ Add include item")
      : localize(this.hass, "ui.add_exclude_item", "+ Add exclude item");
    /* v8 ignore start -- ha-form path (real HA only) */
    if (customElements.get("ha-form")) {
      const compute = () => addLabel;
      return html`<ha-form
        .hass=${this.hass}
        .schema=${this._kindSchema()}
        .data=${{ kind: "" }}
        .computeLabel=${compute}
        @value-changed=${(e: CustomEvent<{ value: { kind?: DayItem["kind"] } }>) => {
          e.stopPropagation();
          const kind = e.detail.value.kind;
          if (kind && !this._kindDisabled(kind)) this._addItem(name, kind);
        }}
      ></ha-form>`;
    }
    /* v8 ignore stop */
    return html`
      <select
        .value=${""}
        @change=${(e: Event) => {
          const kind = (e.target as HTMLSelectElement).value as DayItem["kind"];
          if (!kind) return;
          this._addItem(name, kind);
          (e.target as HTMLSelectElement).value = "";
        }}
      >
        <option value="">${addLabel}</option>
        ${KINDS.map((k) => html`<option value=${k} ?disabled=${this._kindDisabled(k)}>${dayItemKindLabel(this.hass, k)}</option>`)}
      </select>
    `;
  }

  private _renderItem(section: "include" | "exclude", idx: number, item: DayItem) {
    return html`
      <div class="item">
        ${this._renderKindPicker(section, idx, item)}
        <div class="body">${this._renderItemBody(section, idx, item)}</div>
        <button class="remove" title=${localize(this.hass, "ui.remove", "Remove")} @click=${() => this._removeItem(section, idx)}>✕</button>
      </div>
    `;
  }

  private _renderSection(name: "include" | "exclude", items: DayItem[]) {
    return html`
      <div class="section">
        <h4>${name === "include"
          ? localize(this.hass, "ui.include", "Include")
          : localize(this.hass, "ui.exclude", "Exclude")}</h4>
        ${items.length === 0 && name === "include"
          ? html`<div class="hint">${localize(this.hass, "ui.empty_all_days", "(empty → all days)")}</div>`
          : ""}
        ${items.map((it, i) => this._renderItem(name, i, it))}
        ${this._renderAddPicker(name)}
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
