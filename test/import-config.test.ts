import { describe, expect, test } from "vitest";
import type { ImportEnvelope } from "../frontend/src/import-config";
import { computeImportPreview, ImportError, parseImport } from "../frontend/src/import-config";
import type { SceneCategory, ScopeConfig } from "../frontend/src/types";

const YAML_BLOCK = `
ambience_import: 1
scope: { kind: area, id: living_room }
category: { id: movie_night, name: Movie Night, icon: mdi:movie, color: deep-purple }
mode: merge
scenes:
  - name: Dim for film
    category: movie_night
    when:
      time_of_day: [{ period: evening }]
    actions:
      - service: light.turn_on
        entity_ids: [light.living_room]
        params: { brightness_pct: 15 }
`;

describe("parseImport", () => {
  test("parses a YAML envelope into a typed object", () => {
    const env = parseImport(YAML_BLOCK);
    expect(env.scope).toEqual({ kind: "area", id: "living_room" });
    expect(env.mode).toBe("merge");
    expect(env.category?.id).toBe("movie_night");
    expect(env.scenes).toHaveLength(1);
    expect(env.scenes[0].name).toBe("Dim for film");
  });

  test("also accepts JSON (a YAML superset)", () => {
    const env = parseImport(
      JSON.stringify({
        ambience_import: 1,
        scope: { kind: "house" },
        scenes: [{ category: "general", when: {}, actions: [] }],
      }),
    );
    expect(env.scope).toEqual({ kind: "house" });
    // mode defaults to merge when omitted.
    expect(env.mode).toBe("merge");
  });

  test("rejects non-object input", () => {
    expect(() => parseImport("just a string")).toThrow(ImportError);
  });

  test("rejects a missing ambience_import marker", () => {
    expect(() => parseImport("scope: { kind: house }\nscenes: []")).toThrow(/ambience_import/);
  });

  test("rejects an unknown scope kind", () => {
    expect(() => parseImport("ambience_import: 1\nscope: { kind: planet }\nscenes: []")).toThrow(
      ImportError,
    );
  });

  test("rejects an area scope with no id", () => {
    expect(() => parseImport("ambience_import: 1\nscope: { kind: area }\nscenes: []")).toThrow(
      /id/,
    );
  });

  test("rejects scenes that are not a list", () => {
    expect(() => parseImport("ambience_import: 1\nscope: { kind: house }\nscenes: nope")).toThrow(
      ImportError,
    );
  });

  test("rejects a scene without a category", () => {
    expect(() =>
      parseImport(
        "ambience_import: 1\nscope: { kind: house }\nscenes: [{ when: {}, actions: [] }]",
      ),
    ).toThrow(/category/);
  });

  test("rejects malformed YAML", () => {
    expect(() => parseImport("ambience_import: 1\n  bad: : :")).toThrow(ImportError);
  });

  test("rejects an invalid mode", () => {
    expect(() =>
      parseImport("ambience_import: 1\nscope: { kind: house }\nmode: wipe\nscenes: []"),
    ).toThrow(/mode/);
  });

  test("rejects a category without an id", () => {
    expect(() =>
      parseImport("ambience_import: 1\nscope: { kind: house }\ncategory: { name: X }\nscenes: []"),
    ).toThrow(/category/);
  });

  test("rejects a non-numeric ambience_import marker", () => {
    expect(() => parseImport("ambience_import: nope\nscope: { kind: house }\nscenes: []")).toThrow(
      /ambience_import/,
    );
  });

  test("rejects a future import format version", () => {
    expect(() => parseImport("ambience_import: 2\nscope: { kind: house }\nscenes: []")).toThrow(
      /v2/,
    );
  });
});

const CATEGORIES: SceneCategory[] = [{ id: "general", name: "General" }];

function envWith(
  scenes: { name?: string; category: string }[],
  opts: Partial<{ mode: "merge" | "replace"; category: SceneCategory }> = {},
) {
  return {
    ambience_import: 1,
    scope: { kind: "area" as const, id: "living_room" },
    mode: opts.mode ?? ("merge" as const),
    category: opts.category,
    scenes: scenes.map((s) => ({ name: s.name, category: s.category, when: {}, actions: [] })),
  };
}

