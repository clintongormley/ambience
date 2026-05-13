import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import type { HassConnection } from "../api.js";

@customElement("ambience-areas-list")
export class AmbienceAreasList extends LitElement {
  static override styles = css`
    :host {
      display: block;
      padding: 1rem;
    }
  `;

  @property({ attribute: false }) hass!: HassConnection;

  override render() {
    return html`<p>Areas list (placeholder).</p>`;
  }
}
