/**
 * Types mirroring the backend's Storage shape and WS responses.
 * Keep in sync with custom_components/ambience/store.py and websocket.py.
 */

export type Scene = {
  name?: string;
  // The category this scene belongs to (SceneCategory.id). Required — every scene is
  // categorised; a fresh install seeds a "General" category.
  category: string;
  // Uniform {condition_name: predicate} map.
  // An absent key or `null` value is a wildcard for that condition.
  when: { [condition: string]: unknown };
  actions: ActionSpec[];
  // Sole sort key; higher = more important. Maintained by the backend.
  priority?: number;
  // True when the user fixed this scene's position by dragging it.
  pinned?: boolean;
  // Absent or true = enabled; false = disabled. A disabled scene is retained
  // and keeps its position but is ignored by automatic evaluation.
  enabled?: boolean;
  // Transient (response-only): index of an earlier scene that shadows this one,
  // or null/absent. Never persisted.
  shadowed_by?: number | null;
};

// A user-defined grouping of scenes. Stored separately; scenes reference it by id.
// Every scene belongs to exactly one category; at least one category always exists.
// `icon` is an mdi name (e.g. "mdi:lightbulb"); `color` is a CATEGORY_COLORS id.
export type SceneCategory = { id: string; name: string; icon?: string; color?: string };

export type ActionSpec = {
  service: string; // "domain.service"
  entity_ids: string[];
  params: Record<string, unknown>;
};

// One entry in the user's exposed-actions list (Configuration → Actions).
//
// `visible_fields` and `defaults` are orthogonal:
//   - in visible_fields only       → field shown in the scene editor, empty
//   - in defaults only             → field hidden, default sent at execution
//                                    (= old "locked" mode)
//   - in both                      → field shown pre-filled with the default
//   - in neither                   → field not used
export type ExposedAction = {
  id: string; // "domain.service"; primary key
  label: string; // user-friendly display name; "" allowed
  visible_fields: string[]; // shown in the scene editor
  defaults: Record<string, unknown>; // applied at execution; scene params override
};

// HA service listing for the settings UI's service picker.
export type ServiceInfo = {
  id: string; // "domain.service"
  name: string; // HA's predefined human label (from services.yaml); "" if none
  description: string;
  target: unknown; // HA's target metadata; passed through unchanged
};

// One service's field schema, as returned by ambience/services/get_schema.
export type ServiceSchema = {
  fields: Record<string, ServiceField>;
  target: unknown;
};

export type ServiceField = {
  name?: string; // human-readable label (e.g. "Brightness"); from services.yaml
  selector?: unknown; // HA selector dict; ha-form consumes verbatim
  description?: string;
  required?: boolean;
  default?: unknown;
  example?: unknown;
};

// Warning shape returned by exposed_actions/save (parallels other warnings).
export type ExposedActionWarning = {
  scope_kind: string;
  scope_id: string | null;
  scene_name: string;
  reason: string;
};

export type SwitchDefaults = {
  name: string;
  auto_on_delay_seconds: number;
};

export type ReapplySettings = {
  enabled: boolean;
  interval_seconds: number;
};

// One scope's Ambience switch entity, as resolved by the backend (the
// entity_id can be user-renamed, so it can't be derived client-side).
export type ScopeSwitch = {
  scope_kind: "house" | "floor" | "area";
  scope_id: string | null;
  entity_id: string;
};

export type AreaConfig = {
  // Ordered list — array order is authoritative for the engine.
  scenes: Scene[];
  enabled?: boolean; // permanent per-scope enable (default true when absent)
};

// `name` is resolved by the backend from HA's area registry, not stored.
export type AreaListItem = {
  area_id: string;
  name: string;
};

export type ConditionInfo = {
  name: string;
  description: string;
  predicate_help: string;
  // Widget hint for the scene editor: "time_of_day" | "state_predicate" | "text" | ...
  input: string;
  // Linearisation-slot order; higher sorts earlier. Default 0.
  priority: number;
};

export type SunAnchor = "sunrise" | "sunset" | "noon" | "midnight" | "dawn" | "dusk";

export type SunClamp = { dir: "not_before" | "not_after"; hh: number; mm: number };

export type TimeEndpoint =
  | { kind: "time"; hh: number; mm: number }
  | { kind: "sun"; anchor: SunAnchor; offset_min: number; clamp?: SunClamp | null };

export type TimeRange = { from: TimeEndpoint; to: TimeEndpoint };

export type PeriodRef = { period: string };

export type TimeOfDayPredicate = null | PeriodRef | TimeRange | Array<PeriodRef | TimeRange>;

export type PeriodDef = TimeRange & { label?: string | null };

