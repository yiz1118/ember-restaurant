# EMBER motion polish

30 September 2026. Scope: the standalone EMBER restaurant concept.

## Audit and decisions

| Surface | Existing behavior | Implemented polish |
|---|---|---|
| Home hero | Static first impression | Brief coordinated text entrance and a single slow photograph scale. The booking link is usable throughout. |
| Inner-page introductions | Heading and supporting copy arrive together | Heading leads; supporting copy follows by 140ms at full opacity. Typography and line breaks remain intact. |
| Signature dishes, story, chef and visit photographs | Most images appear immediately; only three homepage cards had a generic upward translation | Photographs settle from 1.04 to their original crop over 900ms. Frames and captions retain their positions. |
| Editorial headings and reservation invitations | Abrupt section introductions | Selected headings fade and rise by 18px as they approach the viewport. Paragraphs and booking fields stay immediately readable. |
| Menu preview and menu categories | Static lists | Short stagger within each group. Delay is capped at 180ms so long categories remain quick to read. |
| Mobile navigation | `display:none` switches instantly to the open menu | 200ms opacity/8px movement and an SVG menu/close crossfade. Closed navigation is inert; Escape returns focus to the toggle. |
| Links and booking controls | Animated gap/padding pushes the layout; the whole booking button moves on hover | Existing colors plus a small SVG arrow movement; preview titles move 4px without changing the grid. Booking targets stay fixed while pressed so pointer clicks remain reliable. |
| Gallery filtering and lightbox | Results and dialog images change abruptly | New result groups enter in 320ms; replacement photographs use short dissolves while captions retain full contrast. Keyboard handling and focus restoration remain immediate. |
| Creator contact chooser | Native details expansion | Brief 8px entrance of the revealed choices at full opacity, retaining native keyboard and JavaScript-free behavior. |

The room photograph remains still behind its text overlay. Native scrolling and the site's editorial rhythm provide sufficient movement without a continuous scroll effect. The footer credit, paragraphs, form fields and decorative diagram do not receive scroll entrances.

## Reusable primitives

`components/reveal-observer.tsx` provides one shared observer. Server-rendered markup opts into one of three CSS primitives in `app/motion.css`:

```tsx
<h2 data-reveal="text">Selected editorial heading</h2>
<div className="image-frame" data-reveal="image">...</div>
<div className="menu-items" data-reveal="stagger">...</div>
```

`FeatureImage` enables photograph reveals by default. Pass `reveal={false}` for static atmospheric backgrounds. The observer reveals each target once, starts 64px before the viewport, handles streamed route content and filtered gallery results, and releases removed nodes. Content already in the initial viewport is never hidden during hydration. Focusing a link in a pending group immediately shows that group.

No animation library or dependency was added. Entrances animate opacity and transforms; interaction color changes stay short. There are no continuous animation loops, artificial loading screens or delayed route navigation. Observer subscriptions are cleaned up on route changes and unmount.

## Timing and accessibility

- Hero: photograph finishes in 1000ms; text and CTA finish within 760ms.
- Text reveal: 620ms, 18px movement. Mobile: 480ms, 12px.
- Large headings fade from 0.65 to full opacity. Small labels, paragraphs, menu ingredients, prices and contact options retain full opacity throughout; menu staggering uses movement instead of fading text.
- Photograph reveal: 900ms, scale 1.04 to 1. Mobile: 700ms, scale 1.025 to 1.
- List stagger: 550ms plus at most 180ms delay. Mobile delay is capped at 100ms.
- Controls: 180ms; mobile menu: 200ms; lightbox: 180–260ms.
- `prefers-reduced-motion: reduce` removes animations and transitions, restores visible content, and uses native immediate scrolling. The observer also reacts to preference changes while the page is open.
- Touch feedback does not depend on hover. Hover-specific movement is limited to fine pointers.
- Existing SVG icons, focus outlines, contact targets and accessible labels are retained.

## Verification

The before/after comparison in `artifacts/motion/layout-comparison.json` covers seven routes at 375, 390, 430, 768, 1024 and 1440 CSS pixels. All 42 states match: positions, dimensions, fonts, sizes, colors and backgrounds. Settled desktop/mobile captures are in `artifacts/motion/`.

The dedicated `npm run test:motion` suite checks all six widths and seven routes in Chrome, Edge, desktop WebKit, iPhone-profile WebKit and Android-profile Chrome. It also checks animation-induced layout stability, overflow, console/page errors, reveal completion, focused links, reduced-motion changes, JavaScript-free content, mobile navigation, gallery replacement and hover dimensions. WebKit stability is checked through element dimensions; the Layout Shift API is also checked where supported.

Results: the motion matrix passed 55 tests; its interaction recheck after refinements passed 25 tests. The existing site/creator suite passed 23 tests, and the SVG matrix passed 50. Full-page axe audits run with normal motion enabled. Lint, strict TypeScript and the production build passed.

These are local production-browser and device-emulation checks. Physical iPhone/Android devices and native macOS Safari were not used. Lighthouse scores were not measured.
