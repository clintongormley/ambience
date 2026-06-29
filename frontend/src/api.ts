/**
 * Typed wrappers over hass.callWS for Ambience WebSocket commands.
 */

import type {
  AreaConfig,
  AreaListItem,
  AutoTriggerList,
  BufferedUnit,
  ConditionInfo,
  DayConfig,
  ExposedAction,
  ExposedAssistants,
  FloorListItem,
  LuxRangeDef,
  LuxRangeStoreView,
  PeriodDef,
  PeriodStoreView,
  ReapplySettings,
  SceneCategory,
  Scope,
  ScopeConfig,
  ScopeSwitch,
  ServiceInfo,
  ServiceSchema,
  SimulateInputs,
  SimulateOverrides,
  SimulateScope,
  SimulateVerdicts,
  SwitchDefaults,
  WeatherConfig,
  WeatherGroup,
} from "./types.js";

// HA fires this on the event bus whenever an area is created/updated/removed.
export type AreaRegistryEvent = {
  data: { action: "create" | "update" | "remove"; area_id: string };
};

// HA fires this on the event bus whenever a floor is created/updated/removed.
export type FloorRegistryEvent = {
  data: { action: "create" | "update" | "remove"; floor_id: string };
};

// HA fires this whenever an entity is created/updated/removed in the registry —
// used to spot scope pause switches appearing/disappearing (e.g. when a scope
// is enabled/disabled), which don't touch the area/floor registry.
export type EntityRegistryEvent = {
  data: { action: "create" | "update" | "remove"; entity_id: string };
};

// HA panel components receive a `hass` object. We type only what we use,
// plus an index signature for the surface we hand to HA components like
// `<ha-form>` that expect the full HomeAssistant shape (hass.localize,
// hass.config, hass.themes, etc.).
export type HassConnection = {
  callWS<T = unknown>(message: Record<string, unknown>): Promise<T>;
  // Live entity states, keyed by entity_id. Optional — simpler mocks omit it.
  states?: Record<string, { state?: string; attributes?: Record<string, unknown> }>;
  // HA's service-call entry point, used to toggle switch entities.
  callService?(domain: string, service: string, data?: Record<string, unknown>): Promise<unknown>;
  connection: {
    subscribeEvents<T>(callback: (event: T) => void, eventType: string): Promise<() => void>;
    // Generic subscription (HA's `subscribeMessage`). Used for the
    // `render_template` live preview — the same command Dev Tools → Template
    // drives. Optional so simpler connection mocks remain valid.
    subscribeMessage?<T>(
      callback: (message: T) => void,
      subscribeMessage: Record<string, unknown>,
    ): Promise<() => void>;
  };
  [key: string]: unknown;
};

export async function listAreas(hass: HassConnection): Promise<AreaListItem[]> {
  return hass.callWS({ type: "ambience/areas/list" });
}

export async function getArea(hass: HassConnection, areaId: string): Promise<AreaConfig> {
  return hass.callWS({ type: "ambience/area/get", area_id: areaId });
}

export async function saveArea(
  hass: HassConnection,
  areaId: string,
  config: AreaConfig,
  change?: ChangeDescriptor,
): Promise<{ ok: true; config: AreaConfig }> {
  return hass.callWS({
    type: "ambience/area/save",
    area_id: areaId,
    config,
    ...(change ? { change } : {}),
  });
}

export async function listFloors(hass: HassConnection): Promise<FloorListItem[]> {
  return hass.callWS({ type: "ambience/floors/list" });
}

export async function getFloor(hass: HassConnection, floorId: string): Promise<ScopeConfig> {
  return hass.callWS({ type: "ambience/floor/get", floor_id: floorId });
}

export async function saveFloor(
  hass: HassConnection,
  floorId: string,
  config: ScopeConfig,
  change?: ChangeDescriptor,
): Promise<{ ok: true; config: ScopeConfig }> {
  return hass.callWS({
    type: "ambience/floor/save",
    floor_id: floorId,
    config,
    ...(change ? { change } : {}),
  });
}

export async function getHouse(hass: HassConnection): Promise<ScopeConfig> {
  return hass.callWS({ type: "ambience/house/get" });
}

