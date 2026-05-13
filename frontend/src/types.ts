/**
 * Types mirroring the backend's Storage shape and WS responses.
 * Keep in sync with custom_components/ambience/store.py and websocket.py.
 */

export type Rule = {
  name?: string;
  when: {
    scene?: string | null;
    [matcher: string]: unknown;
  };
  actions: ActionSpec[];
};

export type ActionSpec = {
  action: string;
  targets: Record<string, Record<string, unknown>>;
};

export type AreaConfig = {
  name: string;
  scenes: string[];
  matchers: string[];
  rules: Rule[];
};

export type AreaListItem = {
  area_id: string;
  name: string;
};

export type MatcherInfo = {
  name: string;
  description: string;
  predicate_help: string;
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
