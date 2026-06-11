import type { ReactiveControllerHost } from "lit";

// HA form components we use opportunistically — rendered when registered,
// fallback to self-contained Lit widgets otherwise.
//
// In HA 2026.05+, `ha-input`, `ha-form`, `ha-select` are eagerly registered.
// `ha-textfield` is the legacy variant that may still be registered on older
// installs. `ha-combo-box` is gone in 2026.05+ — we don't watch for it.
const HA_COMPONENTS = ["ha-input", "ha-textfield", "ha-form"] as const;

const TEXT_INPUT_VARIANTS = ["ha-input", "ha-textfield"] as const;

export type HaTextInputTag = (typeof TEXT_INPUT_VARIANTS)[number];

/**
 * Returns the best available text-input custom element tag (`ha-input` >
 * `ha-textfield`), or null if neither is in the registry.
 */
export function pickHaTextInput(): HaTextInputTag | null {
  for (const n of TEXT_INPUT_VARIANTS) {
    if (customElements.get(n)) return n;
  }
  return null;
}

/**
 * Watches the custom-element registry for HA's form components and requests
 * a host re-render whenever any of them become defined. This catches the
 * case where HA registers a component lazily as the user navigates.
 *
 * On HA 2026.05+ the components we care about (`ha-input`, `ha-form`) are
 * eagerly registered, so this is effectively a no-op there. The host is held
 * via WeakRef: `whenDefined` for a component that never registers (e.g.
 * `ha-textfield` on 2026.05+) stays pending forever, and HA rebuilds the
 * panel on every websocket reconnect — a strong reference would accumulate
 * detached component trees without bound.
 */
export function watchHaComponents(host: ReactiveControllerHost): void {
  const ref = new WeakRef(host);
  for (const name of HA_COMPONENTS) {
    if (!customElements.get(name)) {
      void customElements.whenDefined(name).then(() => ref.deref()?.requestUpdate());
    }
  }
}
