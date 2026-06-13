# Spacing Standardization and Navigation Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean up and standardize bottom padding classes on all tools to solve uneven gaps before the "Related Tools" section, and prevent duplicate related tools on category/tools landing pages.

**Architecture:** Update the pathname segmentation parser in `RelatedTools` to hide the section on index/category pages. Search and replace spacing/padding styles like `pb-20` on all tool layout containers to guarantee uniform 64px spacing to footer/related items.

**Tech Stack:** Next.js, React, Tailwind CSS

---

### Task 1: Fix RelatedTools Category Filter
**Files:**
- Modify: `src/components/tools/related-tools.tsx`

- [ ] **Step 1: Modify pathname checks in related-tools.tsx**
  Replace pathname checking logic to filter out empty components and check length to prevent rendering on category index pages.
  ```typescript
  const segments = pathname.split("/").filter(Boolean)
  if (segments.length <= 2) return null
  const categoryKey = segments[1]
  ```
- [ ] **Step 2: Commit**
  ```bash
  git add src/components/tools/related-tools.tsx
  git commit -m "fix: hide related tools on category pages"
  ```

### Task 2: Standardize Spacing in Tool Files
**Files:**
- Modify: All tool component files listed below.

- [ ] **Step 1: Clean up padding in color-converter.tsx**
  Remove `pb-8 md:pb-20` on line 153.
  ```typescript
  // From:
  <div className="grid xl:grid-cols-4 gap-8 pb-8 md:pb-20">
  // To:
  <div className="grid xl:grid-cols-4 gap-8">
  ```
- [ ] **Step 2: Clean up padding in gst-calculator.tsx**
  Remove `pb-8 md:pb-20` on line 95.
  ```typescript
  // From:
  <div className="grid xl:grid-cols-4 gap-8 pb-8 md:pb-20">
  // To:
  <div className="grid xl:grid-cols-4 gap-8">
  ```
- [ ] **Step 3: Clean up padding in word-counter.tsx**
  Remove `pb-8 md:pb-20` on line 90.
  ```typescript
  // From:
  <div className="grid xl:grid-cols-4 gap-8 pb-8 md:pb-20">
  // To:
  <div className="grid xl:grid-cols-4 gap-8">
  ```
- [ ] **Step 4: Clean up padding in image-converter.tsx**
  Remove `pb-8 md:pb-20` on line 247, and `pb-20` on line 598.
  ```typescript
  // From:
  <div className="grid xl:grid-cols-3 gap-8 pb-8 md:pb-20">
  // To:
  <div className="grid xl:grid-cols-3 gap-8">
  
  // From:
  <div className="grid md:grid-cols-2 gap-12 mt-8 md:mt-16 border-t pt-12 pb-20">
  // To:
  <div className="grid md:grid-cols-2 gap-12 mt-8 md:mt-16 border-t pt-12">
  ```
- [ ] **Step 5: Clean up padding in svg-compressor.tsx**
  Remove `pb-20` on line 262.
  ```typescript
  // From:
  <div className="space-y-8 pb-20">
  // To:
  <div className="space-y-8">
  ```
- [ ] **Step 6: Clean up padding in line-height-calculator.tsx**
  Remove `pb-20` on line 89.
  ```typescript
  // From:
  <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12 pb-20">
  // To:
  <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12">
  ```
- [ ] **Step 7: Clean up padding in sip-calculator.tsx**
  Remove `pb-20` on line 142.
  ```typescript
  // From:
  <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12 pb-20">
  // To:
  <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12">
  ```
- [ ] **Step 8: Clean up padding in gradient-generator.tsx**
  Remove `pb-20` on line 240.
  ```typescript
  // From:
  <div className="grid md:grid-cols-2 gap-12 mt-16 border-t border-border pt-12 pb-20">
  // To:
  <div className="grid md:grid-cols-2 gap-12 mt-16 border-t border-border pt-12">
  ```
- [ ] **Step 9: Clean up padding in gradient-palette.tsx**
  Remove `pb-20` on line 383.
  ```typescript
  // From:
  <div className="grid md:grid-cols-2 gap-12 mt-16 border-t border-border pt-12 pb-20">
  // To:
  <div className="grid md:grid-cols-2 gap-12 mt-16 border-t border-border pt-12">
  ```
