# Phase 3: SEO Audit Tools Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and integrate four new client-side interactive SEO Audit tools (SERP Previewer & Meta Tag Analyzer, Keyword Density Analyzer, SEO Readability & Content Grader, and Broken Link Auditor) under a new `/tools/seo-audit` category, complete with sticky layouts, breadcrumbs, proxy API routes, and full-width bottom information panels.

**Architecture:** Create modular, client-side React page components under `src/components/tools/` and mount them on corresponding Next.js routes under `src/app/tools/seo-audit/`. Implement proxy APIs under `src/app/api/tools/` to scrape metadata, text, and link response codes server-side.

**Tech Stack:** Next.js 16 (Turbopack), React 19, Lucide React icons, Tailwind CSS, and standard browser DOM parsing.

---

## User Review Required

> [!IMPORTANT]
> - **Category Route**: We will create the category `/tools/seo-audit` to group these content audit and optimization tools.
> - **Proxy API Routes**: Three new server-side API routes (`fetch-meta`, `fetch-text`, and `scan-links`) will be created to bypass CORS when reading or auditing external websites.

---

## Proposed Changes

### Task 1: Navigation & Category Integration
- **Files:**
  - [MODIFY] `src/components/tools/tools-list.tsx`
  - [MODIFY] `src/components/layout/tools-nav.tsx`

- [ ] **Step 1: Add the SEO Audit category to `tools-list.tsx`**
  Modify the `CATEGORIES` array to include the new group and tools.
  ```typescript
  {
    title: "SEO Audit",
    tools: [
      { title: "SERP Previewer", desc: "Preview Google Search results and generate metadata HTML tags.", icon: Search, href: "/tools/seo-audit/serp-preview", pro: false },
      { title: "Keyword Density", desc: "Analyze keyword usage and optimize optimization ratios.", icon: FileText, href: "/tools/seo-audit/keyword-density", pro: false },
      { title: "SEO Readability", desc: "Grade reading ease and score text complexity with Flesch-Kincaid formulas.", icon: Type, href: "/tools/seo-audit/readability-grader", pro: false },
      { title: "Broken Link Checker", desc: "Scan pages for broken links, redirects, and anchor texts.", icon: Zap, href: "/tools/seo-audit/broken-links", pro: true }
    ]
  }
  ```

- [ ] **Step 2: Add the SEO Audit group to the sidebar in `tools-nav.tsx`**
  Add the navigation group and items to `navGroups` and register `"SEO Audit"` in the default `openGroups` state.

---

### Task 2: SERP Previewer & Meta Tag Analyzer
- **Files:**
  - [NEW] `src/app/api/tools/fetch-meta/route.ts`
  - [NEW] `src/components/tools/serp-preview.tsx`
  - [NEW] `src/app/tools/seo-audit/serp-preview/page.tsx`

