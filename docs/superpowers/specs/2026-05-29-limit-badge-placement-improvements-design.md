# Design Specification: Limit Badge Placement Improvements

## Goal
Improve the visual placement of the free usage limit badges in the AI CV Builder and Invoice Generator.

## Proposed Changes

### AI CV Builder
- In `src/app/tools/cv-builder/page.tsx`, remove the hardcoded page header (title and description).
- In `src/components/tools/cv-builder.tsx`:
  - Render the page header (title and description) at the top of the component wrapper.
  - Wrap the header in a flex container that aligns the limit badge on the right side of the screen (hidden during print).
  - Remove the limit badge from the sticky editor header container.

### Invoice Generator
- In `src/app/tools/invoice-generator/page.tsx`, remove the hardcoded page header.
- In `src/components/tools/invoice-generator.tsx`:
  - Render the page header at the top of the component wrapper.
  - Wrap the header in a flex container that aligns the limit badge on the right side.
  - Remove the limit badge from the preview header layout.

---

## Verification Plan

### Automated Tests
- Run `npx tsc --noEmit` to verify TypeScript compile checks.
- Run `npm run build` to verify the build output.

### Manual Verification
- Verify the header and description display correctly at the top of the CV Builder and Invoice Generator pages.
- Verify the usage limit badge is placed on the right side of the header.
- Verify the badge is hidden when print/PDF is generated.
