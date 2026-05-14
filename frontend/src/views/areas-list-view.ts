import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import type { AreaRegistryEvent, HassConnection } from "../api.js";
import { listAreas } from "../api.js";
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
      padding: 0.75rem 1rem;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      margin-bottom: 0.5rem;
      background: var(--card-background-color, #fff);
      cursor: pointer;
    }
    li:hover {
      border-color: var(--primary-color, #03a9f4);
    }
    .error {
      color: var(--error-color, #d32f2f);
      margin-top: 0.5rem;
    }
  `;

  @property({ attribute: false }) hass!: HassConnection;
  @state() private _areas: AreaListItem[] = [];
  @state() private _error = "";
  private _unsub?: () => void;

  override connectedCallback() {
    super.connectedCallback();
    void this._refresh();
    void this._subscribe();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._unsub?.();
    this._unsub = undefined;
  }

  private async _subscribe() {
    // The list mirrors HA's area registry — refresh on any area add/rename/remove.
    const unsub = await this.hass.connection.subscribeEvents<AreaRegistryEvent>(
      () => this._refresh(),
      "area_registry_updated",
    );
    if (this.isConnected) this._unsub = unsub;
    else unsub();
  }

  private async _refresh() {
    try {
      this._areas = await listAreas(this.hass);
    } catch (e) {
      this._error = String(e);
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
      ${this._error ? html`<p class="error">${this._error}</p>` : ""}
      ${this._areas.length === 0
        ? html`<p class="empty">No areas found in Home Assistant.</p>`
        : html`
            <ul>
              ${this._areas.map(
                (a) => html`
                  <li @click=${() => this._open(a.area_id)}>
                    ${a.name} <small>(${a.area_id})</small>
                  </li>
                `,
              )}
            </ul>
          `}
    `;
  }
}
