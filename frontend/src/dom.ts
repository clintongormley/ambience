/**
 * Dispatch the standard `value-changed` event used by every editor component
 * to bubble a new value to its parent. `bubbles` + `composed` so it crosses
 * shadow-DOM boundaries, matching HA's own form components.
 */
export function emitValueChanged(target: EventTarget, value: unknown): void {
  target.dispatchEvent(
    new CustomEvent("value-changed", {
      detail: { value },
      bubbles: true,
      composed: true,
    }),
  );
}
