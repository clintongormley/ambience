import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("../frontend/src/api.js", () => ({
  downloadAiBundle: vi.fn(async () => {}),
  getScopeConfig: vi.fn(async () => ({
    scenes: [{ name: "Existing", category: "general", when: {}, actions: [] }],
  })),
  listCategories: vi.fn(async () => [{ id: "general", name: "General" }]),
  saveCategories: vi.fn(async () => ({ ok: true })),
  validateScopeConfig: vi.fn(async () => {}),
  saveScopeConfig: vi.fn(async () => ({ ok: true, config: { scenes: [] } })),
}));

import "../frontend/src/views/import-view";
import {
  downloadAiBundle,
  saveCategories,
  saveScopeConfig,
  validateScopeConfig,
} from "../frontend/src/api.js";

const MERGE_BLOCK = `
ambience_import: 1
scope: { kind: area, id: living_room }
category: { id: movie_night, name: Movie Night }
scenes:
  - { name: Existing, category: general, when: {}, actions: [] }
  - { name: Film, category: movie_night, when: {}, actions: [] }
`;

const UNKNOWN_CATEGORY_BLOCK = `
ambience_import: 1
scope: { kind: house }
scenes:
  - { name: Orphan, category: ghost, when: {}, actions: [] }
`;

describe("ambience-import-config", () => {
  let el: any;
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => el?.remove());

  async function mount() {
    el = document.createElement("ambience-import-config");
    el.hass = { language: "en" };
    document.body.appendChild(el);
    await el.updateComplete;
    return el;
  }

  async function pasteAndPreview(block: string) {
    const ta = el.shadowRoot.querySelector("textarea") as HTMLTextAreaElement;
    ta.value = block;
    ta.dispatchEvent(new Event("input"));
    await el.updateComplete;
    (el.shadowRoot.querySelector("button.preview") as HTMLButtonElement).click();
    // preview awaits getScopeConfig + listCategories.
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
  }

  test("marks the feature Beta and links to install/usage docs", async () => {
    el = await mount();
    expect((el.shadowRoot.textContent || "").toLowerCase()).toContain("beta");
    const link = el.shadowRoot.querySelector("a.help-link") as HTMLAnchorElement;
    expect(link).toBeTruthy();
    expect(link.getAttribute("href")).toContain("github.com");
    expect(link.getAttribute("target")).toBe("_blank");
  });

  test("the download button fetches the AI bundle", async () => {
    el = await mount();
    (el.shadowRoot.querySelector("button.download") as HTMLButtonElement).click();
    expect(downloadAiBundle).toHaveBeenCalledOnce();
  });

  test("previewing a valid block classifies adds, updates and a new category", async () => {
    el = await mount();
    await pasteAndPreview(MERGE_BLOCK);
    const panel = el.shadowRoot.querySelector(".preview-panel");
    expect(panel).toBeTruthy();
    const text = panel.textContent as string;
    expect(text).toContain("Existing"); // update
    expect(text).toContain("Film"); // add
    expect(text).toContain("Movie Night"); // new category to create
  });

  test("uploading a file populates the import text (no copy-paste needed)", async () => {
    el = await mount();
    const input = el.shadowRoot.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toBeTruthy();
    const file = new File([MERGE_BLOCK], "ambience-import.yaml", { type: "text/yaml" });
    Object.defineProperty(input, "files", { value: [file], configurable: true });
    input.dispatchEvent(new Event("change"));
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    const ta = el.shadowRoot.querySelector("textarea") as HTMLTextAreaElement;
    expect(ta.value).toContain("ambience_import");
  });

  test("an invalid block shows an error and no preview", async () => {
    el = await mount();
    await pasteAndPreview("not a valid block");
    expect(el.shadowRoot.querySelector(".error")).toBeTruthy();
    expect(el.shadowRoot.querySelector(".preview-panel")).toBeFalsy();
  });

  test("editing the text after a preview clears the stale preview", async () => {
    el = await mount();
    await pasteAndPreview(MERGE_BLOCK);
    expect(el.shadowRoot.querySelector(".preview-panel")).toBeTruthy();
    // Edit the textarea — the now-stale preview (and its Import button) must go.
    const ta = el.shadowRoot.querySelector("textarea") as HTMLTextAreaElement;
    ta.value = `${MERGE_BLOCK}\n# edited`;
    ta.dispatchEvent(new Event("input"));
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".preview-panel")).toBeFalsy();
    expect(el.shadowRoot.querySelector("button.confirm")).toBeFalsy();
  });

  test("confirming creates the new category, validates and saves the merged config", async () => {
    el = await mount();
    await pasteAndPreview(MERGE_BLOCK);
    (el.shadowRoot.querySelector("button.confirm") as HTMLButtonElement).click();
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    expect(saveCategories).toHaveBeenCalledOnce();
    // The created list includes the existing + the new movie_night category.
    const savedCats = (saveCategories as any).mock.calls[0][1];
    expect(savedCats.map((c: any) => c.id)).toContain("movie_night");

    expect(validateScopeConfig).toHaveBeenCalledOnce();
    expect(saveScopeConfig).toHaveBeenCalledOnce();
    const [, scope, config] = (saveScopeConfig as any).mock.calls[0];
    expect(scope).toEqual({ kind: "area", id: "living_room" });
    expect(config.scenes.map((s: any) => s.name)).toEqual(["Existing", "Film"]);
  });

  test("broadcasts refresh events so the panel shows the import without a manual reload", async () => {
    el = await mount();
    const seen = new Set<string>();
    const handler = (e: Event) => {
      seen.add(e.type);
    };
    window.addEventListener("ambience-categories-changed", handler);
    window.addEventListener("ambience-config-imported", handler);
    try {
      await pasteAndPreview(MERGE_BLOCK); // declares a new movie_night category
      (el.shadowRoot.querySelector("button.confirm") as HTMLButtonElement).click();
      await new Promise((r) => setTimeout(r, 0));
      await el.updateComplete;
      // Scenes refresh (config-imported) AND the new category list refreshes.
      expect(seen.has("ambience-config-imported")).toBe(true);
      expect(seen.has("ambience-categories-changed")).toBe(true);
    } finally {
      window.removeEventListener("ambience-categories-changed", handler);
      window.removeEventListener("ambience-config-imported", handler);
    }
  });

  test("a scene referencing an unknown category blocks the import", async () => {
    el = await mount();
    await pasteAndPreview(UNKNOWN_CATEGORY_BLOCK);
    const confirm = el.shadowRoot.querySelector("button.confirm") as HTMLButtonElement;
    expect(confirm.disabled).toBe(true);
  });
});
