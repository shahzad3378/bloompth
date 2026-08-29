---
version: alpha
name: "BloomPath UAE"
description: "A confident UAE e-commerce sourcing and fulfillment brand built around operational clarity."
colors:
  forest: "#073E2A"
  forest-deep: "#052C20"
  leaf: "#39B54A"
  mint: "#DDF5E7"
  sand: "#F5F1E8"
  gold: "#D7A62D"
  ink: "#10231B"
  muted: "#617169"
  line: "#DDE5E0"
  white: "#FFFFFF"
typography:
  display:
    fontFamily: "Arial, Helvetica, sans-serif"
    lineHeight: "1.02"
  body:
    fontFamily: "Arial, Helvetica, sans-serif"
    lineHeight: "1.65"
  utility:
    fontFamily: "Arial Narrow, Arial, Helvetica, sans-serif"
    lineHeight: "1.2"
rounded:
  DEFAULT: "0.875rem"
  sm: "0.625rem"
  md: "0.875rem"
  lg: "1.25rem"
  xl: "1.75rem"
  pill: "999px"
spacing:
  section-gap: "6rem"
  page-gutter: "1.25rem"
  page-max: "80rem"
components:
  button: {}
  card: {}
  header: {}
  status-rail: {}
  article: {}
---

# BloomPath UAE Design System

## Overview

### Creative North Star

The public website should feel like a well-run UAE fulfillment control desk: calm, precise and visibly active. It combines the dependable material language of warehouse labels and dispatch boards with a warm, founder-friendly tone.

### Product context and register

- **Audience and primary job:** UAE-based Amazon, Noon, Shopify, TikTok Shop, Facebook and Instagram sellers evaluating product sourcing, wholesale supply, dropshipping and local fulfillment support.
- **Target market:** UAE first. GCC references are removed from primary conversion copy until the UAE offer is complete.
- **Locale and language policy:** English-first public site with plain business language. Arabic can be introduced as a separate reviewed phase.
- **Usage scene:** Mobile-first discovery from ads, WhatsApp and social media, with desktop research before contacting the team.
- **Register:** Brand-led marketing website with a practical product catalogue and seller/admin applications.
- **Memorable signature:** A compact order-status rail showing the movement from order confirmation to UAE delivery and COD collection.
- **Restraint:** Product cards, blog reading and contact actions remain conventional and highly legible.
- **Anti-references:** Generic green SaaS gradients, fake live metrics, luxury-gold decoration, crowded marketplace clones and unverified operational promises.
- **Token ownership/runtime mapping:** Tailwind v4 tokens and CSS custom properties in `app/globals.css` are the runtime source. This file mirrors approved values; shared public components consume semantic variables and utility aliases.

## Colors

Forest is the primary brand/action color. Leaf green is reserved for progress, availability and compact emphasis. Sand is the warm UAE-facing editorial surface; it must not make the interface feel vintage. Gold is a sparing market accent for UAE labels, never a substitute for semantic warning. Ink, muted and line create the information hierarchy. Focus uses leaf with a white offset.

## Typography

Display typography uses a tight, heavy Arial stack for direct commercial headlines. Body copy uses the same dependable stack at comfortable line height. Utility labels use a narrower stack, uppercase only for short operational metadata. Paragraph measure stays between 55 and 72 characters where possible.

## Layout

The site uses a 1280px maximum canvas and asymmetric editorial grids. Homepage sections use 72–104px vertical rhythm on desktop and 56–72px on mobile. Cards align to content rather than fixed decorative heights. Sticky navigation must not obscure keyboard focus or anchor targets.

## Elevation & Depth

Hierarchy comes first from tonal surfaces, borders and inset operational panels. Shadows are soft and low-contrast. Strong shadows are reserved for the hero control board, mobile navigation and primary conversion panels.

## Shapes

Controls use 10–14px radii; large content panels use 20–28px. Pills are reserved for statuses, small trust labels and compact metadata. Decorative circles are not a default card device.

## Components

### Foundational visual states

Interactive elements have visible hover, pressed and focus-visible states. Disabled states remove pointer affordance. Reduced-motion users receive no translated or pulsing animations. Scrollbars remain visible and inherit the global forest/sand theme.

### Buttons and actions

Primary actions use forest or leaf on dark surfaces. Secondary actions use a visible border and quiet surface. WhatsApp is a labelled action, not an icon-only shortcut. Buttons preserve dimensions across states.

### Navigation and data display

The public header keeps five or fewer primary navigation decisions visible. The mobile menu uses a full-height owned panel with Escape and close controls. Status rails use real sequence numbering because order fulfillment is sequential.

### Forms and overlays

Public forms retain explicit labels, owned validation and `noValidate`. Overlays never use browser dialogs. Mobile navigation restores document scrolling after close.

### Iconography

Lucide is the canonical icon family, using 1.8–2.2px strokes. Icons support labels; they do not replace unfamiliar action copy.

### Motion

Motion communicates order progress and hover intent. Durations stay between 160–320ms with smooth ease-out. Ambient hero movement is subtle and removed under `prefers-reduced-motion`.

### Content and data visualization

Voice is specific, operational and honest. Avoid unsupported counts, delivery guarantees, ROAS claims or pricing. Use “request rate card” and “confirm availability” until terms are configured.

## Do's and Don'ts

- **Do:** Show the exact UAE seller workflow and what BloomPath handles.
- **Do:** Pair every strong claim with a clear next action or qualification.
- **Don't:** Copy MyZambeel layouts, wording, plans or operational claims.
- **Don't:** use gradients, floating orbs and identical icon cards as the primary identity.
