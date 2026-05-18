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
      exclude: ["frontend/src/**/*.d.ts", "frontend/src/main.ts"],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 85,
        statements: 90,
      },
    },
  },
});
