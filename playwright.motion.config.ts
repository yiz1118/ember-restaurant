import { defineConfig } from "@playwright/test";
import browserConfig from "./playwright.icons.config";

export default defineConfig(browserConfig, {
  testMatch: "motion.spec.ts",
  outputDir: "test-results/motion",
  reporter: [["list"], ["html", { outputFolder: "playwright-report/motion", open: "never" }]],
});