export async function saveHouse(
  hass: HassConnection,
  config: ScopeConfig,
  change?: ChangeDescriptor,
): Promise<{ ok: true; config: ScopeConfig }> {
  return hass.callWS({ type: "ambience/house/save", config, ...(change ? { change } : {}) });
}

export async function listConditions(hass: HassConnection): Promise<ConditionInfo[]> {
  return hass.callWS({ type: "ambience/conditions/list" });
}

/** The install identity (the single config entry's id), or null mid-teardown.
 *  The frontend keys its per-browser hint-dismissal state by this so a delete +
 *  recreate (which yields a new entry_id) re-shows the optional setup hints. */
export async function getInstallId(hass: HassConnection): Promise<string | null> {
  const res = await hass.callWS<{ install_id: string | null }>({ type: "ambience/install_id" });
  return res.install_id;
}

/** Panel-relevant config-entry options the frontend gates UI on. */
export interface AmbienceOptions {
  /** Whether the AI authoring tab (beta) is enabled. Off by default; the user
   *  opts in via the integration's options. */
  enable_ai_tab: boolean;
}

/** Read the panel-relevant integration options (e.g. whether to show the AI tab). */
export async function getOptions(hass: HassConnection): Promise<AmbienceOptions> {
  return hass.callWS<AmbienceOptions>({ type: "ambience/options" });
}

/** Read-only list of the watches the engine derives from a scope's scenes,
 *  for the Auto-triggers display. `scope_id` is omitted for the house scope. */
export async function listAutoTriggers(
  hass: HassConnection,
  scope_kind: "area" | "floor" | "house",
  scope_id?: string | null,
  category?: string,
): Promise<AutoTriggerList> {
  const msg: Record<string, unknown> = { type: "ambience/auto_triggers/list", scope_kind };
  if (scope_id != null) msg.scope_id = scope_id;
  if (category != null) msg.category = category;
  return hass.callWS(msg);
}

export async function listExposedActions(hass: HassConnection): Promise<ExposedAction[]> {
  return hass.callWS({ type: "ambience/exposed_actions/list" });
}

export async function saveExposedActions(
  hass: HassConnection,
  actions: ExposedAction[],
): Promise<{ ok: true }> {
  return hass.callWS({ type: "ambience/exposed_actions/save", actions });
}

export async function listServices(hass: HassConnection): Promise<ServiceInfo[]> {
  return hass.callWS({ type: "ambience/services/list" });
}

export async function getServiceSchema(
  hass: HassConnection,
  service: string,
): Promise<ServiceSchema> {
  return hass.callWS({ type: "ambience/services/get_schema", service });
}

/** The websocket scope selector for a scope: `{area_id}`, `{floor_id}`, or
 *  `{house: true}`. Spread into a command message. */
function scopeFields(scope: Scope): Record<string, unknown> {
  if (scope.kind === "area") return { area_id: scope.id };
  if (scope.kind === "floor") return { floor_id: scope.id };
  return { house: true };
}

export async function applyScenes(
  hass: HassConnection,
  scope: Scope,
  categoryId?: string,
): Promise<{ ok: true }> {
  const msg: Record<string, unknown> = {
    type: "ambience/apply",
    ...scopeFields(scope),
  };
  if (categoryId !== undefined) msg.category_id = categoryId;
  return hass.callWS(msg);
}

export async function runSceneActions(
  hass: HassConnection,
  scope: Scope,
  sceneIndex: number,
): Promise<{ ran: number; scene_name: string | null }> {
  return hass.callWS({
    type: "ambience/scene/run_actions",
    scene_index: sceneIndex,
    ...scopeFields(scope),
  });
}

export async function listPeriods(hass: HassConnection): Promise<PeriodStoreView> {
  return hass.callWS({ type: "ambience/time_of_day_periods/list" });
}

export async function savePeriods(
  hass: HassConnection,
  custom: Record<string, PeriodDef>,
  hidden: string[],
): Promise<{ ok: true }> {
  return hass.callWS({
    type: "ambience/time_of_day_periods/save",
    custom,
    hidden,
  });
}

