import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    include: ["test/**/*.test.ts"],
    // Node 22+ ships an experimental global `localStorage` that emits an
    // ExperimentalWarning the moment it's referenced (and returns undefined
    // without --localstorage-file). jsdom + test/setup.ts provide the real
    // window.localStorage, so disable Node's variant in the worker processes to
    // keep test output pristine. Set on both pools so it applies whichever runs.
    poolOptions: {
      forks: { execArgv: ["--no-experimental-webstorage"] },
      threads: { execArgv: ["--no-experimental-webstorage"] },
    },
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
