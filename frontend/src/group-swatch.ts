import { css, html } from "lit";

import { groupSwatchStyle } from "./group-colors.js";

// Shared CSS for the square colour swatch shell. Size is parameterised via CSS
// custom properties so each view can scale it (`--group-swatch-size` /
// `--group-swatch-icon-size`) without redefining the rest of the shell.
export const groupSwatchStyles = css`
  .group-swatch {
    flex: 0 0 auto;
    width: var(--group-swatch-size, 2rem);
    height: var(--group-swatch-size, 2rem);
    border-radius: 6px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--secondary-background-color, #e0e0e0);
    color: var(--secondary-text-color, #555);
  }
  .group-swatch ha-icon {
    --mdc-icon-size: var(--group-swatch-icon-size, 20px);
  }
`;

// A square swatch in the group's colour holding its icon. A coloured group
// paints the swatch via `groupSwatchStyle`; an unset colour falls back to the
// neutral shell colours from `groupSwatchStyles`. `icon` is optional.
export function groupSwatch(color: string | undefined, icon: string | undefined) {
  return html`<span class="group-swatch" style=${groupSwatchStyle(color)}>
    ${icon ? html`<ha-icon icon=${icon}></ha-icon>` : ""}
  </span>`;
}
