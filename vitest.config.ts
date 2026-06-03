import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      // custom-card-helpers is not installed; stub it so ha-components.ts
      // can be imported in tests without Vite erroring on the dynamic import.
      "custom-card-helpers": path.resolve(
        __dirname,
        "test/stubs/custom-card-helpers.ts",
      ),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    include: ["test/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["frontend/src/**/*.ts"],
      exclude: [
        "frontend/src/**/*.d.ts",
        "frontend/src/main.ts",
        // Type-only modules emit no runtime code, so they'd otherwise report 0%.
        "frontend/src/types.ts",
        "frontend/src/ha-form.ts",
      ],
      // Locked to ~the achieved levels (99.0 lines / 94.7 branch / 98.4 funcs),
      // with a couple of points of headroom against flake.
      thresholds: {
        lines: 97,
        functions: 97,
        branches: 92,
        statements: 97,
      },
    },
  },
});
