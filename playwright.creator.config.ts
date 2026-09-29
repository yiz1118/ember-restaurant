import { defineConfig } from "@playwright/test";
import iconConfig from "./playwright.icons.config";

export default defineConfig(iconConfig, {
  testMatch: "creator.spec.ts",
  outputDir: "test-results/creator",
  reporter: [["list"], ["html", { outputFolder: "playwright-report/creator", open: "never" }]],
});
