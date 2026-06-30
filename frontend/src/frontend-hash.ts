// frontend/src/frontend-hash.ts
/**
 * Read the content hash a frontend bundle was served with. HA serves the heavy
 * chunk as `ambience-frontend.js?fe=<hash>`; esbuild emits real ESM, so
 * `import.meta.url` inside the chunk resolves to that served URL. The version
 * banner compares the running chunk's `fe` against the server's current hash to
 * detect a stale, cached bundle after an upgrade.
 */

/** The `fe` query param of `url`, or "" when there is no query / no `fe`. */
export function feFromUrl(url: string): string {
  const q = url.indexOf("?");
  if (q === -1) return "";
  return new URLSearchParams(url.slice(q + 1)).get("fe") ?? "";
}

// Test seam: tests override runningFrontendHash to simulate a stale bundle.
// In production import.meta.url is the served ambience-frontend.js?fe=… URL.
export const _hashInternals = {
  runningFrontendHash(): string {
    return feFromUrl(import.meta.url);
  },
};
