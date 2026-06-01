// frontend/src/main.ts
/**
 * Ambience sidebar panel — registered as <ambience-panel>. HA loads this
 * (only when the sidebar option is enabled) and instantiates the element. It
 * lazy-loads the shared <ambience-frontend> chunk and renders it full-height.
 */

import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import { loadFrontend } from "./lazy-frontend.js";

@customElement("ambience-panel")
export class AmbiencePanel extends LitElement {
  static override styles = css`
    :host {
      display: block;
      height: 100vh;
      overflow: auto;
    }
    ambience-frontend {
      height: 100%;
    }
  `;

  @property({ attribute: false }) hass!: unknown;

  override connectedCallback() {
    super.connectedCallback();
    void loadFrontend();
  }

  override render() {
    return html`<ambience-frontend .hass=${this.hass}></ambience-frontend>`;
  }
}
