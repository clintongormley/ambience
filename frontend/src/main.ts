/**
 * Ambience panel — root element registered as <ambience-panel>.
 * HA loads the bundle and instantiates this element inside the panel iframe.
 */

import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import type { HassConnection } from "./api.js";
import "./views/areas-list-view.js";
import "./views/area-editor-view.js";

type Route =
  | { kind: "areas" }
  | { kind: "area"; areaId: string };

@customElement("ambience-panel")
export class AmbiencePanel extends LitElement {
  static override styles = css`
    :host {
      display: block;
      height: 100vh;
      background: var(--primary-background-color, #fafafa);
      color: var(--primary-text-color, #1d1d1d);
      font-family: var(--primary-font-family, system-ui, sans-serif);
    }
    header {
      padding: 1rem;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    button {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      border: 0;
      border-radius: 4px;
      padding: 0.5rem 1rem;
      cursor: pointer;
    }
  `;

  @property({ attribute: false }) hass!: HassConnection;
  @state() private _route: Route = { kind: "areas" };

  override render() {
    return html`
      <header>
        <h1>Ambience</h1>
        ${this._route.kind === "area"
          ? html`<button @click=${() => this._openAreas()}>← All areas</button>`
          : ""}
      </header>
      ${this._renderRoute()}
    `;
  }

  private _renderRoute() {
    if (this._route.kind === "areas") {
      return html`
        <ambience-areas-list
          .hass=${this.hass}
          @open-area=${(e: CustomEvent<{ areaId: string }>) =>
            this._openArea(e.detail.areaId)}
        ></ambience-areas-list>
      `;
    }
    return html`
      <ambience-area-editor
        .hass=${this.hass}
        .areaId=${this._route.areaId}
      ></ambience-area-editor>
    `;
  }

  private _openArea(areaId: string) {
    this._route = { kind: "area", areaId };
  }

  private _openAreas() {
    this._route = { kind: "areas" };
  }
}
