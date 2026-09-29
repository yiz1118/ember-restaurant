# EMBER — Premium Live-Fire Restaurant Website

**Project Type:** Concept Project  
**Industry:** Hospitality / Restaurants / Food & Beverage  
**Status:** Portfolio concept; no real client, restaurant, or live reservation service

## Business Goal

Demonstrate how a premium restaurant website can express a distinct brand, make its food and atmosphere memorable, answer practical visit questions, and bring guests toward a table reservation. In this concept, “Book a Table” is the primary action.

## Target Audience

People considering a special dinner, couples planning an evening out, small groups, and food-curious visitors who want to understand the cuisine and setting before choosing a table. A secondary audience is prospective freelance clients in restaurants, cafés, hotels and other hospitality businesses evaluating design and development capability.

## Design Direction

EMBER is an original fictional contemporary European live-fire restaurant imagined in Singapore. The visual approach is warm, cinematic and editorial: large Cormorant Garamond headlines, precise Manrope details, generous cream space, charcoal interludes, tobacco accents, and original AI-generated food and room imagery. It avoids stock restaurant-template grids and decorative black-and-gold styling.

## UX Decisions

- Lead with atmosphere, then move from brand story to dishes, the dining room, menu, chef, reservation and visit details.
- Repeat the primary booking action at moments of high intent; provide a fixed mobile action outside the reservation page.
- Let guests browse all menu categories through accessible anchors. Use concise descriptions, SGD prices and written dietary labels.
- Put date, time and party size before personal details, then offer a review. Validate in place and preserve answers when moving backward.
- State that availability and confirmation are demonstrative. The flow sends and stores nothing.
- Make the gallery filterable with keyboard-accessible, focus-managed image viewing.
- Use an explicitly illustrative location diagram rather than suggesting a real address.

## Pages

Home, Menu, Our Story, The Chef, Gallery, Reservation, and Visit/Contact. Every page has a distinct narrative role and route metadata.

## Key Features

An editorial homepage; 25-item sample menu across five categories; original brand and chef storytelling; six original generated images; filterable gallery and lightbox; three-step reservation demonstration with Singapore-time date rules; sample hours and concept location; mobile navigation and booking action; concept-branded social preview; and clear concept disclosures.

## Responsive Strategy

Layouts were designed and browser-checked at 375, 390, 430, 768, 1024 and 1440 pixels. Desktop uses asymmetric spreads. Mobile reorders content into readable sequences, adjusts image crops and type scales, and keeps touch actions usable. Reduced-motion preferences remove nonessential transition timing.

## Technology

Next.js 16 App Router, React 19, strict TypeScript, Tailwind CSS 4, locally served fonts, Next Image, Playwright and axe-core. The application is standalone with its own npm lockfile, build and test scripts.

## Interesting Design Decisions

The hero uses a real visual anchor—the hearth—as both a brand symbol and a readable backdrop for the main promise. Menu rows stay open and editorial instead of becoming cards. Food photography shifts from a larger mushroom composition to smaller sea and seasonal moments. The final booking invitation returns to a dark, quieter atmosphere after the detailed page sections.

## Interesting Technical Decisions

Restaurant facts, menu items, image dimensions and service rules are typed local data. The reservation flow is entirely client-side and makes no booking request. Date bounds and arrival choices are computed against the Asia/Singapore time zone instead of the viewer’s local clock. Local WebP assets and local fonts avoid third-party image and font requests. The site sets `noindex` until a real publication decision is made.

## What This Project Demonstrates

Brand concept development, art direction, responsive frontend craft, practical restaurant information architecture, accessible interaction design, realistic form behavior, and systematic production and browser verification. It does **not** represent a real client, revenue result, conversion rate, reservation volume, testimonial, or restaurant service.
