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
    if (typeof loader !== "function") {
      console.warn(
        "ambience: window.loadCardHelpers is not available; HA form " +
          "components will not be loaded.",
      );
      return false;
    }
    try {
      const helpers = await loader();
      const card = await helpers.createCardElement({
        type: "entities",
        entities: [],
      });
      await card.constructor?.getConfigElement?.();
    } catch (e) {
      console.warn(
        "ambience: loadCardHelpers trick failed to trigger ha-form load",
        e,
      );
    }
    // Whether the trick threw or not, give the registry up to 10s to settle.
    try {
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
          setTimeout(() => rej(new Error("timeout")), 10000),
        ),
      ]);
    } catch (e) {
      console.warn(
        "ambience: timed out waiting for HA components",
        { required: REQUIRED, textInputs: TEXT_INPUT_VARIANTS },
        "registered now:",
        {
          "ha-combo-box": !!customElements.get("ha-combo-box"),
          "ha-input": !!customElements.get("ha-input"),
          "ha-textfield": !!customElements.get("ha-textfield"),
        },
        e,
      );
    }
    const ok = _allReady();
    if (!ok) {
      console.warn("ambience: HA components still missing after load attempt");
    }
    return ok;
  })();
  return _loader;
}

/**
 * Lit ReactiveController exposing tri-state `state` ("loading" | "ready" |
 * "failed"). Kicks off the load on host connect and re-renders the host
 * when the state flips. Multiple hosts share the same module-level loader,
 * so the load is attempted at most once per page.
 */
export class HaComponentsController implements ReactiveController {
  state: "loading" | "ready" | "failed" = _allReady() ? "ready" : "loading";

  constructor(private host: ReactiveControllerHost) {
    host.addController(this);
  }

  get ready(): boolean {
    return this.state === "ready";
  }

  hostConnected(): void {
    if (this.state === "ready") return;
    void ensureHaComponents().then((ok) => {
      this.state = ok ? "ready" : "failed";
      this.host.requestUpdate();
    });
  }

  hostDisconnected(): void {}
}
