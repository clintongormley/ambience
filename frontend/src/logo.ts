/**
 * The Ambience wordmark for the panel header.
 *
 * Rendered as an <img> pointing at the brand PNGs published next to the panel
 * bundle (see assets/brand/generate.sh). The PNGs carry the canonical Avenir
 * Next type, so the wordmark looks identical on every platform — unlike an
 * inline SVG, which would fall back to a system font where Avenir Next is
 * absent. The default ("light") art is optimised for light backgrounds; `dark`
 * selects the vibrant art for dark backgrounds. @2x is offered via srcset.
 *
 * URLs resolve relative to this module, which esbuild bundles into
 * frontend/ambience-panel.js — served from the same directory as the PNGs.
 */
import { html, type TemplateResult } from "lit";

// Directory this module lives in, at runtime. In production import.meta.url is
// the served bundle URL (…/frontend/ambience-panel.js?hash=…); slicing to the
// last "/" drops the filename and any query, leaving …/frontend/. We avoid
// `new URL("./x", import.meta.url)` because bundlers special-case that pattern
// for static assets and choke on a dynamic name.
const DIR = import.meta.url.slice(0, import.meta.url.lastIndexOf("/") + 1);

function asset(name: string): string {
  return DIR + name;
}

export function renderLogo(
  opts: { dark?: boolean; title?: string } = {},
): TemplateResult {
  const title = opts.title ?? "Ambience";
  const base = opts.dark ? "dark_logo" : "logo";
  const src1x = asset(`${base}.png`);
  const src2x = asset(`${base}@2x.png`);
  return html`<img
    class="ambience-logo"
    src=${src1x}
    srcset="${src1x} 1x, ${src2x} 2x"
    alt=${title}
  />`;
}
