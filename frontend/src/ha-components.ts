import type { ReactiveController, ReactiveControllerHost } from "lit";

type CardHelpers = {
  createCardElement(config: object): Promise<{
    constructor?: { getConfigElement?: () => Promise<unknown> };
  }>;
};

// Required HA components we wait for. `ha-combo-box` is always needed for
// the scene picker. For text inputs we accept either of two variants:
// `ha-input` (newer, HA 2026.05+) or `ha-textfield` (older). Whichever
// the running HA version ships will be registered by ha-form's chunk.
const REQUIRED = ["ha-combo-box"] as const;
const TEXT_INPUT_VARIANTS = ["ha-input", "ha-textfield"] as const;

export type HaTextInputTag = (typeof TEXT_INPUT_VARIANTS)[number];

function _hasTextInput(): boolean {
  return TEXT_INPUT_VARIANTS.some((n) => customElements.get(n) !== undefined);
}

function _allReady(): boolean {
  return (
    REQUIRED.every((n) => customElements.get(n) !== undefined) &&
    _hasTextInput()
  );
}

/**
 * Returns the best available text-input custom element tag, or null if
 * neither variant is registered yet. Callers should fall back to a plain
 * `<input>` for the null case.
 */
export function pickHaTextInput(): HaTextInputTag | null {
  for (const n of TEXT_INPUT_VARIANTS) {
    if (customElements.get(n)) return n;
  }
  return null;
}

let _loader: Promise<boolean> | null = null;

/**
 * Force-loads HA's lazy form components. In a custom panel context they
 * are NOT guaranteed to be in the global custom-element registry — they
 * would render blank. The widely-used trick: call HA's global
 * `loadCardHelpers()`, create any card element, and request its config
 * editor — that side-effect pulls in HA's ha-form chunk, which transitively
 * registers ha-combo-box and the text-input variant (ha-input on HA
 * 2026.05+, ha-textfield on older releases). Runs once per page load.
 */
export function ensureHaComponents(): Promise<boolean> {
  if (_allReady()) return Promise.resolve(true);
  if (_loader) return _loader;
  _loader = (async () => {
    const loader = (
      window as Window & { loadCardHelpers?: () => Promise<CardHelpers> }
    ).loadCardHelpers;
    if (typeof loader !== "function") return false;
    try {
      const helpers = await loader();
      const card = await helpers.createCardElement({
        type: "entities",
        entities: [],
      });
      await card.constructor?.getConfigElement?.();
      // Element registration is async after the chunk loads; race against
      // a timeout so a misbehaving HA build can't hang the panel forever.
      await Promise.race([
        (async () => {
          await Promise.all(
            REQUIRED.map((n) => customElements.whenDefined(n)),
          );
          // Whichever text-input variant resolves first is fine.
          await Promise.race(
            TEXT_INPUT_VARIANTS.map((n) => customElements.whenDefined(n)),
          );
        })(),
        new Promise<void>((_, rej) =>
          setTimeout(() => rej(new Error("timeout")), 5000),
        ),
      ]);
      return _allReady();
    } catch {
      return false;
    }
  })();
  return _loader;
}

/**
 * Lit ReactiveController: exposes `ready` (true once HA components have
 * loaded), kicks off the load on host connect, and re-renders the host
 * when loading finishes. Multiple hosts share the same module-level loader.
 */
export class HaComponentsController implements ReactiveController {
  ready = _allReady();

  constructor(private host: ReactiveControllerHost) {
    host.addController(this);
  }

  hostConnected(): void {
    if (this.ready) return;
    void ensureHaComponents().then((ok) => {
      this.ready = ok;
      this.host.requestUpdate();
    });
  }

  hostDisconnected(): void {}
}
