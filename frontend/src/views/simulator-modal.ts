import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { simulate, simulateInputs, type HassConnection } from "../api.js";
import type { BufferedUnit, SimulateKnob, SimulateOverrides } from "../types.js";
import { renderEvaluation, traceDetailStyles } from "../trace-detail.js";

/**
 * Per-group what-if simulator. Loads the group's editable inputs (pre-filled
 * live), lets the user bend a date+time and the entity/attribute knobs, runs
 * the simulation, and renders the result with the shared trace-detail card.
 * Read-only — nothing here executes.
 */
@customElement("ambience-simulator-modal")
export class AmbienceSimulatorModal extends LitElement {
  static override styles = [
    traceDetailStyles,
    css`
      :host { display: none; position: fixed; inset: 0; align-items: center;
        justify-content: center; background: rgba(0,0,0,0.45); z-index: 1000; }
      :host([open]) { display: flex; }
      .modal { background: var(--card-background-color, #fff); border-radius: 8px;
        padding: 1.5rem; max-width: 640px; width: 90%; max-height: 80vh;
        display: flex; flex-direction: column; gap: 1rem; overflow: hidden; }
      .header { display: flex; align-items: center; gap: 0.5rem; }
      .header h3 { margin: 0; flex: 1; }
      .close { padding: 0.25rem 0.5rem; cursor: pointer; border: none; background: none;
        font-size: 1.2rem; color: var(--secondary-text-color, #888); line-height: 1; }
      .body { overflow-y: auto; flex: 1; }
      .sec-title { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.05em;
        color: var(--secondary-text-color, #888); font-weight: 700; margin: 0.5rem 0; }
      .knob { display: flex; align-items: center; gap: 0.6rem; margin: 0.4rem 0; }
      .knob .lbl { flex: 1; }
      .knob .lbl small { display: block; color: var(--secondary-text-color, #999); font-size: 0.72rem; }
      .knob .live { color: var(--secondary-text-color, #999); font-size: 0.72rem; }
      .changed { color: var(--primary-color, #03a9f4); font-weight: 600; }
      .attr { padding-left: 1rem; }
      select, input { background: var(--card-background-color, #fff);
        color: inherit; border: 1px solid var(--divider-color, #bbb); border-radius: 4px; padding: 3px 6px; }
      .opaque { color: var(--secondary-text-color, #999); font-size: 0.8rem; font-style: italic; margin-top: 0.4rem; }
      .runbtn { padding: 0.4rem 1rem; background: var(--primary-color, #03a9f4); color: #fff;
        border: none; border-radius: 6px; font-weight: 600; cursor: pointer; }
      .run-row { display: flex; justify-content: flex-end; margin-top: 0.5rem; }
      .error { color: var(--error-color, #c00); font-size: 0.9rem; }
      .result { margin-top: 1rem; }
    `,
  ];

  @property({ attribute: false }) hass!: HassConnection;
  @property({ attribute: false }) scope!: { scope_kind: string; scope_id: string | null };
  @property() group = "";
  @property() groupName: string | null = null;
  @property({ type: Boolean, reflect: true }) open = false;

  @state() private _knobs: SimulateKnob[] = [];
  @state() private _hasTime = false;
  @state() private _opaque = false;
  @state() private _loading = true;
  @state() private _error = "";
  @state() private _values: Record<string, { state: string; attributes: Record<string, string> }> = {};
  @state() private _date = "";
  @state() private _time = "";
  @state() private _result: BufferedUnit | null = null;
  @state() private _expanded = false;

  override updated(changed: Map<string, unknown>): void {
    if (this.open && (changed.has("open") || changed.has("group") || changed.has("scope"))) {
      void this._load();
    }
  }

  private async _load(): Promise<void> {
    this._error = "";
    this._loading = true;
    this._result = null;
    this._expanded = false;
    const now = new Date();
    this._date = _localDate(now);
    this._time = _localTime(now);
    try {
      const inputs = await simulateInputs(this.hass, this.scope, this.group);
      if (!this.isConnected) return;
      this._knobs = inputs.knobs;
      this._hasTime = inputs.has_time;
      this._opaque = inputs.opaque;
      this._values = {};
      for (const k of inputs.knobs) {
        this._values[k.entity_id] = {
          state: k.live_state ?? "",
          attributes: Object.fromEntries(
            k.attributes.map((a) => [a.name, a.live_value == null ? "" : String(a.live_value)]),
          ),
        };
      }
      this._loading = false;
    } catch (e) {
      this._error = (e as Error).message || String(e);
      this._loading = false;
    }
  }

