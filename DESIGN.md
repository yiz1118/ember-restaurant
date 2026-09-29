# EMBER design direction

## Brand

EMBER is an original fictional Singapore live-fire restaurant concept. Its line is “Seasonal ingredients. Open fire. Unhurried evenings.” The story centers on a gathering place where produce, seafood and carefully chosen cuts receive patient attention over flame. Chef Mara Tan is a fictional character created for this project. The sample menu, prices, hours and setting are illustrative.

## Visual language

- **Editorial character:** Full-bleed atmospheric imagery alternates with spacious cream sections. The homepage uses an asymmetric food layout and a deliberate shift from the dark hearth to the light menu pages.
- **Color:** Cream `#F2EDE4` and paper `#F7F3EB` carry reading sections; charcoal `#25231F` anchors major invitations; olive `#444A39` and tobacco `#79533D` give restrained warmth. Supporting text colors were tuned against their actual backgrounds for contrast.
- **Type:** Cormorant Garamond gives headlines and dish names a literary, expressive voice. Manrope keeps navigation, ingredients and booking fields direct and readable. Both fonts are served from the local app package.
- **Layout:** Large type, hairline separators, limited boxes, and varied image ratios create a hospitality magazine rhythm. Most content aligns to a 1400-pixel wide grid with generous fluid side margins.
- **Photography:** Original AI-generated scenes were directed toward a consistent palette of plaster, walnut, linen, olive and firelight. The hero leaves dark space for readable text; dish images favor natural texture and handmade tableware.
- **Motion:** Image scale and control transitions stay subtle. The site honors `prefers-reduced-motion`; information is readable without animation or JavaScript.

## Experience decisions

The homepage establishes atmosphere before details, then progressively introduces food, room, chef, reservation and visit information. Book a Table appears in the header, hero, dedicated invitations and a mobile bottom action. Menu categories use native anchor navigation so all dishes remain findable without hidden tab states. Dietary information is written as text instead of icon-only shorthand.

The three-step reservation demonstration separates table and guest decisions, keeps previous answers when moving back, and presents a review before confirmation. Available times are clearly sample times. A completed flow says that no table has been booked. The visit page avoids an invented physical address; its diagram is explicitly illustrative.

## Responsive intent

Desktop has broad editorial grids, layered photography and side notes. Tablet reduces column count and navigation becomes a menu. Mobile changes the signature dish composition to full-width sequences, enlarges touch targets, keeps the booking action in reach, and lets menu category links scroll horizontally. Breakpoints are guided by content at 1100, 850, 700 and 460 pixels rather than device labels.
