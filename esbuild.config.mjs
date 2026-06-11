import { build } from "esbuild";

const common = {
  bundle: true,
  format: "esm",
  target: "es2022",
  minify: true,
  sourcemap: false,
  legalComments: "none",
  banner: {
    js: "/* Ambience — bundled output. Do not edit by hand. */",
  },
};

const outDir = "custom_components/ambience/frontend";

// Heavy shared chunk: the full UI. Lazy-loaded by both loaders below.
await build({
  ...common,
  entryPoints: ["frontend/src/ambience-frontend.ts"],
  outfile: `${outDir}/ambience-frontend.js`,
});

// Sidebar panel loader (registered only when the sidebar option is on).
await build({
  ...common,
  entryPoints: ["frontend/src/main.ts"],
  outfile: `${outDir}/ambience-panel.js`,
});

// Card loader (registered globally so it appears in the card picker).
await build({
  ...common,
  entryPoints: ["frontend/src/card.ts"],
  outfile: `${outDir}/ambience-card.js`,
});

console.log("Built ambience-frontend.js, ambience-panel.js, ambience-card.js");
