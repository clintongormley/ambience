import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { getWeatherConfig, type HassConnection, saveWeatherConfig } from "../api.js";
import { localize, weatherConditionLabel } from "../i18n.js";
import { scopeLabel } from "../scope-label.js";
import type { WeatherConfig, WeatherGroup } from "../types.js";

const ALL_CONDITIONS = [
  "clear-night",
  "cloudy",
  "fog",
  "hail",
  "lightning",
  "lightning-rainy",
  "partlycloudy",
  "pouring",
  "rainy",
  "snowy",
  "snowy-rainy",
  "sunny",
  "windy",
  "windy-variant",
  "exceptional",
];

type Warning = { scope_kind: string; scope_id: string | null; rule_name: string; reason: string };

@customElement("ambience-weather-config")
export class AmbienceWeatherConfig extends LitElement {
  static override styles = css`
    :host { display: block; }
    .row { margin-bottom: 0.75rem; }
    label.section { display: block; font-weight: 600; margin-bottom: 0.25rem; }
    h4 { margin: 1rem 0 0.5rem 0; font-size: 0.95em; }
    .group {
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      padding: 0.5rem 0.75rem;
      margin-bottom: 0.5rem;
    }
    .group-header {
      display: flex; gap: 0.5rem; align-items: center;
      cursor: pointer; user-select: none;
    }
    .chevron {
      color: var(--secondary-text-color, #888);
      font-size: 0.7em; transition: transform 0.15s ease;
      width: 0.8em; flex: 0 0 auto;
    }
    .chevron.open { transform: rotate(90deg); }
    .group-header .label { font-weight: 500; flex: 0 0 auto; min-width: 6rem; }
    .group-header .codes {
      flex: 1; color: var(--secondary-text-color, #888); font-size: 0.9em;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .body { padding: 0.5rem 0 0.25rem 1.5rem; }
    .body input {
      width: 100%; padding: 0.25rem 0.5rem; margin-bottom: 0.4rem;
      border: 1px solid var(--divider-color, #ccc); border-radius: 4px;
      background: var(--card-background-color, #fff); color: inherit;
      box-sizing: border-box;
    }
    .conditions-list {
      display: block; color: var(--secondary-text-color, #888);
      font-size: 0.9em; padding: 0.15rem 0;
    }
    button.icon {
      background: none; border: none; padding: 0.2rem 0.4rem; cursor: pointer;
      color: var(--secondary-text-color); font-size: 1em;
      flex: 0 0 auto;
    }
    button.add {
      background: transparent; border: 1px dashed var(--divider-color, #ccc);
      padding: 0.4rem 0.75rem; border-radius: 4px; cursor: pointer;
      color: var(--primary-text-color, inherit);
    }
    .warnings {
      background: var(--warning-color, #ffd);
      border: 1px solid var(--warning-color, #cc9);
      padding: 0.5rem 1rem; border-radius: 4px; margin-top: 0.5rem;
    }
    .warnings ul { margin: 0.3rem 0 0 0; padding-left: 1.2rem; }
  `;

  @property({ attribute: false }) hass!: HassConnection;
  @state() private _config: WeatherConfig = { entity: null, groups: [] };
  @state() private _warnings: Warning[] = [];
  // Ids of currently-expanded group rows. Collapsed by default; only the
  // expanded body shows the label input + ha-form conditions selector.
  @state() private _expanded = new Set<string>();

  override async connectedCallback() {
    super.connectedCallback();
    this._config = await getWeatherConfig(this.hass);
  }

  private async _persist() {
    const res = await saveWeatherConfig(this.hass, this._config.entity, this._config.groups);
    this._warnings = res.warnings ?? [];
  }

  _onEntityChange(e: { detail: { value: string | null } }) {
    this._config = { ...this._config, entity: e.detail.value || null };
    void this._persist();
  }

  _nextGroupId(existing: WeatherGroup[]): string {
    const ids = new Set(existing.map((g) => g.id));
    for (let n = 1; n <= existing.length + 1; n++) {
      const candidate = `group_${n}`;
      if (!ids.has(candidate)) return candidate;
    }
    return `group_${existing.length + 1}`;
  }

  _addGroup() {
    const id = this._nextGroupId(this._config.groups);
    this._config = {
      ...this._config,
      groups: [...this._config.groups, { id, label: "", conditions: [] }],
    };
    // Auto-expand the new row so the user can start editing immediately.
    this._expanded = new Set([...this._expanded, id]);
    void this._persist();
  }

