import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import type { HassConnection } from "../api.js";

@customElement("ambience-ambience-settings")
export class AmbienceAmbienceSettings extends LitElement {
  @property({ attribute: false }) hass!: HassConnection;

  override render() {
    return html`<!-- filled in by Task 10 -->`;
  }
}
