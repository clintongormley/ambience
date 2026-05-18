import { build } from "esbuild";

await build({
  entryPoints: ["frontend/src/main.ts"],
  bundle: true,
  format: "esm",
  target: "es2022",
  outfile: "custom_components/ambience/frontend/ambience-panel.js",
  minify: true,
  sourcemap: false,
  legalComments: "none",
  // HA's frontend serves `custom-card-helpers` via an import map, so we
  // resolve it at runtime in the browser rather than bundling our own copy.
  // The runtime resolution gives us HA's actual helpers (including the
  // current location of loadCardHelpers, wherever HA has moved it).
  external: ["custom-card-helpers"],
  banner: {
    js: "/* Ambience panel — bundled output. Do not edit by hand. */",
  },
});

console.log("Built custom_components/ambience/frontend/ambience-panel.js");
