/** Generate a random, dash-free hex id suitable for an opaque entity id.
 *
 *  `crypto.randomUUID()` is only defined in *secure contexts* (HTTPS or
 *  localhost). Home Assistant is frequently reached over plain `http://`, where
 *  it is `undefined` and calling it throws `TypeError: crypto.randomUUID is not
 *  a function`. `crypto.getRandomValues()` has no such restriction, so prefer a
 *  UUID, fall back to 16 random bytes, and finally to `Math.random()` if the
 *  Web Crypto API is missing entirely. */
export function randomId(): string {
  const c = globalThis.crypto;
  if (c?.randomUUID) return c.randomUUID().replace(/-/g, "");
  if (c?.getRandomValues) {
    const bytes = c.getRandomValues(new Uint8Array(16));
    return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  }
  return Array.from({ length: 4 }, () =>
    Math.floor(Math.random() * 0x100000000)
      .toString(16)
      .padStart(8, "0"),
  ).join("");
}
