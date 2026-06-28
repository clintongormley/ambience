// Silence Lit's "dev mode" banner in test output. Lit's dev build emits it once
// via issueWarning("dev-mode", …), which is skipped when its issued-warnings set
// already contains the code. Pre-seed it here (this setup file runs before any
// Lit import) — we run the dev build under test deliberately, so it's pure noise.
(globalThis as { litIssuedWarnings?: Set<string> }).litIssuedWarnings = new Set(["dev-mode"]);

// jsdom under this Node/vitest combo doesn't expose a working localStorage
// (Node's experimental Web Storage is gated behind --localstorage-file). The
// panel uses window.localStorage to remember a dismissed banner, so provide a
// minimal in-memory Storage for tests.
if (typeof window !== "undefined" && !("localStorage" in window && window.localStorage)) {
  const store = new Map<string, string>();
  const storage: Storage = {
    get length() {
      return store.size;
    },
    clear: () => store.clear(),
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    key: (i: number) => Array.from(store.keys())[i] ?? null,
    removeItem: (k: string) => void store.delete(k),
    setItem: (k: string, v: string) => void store.set(k, String(v)),
  };
  Object.defineProperty(window, "localStorage", { configurable: true, value: storage });
}

// jsdom doesn't implement URL.createObjectURL / revokeObjectURL. The diagnostics
// download helper uses them to turn a Blob into a downloadable link, so provide
// no-op stubs that tests can spy on.
if (typeof URL !== "undefined") {
  if (typeof URL.createObjectURL !== "function") {
    URL.createObjectURL = () => "blob:stub";
  }
  if (typeof URL.revokeObjectURL !== "function") {
    URL.revokeObjectURL = () => undefined;
  }
}

// jsdom doesn't ship CSSStyleSheet.replaceSync used by Lit's adoptedStyleSheets.
// Lit's polyfill kicks in when adoptedStyleSheets is undefined; force that path.
// @ts-expect-error -- runtime-only shim
if (typeof document !== "undefined" && !("adoptedStyleSheets" in Document.prototype)) {
  Object.defineProperty(Document.prototype, "adoptedStyleSheets", {
    configurable: true,
    get() {
      return [];
    },
    set() {
      /* no-op */
    },
  });
}
