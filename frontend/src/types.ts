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
  targets: Record<string, Record<string, unknown>>;
};

export type AreaConfig = {
  // Toggleable matcher names enabled for the area. `scene` is never listed.
  matchers: string[];
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
