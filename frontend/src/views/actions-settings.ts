import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { isComponentLoaded } from "../ha-config.js";
import { deriveActionLabel, humanizeId, localize, localizeWsError } from "../i18n.js";
import { getFadoNoticeDismissed, setFadoNoticeDismissed } from "../ui-state.js";
import { bannerStyles } from "./banner-styles.js";
import "./banner.js";
import "./ambience-help.js";

// Re-exported from i18n.js (its home is the side-effect-free label module) so
// existing importers of this view keep working.
export { deriveActionLabel };

import {
  getInstallId,
  getServiceSchema,
  type HassConnection,
  listExposedActions,
  listServices,
  saveExposedActions,
} from "../api.js";
import { DragReorderController } from "../drag-reorder.js";
import type { HaFormSchemaEntry } from "../ha-form.js";
import { selectorUnit } from "../summary.js";
import type { ExposedAction, ServiceField, ServiceInfo, ServiceSchema } from "../types.js";

// The Fado Light Fader integration: its HA domain (present in
// `hass.config.components` once set up) and the My-Home-Assistant deep link
// that opens its repository in the user's HACS for one-click install.
const FADO_DOMAIN = "fado";
const FADO_HACS_URL =
  "https://my.home-assistant.io/redirect/hacs_repository/?owner=clintongormley&repository=ha-fado";

@customElement("ambience-actions-settings")
export class AmbienceActionsSettings extends LitElement {
  static override styles = [
    bannerStyles,
    css`
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
      opacity: 0.8;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
      position: relative;
      z-index: 1000;
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
      /* Pointer-Events drag handle: stop the browser from panning/scrolling
         when a drag begins on a touchscreen. */
      touch-action: none;
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
      /* Align the checkbox with the field name's first line, not the
         vertical centre of a multi-line label/description. */
      align-self: flex-start;
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
    /* Primary "Add action" button — filled blue, matching the scenes list. */
    button.add {
      background: var(--primary-color, #03a9f4);
      border-color: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      padding: 0.5rem 1rem;
      border-radius: 4px;
    }
    .section-heading {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-weight: 600;
      margin-bottom: 0.6rem;
    }
  `,
  ];

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
  @state() private _loadError: string | null = null;
  @state() private _saveError: string | null = null;
  @state() private _loaded = false;
  @state() private _fadoNoticeDismissed = false;
  // The install identity (config entry_id), used to key the Fado-notice
  // dismissal so a delete + recreate (new entry_id) re-shows it. Resolved in
  // _reload before _loaded flips, so the notice never renders against a stale id.
  private _installId: string | null = null;
  /** Key: "${actionId}:${fieldName}" of the field currently being edited. */
  @state() private _editingDefault: string | null = null;
  /** Value the field had before entering edit mode (for Cancel). */
  @state() private _editingOriginalValue: unknown = undefined;
  /** Whether the field had a default before entering edit mode. */
  @state() private _editingOriginalHad = false;
  // Drag-to-reorder controller. On drop it moves the action locally and
  // persists via auto-save.
  private _drag = new DragReorderController(this, (from, to) => {
    const actions = [...this._actions];
    const [moved] = actions.splice(from, 1);
    actions.splice(to, 0, moved);
    this._actions = actions;
    void this._autoSave();
  });

  // HA pickers (ha-service-picker / ha-form combobox) render their dropdown in
  // a document-level overlay outside our shadow tree. Clicks there must not be
  // treated as "click away".
  private static readonly _OVERLAY_TAG_RE = /vaadin|combo-box|overlay|listbox|menu|mwc-|md-/i;

  private _onDocPointerDown = (e: PointerEvent) => {
    // Common case: nothing open — skip the composedPath walk and overlay
    // regex scan that run on every document pointerdown otherwise.
    if (!this._adding && this._editingDefault === null) return;
    const path = e.composedPath();
    // HA-form selectors (select/entity/color) and the service picker render
    // their dropdowns in document-level vaadin/md overlays; a pointerdown on
    // an option fires before the selection commits, so neither click-away
    // check may treat an overlay click as "outside".
    const inOverlay = path.some(
      (n) => n instanceof Element && AmbienceActionsSettings._OVERLAY_TAG_RE.test(n.localName),
    );
    this._collapseAddFormOnClickAway(path, inOverlay);
    this._cancelEditingDefaultOnClickAway(path, inOverlay);
  };

  /** Collapse the open "add action" form when clicking outside it. */
  private _collapseAddFormOnClickAway(path: EventTarget[], inOverlay: boolean) {
    if (!this._adding) return;
    const addRow = this.shadowRoot?.querySelector(".add-row");
    const insideAddRow = !!addRow && path.includes(addRow);
    if (!insideAddRow && !inOverlay) {
      this._adding = false;
    }
  }

