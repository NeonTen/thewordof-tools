# SEO Refinements & Category Merging Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Merge the "SEO Audit" category into "Technical SEO", relocate routes, update the sidebar and navigation list, force Google-like white card backgrounds for SERP previews to fix dark mode visibility, integrate URL content scraping into the Readability Grader, and apply free user monthly usage limits (3-5) across all 4 new SEO tools.

**Architecture:** Relocate pages under `src/app/tools/seo-audit/` to `src/app/tools/technical-seo/`, delete the old directory, update imports/ToolHeader values, incorporate the `useUsageLimit` hook, and wrap/gate action triggers using the existing `ProGate` and limits state.

**Tech Stack:** Next.js 16 (Turbopack), React 19, Tailwind CSS.

---

## User Review Required

> [!IMPORTANT]
> - **Category Consolidation**: The "SEO Audit" and "Technical SEO" categories will be merged into a single category: **Technical SEO**.
> - **File Paths**: Tools will be moved from `/tools/seo-audit/[tool]` to `/tools/technical-seo/[tool]`. No redirects will be added.
> - **Usage Limits**:
>   - SERP Previewer: 5 free URL metadata fetches per month.
>   - Keyword Density: 5 free page content scrapes per month.
>   - SEO Readability: 5 free page content scrapes per month.
>   - Broken Links: 3 free page audits per month.

---

## Proposed Changes

### Task 1: Consolidate Navigation & Category List
- **Files:**
  - [MODIFY] `src/components/tools/tools-list.tsx`
  - [MODIFY] `src/components/layout/tools-nav.tsx`

- [ ] **Step 1: Merge categories in `tools-list.tsx`**
  Remove the "SEO Audit" category block and append all its tools to the "Technical SEO" category.
  
- [ ] **Step 2: Merge categories in `tools-nav.tsx`**
  Remove the "SEO Audit" navGroup, append all its items to the "Technical SEO" items, and remove `"SEO Audit": true` from the default `openGroups` state.

---

### Task 2: Relocate Folder Files
- **Commands:**
  Run the shell commands to move the page directories and delete the old category directory:
  ```bash
  mv src/app/tools/seo-audit/serp-preview src/app/tools/technical-seo/
  mv src/app/tools/seo-audit/keyword-density src/app/tools/technical-seo/
  mv src/app/tools/seo-audit/readability-grader src/app/tools/technical-seo/
  mv src/app/tools/seo-audit/broken-links src/app/tools/technical-seo/
  rm -rf src/app/tools/seo-audit
  ```

---

### Task 3: SERP Previewer Polish & Limits
- **Files:**
  - [MODIFY] `src/app/tools/technical-seo/serp-preview/page.tsx`
  - [MODIFY] `src/components/tools/serp-preview.tsx`

- [ ] **Step 1: Update page path and ToolHeader title**
  Change the ToolHeader category to `"Technical SEO"` and categoryHref to `"/tools/technical-seo"`.

- [ ] **Step 2: Enforce white background on Google Snippets**
  Change both desktop and mobile preview boxes in `src/components/tools/serp-preview.tsx` to use `bg-white border border-gray-200 text-[#4d5156]` and static dark text colors, so they are fully visible in dark mode.

- [ ] **Step 3: Integrate usage limits**
  Implement `useUsageLimit("serp-previewer", "monthly")` to track scrapes. Limit free users to 5 URL scrapes per month. Show a remaining credits indicator and gate the Fetch button.

---

### Task 4: Keyword Density Limits
- **Files:**
  - [MODIFY] `src/app/tools/technical-seo/keyword-density/page.tsx`
  - [MODIFY] `src/components/tools/keyword-density.tsx`

- [ ] **Step 1: Update page metadata and ToolHeader**
  Point the ToolHeader category to `"Technical SEO"`.

- [ ] **Step 2: Add usage limits**
  Add `useUsageLimit("keyword-density", "monthly")` in `src/components/tools/keyword-density.tsx`. Limit free users to 5 URL crawls per month. Gate the Scrape button.

---

### Task 5: SEO Readability URL Scraper & Limits
- **Files:**
  - [MODIFY] `src/app/tools/technical-seo/readability-grader/page.tsx`
  - [MODIFY] `src/components/tools/readability-grader.tsx`

- [ ] **Step 1: Update page metadata and ToolHeader**
  Point the ToolHeader category to `"Technical SEO"`.

- [ ] **Step 2: Implement Scrape URL mode in `readability-grader.tsx`**
  Add state variables (`url`, `fetching`, `fetchError`, `inputMode`) and fetch from `/api/tools/fetch-text` just like Keyword Density.

- [ ] **Step 3: Add usage limits**
  Add `useUsageLimit("readability-grader", "monthly")` to limit free users to 5 scrapes per month. Gate the Scrape button.

---

### Task 6: Broken Link Auditor limits
- **Files:**
  - [MODIFY] `src/app/tools/technical-seo/broken-links/page.tsx`
  - [MODIFY] `src/components/tools/broken-links.tsx`

- [ ] **Step 1: Update page ToolHeader**
  Point the ToolHeader category to `"Technical SEO"`.

- [ ] **Step 2: Enforce free user limit (3 checks per month)**
  Implement `useUsageLimit("broken-links", "monthly")`. Change the `ProGate` wrapper to check `isPro || usedThisMonth < 3` to allow 3 free audits per month before prompting upgrade.

---

## Verification Plan

### Automated Tests
- Run `npx tsc --noEmit` and `npm run build` to verify standard type-safe Next.js compilation.

### Manual Verification
- Test SERP preview visibility under dark mode in the browser.
- Verify that URL scraping works on the SEO Readability page.
- Check that navigation category sidebar links compile correctly.
