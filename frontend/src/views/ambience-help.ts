import { css, html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { docUrl } from "../docs.js";
import { type HassLike, localize } from "../i18n.js";

/** A "(?)" trigger that opens a small white popover with help text. Click the
 *  trigger to toggle; click outside or press Escape to dismiss. Dependency-free
 *  (no ha-* components) so it works in every panel context and under jsdom. */
@customElement("ambience-help")
export class AmbienceHelp extends LitElement {
  static override styles = css`
    :host {
      position: relative;
      display: inline-flex;
      vertical-align: middle;
    }
    .trigger {
      all: unset;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.15em;
      height: 1.15em;
      border-radius: 50%;
      /* Colour is overridable via --ambience-help-trigger-color so a caller can
         darken the "?" to match adjacent text; defaults to the muted grey. */
      border: 1px solid var(--ambience-help-trigger-color, var(--secondary-text-color, #888));
      color: var(--ambience-help-trigger-color, var(--secondary-text-color, #888));
      font-size: 0.8em;
      font-weight: 700;
      line-height: 1;
    }
    .trigger:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    a.doc-link {
      display: inline-block;
      margin-top: 0.5rem;
      color: var(--primary-color, #03a9f4);
      text-decoration: none;
      font-weight: 500;
    }
    a.doc-link:hover {
      text-decoration: underline;
    }
    .popover {
      position: absolute;
      top: calc(100% + 6px);
      left: 0;
      z-index: 30;
      width: max-content;
      max-width: 260px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 6px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
      padding: 0.6rem 0.7rem;
      font-size: 0.85rem;
      font-weight: 400;
      line-height: 1.45;
      white-space: normal;
      text-align: left;
    }
    .popover.multiline {
      white-space: pre-wrap;
    }
  `;

  @property({ attribute: false }) hass: HassLike | undefined;
  @property() text = "";
  /** When true, the popover preserves line breaks (white-space: pre-wrap) so a
   *  multi-line value (e.g. a scene description) renders with its newlines. */
  @property({ type: Boolean }) multiline = false;
  /** Optional site-relative docs path, e.g. "conditions/lux". With no `text`, the
   *  (?) trigger is itself a direct external link to that page. Alongside `text`,
   *  the popover ends with a "Read more →" link. Bind with `.docPath=${…}` (the
   *  default attribute would be the lower-cased `docpath`). */
  @property() docPath = "";
  @state() private _open = false;

  private _onDocClick = (e: MouseEvent): void => {
    if (!e.composedPath().includes(this)) this._close();
  };
  private _onKeydown = (e: KeyboardEvent): void => {
    if (e.key === "Escape") this._close();
  };

  private _toggle(e: Event): void {
    e.stopPropagation();
    if (this._open) this._close();
    else this._openPopover();
  }

  private _openPopover(): void {
    this._open = true;
    // Capture phase: the panel lives inside a modal whose `.modal` stops click
    // propagation in the bubble phase, so a bubble-phase document listener never
    // sees clicks elsewhere in the modal. Capturing fires before that
    // stopPropagation, so click-outside-to-dismiss works inside the modal too.
    document.addEventListener("click", this._onDocClick, true);
    document.addEventListener("keydown", this._onKeydown);
  }

  private _close(): void {
    if (!this._open) return;
    this._open = false;
    document.removeEventListener("click", this._onDocClick, true);
    document.removeEventListener("keydown", this._onKeydown);
    (this.renderRoot.querySelector(".trigger") as HTMLElement | null)?.focus();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener("click", this._onDocClick, true);
    document.removeEventListener("keydown", this._onKeydown);
  }

  override render() {
    if (!this.text && !this.docPath) return nothing;

    // Direct-link mode: with no help text, the (?) itself opens the docs. The
    // click is stopped from propagating so the link works inside a clickable
    // header/summary without triggering that ancestor's own action; navigation
    // still happens via the anchor's default.
    if (!this.text) {
      const label = localize(this.hass, "ui.open_documentation", "Open documentation");
      return html`
        <a
          class="trigger"
          data-test="help-doc-link"
          href=${docUrl(this.docPath)}
          target="_blank"
          rel="noopener noreferrer"
          title=${label}
          aria-label=${label}
          @click=${(e: Event) => e.stopPropagation()}
        >?</a>
      `;
    }

    // Popover mode, optionally ending with a "Read more →" docs link.
    const docLink = this.docPath
      ? html`<a
          class="doc-link"
          data-test="help-doc-link"
          href=${docUrl(this.docPath)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label=${localize(this.hass, "ui.open_documentation", "Open documentation")}
        >${localize(this.hass, "ui.read_documentation", "Read more")} →</a>`
      : "";
    return html`
      <button
        class="trigger"
        data-test="help-trigger"
        aria-label=${localize(this.hass, "ui.help", "Help")}
        aria-expanded=${this._open}
        @click=${(e: Event) => this._toggle(e)}
      >
        ?
      </button>
      ${
        this._open
          ? // The slot is kept tight against the popover's tags — no newline or
            // indentation inside the element — so that under `multiline`
            // (white-space: pre-wrap) the template's own whitespace isn't
            // rendered as a leading offset before the text. `docLink` is "" when
            // no docPath is set, so the text-only popover is unchanged.
            html`<div
              class="popover${this.multiline ? " multiline" : ""}"
              role="dialog"
              data-test="help-popover"
            ><slot>${this.text}</slot>${docLink}</div>`
          : ""
      }
    `;
  }
}
