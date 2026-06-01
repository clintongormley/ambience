import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { listTraces, type HassConnection } from "../api.js";
import type { BufferedUnit } from "../types.js";
import { renderEvaluation, traceDetailStyles } from "../trace-detail.js";

/**
 * Modal showing recent trace evaluations for one (scope, group) bucket.
 *
 * Properties:
 *   hass       – HA connection (required)
 *   scope      – { scope_kind, scope_id } identifying the scope to filter by
 *   group      – group id to filter by
 *   groupName  – display name for the group (falls back to `group` if absent)
 *   open       – whether the modal is visible
 *
 * Events:
 *   close – dispatched when the user closes the modal
 */
@customElement("ambience-traces-modal")
export class AmbienceTracesModal extends LitElement {
  static override styles = [
    traceDetailStyles,
    css`
      :host {
        display: none;
        position: fixed; inset: 0;
        align-items: center; justify-content: center;
        background: rgba(0,0,0,0.45); z-index: 1000;
      }
      :host([open]) {
        display: flex;
      }
      .modal {
        background: var(--card-background-color, #fff);
        border-radius: 8px; padding: 1.5rem;
        max-width: 640px; width: 90%; max-height: 80vh;
        display: flex; flex-direction: column; gap: 1rem;
        overflow: hidden;
      }
      .header {
        display: flex; align-items: center; gap: 0.5rem;
      }
      .header h3 { margin: 0; flex: 1; }
      .refresh {
        padding: 0.25rem 0.75rem; cursor: pointer;
        border: 1px solid var(--divider-color, #ccc);
        border-radius: 4px; background: none; color: inherit;
        font-size: 0.85rem;
      }
      .close {
        padding: 0.25rem 0.5rem; cursor: pointer;
        border: none; background: none; font-size: 1.2rem;
        color: var(--secondary-text-color, #888);
        line-height: 1;
      }
      .body { overflow-y: auto; flex: 1; }
      .list { display: flex; flex-direction: column; gap: 0.5rem; }
      .empty { color: var(--secondary-text-color, #888); font-size: 0.9rem; margin: 0; }
      .error { color: var(--error-color, #c00); font-size: 0.9rem; margin: 0; }
    `,
  ];

  @property({ attribute: false }) hass!: HassConnection;
  @property({ attribute: false }) scope!: { scope_kind: string; scope_id: string | null };
  @property() group = "";
  @property() groupName: string | null = null;
  @property({ type: Boolean, reflect: true }) open = false;

  @state() private _records: BufferedUnit[] = [];
  @state() private _expanded = new Set<string>();
  @state() private _loading = true;
  @state() private _error = "";

  override updated(changed: Map<string, unknown>): void {
    if (
      (changed.has("open") && this.open) ||
      (changed.has("group") && this.open) ||
      (changed.has("scope") && this.open)
    ) {
      this._load();
    }
  }

  private async _load(): Promise<void> {
    this._error = "";
    this._loading = true;
    this._expanded = new Set(); // every (re)open starts fully collapsed
    try {
      const all = await listTraces(this.hass);
      if (!this.isConnected) return;
      this._records = all.filter(
        (u) =>
          u.scope_kind === this.scope.scope_kind &&
          u.scope_id === this.scope.scope_id &&
          u.group === this.group,
      );
      this._loading = false;
    } catch (e) {
      this._error = (e as Error).message || String(e);
      this._loading = false;
    }
  }

  private _toggle(key: string): void {
    const next = new Set(this._expanded);
    if (next.has(key)) next.delete(key); else next.add(key);
    this._expanded = next;
  }

  private _onClose(): void {
    this.dispatchEvent(new CustomEvent("close", { bubbles: true, composed: true }));
  }

  override render() {
    if (!this.open) return nothing;
    const title = this.groupName ?? this.group;
    return html`
      <div class="modal" role="dialog" aria-modal="true">
        <div class="header">
          <h3>${title}</h3>
          <button class="refresh" @click=${() => this._load()}>Refresh</button>
          <button class="close" @click=${this._onClose} aria-label="Close">✕</button>
        </div>
        <div class="body">
          ${this._error
            ? html`<p class="error">${this._error}</p>`
            : this._loading
              ? html`<p class="empty">Loading…</p>`
              : this._records.length === 0
                ? html`<p class="empty">No traces for this group yet.</p>`
                : html`<div class="list">${this._records.map((u, i) => {
                    const key = `${u.event_id ?? i}|${u.timestamp ?? ""}`;
                    return renderEvaluation(u, this._expanded.has(key), () => this._toggle(key));
                  })}</div>`}
        </div>
      </div>
    `;
  }
}
