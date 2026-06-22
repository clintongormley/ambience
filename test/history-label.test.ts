import { describe, expect, it } from "vitest";
import { localize } from "../frontend/src/i18n.js";
import "../frontend/src/views/scopes-view"; // registers <ambience-scopes-view>

// Part A: verify the en strings + placeholders directly at the i18n layer.
function label(action: string, scene: string | null, scope: string): string {
  const sceneName = scene?.trim() ? scene : localize(undefined, "ui.history_untitled", "Untitled");
  return localize(undefined, `ui.history_action_${action}`, action, { scene: sceneName, scope });
}

describe("history labels (en strings)", () => {
  it("delete includes scene + scope", () => {
    expect(label("delete", "Movie night", "Living Room")).toBe(
      'Deleted scene "Movie night" in Living Room',
    );
  });
  it("reorder names only the scope", () => {
    expect(label("reorder", null, "Kitchen")).toBe("Reordered scenes in Kitchen");
  });
  it("untitled scene falls back", () => {
    expect(label("add", "", "House")).toBe('Added scene "Untitled" in House');
  });
});

// Part B: exercise the real _historyLabel / _scopeName on the element, which
// resolve the scope's display name from the store's areas/floors.
describe("AmbienceScopesView._historyLabel", () => {
  function makeView() {
    const el: any = document.createElement("ambience-scopes-view");
    el.hass = {};
    el._store = {
      areas: [{ area_id: "lr", name: "Living Room" }],
      floors: [{ floor_id: "gf", name: "Ground Floor" }],
    };
    return el;
  }
  it("resolves an area name", () => {
    const el = makeView();
    expect(
      el._historyLabel({
        action: "delete",
        scene_name: "Movie night",
        scope_kind: "area",
        scope_id: "lr",
      }),
    ).toBe('Deleted scene "Movie night" in Living Room');
  });
  it("uses 'House' for the house scope and returns '' for null", () => {
    const el = makeView();
    expect(
      el._historyLabel({ action: "add", scene_name: "X", scope_kind: "house", scope_id: null }),
    ).toBe('Added scene "X" in House');
    expect(el._historyLabel(null)).toBe("");
  });
  it("resolves a floor name", () => {
    const el = makeView();
    expect(
      el._historyLabel({
        action: "reorder",
        scene_name: null,
        scope_kind: "floor",
        scope_id: "gf",
      }),
    ).toBe("Reordered scenes in Ground Floor");
  });
});