- [ ] **Step 10: Clean up padding in seo-generator.tsx**
  Remove `pb-20` on line 250.
  ```typescript
  // From:
  <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12 pb-20">
  // To:
  <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12">
  ```
- [ ] **Step 11: Clean up padding in aspect-ratio-calculator.tsx**
  Remove `pb-20` on line 144.
  ```typescript
  // From:
  <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12 pb-20">
  // To:
  <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12">
  ```
- [ ] **Step 12: Clean up padding in bmi-calculator.tsx**
  Remove `pb-20` on line 121.
  ```typescript
  // From:
  <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12 pb-20">
  // To:
  <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12">
  ```
- [ ] **Step 13: Clean up padding in salary-hourly-calculator.tsx**
  Remove `pb-20` on line 99.
  ```typescript
  // From:
  <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12 pb-20">
  // To:
  <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12">
  ```
- [ ] **Step 14: Clean up padding in color-palette.tsx**
  Remove `pb-20` on line 375.
  ```typescript
  // From:
  <div className="grid md:grid-cols-2 gap-12 mt-16 border-t border-border pt-12 pb-20">
  // To:
  <div className="grid md:grid-cols-2 gap-12 mt-16 border-t border-border pt-12">
  ```
- [ ] **Step 15: Clean up padding in emi-calculator.tsx**
  Remove `pb-20` on line 146.
  ```typescript
  // From:
  <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12 pb-20">
  // To:
  <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12">
  ```
- [ ] **Step 16: Clean up padding in prompt-generator.tsx**
  Remove `pb-20` on line 214.
  ```typescript
  // From:
  <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12 pb-20">
  // To:
  <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12">
  ```
- [ ] **Step 17: Clean up padding in px-to-rem-calculator.tsx**
  Remove `pb-20` on line 107.
  ```typescript
  // From:
  <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12 pb-20">
  // To:
  <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12">
  ```
- [ ] **Step 18: Clean up padding in caption-generator.tsx**
  Remove `pb-20` on line 237.
  ```typescript
  // From:
  <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12 pb-20">
  // To:
  <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12">
  ```
- [ ] **Step 19: Clean up padding in invoice-generator.tsx**
  Remove `pb-20` on line 512.
  ```typescript
  // From:
  <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12 pb-20 print:hidden">
  // To:
  <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12 print:hidden">
  ```
- [ ] **Step 20: Clean up padding in code-minifier.tsx**
  Remove `pb-20` on line 226.
  ```typescript
  // From:
  <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12 pb-20">
  // To:
  <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12">
  ```
- [ ] **Step 21: Clean up padding in color-contrast.tsx**
  Remove `pb-20` on line 292.
  ```typescript
  // From:
  <div className="lg:col-span-12 grid md:grid-cols-2 gap-12 mt-16 border-t border-border pt-12 pb-20">
  // To:
  <div className="lg:col-span-12 grid md:grid-cols-2 gap-12 mt-16 border-t border-border pt-12">
  ```
- [ ] **Step 22: Clean up padding in compound-interest-calculator.tsx**
  Remove `pb-20` on line 174.
  ```typescript
  // From:
  <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12 pb-20">
  // To:
  <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12">
  ```
- [ ] **Step 23: Clean up padding in qr-code.tsx**
  Remove `pb-20` on line 1047.
  ```typescript
  // From:
  <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12 pb-20">
  // To:
  <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12">
  ```
- [ ] **Step 24: Commit all spacing fixes**
  ```bash
  git add src/components/tools/
  git commit -m "style: remove pb-20 padding bottom on all tool dashboard/SEO containers for uniform spacing"
  ```

### Task 3: Build & Graphify Verification
**Files:** None

- [ ] **Step 1: Run project production build**
  Run: `npm run build`
  Expected: Builds cleanly with no TS or next errors.
- [ ] **Step 2: Update graphify index**
  Run: `graphify update .`
- [ ] **Step 3: Commit all remaining files**
  ```bash
  git commit -am "chore: update graphify and final builds"
  ```
