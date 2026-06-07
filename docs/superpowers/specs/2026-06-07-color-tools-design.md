# Phase 1: Color Tools Design Specification

This specification covers the design and layout of the new Color Tools suite to be added to the utilities platform. The suite consists of three tools to help developers and designers check text accessibility, generate mathematical color harmonies, and preview/customize modern gradients.

## Proposed Changes

We will create the following files to implement Phase 1:

### 1. Color Contrast Checker
*   **Route:** `/tools/color-contrast`
*   **Files:**
    *   [NEW] `src/app/tools/color-contrast/page.tsx`: Route entry point.
    *   [NEW] `src/components/tools/color-contrast.tsx`: Interactive checker component.
*   **Features:**
    *   Dynamic relative luminance and contrast ratio computation.
    *   WCAG 2.1 AA/AAA compliance badges for Normal text, Large text, and Graphical elements.
    *   Interactive preview block with live text editing, font-size slider (12px to 64px), and font-weight toggles (Regular, Medium, Bold).
    *   Quick color-swap and visual color pickers.

### 2. Color Palette Generator
*   **Route:** `/tools/color-palette`
*   **Files:**
    *   [NEW] `src/app/tools/color-palette/page.tsx`: Route entry point.
    *   [NEW] `src/components/tools/color-palette.tsx`: Rule-based color generator.
*   **Features:**
    *   Harmony rules picker: Monochromatic, Analogous, Complementary, Triadic, Split-Complementary, and Random.
    *   5-color palette canvas with Lock/Unlock, manual HEX inputs, and visual color pickers on each card.
    *   Keyboard shortcut (Spacebar) to randomize unlocked colors.
    *   Exporting options (HEX CSV, CSS Custom Properties, Tailwind configs, JSON, and Canvas-based PNG download).

### 3. Gradient Explorer
*   **Route:** `/tools/gradient-generator`
*   **Files:**
    *   [NEW] `src/app/tools/gradient-generator/page.tsx`: Route entry point.
    *   [NEW] `src/components/tools/gradient-generator.tsx`: Curated gradient browser.
*   **Features:**
    *   Grid of 12–18 handcrafted presets with custom names.
    *   Responsive preview area with live overlay mockups (buttons, text, cards).
    *   Tuning adjustments: Linear vs Radial, angle selector dial (0° to 360°), and individual color stop customization.
    *   Export formats: Standard CSS background property and Tailwind utility classes.

### 4. Tools Page Enhancements
*   **Files:**
    *   [MODIFY] `src/app/tools/page.tsx`
*   **Features:**
    *   Add a search bar at the top to filter tools dynamically.
    *   Add category filter tabs/chips (All, Design, AI, Finance, Calculators).
    *   List the three new color tools under the "Design" category.

## Verification Plan

### Manual Verification
1.  **Color Contrast Checker:**
    *   Verify contrast calculations match standard WCAG contrast ratios (e.g. #FFFFFF on #000000 is 21:1, #7F7F7F on #FFFFFF is ~4.0:1).
    *   Ensure compliance badges correctly toggle between Pass/Fail state changes.
    *   Verify the text size slider successfully updates font-size in the preview panel.
2.  **Color Palette Generator:**
    *   Verify harmony generation algorithms produce mathematically accurate palettes.
    *   Ensure locked colors are preserved on new generations.
    *   Confirm copy-to-clipboard functionality and verify PNG download is generated with correct colors.
3.  **Gradient Explorer:**
    *   Verify that clicking a preset updates the preview instantly.
    *   Verify angle dial rotates gradient direction correctly.
    *   Verify CSS code output copy matches the rendered gradient.
4.  **Search & Filters:**
    *   Verify typing in the search bar filters cards dynamically.
    *   Verify clicking category filters shows only matching items.
