import { test, expect, type Page } from "@playwright/test";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { isClosedMonday, singaporeNow } from "../data/reservation";

const routes = ["/", "/menu", "/story", "/chef", "/gallery", "/reservation", "/contact", "/missing-icon-audit-page"];
const iconCharacters = /[\u2190-\u2199\u21A9\u21AA\u27A1\u2B05-\u2B07\u00D7\u2715\u2716\u2630\u2637\u22EF\u2026\u2713\u2714\u2605\u2665\u2661\u2304\u2303\u2733\uFE0E\uFE0F]/u;

async function verifyIcons(page: Page) {
  const icons = await page.locator("svg.ui-icon").evaluateAll(elements => elements.map(element => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return {
      name: element.getAttribute("data-icon"), hidden: element.getAttribute("aria-hidden"),
      focusable: element.getAttribute("focusable"), viewBox: element.getAttribute("viewBox"),
      fill: element.getAttribute("fill"), stroke: element.getAttribute("stroke"),
      weight: element.getAttribute("stroke-width"), background: style.backgroundColor,
      color: style.color, parentColor: getComputedStyle(element.parentElement!).color,
      path: element.querySelector("path")?.getAttribute("d"), width: rect.width, height: rect.height,
    };
  }));
  expect(icons.length).toBeGreaterThan(0);
  for (const icon of icons) {
    expect(icon.hidden, icon.name!).toBe("true");
    expect(icon.focusable, icon.name!).toBe("false");
    expect(icon.viewBox, icon.name!).toBe("0 0 24 24");
    expect(icon.fill, icon.name!).toBe("none");
    expect(icon.stroke, icon.name!).toBe("currentColor");
    expect(icon.weight, icon.name!).toBe("1.6");
    expect(icon.background, icon.name!).toBe("rgba(0, 0, 0, 0)");
    // iPhone WebKit may report black on the native select wrapper after client navigation.
    // The chevron must retain the site's ink color while all other icons follow their text.
    expect(icon.color, icon.name!).toBe(icon.name === "chevron-down" ? "rgb(37, 35, 31)" : icon.parentColor);
    expect(icon.path, icon.name!).toBeTruthy();
    if (icon.width > 0) expect(icon.height, icon.name!).toBeGreaterThan(0);
  }
  expect(await page.locator("body").innerText()).not.toMatch(iconCharacters);
}

