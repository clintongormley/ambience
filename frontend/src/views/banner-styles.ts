import { css } from "lit";

/** Shared notice/hint banner styles (icon + text block + CTA + dismiss ✕).
 *  Hosts add `bannerStyles` to their `static styles` array and render a
 *  `<div class="banner …">`. The `.banner-hint` modifier tints the icon with
 *  the primary colour (optional suggestion).
 *  The CTA is styled for both `<button>` and `<a>` (text-decoration removed). */
export const bannerStyles = css`
  .banner {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.85rem 1rem;
    margin: 0 0 1rem 0;
    border: 1px solid var(--divider-color, #e0e0e0);
    border-radius: 8px;
    background: var(--card-background-color, #fff);
  }
  .banner-icon {
    flex: 0 0 auto;
    margin-top: 0.1rem;
    --mdc-icon-size: 22px;
  }
  .banner-hint .banner-icon {
    color: var(--primary-color, #03a9f4);
  }
  .banner-text {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }
  .banner-text strong {
    font-weight: 600;
  }
  .banner-text span {
    font-size: 0.9rem;
    color: var(--secondary-text-color, #888);
  }
  .banner-cta {
    flex: 0 0 auto;
    align-self: center;
    background: var(--primary-color, #03a9f4);
    border: 1px solid var(--primary-color, #03a9f4);
    color: var(--text-primary-color, #fff);
    border-radius: 4px;
    padding: 0.45rem 0.9rem;
    font: inherit;
    font-size: 0.9rem;
    cursor: pointer;
    white-space: nowrap;
    text-decoration: none;
  }
  .banner-dismiss {
    flex: 0 0 auto;
    align-self: flex-start;
    background: transparent;
    border: none;
    color: var(--secondary-text-color, #888);
    cursor: pointer;
    padding: 0.15rem 0.3rem;
  }
  .banner-dismiss:hover {
    color: var(--primary-text-color, inherit);
  }
`;