  private _setState(entityId: string, value: string): void {
    this._values = { ...this._values, [entityId]: { ...this._values[entityId], state: value } };
  }

  private _setAttr(entityId: string, name: string, value: string): void {
    const cur = this._values[entityId];
    this._values = {
      ...this._values,
      [entityId]: { ...cur, attributes: { ...cur.attributes, [name]: value } },
    };
  }

  private _buildOverrides(): SimulateOverrides {
    const overrides: SimulateOverrides = {};
    for (const k of this._knobs) {
      const v = this._values[k.entity_id];
      if (!v || v.state === "") continue;
      const attributes: Record<string, unknown> = {};
      for (const [name, raw] of Object.entries(v.attributes)) {
        if (raw === "") continue;
        const n = Number(raw);
        if (!Number.isNaN(n)) attributes[name] = n;
      }
      overrides[k.entity_id] = { state: v.state, attributes };
    }
    return overrides;
  }

  private async _run(): Promise<void> {
    this._error = "";
    const now = new Date(`${this._date}T${this._time}`).toISOString();
    try {
      this._result = await simulate(this.hass, this.scope, this.group, now, this._buildOverrides());
      this._expanded = false;
    } catch (e) {
      this._error = (e as Error).message || String(e);
    }
  }

  private _onClose(): void {
    this.dispatchEvent(new CustomEvent("close", { bubbles: true, composed: true }));
  }

  override render() {
    if (!this.open) return nothing;
    return html`
      <div class="modal" role="dialog" aria-modal="true">
        <div class="header">
          <h3>Simulate · ${this.groupName ?? this.group}</h3>
          <button class="close" @click=${this._onClose} aria-label="Close">✕</button>
        </div>
        <div class="body">
          ${this._error ? html`<p class="error">${this._error}</p>` : nothing}
          ${this._loading
            ? html`<p>Loading…</p>`
            : html`
                ${this._hasTime
                  ? html`<p class="sec-title">When</p>
                      <div class="knob">
                        <input type="date" .value=${this._date}
                          @change=${(e: Event) => (this._date = (e.target as HTMLInputElement).value)} />
                        <input type="time" .value=${this._time}
                          @change=${(e: Event) => (this._time = (e.target as HTMLInputElement).value)} />
                      </div>`
                  : nothing}
                ${this._knobs.length
                  ? html`<p class="sec-title">Inputs this group depends on</p>
                      ${this._knobs.map((k) => this._renderKnob(k))}`
                  : nothing}
                ${this._opaque
                  ? html`<p class="opaque">+ template/script rule — evaluated live against the above</p>`
                  : nothing}
                <div class="run-row"><button class="runbtn" @click=${() => void this._run()}>Simulate ▸</button></div>
                ${this._result
                  ? html`<div class="result">${renderEvaluation(this._result, this._expanded, () => (this._expanded = !this._expanded))}</div>`
                  : nothing}
              `}
        </div>
      </div>
    `;
  }

  private _renderKnob(k: SimulateKnob) {
    const v = this._values[k.entity_id];
    const changed = v && v.state !== (k.live_state ?? "");
    return html`
      <div class="knob">
        <span class="lbl ${changed ? "changed" : ""}">${k.entity_id}</span>
        <select data-entity=${k.entity_id} .value=${v?.state ?? ""}
          @change=${(e: Event) => this._setState(k.entity_id, (e.target as HTMLSelectElement).value)}>
          ${(k.states.length ? k.states : [k.live_state ?? ""]).map(
            (s) => html`<option value=${s} ?selected=${s === v?.state}>${s}</option>`,
          )}
        </select>
        <span class="live">live: ${k.live_state ?? "—"}</span>
      </div>
      ${k.attributes.map(
        (a) => html`<div class="knob attr">
          <span class="lbl">${a.name}</span>
          <input type="number" data-attr=${a.name} .value=${v?.attributes[a.name] ?? ""}
            @input=${(e: Event) => this._setAttr(k.entity_id, a.name, (e.target as HTMLInputElement).value)} />
          <span class="live">live: ${a.live_value == null ? "—" : String(a.live_value)}</span>
        </div>`,
      )}
    `;
  }
}

function _pad(n: number): string {
  return String(n).padStart(2, "0");
}
function _localDate(d: Date): string {
  return `${d.getFullYear()}-${_pad(d.getMonth() + 1)}-${_pad(d.getDate())}`;
}
function _localTime(d: Date): string {
  return `${_pad(d.getHours())}:${_pad(d.getMinutes())}`;
}