describe("computeImportPreview (merge)", () => {
  const current: ScopeConfig = {
    scenes: [{ name: "Existing", category: "general", when: {}, actions: [] }],
  };

  test("classifies new scenes as adds and same-name scenes as updates", () => {
    const env = envWith([
      { name: "Existing", category: "general" },
      { name: "Brand new", category: "general" },
    ]);
    const preview = computeImportPreview(env, current, CATEGORIES);
    expect(preview.updates).toEqual(["Existing"]);
    expect(preview.adds).toEqual(["Brand new"]);
    // Result keeps one Existing (replaced) plus the new one.
    expect(preview.resultConfig.scenes.map((s) => s.name)).toEqual(["Existing", "Brand new"]);
  });

  test("matches names case-insensitively", () => {
    const env = envWith([{ name: "existing", category: "general" }]);
    const preview = computeImportPreview(env, current, CATEGORIES);
    expect(preview.updates).toEqual(["existing"]);
    expect(preview.adds).toEqual([]);
  });

  test("flags a brand-new category declared in the envelope", () => {
    const env = envWith([{ name: "Film", category: "movie_night" }], {
      category: { id: "movie_night", name: "Movie Night" },
    });
    const preview = computeImportPreview(env, current, CATEGORIES);
    expect(preview.newCategory?.id).toBe("movie_night");
    expect(preview.unknownCategories).toEqual([]);
  });

  test("flags a scene referencing a category that exists nowhere", () => {
    const env = envWith([{ name: "Orphan", category: "ghost" }]);
    const preview = computeImportPreview(env, current, CATEGORIES);
    expect(preview.unknownCategories).toEqual(["ghost"]);
    expect(preview.newCategory).toBeNull();
  });

  test("preserves priority and pinned on imported scenes", () => {
    const env = {
      ambience_import: 1,
      scope: { kind: "area", id: "lr" },
      mode: "merge",
      scenes: [
        { name: "Top", category: "general", when: {}, actions: [], priority: 2048, pinned: true },
      ],
    } as unknown as ImportEnvelope;
    const preview = computeImportPreview(env, { scenes: [] }, CATEGORIES);
    const saved = preview.resultConfig.scenes[0] as { priority?: number; pinned?: boolean };
    expect(saved.priority).toBe(2048);
    expect(saved.pinned).toBe(true);
  });
});

describe("computeImportPreview (replace)", () => {
  const current: ScopeConfig = {
    scenes: [
      { name: "Old A", category: "movie_night", when: {}, actions: [] },
      { name: "Old B", category: "movie_night", when: {}, actions: [] },
      { name: "Keep", category: "general", when: {}, actions: [] },
    ],
  };

  test("replaces only the imported category's scenes, keeping others", () => {
    const env = envWith([{ name: "New film scene", category: "movie_night" }], {
      mode: "replace",
    });
    const preview = computeImportPreview(env, current, [
      ...CATEGORIES,
      { id: "movie_night", name: "Movie Night" },
    ]);
    expect(preview.removes.sort()).toEqual(["Old A", "Old B"]);
    expect(preview.adds).toEqual(["New film scene"]);
    expect(preview.resultConfig.scenes.map((s) => s.name)).toEqual(["Keep", "New film scene"]);
  });

  test("targets the categories of the imported SCENES, not the declared category", () => {
    // A block whose declared category differs from its scenes' category: replace
    // follows the scenes (general), so the general scene is removed and the
    // movie_night scenes are untouched. The preview surfaces this.
    const env = {
      ...envWith([{ name: "New", category: "general" }], { mode: "replace" as const }),
      category: { id: "movie_night", name: "Movie Night" },
    };
    const preview = computeImportPreview(env, current, [
      ...CATEGORIES,
      { id: "movie_night", name: "Movie Night" },
    ]);
    expect(preview.removes).toEqual(["Keep"]);
    expect(preview.resultConfig.scenes.map((s) => s.name)).toEqual(["Old A", "Old B", "New"]);
  });
});
