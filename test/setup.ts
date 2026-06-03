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
