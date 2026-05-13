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
  banner: {
    js: "/* Ambience panel — bundled output. Do not edit by hand. */",
  },
});

console.log("Built custom_components/ambience/frontend/ambience-panel.js");
