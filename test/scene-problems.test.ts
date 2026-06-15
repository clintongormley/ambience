import { describe, expect, test } from "vitest";

import {
  configIssueLabel,
  problemCount,
  sceneProblems,
  worstSeverity,
} from "../frontend/src/scene-problems";
import type { Scene } from "../frontend/src/types";

const base: Scene = { category: "c1", name: "s", when: {}, actions: [] };

describe("sceneProblems", () => {
  test("no problems → null severity", () => {
    expect(sceneProblems(base).severity).toBeNull();
  });

  test("missing entity → error severity", () => {
    const p = sceneProblems({ ...base, missing_entities: ["light.x"] });
    expect(p.severity).toBe("error");
    expect(p.missing).toEqual(["light.x"]);
  });

  test("overlap → warning severity", () => {
    expect(sceneProblems({ ...base, overlap_entities: ["light.y"] }).severity).toBe("warning");
  });

  test("shadowed → warning severity", () => {
    const p = sceneProblems({ ...base, shadowed_by: 0 });
    expect(p.severity).toBe("warning");
    expect(p.shadowed).toBe(true);
  });

  test("missing wins over shadow (error beats warning)", () => {
    expect(sceneProblems({ ...base, missing_entities: ["light.x"], shadowed_by: 0 }).severity).toBe(
      "error",
    );
  });

  test("disabled scene reports no problems even if hints set", () => {
    const p = sceneProblems({
      ...base,
      enabled: false,
      missing_entities: ["light.x"],
      shadowed_by: 0,
    });
    expect(p.severity).toBeNull();
  });
});

describe("aggregates", () => {
  const clean: Scene = base;
  const warn: Scene = { ...base, shadowed_by: 0 };
  const err: Scene = { ...base, missing_entities: ["light.x"] };

  test("worstSeverity returns error when any error present", () => {
    expect(worstSeverity([clean, warn, err])).toBe("error");
  });
  test("worstSeverity returns warning when only warnings", () => {
    expect(worstSeverity([clean, warn])).toBe("warning");
  });
  test("worstSeverity returns null when all clean", () => {
    expect(worstSeverity([clean, clean])).toBeNull();
  });
  test("problemCount counts scenes with any severity", () => {
    expect(problemCount([clean, warn, err])).toBe(2);
  });
});

describe("sceneProblems config_issues", () => {
  test("config issues raise error severity and are returned", () => {
    const scene: Scene = {
      ...base,
      config_issues: [{ kind: "missing_workday_sensor", ref: "workday_sensor" }],
    };
    const p = sceneProblems(scene);
    expect(p.severity).toBe("error");
    expect(p.configIssues).toEqual([{ kind: "missing_workday_sensor", ref: "workday_sensor" }]);
  });

  test("disabled scene reports no config issues", () => {
    const scene: Scene = {
      ...base,
      enabled: false,
      config_issues: [{ kind: "missing_period", ref: "x" }],
    };
    expect(sceneProblems(scene).configIssues).toEqual([]);
  });

  test("no config issues = none", () => {
    expect(sceneProblems(base).configIssues).toEqual([]);
  });
});

describe("configIssueLabel", () => {
  test("known kinds render specific text with the ref substituted", () => {
    expect(configIssueLabel(undefined, { kind: "missing_period", ref: "wind_down" })).toBe(
      "missing period wind_down",
    );
    expect(configIssueLabel(undefined, { kind: "unexposed_action", ref: "light.toggle" })).toBe(
      "action light.toggle not exposed",
    );
    expect(
      configIssueLabel(undefined, { kind: "missing_workday_sensor", ref: "workday_sensor" }),
    ).toBe("needs a workday sensor");
  });
});
