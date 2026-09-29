# Verification — 28 September 2026

## Creator/contact layer — 29 September 2026

The EMBER footer now includes an independent concept label, Alson Chua's creator credit and worldwide freelance availability, four real contact links, and a Start a Project chooser. `config/creator.ts` is the single profile source. View Portfolio is absent while `portfolioUrl` is null; the configured state was verified by rendering the actual component with a test URL without modifying the real configuration.

| Check | Result |
|---|---|
| ESLint / strict TypeScript / production build | Passed |
| `npm run test:browser` | 23 passed, including all 13 original site tests |
| `npm run test:creator` | 50 passed across five browser profiles |
| `npm run test:icons` | 50 passed after synchronizing the booking regression with its focus changes |
| Preserved-layout comparison | 42 route-width states; no unexpected differences |
| Source rescan | 23 UI source files; zero Unicode UI glyphs or emoji variation selectors |

The creator suite covers 375, 390, 430, 768, 1024 and 1440 CSS pixels, the seven content routes, expanded contact choices, at least 44px contact targets, pointer hit-testing, encoded message URLs, external-link attributes, JavaScript-free keyboard behavior, both portfolio states, and axe checks. Installed Windows Chrome and Edge, desktop and iPhone-profile Playwright WebKit, and Android-profile Chrome were used. The original page layout, fonts, color, padding, borders, navigation and CTA dimensions match the captured baseline; only the footer content below the inserted section moves down by its height. Desktop, mobile and iPhone-profile screenshots were inspected. Native physical iPhone, Mac and Android devices and live message delivery were not tested.

See [CREATOR-LAYER.md](CREATOR-LAYER.md) for the configuration, future portfolio step, changed-file inventory and tracking identifiers. The local production preview on port 3200 returned HTTP 200 over both localhost and its LAN address.

## Icon consistency update — 29 September 2026

All Unicode UI glyphs have been replaced with a shared SVG icon component. The production build, lint, typecheck, 13 existing site browser tests, and 50 additional icon tests passed. The icon suite ran in Windows Chrome and Edge, desktop and iPhone-profile WebKit, and Android-profile Chrome. All eight route states were checked at six widths; 49 before/after geometry states showed no unexpected layout differences. See [ICON-CONSISTENCY.md](ICON-CONSISTENCY.md) for the source audit, replaced symbols, screenshots, and physical-device testing limit.

## Restaurant application

The standalone EMBER application passed:

| Check | Result | Evidence |
|---|---|---|
| `npm run lint` | Pass | ESLint exited 0 after final source changes. |
| `npm run typecheck` | Pass | Strict TypeScript check exited 0. |
| `npm run build` | Pass | Next.js built all seven content routes, the not-found page, icon and social image. |
| `npm run test:browser` | 13 passed | Production server on port 3201, Google Chrome, Playwright. |

The browser suite covers seven routes at 375, 390, 430, 768, 1024 and 1440 pixels (42 route-width visits), checking response, visible heading, horizontal overflow, page errors and console errors. It also checks internal links, local image delivery, menu anchors, mobile navigation, gallery filtering and keyboard dialog behavior, the full reservation flow with no non-GET request, Singapore date rules, reduced motion, and automated axe checks across all routes at 390 and 1440 pixels. The social preview and `noindex` metadata were also checked.

The form explicitly states that completion makes no reservation. Date bounds, closed Mondays, expired same-day sample slots, guest validation, back/edit behavior and confirmation were verified by browser and rule tests. No server booking route or persistence exists.

## Visual review and presentation captures

The desktop hero, menu, signature-food, reservation, story, chef, gallery and contact captures were opened and inspected. The mobile hero, signature-food and reservation captures were inspected after waiting for their actual images to load. The source files are in `artifacts/screenshots/`:

- `home-hero-desktop.png`, `home-mobile.png`
- `signature-food-desktop.png`, `signature-food-mobile.png`
- `menu-intro-desktop.png`, `menu-desktop.png`
- `reservation-desktop.png`, `reservation-mobile.png`
- `qa-story-desktop.png`, `qa-chef-desktop.png`, `qa-gallery-desktop.png`, `qa-contact-desktop.png`

All six local WebP assets have explicit dimensions and total approximately 0.98 MB. They were visually inspected before use. A content search found no Lorem Ipsum or TODO text in the app; the only `placeholder` occurrences are input hints.

## Parent portfolio boundary

The two planned changes outside the restaurant folder are exact exclusions in the parent `tsconfig.json` and `eslint.config.mjs`. The parent checks were run. Both still fail in other, untouched sibling concept directories: parent TypeScript reports missing module and type errors in the fashion and architecture projects, while parent ESLint traverses generated output and reports errors in those projects. The restaurant app's checks pass independently, and the parent output does not report restaurant files. These parent failures were not modified as part of EMBER.

## Limits

This is a local concept implementation. It was not deployed, integrated into the live portfolio, connected to a booking service, or tested on a physical device. Browser checks used Google Chrome; automated axe checks and visual review do not replace a full manual screen-reader audit.
