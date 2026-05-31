# Pricing Table and Comparison Fixes Design Spec

Correct the pricing card details and home page comparison table to accurately reflect differences in QR analytics, deduplicate redundant rows in the Business plan pricing card, and add the SVG compressor's React/Vue/Svelte export feature.

## Proposed Changes

### [`src/components/pricing/pricing-cards.tsx`](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/pricing/pricing-cards.tsx)

- Update feature checklists for Free, Pro, and Business plans.
- Pro: Clarify QR analytics are basic (timeline, device, browser).
- Business: Explicitly list geographic (country/city) scan tracking.
- Business: Remove duplicates already covered by "Everything in Pro" (`Bulk ZIP downloads`, `Unlimited invoices + branding`, `Cloud progress & history tracking`).
- Pro/Free: Add React/Vue/Svelte SVG Component exports.

### [`src/app/page.tsx`](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/app/page.tsx)

- Update the feature comparison table.
- Split "Dynamic QR Codes" into two rows: one for QR code generation/validity limits, and another for QR Analytics levels (Basic vs Advanced Geo).
- Add a new row for SVG framework component exports.

## Verification Plan

### Automated
- Run `npm run qa` / `npm run build` to make sure all types, routes, and styles compile without issue.
