import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { getServiceSchema, listTraces, type HassConnection } from "../api.js";
import type { BufferedUnit, ServiceSchema } from "../types.js";
import { renderEvaluation, traceDetailStyles } from "../trace-detail.js";

/**
 * Modal showing recent trace evaluations for one (scope, category) bucket.
 *
 * Properties:
 *   hass       – HA connection (required)
 *   scope      – { scope_kind, scope_id } identifying the scope to filter by
 *   category   – category id to filter by
 *   categoryName  – display name for the category (falls back to `category` if absent)
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
      .refresh.has-new {
        border-color: var(--primary-color, #03a9f4);
        color: var(--primary-color, #03a9f4);
        font-weight: 600;
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
  @property() category = "";
  @property() categoryName: string | null = null;
  @property({ type: Boolean, reflect: true }) open = false;

  @state() private _records: BufferedUnit[] = [];
  // Service schemas keyed by service id, so action param keys render with HA's
  // friendly field names (e.g. "Brightness" not "Brightness pct"). Fetched
  // lazily after the records load; a service stays absent on fetch failure and
  // its params fall back to humanized field ids.
  @state() private _schemas: Record<string, ServiceSchema> = {};
  @state() private _expanded = new Set<string>();
  @state() private _loading = true;
  @state() private _error = "";
  @state() private _hasNew = false;
  private _poll?: ReturnType<typeof setInterval>;

  override connectedCallback(): void {
    super.connectedCallback();
    // While open, watch for newer traces for this category without disturbing the
    // list the user is reading — just flag the Refresh button.
    this._poll = setInterval(() => this._checkNew(), 5000);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._poll) clearInterval(this._poll);
  }

  override updated(changed: Map<string, unknown>): void {
    if (this.open && (changed.has("open") || changed.has("category") || changed.has("scope"))) {
      this._load();
    }
  }

  // The buffered records belonging to this (scope, category) bucket, newest-first.
  private _mine(all: BufferedUnit[]): BufferedUnit[] {
    return all.filter(
      (u) =>
        u.scope_kind === this.scope.scope_kind &&
        u.scope_id === this.scope.scope_id &&
        u.category === this.category,
    );
  }

  private async _load(): Promise<void> {
    this._error = "";
    this._loading = true;
    this._hasNew = false; // refresh / reopen consumes the "new traces" signal
    this._expanded = new Set(); // every (re)open starts fully collapsed
    try {
      const all = await listTraces(this.hass);
      if (!this.isConnected) return;
      this._records = this._mine(all);
      this._loading = false;
      // Refine param labels once schemas arrive; the list renders immediately
      // without waiting on these extra round-trips.
      void this._loadSchemas();
    } catch (e) {
      this._error = (e as Error).message || String(e);
      this._loading = false;
    }
  }

  // Fetch (and cache) the service schema for every distinct service referenced
  // by the loaded records' actions. Cached across reloads — schemas are global
  // per service — so a refresh only fetches services not seen before.
  private async _loadSchemas(): Promise<void> {
    const services = [
      ...new Set(this._records.flatMap((r) => r.actions.map((a) => a.service))),
    ].filter((svc) => !(svc in this._schemas));
    if (services.length === 0) return;
    const entries = await Promise.all(
      services.map(async (svc) => {
        try {
          return [svc, await getServiceSchema(this.hass, svc)] as const;
        } catch {
          return null; // missing schema → param keys fall back to humanized ids
        }
      }),
    );
    if (!this.isConnected) return;
    const merged = { ...this._schemas };
    for (const e of entries) if (e) merged[e[0]] = e[1];
    this._schemas = merged;
  }

  private async _checkNew(): Promise<void> {
    if (!this.open || !this.isConnected || document.visibilityState !== "visible") return;
    try {
      const mine = this._mine(await listTraces(this.hass));
      const newest = mine[0]?.timestamp ?? null;
      const shown = this._records[0]?.timestamp ?? null;
      if (newest && (!shown || newest > shown)) this._hasNew = true;
    } catch {
      // background check — stay silent
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
    const title = this.categoryName ?? this.category;
    return html`
      <div class="modal" role="dialog" aria-modal="true">
        <div class="header">
          <h3>${title}</h3>
          <button class="refresh ${this._hasNew ? "has-new" : ""}" @click=${() => this._load()}>
            ${this._hasNew ? "● New traces — refresh" : "Refresh"}
          </button>
          <button class="close" @click=${this._onClose} aria-label="Close">✕</button>
        </div>
        <div class="body">
          ${this._error
            ? html`<p class="error">${this._error}</p>`
            : this._loading
              ? html`<p class="empty">Loading…</p>`
              : this._records.length === 0
                ? html`<p class="empty">No traces for this category yet.</p>`
                : html`<div class="list">${this._records.map((u, i) => {
                    const key = `${u.event_id ?? i}|${u.timestamp ?? ""}`;
                    return renderEvaluation(
                      u,
                      this._expanded.has(key),
                      () => this._toggle(key),
                      this.hass,
                      this._schemas,
                    );
                  })}</div>`}
        </div>
      </div>
    `;
  }
}
