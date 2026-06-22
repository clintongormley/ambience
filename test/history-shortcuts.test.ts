import { describe, expect, it, vi } from "vitest";
import "../frontend/src/views/scopes-view"; // registers <ambience-scopes-view>

function makeView(opts: { canUndo?: boolean; canRedo?: boolean; editing?: unknown } = {}) {
  const undo = vi.fn();
  const redo = vi.fn();
  const el: any = document.createElement("ambience-scopes-view");
  el._store = { canUndo: opts.canUndo ?? true, canRedo: opts.canRedo ?? true, undo, redo };
  el._editing = opts.editing ?? null;
  return { el, undo, redo };
}

function key(init: {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  target?: unknown;
}) {
  return {
    preventDefault: vi.fn(),
    target: { tagName: "DIV" },
    ...init,
  } as unknown as KeyboardEvent;
}

describe("AmbienceScopesView undo/redo shortcuts", () => {
  it("ctrl+z triggers undo; ctrl+shift+z triggers redo; meta works too", () => {
    const a = makeView();
    a.el._onKeyDown(key({ key: "z", ctrlKey: true }));
    expect(a.undo).toHaveBeenCalled();
    a.el._onKeyDown(key({ key: "z", ctrlKey: true, shiftKey: true }));
    expect(a.redo).toHaveBeenCalled();
    const b = makeView();
    b.el._onKeyDown(key({ key: "z", metaKey: true }));
    expect(b.undo).toHaveBeenCalled();
  });
  it("ignores when no modifier, in a text field, or while the editor modal is open", () => {
    const noMod = makeView();
    noMod.el._onKeyDown(key({ key: "z" }));
    expect(noMod.undo).not.toHaveBeenCalled();
    const inField = makeView();
    inField.el._onKeyDown(key({ key: "z", ctrlKey: true, target: { tagName: "INPUT" } }));
    expect(inField.undo).not.toHaveBeenCalled();
    const modal = makeView({ editing: { scope: { kind: "house" }, index: 0 } });
    modal.el._onKeyDown(key({ key: "z", ctrlKey: true }));
    expect(modal.undo).not.toHaveBeenCalled();
  });
  it("does nothing when the matching stack is empty", () => {
    const { el, undo } = makeView({ canUndo: false });
    el._onKeyDown(key({ key: "z", ctrlKey: true }));
    expect(undo).not.toHaveBeenCalled();
  });
  it("ignores a shadow-DOM input where the real target is only in composedPath", () => {
    // A window keydown re-targets e.target to the shadow host; the real focused
    // input is composedPath()[0]. Typing Ctrl+Z in a modal input must NOT undo.
    const { el, undo } = makeView();
    const e = {
      key: "z",
      ctrlKey: true,
      preventDefault: vi.fn(),
      target: { tagName: "AMBIENCE-SIMULATOR-MODAL" }, // re-targeted host
      composedPath: () => [{ tagName: "INPUT" }],
    } as unknown as KeyboardEvent;
    el._onKeyDown(e);
    expect(undo).not.toHaveBeenCalled();
  });
});
