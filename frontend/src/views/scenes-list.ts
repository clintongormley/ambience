import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import "./kebab-menu";
import { categorySwatchStyle } from "../category-colors.js";
import { DragReorderController } from "../drag-reorder.js";
import { actionLabel, conditionLabel, exposedActionLabel, localize } from "../i18n.js";
import { configIssueLabel, sceneProblems } from "../scene-problems.js";
import {
  formatArgValue,
  paramLabel,
  sceneDisplayName,
  summariseBlocker,
  summariseCondition,
} from "../summary.js";
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
import { renderAggregateProblemFlag } from "./problem-flag.js";

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
    li.dragging {
      opacity: 0.8;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
      position: relative;
      z-index: 1000;
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
      /* The ⠿ glyph (not the whole lead slot) is the grab handle, so the pin
         button beside it stays tappable. touch-action:none suppresses the
         browser's touch panning so a drag on a phone reorders, not scrolls. */
      touch-action: none;
    }
    .handle:active {
      cursor: grabbing;
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
      /* A flex item won't shrink below its content's intrinsic width unless
         min-width is overridden — without this, a long unbreakable token in the
         summary (e.g. an entity id like binary_sensor.bathroom_1_shower_presence)
         forces the body wider than the card, pushing the toggle + kebab off the
         right edge. overflow-wrap lets those tokens break so the text wraps
         inside the card instead of overflowing (it inherits to .name, .summary
         and the expanded detail below). */
      min-width: 0;
      overflow-wrap: anywhere;
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
    .actions-detail,
    .noop-detail {
      margin-top: 0.35rem;
      padding-top: 0.35rem;
      border-top: 1px dashed var(--divider-color, #e0e0e0);
    }
    .noop-detail {
      font-style: italic;
    }
    .actions-detail-item {
      padding: 0.15rem 0;
    }
    .apply-every-detail {
      margin-top: 0.35rem;
      color: var(--secondary-text-color, #888);
      font-style: italic;
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
      /* The pin doubles as the grab handle (tap = unpin, drag = reorder), so it
         needs the same grab cursor and touch-pan suppression as .handle. */
      cursor: grab;
      touch-action: none;
    }
    .pin:active {
      cursor: grabbing;
    }
    .category-section-header ambience-problem-flag {
      margin-left: 0.25rem;
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
      /* The whole bar toggles the section's collapse (the kebab stops its own
         clicks); show the affordance. */
      cursor: pointer;
    }
    /* Chevron mirrors the scope-header's: points right when collapsed, rotates
       to point down when the section is open. Inherits the bar's (auto-contrast)
       text colour. */
    .category-chevron {
      flex: 0 0 auto;
      width: 1em;
      font-size: 0.85em;
      color: currentColor;
      transition: transform 0.1s;
    }
    .category-chevron.open {
      transform: rotate(90deg);
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

  // Category ids whose section is collapsed within THIS scope, OWNED BY THE
  // PARENT (scopes-view) and persisted there. Presentation-only: a collapsed
  // section renders just its header bar. Clicking a header emits
  // "toggle-category-collapse" {categoryId} for the parent to flip.
  @property({ attribute: false }) collapsedCategories: string[] = [];

  // Drag-to-reorder controller. On drop it emits "reorder-scenes" {from,to};
  // the parent (scopes-view) performs the actual move.
  private _drag = new DragReorderController(this, (from, to) =>
    this._emit("reorder-scenes", { from, to }),
  );
  // Scene indices whose action list is expanded inline.
  @state() private _expanded = new Set<number>();

  override willUpdate(changed: Map<string, unknown>): void {
    // _expanded is keyed by scene index; a scenes change (delete/reorder)
    // shifts indices, silently moving the expansion onto a different scene.
    if (changed.has("scenes")) this._expanded = new Set();
  }

  /** A full-width coloured header bar for a category's section: a chevron, the
   *  category's colour as background (auto-contrast text), its icon, its name,
   *  then a problem-flag when any scene in the section has problems. Falls back
   *  to neutral theme colours when the category has no colour. Clicking the bar
   *  toggles the section's collapse; the kebab and the flag stop their own clicks
   *  so neither collapses the section. */
  private _renderSectionHeader(
    category: SceneCategory,
    open: boolean,
    rows: Array<[number, Scene]>,
  ) {
    // A plain clickable bar with a rotating chevron, matching the scope-header
    // pattern (no role="button" — the bar nests an interactive kebab, so a
    // button role would be invalid; the chevron is decorative, hence aria-hidden).
    return html`<div
      class="category-section-header"
      style=${categorySwatchStyle(category.color)}
      @click=${() => this._emit("toggle-category-collapse", { categoryId: category.id })}
    >
      <span class="category-chevron ${open ? "open" : ""}" aria-hidden="true">▶</span>
      ${category.icon ? html`<ha-icon icon=${category.icon}></ha-icon>` : ""}
      <span>${category.name}</span>
      ${renderAggregateProblemFlag(
        this.hass,
        rows.map(([, scene]) => scene),
      )}
      <ambience-kebab-menu
        class="category-kebab"
        .hass=${this.hass}
        @click=${(e: Event) => e.stopPropagation()}
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
            {
              id: "auto",
              label: localize(this.hass, "ui.auto_triggers_section", "Auto-triggers"),
              icon: "mdi:flash-auto",
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
    // A scene with no conditions is always active — read it as "Always" (mirrors
    // the blocker's "Block always"), not the per-condition wildcard "any".
    if (keys.length === 0) return localize(this.hass, "ui.summary_always", "Always");
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

  /** Positive "Block until … while …" summary for a zero-action blocker scene. */
  private _blockerSummary(scene: Scene): string {
    return summariseBlocker(scene, {
      hass: this.hass as any,
      periods: this.periods,
      luxRanges: this.luxRanges,
      weatherGroups: this.weatherConfig?.groups,
      priorities: this._priorityMap(),
    });
  }

  /** Expanded "when" detail: one condition per line. */
  private _whenStacked(scene: Scene) {
    const keys = this._whenKeys(scene);
    if (keys.length === 0) {
      return html`<div class="condition-line">
        ${localize(this.hass, "ui.summary_always", "Always")}
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

  /** "N actions" / "1 action" label. Only rendered for scenes that HAVE
   *  actions; a zero-action scene is a blocker and renders via
   *  {@link summariseBlocker} instead. */
  private _actionCountLabel(scene: Scene): string {
    const n = scene.actions.length;
    const word =
      n === 1
        ? localize(this.hass, "ui.action_singular", "action")
        : localize(this.hass, "ui.action_plural", "actions");
    return `${n} ${word}`;
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
    return exposedActionLabel(
      action.service,
      this.availableActions,
      () =>
        this.schemas[action.service]?.name?.trim() || actionLabel(this.hass as any, action.service),
    );
  }

  private _onCategoryMenu(category: SceneCategory, id: string) {
    if (id === "run") this._emit("apply-category", { categoryId: category.id });
    else if (id === "traces") this._emit("show-traces", { category: category.id });
    else if (id === "simulate") this._emit("show-simulator", { category: category.id });
    else if (id === "auto") this._emit("show-auto-triggers", { category: category.id });
  }

  private _onSceneMenu(i: number, id: string) {
    if (id === "edit") this._emit("edit-scene", { index: i });
    else if (id === "duplicate") this._emit("duplicate-scene", { index: i });
    else if (id === "run") this._emit("run-scene-actions", { index: i });
    else if (id === "delete") this._emit("delete-scene", { index: i });
  }

  /** Severity-coloured problem indicator for a scene, or "" when the scene is
   *  clean/disabled. Folds shadowing, missing-entity and overlap hints into one
   *  icon with an aggregated multi-line tooltip. */
  private _problemFlag(scene: Scene) {
    const p = sceneProblems(scene);
    if (!p.severity) return "";
    const lines: string[] = [];
    if (p.shadowed) {
      lines.push(localize(this.hass, "ui.shadowed", "Never fires — shadowed by an earlier scene."));
    }
    if (p.missing.length) {
      lines.push(
        `${localize(this.hass, "ui.problem_missing", "Missing in Home Assistant:")} ${p.missing.join(", ")}`,
      );
    }
    if (p.overlap.length) {
      lines.push(
        `${localize(this.hass, "ui.problem_overlap", "Controlled by multiple groups:")} ${p.overlap.join(", ")}`,
      );
    }
    if (p.configIssues.length) {
      lines.push(
        `${localize(this.hass, "ui.problem_config", "Configuration problems:")} ${p.configIssues
          .map((c) => configIssueLabel(this.hass, c))
          .join(", ")}`,
      );
    }
    return html`<ambience-problem-flag
      .severity=${p.severity}
      .details=${lines}
      .summary=${lines.join("\n")}
    ></ambience-problem-flag>`;
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
        data-drag-index=${i}
        class="${this._drag.over === i ? "drag-over " : ""}${this._drag.from === i ? "dragging " : ""}${isDisabled ? "disabled" : ""}"
      >
        <span class="lead">
          ${
            scene.pinned
              ? html`<button
                class="pin"
                title=${unpinLabel}
                aria-label=${unpinLabel}
                @pointerdown=${(e: PointerEvent) => this._drag.start(i, e)}
                @click=${(e: Event) => {
                  e.stopPropagation();
                  // The pin doubles as the grab handle: a tap unpins, a drag
                  // reorders. The browser fires a trailing click after a pointer
                  // drag, so swallow that one — but CONSUME the flag so it's
                  // one-shot. Otherwise a stale `moved` (only otherwise reset on
                  // the next pointerdown) could suppress a later click that never
                  // went through the handle, e.g. keyboard-activating the pin.
                  if (this._drag.moved) {
                    this._drag.moved = false;
                    return;
                  }
                  this._emit("unpin-scene", { index: i });
                }}
              >
                📌
              </button>`
              : html`<span
                class="handle"
                title=${localize(this.hass, "ui.drag_to_reorder", "Drag to reorder")}
                @pointerdown=${(e: PointerEvent) => this._drag.start(i, e)}
                >⠿</span
              >`
          }
        </span>
        <span class="idx">${displayNum}</span>
        <span class="warn-slot">${this._problemFlag(scene)}</span>
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
                : scene.actions.length === 0
                  ? this._blockerSummary(scene)
                  : html`${this._whenSummary(scene)} ·
                    <span class="action-count"
                      >${this._actionCountLabel(scene)}</span
                    >${
                      scene.apply === "always"
                        ? html` ·
                          <span class="apply-every" data-test="apply-every"
                            >${localize(this.hass, "ui.apply_on_every_match", "Apply on every match")}</span
                          >`
                        : ""
                    }`
            }
          </div>
          ${
            this._expanded.has(i)
              ? html`
                <div class="scene-detail">
                  ${this._whenStacked(scene)}
                  ${
                    scene.actions.length === 0
                      ? html`<div class="noop-detail">
                        ${this._blockerSummary(scene)}
                      </div>`
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
                      </div>
                      ${
                        scene.apply === "always"
                          ? html`<div class="apply-every-detail" data-test="apply-every-detail">
                            ${localize(this.hass, "ui.apply_on_every_match", "Apply on every match")}
                          </div>`
                          : ""
                      }`
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
    // Only render sections that actually have scenes — when filtering to a
    // single category, a scope with no scenes in that category shows no header.
    const sections = this._sections().filter((section) => section.rows.length > 0);
    if (sections.length === 0) {
      // Nothing to show: an empty scope, or a category filter with no matches in
      // this scope. Still offer an Add button (defaulting to the filtered
      // category when one is active) so there's never a dead-end.
      const detail = this.filterCategory ? { category: this.filterCategory } : {};
      return html`
        <p class="empty">
          ${localize(this.hass, "ui.no_scenes_yet", "No scenes yet.")}
        </p>
        <button class="add" @click=${() => this._emit("add-scene", detail)}>
          ${localize(this.hass, "ui.add_scene", "+ Add scene")}
        </button>
      `;
    }
    // Show the coloured category header for every section, including when a single
    // category is filtered — the bar labels which category these scenes belong to.
    const showHeaders = this.categories.length > 0;
    return html`
      ${sections.map((section) => {
        // A section can only collapse if it has a header to click; orphan
        // sections (no matching category) always render their scenes.
        const collapsed =
          !!section.category && this.collapsedCategories.includes(section.category.id);
        return html`
          <div class="category-section">
            ${
              showHeaders && section.category
                ? this._renderSectionHeader(section.category, !collapsed, section.rows)
                : ""
            }
            ${
              collapsed
                ? ""
                : html`
                  <ul>
                    ${section.rows.map(([i, scene], n) => this._renderRow(i, scene, n + 1))}
                  </ul>
                  <button
                    class="add"
                    @click=${() => this._emit("add-scene", { category: section.category?.id })}
                  >
                    ${localize(this.hass, "ui.add_scene", "+ Add scene")}
                  </button>
                `
            }
          </div>
        `;
      })}
    `;
  }
}
