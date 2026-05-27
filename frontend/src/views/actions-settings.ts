import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { localize } from "../i18n.js";
import {
  getServiceSchema,
  listExposedActions,
  listServices,
  saveExposedActions,
  type HassConnection,
} from "../api.js";
import type {
  ExposedAction,
  ExposedActionWarning,
  ServiceField,
  ServiceInfo,
  ServiceSchema,
} from "../types.js";

type FieldMode = "hidden" | "visible" | "locked";

type HaFormSchemaEntry = {
  name: string;
  selector?: unknown;
  required?: boolean;
};

@customElement("ambience-actions-settings")
export class AmbienceActionsSettings extends LitElement {
  static override styles = css`
    :host { display: block; }
    .card {
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 6px;
      margin-bottom: 0.5rem;
      padding: 0.5rem 0.75rem;
      background: var(--card-background-color, #fff);
    }
    .card-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .card-header button.toggle {
      background: transparent;
      border: none;
      cursor: pointer;
      font-size: 0.95rem;
      color: var(--primary-text-color, inherit);
    }
    .card-header strong {
      flex: 0 0 auto;
      font-family: var(--code-font-family, monospace);
      font-size: 0.9rem;
    }
    .card-header input[type="text"] {
      flex: 1;
      padding: 0.25rem 0.4rem;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 3px;
      background: transparent;
      color: var(--primary-text-color, inherit);
      font: inherit;
    }
    .card-header button.remove {
      background: transparent;
      border: 1px solid transparent;
      cursor: pointer;
      color: var(--secondary-text-color, #888);
      padding: 0.15rem 0.3rem;
      font-size: 0.9rem;
    }
    .card-header button.remove:hover { color: var(--error-color, #d33); }
    .body {
      margin-top: 0.5rem;
      border-top: 1px dashed var(--divider-color, #e0e0e0);
      padding-top: 0.5rem;
    }
    .field-row {
      display: grid;
      grid-template-columns: 1fr 7rem 1fr;
      gap: 0.5rem;
      align-items: center;
      padding: 0.25rem 0;
    }
    .field-row .name { color: var(--primary-text-color, inherit); }
    .field-row .name small {
      color: var(--secondary-text-color, #888);
      font-weight: normal;
    }
    .field-row input[data-locked-value] {
      width: 100%;
      box-sizing: border-box;
      padding: 0.25rem 0.4rem;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 3px;
      background: transparent;
      color: var(--primary-text-color, inherit);
      font: inherit;
    }
    .add-row {
      margin: 0.75rem 0;
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }
    .actions {
      margin-top: 0.75rem;
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }
    .warning {
      background: var(--warning-color, #ffd);
      border: 1px solid var(--warning-color, #cc9);
      padding: 0.5rem 1rem;
      border-radius: 4px;
      margin: 0.5rem 0;
      list-style-position: inside;
    }
    .error {
      color: var(--error-color, #d33);
      margin: 0.5rem 0;
    }
    select, button {
      padding: 0.3rem 0.6rem;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 3px;
      background: transparent;
      color: var(--primary-text-color, inherit);
      font: inherit;
      cursor: pointer;
    }
    button.primary {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      border-color: var(--primary-color, #03a9f4);
    }
    button.primary[disabled] { opacity: 0.6; cursor: progress; }
  `;

  @property({ attribute: false }) hass!: HassConnection;
  @state() private _actions: ExposedAction[] = [];
  @state() private _services: ServiceInfo[] = [];
  @state() private _schemas: Record<string, ServiceSchema | null> = {};
  @state() private _expanded: Set<string> = new Set();
  @state() private _adding = false;
  @state() private _warnings: ExposedActionWarning[] = [];
  @state() private _saveError: string | null = null;
  @state() private _saving = false;
  @state() private _loaded = false;

  protected override async firstUpdated() {
    await this._reload();
  }

  private async _reload() {
    try {
      const [actions, services] = await Promise.all([
        listExposedActions(this.hass),
        listServices(this.hass),
      ]);
      this._actions = actions;
      this._services = services;
    } catch (e: unknown) {
      this._saveError = e instanceof Error ? e.message : String(e);
    }
    // Fetch schemas for already-exposed services in parallel so the UI is
    // ready when the user expands a card.
    await Promise.all(this._actions.map((a) => this._ensureSchema(a.id)));
    this._loaded = true;
  }

