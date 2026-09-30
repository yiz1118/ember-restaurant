import { test, expect } from "@playwright/test";

const routes = ["/", "/menu", "/story", "/chef", "/gallery", "/reservation", "/contact"];

declare global {
  interface Window { motionLayoutShift: number; }
}

for (const width of [375, 390, 430, 768, 1024, 1440]) {
  test(`motion keeps every route stable and free of overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    await page.addInitScript(() => {
      window.motionLayoutShift = 0;
      if (PerformanceObserver.supportedEntryTypes.includes("layout-shift")) {
        new PerformanceObserver(list => list.getEntries().forEach(entry => {
          const shift = entry as PerformanceEntry & { value: number; hadRecentInput: boolean };
          if (!shift.hadRecentInput) window.motionLayoutShift += shift.value;
        })).observe({ type: "layout-shift", buffered: true });
      }
    });
    for (const route of routes) {
      expect((await page.goto(route))?.status(), route).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      const layout = await page.locator("main,main h1,.site-header,.footer").evaluateAll(elements => elements.map(element => {
        const e = element as HTMLElement;
        return [e.offsetLeft, e.offsetTop, e.offsetWidth, e.offsetHeight];
      }));
      await page.evaluate(() => { window.motionLayoutShift = 0; });
      const target = page.locator('[data-reveal="text"], [data-reveal="stagger"]').last();
      if (await target.count()) {
        await target.scrollIntoViewIfNeeded();
        await expect.poll(() => target.evaluate(element => getComputedStyle(element).opacity)).toBe("1");
      }
      await page.locator(".creator-note").scrollIntoViewIfNeeded();
      expect(await page.locator("main,main h1,.site-header,.footer").evaluateAll(elements => elements.map(element => {
        const e = element as HTMLElement;
        return [e.offsetLeft, e.offsetTop, e.offsetWidth, e.offsetHeight];
      })), route).toEqual(layout);
      const result = await page.evaluate(() => ({ overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - document.documentElement.clientWidth, shift: window.motionLayoutShift }));
      expect(result.overflow, route).toBeLessThanOrEqual(1);
      expect(result.shift, `${route} animation-induced layout shifts`).toBeLessThanOrEqual(.01);
    }
    expect(errors).toEqual([]);
  });
}

test("photographs reveal once, finish at their original crop, and never hide a focused link", async ({ page }) => {
  await page.goto("/");
  const image = page.locator(".signature-feature .image-frame");
  await expect(image).toHaveClass(/will-reveal/);
  await image.scrollIntoViewIfNeeded();
  await expect(image).toHaveClass(/is-visible/);
  await expect.poll(() => image.locator("img").evaluate(element => getComputedStyle(element).opacity)).toBe("1");
  await expect.poll(() => image.locator("img").evaluate(element => getComputedStyle(element).transform)).toBe("matrix(1, 0, 0, 1, 0, 0)");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(image).toHaveClass(/is-visible/);
  const preview = page.locator(".preview-row").first();
  await preview.focus();
  await expect(preview).toBeFocused();
  await expect.poll(() => preview.evaluate(element => getComputedStyle(element).opacity)).toBe("1");
});

test("reduced motion responds immediately, including an operating-system preference change", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator(".signature-feature .image-frame")).toHaveClass(/will-reveal/);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".will-reveal")).toHaveCount(0);
  const animation = await page.locator(".hero-image").evaluate(element => getComputedStyle(element).animationName);
  expect(animation).toBe("none");
  await page.locator(".signature-feature .image-frame").scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator(".signature-feature img").evaluate(element => getComputedStyle(element).opacity)).toBe("1");
  expect(await page.evaluate(() => document.getAnimations().filter(animation => animation.playState === "running").length)).toBe(0);
});

test("motion remains progressive enhancement when JavaScript is disabled", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/menu");
  await expect(page.getByRole("heading", { name: "Whole sea bream" })).toBeVisible();
  expect(await page.locator(".menu-item").first().evaluate(element => getComputedStyle(element).opacity)).toBe("1");
  await page.goto("/");
  await page.locator(".signature-feature").scrollIntoViewIfNeeded();
  expect(await page.locator(".signature-feature img").evaluate(element => getComputedStyle(element).opacity)).toBe("1");
  await page.locator(".creator-contact summary").click();
  await expect(page.locator('.creator-contact-options [data-creator-action="email"]')).toBeVisible();
  await expect(page.locator('[data-creator-action="portfolio"]')).toHaveAttribute("href", "https://alson-portfolio-nine.vercel.app/");
  await context.close();
});

test("mobile menu transitions keep closed links inert and route changes immediate", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const nav = page.locator("#main-nav");
  await expect(nav).toHaveAttribute("inert", "");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(nav).not.toHaveAttribute("inert");
  await nav.getByRole("link", { name: "Gallery" }).focus();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
  await expect(nav).toHaveAttribute("inert", "");
  await expect(nav).toBeHidden();
  await page.getByRole("button", { name: "Open menu" }).click();
  await nav.getByRole("link", { name: "Gallery" }).click();
  await expect(page).toHaveURL(/\/gallery$/);
  await expect(page.locator("main h1")).toBeVisible();
  await expect(page.locator("#main-nav")).toHaveAttribute("inert", "");
  await page.getByRole("button", { name: "Food", exact: true }).click();
  await expect(page.locator(".gallery-tile")).toHaveCount(2);
  await expect.poll(() => page.locator(".gallery-tile").first().evaluate(element => getComputedStyle(element).opacity)).toBe("1");
  await page.locator(".gallery-tile").first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("dialog")).toHaveAttribute("aria-label", /image 2 of 2/);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator(".gallery-tile").first()).toBeFocused();
});

test("hover feedback never changes link dimensions or pushes neighboring content", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const selector of [".intro-content .text-link", ".preview-row", ".creator-portfolio"]) {
    const link = page.locator(selector).first();
    await link.scrollIntoViewIfNeeded();
    const before = await link.boundingBox();
    await link.hover();
    expect(await link.boundingBox()).toEqual(before);
  }
});
