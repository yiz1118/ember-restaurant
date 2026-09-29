import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: ["site.spec.ts", "creator.spec.ts"],
  fullyParallel: false,
  workers: 2,
  timeout: 30000,
  use: { baseURL: "http://localhost:3201", browserName: "chromium", channel: "chrome", trace: "retain-on-failure" },
  reporter: [["list"], ["html", { open: "never" }]],
  webServer: { command: "node ./node_modules/next/dist/bin/next start -p 3201", url: "http://localhost:3201", reuseExistingServer: false, timeout: 60000, env: { NEXT_TELEMETRY_DISABLED: "1" } },
});