  private async _ensureSchema(serviceId: string) {
    if (serviceId in this._schemas) return;
    try {
      const schema = await getServiceSchema(this.hass, serviceId);
      this._schemas = { ...this._schemas, [serviceId]: schema };
    } catch {
      // Service has been removed from HA since the user exposed it; mark
      // null so the card can render a "service unavailable" warning.
      this._schemas = { ...this._schemas, [serviceId]: null };
    }
  }

  private _fieldMode(action: ExposedAction, fieldName: string): FieldMode {
    if (fieldName in (action.locked_values ?? {})) return "locked";
    if ((action.visible_fields ?? []).includes(fieldName)) return "visible";
    return "hidden";
  }

  private _setFieldMode(actionId: string, fieldName: string, mode: FieldMode) {
    this._actions = this._actions.map((a) => {
      if (a.id !== actionId) return a;
      const visible = new Set(a.visible_fields ?? []);
      const locked = { ...(a.locked_values ?? {}) };
      visible.delete(fieldName);
      delete locked[fieldName];
      if (mode === "visible") visible.add(fieldName);
      if (mode === "locked") locked[fieldName] = locked[fieldName] ?? null;
      return { ...a, visible_fields: [...visible], locked_values: locked };
    });
  }

  private _setLockedValue(actionId: string, fieldName: string, value: unknown) {
    this._actions = this._actions.map((a) => {
      if (a.id !== actionId) return a;
      return {
        ...a,
        locked_values: { ...(a.locked_values ?? {}), [fieldName]: value },
      };
    });
  }

  private _setLabel(actionId: string, label: string) {
    this._actions = this._actions.map((a) => (a.id === actionId ? { ...a, label } : a));
  }

  private _toggleExpand(actionId: string) {
    const next = new Set(this._expanded);
    if (next.has(actionId)) next.delete(actionId);
    else next.add(actionId);
    this._expanded = next;
  }

  private async _addService(serviceId: string) {
    if (!serviceId) return;
    if (this._actions.some((a) => a.id === serviceId)) return;
    await this._ensureSchema(serviceId);
    this._actions = [
      ...this._actions,
      { id: serviceId, label: "", visible_fields: [], locked_values: {} },
    ];
    this._expanded = new Set([...this._expanded, serviceId]);
    this._adding = false;
  }

  private _removeService(actionId: string) {
    this._actions = this._actions.filter((a) => a.id !== actionId);
    const next = new Set(this._expanded);
    next.delete(actionId);
    this._expanded = next;
  }

  private async _save() {
    this._saving = true;
    this._saveError = null;
    try {
      const res = await saveExposedActions(this.hass, this._actions);
      this._warnings = res.warnings ?? [];
    } catch (e: unknown) {
      this._saveError = e instanceof Error ? e.message : String(e);
      this._warnings = [];
    } finally {
      this._saving = false;
    }
  }

  override render() {
    if (!this._loaded) {
      return html`<div>${localize(this.hass, "ui.loading", "Loading…")}</div>`;
    }
    return html`
      <section>
        ${this._actions.map((a) => this._renderCard(a))}
        ${this._renderAdd()}
        ${this._renderWarnings()}
        ${this._saveError ? html`<div class="error">${this._saveError}</div>` : ""}
        <div class="actions">
          <button
            class="primary"
            data-action="save"
            ?disabled=${this._saving}
            @click=${() => this._save()}
          >
            ${this._saving
              ? localize(this.hass, "ui.saving", "Saving…")
              : localize(this.hass, "ui.save", "Save")}
          </button>
        </div>
      </section>
    `;
  }

  private _renderCard(action: ExposedAction) {
    const schema = this._schemas[action.id];
    const isExpanded = this._expanded.has(action.id);
    return html`
      <div class="card" data-card data-service=${action.id}>
        <div class="card-header">
          <button class="toggle" data-toggle @click=${() => this._toggleExpand(action.id)}>
            ${isExpanded ? "▾" : "▸"}
          </button>
          <strong>${action.id}</strong>
          <input
            type="text"
            placeholder=${localize(this.hass, "ui.action_label_placeholder", "Label (optional)")}
            .value=${action.label}
            @input=${(e: Event) =>
              this._setLabel(action.id, (e.target as HTMLInputElement).value)}
          />
          <button
            class="remove"
            data-remove
            title=${localize(this.hass, "ui.remove", "Remove")}
            @click=${() => this._removeService(action.id)}
          >✖</button>
        </div>
        ${isExpanded ? this._renderBody(action, schema) : ""}
      </div>
    `;
  }

