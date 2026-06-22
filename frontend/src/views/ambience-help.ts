import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";

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
    button.trigger {
      all: unset;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.15em;
      height: 1.15em;
      border-radius: 50%;
      border: 1px solid var(--secondary-text-color, #888);
      color: var(--secondary-text-color, #888);
      font-size: 0.8em;
      font-weight: 700;
      line-height: 1;
    }
    button.trigger:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
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
          ? html`<div
              class="popover${this.multiline ? " multiline" : ""}"
              role="dialog"
              data-test="help-popover"
            >
            <slot>${this.text}</slot>
          </div>`
          : ""
      }
    `;
  }
}