  /** Cancel the open default-value editor when clicking outside its row —
   *  cancelling on an overlay click would silently revert the user's pick. */
  private _cancelEditingDefaultOnClickAway(path: EventTarget[], inOverlay: boolean) {
    if (this._editingDefault === null) return;
    const editorRow = this.shadowRoot?.querySelector(
      `.field-row-editor[data-editing-key="${this._editingDefault}"]`,
    );
    if ((!editorRow || !path.includes(editorRow as EventTarget)) && !inOverlay) {
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
      const [actions, services, installId] = await Promise.all([
        listExposedActions(this.hass),
        listServices(this.hass),
        getInstallId(this.hass),
      ]);
      this._actions = actions;
      this._services = services;
      // Resolve the per-install Fado-notice dismissal here (before _loaded
      // flips) so the notice never flashes against an unknown install id.
      this._installId = installId;
      this._fadoNoticeDismissed = getFadoNoticeDismissed(installId);
    } catch (e: unknown) {
      this._loadError = localizeWsError(this.hass, e);
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

  private _toggleExpand(actionId: string) {
    // At most one card is expanded at a time: opening a card collapses any
    // other open one. Clicking the already-open card collapses it.
    if (this._expanded.has(actionId)) {
      this._expanded = new Set();
    } else {
      this._expanded = new Set([actionId]);
      void this._ensureSchema(actionId);
    }
  }

  private async _addService(serviceId: string) {
    if (!serviceId) return;
    // The searchable combobox can emit partial free text — only accept a real,
    // known service id.
    if (!this._services.some((s) => s.id === serviceId)) return;
    if (this._actions.some((a) => a.id === serviceId)) {
      // Already exposed (the HA service picker lists every service): expand
      // the existing card so the pick isn't a silent no-op.
      this._expanded = new Set([serviceId]);
      this._adding = false;
      return;
    }
    await this._ensureSchema(serviceId);
    this._actions = [
      ...this._actions,
      { id: serviceId, label: this._labelForService(serviceId), visible_fields: [], defaults: {} },
    ];
    // Expand only the newly-added card, collapsing any previously-open one.
    this._expanded = new Set([serviceId]);
    this._adding = false;
    void this._autoSave();
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
    try {
      await saveExposedActions(this.hass, this._actions);
      window.dispatchEvent(new CustomEvent("ambience-exposed-actions-changed"));
    } catch (e: unknown) {
      this._saveError = localizeWsError(this.hass, e);
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
        <div class="section-heading">
          <span>${localize(this.hass, "ui.settings_tab_actions", "Actions")}</span>
          <ambience-help .hass=${this.hass} .text=${localize(this.hass, "ui.help_actions_tab", "Actions are the service calls a scene runs. Define them here so scenes can reuse them.")} .docPath=${"actions"}></ambience-help>
        </div>
        ${this._renderFadoNotice()}
        ${this._saveError ? html`<div class="error">${this._saveError}</div>` : ""}
        ${this._actions.map((a, i) => this._renderCard(a, i))}
        ${this._renderAdd()}
      </section>
    `;
  }

  private _renderFadoNotice() {
    if (this._fadoNoticeDismissed || isComponentLoaded(this.hass, FADO_DOMAIN)) return "";
    return html`
      <ambience-banner
        data-test="fado-notice"
        icon="mdi:lightbulb-on-outline"
        hint
        .ctaLabel=${localize(this.hass, "ui.fado_notice_cta", "Install via HACS")}
        .ctaHref=${FADO_HACS_URL}
        .dismissLabel=${localize(this.hass, "ui.dismiss", "Dismiss")}
        @banner-dismiss=${() => this._dismissFadoNotice()}
      >
        <strong>${localize(this.hass, "ui.fado_notice_title", "Recommended: install Fado Light Fader")}</strong>
        <span>${localize(this.hass, "ui.fado_notice_body", "Fado adds smooth light fading for brightness, color, and color temperature — with automatic brightness restoration, UI autoconfiguration, and native transitions. It's a Home Assistant default HACS integration.")}</span>
      </ambience-banner>
    `;
  }

  private _dismissFadoNotice() {
    this._fadoNoticeDismissed = true;
    setFadoNoticeDismissed(this._installId);
  }

  private _renderCard(action: ExposedAction, index: number) {
    const schema = this._schemas[action.id];
    const isExpanded = this._expanded.has(action.id);

    return html`
      <div
        class="card ${this._drag.over === index ? "drag-over" : ""} ${this._drag.from === index ? "dragging" : ""}"
        data-card
        data-service=${action.id}
        data-drag-index=${index}
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
            title=${localize(this.hass, "ui.drag_to_reorder", "Drag to reorder")}
            @pointerdown=${(e: PointerEvent) => this._drag.start(index, e)}
            @click=${(e: Event) => e.stopPropagation()}
          >⠿</span>
          <span class="toggle-arrow">${isExpanded ? "▾" : "▸"}</span>
          ${
            isExpanded
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
                  @keydown=${(e: KeyboardEvent) => {
                    if (e.key !== "Enter") return;
                    e.preventDefault();
                    e.stopPropagation();
                    (e.currentTarget as HTMLElement).blur();
                    void this._autoSave();
                    this._expanded = new Set();
                  }}
                  @blur=${() => void this._autoSave()}
                  @click=${(e: Event) => e.stopPropagation()}
                ></ha-input>
              `
              : html`
                <span class="header-label-display">${action.label?.trim() || this._labelForService(action.id)}</span>
                <span class="header-service-id">(${action.id})</span>
              `
          }
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
    return html`
      <div class="body">
        ${this._renderFieldsSection(action, schema)}
      </div>
    `;
  }

  private _renderFieldsSection(action: ExposedAction, schema: ServiceSchema | null | undefined) {
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
    const fields = Object.entries(schema.fields)
      .slice()
      .sort(([a], [b]) => a.localeCompare(b));
    if (fields.length === 0) {
      return html`<p class="body-help">
        ${localize(this.hass, "ui.service_has_no_fields", "This service has no fields.")}
      </p>`;
    }
    return html`
      <p class="body-help">
        ${localize(this.hass, "ui.actions_field_help_show", "Tick a checkbox to make a field editable per scene.")}
        <ambience-help .hass=${this.hass} .text=${localize(this.hass, "ui.help_show_in_scene_editor", "Show this field in the scene editor so each scene can set it. Leave off to send a fixed default instead.")}></ambience-help>
        ${localize(this.hass, "ui.actions_field_help_default", "Set a default to pre-fill it.")}
        <ambience-help .hass=${this.hass} .text=${localize(this.hass, "ui.help_set_default", "A value sent automatically when the action runs. Scenes can override it if the field is also shown in the editor.")}></ambience-help>
      </p>
      ${fields.map(([name, field]) => this._renderFieldRow(action, name, field))}
    `;
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

  private _renderFieldRow(action: ExposedAction, name: string, field: ServiceField) {
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
              title=${localize(this.hass, "ui.show_in_scene_editor", "Show in scene editor")}
              .checked=${shown}
              @change=${(e: Event) =>
                this._setShowInEditor(action.id, name, (e.target as HTMLInputElement).checked)}
            />
          </div>
          <span class="name">
            ${field.name || humanizeId(name)}
            ${field.name ? html` <small class="field-id">(${name})</small>` : ""}
            ${field.description ? html` <small>— ${field.description}</small>` : ""}
          </span>
          <div class="summary-cell">
            ${
              isEditing
                ? html`<span class="summary-cell-editing">${localize(this.hass, "ui.editing", "Editing…")}</span>`
                : hasDefault
                  ? html`<button
                    class="default-summary"
                    data-default-summary=${name}
                    @click=${(e: Event) => {
                      e.stopPropagation();
                      this._startEditingDefault(action.id, name);
                    }}
                  >${localize(this.hass, "ui.default_prefix", "Default: ")}${this._formatDefaultSummary(action.defaults?.[name])}${this._defaultUnitSuffix(action.id, name)}</button>`
                  : html`<button
                    class="set-default-btn"
                    data-set-default=${name}
                    @click=${(e: Event) => {
                      e.stopPropagation();
                      this._startEditingDefault(action.id, name);
                    }}
                  >+ ${localize(this.hass, "ui.set_default", "Set default")}</button>`
            }
          </div>
        </div>
        <!-- Row 2: full editor (only when editing) -->
        ${
          isEditing
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
            : ""
        }
      </div>
    `;
  }

  private _renderDefaultEditor(action: ExposedAction, fieldName: string, _field: ServiceField) {
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

  private _renderAdd() {
    if (!this._adding) {
      return html`<div class="add-row">
        <button class="add" data-action="add" @click=${() => {
          this._adding = true;
        }}>
          + ${localize(this.hass, "ui.add_action_button", "Add action")}
        </button>
      </div>`;
    }
    return html`<div class="add-row">
      ${this._renderAddPicker()}
      <button data-action="cancel-add" @click=${() => {
        this._adding = false;
      }}>
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
}