  _toggleExpand(id: string) {
    const next = new Set(this._expanded);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    this._expanded = next;
  }

  _updateGroup(idx: number, patch: Partial<WeatherGroup>) {
    this._config = {
      ...this._config,
      groups: this._config.groups.map((g, i) => (i === idx ? { ...g, ...patch } : g)),
    };
    void this._persist();
  }

  _removeGroup(idx: number) {
    const removed = this._config.groups[idx];
    this._config = {
      ...this._config,
      groups: this._config.groups.filter((_, i) => i !== idx),
    };
    if (removed) {
      const next = new Set(this._expanded);
      next.delete(removed.id);
      this._expanded = next;
    }
    void this._persist();
  }

  /** ha-form schema for the per-group conditions multi-selector. */
  _conditionsSchema() {
    return [
      {
        name: "conditions",
        selector: {
          select: {
            multiple: true,
            mode: "dropdown",
            options: ALL_CONDITIONS.map((c) => ({
              value: c,
              label: weatherConditionLabel(this.hass, c),
            })),
          },
        },
      },
    ];
  }

  private _renderConditions(idx: number, g: WeatherGroup) {
    /* v8 ignore start -- ha-form path (real HA only) */
    if (customElements.get("ha-form")) {
      return html`<ha-form
        .hass=${this.hass as any}
        .schema=${this._conditionsSchema()}
        .data=${{ conditions: g.conditions }}
        .computeLabel=${() => ""}
        @value-changed=${(e: CustomEvent<{ value: { conditions?: string[] } }>) => {
          e.stopPropagation();
          this._updateGroup(idx, { conditions: e.detail.value.conditions ?? [] });
        }}
      ></ha-form>`;
    }
    /* v8 ignore stop */
    // Native fallback (jsdom / old HA): just list the selected codes.
    const labels = g.conditions.map((c) => weatherConditionLabel(this.hass, c));
    return html`<span class="conditions-list">${labels.join(", ")}</span>`;
  }

  private _renderGroup(idx: number, g: WeatherGroup) {
    const expanded = this._expanded.has(g.id);
    const codeLabels = g.conditions.map((c) => weatherConditionLabel(this.hass, c)).join(", ");
    return html`
      <div class="group">
        <div class="group-header" @click=${() => this._toggleExpand(g.id)}>
          <span class="chevron ${expanded ? "open" : ""}">▶</span>
          <span class="label">${g.label}</span>
          <span class="codes">${codeLabels}</span>
          <button
            class="icon"
            title=${localize(this.hass, "ui.title_delete", "Delete")}
            @click=${(e: Event) => {
              e.stopPropagation();
              this._removeGroup(idx);
            }}
          >✕</button>
        </div>
        ${
          expanded
            ? html`<div class="body" @click=${(e: Event) => e.stopPropagation()}>
              <input
                .value=${g.label}
                aria-label=${g.label}
                @change=${(e: Event) => this._updateGroup(idx, { label: (e.target as HTMLInputElement).value })}
              />
              ${this._renderConditions(idx, g)}
            </div>`
            : ""
        }
      </div>
    `;
  }

  override render() {
    const schema = [{ name: "entity", selector: { entity: { domain: "weather" } } }];
    return html`
      <div class="row">
        <label class="section">${localize(this.hass, "ui.weather_entity", "Weather entity")}</label>
        <ha-form
          .hass=${this.hass as any}
          .schema=${schema}
          .data=${{ entity: this._config.entity ?? "" }}
          .computeLabel=${() => ""}
          @value-changed=${(e: CustomEvent) => {
            e.stopPropagation();
            this._onEntityChange({ detail: { value: (e.detail.value?.entity as string) || null } });
          }}
        ></ha-form>
      </div>

      <h4>${localize(this.hass, "ui.groups", "Groups")}</h4>
      ${this._config.groups.map((g, i) => this._renderGroup(i, g))}
      <button class="add" @click=${() => this._addGroup()}>
        ${localize(this.hass, "ui.add_group", "+ Add group")}
      </button>

      ${
        this._warnings.length
          ? html`
        <div class="warnings">
          <strong>${localize(this.hass, "ui.day_warning_prefix", "Warning:")}</strong>
          ${localize(this.hass, "ui.weather_warning_text", "rules now reference an unconfigured weather entity:")}
          <ul>${this._warnings.map((w) => html`<li>${scopeLabel(w)} / "${w.rule_name}" → ${w.reason}</li>`)}</ul>
        </div>
      `
          : ""
      }
    `;
  }
}
