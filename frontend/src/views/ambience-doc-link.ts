import { css, html, LitElement, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

import { docUrl } from "../docs.js";
import { type HassLike, localize } from "../i18n.js";

/** A small "open in new tab" icon-link to a documentation page. Rendered as a
 *  plain anchor with an inline SVG (no ha-* deps) so it works in every panel
 *  context and under jsdom. Set `path` to a site-relative docs path such as
 *  "conditions/lux"; an empty path renders nothing. The click is stopped from
 *  propagating so the link works inside a clickable header without triggering
 *  that header's own action. */
@customElement("ambience-doc-link")
export class AmbienceDocLink extends LitElement {
  static override styles = css`
    :host {
      display: inline-flex;
      vertical-align: middle;
    }
    a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--ambience-doc-link-color, var(--secondary-text-color, #888));
      border-radius: 50%;
    }
    a:hover {
      color: var(--primary-color, #03a9f4);
    }
    a:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    svg {
      width: 1.05em;
      height: 1.05em;
      fill: currentColor;
    }
  `;

  @property({ attribute: false }) hass: HassLike | undefined;
  /** Site-relative docs path, e.g. "conditions/lux". Empty renders nothing. */
  @property() path = "";

  private _onClick = (e: Event): void => {
    // Don't let the click reach a clickable ancestor (e.g. a card header that
    // toggles on click). Navigation still happens via the anchor's default.
    e.stopPropagation();
  };

  override render() {
    if (!this.path) return nothing;
    const label = localize(this.hass, "ui.open_documentation", "Open documentation");
    return html`
      <a
        data-test="doc-link"
        href=${docUrl(this.path)}
        target="_blank"
        rel="noopener noreferrer"
        title=${label}
        aria-label=${label}
        @click=${this._onClick}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"
          ></path>
        </svg>
      </a>
    `;
  }
}
