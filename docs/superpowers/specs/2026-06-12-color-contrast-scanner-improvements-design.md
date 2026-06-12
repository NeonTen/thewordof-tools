# Color Contrast Scanner Improvements Design Specification

This specification documents the changes required to address false-positives (such as "Perfect Accessibility Contrast!") in the Color Contrast Scanner tool when scanning websites that use CSS Custom Properties (variables) or Tailwind CSS classes (such as `crayonbytes.com`).

## Goal Description
Enhance the accuracy of the color contrast scanning API (`/api/tools/scan-contrast`) by implementing a lightweight CSS variable resolver and a built-in Tailwind CSS color parser. This allows the scanner to correctly determine element foreground and background colors instead of falling back to default white/slate-900 values.

## Proposed Changes

### 1. API Route Improvements
#### [MODIFY] [route.ts](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/app/api/tools/scan-contrast/route.ts)
*   **Tailwind Color Palette Mapping**: Add a static Tailwind CSS color palette dictionary supporting standard colors (`slate`, `gray`, `zinc`, `neutral`, `stone`, `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose`) with shades `50`–`950` plus `white`, `black`, and `transparent`.
*   **Tailwind Utility Parser**: Add `resolveTailwindColor(className: string): string | null` which checks if a class matches Tailwind background (`bg-`) or text (`text-`) color utility conventions.
*   **CSS Variable Extraction**: Extract custom property declarations (e.g., `--variable-name: value`) from style blocks during parsing and store them in a `variablesMap`.
*   **Recursive Variable Resolution**: Update color string parsers to recursively resolve `var(--variable-name)` references from the `variablesMap` up to a maximum recursion depth of 5.
*   **Element Resolution Priority**: Check inline styles, then Tailwind classes, then CSS selector rules. Resolve any variables encountered during these checks.

## Verification Plan

### Manual Verification
1.  Verify the scanner correctly identifies failures in the pricing section of `https://www.crayonbytes.com/`.
2.  Specifically check that Tailwind bg/text classes (e.g., `bg-slate-300`, `text-white` on slate backgrounds) and CSS variables like `--wp--preset--color--primary` are resolved to their correct colors.
