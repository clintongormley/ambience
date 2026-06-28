import { css, html, LitElement, nothing } from "lit";
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
 * dismissed. Detection + display-name + URL are resolved once per `hass` change
 * in {@link willUpdate} and cached, keeping that work off the (frequent) render
 * path. The copy itself renders in the English fallback — by definition the
 * user's language has no catalogue.
 */
@customElement("ambience-language-banner")
export class AmbienceLanguageBanner extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }
  `;

  @property({ attribute: false }) hass: HassLike | undefined;

  @state() private _visible = false;
  @state() private _code = "";
  @state() private _displayName = "";
  @state() private _href = "";
  /** In-memory instant-hide for the just-dismissed locale; willUpdate re-reads
   *  storage on the next hass change. */
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
    this._displayName = languageDisplayName(support.code);
    this._href = buildTranslationRequestUrl(support.code, this._displayName);
    this._visible = true;
  }

  private _dismiss(): void {
    this._dismissedCode = this._code;
    persistDismissedLangRequest(this._code);
    this._visible = false;
  }

  /** Tokenise the localised message on its {language}/{product} placeholders and
   *  bold each substituted value, leaving the surrounding copy as plain text. */
  private _renderMessage() {
    const template = localize(
      this.hass,
      "ui.language_request.message",
      "Your Home Assistant language is {language}, but {product} isn't translated into it yet.",
    );
    return template
      .split(/\{(language|product)\}/)
      .map((part, i) =>
        i % 2 === 0
          ? part
          : html`<strong>${part === "language" ? this._displayName : PRODUCT_NAME}</strong>`,
      );
  }

  override render() {
    if (!this._visible) return nothing;
    return html`
      <ambience-banner
        data-test="language-banner"
        icon="mdi:translate"
        hint
        .ctaLabel=${localize(this.hass, "ui.language_request.action", "Request a translation →")}
        .ctaHref=${this._href}
        .dismissLabel=${localize(this.hass, "ui.language_request.dismiss", "Dismiss")}
        @banner-dismiss=${this._dismiss}
      >${this._renderMessage()}</ambience-banner>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ambience-language-banner": AmbienceLanguageBanner;
  }
}
