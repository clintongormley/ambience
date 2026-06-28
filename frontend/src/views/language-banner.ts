import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { buildTranslationRequestUrl } from "../github.js";
import { getLanguageSupport, type HassLike, languageDisplayName, localize } from "../i18n.js";
import { isLangRequestDismissed, persistDismissedLangRequest } from "../ui-state.js";
import "./banner.js";

/** Bolded in the message; not translated (it's the product name). */
const PRODUCT_NAME = "Ambience";

/**
 * A one-time, per-locale dismissable nudge shown when the user's HA language is
 * one Ambience does not ship a translation for, inviting them to request one via
 * a prefilled GitHub issue. Self-hides when the language is covered or already
 * dismissed. Everything render() needs — the display name, issue URL, message,
 * and labels — is resolved once per `hass` change in {@link willUpdate} and
 * cached, keeping that work off the (frequent) render path. The copy renders in
 * the English fallback — by definition the user's language has no catalogue.
 */
@customElement("ambience-language-banner")
export class AmbienceLanguageBanner extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }
    /* The nudge is a single flowing sentence, slotted as ONE block so it wraps
       inline rather than stacking as separate items in the banner's column text
       area. Rendered at primary colour (overriding the banner's muted
       ::slotted(span) body style) since it is the banner's main message. */
    .message {
      font-size: 1rem;
      line-height: 1.4;
      color: var(--primary-text-color, #212121);
    }
  `;

  @property({ attribute: false }) hass: HassLike | undefined;

  /** The only reactive field — drives whether the banner renders. The rest are
   *  plain caches populated alongside it in willUpdate, off the render path. */
  @state() private _visible = false;
  private _href = "";
  private _message: TemplateResult | string = "";
  private _actionLabel = "";
  private _dismissLabel = "";
  /** The locale currently shown — the code a dismissal is recorded against. */
  private _code = "";
  /** In-memory instant-hide so a dismissal sticks for the session even when
   *  localStorage is unavailable (where persistence silently no-ops). */
  private _dismissedCode = "";

  override willUpdate(changed: Map<string, unknown>): void {
    if (!changed.has("hass")) return;
    const support = getLanguageSupport(this.hass);
    if (
      support.available ||
      this._dismissedCode === support.code ||
      isLangRequestDismissed(support.code)
    ) {
      this._visible = false;
      return;
    }
    this._code = support.code;
    const displayName = languageDisplayName(support.code);
    this._href = buildTranslationRequestUrl(support.code, displayName);
    this._message = this._buildMessage(displayName);
    this._actionLabel = localize(
      this.hass,
      "ui.language_request.action",
      "Request a translation →",
    );
    this._dismissLabel = localize(this.hass, "ui.language_request.dismiss", "Dismiss");
    this._visible = true;
  }

  private _dismiss(): void {
    this._dismissedCode = this._code;
    persistDismissedLangRequest(this._code);
    this._visible = false;
  }

  /** Build the message as a single slotted `<span>`: tokenise the localised copy
   *  on its {language}/{product} placeholders and bold each substituted value,
   *  leaving the surrounding text plain. Wrapping the whole sentence in one
   *  element keeps it flowing inline inside the banner's column text area. */
  private _buildMessage(displayName: string): TemplateResult {
    const template = localize(
      this.hass,
      "ui.language_request.message",
      "Your Home Assistant language is {language}, but {product} isn't translated into it yet.",
    );
    const parts = template
      .split(/\{(language|product)\}/)
      .map((part, i) =>
        i % 2 === 0
          ? part
          : html`<strong>${part === "language" ? displayName : PRODUCT_NAME}</strong>`,
      );
    return html`<span class="message">${parts}</span>`;
  }

  override render() {
    if (!this._visible) return nothing;
    return html`
      <ambience-banner
        data-test="language-banner"
        icon="mdi:translate"
        hint
        .ctaLabel=${this._actionLabel}
        .ctaHref=${this._href}
        .dismissLabel=${this._dismissLabel}
        @banner-dismiss=${this._dismiss}
      >${this._message}</ambience-banner>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ambience-language-banner": AmbienceLanguageBanner;
  }
}
