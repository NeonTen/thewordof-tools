# Design Specification: Spacing Standardization and Navigation Fixes

## Overview
This document specifies the updates required to achieve consistent visual spacing across all utility tools and resolve duplicate related tool lists on category pages.

## Proposed Changes

### 1. Navigation & Routing Fix in `RelatedTools`
* **File**: [related-tools.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/tools/related-tools.tsx)
* **Action**: Update the URL path segments check.
* **Logic**: If the URL path is `/tools` or `/tools/[category]`, do not render the `RelatedTools` component.
  ```typescript
  const segments = pathname.split("/").filter(Boolean)
  if (segments.length <= 2) return null
  const categoryKey = segments[1]
  ```

### 2. Spacing Class Cleanup in Tools
* **Goal**: Standardize the top margin, bottom padding, and layout structure of the bottom SEO/info grids in all components.
* **Standard Classes**:
  * Bottom SEO/info grid container: `className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12 pb-0"` (or omit `pb-20` entirely).
  * Main tool dashboard grid: Remove any trailing `pb-20` or `pb-8 md:pb-20` so that spacing to the SEO section is governed solely by `mt-16`.

* **Files to Modify**:
  1. [line-height-calculator.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/tools/line-height-calculator.tsx)
  2. [sip-calculator.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/tools/sip-calculator.tsx)
  3. [gradient-generator.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/tools/gradient-generator.tsx)
  4. [gradient-palette.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/tools/gradient-palette.tsx)
  5. [color-converter.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/tools/color-converter.tsx)
  6. [seo-generator.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/tools/seo-generator.tsx)
  7. [gst-calculator.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/tools/gst-calculator.tsx)
  8. [word-counter.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/tools/word-counter.tsx)
  9. [image-converter.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/tools/image-converter.tsx)
  10. [aspect-ratio-calculator.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/tools/aspect-ratio-calculator.tsx)
  11. [bmi-calculator.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/tools/bmi-calculator.tsx)
  12. [salary-hourly-calculator.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/tools/salary-hourly-calculator.tsx)
  13. [color-palette.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/tools/color-palette.tsx)
  14. [svg-compressor.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/tools/svg-compressor.tsx)
  15. [emi-calculator.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/tools/emi-calculator.tsx)
  16. [prompt-generator.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/tools/prompt-generator.tsx)
  17. [px-to-rem-calculator.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/tools/px-to-rem-calculator.tsx)
  18. [caption-generator.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/tools/caption-generator.tsx)
  19. [invoice-generator.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/tools/invoice-generator.tsx)
  20. [code-minifier.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/tools/code-minifier.tsx)
  21. [color-contrast.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/tools/color-contrast.tsx)
  22. [compound-interest-calculator.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/tools/compound-interest-calculator.tsx)
  23. [qr-code.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/tools/qr-code.tsx)

## Verification Plan
* Run production build: `npm run build`.
* Verify that category pages (e.g., `/tools/calculators`) no longer display duplicate related tools.
* Verify spacing consistency on individual tools (e.g., `/tools/image-code/image-converter`).
