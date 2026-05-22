import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import type { HassConnection } from "../api.js";
import { dayItemKindLabel, localize, weekdayLabel } from "../i18n.js";
import type { DayConfig, DayItem, DayPredicate } from "../types.js";

const KINDS: DayItem["kind"][] = [
  "weekday", "day_of_month", "date", "date_range",
  "last_day", "workday", "holiday", "first_workday", "last_workday",
];

const SENSOR_DEPENDENT = new Set<DayItem["kind"]>(["workday", "holiday"]);
const CALENDAR_DEPENDENT = new Set<DayItem["kind"]>(["first_workday", "last_workday"]);

/** Loose ha-form schema item — selectors are passed through to HA. */
type HaFormSchema = { name: string; selector: Record<string, unknown> };

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
      display: flex; align-items: flex-start; gap: 0.5rem;
      padding: 0.4rem; border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px; margin-bottom: 0.4rem;
      background: var(--card-background-color, #fff);
    }
    .item select, .item input[type="number"], .item input[type="text"] { padding: 0.25rem; }
    .item .kind { min-width: 12rem; }
    .item .body { flex: 1; display: flex; flex-wrap: wrap; gap: 0.4rem; align-items: center; }
    .item ha-form { display: block; flex: 1; }
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

  /** The body schema for an item's kind, or null when the kind has no ha-form
   * body (weekday is rendered as native checkboxes; the entity-only kinds and
   * last_day have no fields). */
  _bodySchema(item: DayItem): HaFormSchema[] | null {
    switch (item.kind) {
      case "day_of_month":
        return [{ name: "days", selector: { text: {} } }];
      case "date":
        return [
          { name: "month", selector: { number: { min: 1, max: 12, mode: "box" } } },
          { name: "day", selector: { number: { min: 1, max: 31, mode: "box" } } },
        ];
      case "date_range":
        return [
          { name: "from_month", selector: { number: { min: 1, max: 12, mode: "box" } } },
          { name: "from_day", selector: { number: { min: 1, max: 31, mode: "box" } } },
          { name: "to_month", selector: { number: { min: 1, max: 12, mode: "box" } } },
          { name: "to_day", selector: { number: { min: 1, max: 31, mode: "box" } } },
        ];
      default:
        return null;
    }
  }

  /** Map an item to the flat ha-form `data` object for its body schema. */
  _bodyData(item: DayItem): Record<string, unknown> {
    switch (item.kind) {
      case "day_of_month":
        return { days: item.days.join(", ") };
      case "date":
        return { month: item.month, day: item.day };
      case "date_range":
        return {
          from_month: item.from.month,
          from_day: item.from.day,
          to_month: item.to.month,
          to_day: item.to.day,
        };
      default:
        return {};
    }
  }

  /** Parse an ha-form body `value` back into a full DayItem of the same kind. */
  _bodyPatch(item: DayItem, value: Record<string, unknown>): DayItem {
    switch (item.kind) {
      case "day_of_month": {
        const days = String(value.days ?? "")
          .split(",")
          .map((s) => parseInt(s.trim(), 10))
          .filter((n) => Number.isFinite(n));
        return { kind: "day_of_month", days };
      }
      case "date":
        return { kind: "date", month: Number(value.month), day: Number(value.day) };
      case "date_range":
        return {
          kind: "date_range",
          from: { month: Number(value.from_month), day: Number(value.from_day) },
          to: { month: Number(value.to_month), day: Number(value.to_day) },
        };
      default:
        return item;
    }
  }

  /** ha-form kind-picker change: switch the item to the chosen kind's default,
   * ignoring disabled kinds. */
  _onKindForm(section: "include" | "exclude", idx: number, value: { kind?: DayItem["kind"] }) {
    const kind = value.kind;
    if (!kind || this._kindDisabled(kind)) return;
    const current = this._current()[section][idx];
    if (current && current.kind === kind) return;
    this._updateItem(section, idx, _defaultItem(kind));
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
    const schema = this._bodySchema(item);
    if (!schema) return html``;
    /* v8 ignore start -- ha-form path (real HA only) */
    if (customElements.get("ha-form")) {
      return html`<ha-form
        .hass=${this.hass}
        .schema=${schema}
        .data=${this._bodyData(item)}
        .computeLabel=${this._computeFieldLabel}
        @value-changed=${(e: CustomEvent<{ value: Record<string, unknown> }>) => {
          e.stopPropagation();
          this._onBodyForm(section, idx, item, e.detail.value);
        }}
      ></ha-form>`;
    }
    /* v8 ignore stop */
    return this._renderNativeBody(section, idx, item);
  }

  private _renderNativeBody(section: "include" | "exclude", idx: number, item: DayItem) {
    if (item.kind === "day_of_month") {
      return html`<input
        type="text" placeholder=${localize(this.hass, "ui.day_of_month_placeholder", "e.g. 1, 15, 31")}
        .value=${item.days.join(", ")}
        @change=${(e: Event) =>
          this._updateItem(section, idx, this._bodyPatch(item, { days: (e.target as HTMLInputElement).value }))}
      />`;
    }
    if (item.kind === "date") {
      return html`
        <input type="number" min="1" max="12" .value=${String(item.month)}
          @change=${(e: Event) =>
            this._updateItem(section, idx, { kind: "date", month: parseInt((e.target as HTMLInputElement).value, 10), day: item.day })} />
        /
        <input type="number" min="1" max="31" .value=${String(item.day)}
          @change=${(e: Event) =>
            this._updateItem(section, idx, { kind: "date", month: item.month, day: parseInt((e.target as HTMLInputElement).value, 10) })} />
      `;
    }
    if (item.kind === "date_range") {
      const fromM = item.from.month, fromD = item.from.day;
      const toM = item.to.month, toD = item.to.day;
      return html`
        <span>${localize(this.hass, "ui.from", "from")}</span>
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
        <span>${localize(this.hass, "ui.to", "to")}</span>
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
