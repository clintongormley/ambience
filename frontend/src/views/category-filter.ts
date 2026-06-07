// frontend/src/views/category-filter.ts
/**
 * The colour-coded global category filter, shown in the panel header.
 *
 * Self-contained: it loads its own category list and refreshes on the global
 * `ambience-categories-changed` event, so it needs no data plumbing from its
 * parent. It reports the chosen category up via an `ambience-filter-changed`
 * event ({ category }), and routes "Add category…" to the settings modal via
 * the existing `ambience-open-settings` event ({ tab: "ambience" }).
 */
import { css, html, LitElement, nothing, type PropertyValues, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import type { HassConnection } from "../api.js";
import { listCategories } from "../api.js";
import { categorySwatch, categorySwatchStyles } from "../category-swatch.js";
import { localize } from "../i18n.js";
import type { SceneCategory } from "../types.js";
import { getFilterCategory, setFilterCategory } from "../ui-state.js";

@customElement("ambience-category-filter")
export class AmbienceCategoryFilter extends LitElement {
  static override styles = [
    categorySwatchStyles,
    css`
      :host {
        display: block;
      }
      .category-filter {
        position: relative;
        min-width: 18rem;
      }
      /* Trigger keeps a stable height regardless of the selection (the swatch is
       always present), so picking a category never resizes the control. */
      .category-filter-trigger {
        display: flex;
        align-items: center;
        gap: 0.65rem;
        width: 100%;
        min-height: 48px;
        box-sizing: border-box;
        padding: 0.4rem 0.6rem 0.4rem 0.5rem;
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 8px;
        background: var(--card-background-color, #fff);
        color: var(--primary-text-color, #212121);
        cursor: pointer;
        font: inherit;
        font-size: 1rem;
      }
      .category-filter-trigger:hover {
        background: var(--secondary-background-color, #f5f5f5);
      }
      .category-filter-trigger .category-name {
        flex: 1;
        text-align: left;
      }
      .category-filter-trigger .caret {
        color: var(--secondary-text-color, #888);
        flex: 0 0 auto;
      }
      .category-filter-menu {
        position: absolute;
        top: calc(100% + 4px);
        left: 0;
        right: 0;
        z-index: 11;
        max-height: 60vh;
        overflow-y: auto;
        background: var(--card-background-color, #fff);
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
        padding: 0.35rem;
      }
      /* Shared row layout for the filter options and the add-category action. */
      .category-filter-option,
      .category-filter-add {
        display: flex;
        align-items: center;
        gap: 0.65rem;
        width: 100%;
        min-height: 44px;
        box-sizing: border-box;
        padding: 0.4rem 0.6rem;
        border: 0;
        border-radius: 6px;
        background: none;
        cursor: pointer;
        font: inherit;
        font-size: 1rem;
        text-align: left;
      }
      .category-filter-option:hover,
      .category-filter-add:hover {
        background: var(--secondary-background-color, #f5f5f5);
      }
      .category-filter-option {
        color: var(--primary-text-color, #212121);
      }
      .category-filter-option[aria-selected="true"] {
        background: var(--secondary-background-color, #eee);
        font-weight: 600;
      }
      /* The add-category action uses the accent colour so it reads as an action,
       not a filter. The footer variant (inside the dropdown) adds a divider
       separating it from the options above. */
      .category-filter-add {
        color: var(--primary-color, #03a9f4);
      }
      .category-filter-add--footer {
        margin-top: 0.35rem;
        border-top: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 0 0 6px 6px;
      }
      .category-name {
        flex: 1;
      }
    `,
  ];

  @property({ attribute: false }) hass!: HassConnection;

  @state() private _categories: SceneCategory[] = [];
  // _categories sorted by name, recomputed only when _categories changes (not on
  // every render — render runs on every hass update).
  private _sortedCategories: SceneCategory[] = [];
  // Current selection, "" = All. Seeded from localStorage so a reload (or HA's
  // panel rebuild on reconnect) restores the last-chosen filter.
  @state() private _filterCategory = getFilterCategory();
  @state() private _open = false;
  // True once the first list resolves; gates the add affordance so it doesn't
  // flash before categories are known.
  @state() private _loaded = false;

  private async _fetchCategories() {
    const categories = await listCategories(this.hass);
    if (!this.isConnected) return;
    this._categories = categories;
    // If the active selection was deleted, fall back to All and notify — otherwise
    // the scene list keeps filtering by a category that no longer exists and shows
    // nothing, with the trigger misleadingly reading "All categories".
    if (this._filterCategory && !categories.some((g) => g.id === this._filterCategory)) {
      this._select("");
    }
  }

  private _onCategoriesChanged = async () => {
    try {
      await this._fetchCategories();
    } catch {
      // Silent — a transient refetch failure after a save isn't worth
      // surfacing; the next reload re-fetches.
    }
  };

  // Close the open menu on any click outside this component. A window listener
  // (rather than a fixed-position backdrop element) is used because the header
  // is a CSS container, which would clip a fixed backdrop to the header instead
  // of covering the screen.
  private _onDocClick = (e: MouseEvent) => {
    if (this._open && !e.composedPath().includes(this)) this._open = false;
  };

  override async connectedCallback() {
    super.connectedCallback();
    window.addEventListener("ambience-categories-changed", this._onCategoriesChanged);
    window.addEventListener("click", this._onDocClick);
    try {
      await this._fetchCategories();
    } catch {
      // Leave the list empty; a later change event or reload will populate it.
    } finally {
      // Only mark loaded if still connected — a stale resolve on a disconnected
      // element must not skip the refetch when it is re-inserted (connectedCallback
      // runs again on reconnect).
      if (this.isConnected) this._loaded = true;
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("ambience-categories-changed", this._onCategoriesChanged);
    window.removeEventListener("click", this._onDocClick);
  }

  override willUpdate(changed: PropertyValues) {
    if (changed.has("_categories")) {
      this._sortedCategories = [...this._categories].sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  private _select(id: string) {
    this._filterCategory = id;
    setFilterCategory(id);
    this._open = false;
    this.dispatchEvent(
      new CustomEvent("ambience-filter-changed", {
        detail: { category: id },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _openSettings() {
    this._open = false;
    this.dispatchEvent(
      new CustomEvent("ambience-open-settings", {
        detail: { tab: "ambience" },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /** A colour swatch (category colour bg + icon) followed by the category name.
   *  `null` renders the "All categories" entry with a neutral filter-icon swatch,
   *  so the trigger and option rows keep a consistent height across selections. */
  private _renderEntry(category: SceneCategory | null): TemplateResult {
    if (category === null) {
      return html`
        ${categorySwatch(undefined, "mdi:filter-variant")}
        <span class="category-name"
          >${localize(this.hass, "ui.all_categories", "All categories")}</span
        >
      `;
    }
    return html`
      ${categorySwatch(category.color, category.icon)}
      <span class="category-name">${category.name}</span>
    `;
  }

  /** The "add category" action: opens the Ambience settings tab where categories
   *  are managed. `footer` adds a divider so it reads as a footer action below
   *  the filter options; without it the link stands alone. */
  private _renderAddCategory(footer: boolean): TemplateResult {
    return html`
      <button
        class="category-filter-add${footer ? " category-filter-add--footer" : ""}"
        @click=${() => this._openSettings()}
      >
        <ha-icon icon="mdi:plus"></ha-icon>
        <span class="category-name"
          >${localize(this.hass, "ui.add_category", "Add category…")}</span
        >
      </button>
    `;
  }

  override render() {
    // Before the first load, render nothing so the add affordance doesn't flash.
    if (!this._loaded) return html``;
    // With 0–1 categories there's nothing to filter, so offer just the add link.
    if (this._categories.length <= 1) {
      return this._renderAddCategory(false);
    }
    const sorted = this._sortedCategories;
    const current = this._categories.find((g) => g.id === this._filterCategory) ?? null;
    return html`
      <div class="category-filter">
        <button
          class="category-filter-trigger"
          aria-haspopup="listbox"
          aria-expanded=${this._open}
          @click=${() => {
            this._open = !this._open;
          }}
        >
          ${this._renderEntry(current)}
          <ha-icon class="caret" icon="mdi:menu-down"></ha-icon>
        </button>
        ${
          this._open
            ? html`
              <div class="category-filter-menu">
                <div class="category-filter-options" role="listbox">
                  <button
                    class="category-filter-option"
                    role="option"
                    aria-selected=${this._filterCategory === ""}
                    @click=${() => this._select("")}
                  >
                    ${this._renderEntry(null)}
                  </button>
                  ${sorted.map(
                    (g) =>
                      html`<button
                        class="category-filter-option"
                        role="option"
                        aria-selected=${this._filterCategory === g.id}
                        @click=${() => this._select(g.id)}
                      >
                        ${this._renderEntry(g)}
                      </button>`,
                  )}
                </div>
                ${this._renderAddCategory(true)}
              </div>
            `
            : nothing
        }
      </div>
    `;
  }
}
