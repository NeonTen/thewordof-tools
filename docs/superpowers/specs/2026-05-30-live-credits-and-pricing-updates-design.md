# Design Document: Live Client-Side Credits & Pricing Updates

## Goal Description
Implement immediate, on-the-fly client-side credit deduction updates when a user successfully runs any AI tool (Caption Generator, SEO Generator, Prompt Optimizer, Product Description, llms.txt builder). We also need to update the pricing plan cards and the detailed comparison table to reflect the new shared credit pool system (Free: 20/mo, Pro: 500/mo, Business: 2000/mo) instead of daily/unlimited limits.

## Proposed Changes

### Client Components
Add `useState` and `useEffect` hooks in all 5 client-side AI components to track a local state copy of the remaining credit count. Upon receiving a successful status from the server API, decrement the credit count in the local state copy, which will immediately update the limit controls and deduction labels.

* `src/components/tools/caption-generator.tsx`
* `src/components/tools/seo-generator.tsx`
* `src/components/tools/prompt-generator.tsx`
* `src/components/tools/product-description.tsx`
* `src/components/tools/llms-txt-generator.tsx`

### Pricing Table Pages & Components
* `src/app/pricing/page.tsx`
* `src/components/pricing/pricing-cards.tsx`

Update descriptions and comparison table features to reflect credit pools:
- Free: 20 credits/mo
- Pro: 500 credits/mo
- Business: 2,000 credits/mo
- AI tools cost 1 credit (except CV builder import which is 3).

## Verification Plan
* Validate build with `npm run build` and `npx tsc --noEmit`.