export type PeriodStoreView = {
  builtins: Record<string, PeriodDef>;
  custom: Record<string, PeriodDef>;
  hidden: string[];
};

// --- lux condition ----------------------------------------------------------

export type LuxQuant = "any" | "all";

/** A named lux band: half-open `min <= lux < max`, either bound optional. */
export type LuxRangeDef = { min?: number | null; max?: number | null; label?: string | null };

export type LuxRangeStoreView = {
  builtins: Record<string, LuxRangeDef>;
  custom: Record<string, LuxRangeDef>;
  hidden: string[];
};

/** Per-scene predicate. `null` = wildcard (no lux constraint). A predicate
 *  references a named `range` XOR an inline `min`/`max` band. */
export interface LuxPredicate {
  sensors: string[]; // sensor.* (illuminance) entity_ids; empty = match-anything
  range?: string; // a named lux range id
  min?: number; // inline band lower bound (inclusive)
  max?: number; // inline band upper bound (exclusive)
  quant?: LuxQuant; // default "any"
}

export type DayConfig = {
  workday_sensor: string | null;
  workday_calendar: string | null;
};

export type DayItem =
  | { kind: "weekday"; days: number[] }
  | { kind: "day_of_month"; days: string }
  | { kind: "date"; month: number; day: number }
  | { kind: "date_range"; from: { month: number; day: number }; to: { month: number; day: number } }
  | { kind: "last_day" }
  | { kind: "workday" }
  | { kind: "holiday" }
  | { kind: "first_workday" }
  | { kind: "last_workday" };

export type DayPredicate = null | { include: DayItem[]; exclude: DayItem[] };

export type WeatherGroup = {
  id: string;
  label: string;
  conditions: string[];
};

export type WeatherConfig = {
  entity: string | null;
  groups: WeatherGroup[];
};

export type WeatherThreshold = {
  attribute: string;
  op: "<" | "<=" | ">" | ">=";
  value: number;
};

export type WeatherPredicate = null | { groups: string[]; thresholds: WeatherThreshold[] };

// --- sun condition ----------------------------------------------------------

export type SunElevation = { min?: number; max?: number };
export type SunRange = { from: number; to: number };
export type SunAzimuth = { sectors?: string[]; ranges?: SunRange[] };

/** Top-level sun predicate. `null` = no constraint (wildcard). At least one of
 *  `elevation`/`azimuth` is present when non-null. */
export type SunPredicate = null | { elevation?: SunElevation; azimuth?: SunAzimuth };

// --- state condition --------------------------------------------------------

export type StateForDuration = { h: number; m: number; s: number };

export type StateAtom = {
  /** Comparison operator. For is/is_not, `states` is a list of values
   *  (membership check). For `>`, `>=`, `<`, `<=`, `states` is a single
   *  numeric threshold (as a string). */
  kind: "is" | "is_not" | ">" | ">=" | "<" | "<=";
  entity_id: string;
  /** When set, compare entity.attributes[attribute] (stringified) instead of
   *  entity.state. Leave null/undefined to compare the state itself. */
  attribute?: string | null;
  states: string[];
  for?: StateForDuration | null;
};

export type StateGroup = { kind: "and" | "or"; items: StateExpr[] };
export type StateNot = { kind: "not"; item: StateExpr };
export type StateExpr = StateAtom | StateGroup | StateNot;

/** Top-level state predicate. `null` = no constraint. */
export type StatePredicate = StateExpr | null;

// --- people condition -------------------------------------------------------

export type PeopleQuant = "any" | "everyone" | "nobody";

/** Per-scene predicate. `null` = wildcard (no presence constraint). */
export interface PeoplePredicate {
  who?: string[]; // person.* entity_ids; empty/absent = all persons
  quant?: PeopleQuant; // default "any"
  where?: string; // positive location: "home" | "zone.*"; default "home"
  negate?: boolean; // default false; true = NOT at `where`
  for?: { h: number; m: number; s: number } | null;
}

// --- occupancy condition ----------------------------------------------------

export type OccupancyQuant = "any" | "all";

/** Per-scene predicate. `null` = wildcard (no presence constraint). */
export interface OccupancyPredicate {
  sensors: string[]; // binary_sensor.* entity_ids; empty = match-anything
  occupied?: boolean; // default true; false = vacant
  quant?: OccupancyQuant; // default "any"
  for?: { h: number; m: number; s: number } | null;
  negate?: boolean; // default false; inverts the whole match (incl. `for`)
}

// --- script condition -------------------------------------------------------

/** Per-scene predicate. `null` = wildcard. */
export type ScriptPredicate = null | {
  script: string;
  args?: Record<string, unknown>;
  triggers?: string[];
};

// --- template condition -----------------------------------------------------

