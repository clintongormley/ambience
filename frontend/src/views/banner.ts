import { css, html, LitElement, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

import { bannerStyles } from "./banner-styles.js";

/**
 * Shared notice banner: a leading icon, a slotted text block, a CTA, and a
 * dismiss ✕. Presentational only (no `hass`/i18n): the host passes already-
 * localised `ctaLabel`/`dismissLabel`. The CTA is an external link when
 * `ctaHref` is set, else a `<button>` that emits `banner-cta`. The ✕ emits
 * `banner-dismiss` (and stops propagation so it never triggers a host row's
 * click). Hosts set `data-test="<id>"` on the element itself to identify it.
 *
 * Slotted text styling: top-level `<strong>` (a heading) and `<span>` (muted
 * body) are styled here; bare slotted text inherits the banner's primary colour,
 * which is how the language banner renders a single emphasised sentence.
 */
@customElement("ambience-banner")
export class AmbienceBanner extends LitElement {
  static override styles = [
    bannerStyles,
    css`
      :host {
        display: block;
      }
      ::slotted(strong) {
        font-weight: 600;
      }
      ::slotted(span) {
        font-size: 0.9rem;
        color: var(--secondary-text-color, #888);
      }
      .banner-dismiss ha-icon {
        --mdc-icon-size: 20px;
      }
    `,
  ];

  /** mdi icon name for the leading glyph, e.g. "mdi:translate". */
  @property() icon = "";
  /** Already-localised CTA label. Empty → no CTA. */
  @property() ctaLabel = "";
  /** When set, the CTA is an external link to this URL; otherwise a button. */
  @property() ctaHref = "";
  /** Already-localised dismiss aria-label / title. */
  @property() dismissLabel = "";
  /** Tint the leading icon with the primary colour (the `.banner-hint` look). */
  @property({ type: Boolean }) hint = false;
  /** When false, the dismiss ✕ is not rendered (a persistent banner). */
  @property({ type: Boolean }) dismissible = true;

  // Lit binds event listeners with `this` set to the host element, so these
  // method references can be used directly without a per-render arrow closure.
  private _onDismiss(e: Event): void {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent("banner-dismiss", { bubbles: true, composed: true }));
  }

  private _onCta(): void {
    this.dispatchEvent(new CustomEvent("banner-cta", { bubbles: true, composed: true }));
  }

  private _renderCta() {
    if (!this.ctaLabel) return nothing;
    if (this.ctaHref) {
      return html`<a
        class="banner-cta"
        data-test="banner-cta"
        href=${this.ctaHref}
        target="_blank"
        rel="noopener noreferrer"
      >${this.ctaLabel}</a>`;
    }
    return html`<button class="banner-cta" data-test="banner-cta" @click=${this._onCta}>
      ${this.ctaLabel}
    </button>`;
  }

  override render() {
    return html`
      <div class="banner ${this.hint ? "banner-hint" : ""}">
        <ha-icon class="banner-icon" icon=${this.icon}></ha-icon>
        <div class="banner-text"><slot></slot></div>
        ${this._renderCta()}
        ${
          this.dismissible
            ? html`<button
              class="banner-dismiss"
              data-test="banner-dismiss"
              title=${this.dismissLabel}
              aria-label=${this.dismissLabel}
              @click=${this._onDismiss}
            ><ha-icon icon="mdi:close"></ha-icon></button>`
            : nothing
        }
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ambience-banner": AmbienceBanner;
  }
}