export async function resetPeriods(hass: HassConnection): Promise<{ ok: true }> {
  return hass.callWS({ type: "ambience/time_of_day_periods/reset" });
}

export async function listLuxRanges(hass: HassConnection): Promise<LuxRangeStoreView> {
  return hass.callWS({ type: "ambience/lux_ranges/list" });
}

export async function saveLuxRanges(
  hass: HassConnection,
  custom: Record<string, LuxRangeDef>,
  hidden: string[],
): Promise<{ ok: true }> {
  return hass.callWS({ type: "ambience/lux_ranges/save", custom, hidden });
}

export async function resetLuxRanges(hass: HassConnection): Promise<{ ok: true }> {
  return hass.callWS({ type: "ambience/lux_ranges/reset" });
}

export async function getDayConfig(hass: HassConnection): Promise<DayConfig> {
  return hass.callWS({ type: "ambience/conditions/day/config/list" });
}

export async function saveDayConfig(
  hass: HassConnection,
  workday_sensor: string | null,
  workday_calendar: string | null,
): Promise<{ ok: true }> {
  return hass.callWS({
    type: "ambience/conditions/day/config/save",
    workday_sensor,
    workday_calendar,
  });
}

export async function getWeatherConfig(hass: HassConnection): Promise<WeatherConfig> {
  return hass.callWS({ type: "ambience/conditions/weather/config/list" });
}

export async function saveWeatherConfig(
  hass: HassConnection,
  entity: string | null,
  groups: WeatherGroup[],
): Promise<{ ok: true }> {
  return hass.callWS({
    type: "ambience/conditions/weather/config/save",
    entity,
    groups,
  });
}

/** Best-effort list of plausible states for an entity. Returns `[]` when
 *  the backend has no domain map AND the entity has no current state. */
export async function getKnownStates(
  hass: HassConnection,
  entity_id: string,
): Promise<{ states: string[] }> {
  return hass.callWS({ type: "ambience/state/known_states", entity_id });
}

/** Possible values for an entity attribute, derived from its companion list
 *  attribute (e.g. a light's `effect` → `effect_list`), always including the
 *  current value. `[]` when there's nothing to offer. */
export async function getKnownAttributeValues(
  hass: HassConnection,
  entity_id: string,
  attribute: string,
): Promise<{ values: string[] }> {
  return hass.callWS({
    type: "ambience/state/known_attribute_values",
    entity_id,
    attribute,
  });
}

export async function getSwitchDefaults(hass: HassConnection): Promise<SwitchDefaults> {
  return hass.callWS({ type: "ambience/switch_defaults/list" });
}

/** Map each scope to its (possibly renamed) Ambience switch entity_id. */
export async function listSwitches(hass: HassConnection): Promise<ScopeSwitch[]> {
  return hass.callWS({ type: "ambience/switches/list" });
}

/** Set a scope's permanent enable/disable flag (non-hierarchical). */
export async function setScopeEnabled(
  hass: HassConnection,
  scope: Scope,
  enabled: boolean,
): Promise<{ ok: true }> {
  return hass.callWS({
    type: "ambience/set_scope_enabled",
    ...scopeFields(scope),
    enabled,
  });
}

export async function saveSwitchDefaults(
  hass: HassConnection,
  name: string,
  auto_on_delay_seconds: number,
): Promise<{ ok: true }> {
  return hass.callWS({
    type: "ambience/switch_defaults/save",
    name,
    auto_on_delay_seconds,
  });
}

export async function getReapplySettings(hass: HassConnection): Promise<ReapplySettings> {
  return hass.callWS({ type: "ambience/reapply/list" });
}

export async function saveReapplySettings(
  hass: HassConnection,
  enabled: boolean,
  interval_seconds: number,
): Promise<{ ok: true }> {
  return hass.callWS({
    type: "ambience/reapply/save",
    enabled,
    interval_seconds,
  });
}

export async function getExposedAssistants(hass: HassConnection): Promise<ExposedAssistants> {
  return hass.callWS({ type: "ambience/exposed_assistants/list" });
}

