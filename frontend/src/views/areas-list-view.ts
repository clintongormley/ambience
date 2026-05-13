import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import type { HassConnection } from "../api.js";
import { listAreas, saveArea, deleteArea } from "../api.js";
import type { AreaListItem } from "../types.js";

@customElement("ambience-areas-list")
export class AmbienceAreasList extends LitElement {
  static override styles = css`
    :host {
      display: block;
      padding: 1rem;
      max-width: 60rem;
      margin: 0 auto;
    }
    .toolbar {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    input[type="text"] {
      flex: 1;
      padding: 0.5rem;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: inherit;
    }
    button {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      border: 0;
      border-radius: 4px;
      padding: 0.5rem 1rem;
      cursor: pointer;
    }
    button.secondary {
      background: transparent;
      color: var(--primary-color, #03a9f4);
    }
    .empty {
      color: var(--secondary-text-color, #888);
      text-align: center;
      padding: 2rem;
    }
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1rem;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      margin-bottom: 0.5rem;
      background: var(--card-background-color, #fff);
    }
    .name {
      cursor: pointer;
    }
    .name:hover {
      text-decoration: underline;
    }
    .error {
      color: var(--error-color, #d32f2f);
      margin-top: 0.5rem;
    }
  `;

  @property({ attribute: false }) hass!: HassConnection;
  @state() private _areas: AreaListItem[] = [];
  @state() private _newId = "";
  @state() private _newName = "";
  @state() private _error = "";

  override connectedCallback() {
    super.connectedCallback();
    void this._refresh();
  }

  private async _refresh() {
    try {
      this._areas = await listAreas(this.hass);
    } catch (e) {
      this._error = String(e);
    }
  }

  private async _add() {
    this._error = "";
    const areaId = this._newId.trim();
    const name = this._newName.trim() || areaId;
    if (!areaId) {
      this._error = "Area ID is required.";
      return;
    }
    try {
      await saveArea(this.hass, areaId, {
        name,
        scenes: [],
        matchers: [],
        rules: [],
      });
      this._newId = "";
      this._newName = "";
      await this._refresh();
    } catch (e) {
      this._error = (e as Error).message || String(e);
    }
  }

  private async _delete(areaId: string) {
    if (!confirm(`Delete area ${areaId}?`)) return;
    try {
      await deleteArea(this.hass, areaId);
      await this._refresh();
    } catch (e) {
      this._error = (e as Error).message || String(e);
    }
  }

  private _open(areaId: string) {
    this.dispatchEvent(
      new CustomEvent("open-area", {
        detail: { areaId },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    return html`
      <div class="toolbar">
        <input
          type="text"
          placeholder="area_id (e.g. living_room)"
          .value=${this._newId}
          @input=${(e: InputEvent) =>
            (this._newId = (e.target as HTMLInputElement).value)}
        />
        <input
          type="text"
          placeholder="Display name (optional)"
          .value=${this._newName}
          @input=${(e: InputEvent) =>
            (this._newName = (e.target as HTMLInputElement).value)}
        />
        <button @click=${this._add}>Add area</button>
      </div>

      ${this._error ? html`<p class="error">${this._error}</p>` : ""}
      ${this._areas.length === 0
        ? html`<p class="empty">No areas configured yet.</p>`
        : html`
            <ul>
              ${this._areas.map(
                (a) => html`
                  <li>
                    <span class="name" @click=${() => this._open(a.area_id)}>
                      ${a.name} <small>(${a.area_id})</small>
                    </span>
                    <button class="secondary" @click=${() => this._delete(a.area_id)}>
                      Delete
                    </button>
                  </li>
                `,
              )}
            </ul>
          `}
    `;
  }
}
