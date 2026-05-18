import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

type CardHelpers = {
  createCardElement(config: object): Promise<{
    constructor?: { getConfigElement?: () => Promise<unknown> };
  }>;
};

let _haComboBoxLoader: Promise<boolean> | null = null;

/**
 * HA lazy-loads its form components; <ha-combo-box> is NOT guaranteed to be
 * defined in a custom panel's context (it would render blank). The widely-used
 * trick is to call HA's global `loadCardHelpers()`, create a card element, and
 * request its config editor — that pulls in ha-form (and ha-combo-box) as a
 * side-effect of HA's lazy-chunk resolution. Run once, module-wide.
 */
function ensureHaComboBox(): Promise<boolean> {
  if (customElements.get("ha-combo-box")) return Promise.resolve(true);
  if (_haComboBoxLoader) return _haComboBoxLoader;
  _haComboBoxLoader = (async () => {
    const loader = (
      window as Window & { loadCardHelpers?: () => Promise<CardHelpers> }
    ).loadCardHelpers;
    if (typeof loader !== "function") return false;
    try {
      const helpers = await loader();
      const card = await helpers.createCardElement({
        type: "entities",
        entities: [],
      });
      await card.constructor?.getConfigElement?.();
      // Element registration is async after the import; race against a
      // timeout so a misbehaving HA build can't hang our panel forever.
      await Promise.race([
        customElements.whenDefined("ha-combo-box"),
        new Promise<void>((_, rej) =>
          setTimeout(() => rej(new Error("timeout")), 5000),
        ),
      ]);
      return customElements.get("ha-combo-box") !== undefined;
    } catch {
      return false;
    }
  })();
  return _haComboBoxLoader;
}

/**
 * Editable scene combobox. Wraps HA's <ha-combo-box> (force-loaded via the
 * loadCardHelpers trick above) so the dropdown shows every scene already
 * named by the area's rules with full HA theme styling, and supports typing
 * a brand-new name via `allow-custom-value`. Clearing the field makes the
 * rule "any scene".
 *
 * Emits `value-changed` with `{ value: string | null }` — null means "any".
 */
@customElement("ambience-scene-combobox")
export class AmbienceSceneCombobox extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }
    .placeholder {
      padding: 0.6rem 0.75rem;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      color: var(--secondary-text-color, #888);
      font-style: italic;
    }
    .placeholder.error {
      color: var(--error-color, #d32f2f);
      font-style: normal;
    }
  `;

  @property() value: string | null = null;
  @property({ attribute: false }) suggestions: string[] = [];

  @state() private _state: "loading" | "ready" | "failed" =
    customElements.get("ha-combo-box") !== undefined ? "ready" : "loading";

  override async connectedCallback() {
    super.connectedCallback();
    if (this._state === "loading") {
      const ok = await ensureHaComboBox();
      if (this.isConnected) this._state = ok ? "ready" : "failed";
    }
  }

  private _onValueChanged(e: CustomEvent<{ value: string }>) {
    // ha-combo-box also dispatches `value-changed`; stop it at our shadow
    // boundary and re-emit with the wildcard contract (empty string → null).
    e.stopPropagation();
    const v = e.detail.value;
    this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: v === "" ? null : v },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    if (this._state === "loading") {
      return html`<div class="placeholder">Loading scene picker…</div>`;
    }
    if (this._state === "failed") {
      return html`<div class="placeholder error">
        Could not load HA's combobox. Refresh the page; if the problem
        persists, report it.
      </div>`;
    }
    const items = this.suggestions.map((s) => ({ value: s, label: s }));
    return html`
      <ha-combo-box
        .items=${items}
        .value=${this.value ?? ""}
        item-value-path="value"
        item-label-path="label"
        placeholder="(any scene)"
        allow-custom-value
        @value-changed=${this._onValueChanged}
      ></ha-combo-box>
    `;
  }
}
