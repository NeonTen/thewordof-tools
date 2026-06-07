# Category Restructuring & Layout Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Relocate tool folders under category subdirectories, configure Next.js permanent redirects, create a reusable breadcrumb header component, add breadcrumbs/back buttons to all tools, ensure bottom content exists and is properly styled, and adjust sidebar/sticky header layout sizing.

**Architecture:** We will physically move routes under `/tools/` inside `src/app/tools/` into category folders (e.g. `image-code`, `design`, `calculators`). We will add Next.js redirection rules, build a reusable `ToolHeader` breadcrumb/back-button component, verify all tool pages import and use it, audit bottom text positioning, and update header/sidebar height classes.

**Tech Stack:** Next.js, React, Tailwind CSS, Lucide icons.

---

### Task 1: Reusable ToolHeader Component

**Files:**
- Create: `src/components/tools/tool-header.tsx`

- [ ] **Step 1: Write ToolHeader component code**
Create `src/components/tools/tool-header.tsx` with the following content:
```tsx
import Link from "next/link"
import { ChevronRight, ArrowLeft } from "lucide-react"

interface ToolHeaderProps {
  category: string
  categoryHref: string
  title: string
}

export function ToolHeader({ category, categoryHref, title }: ToolHeaderProps) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
        <Link href="/tools" className="hover:text-foreground transition-colors">Tools</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={categoryHref} className="hover:text-foreground transition-colors">{category}</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">{title}</span>
      </div>
      
      {/* Back Button & Title */}
      <div className="flex items-center gap-3">
        <Link 
          href={categoryHref} 
          className="h-9 w-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-3xl font-black tracking-tight">{title}</h1>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify component compiles**
Run: `npx tsc --noEmit`
Expected: Compile success.

---

### Task 2: Folder Relocations & Href Configuration

**Files:**
- Modify: `next.config.js` (or similar next.config configuration file)
- Modify: `src/components/tools/tools-list.tsx`
- Modify: `src/components/layout/tools-nav.tsx`

- [ ] **Step 1: Relocate tool folders in the project**
Run command-line actions to move the folders:
```bash
# Image & Code
mv src/app/tools/image-converter src/app/tools/image-code/
mv src/app/tools/svg-compressor src/app/tools/image-code/
mv src/app/tools/qr-code src/app/tools/image-code/
mv src/app/tools/code-minifier src/app/tools/image-code/
mv src/app/tools/text-diff src/app/tools/image-code/

# Finance & Dev
mv src/app/tools/invoice-generator src/app/tools/finance-dev/
mv src/app/tools/report src/app/tools/finance-dev/

# Technical SEO
mv src/app/tools/schema-generator src/app/tools/technical-seo/
mv src/app/tools/robots-generator src/app/tools/technical-seo/
mv src/app/tools/sitemap-validator src/app/tools/technical-seo/
mv src/app/tools/llms-txt src/app/tools/technical-seo/

# AI Tools
mv src/app/tools/product-description src/app/tools/ai-tools/
mv src/app/tools/caption-generator src/app/tools/ai-tools/
mv src/app/tools/prompt-generator src/app/tools/ai-tools/
mv src/app/tools/cv-builder src/app/tools/ai-tools/
mv src/app/tools/seo-generator src/app/tools/ai-tools/

# Design
mv src/app/tools/color-contrast src/app/tools/design/
mv src/app/tools/color-palette src/app/tools/design/
mv src/app/tools/gradient-generator src/app/tools/design/
mv src/app/tools/gradient-palette src/app/tools/design/

# Calculators
mv src/app/tools/gst-calculator src/app/tools/calculators/
mv src/app/tools/word-counter src/app/tools/calculators/
mv src/app/tools/color-converter src/app/tools/calculators/
```

- [ ] **Step 2: Add 301 Permanent Redirects to next.config.js**
Open `next.config.js` (or `next.config.mjs`) and add the redirects mapping logic. If `next.config.js` doesn't exist, check `next.config.mjs`.

- [ ] **Step 3: Update Hrefs in Tools List Component**
Update the category objects in `src/components/tools/tools-list.tsx` to use the correct target routes.

- [ ] **Step 4: Update Hrefs in Navigation Sidebar**
Update path structures inside `src/components/layout/tools-nav.tsx` to match relocated routes.

---

### Task 3: Tool Header Integration & Breadcrumbs

**Files:**
- Modify: `src/app/tools/*/*/page.tsx` (all tool pages)

- [ ] **Step 1: Replace page titles with `<ToolHeader>` in all tool pages**
Update each page to import `ToolHeader` and insert it at the top of the content area, replacing the static `<h1>` and back-links.

---

### Task 4: Layout Sizing, Header Stickiness & Contrast Checker Full-width Fix

**Files:**
- Modify: `src/app/tools/layout.tsx`
- Modify: `src/components/layout/tools-nav.tsx`
- Modify: `src/components/tools/color-contrast.tsx`

- [ ] **Step 1: Set Header to sticky top in layout**
Update `src/app/tools/layout.tsx` to wrap `<Header />` in a `sticky top-0 z-50` container and align `aside` positioning and heights.

- [ ] **Step 2: Increase navigation link font sizes**
Modify `src/components/layout/tools-nav.tsx` to adjust sub-link classes from `text-xs` to `text-sm` (14px).

- [ ] **Step 3: Fix Color Contrast Checker bottom layout**
Modify `src/components/tools/color-contrast.tsx` to use a full-width container for the bottom information section.

- [ ] **Step 4: Verify production build compiles**
Run: `npm run build`
Expected: Successful compile with zero errors.
