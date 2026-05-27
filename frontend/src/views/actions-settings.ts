import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import { localize } from "../i18n.js";
import type { HassConnection } from "../api.js";

@customElement("ambience-actions-settings")
export class AmbienceActionsSettings extends LitElement {
  static override styles = css`
    :host { display: block; }
    .placeholder {
      padding: 1.5rem;
      color: var(--secondary-text-color, #888);
      text-align: center;
      border: 1px dashed var(--divider-color, #e0e0e0);
      border-radius: 6px;
    }
  `;

  @property({ attribute: false }) hass!: HassConnection;

  override render() {
    return html`<div class="placeholder">${localize(this.hass, "ui.settings_ambience_actions_placeholder", "No action settings yet")}</div>`;
  }
}
