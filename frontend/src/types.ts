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
};

export type AreaConfig = {
  // Ordered list — array order is authoritative for the engine.
  rules: Rule[];
  // When true the backend keeps `rules` sorted on every save.
  auto_sort: boolean;
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
  // False for always-on matchers (`scene`); such matchers are hidden from
  // the matchers modal but still rendered as a rule-editor row.
  toggleable: boolean;
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
};

export type DryRunResult = {
  matched_rule_index: number | null;
  rule_name: string | null;
  actions: ActionSpec[];
  snapshots_described: Record<string, string | null>;
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

export type EnabledMatchers = { enabled: string[] };

export type DayConfig = {
  workday_sensor: string | null;
  workday_calendar: string | null;
};

export type DayItem =
  | { kind: "weekday"; days: number[] }
  | { kind: "day_of_month"; days: number[] }
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
