# Design Specification: Preview and Header Layout Fixes

## Goal
Fix visual cutoff on desktop and layout alignment issues in the AI CV Builder and Invoice Generator.

## Proposed Changes

### AI CV Builder
- Modify the preview section header wrapping element in `src/components/tools/cv-builder.tsx` to use `flex-wrap` and adjust column spacing.
- Add `shrink-0` to the free exports limit badge.
- Remove `min-w-[768px]` and `scrollbar-none` from the preview container to let it scale naturally to fit the desktop columns without clipping.

### Invoice Generator
- Modify the preview section header wrapping element in `src/components/tools/invoice-generator.tsx` to use `flex-wrap`.
- Add `shrink-0` to the free invoices limit badge.
- Remove `min-w-[768px]` and `scrollbar-none` from the preview container wrapper.

---

## Verification Plan

### Automated Tests
- Run `npx tsc --noEmit` to verify type compilation.
- Run `npm run build` to verify the build output.

### Manual Verification
- Verify on MacBook Pro desktop screens that the invoice and CV previews fit within their columns without being cut off or showing unnecessary horizontal scrollbars.
- Verify that limit badges and load/save/export buttons wrap cleanly when the viewport is resized.
