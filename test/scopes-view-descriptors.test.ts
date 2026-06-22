import { describe, expect, it } from "vitest";
import "../frontend/src/views/scopes-view"; // registers <ambience-scopes-view>

// Build a view with a stubbed store that records mutate(scope, next, change).
function viewWithScenes(scenes: any[]) {
  const calls: any[] = [];
  const view: any = document.createElement("ambience-scopes-view");
  view._store = {
    getConfig: () => ({ scenes }),
    mutate: (scope: any, next: any, change: any) => {
      calls.push({ scope, next, change });
      return Promise.resolve(true);
    },
    error: "",
  };
  return { view, calls };
}

const SCENES = [
  { name: "First", category: "general" },
  { name: "Second", category: "general" },
];

describe("mutation-site change descriptors", () => {
  it("delete sends a delete descriptor with the scene name", () => {
    const { view, calls } = viewWithScenes(SCENES);
    view._deleteScene({ kind: "house" }, { detail: { index: 1 } });
    expect(calls[0].change).toEqual({ action: "delete", scene_name: "Second" });
  });

  it("toggle sends a toggle descriptor", () => {
    const { view, calls } = viewWithScenes(SCENES);
    view._toggleSceneEnabled({ kind: "house" }, { detail: { index: 0, enabled: false } });
    expect(calls[0].change).toEqual({ action: "toggle", scene_name: "First" });
  });

  it("unpin sends an unpin descriptor", () => {
    const { view, calls } = viewWithScenes(SCENES);
    view._unpinScene({ kind: "house" }, { detail: { index: 0 } });
    expect(calls[0].change).toEqual({ action: "unpin", scene_name: "First" });
  });
});