export async function saveExposedAssistants(
  hass: HassConnection,
  expose_assist: boolean,
  expose_google: boolean,
  expose_alexa: boolean,
): Promise<{ ok: true }> {
  return hass.callWS({
    type: "ambience/exposed_assistants/save",
    expose_assist,
    expose_google,
    expose_alexa,
  });
}

export async function listCategories(hass: HassConnection): Promise<SceneCategory[]> {
  const res = await hass.callWS<{ categories: SceneCategory[] }>({
    type: "ambience/categories/list",
  });
  return res.categories;
}

export async function saveCategories(
  hass: HassConnection,
  categories: SceneCategory[],
): Promise<void> {
  // The backend sends no result payload for this command.
  await hass.callWS({ type: "ambience/categories/save", categories });
}

export async function deleteCategory(hass: HassConnection, category_id: string): Promise<void> {
  // The backend sends no result payload for this command.
  await hass.callWS({ type: "ambience/categories/delete", category_id });
}

export async function listTraces(hass: HassConnection): Promise<BufferedUnit[]> {
  const res = await hass.callWS<{ traces: BufferedUnit[] }>({
    type: "ambience/traces/list",
  });
  return res.traces;
}

export async function clearTraces(hass: HassConnection): Promise<void> {
  // The backend sends no result payload for this command.
  await hass.callWS({ type: "ambience/traces/clear" });
}

export type LiveEntry = {
  matched: number | null;
  applied: number | null;
};

export type LiveUnit = {
  scope_kind: string;
  scope_id: string | null;
  category: string;
} & LiveEntry;

export type LiveMessage = { type: "snapshot"; units: LiveUnit[] } | ({ type: "update" } & LiveUnit);

export type ChangeDescriptor = { action: string; scene_name: string | null };

export type HistoryAction = ChangeDescriptor & {
  scope_kind: "house" | "area" | "floor";
  scope_id: string | null;
};

export type HistorySnapshot = {
  op: "record" | "undo" | "redo" | null;
  can_undo: boolean;
  can_redo: boolean;
  undo: HistoryAction | null;
  redo: HistoryAction | null;
  undo_count: number;
  redo_count: number;
  changed_scope: { scope_kind: string; scope_id: string | null } | null;
  // True only on the push echoed to the tab that caused the change, so it can
  // skip a redundant self-reload.
  is_self: boolean;
};

export type HistoryApplyResult = {
  ok: boolean;
  scope_kind?: string;
  scope_id?: string | null;
  config?: ScopeConfig;
};

/** Subscribe to live per-unit scene state (matched + applied). Resolves to an
 *  unsubscribe function — a no-op when the connection lacks subscribeMessage or
 *  the command is rejected (e.g. a backend older than this frontend). Never
 *  rejects, so a missing command degrades to "no live dots" rather than tearing
 *  down the registry subscriptions awaited alongside it. */
export async function subscribeLiveScenes(
  hass: HassConnection,
  onMessage: (msg: LiveMessage) => void,
): Promise<() => void> {
  const conn = hass.connection;
  if (!conn.subscribeMessage) return () => {};
  try {
    // Call as a method on `conn` — HA's subscribeMessage relies on `this`.
    return await conn.subscribeMessage<LiveMessage>(onMessage, {
      type: "ambience/live/subscribe",
    });
  } catch {
    return () => {};
  }
}

/** Subscribe to the undo/redo snapshot stream. Resolves to an unsubscribe
 *  function — a no-op when the connection lacks subscribeMessage or the command
 *  is rejected (a backend older than this frontend), so a missing command
 *  degrades to "no undo toolbar" rather than throwing. */
export async function subscribeHistory(
  hass: HassConnection,
  onMessage: (msg: HistorySnapshot) => void,
): Promise<() => void> {
  const conn = hass.connection;
  if (!conn.subscribeMessage) return () => {};
  try {
    return await conn.subscribeMessage<HistorySnapshot>(onMessage, {
      type: "ambience/history/subscribe",
    });
  } catch {
    return () => {};
  }
}

export async function undoChange(hass: HassConnection): Promise<HistoryApplyResult> {
  return hass.callWS({ type: "ambience/history/undo" });
}

export async function redoChange(hass: HassConnection): Promise<HistoryApplyResult> {
  return hass.callWS({ type: "ambience/history/redo" });
}

