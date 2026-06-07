# Design Document: Category Restructuring & Layout Polish

This document defines the structural changes, route redirects, design changes, and CSS alignments to reorganize tools under category subdirectories and clean up layout elements.

## Proposed Changes

### 1. Folder Relocations inside `src/app/tools/`
We will move all tool route folders to mirror their category layouts:
- `/tools/image-converter` → `/tools/image-code/image-converter`
- `/tools/svg-compressor` → `/tools/image-code/svg-compressor`
- `/tools/qr-code` → `/tools/image-code/qr-code`
- `/tools/code-minifier` → `/tools/image-code/code-minifier`
- `/tools/text-diff` → `/tools/image-code/text-diff`
- `/tools/invoice-generator` → `/tools/finance-dev/invoice-generator`
- `/tools/report` → `/tools/finance-dev/report`
- `/tools/schema-generator` → `/tools/technical-seo/schema-generator`
- `/tools/robots-generator` → `/tools/technical-seo/robots-generator`
- `/tools/sitemap-validator` → `/tools/technical-seo/sitemap-validator`
- `/tools/llms-txt` → `/tools/technical-seo/llms-txt`
- `/tools/product-description` → `/tools/ai-tools/product-description`
- `/tools/caption-generator` → `/tools/ai-tools/caption-generator`
- `/tools/prompt-generator` → `/tools/ai-tools/prompt-generator`
- `/tools/cv-builder` → `/tools/ai-tools/cv-builder`
- `/tools/seo-generator` → `/tools/ai-tools/seo-generator`
- `/tools/color-contrast` → `/tools/design/color-contrast`
- `/tools/color-palette` → `/tools/design/color-palette`
- `/tools/gradient-generator` → `/tools/design/gradient-generator`
- `/tools/gradient-palette` → `/tools/design/gradient-palette`
- `/tools/gst-calculator` → `/tools/calculators/gst-calculator`
- `/tools/word-counter` → `/tools/calculators/word-counter`
- `/tools/color-converter` → `/tools/calculators/color-converter`

### 2. next.config.js Redirects
Configure 301 Permanent Redirects for all moved paths to preserve current search index backlinks and bookmarks.

### 3. Reusable ToolHeader Component
Create a reusable header component displaying category breadcrumbs and a back button:
`src/components/tools/tool-header.tsx`

### 4. Layout & Styling Alignment
- **Sidebar (ToolsNav)**:
  - Sub-links font-size increased from `text-xs` (12px) to `text-sm` (14px).
  - Category header size increased to `text-xs` (12px) for improved contrast.
- **Sticky Header**:
  - Wrap header component inside `sticky top-0 z-50` block in tools layout.
  - Set aside top alignment to `top-16` (64px) and height to `h-[calc(100vh-4rem)]` to prevent white background gaps.
- **Color Contrast Checker**:
  - Restructure bottom info grid layout to use full-width blocks.
