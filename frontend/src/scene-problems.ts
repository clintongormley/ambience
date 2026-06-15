import type { HassLike } from "./i18n.js";
import { localize } from "./i18n.js";
import type { ConfigIssue, Scene } from "./types.js";

export type ProblemSeverity = "error" | "warning";

export interface SceneProblems {
  severity: ProblemSeverity | null;
  missing: string[];
  overlap: string[];
  shadowed: boolean;
  configIssues: ConfigIssue[];
}

/** Problem summary for a scene. A disabled scene reports no problems (the backend
 *  never annotates disabled scenes, and a disabled scene is already greyed out).
 *  A missing-entity reference or config issue is a hard break (error); overlap /
 *  shadowing are softer warnings. */
export function sceneProblems(scene: Scene): SceneProblems {
  if (scene.enabled === false) {
    return { severity: null, missing: [], overlap: [], shadowed: false, configIssues: [] };
  }
  const missing = scene.missing_entities ?? [];
  const overlap = scene.overlap_entities ?? [];
  const configIssues = scene.config_issues ?? [];
  const shadowed = scene.shadowed_by != null;
  const severity: ProblemSeverity | null =
    missing.length > 0 || configIssues.length > 0
      ? "error"
      : overlap.length > 0 || shadowed
        ? "warning"
        : null;
  return { severity, missing, overlap, shadowed, configIssues };
}

/** Worst severity across scenes: "error" if any scene errors, else "warning" if
 *  any warns, else null. */
export function worstSeverity(scenes: Scene[]): ProblemSeverity | null {
  let worst: ProblemSeverity | null = null;
  for (const scene of scenes) {
    const severity = sceneProblems(scene).severity;
    if (severity === "error") return "error";
    if (severity === "warning") worst = "warning";
  }
  return worst;
}

/** Count of scenes that have any problem. */
export function problemCount(scenes: Scene[]): number {
  return scenes.filter((scene) => sceneProblems(scene).severity != null).length;
}

const _CONFIG_ISSUE_KEYS: Record<string, [string, string]> = {
  missing_workday_sensor: ["ui.badge_needs_workday_sensor", "needs a workday sensor"],
  missing_workday_calendar: ["ui.badge_needs_workday_calendar", "needs a workday calendar"],
  missing_weather_entity: ["ui.badge_needs_weather_entity", "needs a weather entity"],
  missing_weather_group: ["ui.badge_missing_weather_group", "missing weather group {id}"],
  missing_period: ["ui.badge_missing_period", "missing period {id}"],
  missing_lux_range: ["ui.badge_missing_lux_range", "missing lux range {id}"],
  unexposed_action: ["ui.badge_unexposed_action", "action {id} not exposed"],
};

/** Localized one-line label for a config issue, with `{id}` replaced by its ref. */
export function configIssueLabel(hass: HassLike | undefined, issue: ConfigIssue): string {
  const [key, fallback] = _CONFIG_ISSUE_KEYS[issue.kind] ?? ["", issue.kind];
  const text = key ? localize(hass, key, fallback) : fallback;
  return text.replace("{id}", issue.ref);
}
