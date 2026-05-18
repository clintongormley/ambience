/**
 * Ambience panel — root element registered as <ambience-panel>.
 * HA loads the bundle and instantiates this element inside the panel iframe.
 */

import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import type { HassConnection } from "./api.js";
import { ensureHaComponents } from "./ha-components.js";
import "./views/areas-list-view.js";

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
    }
    h1 {
      margin: 0;
      font-size: 1.4rem;
    }
  `;

  @property({ attribute: false }) hass!: HassConnection;

  override connectedCallback() {
    super.connectedCallback();
    // Kick off HA's lazy form-component load early so modals don't flash a
    // loading state on first open. Fire-and-forget; per-component
    // HaComponentsControllers will pick up the resolved state.
    void ensureHaComponents();
  }

  override render() {
    return html`
      <header><h1>Ambience</h1></header>
      <ambience-areas-list .hass=${this.hass}></ambience-areas-list>
    `;
  }
}