  private _renderBody(action: ExposedAction, schema: ServiceSchema | null | undefined) {
    if (schema === null) {
      return html`<div class="body warning">${localize(
        this.hass,
        "ui.service_unavailable",
        "Service not available in this HA instance.",
      )}</div>`;
    }
    if (schema === undefined) {
      return html`<div class="body">${localize(this.hass, "ui.loading", "Loading…")}</div>`;
    }
    const fields = Object.entries(schema.fields);
    if (fields.length === 0) {
      return html`<div class="body">${localize(
        this.hass,
        "ui.service_has_no_fields",
        "This service has no fields.",
      )}</div>`;
    }
    return html`
      <div class="body">
        ${fields.map(([name, field]) => this._renderFieldRow(action, name, field))}
      </div>
    `;
  }

  private _renderFieldRow(
    action: ExposedAction,
    name: string,
    field: ServiceField,
  ) {
    const mode = this._fieldMode(action, name);
    return html`
      <div class="field-row">
        <span class="name">
          ${name}${field.description ? html` <small>— ${field.description}</small>` : ""}
        </span>
        <select
          data-field-mode=${name}
          .value=${mode}
          @change=${(e: Event) =>
            this._setFieldMode(action.id, name, (e.target as HTMLSelectElement).value as FieldMode)}
        >
          <option value="hidden" ?selected=${mode === "hidden"}>${localize(this.hass, "ui.field_hidden", "Hidden")}</option>
          <option value="visible" ?selected=${mode === "visible"}>${localize(this.hass, "ui.field_visible", "Visible")}</option>
          <option value="locked" ?selected=${mode === "locked"}>${localize(this.hass, "ui.field_locked", "Locked")}</option>
        </select>
        ${mode === "locked" ? this._renderLockedValue(action, name, field) : html`<span></span>`}
      </div>
    `;
  }

  private _renderLockedValue(
    action: ExposedAction,
    fieldName: string,
    field: ServiceField,
  ) {
    const value = action.locked_values?.[fieldName];
    const schema: HaFormSchemaEntry[] = [
      {
        name: fieldName,
        selector: field.selector ?? { text: {} },
        required: false,
      },
    ];
    /* v8 ignore start -- ha-form path (real HA only) */
    if (customElements.get("ha-form")) {
      return html`<ha-form
        .hass=${this.hass}
        .schema=${schema}
        .data=${{ [fieldName]: value ?? "" }}
        .computeLabel=${() => ""}
        @value-changed=${(e: CustomEvent<{ value: Record<string, unknown> }>) => {
          e.stopPropagation();
          this._setLockedValue(action.id, fieldName, e.detail.value[fieldName]);
        }}
      ></ha-form>`;
    }
    /* v8 ignore stop */
    return html`<input
      data-locked-value=${fieldName}
      .value=${value == null ? "" : String(value)}
      @input=${(e: Event) =>
        this._setLockedValue(action.id, fieldName, (e.target as HTMLInputElement).value)}
    />`;
  }

  private _renderAdd() {
    if (!this._adding) {
      return html`<div class="add-row">
        <button data-action="add" @click=${() => { this._adding = true; }}>
          + ${localize(this.hass, "ui.add_service", "Add service")}
        </button>
      </div>`;
    }
    const exposed = new Set(this._actions.map((a) => a.id));
    const available = this._services.filter((s) => !exposed.has(s.id));
    return html`<div class="add-row">
      <select
        data-add-service
        @change=${(e: Event) => this._addService((e.target as HTMLSelectElement).value)}
      >
        <option value="">— ${localize(this.hass, "ui.pick_service", "Pick a service")} —</option>
        ${available.map(
          (s) => html`<option value=${s.id}>${s.id}${s.description ? ` — ${s.description}` : ""}</option>`,
        )}
      </select>
      <button data-action="cancel-add" @click=${() => { this._adding = false; }}>
        ${localize(this.hass, "ui.cancel", "Cancel")}
      </button>
    </div>`;
  }

  private _renderWarnings() {
    if (this._warnings.length === 0) return "";
    return html`<ul class="warning">
      ${this._warnings.map(
        (w) => html`<li>
          ${w.scope_kind}${w.scope_id ? `/${w.scope_id}` : ""}${w.rule_name ? html` — <em>${w.rule_name}</em>` : ""}: ${w.reason}
        </li>`,
      )}
    </ul>`;
  }
}
