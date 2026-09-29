# Cross-platform icon consistency — 29 September 2026

The UI previously used text glyphs for action icons. In particular, the up-right arrow could be rendered by an iPhone emoji font and appear blue. Every such action glyph in the restaurant application has been replaced with a reusable inline SVG from `components/icons.tsx`. No icon package was added.

| Previous UI symbol | Current SVG use |
|---|---|
| `↗` | 12 up-right arrows across navigation, booking CTAs, gallery tiles, menu previews, footer invitation, and not-found link |
| `←`, `→` | Gallery previous/next and reservation back controls |
| `×` | Gallery close control |
| `✳` | Menu decoration and reservation completion decoration |
| CSS hamburger lines | Menu and close SVG states with the existing accessible button label |
| Browser-owned select arrow | Consistent chevron SVG alongside the native party-size select |

The icon component uses a 24×24 viewBox, `fill="none"`, `stroke="currentColor"`, a 1.6px rounded stroke and a transparent background. SVGs are decorative to assistive technology; icon-only controls retain descriptive `aria-label`s. The party-size control remains a native select. The mobile menu target and gallery navigation targets are at least 44×44 CSS pixels.

Source audit covered application TS/TSX/JS/JSX, HTML, CSS/SCSS, and SVG, including literal characters, numeric entities, JavaScript Unicode escapes, CSS content, and emoji variation selectors. No Unicode UI icons or variation selectors remain. En dashes in hours and date copy, the phone-number `+`, punctuation, and arithmetic operators remain as ordinary text or code.

Quality gates on the production build: ESLint passed, strict TypeScript passed, Next.js build passed, the original site browser suite passed all 13 tests, and the icon browser matrix passed all 50 tests. The matrix visited all seven content routes plus the not-found view at 375, 390, 430, 768, 1024 and 1440 CSS pixels. It checked visible SVG paths, color and transparency, labels, overflow, gallery and booking actions, desktop hover/focus, and reduced motion. Browser profiles were installed Chrome and Edge on Windows, Playwright WebKit with desktop and iPhone 13 profiles, and Chrome with a Pixel 5 profile. The WebKit browser archive was downloaded from Playwright's official CDN and verified against its published MD5 checksum. Emulated profiles do not prove behavior on a physical iPhone, Mac, or Android phone.

Chrome before/after captures are stored in `artifacts/icon-consistency/`. The geometry comparison covers 49 states (eight routes at six widths plus the gallery dialog). It found no unexpected change to measured text, images, sections, CTA dimensions, fonts, color, padding, or borders. The intended differences are the 42→44px touch targets and the select's added right-side space for its chevron. Desktop and iPhone-profile WebKit screenshots were also reviewed; the icons render as monochrome line art without emoji styling. The original gallery baseline screenshot did not finish loading its image, so it is not used as image-position proof; its dialog-button geometry was compared.

Run `npm run build`, then `npm run test:icons` to repeat the browser matrix. Run `npm run test:browser` for the existing site suite. `node tests/capture-icon-regression.mjs after` repeats the baseline geometry comparison without overwriting its original state.