- [ ] **Step 1: Create CORS meta-fetch proxy API**
  Add a POST handler in `src/app/api/tools/fetch-meta/route.ts` that fetches external HTML, parses title/description tags using simple regex, and returns them.
  ```typescript
  import { NextResponse } from "next/server"

  export async function POST(req: Request) {
    try {
      const { url } = await req.json()
      const formattedUrl = url.startsWith("http") ? url : `https://${url}`
      const response = await fetch(formattedUrl, { headers: { "User-Agent": "Mozilla/5.0 SEO-Agent" } })
      const html = await response.text()
      
      const titleMatch = html.match(/<title>([^<]*)<\/title>/i)
      const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) || 
                        html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i)

      return NextResponse.json({
        title: titleMatch ? titleMatch[1].trim() : "",
        description: descMatch ? descMatch[1].trim() : ""
      })
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  }
  ```

- [ ] **Step 2: Implement the interactive SERP previewer component**
  Build the UI in `src/components/tools/serp-preview.tsx` featuring inputs (Title, Description, URL slug), character/pixel length counters, desktop/mobile preview tabs, code generation tabs, and URL import functionality.

- [ ] **Step 3: Create page route**
  Mount it at `src/app/tools/seo-audit/serp-preview/page.tsx` rendering `<ToolHeader>` breadcrumbs.

---

### Task 3: Keyword Density & Optimization Analyzer
- **Files:**
  - [NEW] `src/app/api/tools/fetch-text/route.ts`
  - [NEW] `src/components/tools/keyword-density.tsx`
  - [NEW] `src/app/tools/seo-audit/keyword-density/page.tsx`

- [ ] **Step 1: Create CORS text-fetch proxy API**
  Add a POST handler in `src/app/api/tools/fetch-text/route.ts` to retrieve and strip HTML tags from a webpage, returning the clean body text.
  ```typescript
  import { NextResponse } from "next/server"

  export async function POST(req: Request) {
    try {
      const { url } = await req.json()
      const formattedUrl = url.startsWith("http") ? url : `https://${url}`
      const response = await fetch(formattedUrl)
      const html = await response.text()
      const bodyText = html.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "")
                           .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, "")
                           .replace(/<[^>]+>/g, " ")
                           .replace(/\s+/g, " ")
      return NextResponse.json({ text: bodyText.trim() })
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  }
  ```

- [ ] **Step 2: Create density analyzer component**
  Build `src/components/tools/keyword-density.tsx` with density table extractors (1-gram, 2-gram, 3-gram), stop-word filter list, and target keyword optimization validator.

- [ ] **Step 3: Create page route**
  Mount it at `src/app/tools/seo-audit/keyword-density/page.tsx`.

---

### Task 4: SEO Readability & Content Grader
- **Files:**
  - [NEW] `src/components/tools/readability-grader.tsx`
  - [NEW] `src/app/tools/seo-audit/readability-grader/page.tsx`

- [ ] **Step 1: Build Flesch-Kincaid computation engine**
  Implement the readability scoring algorithms in `src/components/tools/readability-grader.tsx` to process text input dynamically.

- [ ] **Step 2: Create page route**
  Mount it at `src/app/tools/seo-audit/readability-grader/page.tsx`.

---

### Task 5: Broken Link & Anchor Text Auditor
- **Files:**
  - [NEW] `src/app/api/tools/scan-links/route.ts`
  - [NEW] `src/components/tools/broken-links.tsx`
  - [NEW] `src/app/tools/seo-audit/broken-links/page.tsx`

- [ ] **Step 1: Build broken-links scraper & auditor API**
  Add a POST handler in `src/app/api/tools/scan-links/route.ts` that fetches external HTML, parses links and anchor text, and tests each status code.
  ```typescript
  import { NextResponse } from "next/server"

  export async function POST(req: Request) {
    try {
      const { url } = await req.json()
      const formattedUrl = url.startsWith("http") ? url : `https://${url}`
      const base = new URL(formattedUrl)
      const response = await fetch(formattedUrl)
      const html = await response.text()
      
      const linkRegex = /<a\s+(?:[^>]*?\s+)?href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi
      const links: { href: string; text: string }[] = []
      let match
      while ((match = linkRegex.exec(html)) !== null) {
        let href = match[1].trim()
        if (href.startsWith("/")) href = new URL(href, base).toString()
        if (href.startsWith("http")) {
          links.push({ href, text: match[2].replace(/<[^>]+>/g, "").trim() })
        }
      }

      // Check statuses in parallel batches
      const checkedLinks = await Promise.all(
        links.slice(0, 30).map(async (l) => {
          try {
            const res = await fetch(l.href, { method: "HEAD", signal: AbortSignal.timeout(4000) })
            return { ...l, status: res.status }
          } catch {
            return { ...l, status: 404 }
          }
        })
      )
      return NextResponse.json({ links: checkedLinks })
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  }
  ```

- [ ] **Step 2: Create visual broken link analyzer UI**
  Build `src/components/tools/broken-links.tsx` displaying interactive summary metrics cards and filterable statuses tables.

- [ ] **Step 3: Create page route**
  Mount it at `src/app/tools/seo-audit/broken-links/page.tsx`.

---

## Verification Plan

### Automated Tests
- `npx tsc --noEmit` and `npm run build` to verify standard type-safe Next.js compilation.

### Manual Verification
- Launch local development server (`npm run dev`) and test page navigations via sidebar category links, checking responsiveness and responsive layout offsets.
