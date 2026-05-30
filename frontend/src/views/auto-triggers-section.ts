import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { listAutoTriggers, setAutoTrigger, type HassConnection } from "../api.js";
import { localize } from "../i18n.js";
import type { AutoTrigger, Rule, Scope } from "../types.js";

// Fallbacks mirror the shared `anchor.*` translation object (reused here so
// sun labels match the time-of-day editor).
const _SUN_FALLBACK: Record<string, string> = {
  sunrise: "Sunrise",
  sunset: "Sunset",
  noon: "Noon",
  midnight: "Midnight",
  dawn: "Dawn",
  dusk: "Dusk",
};

/**
 * Collapsed "Auto-triggers" section for one scope. Lists every watch the
 * engine derives from the scope's rules (entities, clock times, sun events,
 * date rollover, periodic re-check), each with a checkbox to disable it.
 *
 * Fetches lazily on first expand and re-fetches when `rules` change while open,
 * so edits to the rules are reflected without a manual reload.
 */
@customElement("ambience-auto-triggers-section")
export class AmbienceAutoTriggersSection extends LitElement {
  static override styles = css`
    :host {
      display: block;
      margin-top: 0.75rem;
      border-top: 1px solid var(--divider-color, #e0e0e0);
    }
    .header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.6rem 0 0.3rem 0;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.9em;
      color: var(--secondary-text-color, #888);
    }
    .chevron {
      width: 1em;
      transition: transform 0.1s;
    }
    .chevron.open {
      transform: rotate(90deg);
    }
    ul {
      list-style: none;
      padding: 0;
      margin: 0 0 0.25rem 1.3rem;
    }
    li {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
      padding: 0.2rem 0;
    }
    .label {
      flex: 1;
    }
    .eid {
      color: var(--secondary-text-color, #888);
      font-size: 0.8em;
      margin-left: 0.4rem;
    }
    .empty,
    .note,
    .error {
      color: var(--secondary-text-color, #888);
      font-size: 0.85em;
      padding: 0.25rem 0 0.25rem 1.3rem;
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
  // Passed by the parent so a rules change re-fetches the derived list.
  @property({ attribute: false }) rules: Rule[] = [];

  @state() private _open = false;
  @state() private _triggers: AutoTrigger[] = [];
  @state() private _opaque = false;
  @state() private _loading = false;
  @state() private _error = "";

  override willUpdate(changed: Map<string, unknown>) {
    super.willUpdate?.(changed);
    // Re-fetch when opened, or when rules change while already open.
    if (this._open && (changed.has("_open") || changed.has("rules") || changed.has("scope"))) {
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

  private _toggleOpen() {
    this._open = !this._open;
  }

  private async _onToggle(trigger: AutoTrigger, enabled: boolean) {
    // Optimistic: flip locally, then persist.
    this._triggers = this._triggers.map((t) =>
      t.key === trigger.key ? ({ ...t, enabled } as AutoTrigger) : t,
    );
    try {
      await setAutoTrigger(this.hass, this.scope.kind, this._scopeId, trigger.key, enabled);
    } catch (e) {
      // Revert on failure.
      this._triggers = this._triggers.map((t) =>
        t.key === trigger.key ? ({ ...t, enabled: !enabled } as AutoTrigger) : t,
      );
      this._error = (e as Error).message || String(e);
    }
  }

  private _entityName(entity_id: string): string {
    const name = this.hass?.states?.[entity_id]?.attributes?.friendly_name;
    return typeof name === "string" && name ? name : entity_id;
  }

  /** Display label for sorting an entity row (friendly name, case-insensitive). */
  private _sortLabel(t: AutoTrigger): string {
    if (t.kind === "entity") return this._entityName(t.entity_id).toLowerCase();
    return t.kind; // groups don't participate in entity sorting
  }

  /** Entity rows sorted alphabetically by display name, then group rows in
   *  backend order (time, then sun). */
  private get _sortedTriggers(): AutoTrigger[] {
    const entities = this._triggers
      .filter((t) => t.kind === "entity")
      .slice()
      .sort((a, b) => this._sortLabel(a).localeCompare(this._sortLabel(b)));
    const groups = this._triggers.filter((t) => t.kind !== "entity");
    return [...entities, ...groups];
  }

  private _sunPart(s: { anchor: string; offset: number }): string {
    const base = localize(this.hass, `anchor.${s.anchor}`, _SUN_FALLBACK[s.anchor] ?? s.anchor);
    if (s.offset === 0) return base;
    return `${base} ${s.offset > 0 ? "+" : ""}${s.offset} min`;
  }

  private _label(t: AutoTrigger): unknown {
    switch (t.kind) {
      case "entity":
        return html`<span class="label"
          >${this._entityName(t.entity_id)}<span class="eid">${t.entity_id}</span></span
        >`;
      case "time": {
        const parts = t.clocks.map(
          (c) => `${String(c.hour).padStart(2, "0")}:${String(c.minute).padStart(2, "0")}`,
        );
        if (t.has_time) {
          parts.push(localize(this.hass, "ui.auto_trigger_periodic", "periodic re-check"));
        }
        return html`<span class="label"
          ><strong>${localize(this.hass, "ui.auto_trigger_group_time", "Time")}:</strong>
          ${parts.join(", ")}</span
        >`;
      }
      case "sun": {
        const parts = t.suns.map((s) => this._sunPart(s));
        if (t.date_rollover) {
          parts.push(
            localize(this.hass, "ui.auto_trigger_date_rollover", "Local midnight (date rollover)"),
          );
        }
        return html`<span class="label"
          ><strong>${localize(this.hass, "ui.auto_trigger_group_sun", "Sun")}:</strong>
          ${parts.join(", ")}</span
        >`;
      }
    }
  }

  override render() {
    return html`
      <div class="header" data-test="auto-triggers-header" @click=${this._toggleOpen}>
        <span class="chevron ${this._open ? "open" : ""}">▶</span>
        <span>${localize(this.hass, "ui.auto_triggers_section", "Auto-triggers")}</span>
      </div>
      ${this._open ? this._renderBody() : ""}
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
            ${this._sortedTriggers.map(
              (t) => html`<li>
                <input
                  type="checkbox"
                  data-test=${`trigger-cb-${t.key}`}
                  .checked=${t.enabled}
                  @change=${(e: Event) =>
                    this._onToggle(t, (e.target as HTMLInputElement).checked)}
                />
                ${this._label(t)}
              </li>`,
            )}
          </ul>`}
    `;
  }
}
