import { css, html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { docUrl } from "../docs.js";
import { type HassLike, localize } from "../i18n.js";

/** mdi:help-circle-outline — HA's standard help glyph, inlined so the element
 *  stays ha-*-free (works in every panel context and under jsdom). */
const HELP_ICON = html`<svg viewBox="0 0 24 24" aria-hidden="true">
  <path
    d="M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z"
  ></path>
</svg>`;

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
    /* The trigger is HA's standard help glyph (mdi:help-circle-outline). Size is
       overridable via --ambience-help-size (defaults to a text-relative size for
       inline use; the panel header bumps it to 24px to match HA's toolbar icons),
       colour via --ambience-help-trigger-color (defaults to the muted grey). */
    .trigger {
      all: unset;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--ambience-help-size, 1.25em);
      height: var(--ambience-help-size, 1.25em);
      color: var(--ambience-help-trigger-color, var(--secondary-text-color, #888));
    }
    .trigger:hover {
      color: var(--primary-color, #03a9f4);
    }
    .trigger svg {
      width: 100%;
      height: 100%;
      fill: currentColor;
      display: block;
    }
    .trigger:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
      border-radius: 50%;
    }
    /* Block so it sits on its own line below the help text (not jammed against
       the last word), with a divider rule for separation. */
    a.doc-link {
      display: block;
      margin-top: 0.55rem;
      padding-top: 0.5rem;
      border-top: 1px solid var(--divider-color, #e0e0e0);
      line-height: 1.3;
      color: var(--primary-color, #03a9f4);
      text-decoration: none;
      font-weight: 500;
    }
    a.doc-link:hover {
      text-decoration: underline;
    }
    /* position: fixed (coordinates set in JS from the trigger's rect) so the
       popover escapes the settings modal's overflow:hidden instead of being
       clipped at its edge. */
    .popover {
      position: fixed;
      z-index: 1000;
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
  /** Inline top/left (and optional translateY) for the fixed-position popover,
   *  computed from the trigger's viewport rect when it opens. */
  @state() private _popStyle = "";

  private _onDocClick = (e: MouseEvent): void => {
    if (!e.composedPath().includes(this)) this._close();
  };
  private _onKeydown = (e: KeyboardEvent): void => {
    if (e.key === "Escape") this._close();
  };
  // The popover is position:fixed, so its coordinates would drift if the page
  // scrolled or resized underneath it. Dismiss instead of re-tracking.
  private _onViewportChange = (): void => this._close();

  private _toggle(e: Event): void {
    e.stopPropagation();
    if (this._open) this._close();
    else this._openPopover();
  }

  /** Anchor the fixed popover to the trigger: below it by default, flipped above
   *  when there isn't room below, and clamped to the viewport horizontally. */
  private _positionPopover(): void {
    const trigger = this.renderRoot.querySelector(".trigger") as HTMLElement | null;
    if (!trigger) return;
    const r = trigger.getBoundingClientRect();
    const maxW = 260;
    const vw = window.innerWidth || 1024;
    const vh = window.innerHeight || 768;
    const left = Math.max(8, Math.min(r.left, vw - maxW - 8));
    // Flip above only when there isn't room below AND there's more room above.
    // translateY(-100%) anchors the popover's bottom to the trigger top, so we
    // can flip upward without knowing the popover's height in advance.
    const spaceBelow = vh - r.bottom;
    const spaceAbove = r.top;
    const openUp = spaceBelow < 220 && spaceAbove > spaceBelow;
    this._popStyle = openUp
      ? `top:${Math.round(r.top - 6)}px;left:${Math.round(left)}px;transform:translateY(-100%);`
      : `top:${Math.round(r.bottom + 6)}px;left:${Math.round(left)}px;`;
  }

  private _openPopover(): void {
    this._positionPopover();
    this._open = true;
    this._bindGlobals(true);
  }

  private _close(): void {
    if (!this._open) return;
    this._open = false;
    this._bindGlobals(false);
    (this.renderRoot.querySelector(".trigger") as HTMLElement | null)?.focus();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._bindGlobals(false);
  }

  /** Add or remove the dismiss listeners as one set, so an add can never drift
   *  from its matching remove. Capture phase: the panel lives inside a modal
   *  whose `.modal` stops click propagation in the bubble phase, so a
   *  bubble-phase document listener never sees clicks elsewhere in the modal —
   *  capturing fires before that stopPropagation, so click-outside-to-dismiss
   *  works inside the modal too. scroll is passive (it only dismisses). */
  private _bindGlobals(add: boolean): void {
    if (add) {
      document.addEventListener("click", this._onDocClick, true);
      document.addEventListener("keydown", this._onKeydown);
      window.addEventListener("scroll", this._onViewportChange, { capture: true, passive: true });
      window.addEventListener("resize", this._onViewportChange);
    } else {
      document.removeEventListener("click", this._onDocClick, true);
      document.removeEventListener("keydown", this._onKeydown);
      // removeEventListener matches on (type, callback, capture) only — passive
      // is ignored — so { capture: true } correctly removes the passive add.
      window.removeEventListener("scroll", this._onViewportChange, { capture: true });
      window.removeEventListener("resize", this._onViewportChange);
    }
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
        >${HELP_ICON}</a>
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
      >${HELP_ICON}</button>
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
              style=${this._popStyle}
            ><slot>${this.text}</slot>${docLink}</div>`
          : ""
      }
    `;
  }
}
