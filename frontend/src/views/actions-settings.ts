import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { localize } from "../i18n.js";
import { parseReapplyConfigSeconds } from "../reapply.js";
import {
  getServiceSchema,
  listExposedActions,
  listServices,
  saveExposedActions,
  type HassConnection,
} from "../api.js";
import { selectorUnit } from "../summary.js";
import type {
  ExposedAction,
  ExposedActionWarning,
  ServiceField,
  ServiceInfo,
  ServiceSchema,
} from "../types.js";

type HaFormSchemaEntry = {
  name: string;
  selector?: unknown;
  required?: boolean;
};

/**
 * Derive a human-friendly label from a service id, e.g.
 * `light.turn_on` → "Turn on light".
 *
 * The humanized service name is suffixed with the domain word(s), unless the
 * service already mentions every domain word (`cover.open_cover` → "Open cover",
 * not "Open cover cover"). The first letter is capitalized.
 */
export function deriveActionLabel(serviceId: string): string {
  const dotIdx = serviceId.indexOf(".");
  const domain = dotIdx === -1 ? "" : serviceId.slice(0, dotIdx);
  const service = dotIdx === -1 ? serviceId : serviceId.slice(dotIdx + 1);
  const serviceWords = service.replaceAll("_", " ").trim().toLowerCase();
  const domainWords = domain.replaceAll("_", " ").trim().toLowerCase();

  const serviceTokens = serviceWords ? serviceWords.split(" ") : [];
  const domainTokens = domainWords ? domainWords.split(" ") : [];
  const mentionsDomain =
    domainTokens.length > 0 && domainTokens.every((t) => serviceTokens.includes(t));

  const result =
    !domainWords || mentionsDomain ? serviceWords : `${serviceWords} ${domainWords}`;
  return result.charAt(0).toUpperCase() + result.slice(1);
}

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
    .card.drag-over {
      border-color: var(--primary-color, #03a9f4);
    }
    .card.dragging {
      opacity: 0.4;
    }
    .card-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }
    .drag-handle {
      flex: 0 0 auto;
      cursor: grab;
      color: var(--secondary-text-color, #888);
      user-select: none;
      font-size: 1rem;
      line-height: 1;
    }
    .drag-handle:active {
      cursor: grabbing;
    }
    .card-header:hover .drag-handle {
      color: var(--primary-text-color, inherit);
    }
    .card-header:hover .toggle-arrow {
      color: var(--primary-color, #03a9f4);
    }
    .toggle-arrow {
      flex: 0 0 auto;
      font-size: 0.95rem;
      color: var(--primary-text-color, inherit);
      user-select: none;
    }
    .card-header strong {
      flex: 0 0 auto;
      font-family: var(--code-font-family, monospace);
      font-size: 0.9rem;
    }
    /* Standalone service id (no label set): fill the row so the ✕ button
       gets pushed to the far right, matching the labelled-card layout. */
    .card-header strong.standalone {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    /* Collapsed: label (primary) + "(service.id)" (secondary, monospace) */
    .header-label-display {
      flex: 0 0 auto;
      font-weight: 600;
      color: var(--primary-text-color, inherit);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .header-service-id {
      flex: 1;
      font-family: var(--code-font-family, monospace);
      font-size: 0.85rem;
      color: var(--secondary-text-color, #888);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    /* ha-input for the label when expanded */
    .header-label-input {
      flex: 1;
      /* Prevent click-on-input from propagating to the header toggle */
    }
    .card-header button.remove {
      flex: 0 0 auto;
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
      /* Indent so field names align under the service id in the header.
         Arrow glyph (≈1ch) + gap (0.5rem) ≈ 1.5rem total. */
      padding-left: 1.5rem;
    }
    .body-help {
      font-size: 0.85rem;
      color: var(--secondary-text-color, #888);
      margin: 0 0 0.5rem 0;
    }
    /* Two-row field layout */
    .field-row {
      padding: 0.35rem 0;
      border-bottom: 1px dotted var(--divider-color, #eee);
    }
    .field-row:last-child { border-bottom: none; }
    .field-row-main {
      display: grid;
      grid-template-columns: min-content 1fr auto;
      gap: 0.5rem;
      align-items: center;
    }
    .field-row-main .checkbox-cell {
      display: flex;
      align-items: center;
    }
    .field-row-main .name {
      color: var(--primary-text-color, inherit);
    }
    .field-row-main .name small {
      color: var(--secondary-text-color, #888);
      font-weight: normal;
    }
    .field-row-main .summary-cell {
      justify-self: start;
    }
    /* The collapsed-summary pill / set-default button */
    .set-default-btn {
      background: transparent;
      border: 1px dashed var(--divider-color, #ccc);
      color: var(--secondary-text-color, #888);
      cursor: pointer;
      padding: 0.2rem 0.5rem;
      border-radius: 3px;
      font: inherit;
      font-size: 0.85rem;
    }
    button.default-summary {
      background: var(--secondary-background-color, #f5f5f5);
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 3px;
      color: var(--primary-text-color, inherit);
      cursor: pointer;
      font: inherit;
      font-size: 0.85rem;
      padding: 0.2rem 0.5rem;
      white-space: nowrap;
    }
    button.default-summary:hover {
      border-color: var(--primary-color, #03a9f4);
      color: var(--primary-color, #03a9f4);
    }
    /* Row 2: the full editor — thin bordered box, no filled background */
    .field-row-editor {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: transparent;
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 4px;
      margin: 0.5rem 0;
    }
    .field-row-editor .editor-line {
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }
    .field-row-editor .editor-line .default-editor {
      flex: 1;
    }
    .field-row-editor .editor-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.4rem;
    }
    .field-row-editor button.clear-default {
      background: transparent;
      border: none;
      cursor: pointer;
      color: var(--secondary-text-color, #888);
      font-size: 1rem;
      padding: 0 0.25rem;
      line-height: 1;
      flex: 0 0 auto;
    }
    .field-row-editor button.clear-default:hover {
      color: var(--error-color, #c62828);
    }
    .field-row-editor button.save-default {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      border-color: var(--primary-color, #03a9f4);
      padding: 0.2rem 0.5rem;
      font-size: 0.85rem;
      flex: 0 0 auto;
    }
    .field-row-editor button.cancel-default {
      background: transparent;
      border: none;
      cursor: pointer;
      color: var(--secondary-text-color, #888);
      padding: 0.2rem 0.3rem;
      font-size: 0.85rem;
      flex: 0 0 auto;
      text-decoration: underline;
    }
    .field-row-editor button.cancel-default:hover {
      color: var(--primary-text-color, inherit);
    }
    .summary-cell-editing {
      color: var(--secondary-text-color, #888);
      font-size: 0.85rem;
      font-style: italic;
    }
    .field-row input[data-default-value] {
      width: 100%;
      box-sizing: border-box;
      padding: 0.25rem 0.4rem;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 3px;
      background: transparent;
      color: var(--primary-text-color, inherit);
      font: inherit;
    }
    .reapply-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.35rem 0;
      margin-top: 0.25rem;
      border-top: 1px dotted var(--divider-color, #eee);
      font-size: 0.9rem;
      /* Reserve the height of the seconds input so the row doesn't grow when
         the field appears/disappears as the checkbox is toggled. */
      min-height: 2rem;
    }
    .reapply-row label {
      color: var(--primary-text-color, inherit);
      flex: 0 0 auto;
    }
    .reapply-row input[data-reapply-input] {
      width: 5rem;
      box-sizing: border-box;
      padding: 0.25rem 0.4rem;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 3px;
      background: transparent;
      color: var(--primary-text-color, inherit);
      font: inherit;
    }
    .reapply-row .reapply-unit {
      color: var(--secondary-text-color, #888);
      flex: 0 0 auto;
    }
    .add-row {
      margin: 0.75rem 0;
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }
    /* Let the HA-native picker (ha-service-picker / ha-form) fill the row so
       its dropdown aligns under a full-width field rather than a narrow one. */
    .add-row .add-picker {
      flex: 1;
      min-width: 0;
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
    /* Primary "Add action" button — filled blue, matching the rules list. */
    button.add {
      background: var(--primary-color, #03a9f4);
      border-color: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      padding: 0.5rem 1rem;
      border-radius: 4px;
    }
  `;

  @property({ attribute: false }) hass!: HassConnection;
  @state() private _actions: ExposedAction[] = [];
  @state() private _services: ServiceInfo[] = [];
  @state() private _schemas: Record<string, ServiceSchema | null> = {};
  @state() private _fieldSchemas: Record<string, HaFormSchemaEntry[]> = {};
  /** Memoised ha-form schema for the "add service" autocomplete. */
  @state() private _addSchema: unknown[] = [];
  /** _services indexed by id, for O(1) label lookups. */
  private _serviceById: Map<string, ServiceInfo> = new Map();
  /** Services not yet exposed — the add-picker's candidates. */
  private _availableServices: ServiceInfo[] = [];
  @state() private _expanded: Set<string> = new Set();
  @state() private _adding = false;
  @state() private _warnings: ExposedActionWarning[] = [];
  @state() private _loadError: string | null = null;
  @state() private _saveError: string | null = null;
  @state() private _loaded = false;
  /** Key: "${actionId}:${fieldName}" of the field currently being edited. */
  @state() private _editingDefault: string | null = null;
  /** Value the field had before entering edit mode (for Cancel). */
  @state() private _editingOriginalValue: unknown = undefined;
  /** Whether the field had a default before entering edit mode. */
  @state() private _editingOriginalHad = false;
  /** Index of the card currently being dragged, or null. */
  @state() private _dragFrom: number | null = null;
  /** Index of the card currently being dragged over, or null. */
  @state() private _dragOver: number | null = null;

  // HA pickers (ha-service-picker / ha-form combobox) render their dropdown in
  // a document-level overlay outside our shadow tree. Clicks there must not be
  // treated as "click away".
  private static readonly _OVERLAY_TAG_RE = /vaadin|combo-box|overlay|listbox|menu|mwc-|md-/i;

  private _onDocPointerDown = (e: PointerEvent) => {
    const path = e.composedPath();
    this._collapseAddFormOnClickAway(path);
    this._cancelEditingDefaultOnClickAway(path);
  };

  /** Collapse the open "add action" form when clicking outside it — but not
   *  inside the picker's document-level overlay dropdown. */
  private _collapseAddFormOnClickAway(path: EventTarget[]) {
    if (!this._adding) return;
    const addRow = this.shadowRoot?.querySelector(".add-row");
    const insideAddRow = !!addRow && path.includes(addRow);
    const inOverlay = path.some(
      (n) =>
        n instanceof Element &&
        AmbienceActionsSettings._OVERLAY_TAG_RE.test(n.localName),
    );
    if (!insideAddRow && !inOverlay) {
      this._adding = false;
    }
  }

  /** Cancel the open default-value editor when clicking outside its row. */
  private _cancelEditingDefaultOnClickAway(path: EventTarget[]) {
    if (this._editingDefault === null) return;
    const editorRow = this.shadowRoot?.querySelector(
      `.field-row-editor[data-editing-key="${this._editingDefault}"]`,
    );
    if (!editorRow || !path.includes(editorRow as EventTarget)) {
      this._cancelEditingDefault();
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener("pointerdown", this._onDocPointerDown);
    // If HA registers its rich service picker lazily, re-render to pick it up.
    /* v8 ignore next 3 -- real-HA registry timing, not jsdom */
    if (!customElements.get("ha-service-picker")) {
      void customElements.whenDefined("ha-service-picker").then(() => this.requestUpdate());
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("pointerdown", this._onDocPointerDown);
  }

  private _startEditingDefault(actionId: string, fieldName: string) {
    const action = this._actions.find((a) => a.id === actionId);
    const defaults = action?.defaults ?? {};
    this._editingOriginalHad = fieldName in defaults;
    this._editingOriginalValue = defaults[fieldName];
    this._editingDefault = `${actionId}:${fieldName}`;
  }

  private _saveEditingDefault() {
    // Live mutations already applied to _actions; just exit edit mode.
    this._editingDefault = null;
    this._editingOriginalValue = undefined;
    this._editingOriginalHad = false;
    void this._autoSave();
  }

  private _cancelEditingDefault() {
    const key = this._editingDefault;
    if (key) {
      const colonIdx = key.indexOf(":");
      const actionId = key.slice(0, colonIdx);
      const fieldName = key.slice(colonIdx + 1);
      this._actions = this._actions.map((a) => {
        if (a.id !== actionId) return a;
        const defaults = { ...(a.defaults ?? {}) };
        if (this._editingOriginalHad) {
          defaults[fieldName] = this._editingOriginalValue;
        } else {
          delete defaults[fieldName];
        }
        return { ...a, defaults };
      });
    }
    this._editingDefault = null;
    this._editingOriginalValue = undefined;
    this._editingOriginalHad = false;
  }

  protected override async firstUpdated() {
    await this._reload();
  }

  protected override willUpdate(changed: Map<string, unknown>) {
    if (changed.has("_actions") || changed.has("_schemas")) {
      const next: Record<string, HaFormSchemaEntry[]> = {};
      for (const action of this._actions) {
        const schema = this._schemas[action.id];
        if (!schema) continue;
        for (const [fieldName, field] of Object.entries(schema.fields)) {
          next[`${action.id}:${fieldName}`] = [
            {
              name: fieldName,
              selector: field.selector ?? { text: {} },
              required: false,
            },
          ];
        }
      }
      this._fieldSchemas = next;
    }
    if (changed.has("_services")) {
      this._serviceById = new Map(this._services.map((s) => [s.id, s]));
    }
    // Memoise the add-picker candidates + schema so ha-form doesn't reinitialise
    // the dropdown on every parent re-render. Only depends on which services are
    // still available to add (all services minus already-exposed ones).
    if (changed.has("_actions") || changed.has("_services")) {
      const exposed = new Set(this._actions.map((a) => a.id));
      this._availableServices = this._services.filter((s) => !exposed.has(s.id));
      this._addSchema = [
        {
          name: "service",
          selector: {
            select: {
              options: this._availableServices.map((s) => ({
                value: s.id,
                label: this._addOptionLabel(s.id),
              })),
              // custom_value lets ha-form render a *searchable* combobox
              // (filter-as-you-type) rather than a plain dropdown menu. We
              // still only accept real service ids — see _addService's guard.
              custom_value: true,
              mode: "dropdown",
              sort: true,
            },
          },
        },
      ];
    }
  }

  private async _reload() {
    this._loadError = null;
    try {
      const [actions, services] = await Promise.all([
        listExposedActions(this.hass),
        listServices(this.hass),
      ]);
      this._actions = actions;
      this._services = services;
    } catch (e: unknown) {
      this._loadError = e instanceof Error ? e.message : String(e);
      return; // do NOT mark as loaded
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

  // --- per-field state mutators -------------------------------------------

  private _setShowInEditor(actionId: string, fieldName: string, checked: boolean) {
    this._actions = this._actions.map((a) => {
      if (a.id !== actionId) return a;
      const visible = new Set(a.visible_fields ?? []);
      if (checked) visible.add(fieldName);
      else visible.delete(fieldName);
      return { ...a, visible_fields: [...visible] };
    });
    void this._autoSave();
  }

  private _setDefault(actionId: string, fieldName: string, value: unknown) {
    this._actions = this._actions.map((a) => {
      if (a.id !== actionId) return a;
      return {
        ...a,
        defaults: { ...(a.defaults ?? {}), [fieldName]: value },
      };
    });
  }

  private _clearDefault(actionId: string, fieldName: string) {
    this._actions = this._actions.map((a) => {
      if (a.id !== actionId) return a;
      const defaults = { ...(a.defaults ?? {}) };
      delete defaults[fieldName];
      return { ...a, defaults };
    });
  }

  private _setLabel(actionId: string, label: string) {
    this._actions = this._actions.map((a) => (a.id === actionId ? { ...a, label } : a));
  }

  private _setReapplyEnabled(actionId: string, enabled: boolean) {
    this._actions = this._actions.map((a) => {
      if (a.id !== actionId) return a;
      if (!enabled) {
        // Uncheck → remove the key entirely.
        const { reapply_seconds: _removed, ...rest } = a;
        return rest as typeof a;
      }
      // Check → seed 300s default if not already enabled.
      const current = a.reapply_seconds ?? 0;
      return { ...a, reapply_seconds: current > 0 ? current : 300 };
    });
    void this._autoSave();
  }

  private _setReapplySeconds(actionId: string, rawValue: string) {
    const seconds = parseReapplyConfigSeconds(rawValue);
    // null means empty/invalid — leave the stored value unchanged (don't
    // drop the enabled state; the checkbox owns enable/disable).
    if (seconds === null) return;
    this._actions = this._actions.map((a) => {
      if (a.id !== actionId) return a;
      return { ...a, reapply_seconds: seconds };
    });
    void this._autoSave();
  }

  private _toggleExpand(actionId: string) {
    const next = new Set(this._expanded);
    if (next.has(actionId)) {
      next.delete(actionId);
    } else {
      next.add(actionId);
      void this._ensureSchema(actionId);
    }
    this._expanded = next;
  }

  private async _addService(serviceId: string) {
    if (!serviceId) return;
    // The searchable combobox can emit partial free text — only accept a real,
    // known service id.
    if (!this._services.some((s) => s.id === serviceId)) return;
    if (this._actions.some((a) => a.id === serviceId)) return;
    await this._ensureSchema(serviceId);
    this._actions = [
      ...this._actions,
      { id: serviceId, label: this._labelForService(serviceId), visible_fields: [], defaults: {} },
    ];
    this._expanded = new Set([...this._expanded, serviceId]);
    this._adding = false;
    void this._autoSave();
  }

  // --- drag-to-reorder ----------------------------------------------------

  private _onDragStart(e: DragEvent, i: number) {
    this._dragFrom = i;
    // The handle glyph is tiny, so the browser's default drag image would be
    // just the ⠿ character. Use the whole card as the drag image instead so
    // the user sees the card they're moving.
    const handle = e.currentTarget as HTMLElement;
    const card = handle.closest(".card") as HTMLElement | null;
    if (card && e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setDragImage(card, 16, 16);
    }
  }

  private _onDragOver(e: DragEvent, i: number) {
    if (this._dragFrom === null || i === this._dragFrom) return;
    e.preventDefault(); // allow drop
    this._dragOver = i;
  }

  private _onDrop(to: number) {
    const from = this._dragFrom;
    this._dragFrom = null;
    this._dragOver = null;
    if (from === null || from === to) return;
    const actions = [...this._actions];
    const [moved] = actions.splice(from, 1);
    actions.splice(to, 0, moved);
    this._actions = actions;
    void this._autoSave();
  }

  private _onDragEnd() {
    this._dragFrom = null;
    this._dragOver = null;
  }

  private _removeService(actionId: string) {
    this._actions = this._actions.filter((a) => a.id !== actionId);
    const next = new Set(this._expanded);
    next.delete(actionId);
    this._expanded = next;
    void this._autoSave();
  }

  private async _autoSave(): Promise<void> {
    this._saveError = null;
    this._warnings = [];
    try {
      const res = await saveExposedActions(this.hass, this._actions);
      this._warnings = res.warnings ?? [];
      window.dispatchEvent(new CustomEvent("ambience-exposed-actions-changed"));
    } catch (e: unknown) {
      this._saveError = e instanceof Error ? e.message : String(e);
    }
  }

  override render() {
    if (this._loadError !== null) {
      return html`
        <div class="error">${this._loadError}</div>
        <button @click=${() => this._reload()}>${localize(this.hass, "ui.retry", "Retry")}</button>
      `;
    }
    if (!this._loaded) {
      return html`<div>${localize(this.hass, "ui.loading", "Loading…")}</div>`;
    }
    return html`
      <section>
        ${this._renderWarnings()}
        ${this._saveError ? html`<div class="error">${this._saveError}</div>` : ""}
        ${this._actions.map((a, i) => this._renderCard(a, i))}
        ${this._renderAdd()}
      </section>
    `;
  }

  private _renderCard(action: ExposedAction, index: number) {
    const schema = this._schemas[action.id];
    const isExpanded = this._expanded.has(action.id);

    return html`
      <div
        class="card ${this._dragOver === index ? "drag-over" : ""} ${this._dragFrom === index ? "dragging" : ""}"
        data-card
        data-service=${action.id}
        @dragover=${(e: DragEvent) => this._onDragOver(e, index)}
        @drop=${() => this._onDrop(index)}
        @dragend=${() => this._onDragEnd()}
      >
        <div
          class="card-header"
          data-toggle
          @click=${(e: Event) => {
            // Don't toggle if the click came from the label input or remove button.
            const target = e.target as HTMLElement;
            if (target.closest("ha-input, input, button.remove, .drag-handle")) return;
            this._toggleExpand(action.id);
          }}
        >
          <span
            class="drag-handle"
            data-drag-handle
            draggable="true"
            title=${localize(this.hass, "ui.drag_to_reorder", "Drag to reorder")}
            @dragstart=${(e: DragEvent) => this._onDragStart(e, index)}
            @click=${(e: Event) => e.stopPropagation()}
          >⠿</span>
          <span class="toggle-arrow">${isExpanded ? "▾" : "▸"}</span>
          ${isExpanded
            ? html`
                <strong>${action.id}</strong>
                <ha-input
                  class="header-label-input"
                  data-label-input
                  placeholder=${localize(this.hass, "ui.action_label_placeholder", "Label (optional)")}
                  .value=${action.label}
                  @input=${(e: Event) => {
                    e.stopPropagation();
                    this._setLabel(action.id, (e.target as HTMLInputElement).value);
                  }}
                  @blur=${() => void this._autoSave()}
                  @click=${(e: Event) => e.stopPropagation()}
                ></ha-input>
              `
            : action.label
              ? html`
                  <span class="header-label-display">${action.label}</span>
                  <span class="header-service-id">(${action.id})</span>
                `
              : html`<strong class="standalone">${action.id}</strong>`}
          <button
            class="remove"
            data-remove
            title=${localize(this.hass, "ui.remove", "Remove")}
            @click=${(e: Event) => {
              e.stopPropagation();
              this._removeService(action.id);
            }}
          >✖</button>
        </div>
        ${isExpanded ? this._renderBody(action, schema) : ""}
      </div>
    `;
  }

  private _renderBody(action: ExposedAction, schema: ServiceSchema | null | undefined) {
    // The re-apply row is a property of the action itself — it does not depend
    // on the service's fields (you can't infer what an action does from its
    // schema). So it renders for EVERY expanded action, independent of whether
    // the field schema is loading, unavailable, or field-less. The
    // schema-dependent field section handles its own states above it.
    return html`
      <div class="body">
        ${this._renderFieldsSection(action, schema)}
        ${this._renderReapplyRow(action)}
      </div>
    `;
  }

  private _renderFieldsSection(
    action: ExposedAction,
    schema: ServiceSchema | null | undefined,
  ) {
    if (schema === null) {
      return html`<p class="body-help warning">
        ${localize(this.hass, "ui.service_unavailable", "Service not available in this HA instance.")}
      </p>`;
    }
    if (schema === undefined) {
      return html`<p class="body-help">${localize(this.hass, "ui.loading", "Loading…")}</p>`;
    }
    // Sort fields alphabetically by field id (stable, predictable for users
    // scanning a long service like light.turn_on).
    const fields = Object.entries(schema.fields).slice().sort(([a], [b]) =>
      a.localeCompare(b),
    );
    if (fields.length === 0) {
      return html`<p class="body-help">
        ${localize(this.hass, "ui.service_has_no_fields", "This service has no fields.")}
      </p>`;
    }
    return html`
      <p class="body-help">
        ${localize(
          this.hass,
          "ui.actions_field_help",
          "Tick a checkbox to make a field editable per rule. Set a default to pre-fill it.",
        )}
      </p>
      ${fields.map(([name, field]) => this._renderFieldRow(action, name, field))}
    `;
  }

  private _humanizeFieldId(fieldName: string): string {
    const spaced = fieldName.replaceAll("_", " ").toLowerCase();
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
  }

  private _formatDefaultSummary(value: unknown): string {
    if (value === null || value === undefined) return "";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  }

  /** " seconds" / " %" / "" — read the schema's unit_of_measurement for the
   *  field's selector so the default-summary pill shows "Default: 3 seconds"
   *  rather than just "Default: 3". */
  private _defaultUnitSuffix(serviceId: string, fieldName: string): string {
    const field = this._schemas[serviceId]?.fields?.[fieldName];
    if (!field || typeof field !== "object") return "";
    const unit = selectorUnit((field as { selector?: unknown }).selector);
    return unit ? ` ${unit}` : "";
  }

  private _renderFieldRow(
    action: ExposedAction,
    name: string,
    field: ServiceField,
  ) {
    const shown = (action.visible_fields ?? []).includes(name);
    const hasDefault = name in (action.defaults ?? {});
    const editKey = `${action.id}:${name}`;
    const isEditing = this._editingDefault === editKey;

    return html`
      <div class="field-row">
        <!-- Row 1: [checkbox] [name] [default summary] -->
        <div class="field-row-main">
          <div class="checkbox-cell">
            <input
              type="checkbox"
              data-show-in-editor=${name}
              title="Show in rule editor"
              .checked=${shown}
              @change=${(e: Event) =>
                this._setShowInEditor(
                  action.id,
                  name,
                  (e.target as HTMLInputElement).checked,
                )}
            />
          </div>
          <span class="name">
            ${field.name || this._humanizeFieldId(name)}
            ${field.name ? html` <small class="field-id">(${name})</small>` : ""}
            ${field.description ? html` <small>— ${field.description}</small>` : ""}
          </span>
          <div class="summary-cell">
            ${isEditing
              ? html`<span class="summary-cell-editing">Editing…</span>`
              : hasDefault
                ? html`<button
                    class="default-summary"
                    data-default-summary=${name}
                    @click=${(e: Event) => {
                      e.stopPropagation();
                      this._startEditingDefault(action.id, name);
                    }}
                  >Default: ${this._formatDefaultSummary((action.defaults ?? {})[name])}${this._defaultUnitSuffix(action.id, name)}</button>`
                : html`<button
                    class="set-default-btn"
                    data-set-default=${name}
                    @click=${(e: Event) => {
                      e.stopPropagation();
                      this._startEditingDefault(action.id, name);
                    }}
                  >+ ${localize(this.hass, "ui.set_default", "Set default")}</button>`}
          </div>
        </div>
        <!-- Row 2: full editor (only when editing) -->
        ${isEditing
          ? html`<div
              class="field-row-editor"
              data-editing-key=${editKey}
            >
              <div class="editor-line">
                <div class="default-editor">${this._renderDefaultEditor(action, name, field)}</div>
                <button
                  class="clear-default"
                  data-clear-default=${name}
                  title=${localize(this.hass, "ui.clear_default", "Clear default")}
                  @click=${(e: Event) => {
                    e.stopPropagation();
                    this._clearDefault(action.id, name);
                    this._saveEditingDefault();
                  }}
                >✕</button>
              </div>
              <div class="editor-actions">
                <button
                  class="cancel-default"
                  data-cancel-default=${name}
                  @click=${(e: Event) => {
                    e.stopPropagation();
                    this._cancelEditingDefault();
                  }}
                >${localize(this.hass, "ui.cancel", "Cancel")}</button>
                <button
                  class="save-default"
                  data-save-default=${name}
                  @click=${(e: Event) => {
                    e.stopPropagation();
                    this._saveEditingDefault();
                  }}
                >${localize(this.hass, "ui.save", "Save")}</button>
              </div>
            </div>`
          : ""}
      </div>
    `;
  }

  private _renderDefaultEditor(
    action: ExposedAction,
    fieldName: string,
    _field: ServiceField,
  ) {
    const value = action.defaults?.[fieldName];
    const schema = this._fieldSchemas[`${action.id}:${fieldName}`] ?? [];
    /* v8 ignore start -- ha-form path (real HA only) */
    if (customElements.get("ha-form")) {
      return html`<ha-form
        .hass=${this.hass}
        .schema=${schema}
        .data=${{ [fieldName]: value ?? "" }}
        .computeLabel=${() => ""}
        @value-changed=${(e: CustomEvent<{ value: Record<string, unknown> }>) => {
          e.stopPropagation();
          this._setDefault(action.id, fieldName, e.detail.value[fieldName]);
        }}
      ></ha-form>`;
    }
    /* v8 ignore stop */
    return html`<input
      data-default-value=${fieldName}
      .value=${value == null ? "" : String(value)}
      @input=${(e: Event) =>
        this._setDefault(action.id, fieldName, (e.target as HTMLInputElement).value)}
    />`;
  }

  private _renderReapplyRow(action: ExposedAction) {
    const enabled = typeof action.reapply_seconds === "number" && action.reapply_seconds > 0;
    const currentSeconds = enabled ? String(action.reapply_seconds) : "";
    return html`
      <div class="reapply-row">
        <input
          id="reapply-enable-${action.id}"
          type="checkbox"
          data-reapply-enable
          .checked=${enabled}
          @change=${(e: Event) => {
            this._setReapplyEnabled(action.id, (e.target as HTMLInputElement).checked);
          }}
        />
        <label for="reapply-enable-${action.id}">
          ${localize(this.hass, "ui.reapply_enable_label", "Re-apply periodically")}
        </label>
        ${enabled ? html`
          <input
            id="reapply-${action.id}"
            type="number"
            min="10"
            data-reapply-input
            aria-label=${localize(this.hass, "ui.reapply_seconds_label", "Re-apply every (seconds)")}
            .value=${currentSeconds}
            @input=${(e: Event) => {
              this._setReapplySeconds(action.id, (e.target as HTMLInputElement).value);
            }}
          />
          <span class="reapply-unit">
            ${localize(this.hass, "ui.reapply_seconds_unit", "s")}
          </span>
        ` : ""}
      </div>
    `;
  }

  private _renderAdd() {
    if (!this._adding) {
      return html`<div class="add-row">
        <button class="add" data-action="add" @click=${() => { this._adding = true; }}>
          + ${localize(this.hass, "ui.add_action_button", "Add action")}
        </button>
      </div>`;
    }
    return html`<div class="add-row">
      ${this._renderAddPicker()}
      <button data-action="cancel-add" @click=${() => { this._adding = false; }}>
        ${localize(this.hass, "ui.cancel", "Cancel")}
      </button>
    </div>`;
  }

  /**
   * Human label for a service: HA's predefined `name` when available, else a
   * label derived from the id. ("Turn off light", "Arm away", …)
   */
  private _labelForService(serviceId: string): string {
    const name = this._serviceById.get(serviceId)?.name?.trim();
    return name || deriveActionLabel(serviceId);
  }

  /** Friendly label + service id, e.g. "Turn off light (light.turn_off)". */
  private _addOptionLabel(serviceId: string): string {
    return `${this._labelForService(serviceId)} (${serviceId})`;
  }

  private _renderAddPicker() {
    /* v8 ignore start -- HA-native picker paths (real HA only, not jsdom) */
    // Best: HA's own service picker (the Developer Tools → Actions widget) —
    // searchable, with icon + predefined name + description + domain per row.
    // Only available when HA has registered it in this panel's scope.
    if (customElements.get("ha-service-picker")) {
      return html`<ha-service-picker
        class="add-picker"
        data-add-service-picker
        .hass=${this.hass}
        @value-changed=${(e: CustomEvent<{ value?: string }>) => {
          e.stopPropagation();
          const id = e.detail.value;
          if (id) void this._addService(id);
        }}
      ></ha-service-picker>`;
    }
    // Next best: a searchable ha-form combobox. ha-form lazy-loads the combobox
    // widget internally, so this works without the removed loadCardHelpers.
    if (customElements.get("ha-form")) {
      return html`<ha-form
        class="add-picker"
        data-add-service-form
        .hass=${this.hass}
        .schema=${this._addSchema}
        .data=${{ service: "" }}
        .computeLabel=${() => localize(this.hass, "ui.pick_service", "Pick a service")}
        @value-changed=${(e: CustomEvent<{ value: { service?: string } }>) => {
          e.stopPropagation();
          const id = e.detail.value.service;
          if (id) void this._addService(id);
        }}
      ></ha-form>`;
    }
    /* v8 ignore stop */
    return html`<select
      data-add-service
      @change=${(e: Event) => this._addService((e.target as HTMLSelectElement).value)}
    >
      <option value="">— ${localize(this.hass, "ui.pick_service", "Pick a service")} —</option>
      ${this._availableServices.map(
        (s) => html`<option value=${s.id}>${this._addOptionLabel(s.id)}</option>`,
      )}
    </select>`;
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