/** Per-scene predicate: a Jinja template rendered to a bool. `null` = wildcard. */
export type TemplatePredicate = null | { template: string };

// --- scope ---------------------------------------------------------------

// Scope = the activation surface for a scene list. Area: HA area. Floor:
// HA floor. House: singleton — id is omitted.
export type Scope =
  | { kind: "area"; id: string }
  | { kind: "floor"; id: string }
  | { kind: "house" };

// A selectable destination for a scene in the editor: a scope plus a display label.
export type ScopeOption = { scope: Scope; label: string };

export type FloorListItem = {
  floor_id: string;
  name: string;
};

// Storage shape is identical for area, floor, and house: alias for clarity.
export type ScopeConfig = AreaConfig;

// --- Auto-triggers (read-only display) -------------------------------------
// One derived "watch" the engine sets up for a scope, computed from its scenes.
// Purely informational — there are no enable/disable controls (auto-triggers
// are always on). Entities get one row each; clock times / periodic re-check /
// date rollover collapse into a single `time` group; sun events into a `sun`
// group.
export type AutoTrigger = { key: string } & (
  | { kind: "entity"; entity_id: string }
  | {
      kind: "time";
      clocks: { hour: number; minute: number }[];
      has_time: boolean;
      date_rollover: boolean;
    }
  | { kind: "sun"; suns: { anchor: string; offset: number }[] }
);

export type AutoTriggerList = {
  triggers: AutoTrigger[];
  // True when a scene's deps may be incomplete (e.g. an opaque script condition).
  opaque: boolean;
};

// --- trace viewer (mirrors custom_components/ambience/trace.py buffered_unit_to_dict) ---

export type TraceCause = {
  kind:
    | "entity"
    | "clock"
    | "sun"
    | "has_time"
    | "duration"
    | "switch"
    | "manual"
    | "startup"
    | "reloaded"
    | "simulated"
    | "unknown";
  entity_id: string | null;
  old: string | null;
  new: string | null;
  detail: string | null;
};
// Backend traces serialise raw stored action dicts and treat entity_ids/params
// as optional (trace.py reads them with .get) — looser than ActionSpec, which
// is the save-path shape with both required.
export type TraceAction = {
  service: string;
  entity_ids?: string[];
  params?: Record<string, unknown>;
};
export type TracePredicate = {
  condition_key: string;
  passed: boolean;
  detail: string | null;
  // entity_ids this predicate references, for inline more-info links in the
  // trace. Optional so a trace captured before this field existed (or an
  // ambient condition with no entities) renders as plain text.
  entity_ids?: string[];
};
export type TraceSceneEval = {
  index: number;
  name: string | null;
  matched: boolean;
  evaluated: boolean;
  disabled?: boolean;
  predicates: TracePredicate[];
};
export type TraceExplanation = { winner_index: number | null; scenes: TraceSceneEval[] };
export type TraceOutcome =
  | "acted"
  | "debounced"
  | "no_op"
  | "no_match"
  | "skipped_switch_off"
  | "skipped_scope_disabled";
export type BufferedUnit = {
  event_id: string | null;
  timestamp: string | null;
  cause: TraceCause;
  scope_kind: "area" | "floor" | "house";
  scope_id: string | null;
  scope_name: string | null;
  category: string;
  category_name: string | null;
  switch_state: string;
  outcome: TraceOutcome;
  winner_name: string | null;
  actions: TraceAction[];
  explanation: TraceExplanation | null;
};

// --- what-if simulator (mirrors custom_components/ambience/simulate.py) ---

export type SimulateControl = "select" | "number" | "text";

export type SimulateAttribute = { name: string; control: "number" | "text"; live_value: unknown };

export type SimulateEntityKnob = {
  kind: "entity";
  entity_id: string;
  control: SimulateControl;
  options?: string[];
  live_state: string | null;
  attributes: SimulateAttribute[];
};

export type SimulateVerdictKnob = {
  kind: "verdict";
  condition: "script" | "template";
  key: string;
  label: string;
  entity_id?: string;
  live_value: boolean;
};

export type SimulateKnob = SimulateEntityKnob | SimulateVerdictKnob;

export type SimulateInputs = { knobs: SimulateKnob[]; has_time: boolean };

export type SimulateScope = { scope_kind: string; scope_id: string | null };
export type SimulateOverrides = Record<
  string,
  {
    state?: string;
    attributes?: Record<string, unknown>;
    /** How long the entity has held this state — backdates its clock so `for:`
     *  conditions evaluate as intended. Omitted/zero reads as just-changed. */
    for?: StateForDuration;
  }
>;
export type SimulateVerdicts = Record<string, Record<string, boolean>>;
