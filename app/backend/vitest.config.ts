import { defineConfig } from "vitest/config";

export default defineConfig({
  // tsc also emits test modules: never discover a second copy under dist/.
  test: { include: ["test/**/*.test.ts"] },
});
