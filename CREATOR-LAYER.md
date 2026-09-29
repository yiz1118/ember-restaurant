# EMBER creator and freelance contact layer

The footer introduces Alson Chua as the designer and developer of this independent concept project. Its restrained two-column desktop layout, serif invitation, warm charcoal background, hairline rules, and underlined links follow EMBER's editorial hospitality language. Mobile stacks the credit and invitation. The restaurant navigation, fictional content, booking demonstration, and existing page styles remain intact.

## Creator configuration

`config/creator.ts` is the single source for the creator's name, professional title, email, location, availability, social links, WhatsApp number, and future portfolio URL. The same source supplies the creator credit and metadata. Contextual contact messages use `site.name` from `data/site.ts`, so the current project name is EMBER.

The portfolio is deliberately unconfigured:

```ts
portfolioUrl: null,
```

When the main portfolio is live, replace `null` with its actual URL, for example:

```ts
portfolioUrl: "https://your-actual-portfolio-domain.com",
```

The View Portfolio link then appears automatically beside the freelance invitation. There is no placeholder or inactive link in the public UI. Rebuild and restart a production preview after editing configuration; the development server updates normally. A rendering test checks both the absent and configured states without changing the real configuration.

## Contact behavior

Start a Project is a native HTML disclosure that expands two choices: WhatsApp and email. It works with JavaScript disabled and can be toggled by keyboard. Both methods remain visible as direct links in the creator credit, alongside LinkedIn and GitHub.

WhatsApp opens the configured `wa.me` URL with this URL-encoded message:

> Hi Alson, I came across your EMBER concept project and I'm interested in discussing a website/app project with you.

Email opens the visitor's email application using `mailto:`, the subject `Project Inquiry — EMBER`, and a short project inquiry body. No on-site form collects or sends contact information. WhatsApp, LinkedIn, GitHub, and a configured portfolio open in a new tab with `noopener noreferrer`.

The creator inquiry is presented separately from the fictional Book a Table flow. The label Independent Concept Project identifies the work accurately. Metadata adds the creator's name and independent concept description while retaining the EMBER title and existing noindex setting.

## Tracking preparation

Controls carry `data-creator-action` values: `start-project`, `email`, `whatsapp`, `linkedin`, `github`, and `portfolio`. The section has `data-creator-project="EMBER"`. Contact links also indicate `data-creator-placement="credit"` or `"project-options"`. These are selectors for a future analytics integration; no analytics package, network tracking, or event collection was added.

## Files

| File | Purpose |
|---|---|
| `config/creator.ts` | Central profile and encoded contact-message URLs |
| `components/creator-credit.tsx` | EMBER creator credit, contact chooser, social links and conditional portfolio CTA |
| `components/shared.tsx` | Places the section in the site-wide footer |
| `app/globals.css` | Scoped creator styles, responsive layout, focus states and tap targets |
| `app/layout.tsx` | Concept description and creator/author metadata |
| `package.json` | Adds the creator test command |
| `playwright.config.ts` | Includes creator checks in the normal browser suite |
| `playwright.creator.config.ts` | Runs creator checks across the existing five browser profiles |
| `tests/creator.spec.ts` | Responsive layout, preserved original geometry, messages, links, keyboard, portfolio states and axe checks |
| `tests/render-creator.mjs` | Renders the real component in Node for the configured portfolio test |
| `tests/icons.spec.ts` | Extends the source-icon audit to config and synchronizes booking checks with step focus |
| `README.md`, `VERIFICATION.md`, `CREATOR-LAYER.md` | Usage and verification documentation |

Before/after footer screenshots and original layout measurements are saved in `artifacts/creator/`. Browser test screenshots are also retained in each run's results directory. To repeat checks, build the application and run `npm run test:browser`, `npm run test:creator`, and `npm run test:icons` sequentially; each suite uses production port 3201.

## Verified result

ESLint, strict TypeScript and the production build passed. The complete site suite passed 23 tests; the creator and icon matrices each passed 50 tests. The five profiles are Windows Chrome, Windows Edge, desktop Playwright WebKit, iPhone-profile WebKit, and Android-profile Chrome. All requested widths were checked. The layout report in `artifacts/creator/layout-comparison.json` records 42 states and no unexpected change to the existing design. A source rescan found no Unicode UI icons or variation selectors. Automated accessibility and browser profiles do not replace physical-device or manual screen-reader testing, and contact message delivery was not attempted.
