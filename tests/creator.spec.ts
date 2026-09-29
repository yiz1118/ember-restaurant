import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { creator } from "../config/creator";

test.use({ reducedMotion: "reduce" });

const routes = ["/", "/menu", "/story", "/chef", "/gallery", "/reservation", "/contact"];
type Geometry = { tag: string; className: string; x: number; y: number; width: number; height: number; font: string; fontSize: string; color: string; background: string; padding: string; border: string };
const baseline = JSON.parse(readFileSync("artifacts/creator/before-geometry.json", "utf8")) as Record<string, Geometry[]>;
const geometrySelector = ".concept-strip,.header-inner,.hero,main h1,main h2,.section-pad,.image-frame,.button,.header-book,.text-link,.preview-row,.menu-toggle,.mobile-book-bar,.gallery-tile,#partySize,.footer-top,.footer-bottom";

for (const width of [375, 390, 430, 768, 1024, 1440]) {
  test(`creator credit and contacts fit at ${width}px without changing the brand layout`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      const section = page.getByRole("region", { name: "Let’s build something together." });
      await expect(section.getByText(creator.name, { exact: true })).toBeVisible();
      await expect(section.getByText(creator.title, { exact: true })).toBeVisible();
      await expect(section.getByText(creator.availability, { exact: true })).toBeVisible();
      await expect(section.getByText("Independent Concept Project", { exact: true })).toBeVisible();
      await expect(section.getByRole("link", { name: "View Portfolio" })).toHaveCount(0);
      const result = await page.locator(geometrySelector).evaluateAll(elements => elements.filter(element => !element.closest(".creator-note")).map(element => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return { tag: element.tagName, className: element.className, x: rect.x, y: rect.y, width: rect.width, height: rect.height, font: style.fontFamily, fontSize: style.fontSize, color: style.color, background: style.backgroundColor, padding: style.padding, border: style.borderWidth };
      }));
      const creatorHeight = await section.evaluate(element => element.getBoundingClientRect().height);
      expect(result.length, route).toBe(baseline[`${width}:${route}`].length);
      if (!testInfo.project.name || testInfo.project.name === "windows-chrome") result.forEach((record, index) => {
        const before = baseline[`${width}:${route}`][index];
        for (const property of ["x", "y", "width", "height"] as const) {
          const expected = before[property] + (record.className === "footer-bottom" && property === "y" ? creatorHeight : 0);
          expect(Math.abs(record[property] - expected), `${route} ${record.className} ${property}`).toBeLessThanOrEqual(.25);
        }
        for (const property of ["font", "fontSize", "color", "background", "padding", "border"] as const) expect(record[property], `${route} ${record.className} ${property}`).toBe(before[property]);
      });
      const overflow = await page.evaluate(() => Math.max(document.body.scrollWidth, document.documentElement.scrollWidth) - document.documentElement.clientWidth);
      expect(overflow, route).toBeLessThanOrEqual(1);
    }
    await page.goto("/");
    const section = page.locator(".creator-note");
    await section.scrollIntoViewIfNeeded();
    await page.locator(".creator-contact summary").click();
    await expect(section.getByText(creator.email, { exact: true })).toBeVisible();
    await expect(section.getByText(creator.whatsappDisplay, { exact: true })).toBeVisible();
    for (const link of await section.locator("a:visible, summary").all()) {
      const box = await link.boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(44);
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width);
      await link.click({ trial: true });
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    await section.screenshot({ path: testInfo.outputPath(`creator-${width}-expanded.png`) });
  });
}

test("project contacts have contextual messages, safe external links and tracking identifiers", async ({ page }) => {
  await page.goto("/");
  const section = page.locator(".creator-note");
  await expect(section).toHaveAttribute("data-creator-project", "EMBER");
  await expect(section.locator('[data-creator-action="start-project"]')).toHaveText("Start a Project");
  const whatsapp = new URL((await section.locator('[data-creator-action="whatsapp"]').first().getAttribute("href"))!);
  expect(whatsapp.origin + whatsapp.pathname).toBe(creator.whatsappUrl);
  expect(whatsapp.searchParams.get("text")).toBe("Hi Alson, I came across your EMBER concept project and I'm interested in discussing a website/app project with you.");
  const email = new URL((await section.locator('[data-creator-action="email"]').first().getAttribute("href"))!);
  expect(email.protocol).toBe("mailto:");
  expect(email.pathname).toBe(creator.email);
  expect(email.searchParams.get("subject")).toBe("Project Inquiry — EMBER");
  expect(email.searchParams.get("body")).toContain("EMBER concept project");
  for (const [action, href] of [["linkedin", creator.linkedinUrl], ["github", creator.githubUrl]]) {
    await expect(section.locator(`[data-creator-action="${action}"]`)).toHaveAttribute("href", href);
  }
  for (const anchor of await section.locator('a[target="_blank"]').all()) await expect(anchor).toHaveAttribute("rel", "noopener noreferrer");
  await expect(section.locator('a[href="#"],a[href^="javascript:"]')).toHaveCount(0);
  await expect(page.locator(".header-book")).toHaveAttribute("href", "/reservation");
  await expect(page.locator('meta[name="author"]')).toHaveAttribute("content", creator.name);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /independent restaurant concept.*Alson Chua/);
});

test("Start a Project is keyboard accessible and offers both methods without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  const summary = page.locator(".creator-contact summary");
  await summary.focus();
  await expect(summary).toBeFocused();
  expect(await summary.evaluate(element => getComputedStyle(element).outlineStyle)).toBe("solid");
  await page.keyboard.press("Enter");
  await expect(page.locator(".creator-contact")).toHaveAttribute("open", "");
  await expect(page.locator('.creator-contact-options [data-creator-action="email"]')).toBeVisible();
  await expect(page.locator('.creator-contact-options [data-creator-action="whatsapp"]')).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(page.locator('.creator-contact-options [data-creator-action="whatsapp"]')).toBeFocused();
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".creator-contact")).not.toHaveAttribute("open");
  await context.close();
});

test("portfolio CTA appears only when a real URL is configured", async ({ page }) => {
  // Render in Node so Playwright's JSX test transform does not replace React elements.
  await page.setContent(execFileSync(process.execPath, ["tests/render-creator.mjs"], { encoding: "utf8" }));
  await expect(page.getByRole("link", { name: "View Portfolio" })).toHaveCount(0);
  const portfolioUrl = "https://portfolio.example.com/";
  await page.setContent(execFileSync(process.execPath, ["tests/render-creator.mjs", portfolioUrl], { encoding: "utf8" }));
  const portfolio = page.getByRole("link", { name: "View Portfolio" });
  await expect(portfolio).toHaveAttribute("href", portfolioUrl);
  await expect(portfolio).toHaveAttribute("data-creator-action", "portfolio");
  await expect(portfolio).toHaveAttribute("rel", "noopener noreferrer");
});

test("creator layer passes accessibility checks closed and expanded", async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.locator(".creator-note").scrollIntoViewIfNeeded();
    for (const expanded of [false, true]) {
      if (expanded) await page.locator(".creator-contact summary").click();
      const result = await new AxeBuilder({ page }).include(".creator-note").analyze();
      expect(result.violations.map(violation => ({ id: violation.id, targets: violation.nodes.map(node => node.target) }))).toEqual([]);
    }
  }
});
