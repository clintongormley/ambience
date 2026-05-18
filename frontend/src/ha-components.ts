import type { ReactiveControllerHost } from "lit";

type CardHelpers = {
  createCardElement(config: object): Promise<{
    constructor?: { getConfigElement?: () => Promise<unknown> };
  }>;
};

// HA's lazy form components we'd prefer to use if registered.
const HA_COMPONENTS = [
  "ha-combo-box",
  "ha-input",
  "ha-textfield",
] as const;

const TEXT_INPUT_VARIANTS = ["ha-input", "ha-textfield"] as const;

export type HaTextInputTag = (typeof TEXT_INPUT_VARIANTS)[number];

/**
 * Returns the best available text-input custom element tag (`ha-input` >
 * `ha-textfield`), or null if neither is in the registry yet.
 */
export function pickHaTextInput(): HaTextInputTag | null {
  for (const n of TEXT_INPUT_VARIANTS) {
    if (customElements.get(n)) return n;
  }
  return null;
}

let _loadAttempt: Promise<void> | null = null;

/**
 * Best-effort: try to coax HA into loading its lazy form components
 * (ha-combo-box, ha-input/ha-textfield). The classic trick is to call
 * `window.loadCardHelpers()` and request a card editor — that pulls in HA's
 * ha-form chunk. As of HA 2026.05 `loadCardHelpers` is no longer on window
 * for custom panels, so this is genuinely best-effort: callers should NOT
 * gate their UI on it. Consumers render the HA element if registered, else
 * a self-contained fallback. The `HaComponentsController` re-renders the
 * host if any tracked component becomes defined later.
 *
 * Diagnostics are emitted via `console.warn` so failures are visible.
 */
export function ensureHaComponents(): Promise<void> {
  if (_loadAttempt) return _loadAttempt;
  _loadAttempt = (async () => {
    if (HA_COMPONENTS.every((n) => customElements.get(n))) return;

    const w = window as Window & {
      loadCardHelpers?: () => Promise<CardHelpers>;
    };

    // Strategy 1: classic window.loadCardHelpers (HA < 2026.05).
    if (typeof w.loadCardHelpers === "function") {
      try {
        const helpers = await w.loadCardHelpers();
        const card = await helpers.createCardElement({
          type: "entities",
          entities: [],
        });
        await card.constructor?.getConfigElement?.();
      } catch (e) {
        console.warn("ambience: loadCardHelpers strategy failed", e);
      }
      return;
    }
    console.warn(
      "ambience: window.loadCardHelpers is not available (removed in HA 2026.05?). " +
        "Panel will use self-contained fallback widgets where HA's lazy form " +
        "components aren't already in the custom-element registry.",
    );
  })();
  return _loadAttempt;
}

/**
 * Watches the custom-element registry for HA's lazy form components and
 * requests a host re-render whenever any of them become defined. The host
 * can call `customElements.get(...)` directly in render() to choose between
 * the HA element and its fallback. Also triggers `ensureHaComponents()`
 * once per page (best-effort load).
 *
 * Call from `connectedCallback`:
 *
 *     override connectedCallback() {
 *       super.connectedCallback();
 *       watchHaComponents(this);
 *     }
 *
 * The closures hold a reference to `host` until each `whenDefined` resolves;
 * in practice this is one closure per missing component per page mount, which
 * is bounded and acceptable. requestUpdate on a disconnected element is a
 * no-op, so no harm if the element is gone by the time it fires.
 */
export function watchHaComponents(host: ReactiveControllerHost): void {
  for (const name of HA_COMPONENTS) {
    if (!customElements.get(name)) {
      void customElements.whenDefined(name).then(() => host.requestUpdate());
    }
  }
  void ensureHaComponents();
}