// Turn a JSON-serialisable payload into a downloaded file. Shared by the scope
// diagnostics download and the AI bundle download.
function triggerJsonDownload(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  // The anchor must be connected to the document for the synthetic click to
  // trigger a download in mobile WebViews (e.g. the HA Companion app).
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Mobile browsers fetch the blob URL asynchronously after the click; revoking
  // it synchronously invalidates it before the download starts, so defer it.
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

// Filename-safe slug: lowercase, accents stripped, runs of non-alphanumerics
// collapsed to single hyphens, no leading/trailing hyphens. "" if the input has
// no slug-safe characters (e.g. an emoji-only category name).
function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function downloadScopeDiagnostics(
  hass: HassConnection,
  scope: { scope_kind: string; scope_id: string | null },
  category: string,
  categoryLabel?: string,
): Promise<void> {
  const data = await hass.callWS<unknown>({
    type: "ambience/diagnostics/scope",
    scope_kind: scope.scope_kind,
    scope_id: scope.scope_id,
    category,
  });
  // The WS call selects scenes by the stable category id; the filename uses the
  // human-readable name (slugified) so a renamed category — e.g. "General"
  // renamed to "Lights" but still keyed `general` — reads correctly. Fall back
  // to the id when no label is given or it slugifies to empty.
  const label = slugify(categoryLabel ?? "") || category;
  triggerJsonDownload(
    data,
    `ambience-${scope.scope_kind}-${scope.scope_id ?? "house"}-${label}.json`,
  );
}

// --- AI bundle + config import --------------------------------------------

// One scope's identity, mirrored from the import envelope's `scope` field.
export type ScopeRef =
  | { kind: "area"; id: string }
  | { kind: "floor"; id: string }
  | { kind: "house" };

/** Fetch the live AI bundle (catalog + actions + definitions + config + traces). */
export async function getAiBundle(hass: HassConnection): Promise<unknown> {
  return hass.callWS({ type: "ambience/ai_bundle" });
}

/** Download the AI bundle as a JSON file the user hands to an AI. */
export async function downloadAiBundle(hass: HassConnection): Promise<void> {
  triggerJsonDownload(await getAiBundle(hass), "ambience-ai-bundle.json");
}

/** Validate a ScopeConfig's shape without saving (throws on invalid config). */
export async function validateScopeConfig(
  hass: HassConnection,
  config: ScopeConfig,
): Promise<void> {
  await hass.callWS({ type: "ambience/validate", config });
}

/** Read a scope's current config, dispatching by scope kind. */
export async function getScopeConfig(hass: HassConnection, scope: ScopeRef): Promise<ScopeConfig> {
  if (scope.kind === "area") return getArea(hass, scope.id);
  if (scope.kind === "floor") return getFloor(hass, scope.id);
  return getHouse(hass);
}

/** Save a scope's config, dispatching by scope kind. */
export async function saveScopeConfig(
  hass: HassConnection,
  scope: ScopeRef,
  config: ScopeConfig,
  change?: ChangeDescriptor,
): Promise<{ ok: true; config: ScopeConfig }> {
  if (scope.kind === "area") return saveArea(hass, scope.id, config, change);
  if (scope.kind === "floor") return saveFloor(hass, scope.id, config, change);
  return saveHouse(hass, config, change);
}

export async function simulateInputs(
  hass: HassConnection,
  scope: SimulateScope,
  category: string,
): Promise<SimulateInputs> {
  return hass.callWS({
    type: "ambience/simulate/inputs",
    scope_kind: scope.scope_kind,
    scope_id: scope.scope_id,
    category,
  });
}

export async function simulate(
  hass: HassConnection,
  scope: SimulateScope,
  category: string,
  now: string,
  overrides: SimulateOverrides,
  verdicts: SimulateVerdicts,
): Promise<BufferedUnit> {
  const res = await hass.callWS<{ result: BufferedUnit }>({
    type: "ambience/simulate",
    scope_kind: scope.scope_kind,
    scope_id: scope.scope_id,
    category,
    now,
    overrides,
    verdicts,
  });
  return res.result;
}
