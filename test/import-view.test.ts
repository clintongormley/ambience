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

  // Upload a file — the only input now. Reading it auto-previews (no paste box,
  // no separate Preview button), so this awaits the file read + the preview's
  // getScopeConfig/listCategories.
  async function uploadAndPreview(block: string) {
    const input = el.shadowRoot.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File([block], "ambience-import.yaml", { type: "text/yaml" });
    Object.defineProperty(input, "files", { value: [file], configurable: true });
    input.dispatchEvent(new Event("change"));
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;
  }

  function confirmButton() {
    return el.shadowRoot.querySelector("button.confirm") as HTMLButtonElement;
  }

  test("lays out the three steps and marks the feature Beta", async () => {
    el = await mount();
    const text = (el.shadowRoot.textContent || "").toLowerCase();
    expect(text).toContain("beta");
    expect(text).toContain("install");
    expect(text).toContain("download");
    expect(text).toContain("upload");
    const link = el.shadowRoot.querySelector(".steps a.help-link") as HTMLAnchorElement;
    expect(link.getAttribute("href")).toContain("download-and-paste");
    expect(link.getAttribute("target")).toBe("_blank");
    // No paste box — upload is the only input.
    expect(el.shadowRoot.querySelector("textarea")).toBeFalsy();
    expect(el.shadowRoot.querySelector('input[type="file"]')).toBeTruthy();
  });

  test("recommends the live MCP server, linking to the setup docs, and keeps the paste flow", async () => {
    el = await mount();
    const text = (el.shadowRoot.textContent || "").toLowerCase();
    expect(text).toContain("mcp server");
    const mcpLink = el.shadowRoot.querySelector(".mcp a.help-link") as HTMLAnchorElement;
    expect(mcpLink.getAttribute("href")).toContain("ai/mcp-server");
    expect(mcpLink.getAttribute("target")).toBe("_blank");
    // Option A: the download/paste flow stays as the no-install fallback.
    expect(el.shadowRoot.querySelector("button.download")).toBeTruthy();
  });

  test("invites feedback when the AI gets it wrong, linking to GitHub issues", async () => {
    el = await mount();
    expect((el.shadowRoot.textContent || "").toLowerCase()).toContain("better than the ai");
    const link = el.shadowRoot.querySelector("a.fb-link") as HTMLAnchorElement;
    expect(link.getAttribute("href")).toContain("github.com");
    expect(link.getAttribute("href")).toContain("issues");
    expect(link.getAttribute("target")).toBe("_blank");
  });

  test("the download button fetches the AI bundle", async () => {
    el = await mount();
    (el.shadowRoot.querySelector("button.download") as HTMLButtonElement).click();
    expect(downloadAiBundle).toHaveBeenCalledOnce();
  });

  test("uploading a valid file previews adds, updates and a new category", async () => {
    el = await mount();
    await uploadAndPreview(MERGE_BLOCK);
    const panel = el.shadowRoot.querySelector(".preview-panel");
    expect(panel).toBeTruthy();
    const text = panel.textContent as string;
    expect(text).toContain("Existing"); // update
    expect(text).toContain("Film"); // add
    expect(text).toContain("Movie Night"); // new category to create
  });

  test("uploading an invalid file shows an error and no preview", async () => {
    el = await mount();
    await uploadAndPreview("not a valid block");
    expect(el.shadowRoot.querySelector(".error")).toBeTruthy();
    expect(el.shadowRoot.querySelector(".preview-panel")).toBeFalsy();
  });

  test("confirming creates the new category, validates and saves the merged config", async () => {
    el = await mount();
    await uploadAndPreview(MERGE_BLOCK);
    confirmButton().click();
    await new Promise((r) => setTimeout(r, 0));
    await el.updateComplete;

    expect(saveCategories).toHaveBeenCalledOnce();
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
      await uploadAndPreview(MERGE_BLOCK); // declares a new movie_night category
      confirmButton().click();
      await new Promise((r) => setTimeout(r, 0));
      await el.updateComplete;
      expect(seen.has("ambience-config-imported")).toBe(true);
      expect(seen.has("ambience-categories-changed")).toBe(true);
    } finally {
      window.removeEventListener("ambience-categories-changed", handler);
      window.removeEventListener("ambience-config-imported", handler);
    }
  });

  test("a scene referencing an unknown category blocks the import", async () => {
    el = await mount();
    await uploadAndPreview(UNKNOWN_CATEGORY_BLOCK);
    expect(confirmButton().disabled).toBe(true);
  });
});
