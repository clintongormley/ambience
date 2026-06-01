// frontend/src/lazy-frontend.ts
/**
 * Lazy loader for the heavy <ambience-frontend> chunk.
 *
 * Both the panel (main.ts) and the card (card.ts) bundle this helper and call
 * loadFrontend() on first render. The chunk lives next to the loader under the
 * same served directory; we compute its URL from import.meta.url using string
 * ops (NOT `new URL("./literal", import.meta.url)`, which esbuild would treat
 * as an emitted asset, and NOT a literal dynamic import, which esbuild would
 * bundle).
 */

// Indirection so tests can stub the dynamic import.
export const _internals = {
  importer: (url: string): Promise<unknown> => import(/* @vite-ignore */ url),
};

let pending: Promise<void> | undefined;

export function loadFrontend(metaUrl: string = import.meta.url): Promise<void> {
  if (!pending) {
    const queryStart = metaUrl.indexOf("?");
    const path = queryStart === -1 ? metaUrl : metaUrl.slice(0, queryStart);
    const dir = path.slice(0, path.lastIndexOf("/") + 1);
    const query = queryStart === -1 ? "" : metaUrl.slice(queryStart + 1);
    const fe = new URLSearchParams(query).get("fe") ?? "";
    const target = `${dir}ambience-frontend.js${fe ? `?fe=${fe}` : ""}`;
    const p = _internals.importer(target).then(() => undefined);
    // Don't memoise a failure: clear so a later call can retry.
    p.catch(() => {
      if (pending === p) pending = undefined;
    });
    pending = p;
  }
  return pending;
}

// Test-only: reset the memoised promise between cases.
export function _resetForTests(): void {
  pending = undefined;
}
