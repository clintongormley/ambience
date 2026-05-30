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
  service: string;            // "domain.service"
  entity_ids: string[];
  params: Record<string, unknown>;
};

// One entry in the user's exposed-actions list (Configuration → Actions).
//
// `visible_fields` and `defaults` are orthogonal:
//   - in visible_fields only       → field shown in the rule editor, empty
//   - in defaults only             → field hidden, default sent at execution
//                                    (= old "locked" mode)
//   - in both                      → field shown pre-filled with the default
//   - in neither                   → field not used
export type ExposedAction = {
  id: string;                 // "domain.service"; primary key
  label: string;              // user-friendly display name; "" allowed
  visible_fields: string[];   // shown in the rule editor
  defaults: Record<string, unknown>; // applied at execution; rule params override
};

// HA service listing for the settings UI's service picker.
export type ServiceInfo = {
  id: string;                 // "domain.service"
  description: string;
  target: unknown;            // HA's target metadata; passed through unchanged
};

// One service's field schema, as returned by ambience/services/get_schema.
export type ServiceSchema = {
  fields: Record<string, ServiceField>;
  target: unknown;
};

export type ServiceField = {
  name?: string;              // human-readable label (e.g. "Brightness"); from services.yaml
  selector?: unknown;         // HA selector dict; ha-form consumes verbatim
  description?: string;
  required?: boolean;
  default?: unknown;
  example?: unknown;
};

// Warning shape returned by exposed_actions/save (parallels other warnings).
export type ExposedActionWarning = {
  scope_kind: string;
  scope_id: string | null;
  rule_name: string;
  reason: string;
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

// --- sun matcher ----------------------------------------------------------

export type SunElevation = { min?: number; max?: number };
export type SunRange = { from: number; to: number };
export type SunAzimuth = { sectors?: string[]; ranges?: SunRange[] };

/** Top-level sun predicate. `null` = no constraint (wildcard). At least one of
 *  `elevation`/`azimuth` is present when non-null. */
export type SunPredicate =
  | null
  | { elevation?: SunElevation; azimuth?: SunAzimuth };

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

// --- people matcher -------------------------------------------------------

export type PeopleQuant = "any" | "everyone" | "nobody";

/** Per-rule predicate. `null` = wildcard (no presence constraint). */
export interface PeoplePredicate {
  who?: string[];                 // person.* entity_ids; empty/absent = all persons
  quant?: PeopleQuant;            // default "any"
  where?: string;                 // positive location: "home" | "zone.*"; default "home"
  negate?: boolean;               // default false; true = NOT at `where`
  for?: { h: number; m: number; s: number } | null;
}

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