for (const width of [375, 390, 430, 768, 1024, 1440]) {
  test(`SVG icons and layout across every route at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator("main h1")).toBeVisible();
      await verifyIcons(page);
      const overflow = await page.evaluate(() => Math.max(document.body.scrollWidth, document.documentElement.scrollWidth) - document.documentElement.clientWidth);
      expect(overflow, route).toBeLessThanOrEqual(1);
    }
  });
}

test("touch controls use SVGs and preserve accessible names", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Open menu" });
  const bounds = await toggle.boundingBox();
  expect(bounds!.width).toBeGreaterThanOrEqual(44);
  expect(bounds!.height).toBeGreaterThanOrEqual(44);
  await expect(toggle.locator('svg[data-icon="menu"]')).toHaveCSS("opacity", "1");
  await expect(toggle.locator('svg[data-icon="close"]')).toHaveCSS("opacity", "0");
  await toggle.click();
  const closeMenu = page.getByRole("button", { name: "Close menu" });
  await expect(closeMenu).toHaveAttribute("aria-expanded", "true");
  await expect(closeMenu.locator('svg[data-icon="close"]')).toHaveCSS("opacity", "1");
  await expect(closeMenu.locator('svg[data-icon="menu"]')).toHaveCSS("opacity", "0");
  await expect(page.locator(".nav-book-mobile svg")).toBeVisible();
  await closeMenu.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");

  await page.goto("/gallery");
  const trigger = page.locator(".gallery-tile").first();
  await trigger.click();
  const dialog = page.getByRole("dialog");
  // Measure targets after the panel's entrance reaches its resting position.
  await expect(dialog.locator(".lightbox-panel")).toHaveCSS("transform", "none");
  for (const [label, icon] of [["Close image", "close"], ["Previous image", "arrow-left"], ["Next image", "arrow-right"]]) {
    const control = dialog.getByRole("button", { name: label, exact: true });
    await expect(control.locator("svg")).toHaveAttribute("data-icon", icon);
    const box = await control.boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
  await dialog.getByRole("button", { name: "Next image" }).click();
  await expect(dialog).toHaveAttribute("aria-label", /image 2 of 6/);
  await dialog.getByRole("button", { name: "Previous image" }).click();
  await expect(dialog).toHaveAttribute("aria-label", /image 1 of 6/);
  await verifyIcons(page);
  await dialog.getByRole("button", { name: "Close image" }).click();
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("guest selector, back controls and completion use SVGs", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/reservation");
  const guests = page.getByLabel("Party size");
  await expect(page.locator(".select-control svg")).toHaveAttribute("data-icon", "chevron-down");
  expect(await guests.evaluate(element => getComputedStyle(element).appearance)).toBe("none");
  await guests.selectOption("4");
  await expect(guests).toHaveValue("4");
  let date = new Date(`${singaporeNow().date}T00:00:00Z`);
  do { date = new Date(date.getTime() + 86400000); } while (isClosedMonday(date.toISOString().slice(0, 10)));
  await page.locator("#date").fill(date.toISOString().slice(0, 10));
  await page.getByLabel("18:30").check();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Who’s coming to dinner?" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Who’s coming to dinner?" })).toBeFocused();
  const back = page.getByRole("button", { name: "Back", exact: true });
  await expect(back.locator("svg")).toHaveAttribute("data-icon", "arrow-left");
  await back.click();
  await expect(page.getByRole("heading", { name: "Make an evening of it." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Make an evening of it." })).toBeFocused();
  await expect(guests).toHaveValue("4");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Who’s coming to dinner?" })).toBeFocused();
  await page.getByLabel("Full name").fill("Alex River");
  await page.getByLabel("Email", { exact: false }).fill("alex@example.com");
  await page.getByLabel("Phone").fill("+65 8123 4567");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Complete Demo", exact: true }).click();
  await expect(page.locator(".complete-star svg")).toHaveAttribute("data-icon", "starburst");
  await expect(page.getByRole("button", { name: "Start again", exact: true })).toBeVisible();
  await verifyIcons(page);
  await page.screenshot({ path: testInfo.outputPath("reservation-complete.png") });
});

test("desktop hover, focus and reduced motion keep icons visible", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const cta = page.locator(".header-book");
  const original = await cta.boundingBox();
  await cta.hover();
  await expect.poll(() => cta.evaluate(element => getComputedStyle(element).backgroundColor)).toBe("rgb(37, 35, 31)");
  await verifyIcons(page);
  await cta.focus();
  await expect(cta).toBeFocused();
  const focused = await cta.boundingBox();
  expect(focused!.height).toBe(original!.height);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(page.locator(".signature-feature .image-frame")).not.toHaveClass(/will-reveal/);
  await verifyIcons(page);
});

test("source contains no Unicode UI icons or emoji variation selectors", async () => {
  const files: string[] = [];
  async function collect(directory: string) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) await collect(file);
      else if (/\.(tsx?|jsx?|html|css|scss|svg)$/.test(entry.name)) files.push(file);
    }
  }
  for (const directory of ["app", "components", "config", "data", "public"]) await collect(directory);
  for (const file of files) {
    const source = await readFile(file, "utf8");
    expect(source, file).not.toMatch(iconCharacters);
    // Decode HTML numeric references and JS escapes as well as literal symbols.
    const decoded = source.replace(/&#(x[\da-f]+|\d+);/gi, (_, value: string) => String.fromCodePoint(value[0].toLowerCase() === "x" ? parseInt(value.slice(1), 16) : parseInt(value, 10)))
      .replace(/\\u\{([\da-f]+)\}|\\u([\da-f]{4})/gi, (_, long: string, short: string) => String.fromCodePoint(parseInt(long || short, 16)));
    expect(decoded, `${file} escaped symbols`).not.toMatch(iconCharacters);
  }
});
