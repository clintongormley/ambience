import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { listAutoTriggers, type HassConnection } from "../api.js";
import { anchorLabel, localize } from "../i18n.js";
import { formatReapplyInterval } from "../reapply.js";
import type { AutoTrigger, Rule, Scope } from "../types.js";
import { entityName, renderEntityIcon, DEFAULT_ENTITY_ICON } from "./entity-row.js";

// Representative icons for the derived non-entity trigger groups.
const _GROUP_ICON: Record<string, string> = {
  time: "mdi:clock-outline",
  sun: "mdi:weather-sunny",
  reapply: "mdi:refresh",
};

/**
 * Read-only "Auto-triggers" modal for one scope. Lists every watch the engine
 * derives from the scope's rules (entities, clock times, sun events, date
 * rollover, periodic re-check) as a plain list — no enable/disable controls.
 *
 * Follows the modal pattern of `traces-modal.ts`; fetches lazily on open and
 * re-fetches when `rules`/`scope` change while open.
 *
 * Properties:
 *   hass   – HA connection (required)
 *   scope  – the scope to list derived triggers for
 *   rules  – passed by the parent so a rules change re-fetches the list
 *   open   – whether the modal is visible
 *
 * Events:
 *   close – dispatched when the user closes the modal
 */
@customElement("ambience-auto-triggers-modal")
export class AmbienceAutoTriggersModal extends LitElement {
  static override styles = css`
    :host {
      display: none;
      position: fixed;
      inset: 0;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.45);
      z-index: 1000;
    }
    :host([open]) {
      display: flex;
    }
    .modal {
      background: var(--card-background-color, #fff);
      border-radius: 8px;
      padding: 1.5rem;
      max-width: 640px;
      width: 90%;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      overflow: hidden;
    }
    .header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .header h3 {
      margin: 0;
      flex: 1;
    }
    .close {
      padding: 0.25rem 0.5rem;
      cursor: pointer;
      border: none;
      background: none;
      font-size: 1.2rem;
      color: var(--secondary-text-color, #888);
      line-height: 1;
    }
    .body {
      overflow-y: auto;
      flex: 1;
    }
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    li {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.6rem 0.25rem;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
    }
    li:last-child {
      border-bottom: 0;
    }
    li.clickable {
      cursor: pointer;
    }
    li.clickable:hover {
      background: var(--secondary-background-color, #f5f5f5);
    }
    .row-icon {
      flex: 0 0 auto;
      color: var(--secondary-text-color, #888);
      --mdc-icon-size: 22px;
    }
    .row-text {
      flex: 1;
      min-width: 0;
    }
    .row-title {
      color: var(--primary-text-color, #212121);
    }
    .row-detail {
      color: var(--secondary-text-color, #888);
      font-size: 0.8em;
      margin-top: 0.1rem;
      word-break: break-word;
    }
    .empty,
    .note,
    .error {
      color: var(--secondary-text-color, #888);
      font-size: 0.85em;
      padding: 0.25rem 0;
    }
    .error {
      color: var(--error-color, #d32f2f);
    }
    .note {
      font-style: italic;
    }
  `;

  @property({ attribute: false }) hass!: HassConnection & {
    states?: Record<string, { attributes?: Record<string, unknown> }>;
  };
  @property({ attribute: false }) scope!: Scope;
  @property() scopeName = "";
  // Passed by the parent so a rules change re-fetches the derived list.
  @property({ attribute: false }) rules: Rule[] = [];
  @property({ type: Boolean, reflect: true }) open = false;

  @state() private _triggers: AutoTrigger[] = [];
  @state() private _opaque = false;
  @state() private _loading = false;
  @state() private _error = "";

  override willUpdate(changed: Map<string, unknown>) {
    super.willUpdate?.(changed);
    // Fetch when opened, or when rules/scope change while already open.
    if (this.open && (changed.has("open") || changed.has("rules") || changed.has("scope"))) {
      void this._load();
    }
  }

  private get _scopeId(): string | null {
    return this.scope.kind === "house" ? null : this.scope.id;
  }

  private async _load() {
    this._loading = true;
    this._error = "";
    try {
      const res = await listAutoTriggers(this.hass, this.scope.kind, this._scopeId);
      this._triggers = res.triggers;
      this._opaque = res.opaque;
    } catch (e) {
      this._error = (e as Error).message || String(e);
    } finally {
      this._loading = false;
    }
  }

  private _close() {
    this.dispatchEvent(new CustomEvent("close", { bubbles: true, composed: true }));
  }

  /** Open HA's more-info dialog for an entity. The `hass-more-info` event
   *  bubbles (composed) up to the <home-assistant> root, which owns the dialog. */
  private _openMoreInfo(entityId: string) {
    this.dispatchEvent(
      new CustomEvent("hass-more-info", { detail: { entityId }, bubbles: true, composed: true }),
    );
  }

  private _entityName(entity_id: string): string {
    return entityName(this.hass, entity_id);
  }


  /** Entity rows sorted alphabetically by display name (case-insensitive), then
   *  group rows in backend order (time, sun, then read-only re-apply rows). */
  private get _sortedTriggers(): AutoTrigger[] {
    const nameOf = (t: Extract<AutoTrigger, { kind: "entity" }>) =>
      this._entityName(t.entity_id).toLowerCase();
    const entities = this._triggers
      .filter((t): t is Extract<AutoTrigger, { kind: "entity" }> => t.kind === "entity")
      .sort((a, b) => nameOf(a).localeCompare(nameOf(b)));
    const groups = this._triggers.filter((t) => t.kind !== "entity");
    return [...entities, ...groups];
  }

