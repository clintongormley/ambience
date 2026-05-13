import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import type { HassConnection } from "../api.js";

@customElement("ambience-area-editor")
export class AmbienceAreaEditor extends LitElement {
  static override styles = css`
    :host {
      display: block;
      padding: 1rem;
    }
  `;

  @property({ attribute: false }) hass!: HassConnection;
  @property() areaId = "";

  override render() {
    return html`<p>Area editor (placeholder) — areaId: ${this.areaId}</p>`;
  }
}
