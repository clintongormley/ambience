// happy-dom doesn't ship CSSStyleSheet.replaceSync used by Lit's adoptedStyleSheets.
// Lit's polyfill kicks in when adoptedStyleSheets is undefined; force that path.
// @ts-expect-error -- runtime-only shim
if (typeof document !== "undefined" && !("adoptedStyleSheets" in Document.prototype)) {
  Object.defineProperty(Document.prototype, "adoptedStyleSheets", {
    configurable: true,
    get() { return []; },
    set() { /* no-op */ },
  });
}

// happy-dom's HTML parser silently drops `<?...>` bogus-comment nodes when
// assigned to `<template>.innerHTML`, even though it handles them correctly in
// regular elements.  Lit 3 uses `<?lit$RAND$>` as its dynamic-part marker
// inside template strings; without this patch, Lit's template walker finds no
// part markers and never commits nested/conditional TemplateResults.
//
// Fix: intercept `HTMLTemplateElement.innerHTML` setter and rewrite
// `<?lit$...?>` → `<!--?lit$...-->` (an equivalent comment node with the same
// `.data` value that Lit's SHOW_COMMENT tree walker looks for).
if (typeof HTMLTemplateElement !== "undefined") {
  const _litMarker = /<\?(lit\$[^>]*\$)>/g;
  const _desc = Object.getOwnPropertyDescriptor(HTMLTemplateElement.prototype, "innerHTML");
  if (_desc?.set) {
    Object.defineProperty(HTMLTemplateElement.prototype, "innerHTML", {
      ..._desc,
      set(value: string) {
        _desc.set!.call(this, value.replace(_litMarker, "<!--?$1-->"));
      },
    });
  }
}
