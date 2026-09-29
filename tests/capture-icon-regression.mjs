import { chromium } from "@playwright/test";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const phase = process.argv[2];
if (!["before", "after"].includes(phase)) throw new Error("Use before or after.");
const directory = "artifacts/icon-consistency";
await mkdir(directory, { recursive: true });
if (phase === "before") {
  const exists = await readFile(`${directory}/before-geometry.json`).then(() => true, () => false);
  if (exists) throw new Error("The original baseline already exists; keep it for comparison.");
}
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ reducedMotion: "reduce" });
const records = {};
const selector = ".concept-strip,.header-inner,.hero,main h1,main h2,.section-pad,.image-frame,.button,.header-book,.text-link,.preview-row,.menu-toggle,.mobile-book-bar,.gallery-tile,#partySize";
for (const width of [375, 390, 430, 768, 1024, 1440]) {
  await page.setViewportSize({ width, height: 900 });
  for (const route of ["/", "/menu", "/story", "/chef", "/gallery", "/reservation", "/contact", "/missing-icon-audit-page"]) {
    await page.goto(`http://localhost:3200${route}`);
    await page.evaluate(() => document.fonts.ready);
    records[`${width}:${route}`] = await page.locator(selector).evaluateAll(elements => elements.map(element => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return { tag: element.tagName, className: element.className, x: rect.x, y: rect.y, width: rect.width, height: rect.height, font: style.fontFamily, fontSize: style.fontSize, color: style.color, background: style.backgroundColor, padding: style.padding, margin: style.margin, border: style.borderWidth };
    }));
    if ([390,1440].includes(width) && ["/", "/reservation"].includes(route)) {
      await page.screenshot({ path: `${directory}/${phase}-${width}-${route === "/" ? "home" : "reservation"}.png` });
    }
  }
}
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto("http://localhost:3200/gallery");
await page.locator(".gallery-tile").first().click();
await page.locator(".lightbox-panel > img").evaluate(image => image.decode());
await page.screenshot({ path: `${directory}/${phase}-gallery-dialog.png` });
records.dialog = await page.locator(".lightbox button").evaluateAll(elements => elements.map(element => {
  const rect = element.getBoundingClientRect();
  return { label: element.getAttribute("aria-label"), width: rect.width, height: rect.height };
}));
await browser.close();
await writeFile(`${directory}/${phase}-geometry.json`, JSON.stringify(records, null, 2));
if (phase === "after") {
  const before = JSON.parse(await readFile(`${directory}/before-geometry.json`, "utf8"));
  const changes = [];
  for (const key of Object.keys(before)) {
    if (key === "dialog") continue;
    before[key].forEach((record, index) => {
      const after = records[key][index];
      for (const property of ["x", "y", "width", "height"]) {
        if (Math.abs(record[property] - after[property]) > 0.25) changes.push({ key, element: record.className || record.tag, property, before: record[property], after: after[property] });
      }
      for (const property of ["font", "fontSize", "color", "background", "padding", "margin", "border"]) {
        const beforeTokens = String(record[property]).split(" ");
        const afterTokens = String(after[property]).split(" ");
        const equivalentLengths = ["padding", "margin", "border"].includes(property) && beforeTokens.length === afterTokens.length && beforeTokens.every((value, index) => value.endsWith("px") && afterTokens[index].endsWith("px") && Math.abs(parseFloat(value) - parseFloat(afterTokens[index])) <= .25);
        if (record[property] !== after[property] && !equivalentLengths) changes.push({ key, element: record.className || record.tag, property, before: record[property], after: after[property] });
      }
    });
  }
  const intentional = changes.filter(change => change.element === "menu-toggle" || change.element === "SELECT" && change.property === "padding");
  const unexpected = changes.filter(change => !intentional.includes(change));
  await writeFile(`${directory}/geometry-comparison.json`, JSON.stringify({ changes, intentionalCount: intentional.length, unexpected, beforeDialog: before.dialog, afterDialog: records.dialog }, null, 2));
  console.log(JSON.stringify({ captures: Object.keys(records).length, intentionalChanges: intentional.length, unexpected }));
  if (unexpected.length) process.exitCode = 1;
} else console.log(`Captured ${Object.keys(records).length} baseline states.`);
