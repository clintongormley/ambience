import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import "./kebab-menu";
import { categorySwatchStyle } from "../category-colors.js";
import { DragReorderController } from "../drag-reorder.js";
import { actionLabel, conditionLabel, localize } from "../i18n.js";
import { formatArgValue, paramLabel, sceneDisplayName, summariseCondition } from "../summary.js";
import type {
  ActionSpec,
  ConditionInfo,
  ExposedAction,
  PeriodStoreView,
  Scene,
  SceneCategory,
} from "../types.js";
import { entityName, type HassWithStates } from "./entity-row.js";
import type { KebabItem } from "./kebab-menu";

@customElement("ambience-scenes-list")
export class AmbienceScenesList extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }
    .empty {
      color: var(--secondary-text-color, #888);
      padding: 1rem;
      text-align: center;
    }
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    li {
      display: flex;
      /* Top-align so the drag handle, number, toggle and kebab stay in line
         with the scene name when the card is expanded (the body grows tall with
         the condition summary + action detail); centering would float them down
         beside the action row. */
      align-items: flex-start;
      gap: 0.25rem;
      padding: 0.75rem 1rem;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      margin-bottom: 0.5rem;
      background: var(--card-background-color, #fff);
    }
    li.drag-over {
      border-color: var(--primary-color, #03a9f4);
    }
    li.disabled .body,
    li.disabled .idx {
      opacity: 0.5;
    }
    .toggle {
      padding: 0.25rem 0.5rem;
    }
    .toggle ha-icon {
      --mdc-icon-size: 36px;
    }
    .handle {
      cursor: grab;
      color: var(--secondary-text-color, #888);
      user-select: none;
    }
    .idx {
      font-family: monospace;
      color: var(--secondary-text-color, #888);
      margin-right: 0.25rem;
      /* Wide enough for two digits — we don't expect >99 scenes. */
      min-width: 1.4em;
      text-align: right;
    }
    .body {
      flex: 1;
      cursor: pointer;
    }
    .name {
      font-weight: 600;
    }
    .summary {
      font-size: 0.85em;
      color: var(--secondary-text-color, #888);
    }
    .scene-detail {
      margin-top: 0.35rem;
      padding-left: 0.75rem;
      border-left: 2px solid var(--divider-color, #e0e0e0);
      font-size: 0.85em;
      color: var(--secondary-text-color, #888);
    }
    .condition-line {
      padding: 0.05rem 0;
      /* Wrap continuation lines indented to align under the condition body
         (after the bold "Condition:" label). */
      padding-left: 1.25rem;
      text-indent: -1.25rem;
    }
    .actions-detail {
      margin-top: 0.35rem;
      padding-top: 0.35rem;
      border-top: 1px dashed var(--divider-color, #e0e0e0);
    }
    .actions-detail-item {
      padding: 0.15rem 0;
    }
    .actions-detail-item .action-header {
      color: var(--primary-text-color, #212121);
    }
    .entity-list {
      list-style: disc;
      padding-left: 1.25rem;
      margin: 0.1rem 0 0.25rem 0;
    }
    .entity-list li {
      padding: 0;
      margin: 0;
      border: 0;
      background: transparent;
      display: list-item;
    }
    .no-targets {
      font-style: italic;
    }
    button {
      background: transparent;
      border: 0;
      color: var(--primary-color, #03a9f4);
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      font-size: 1rem;
    }
    .add {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      padding: 0.5rem 1rem;
      border-radius: 4px;
      margin-top: 0.5rem;
    }
    /* The lead slot holds either the drag handle (unpinned) or the pin button
       (pinned) — one fixed width, so swapping them never shifts the row. */
    .lead {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 1.5em;
    }
    /* Fixed-width slot for the shadow warning so the title aligns whether or
       not a row is shadowed. */
    .warn-slot {
      display: inline-flex;
      align-items: center;
      justify-content: flex-start;
      flex: 0 0 1.4em;
    }
    .pin {
      padding: 0;
    }
    .shadow-warning {
      color: var(--error-color, #db4437);
      cursor: help;
      line-height: 1;
    }
    /* Full-width coloured bar before each category's scenes. The colour + text
       colour are set inline per category; this CSS rule carries layout + the neutral
       fallback used when a category has no colour. */
    .category-section-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
      box-sizing: border-box;
      padding: 0.4rem 0.75rem;
      margin: 0.75rem 0 0.5rem 0;
      border-radius: 4px;
      font-weight: 600;
      background: var(--secondary-background-color, #e0e0e0);
      color: var(--primary-text-color, #212121);
    }
    .category-section:first-of-type .category-section-header {
      margin-top: 0;
    }
    .category-section-header ha-icon {
      --mdc-icon-size: 20px;
    }
    .category-kebab {
      margin-left: auto;
      --kebab-trigger-color: currentColor;
      /* Cancel the header's right padding so the kebab sits flush at the bar's
         right edge — aligning it with the scope-header and scene-row kebabs. */
      margin-right: -0.75rem;
    }
    .row-kebab {
      /* Cancel the row's right padding so the kebab sits flush at the card's
         right edge, vertically in line with the category and scope kebabs. The
         extra -1px compensates for the row card's 1px border (the category bar
         has none), so all three kebab columns align to the same pixel. */
      margin-right: calc(-1rem - 1px);
    }
  `;

  @property({ attribute: false }) scenes: Scene[] = [];
  @property({ attribute: false }) periods?: PeriodStoreView;
  @property({ attribute: false }) luxRanges?: import("../types.js").LuxRangeStoreView;
  @property({ attribute: false })
  weatherConfig?: import("../types.js").WeatherConfig;
  @property({ attribute: false }) hass?: {
    localize?: (k: string) => string | undefined;
    [key: string]: unknown;
  };
  // Condition registry — used to sort `when` keys by `priority` in the summary
  // so it reads in the same order as the linearisation tiebreaker (higher
  // priority first). Undefined → falls back to `when`-dict insertion order.
  @property({ attribute: false }) conditions?: ConditionInfo[];
  // Exposed-actions registry — used to resolve a friendly label for each
  // action when rendering the expanded detail under a scene. Optional;
  // when missing, falls back to the service id (snake-case → title-case).
  @property({ attribute: false }) availableActions: ExposedAction[] = [];
  // Per-service schemas — used to look up HA's `field.name` attribute
  // for each param key in the expanded action detail. Optional; when
  // missing, the param key is humanized (snake_case → "Title case").
  @property({ attribute: false }) schemas: Record<string, import("../types.js").ServiceSchema> = {};
  // Available scene categories, used to render the section header bars. Empty ⇒ no
  // category sections (every scene rendered as one flat list).
  @property({ attribute: false }) categories: SceneCategory[] = [];

  // The active category filter, OWNED BY THE PARENT (scopes-view): "" = All,
  // otherwise a category id. Presentation-only.
  @property({ attribute: false }) filterCategory: string = "";

  // Drag-to-reorder controller. On drop it emits "reorder-scenes" {from,to};
  // the parent (scopes-view) performs the actual move.
  private _drag = new DragReorderController(this, (from, to) =>
    this._emit("reorder-scenes", { from, to }),
  );
  // Scene indices whose action list is expanded inline.
  @state() private _expanded = new Set<number>();

  /** A full-width coloured header bar for a category's section: the category's
   *  colour as background (auto-contrast text), its icon, then its name. Falls
   *  back to neutral theme colours when the category has no colour. */
  private _renderSectionHeader(category: SceneCategory) {
    return html`<div
      class="category-section-header"
      style=${categorySwatchStyle(category.color)}
    >
      ${category.icon ? html`<ha-icon icon=${category.icon}></ha-icon>` : ""}
      <span>${category.name}</span>
      <ambience-kebab-menu
        class="category-kebab"
        .hass=${this.hass}
        .items=${
          [
            {
              id: "run",
              label: localize(this.hass, "ui.run", "Run"),
              icon: "mdi:play",
            },
            {
              id: "traces",
              label: localize(this.hass, "ui.view_traces", "View traces"),
              icon: "mdi:transit-connection-variant",
            },
            {
              id: "simulate",
              label: localize(this.hass, "ui.simulate", "Simulate"),
              icon: "mdi:flask-outline",
            },
          ] satisfies KebabItem[]
        }
        @menu-action=${(e: CustomEvent<{ id: string }>) =>
          this._onCategoryMenu(category, e.detail.id)}
      ></ambience-kebab-menu>
    </div>`;
  }

  /**
   * Scenes paired with their ORIGINAL index, partitioned into render sections.
   * filterCategory="" (All) → one section per category that has scenes, sorted by
   * category name; each labelled. filterCategory=<id> → a single unlabelled
   * section with only that category's scenes. Original indices are preserved so
   * edit/delete/duplicate/reorder reference the correct underlying entry.
   */
  private _sections(): Array<{
    category: SceneCategory | undefined;
    rows: Array<[number, Scene]>;
  }> {
    const pairs = this.scenes.map((scene, i) => [i, scene] as [number, Scene]);
    if (this.filterCategory !== "") {
      return [
        {
          category: this.categories.find((g) => g.id === this.filterCategory),
          rows: pairs.filter(([, r]) => r.category === this.filterCategory),
        },
      ];
    }
    const byId = new Map<string, Array<[number, Scene]>>();
    for (const [i, r] of pairs) {
      const list = byId.get(r.category) ?? [];
      list.push([i, r]);
      byId.set(r.category, list);
    }
    return [...byId.entries()]
      .map(([gid, rows]) => ({
        category: this.categories.find((g) => g.id === gid),
        rows,
      }))
      .sort((a, b) => (a.category?.name ?? "").localeCompare(b.category?.name ?? ""));
  }

  private _emit(name: string, detail: unknown) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }

  // Memoised name→priority map, rebuilt only when the `conditions` array
  // identity changes (not on every _whenKeys call — it runs twice per scene
  // per render).
  private _priorityOfCache?: {
    src: ConditionInfo[] | undefined;
    map: Map<string, number>;
  };

  private _priorityMap(): Map<string, number> {
    const src = this.conditions;
    if (!this._priorityOfCache || this._priorityOfCache.src !== src) {
      this._priorityOfCache = {
        src,
        map: new Map((src ?? []).map((m) => [m.name, m.priority])),
      };
    }
    return this._priorityOfCache.map;
  }

  /** Sorted list of active `when` keys (higher priority first). */
  private _whenKeys(scene: Scene): string[] {
    const priorityOf = this._priorityMap();
    return Object.keys(scene.when)
      .filter((k) => scene.when[k] != null)
      .sort((a, b) => (priorityOf.get(b) ?? -Infinity) - (priorityOf.get(a) ?? -Infinity));
  }

  /** Inline (collapsed) "when" summary: condition entries joined by `, ` with
   *  each condition label wrapped in <strong>. */
  private _whenSummary(scene: Scene) {
    const keys = this._whenKeys(scene);
    if (keys.length === 0) return localize(this.hass, "ui.summary_any", "any");
    return keys.map((k, i) => {
      const label = conditionLabel(this.hass as any, k);
      const body = summariseCondition(k, scene.when[k], {
        hass: this.hass as any,
        periods: this.periods,
        luxRanges: this.luxRanges,
        weatherGroups: this.weatherConfig?.groups,
      });
      const sep = i === 0 ? "" : ", ";
      return html`${sep}<strong>${label}:</strong> ${body}`;
    });
  }

  /** Expanded "when" detail: one condition per line. */
  private _whenStacked(scene: Scene) {
    const keys = this._whenKeys(scene);
    if (keys.length === 0) {
      return html`<div class="condition-line">
        ${localize(this.hass, "ui.summary_any", "any")}
      </div>`;
    }
    return keys.map((k) => {
      const label = conditionLabel(this.hass as any, k);
      const body = summariseCondition(k, scene.when[k], {
        hass: this.hass as any,
        periods: this.periods,
        luxRanges: this.luxRanges,
        weatherGroups: this.weatherConfig?.groups,
      });
      return html`<div class="condition-line">
        <strong>${label}:</strong> ${body}
      </div>`;
    });
  }

  /** "N actions" / "1 action" label. A scene with no actions is a no-op — it
   *  matches but does nothing — so flag it as "NOOP - 0 actions". */
  private _actionCountLabel(scene: Scene): string {
    const n = scene.actions.length;
    const word =
      n === 1
        ? localize(this.hass, "ui.action_singular", "action")
        : localize(this.hass, "ui.action_plural", "actions");
    const count = `${n} ${word}`;
    return n === 0 ? `${localize(this.hass, "ui.noop_prefix", "NOOP")} - ${count}` : count;
  }

  private _toggleScene(i: number) {
    const next = new Set(this._expanded);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    this._expanded = next;
  }

  /** Render-friendly name for an entity: friendly_name attribute, else entity_id. */
  private _entityName(entity_id: string): string {
    return entityName(this.hass as HassWithStates | undefined, entity_id);
  }

  /** "Key: value, ..." string for the expanded action header. Keys use
   *  HA's `field.name` from the schema when available, otherwise the
   *  humanized field id ("brightness_pct" → "Brightness pct"). Values use
   *  formatArgValue: HA target objects become friendly entity names, arrays
   *  are wrapped in [ ], other objects render as JSON. */
  private _actionParamsString(action: ActionSpec): string {
    return Object.entries(action.params)
      .filter(([, v]) => v !== undefined && v !== null && v !== "")
      .map(
        ([k, v]) =>
          `${paramLabel(k, action.service, this.schemas)}: ${formatArgValue(this.hass, v)}`,
      )
      .join(", ");
  }

  /** Friendly label for an action: user-provided ExposedAction.label when
   *  set, otherwise the service id rendered via actionLabel (which is
   *  snake-case → title-case for unknown ids). */
  private _actionLabel(action: ActionSpec): string {
    const exposed = this.availableActions.find((e) => e.id === action.service);
    if (exposed?.label?.trim()) return exposed.label;
    return actionLabel(this.hass as any, action.service);
  }

  private _onCategoryMenu(category: SceneCategory, id: string) {
    if (id === "run") this._emit("apply-category", { categoryId: category.id });
    else if (id === "traces") this._emit("show-traces", { category: category.id });
    else if (id === "simulate") this._emit("show-simulator", { category: category.id });
  }

  private _onSceneMenu(i: number, id: string) {
    if (id === "edit") this._emit("edit-scene", { index: i });
    else if (id === "duplicate") this._emit("duplicate-scene", { index: i });
    else if (id === "run") this._emit("run-scene-actions", { index: i });
    else if (id === "delete") this._emit("delete-scene", { index: i });
  }

  /** A single scene row. `i` is the scene's ORIGINAL index in `this.scenes`
   *  (used for every emitted event and drag handler); `displayNum` is the
   *  1-based position WITHIN its render section. */
  private _renderRow(i: number, scene: Scene, displayNum: number) {
    const unpinLabel = localize(this.hass, "ui.unpin", "Unpin (return to automatic order)");
    const isDisabled = scene.enabled === false;
    const toggleLabel = isDisabled
      ? localize(this.hass, "ui.enable_scene", "Enable scene")
      : localize(this.hass, "ui.disable_scene", "Disable scene");
    return html`
      <li
        class="${this._drag.over === i ? "drag-over " : ""}${isDisabled ? "disabled" : ""}"
        draggable="true"
        @dragstart=${() => this._drag.start(i)}
        @dragover=${(e: DragEvent) => this._drag.dragOver(e, i)}
        @drop=${() => this._drag.drop(i)}
        @dragend=${() => this._drag.end()}
      >
        <span class="lead">
          ${
            scene.pinned
              ? html`<button
                class="pin"
                title=${unpinLabel}
                aria-label=${unpinLabel}
                @click=${(e: Event) => {
                  e.stopPropagation();
                  this._emit("unpin-scene", { index: i });
                }}
              >
                📌
              </button>`
              : html`<span
                class="handle"
                title=${localize(this.hass, "ui.drag_to_reorder", "Drag to reorder")}
                >⠿</span
              >`
          }
        </span>
        <span class="idx">${displayNum}</span>
        <span class="warn-slot">
          ${
            scene.shadowed_by != null && !isDisabled
              ? html`<span
                class="shadow-warning"
                title=${localize(
                  this.hass,
                  "ui.shadowed",
                  "Never fires — shadowed by an earlier scene.",
                )}
                >⚠️</span
              >`
              : ""
          }
        </span>
        <div class="body" @click=${() => this._toggleScene(i)}>
          <div class="name">
            ${sceneDisplayName(
              scene,
              localize(this.hass, "ui.scene_n", "Scene {n}").replace("{n}", String(displayNum)),
            )}
          </div>
          <div class="summary">
            ${
              this._expanded.has(i)
                ? ""
                : html`${this._whenSummary(scene)} ·
                  <span class="action-count"
                    >${this._actionCountLabel(scene)}</span
                  >`
            }
          </div>
          ${
            this._expanded.has(i)
              ? html`
                <div class="scene-detail">
                  ${this._whenStacked(scene)}
                  ${
                    scene.actions.length === 0
                      ? ""
                      : html`<div class="actions-detail">
                        ${scene.actions.map((a) => {
                          const params = this._actionParamsString(a);
                          const label = this._actionLabel(a);
                          const header = params ? `${label} · ${params}` : label;
                          return html`
                            <div class="actions-detail-item">
                              <div class="action-header">${header}</div>
                              ${
                                a.entity_ids.length === 0
                                  ? html`<div class="no-targets">
                                    ${localize(this.hass, "ui.no_targets", "(no targets)")}
                                  </div>`
                                  : html`<ul class="entity-list">
                                    ${a.entity_ids.map(
                                      (eid) => html`<li>${this._entityName(eid)}</li>`,
                                    )}
                                  </ul>`
                              }
                            </div>
                          `;
                        })}
                      </div>`
                  }
                </div>
              `
              : ""
          }
        </div>
        <button
          class="toggle"
          @click=${(e: Event) => {
            e.stopPropagation();
            this._emit("toggle-scene-enabled", {
              index: i,
              enabled: isDisabled,
            });
          }}
          title=${toggleLabel}
          aria-label=${toggleLabel}
        >
          <ha-icon
            icon=${isDisabled ? "mdi:toggle-switch-off-outline" : "mdi:toggle-switch"}
          ></ha-icon>
        </button>
        <ambience-kebab-menu
          class="row-kebab"
          .hass=${this.hass}
          .label=${localize(this.hass, "ui.scene_actions", "Scene actions")}
          .items=${
            [
              {
                id: "edit",
                label: localize(this.hass, "ui.edit", "Edit"),
                icon: "mdi:pencil",
              },
              {
                id: "duplicate",
                label: localize(this.hass, "ui.duplicate", "Duplicate"),
                icon: "mdi:content-duplicate",
              },
              {
                id: "run",
                label: localize(this.hass, "ui.run_actions", "Run actions"),
                icon: "mdi:play",
              },
              {
                id: "delete",
                label: localize(this.hass, "ui.title_delete", "Delete"),
                icon: "mdi:delete",
                danger: true,
                dividerBefore: true,
              },
            ] satisfies KebabItem[]
          }
          @menu-action=${(e: CustomEvent<{ id: string }>) => this._onSceneMenu(i, e.detail.id)}
        ></ambience-kebab-menu>
      </li>
    `;
  }

  override render() {
    if (this.scenes.length === 0) {
      return html`
        <p class="empty">
          ${localize(this.hass, "ui.no_scenes_yet", "No scenes yet.")}
        </p>
        <button class="add" @click=${() => this._emit("add-scene", {})}>
          ${localize(this.hass, "ui.add_scene", "+ Add scene")}
        </button>
      `;
    }
    // Only render sections that actually have scenes — when filtering to a
    // single category, a scope with no scenes in that category shows nothing (no
    // empty header bar).
    const sections = this._sections().filter((section) => section.rows.length > 0);
    // Show the coloured category header for every section, including when a single
    // category is filtered — the bar labels which category these scenes belong to.
    const showHeaders = this.categories.length > 0;
    return html`
      ${sections.map(
        (section) => html`
          <div class="category-section">
            ${showHeaders && section.category ? this._renderSectionHeader(section.category) : ""}
            <ul>
              ${section.rows.map(([i, scene], n) => this._renderRow(i, scene, n + 1))}
            </ul>
            <button
              class="add"
              @click=${() => this._emit("add-scene", { category: section.category?.id })}
            >
              ${localize(this.hass, "ui.add_scene", "+ Add scene")}
            </button>
          </div>
        `,
      )}
    `;
  }
}
