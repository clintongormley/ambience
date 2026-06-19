import { css, html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { type HassConnection, simulate, simulateInputs } from "../api.js";
import { humanizeId, localize, localizeWsError } from "../i18n.js";
import { renderEvaluation, traceDetailStyles } from "../trace-detail.js";
import type {
  BufferedUnit,
  ExposedAction,
  PeriodStoreView,
  SimulateEntityKnob,
  SimulateKnob,
  SimulateOverrides,
  SimulateVerdictKnob,
  SimulateVerdicts,
  StateForDuration,
} from "../types.js";
import { entityName, entityRowStyles, renderEntityIcon } from "./entity-row.js";
import { ModalDismissController } from "./modal-shell.js";

// Display label for a raw option value (the sent value stays raw).
function optionLabel(hass: HassConnection | undefined, value: string): string {
  if (value === "not_home") return localize(hass, "ui.away", "Away");
  if (value === "home") return localize(hass, "ui.home", "Home");
  return humanizeId(value);
}

// The editable values for an entity knob, pre-filled from its live state +
// attributes. Shared by the initial load and the per-row reset.
function entityDefaults(k: SimulateEntityKnob): {
  state: string;
  attributes: Record<string, string>;
  for: StateForDuration;
} {
  return {
    state: k.live_state ?? "",
    attributes: Object.fromEntries(
      k.attributes.map((a) => [a.name, a.live_value == null ? "" : String(a.live_value)]),
    ),
    // We can't know how long the live state has held, so default to "just now".
    for: { h: 0, m: 0, s: 0 },
  };
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}
function localDate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function localTime(d: Date): string {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/**
 * Per-category what-if simulator. Loads the category's editable inputs (pre-filled
 * live), lets the user bend a date+time, entity controls, and opaque-predicate
 * verdicts, runs the simulation, and renders the result with the shared
 * trace-detail card. Read-only.
 */
@customElement("ambience-simulator-modal")
export class AmbienceSimulatorModal extends LitElement {
  static override styles = [
    traceDetailStyles,
    entityRowStyles,
    css`
      :host { display: none; position: fixed; inset: 0; align-items: center;
        justify-content: center; background: rgba(0,0,0,0.45); z-index: 1000; }
      :host([open]) { display: flex; }
      .modal { background: var(--card-background-color, #fff); border-radius: 8px;
        padding: 1.5rem; max-width: 680px; width: 90%; max-height: 80vh;
        display: flex; flex-direction: column; gap: 0.5rem; overflow: hidden; }
      .header { display: flex; align-items: center; gap: 0.5rem; }
      .header h3 { margin: 0; flex: 1; }
      .close { padding: 0.25rem 0.5rem; cursor: pointer; border: none; background: none;
        font-size: 1.2rem; color: var(--secondary-text-color, #888); line-height: 1; }
      .body { overflow-y: auto; flex: 1; }
      .sec-title { font-size: 0.95rem; font-weight: 700; text-transform: uppercase;
        letter-spacing: 0.05em; color: var(--primary-text-color, #fff); margin: 0.9rem 0 0.4rem; }
      .when { display: flex; align-items: center; gap: 0.6rem; padding: 0.2rem 0 0.4rem; }
      .when .hint { color: var(--secondary-text-color, #999); font-size: 0.8em; }
      /* Top-align so the icon and control line up with the entity name (first
         line), not floating between the name and the entity_id subtitle. */
      .row { display: flex; align-items: flex-start; gap: 0.75rem; padding: 0.55rem 0;
        border-bottom: 1px solid var(--divider-color, #e0e0e0); }
      .row-icon { margin-top: 1px; }
      .row-ctrl { margin-top: -2px; }
      .row.attr { border-bottom: 0; padding-top: 0.1rem; }
      /* the weather row + its attrs read as one unit (no inner dividers), with
         the divider restored after the last attribute to separate the category */
      .row.attr.last-attr { border-bottom: 1px solid var(--divider-color, #e0e0e0); }
      .row.has-attrs { border-bottom: 0; }
      .row-ctrl { display: flex; align-items: center; gap: 0.4rem; flex: 0 0 auto; }
      .reset { color: var(--secondary-text-color, #bbb); cursor: pointer; background: none;
        border: none; font-size: 1rem; line-height: 1; padding: 0 0.2rem; }
      select, input { background: var(--card-background-color, #fff); color: inherit;
        border: 1px solid var(--divider-color, #bbb); border-radius: 4px; padding: 4px 7px; font: inherit; }
      input.num { width: 96px; text-align: right; }
      .for-ctrl { display: inline-flex; align-items: center; gap: 0.15rem;
        color: var(--secondary-text-color, #888); font-size: 0.9em; }
      .for-label { margin-right: 0.15rem; }
      input.for-num { width: 2.6rem; text-align: right; padding: 4px 5px; }
      .attr .row-text { padding-left: 34px; color: var(--secondary-text-color, #777); }
      .runbtn { padding: 0.45rem 1.1rem; background: var(--primary-color, #03a9f4); color: #fff;
        border: none; border-radius: 6px; font-weight: 600; cursor: pointer; }
      .run-row { display: flex; justify-content: flex-end; margin-top: 0.6rem; }
      .error { color: var(--error-color, #c00); font-size: 0.9rem; }
      .result { margin-top: 1rem; }
    `,
  ];

  @property({ attribute: false }) hass!: HassConnection;
  @property({ attribute: false }) periods?: PeriodStoreView;
  // Exposed-actions list, so a simulated action renders with the user-configured
  // label (e.g. "Fade lights") rather than the derived service id.
  @property({ attribute: false }) exposedActions: ExposedAction[] = [];
  @property({ attribute: false }) scope!: { scope_kind: string; scope_id: string | null };
  @property() category = "";
  @property() categoryName: string | null = null;
  @property({ type: Boolean, reflect: true }) open = false;

  @state() private _knobs: SimulateKnob[] = [];
  @state() private _hasTime = false;
  @state() private _loading = true;
  @state() private _error = "";
  @state() private _values: Record<
    string,
    { state: string; attributes: Record<string, string>; for: StateForDuration }
  > = {};
  @state() private _verdicts: Record<string, boolean> = {};
  @state() private _date = "";
  @state() private _time = "";
  @state() private _result: BufferedUnit | null = null;
  @state() private _expanded = false;

  constructor() {
    super();
    // Escape / backdrop-click close (shared with the settings and traces modals).
    new ModalDismissController(this, () => this._onClose());
  }

  override updated(changed: Map<string, unknown>): void {
    if (this.open && (changed.has("open") || changed.has("category") || changed.has("scope"))) {
      void this._load();
    }
  }

  private _vkey(k: SimulateVerdictKnob): string {
    return `${k.condition}:${k.key}`;
  }

  private async _load(): Promise<void> {
    this._error = "";
    this._loading = true;
    this._result = null;
    this._expanded = false;
    const now = new Date();
    this._date = localDate(now);
    this._time = localTime(now);
    try {
      const inputs = await simulateInputs(this.hass, this.scope, this.category);
      if (!this.isConnected) return;
      this._knobs = inputs.knobs;
      this._hasTime = inputs.has_time;
      const values: typeof this._values = {};
      const verdicts: typeof this._verdicts = {};
      for (const k of inputs.knobs) {
        if (k.kind === "entity") {
          values[k.entity_id] = entityDefaults(k);
        } else {
          verdicts[this._vkey(k)] = k.live_value;
        }
      }
      this._values = values;
      this._verdicts = verdicts;
      this._loading = false;
    } catch (e) {
      this._error = localizeWsError(this.hass, e);
      this._loading = false;
    }
  }

  private _setState(id: string, value: string): void {
    this._values = { ...this._values, [id]: { ...this._values[id], state: value } };
  }
  private _setAttr(id: string, name: string, value: string): void {
    const cur = this._values[id];
    this._values = {
      ...this._values,
      [id]: { ...cur, attributes: { ...cur.attributes, [name]: value } },
    };
  }
  private _setFor(id: string, part: "h" | "m" | "s", value: number): void {
    const cur = this._values[id];
    const n = Number.isFinite(value) && value > 0 ? Math.trunc(value) : 0;
    this._values = { ...this._values, [id]: { ...cur, for: { ...cur.for, [part]: n } } };
  }
  private _setVerdict(vkey: string, value: boolean): void {
    this._verdicts = { ...this._verdicts, [vkey]: value };
  }

  private _resetWhen(): void {
    const now = new Date();
    this._date = localDate(now);
    this._time = localTime(now);
  }

  private _resetEntity(k: SimulateEntityKnob): void {
    this._values = { ...this._values, [k.entity_id]: entityDefaults(k) };
  }
  private _resetVerdict(k: SimulateVerdictKnob): void {
    this._verdicts = { ...this._verdicts, [this._vkey(k)]: k.live_value };
  }

  private _buildOverrides(): SimulateOverrides {
    const overrides: SimulateOverrides = {};
    for (const k of this._knobs) {
      if (k.kind !== "entity") continue;
      const v = this._values[k.entity_id];
      if (!v) continue;
      const attributes: Record<string, unknown> = {};
      for (const a of k.attributes) {
        const raw = v.attributes[a.name];
        if (raw === undefined || raw === "") continue;
        if (a.control === "number") {
          const n = Number(raw);
          if (!Number.isNaN(n)) attributes[a.name] = n;
        } else {
          attributes[a.name] = raw; // text attribute (e.g. description) sent as-is
        }
      }
      // Send `state` only when set; an empty field falls back to the live state
      // server-side, so an attribute-only override (incl. on a stateless entity)
      // is still expressible. Skip entities with nothing to override.
      const override: {
        state?: string;
        attributes: Record<string, unknown>;
        for?: StateForDuration;
      } = { attributes };
      if (v.state !== "") override.state = v.state;
      // Only send a non-zero For; zero means "just changed" (the server default).
      if (v.for.h || v.for.m || v.for.s) override.for = v.for;
      if (
        override.state !== undefined ||
        override.for !== undefined ||
        Object.keys(attributes).length > 0
      ) {
        overrides[k.entity_id] = override;
      }
    }
    return overrides;
  }

  private _buildVerdicts(): SimulateVerdicts {
    const out: SimulateVerdicts = {};
    for (const k of this._knobs) {
      if (k.kind !== "verdict") continue;
      if (!out[k.condition]) out[k.condition] = {};
      out[k.condition][k.key] = this._verdicts[this._vkey(k)] ?? k.live_value;
    }
    return out;
  }

  private async _run(): Promise<void> {
    this._error = "";
    // The native date/time inputs can be cleared; an Invalid Date's
    // toISOString() throws, which used to die as an unhandled rejection
    // (the Simulate button silently did nothing).
    const parsed = new Date(`${this._date}T${this._time}`);
    if (!this._date || !this._time || Number.isNaN(parsed.getTime())) {
      this._error = localize(this.hass, "ui.invalid_datetime", "Enter a valid date and time.");
      return;
    }
    const now = parsed.toISOString();
    try {
      this._result = await simulate(
        this.hass,
        this.scope,
        this.category,
        now,
        this._buildOverrides(),
        this._buildVerdicts(),
      );
      this._expanded = false;
    } catch (e) {
      this._error = localizeWsError(this.hass, e);
    }
  }

  private _onClose(): void {
    this.dispatchEvent(new CustomEvent("close", { bubbles: true, composed: true }));
  }

  override render() {
    if (!this.open) return nothing;
    return html`
      <div class="modal" role="dialog" aria-modal="true" @click=${(e: Event) => e.stopPropagation()}>
        <div class="header">
          <h3>${localize(this.hass, "ui.simulate_title", "Simulate")} · ${this.categoryName ?? this.category}</h3>
          <button class="close" @click=${this._onClose} aria-label=${localize(this.hass, "ui.close", "Close")}>✕</button>
        </div>
        <div class="body">
          ${this._error ? html`<p class="error">${this._error}</p>` : nothing}
          ${
            this._loading
              ? html`<p>${localize(this.hass, "ui.loading", "Loading…")}</p>`
              : html`
            ${
              this._hasTime
                ? html`
              <p class="sec-title">${localize(this.hass, "ui.when_heading", "When")}</p>
              <div class="when">
                <input type="date" .value=${this._date}
                  @change=${(e: Event) => (this._date = (e.target as HTMLInputElement).value)} />
                <input type="time" .value=${this._time}
                  @change=${(e: Event) => (this._time = (e.target as HTMLInputElement).value)} />
                <button class="reset" title=${localize(this.hass, "ui.reset_to_now", "Reset to now")} aria-label=${localize(this.hass, "ui.reset_to_now", "Reset to now")}
                  @click=${() => this._resetWhen()}>↺</button>
                <span class="hint">${localize(this.hass, "ui.simulate_when_hint", "drives sun, time-of-day, weekday & workday")}</span>
              </div>`
                : nothing
            }
            ${
              this._knobs.length
                ? html`
              <p class="sec-title">${localize(this.hass, "ui.simulate_inputs_heading", "Inputs this category depends on")}</p>
              ${this._knobs.map((k) => (k.kind === "entity" ? this._renderEntity(k) : this._renderVerdict(k)))}`
                : nothing
            }
            <div class="run-row"><button class="runbtn" @click=${() => void this._run()}>${localize(this.hass, "ui.simulate_button", "Simulate")} ▸</button></div>
            ${this._result ? html`<div class="result">${renderEvaluation(this._result, this._expanded, () => (this._expanded = !this._expanded), this.hass, undefined, this.periods?.custom ?? {}, this.exposedActions)}</div>` : nothing}
          `
          }
        </div>
      </div>`;
  }

  private _renderEntity(k: SimulateEntityKnob) {
    const v = this._values[k.entity_id];
    const hasAttrs = k.attributes.length > 0;
    return html`
      <div class="row ${hasAttrs ? "has-attrs" : ""}">
        ${renderEntityIcon(this.hass, k.entity_id)}
        <div class="row-text">
          <div class="row-title">${entityName(this.hass, k.entity_id)}</div>
          <div class="row-detail">${k.entity_id}</div>
        </div>
        <div class="row-ctrl">
          ${this._renderControl(k, v?.state ?? "")}
          ${this._renderFor(k, v?.for ?? { h: 0, m: 0, s: 0 })}
          <button class="reset" data-reset=${k.entity_id} title=${localize(this.hass, "ui.reset_to_live", "Reset to live")}
            @click=${() => this._resetEntity(k)}>↺</button>
        </div>
      </div>
      ${k.attributes.map(
        (a, i) => html`
        <div class="row attr ${i === k.attributes.length - 1 ? "last-attr" : ""}">
          <div class="row-text"><div class="row-title">${optionLabel(this.hass, a.name)}</div></div>
          <div class="row-ctrl">
            <input class=${a.control === "number" ? "num" : ""}
              type=${a.control === "number" ? "number" : "text"}
              data-attr=${`${k.entity_id}:${a.name}`}
              .value=${v?.attributes[a.name] ?? ""}
              @input=${(e: Event) => this._setAttr(k.entity_id, a.name, (e.target as HTMLInputElement).value)} />
            <button class="reset" title=${localize(this.hass, "ui.reset_to_live", "Reset to live")}
              @click=${() => this._resetEntity(k)}>↺</button>
          </div>
        </div>`,
      )}
    `;
  }

  private _renderControl(k: SimulateEntityKnob, value: string) {
    if (k.control === "select") {
      return html`<select data-entity=${k.entity_id} .value=${value}
        @change=${(e: Event) => this._setState(k.entity_id, (e.target as HTMLSelectElement).value)}>
        ${(k.options ?? [value]).map((o) => html`<option value=${o} ?selected=${o === value}>${optionLabel(this.hass, o)}</option>`)}
      </select>`;
    }
    const type = k.control === "number" ? "number" : "text";
    return html`<input class=${k.control === "number" ? "num" : ""} type=${type} data-entity=${k.entity_id}
      .value=${value}
      @input=${(e: Event) => this._setState(k.entity_id, (e.target as HTMLInputElement).value)} />`;
  }

  /** Inline "For h:m:s" control — how long the entity has held its state, so
   *  conditions with a `for:` duration evaluate as the user intends. */
  private _renderFor(k: SimulateEntityKnob, dur: StateForDuration) {
    // Per-part aria-labels: without them screen readers announce three bare
    // number fields. Scope each to the entity so rows stay distinguishable.
    const unit: Record<"h" | "m" | "s", string> = { h: "hours", m: "minutes", s: "seconds" };
    const name = entityName(this.hass, k.entity_id);
    const cell = (part: "h" | "m" | "s") => html`<input class="for-num" type="number" min="0"
      aria-label=${`${name} — held for, ${unit[part]}`}
      data-for=${`${k.entity_id}:${part}`} .value=${String(dur[part])}
      @change=${(e: Event) =>
        this._setFor(k.entity_id, part, Number((e.target as HTMLInputElement).value))} />`;
    return html`<span class="for-ctrl" title=${localize(this.hass, "ui.duration_held_hint", "How long it has held this state (h:m:s)")}>
      <span class="for-label">${localize(this.hass, "ui.for_label", "For")}</span>${cell("h")}<span>:</span>${cell("m")}<span>:</span>${cell("s")}
    </span>`;
  }

  private _renderVerdict(k: SimulateVerdictKnob) {
    const vkey = this._vkey(k);
    const cur = this._verdicts[vkey] ?? k.live_value;
    const label = k.entity_id ? entityName(this.hass, k.entity_id) : k.label;
    const icon = k.entity_id
      ? renderEntityIcon(this.hass, k.entity_id)
      : html`<ha-icon class="row-icon" icon="mdi:code-braces"></ha-icon>`;
    return html`
      <div class="row">
        ${icon}
        <div class="row-text">
          <div class="row-title">${label}</div>
          ${k.entity_id ? html`<div class="row-detail">${k.entity_id}</div>` : nothing}
        </div>
        <div class="row-ctrl">
          <select data-verdict=${vkey} .value=${String(cur)}
            @change=${(e: Event) => this._setVerdict(vkey, (e.target as HTMLSelectElement).value === "true")}>
            <option value="true" ?selected=${cur}>${localize(this.hass, "ui.true_label", "True")}</option>
            <option value="false" ?selected=${!cur}>${localize(this.hass, "ui.false_label", "False")}</option>
          </select>
          <button class="reset" title=${localize(this.hass, "ui.reset_to_live", "Reset to live")} @click=${() => this._resetVerdict(k)}>↺</button>
        </div>
      </div>`;
  }
}
