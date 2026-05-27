/**
 * Types mirroring the backend's Storage shape and WS responses.
 * Keep in sync with custom_components/ambience/store.py and websocket.py.
 */

export type Rule = {
  name?: string;
  // Uniform {matcher_name: predicate} map. `scene` is just another key.
  // An absent key or `null` value is a wildcard for that matcher.
  when: { [matcher: string]: unknown };
  actions: ActionSpec[];
};

export type ActionSpec = {
  action: string;
  entity_ids: string[];
  params: Record<string, unknown>;
  // Set only when `action === "script"` — the chosen HA script entity id
  // (e.g. "script.foo"). Backend stores this verbatim and uses it to look up
  // the script's fields/target metadata at execution time.
  script?: string;
};

export type SwitchDefaults = {
  name: string;
  auto_on_delay_seconds: number;
};

export type ScopeSwitchOverride = {
  name: string | null;
  auto_on_delay_seconds: number | null;
};

export type AreaConfig = {
  // Ordered list — array order is authoritative for the engine.
  rules: Rule[];
  // When true the backend keeps `rules` sorted on every save.
  auto_sort: boolean;
  switch?: ScopeSwitchOverride & { off_at?: string | null };
};

// `name` is resolved by the backend from HA's area registry, not stored.
export type AreaListItem = {
  area_id: string;
  name: string;
};

export type MatcherInfo = {
  name: string;
  description: string;
  predicate_help: string;
  // Widget hint for the rule editor: "scene_combobox" | "text" | ...
  input: string;
  // Linearisation-slot order; lower sorts earlier. Default 1000, `scene` is 0.
  priority: number;
};

export type ParamSpec = {
  name: string;
  type: "int" | "number" | "string" | "boolean";
  required: boolean;
  default?: unknown;
  min?: number;
  max?: number;
  description?: string;
  unit?: string;
};

export type ActionInfo = {
  name: string;
  description: string;
  domains: string[];
  target_params: ParamSpec[];
  // "standard" actions are config-driven (set_light, …); "script" actions
  // dispatch to an HA script chosen at edit time. The dispatch shapes
  // are different enough that the editor and summariser branch on this.
  kind: "standard" | "script";
};

export type DryRunResult = {
  matched_rule_index: number | null;
  rule_name: string | null;
  actions: ActionSpec[];
  snapshots_described: Record<string, string | null>;
  switch_state: "on" | "off" | "unknown";
};

export type SunAnchor =
  | "sunrise"
  | "sunset"
  | "noon"
  | "midnight"
  | "dawn"
  | "dusk";

export type TimeEndpoint =
  | { kind: "time"; hh: number; mm: number }
  | { kind: "sun"; anchor: SunAnchor; offset_min: number };

export type TimeRange = { from: TimeEndpoint; to: TimeEndpoint };

export type PeriodRef = { period: string };

export type TimeOfDayPredicate =
  | null
  | PeriodRef
  | TimeRange
  | Array<PeriodRef | TimeRange>;

export type PeriodDef = TimeRange & { label?: string | null };

export type PeriodStoreView = {
  builtins: Record<string, PeriodDef>;
  custom: Record<string, PeriodDef>;
  hidden: string[];
};

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

export type DayPredicate =
  | null
  | { include: DayItem[]; exclude: DayItem[] };

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

export type WeatherPredicate =
  | null
  | { groups: string[]; thresholds: WeatherThreshold[] };

// --- state matcher --------------------------------------------------------

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

// --- script matcher -------------------------------------------------------

/** Per-rule predicate. `null` = wildcard. */
export type ScriptPredicate =
  | null
  | { script: string; args?: Record<string, unknown> };

// --- scope ---------------------------------------------------------------

// Scope = the activation surface for a rule list. Area: HA area. Floor:
// HA floor. House: singleton — id is omitted.
export type Scope =
  | { kind: "area"; id: string }
  | { kind: "floor"; id: string }
  | { kind: "house" };

export type FloorListItem = {
  floor_id: string;
  name: string;
};

// Storage shape is identical for area, floor, and house: alias for clarity.
export type ScopeConfig = AreaConfig;
