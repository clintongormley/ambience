/**
 * Minimal ambient types for `custom-card-helpers`. HA's frontend resolves
 * this module via an import map at runtime; we keep it as an esbuild
 * external (see esbuild.config.mjs) so the import string is preserved in
 * the bundle and the browser loads HA's actual helpers, not a vendored
 * copy. We declare just enough surface area to call loadCardHelpers().
 */
declare module "custom-card-helpers" {
  export interface CardHelpers {
    createCardElement(config: { type: string; [key: string]: unknown }): {
      constructor?: { getConfigElement?: () => Promise<unknown> };
    };
  }
  export function loadCardHelpers(): Promise<CardHelpers>;
}
