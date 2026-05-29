# UI and Mobile Layout Improvements Design Spec

## Overview
This specification details a suite of user interface (UI) and mobile layout improvements designed to unify page navigation, fix visual layout squeezes, solve viewport overflows on mobile screens, and align the "All Tools" dashboard categories.

## Scope of Changes

### 1. Back Navigation Links
Add `Back to Calculators` navigation links at the top of pages for:
- GST Calculator (`/tools/gst-calculator`)
- Word / Letter Counter (`/tools/word-counter`)
- HEX / RGB / HSL Converter (`/tools/color-converter`)

### 2. Mobile Menu Drawer
- Introduce a sliding navigation drawer on the header, visible on screens smaller than `md` (`md:hidden`).
- The drawer will display standard page links (*Tools*, *Pricing*, *Dashboard*), auth actions (*Login*, *Get Started*, *Logout*), and dynamically embed the sidebar tools lists (`ToolsNav`) below the links.
- Component to create: `src/components/layout/mobile-nav.tsx`.
- Component to modify: `src/components/layout/header.tsx`.

### 3. Responsive Form Columns and Overflow Previews
- **Invoice Generator (`src/components/tools/invoice-generator.tsx`)**:
  - Update input field layouts from `grid-cols-2` to `grid-cols-1 md:grid-cols-2`.
  - Wrap the A4 invoice preview container in a horizontal scrolling parent with `w-full overflow-x-auto`.
- **AI CV Builder (`src/components/tools/cv-builder.tsx`)**:
  - Convert narrow 2-column input forms into a single responsive column on mobile.
  - Make sure the resume preview container handles screen constraint margins cleanly.

### 4. Spacing Gaps Audit
- Address inconsistent large gaps on mobile devices, specifically adjusting padding/margin parameters (like changing absolute `mb-20` to `mb-6 md:mb-12`).
- Target file: `src/components/tools/image-converter.tsx` (reducing spacing beneath the Pro subscription call-to-action).

### 5. Grouped "All Tools" Dashboard (`src/app/tools/page.tsx`)
- Reorganize the "All Tools" layout to group tools into clear sections matching the sidebar structure:
  - **Image & Code**
  - **Interactive Calculators** (incorporating GST, Word Counter, and Color Converter)
  - **Finance & Developer Utilities**
  - **AI Creative Tools**

---

## Verification Plan

### Automated Checks
- Ensure clean TypeScript compiler output: `npx tsc --noEmit`.
- Ensure clean production builds: `npm run build`.
- Run targeted ESLint checks on modified components.

### Manual Verification
1. Open the website on mobile width, click the hamburger icon, and verify the sliding drawer opens displaying navigation links followed by the tools list.
2. Visit `/tools/gst-calculator`, `/tools/word-counter`, and `/tools/color-converter` and verify the "Back to Calculators" link is visible and functional.
3. Open Invoice Generator and AI CV Builder on mobile width, verify input grids stack to a single column, and document previews do not break the viewport (horizontal scroll works cleanly).
4. Verify the new categorizations on `/tools` look visually balanced and correspond with the sidebar sections.
