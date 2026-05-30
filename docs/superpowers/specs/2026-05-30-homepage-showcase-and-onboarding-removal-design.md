# Design Document: Homepage Showcase & Onboarding Removal

## Goal Description
Rework the home page showcase section to highlight our most powerful tools (Dynamic QR codes, AI CV builder, Invoice generator, Caption/SEO generators, Image/SVG optimization, and Developer toolkit) with premium bulleted details and direct links. Also, completely remove the "1-on-1 Onboarding" rows and elements from the pricing lists and tables.

## Proposed Changes

### Pricing Card Component
* `src/components/pricing/pricing-cards.tsx`: Remove "1-on-1 Onboarding" from features lists.

### Pricing Page
* `src/app/pricing/page.tsx`: Remove "1-on-1 Onboarding" from comparison table.

### Homepage
* `src/app/page.tsx`:
  - Rework the tools preview section with premium spotlight cards (including bullets, direct links, and Dynamic QR code focus).
  - Remove "1-on-1 Onboarding" from home page comparison table.
  - Update home page comparison table rows to match new AI credit pool quotas.

## Verification Plan
* Validate build with `npm run build` and `npx tsc --noEmit`.