  private _sunPart(s: { anchor: string; offset: number }): string {
    const base = anchorLabel(this.hass, s.anchor);
    if (s.offset === 0) return base;
    return `${base} ${s.offset > 0 ? "+" : ""}${s.offset} min`;
  }

  /** Title + detail lines for a trigger row. Title is the primary line
   *  (entity name or group name); detail is the muted second line. */
  private _rowContent(t: AutoTrigger): { title: string; detail: string } {
    switch (t.kind) {
      case "entity":
        return { title: this._entityName(t.entity_id), detail: t.entity_id };
      case "time": {
        const parts = t.clocks.map(
          (c) => `${String(c.hour).padStart(2, "0")}:${String(c.minute).padStart(2, "0")}`,
        );
        if (t.date_rollover) {
          parts.push(
            localize(this.hass, "ui.auto_trigger_date_rollover", "Local midnight (date rollover)"),
          );
        }
        if (t.has_time) {
          parts.push(localize(this.hass, "ui.auto_trigger_periodic", "periodic re-check"));
        }
        return {
          title: localize(this.hass, "ui.auto_trigger_group_time", "Time"),
          detail: parts.join(", "),
        };
      }
      case "sun":
        return {
          title: localize(this.hass, "ui.auto_trigger_group_sun", "Sun"),
          detail: t.suns.map((s) => this._sunPart(s)).join(", "),
        };
      case "reapply":
        return {
          title: localize(this.hass, "ui.auto_trigger_reapply", "Re-apply"),
          detail: `${localize(this.hass, "ui.auto_trigger_every", "every")} ${formatReapplyInterval(t.interval_seconds)}`,
        };
    }
  }

  /** The leading icon for a row. For entity rows, prefer HA's <ha-state-icon>
   *  (which resolves the entity-registry / device_class / domain icon the way
   *  the rest of HA does) and fall back to a per-domain glyph when it isn't
   *  registered. Group rows use a representative glyph. */
  private _renderRowIcon(t: AutoTrigger) {
    if (t.kind === "entity") {
      return renderEntityIcon(this.hass, t.entity_id);
    }
    return html`<ha-icon
      class="row-icon"
      icon=${_GROUP_ICON[t.kind] ?? DEFAULT_ENTITY_ICON}
    ></ha-icon>`;
  }

  /** The entity a row's more-info dialog should open, or null if the row has
   *  no entity. Entity rows map to their entity; the Sun group maps to the
   *  `sun.sun` entity when present; Time/Re-apply have no entity. */
  private _moreInfoEntity(t: AutoTrigger): string | null {
    if (t.kind === "entity") return t.entity_id;
    if (t.kind === "sun" && this.hass?.states?.["sun.sun"]) return "sun.sun";
    return null;
  }

  private _renderRow(t: AutoTrigger) {
    const { title, detail } = this._rowContent(t);
    // Entity rows (and the Sun summary) open HA's more-info dialog; the other
    // derived group rows have no entity to show, so they stay non-interactive.
    const eid = this._moreInfoEntity(t);
    return html`
      <li
        data-test=${`trigger-ro-${t.key}`}
        class=${eid ? "clickable" : ""}
        role=${eid ? "button" : nothing}
        tabindex=${eid ? "0" : nothing}
        @click=${eid ? () => this._openMoreInfo(eid) : nothing}
        @keydown=${eid
          ? (e: KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                this._openMoreInfo(eid);
              }
            }
          : nothing}
      >
        ${this._renderRowIcon(t)}
        <div class="row-text">
          <div class="row-title">${title}</div>
          ${detail ? html`<div class="row-detail">${detail}</div>` : ""}
        </div>
      </li>
    `;
  }

  override render() {
    if (!this.open) return nothing;
    const title = localize(this.hass, "ui.auto_triggers_section", "Auto-triggers");
    return html`
      <div class="modal" role="dialog" aria-modal="true">
        <div class="header">
          <h3>${title}${this.scopeName ? ` — ${this.scopeName}` : ""}</h3>
          <button class="close" @click=${this._close} aria-label="Close">✕</button>
        </div>
        <div class="body">${this._renderBody()}</div>
      </div>
    `;
  }

  private _renderBody() {
    if (this._error) return html`<div class="error">${this._error}</div>`;
    if (this._loading && this._triggers.length === 0) {
      return html`<div class="empty">${localize(this.hass, "ui.loading", "Loading…")}</div>`;
    }
    return html`
      ${this._opaque
        ? html`<div class="note">
            ${localize(
              this.hass,
              "ui.auto_triggers_opaque_note",
              "A script rule is opaque — some watches may be missing. Declare them in the rule's Triggers field.",
            )}
          </div>`
        : ""}
      ${this._triggers.length === 0
        ? html`<div class="empty">
            ${localize(this.hass, "ui.auto_triggers_none", "No automatic triggers.")}
          </div>`
        : html`<ul>
            ${this._sortedTriggers.map((t) => this._renderRow(t))}
          </ul>`}
    `;
  }
}
