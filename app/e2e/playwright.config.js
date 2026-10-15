import { defineConfig } from "@playwright/test";

const port = process.env.E2E_PORT ?? "4300";
const baseURL = `http://localhost:${port}`;

// The tests start the real backend and let it serve the real pages.
// With no E2E_DATABASE_URL the server keeps requests in memory.
// With one, it uses PostgreSQL (see run-on-postgres.mjs).
export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  workers: 1,
  fullyParallel: false,
  retries: 0,
  reporter: [["list"], ["junit", { outputFile: "test-results/junit.xml" }]],
  use: {
    baseURL,
    // Uses the Chrome that is already installed, so nothing has to be downloaded.
    channel: "chrome",
    headless: true,
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npx tsx src/server.ts",
    cwd: "../backend",
    url: `${baseURL}/api/v1/health`,
    reuseExistingServer: false,
    timeout: 60_000,
    env: {
      PORT: port,
      NODE_ENV: "development",
      SEED_USER_PASSWORD: "demo",
      SEED_DEMO_DATA: "false",
      DATABASE_URL: process.env.E2E_DATABASE_URL ?? "",
    },
  },
});
