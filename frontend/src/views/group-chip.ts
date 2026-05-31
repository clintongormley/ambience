import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

import { colorHex, textColorFor } from "../group-colors.js";
import type { RuleGroup } from "../types.js";

/**
 * An HA-label-style lozenge for a rule group: a rounded pill whose background
 * is the group's colour, with text + icon auto-coloured black/white by
 * background luminance. Groups with no colour use a neutral style.
 */
@customElement("ambience-group-chip")
export class AmbienceGroupChip extends LitElement {
  static override styles = css`
    :host {
      display: inline-flex;
    }
    .lozenge {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      border-radius: 12px;
      padding: 2px 8px;
      font-size: 0.8em;
      font-weight: 500;
      line-height: 1.4;
      white-space: nowrap;
    }
    .lozenge.neutral {
      background: var(--secondary-background-color, #e0e0e0);
      color: var(--primary-text-color, inherit);
    }
    .lozenge ha-icon {
      --mdc-icon-size: 1em;
      width: 1em;
      height: 1em;
    }
  `;

  @property({ attribute: false }) group!: RuleGroup;

  override render() {
    const hex = colorHex(this.group?.color);
    const style = hex ? `background: ${hex}; color: ${textColorFor(hex)}` : "";
    return html`
      <span class="lozenge ${hex ? "" : "neutral"}" style=${style} title=${this.group?.name ?? ""}>
        ${this.group?.icon ? html`<ha-icon icon=${this.group.icon}></ha-icon>` : ""}
        <span class="lozenge-name">${this.group?.name ?? ""}</span>
      </span>
    `;
  }
}
