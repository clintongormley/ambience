import type { ReactiveControllerHost } from "lit";

type CardHelpers = {
  createCardElement(config: { type: string; [k: string]: unknown }): {
    constructor?: { getConfigElement?: () => Promise<unknown> };
  };
};

// HA's lazy form components we'd prefer to use if registered.
const HA_COMPONENTS = [
  "ha-combo-box",
  "ha-input",
  "ha-textfield",
  "ha-form",
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

type AnyHass = unknown;

let _loadAttempt: Promise<void> | null = null;
let _kickedOff = false;

/**
 * Best-effort: try several known ways to coax HA into loading its lazy form
 * components (ha-combo-box, ha-input/ha-textfield). HA's `loadCardHelpers`
 * has moved around between releases; we probe for it on `window`, on the
 * `hass` object, on the `<home-assistant>` root, and on `<home-assistant-main>`,
 * then call whichever variant exists and ask it for a card-editor (which
 * transitively pulls in ha-form). If multiple strategies are available we
 * try them in order until one succeeds.
 *
 * Pass `hass` from the panel root for the widest coverage; not required.
 * Diagnostics emitted via `console.log` / `console.warn` so failures are
 * visible if it doesn't work in your HA version.
 */
// Components we'll probe for diagnostic purposes — broader than HA_COMPONENTS
// because in HA 2026.05+ the form/selector lineup is changing (Material You
// rewrite). We log which are registered so we can pick the best available
// HA-native widget without depending on a loader that may not exist.
const PROBE_COMPONENTS = [
  // Classic form components
  "ha-combo-box",
  "ha-textfield",
  "ha-input",
  "ha-form",
  "ha-select",
  "ha-listbox",
  "ha-entity-picker",
  "ha-selector",
  "ha-selector-text",
  "ha-selector-select",
  // Material You / new design system
  "ha-md-textfield",
  "ha-md-select",
  "ha-md-outlined-text-field",
  "ha-md-outlined-select",
  "ha-md-autocomplete",
  "ha-md-list",
  "ha-md-list-item",
  "ha-md-menu",
  "ha-md-menu-item",
  // Useful infrastructure
  "ha-dialog",
  "ha-card",
] as const;

export function ensureHaComponents(hass?: AnyHass): Promise<void> {
  if (_loadAttempt) return _loadAttempt;
  _loadAttempt = (async () => {
    /* v8 ignore next -- early-return branch: HA components are never pre-registered in jsdom */
    if (HA_COMPONENTS.every((n) => customElements.get(n))) return;

    // Primary strategy: HA's frontend may ship an import map for
    // `custom-card-helpers`. If it does, dynamic import resolves to HA's
    // actual helpers (which include loadCardHelpers). If not, this throws
    // a "Failed to resolve module specifier" and we move on.
    /* v8 ignore start -- loader probing: branches depend on HA runtime state not available in jsdom */
    try {
      const mod = await import("custom-card-helpers");
      if (typeof mod.loadCardHelpers === "function") {
        const helpers = await mod.loadCardHelpers();
        if (await _triggerLoad(helpers, "custom-card-helpers")) return;
      }
    } catch (e) {
      console.warn(
        "ambience: dynamic import of 'custom-card-helpers' failed; falling " +
          "back to legacy loader probes",
        e,
      );
    }
    /* v8 ignore stop */

    const candidates = _collectLoaderCandidates(hass);
    /* v8 ignore next 5 -- hass-with-object branch: singleton prevents re-entry in tests after first call */
    const hassKeys = hass && typeof hass === "object"
      ? Object.keys(hass as object).filter((k) =>
          /load|helper|card|form|element|register/i.test(k),
        )
      : [];
    console.log(
      "ambience: probing for HA component loaders →",
      /* v8 ignore next -- fn-truthy branch: fn is always undefined in jsdom (no loadCardHelpers) */
      Object.fromEntries(candidates.map((c) => [c.name, c.fn ? "found" : "—"])),
      "components registered (broad probe):",
      Object.fromEntries(
        PROBE_COMPONENTS.map((n) => [n, !!customElements.get(n)]),
      ),
      "hass-object keys matching /load|helper|card|form|element|register/i:",
      hassKeys,
    );

    /* v8 ignore start -- fn-is-function + fn() branches: candidates always have undefined fn in jsdom */
    for (const { name, fn } of candidates) {
      if (typeof fn !== "function") continue;
      let helpers: CardHelpers | undefined;
      try {
        helpers = (await fn()) as CardHelpers;
      } catch (e) {
        console.warn(`ambience: ${name}() threw`, e);
        continue;
      }
      if (!helpers?.createCardElement) {
        console.warn(`ambience: ${name}() returned no createCardElement`);
        continue;
      }
      if (await _triggerLoad(helpers, name)) return;
    }
    /* v8 ignore stop */

    console.warn(
      "ambience: every load strategy was tried; HA form components are still " +
        "not in the custom-element registry. Panel will use self-contained " +
        "fallback widgets. Please report this with the probe output above " +
        "and your HA version.",
    );
  })();
  return _loadAttempt;
}

/**
 * Try several card types via the given helpers and return true if any
 * actually pulls ha-combo-box into the registry. Card-editor sub-modules
 * vary across HA versions, so a single type might not transitively load
 * ha-form on every install.
 *
 * Only reachable when window/hass/DOM exposes a loadCardHelpers function;
 * that never happens in the test environment so the function body is excluded.
 */
/* v8 ignore start -- HA runtime only; loadCardHelpers does not exist in jsdom */
async function _triggerLoad(
  helpers: CardHelpers,
  loaderName: string,
): Promise<boolean> {
  const cardTypes = [
    "entities",
    "tile",
    "thermostat",
    "weather-forecast",
    "markdown",
  ];
  for (const type of cardTypes) {
    try {
      const card = await helpers.createCardElement({ type, entities: [] });
      await card.constructor?.getConfigElement?.();
    } catch (e) {
      console.debug(`ambience: ${loaderName} + ${type} card editor failed`, e);
    }
    if (customElements.get("ha-combo-box")) {
      console.log(
        `ambience: HA components loaded via ${loaderName} + ${type} card editor`,
      );
      return true;
    }
  }
  return false;
}
/* v8 ignore stop */

/**
 * Collect every place we know to look for HA's `loadCardHelpers` function.
 * Some HA versions expose it on `window`, some on the `hass` object, some
 * only on the `<home-assistant>` root element. Probe all of them.
 */
function _collectLoaderCandidates(
  hass?: AnyHass,
): Array<{ name: string; fn: (() => Promise<unknown>) | undefined }> {
  const w = window as Window & {
    loadCardHelpers?: () => Promise<unknown>;
  };
  const haRoot = document.querySelector("home-assistant") as
    | (Element & { loadCardHelpers?: () => Promise<unknown> })
    | null;
  /* v8 ignore next 3 -- <home-assistant> element is not in jsdom; haRoot is always null */
  const haMain = haRoot?.shadowRoot?.querySelector("home-assistant-main") as
    | (Element & { loadCardHelpers?: () => Promise<unknown> })
    | null;
  const h = hass as { loadCardHelpers?: () => Promise<unknown> } | undefined;

  return [
    { name: "window.loadCardHelpers", fn: w.loadCardHelpers?.bind(w) },
    /* v8 ignore next -- h?.loadCardHelpers: hass object never has loadCardHelpers in tests */
    { name: "hass.loadCardHelpers", fn: h?.loadCardHelpers?.bind(h) },
    {
      name: "<home-assistant>.loadCardHelpers",
      /* v8 ignore next -- haRoot is null in jsdom */
      fn: haRoot?.loadCardHelpers?.bind(haRoot),
    },
    {
      name: "<home-assistant-main>.loadCardHelpers",
      /* v8 ignore next -- haMain is null in jsdom */
      fn: haMain?.loadCardHelpers?.bind(haMain),
    },
  ];
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
 * Note: only the FIRST caller's `hass` (if any) is used to bootstrap the
 * loader, since the module-level `_loadAttempt` is a singleton. Pass it
 * from the panel root for best coverage.
 */
export function watchHaComponents(
  host: ReactiveControllerHost,
  hass?: AnyHass,
): void {
  for (const name of HA_COMPONENTS) {
    if (!customElements.get(name)) {
      void customElements.whenDefined(name).then(() => host.requestUpdate());
    }
  }
  if (!_kickedOff) {
    _kickedOff = true;
    void ensureHaComponents(hass);
  }
}
