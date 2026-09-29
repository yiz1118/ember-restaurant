import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "icons.spec.ts",
  fullyParallel: false,
  workers: 2,
  timeout: 60000,
  use: { baseURL: "http://localhost:3201", trace: "retain-on-failure" },
  outputDir: "test-results/icons",
  reporter: [["list"], ["html", { outputFolder: "playwright-report/icons", open: "never" }]],
  webServer: { command: "node ./node_modules/next/dist/bin/next start -p 3201", url: "http://localhost:3201", reuseExistingServer: false, timeout: 60000, env: { NEXT_TELEMETRY_DISABLED: "1" } },
  projects: [
    { name: "windows-chrome", use: { browserName: "chromium", channel: "chrome" } },
    { name: "windows-edge", use: { browserName: "chromium", channel: "msedge" } },
    { name: "iphone-webkit-emulation", use: { ...devices["iPhone 13"], browserName: "webkit" } },
    { name: "desktop-webkit", use: { browserName: "webkit", viewport: { width: 1440, height: 900 } } },
    { name: "android-chrome-emulation", use: { ...devices["Pixel 5"], browserName: "chromium", channel: "chrome" } },
  ],
});
