# Design Document: AI Tools Login Overlay Flex Fix

## Goal Description
Fix the CSS flexbox bug where the "Sign Up" button gets cut off/overflows inside the "AI Tool Requires Account" overlay when the card container is narrow.

## Proposed Changes

### Client Components
Replace the button row in the login overlay of all 5 AI components to use `flex-1` instead of `w-full`, and constrain the container's max width to `max-w-[280px]` so they share space 50/50 without overflowing.

* `src/components/tools/caption-generator.tsx`
* `src/components/tools/seo-generator.tsx`
* `src/components/tools/prompt-generator.tsx`
* `src/components/tools/product-description.tsx`
* `src/components/tools/llms-txt-generator.tsx`

## Verification Plan
* Validate build with `npm run build` and `npx tsc --noEmit`.
