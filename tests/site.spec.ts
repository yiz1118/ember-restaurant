import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { availableTimes, isClosedMonday, maxDate, singaporeNow, validateTable, type Reservation } from "../data/reservation";

const routes = ["/", "/menu", "/story", "/chef", "/gallery", "/reservation", "/contact"];
const widths = [375, 390, 430, 768, 1024, 1440];

for (const width of widths) {
  test(`all routes render without overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      const errors: string[] = [];
      page.on("pageerror", error => errors.push(error.message));
      page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
      const response = await page.goto(route);
      expect(response?.status(), route).toBe(200);
      await expect(page.locator("main h1")).toBeVisible();
      const dimensions = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, body: document.body.scrollWidth, html: document.documentElement.scrollWidth }));
      expect(dimensions.body, `${route} body @ ${width}`).toBeLessThanOrEqual(dimensions.viewport + 1);
      expect(dimensions.html, `${route} html @ ${width}`).toBeLessThanOrEqual(dimensions.viewport + 1);
      expect(errors, `${route} browser errors @ ${width}`).toEqual([]);
    }
  });
}

test("main routes, assets, and menu anchors work", async ({ page, request }) => {
  await page.goto("/");
  const internalLinks = new Set<string>();
  for (const route of routes) {
    expect(await request.get(route).then(response => response.status())).toBe(200);
    await page.goto(route);
    for (const href of await page.locator("a[href]").evaluateAll(anchors => anchors.map(anchor => anchor.getAttribute("href") || ""))) {
      if (href.startsWith("/")) internalLinks.add(href.split("#")[0]);
    }
  }
  for (const href of internalLinks) expect(await request.get(href).then(response => response.status()), href).toBe(200);
  await page.goto("/");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  const social = await request.get("/opengraph-image");
  expect(social.ok()).toBeTruthy();
  expect(social.headers()["content-type"]).toContain("image/png");
  for (const image of ["hearth", "mushrooms", "sea-bream", "dining-room", "chef", "seasonal"]) {
    const response = await request.get(`/images/${image}.webp`);
    expect(response.ok(), image).toBeTruthy();
    expect(response.headers()["content-type"]).toContain("image/webp");
  }
  await page.goto("/menu");
  await page.getByRole("link", { name: "From the Grill" }).click();
  await expect(page).toHaveURL(/#from-the-grill$/);
  await expect(page.getByRole("heading", { name: "From the Grill" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Whole sea bream" })).toBeVisible();
});

test("mobile navigation and gallery keyboard controls work", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Open menu" });
  await menu.click();
  await expect(page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Gallery" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
  await page.getByRole("link", { name: /Book a Table/ }).last().click();
  await expect(page).toHaveURL(/\/reservation$/);
  await page.goto("/gallery");
  await page.getByRole("button", { name: "Food", exact: true }).click();
  await expect(page.locator(".gallery-tile")).toHaveCount(2);
  const trigger = page.getByRole("button", { name: /View Fire-roasted oyster mushrooms/ });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("button", { name: "Close image" })).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("dialog")).toHaveAttribute("aria-label", /image 2 of 2/);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("reservation validates and completes locally without a booking request", async ({ page }) => {
  const sent: string[] = [];
  page.on("request", request => { if (request.method() !== "GET") sent.push(`${request.method()} ${request.url()}`); });
  await page.goto("/reservation");
  await page.getByRole("button", { name: /Continue/ }).click();
  await expect(page.getByText("Choose a date within the next 90 days.")).toBeVisible();
  await expect(page.locator("#date")).toBeFocused();
  const today = singaporeNow().date;
  let date = new Date(`${today}T00:00:00Z`);
  do { date = new Date(date.getTime() + 86400000); } while (isClosedMonday(date.toISOString().slice(0, 10)));
  const selected = date.toISOString().slice(0, 10);
  await page.locator("#date").fill(selected);
  await page.getByLabel("18:30").check();
  await page.getByRole("button", { name: /Continue/ }).click();
  await page.getByRole("button", { name: /Continue/ }).click();
  await expect(page.getByText("Enter your full name.")).toBeVisible();
  await page.locator("#name").fill("Alex River");
  await page.locator("#email").fill("alex@example.com");
  await page.locator("#phone").fill("+65 8123 4567");
  await page.getByRole("button", { name: /Continue/ }).click();
  await expect(page.getByText("Alex River")).toBeVisible();
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(page.locator("#name")).toHaveValue("Alex River");
  await page.getByRole("button", { name: /Continue/ }).click();
  await page.getByRole("button", { name: /Complete Demo/ }).click();
  await expect(page.getByText("Demo reservation complete — no table has been booked.")).toBeVisible();
  expect(sent).toEqual([]);
});

test("reservation rules use Singapore dates and reject Mondays and expired arrivals", () => {
  const now = { date: "2026-09-27", time: "19:10" };
  expect(availableTimes("2026-09-27", now)).toEqual(["19:30", "20:00", "20:30"]);
  expect(isClosedMonday("2026-09-28")).toBe(true);
  expect(availableTimes("2026-09-28", now)).toEqual([]);
  expect(maxDate("2026-09-27")).toBe("2026-12-26");
  const data: Reservation = { date: "2026-09-27", time: "18:00", partySize: "2", name: "", email: "", phone: "", notes: "" };
  expect(validateTable(data, now).time).toBeTruthy();
  expect(validateTable({ ...data, date: "2026-09-28", time: "19:30" }, now).date).toBeTruthy();
});

test("reduced-motion preference removes reveal animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".signature-feature .image-frame")).not.toHaveClass(/will-reveal/);
  const duration = await page.locator(".signature-feature .image-frame img").evaluate(element => parseFloat(getComputedStyle(element).transitionDuration));
  expect(duration).toBeLessThan(0.01);
});

test("representative pages pass automated accessibility checks", async ({ page }) => {
  // Fourteen complete axe scans need their own budget on a busy Windows host.
  test.setTimeout(90000);
  const violations: string[] = [];
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route);
      const results = await new AxeBuilder({ page }).analyze();
      if (results.violations.length) console.log(JSON.stringify(results.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })), null, 2));
      violations.push(...results.violations.map(v => `${route} @ ${width}: ${v.id} (${v.nodes.length})`));
    }
  }
  expect(violations).toEqual([]);
});

test("save portfolio presentation screenshots", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.screenshot({ path: "artifacts/screenshots/home-hero-desktop.png" });
  for (const image of await page.locator("#signature img").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
  }
  await page.locator("#signature").scrollIntoViewIfNeeded();
  await expect(page.locator(".signature-feature .image-frame")).toHaveClass(/is-visible/);
  await page.locator("#signature").screenshot({ path: "artifacts/screenshots/signature-food-desktop.png" });
  await page.goto("/menu");
  await page.screenshot({ path: "artifacts/screenshots/menu-intro-desktop.png" });
  await page.locator(".menu-section").first().screenshot({ path: "artifacts/screenshots/menu-desktop.png" });
  await page.goto("/reservation");
  const current = new Date(`${singaporeNow().date}T00:00:00Z`);
  let future = new Date(current.getTime() + 86400000);
  while (isClosedMonday(future.toISOString().slice(0, 10))) future = new Date(future.getTime() + 86400000);
  await page.locator("#date").fill(future.toISOString().slice(0, 10));
  await page.getByLabel("19:00").check();
  await page.locator(".reservation-shell").screenshot({ path: "artifacts/screenshots/reservation-desktop.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect.poll(() => page.locator(".hero-image").evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  await page.screenshot({ path: "artifacts/screenshots/home-mobile.png" });
  for (const image of await page.locator("#signature img").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
  }
  await page.locator("#signature").screenshot({ path: "artifacts/screenshots/signature-food-mobile.png" });
  await page.goto("/reservation");
  await page.locator("#date").fill(future.toISOString().slice(0, 10));
  await page.getByLabel("19:00").check();
  await page.locator(".reservation-shell").screenshot({ path: "artifacts/screenshots/reservation-mobile.png" });
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const [route, selector, name] of [["/story", ".story-hero", "story"], ["/chef", ".chef-profile", "chef"], ["/gallery", ".gallery-grid", "gallery"], ["/contact", ".contact-grid", "contact"]]) {
    await page.goto(route);
    const section = page.locator(selector);
    for (const image of await section.locator("img").all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
    }
    await section.screenshot({ path: `artifacts/screenshots/qa-${name}-desktop.png` });
  }
});
