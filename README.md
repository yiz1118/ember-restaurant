# EMBER — a live-fire dining concept

EMBER is a fictional premium restaurant website built as a standalone portfolio concept. It demonstrates brand direction, editorial restaurant presentation, a digital menu, responsive layout, an interactive gallery, and a realistic reservation flow. **No restaurant, chef, address, booking system, or customer record exists.**

## Run locally

Use Node.js 24 LTS or another version supported by Next.js 16. The app has its own package and lockfile; run commands from this directory.

```powershell
npm ci
npm run dev
```

Open `http://localhost:3200`. If port 3200 is in use, stop or reconfigure the other process intentionally; the scripts do not terminate it. The production preview also uses port 3200.

## Checks

```powershell
npm run lint
npm run typecheck
npm run build
npm run test:browser
npm run test:icons
npm run test:creator
```

The browser test starts the production build on port 3201 and uses installed Google Chrome. Run `npm run build` first. The test checks all seven routes at 375, 390, 430, 768, 1024 and 1440 pixels, interactions, reservation behavior, and automated accessibility. Screenshots are saved in `artifacts/screenshots/`.

The icon matrix uses installed Chrome and Edge, Playwright WebKit, and iPhone/Android browser profiles; see [ICON-CONSISTENCY.md](ICON-CONSISTENCY.md) for scope and device limits.

The creator/contact layer is configured in `config/creator.ts`. Its footer credit and contact choices appear on every page. Leave `portfolioUrl: null` until the main portfolio is live, then set its real URL to reveal View Portfolio automatically. See [CREATOR-LAYER.md](CREATOR-LAYER.md) for contact messages, analytics identifiers, changed files and QA commands. The creator matrix uses the same five browser profiles as the icon matrix. Run browser suites sequentially because they share port 3201.

## Content and interactions

- Routes: `/`, `/menu`, `/story`, `/chef`, `/gallery`, `/reservation`, `/contact`.
- Menu, hours, gallery metadata and brand facts live in `data/`.
- The reservation form uses the current date and time in Singapore, closes Mondays, accepts sample arrivals from 18:00 to 20:30, and validates guests and contact details. It **never sends or saves the form**. The last screen explicitly says no table was booked.
- Gallery filters and lightbox run in the browser. The lightbox supports Escape, arrow keys, keyboard focus, and focus restoration.
- Each route carries `noindex` metadata because this is a concept and has not been prepared as a real restaurant listing.
- Generated images are stored locally as optimized WebP files. See `IMAGE-CREDITS.md` for provenance and prompts.

## Portfolio use

`CASE-STUDY.md` contains an honest project narrative. The standalone site is intentionally separate from the parent freelance portfolio application. It has not been deployed or published into the portfolio; use the real screenshots and case-study text when preparing that presentation.
