/**
 * Register a custom element unconditionally and idempotently.
 *
 * We deliberately do NOT guard with `customElements.get(name)` first. Under
 * Home Assistant's scoped-custom-element-registry, `get()` can transiently
 * return a truthy value for a name that is not actually registered in the
 * registry HA queries when creating cards. A `get(name) || define(name)` guard
 * therefore sometimes SKIPS the define entirely, leaving the element undefined
 * (the symptom: a pre-configured card reports "Custom element not found" on a
 * cold load, yet works after a later refresh).
 *
 * So always attempt `define()` and swallow the "already defined" error that a
 * genuine re-evaluation would raise.
 */
export function defineElement(name: string, ctor: CustomElementConstructor): void {
  try {
    customElements.define(name, ctor);
  } catch {
    // Already defined (module evaluated more than once). Safe to ignore.
  }
}
