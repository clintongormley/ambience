/**
 * Parse and preview an AI-authored single-scope import block.
 *
 * The import envelope is a thin, self-describing wrapper around a ScopeConfig: it
 * names its target scope and may declare the category its scenes belong to, so a
 * block pasted from an AI carries everything the importer needs. All of the logic
 * here is pure — the view layer (import-view.ts) renders the preview and calls
 * the save/validate APIs.
 */

import { load as yamlLoad } from "js-yaml";
import type { Scene, SceneCategory, ScopeConfig } from "./types.js";

export type ImportScopeRef =
  | { kind: "area"; id: string }
  | { kind: "floor"; id: string }
  | { kind: "house" };

export type ImportEnvelope = {
  ambience_import: number;
  scope: ImportScopeRef;
  category?: SceneCategory;
  mode: "merge" | "replace";
  scenes: Scene[];
};

/** A user-facing parse/validation failure with an explanatory message. */
export class ImportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImportError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseScope(raw: unknown): ImportScopeRef {
  if (!isRecord(raw)) throw new ImportError("`scope` must be an object with a `kind`.");
  const kind = raw.kind;
  if (kind === "house") return { kind: "house" };
  if (kind === "area" || kind === "floor") {
    if (typeof raw.id !== "string" || raw.id === "") {
      throw new ImportError(`A ${kind} scope needs a non-empty \`id\`.`);
    }
    return { kind, id: raw.id };
  }
  throw new ImportError("`scope.kind` must be one of: area, floor, house.");
}

function parseScenes(raw: unknown): Scene[] {
  if (!Array.isArray(raw)) throw new ImportError("`scenes` must be a list.");
  return raw.map((scene, i) => {
    if (!isRecord(scene)) throw new ImportError(`Scene ${i + 1} must be an object.`);
    if (typeof scene.category !== "string" || scene.category === "") {
      throw new ImportError(`Scene ${i + 1} is missing a \`category\`.`);
    }
    return scene as unknown as Scene;
  });
}

function parseCategory(raw: unknown): SceneCategory | undefined {
  if (raw === undefined) return undefined;
  if (!isRecord(raw) || typeof raw.id !== "string" || raw.id === "") {
    throw new ImportError("`category` must be an object with a non-empty `id`.");
  }
  return raw as unknown as SceneCategory;
}

/** Parse YAML or JSON import text into a validated envelope. */
export function parseImport(text: string): ImportEnvelope {
  let doc: unknown;
  try {
    doc = yamlLoad(text);
  } catch (err) {
    throw new ImportError(`Could not parse YAML/JSON: ${(err as Error).message}`);
  }
  if (!isRecord(doc)) {
    throw new ImportError("Import must be a YAML/JSON object (an `ambience_import` block).");
  }
  const version = Number(doc.ambience_import);
  if (doc.ambience_import === undefined || !Number.isFinite(version) || version < 1) {
    throw new ImportError(
      "Missing or invalid `ambience_import` marker — is this an Ambience import block?",
    );
  }
  if (version > 1) {
    throw new ImportError(
      `This is import format v${version}, but this Ambience only understands v1 — update Ambience.`,
    );
  }
  const mode = doc.mode ?? "merge";
  if (mode !== "merge" && mode !== "replace") {
    throw new ImportError("`mode` must be `merge` or `replace`.");
  }
  return {
    ambience_import: version,
    scope: parseScope(doc.scope),
    category: parseCategory(doc.category),
    mode,
    scenes: parseScenes(doc.scenes),
  };
}

export type ImportPreview = {
  scope: ImportScopeRef;
  mode: "merge" | "replace";
  /** A category the import declares that doesn't exist yet (create on confirm). */
  newCategory: SceneCategory | null;
  /** Category ids referenced by scenes that exist nowhere — these block import. */
  unknownCategories: string[];
  adds: string[];
  updates: string[];
  removes: string[];
  /** The ScopeConfig to persist when the user confirms. */
  resultConfig: ScopeConfig;
};

function nameKey(scene: { name?: string; category: string }): string {
  return `${scene.category}\u0000${(scene.name ?? "").trim().toLowerCase()}`;
}

/**
 * Compute what importing `env` into `currentConfig` would do, given the
 * categories that already exist. Pure: returns the classification plus the exact
 * ScopeConfig to save.
 */
export function computeImportPreview(
  env: ImportEnvelope,
  currentConfig: ScopeConfig,
  existingCategories: SceneCategory[],
): ImportPreview {
  const existingIds = new Set(existingCategories.map((c) => c.id));
  const declaredId = env.category?.id;
  const newCategory = env.category && !existingIds.has(env.category.id) ? env.category : null;

  const knownIds = new Set(existingIds);
  if (declaredId) knownIds.add(declaredId);
  const unknownCategories = [
    ...new Set(env.scenes.map((s) => s.category).filter((id) => !knownIds.has(id))),
  ];

  const current = currentConfig.scenes ?? [];
  const adds: string[] = [];
  const updates: string[] = [];
  const removes: string[] = [];
  let resultScenes: Scene[];

  if (env.mode === "replace") {
    const replaced = new Set(env.scenes.map((s) => s.category));
    for (const s of current) {
      if (replaced.has(s.category)) removes.push(s.name ?? "(unnamed)");
    }
    resultScenes = current.filter((s) => !replaced.has(s.category));
    for (const s of env.scenes) {
      adds.push(s.name ?? "(unnamed)");
      resultScenes.push(s);
    }
  } else {
    resultScenes = current.map((s) => ({ ...s }));
    const indexByKey = new Map(resultScenes.map((s, i) => [nameKey(s), i]));
    for (const s of env.scenes) {
      const named = (s.name ?? "").trim() !== "";
      const existingIndex = named ? indexByKey.get(nameKey(s)) : undefined;
      if (existingIndex !== undefined) {
        resultScenes[existingIndex] = s;
        updates.push(s.name ?? "(unnamed)");
      } else {
        indexByKey.set(nameKey(s), resultScenes.length);
        resultScenes.push(s);
        adds.push(s.name ?? "(unnamed)");
      }
    }
  }

  return {
    scope: env.scope,
    mode: env.mode,
    newCategory,
    unknownCategories,
    adds,
    updates,
    removes,
    resultConfig: { ...currentConfig, scenes: resultScenes },
  };
}
