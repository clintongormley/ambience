import type { ReactiveController, ReactiveControllerHost } from "lit";

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
 * Lit ReactiveController that re-renders its host whenever any of HA's
 * tracked form components become defined. The host can call
 * `customElements.get(...)` directly in render() to decide what to show.
 * Also triggers `ensureHaComponents()` once per page.
 */
export class HaComponentsController implements ReactiveController {
  constructor(private host: ReactiveControllerHost) {
    host.addController(this);
  }

  hostConnected(): void {
    // Watch for any currently-missing component to be defined later; when
    // it is, re-render the host so it can switch from the fallback to the
    // HA-native element in place.
    for (const name of HA_COMPONENTS) {
      if (!customElements.get(name)) {
        void customElements.whenDefined(name).then(() => {
          this.host.requestUpdate();
        });
      }
    }
    // Best-effort trigger; harmless if it never resolves to anything.
    void ensureHaComponents();
  }

  hostDisconnected(): void {}
}
