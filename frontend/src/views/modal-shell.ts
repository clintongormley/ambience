import type { LitElement, ReactiveController } from "lit";

/**
 * Shared dismiss wiring for the fixed-overlay modals (settings, traces,
 * simulator): Escape and a backdrop click both close. The host is the
 * overlay (`:host` is the fixed backdrop, `.modal` the dialog), so a click
 * that reaches the host without passing through `.modal` is a backdrop click —
 * hosts must stop propagation on `.modal` (`@click=${(e) => e.stopPropagation()}`).
 *
 * Extracted so the three modals can't drift (only settings-modal used to
 * support Escape/backdrop close).
 */
export class ModalDismissController implements ReactiveController {
  private _host: LitElement & { open?: boolean };
  private _close: () => void;

  constructor(host: LitElement & { open?: boolean }, close: () => void) {
    this._host = host;
    this._close = close;
    host.addController(this);
  }

  private _onKeydown = (e: KeyboardEvent): void => {
    if (this._host.open && e.key === "Escape") this._close();
  };

  private _onBackdrop = (): void => {
    if (this._host.open) this._close();
  };

  hostConnected(): void {
    document.addEventListener("keydown", this._onKeydown);
    this._host.addEventListener("click", this._onBackdrop);
  }

  hostDisconnected(): void {
    document.removeEventListener("keydown", this._onKeydown);
    this._host.removeEventListener("click", this._onBackdrop);
  }
}
