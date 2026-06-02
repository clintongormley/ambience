import { css, html } from "lit";

import { categorySwatchStyle } from "./category-colors.js";

// Shared CSS for the square colour swatch shell. Size is parameterised via CSS
// custom properties so each view can scale it (`--category-swatch-size` /
// `--category-swatch-icon-size`) without redefining the rest of the shell.
export const categorySwatchStyles = css`
  .category-swatch {
    flex: 0 0 auto;
    width: var(--category-swatch-size, 2rem);
    height: var(--category-swatch-size, 2rem);
    border-radius: 6px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--secondary-background-color, #e0e0e0);
    color: var(--secondary-text-color, #555);
  }
  .category-swatch ha-icon {
    --mdc-icon-size: var(--category-swatch-icon-size, 20px);
  }
`;

// A square swatch in the category's colour holding its icon. A coloured category
// paints the swatch via `categorySwatchStyle`; an unset colour falls back to the
// neutral shell colours from `categorySwatchStyles`. `icon` is optional.
export function categorySwatch(color: string | undefined, icon: string | undefined) {
  return html`<span class="category-swatch" style=${categorySwatchStyle(color)}>
    ${icon ? html`<ha-icon icon=${icon}></ha-icon>` : ""}
  </span>`;
}
