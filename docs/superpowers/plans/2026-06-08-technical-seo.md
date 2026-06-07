# Technical SEO Suite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and integrate an enhanced Schema Generator (with live Google Search previews) and three new tools: Robots.txt Generator & Validator, XML Sitemap Validator & Visualizer, and Core Web Vitals Speed Checklist.

**Architecture:** Create modular, client-side React page components under `src/components/tools/` and mount them on corresponding Next.js routes under `src/app/tools/`. A new server-side proxy route will fetch XML sitemaps to bypass CORS.

**Tech Stack:** Next.js 16 (Turbopack), React 19, Lucide React icons, Tailwind CSS, Radix UI components (Select, Accordion).

---

### Task 1: Refactor Schema Generator Selector & Layout

**Files:**
- Modify: `src/components/tools/schema-generator.tsx`

- [ ] **Step 1: Replace sidebar with top Select dropdown**
  Modify the desktop layout to remove the left sidebar. Add a `Select` dropdown component right at the top of the editor.
  ```tsx
  // Add select trigger mapping the activeType label and description
  <div className="space-y-2">
    <Label>Select Schema Type</Label>
    <Select value={activeType} onValueChange={(val) => setActiveType(val)}>
      <SelectTrigger className="w-full h-12 rounded-xl">
        <SelectValue placeholder="Choose schema type..." />
      </SelectTrigger>
      <SelectContent>
        {SCHEMA_TYPES.map((type) => (
          <SelectItem key={type.id} value={type.id}>
            <div className="flex items-center gap-2">
              <span className="font-bold">{type.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
  ```

- [ ] **Step 2: Split editor into 2-column layout**
  Update the main interface container from column/responsive into a side-by-side grid `grid lg:grid-cols-[1fr_1fr] gap-8`.
  
- [ ] **Step 3: Implement Google Search Previews**
  Create a tabbed panel on the right side.
  - Tab 1: Code JSON-LD
  - Tab 2: Google Search Preview (Mocking Google's actual visual styling: Title in blue `#1A0DAB`, breadcrumb in grey, snippet description in `#4D5156`).
  ```tsx
  // Google preview visual elements based on activeType
  const renderGooglePreview = () => {
    switch (activeType) {
      case "faq":
        return (
          <div className="font-sans text-sm p-4 border border-border rounded-xl bg-background space-y-2">
            <span className="text-[12px] text-[#4d5156]">https://example.com › faq</span>
            <h3 className="text-[#1a0dab] hover:underline text-lg font-medium cursor-pointer">Frequently Asked Questions - My Site</h3>
            <p className="text-[#4d5156]">Read answers to frequently asked questions about our services.</p>
            <div className="border-t border-gray-150 pt-2 space-y-2 text-xs">
              {formData.faq.map((f: any, idx: number) => (
                <div key={idx} className="border-b pb-2">
                  <div className="font-bold flex justify-between cursor-pointer text-[#1a0dab]">{f.q || "Question?"} <span>▼</span></div>
                  <div className="text-[#4d5156] mt-1 pl-2">{f.a || "Answer content."}</div>
                </div>
              ))}
            </div>
          </div>
        )
      case "product":
        return (
          <div className="font-sans text-sm p-4 border border-border rounded-xl bg-background space-y-2">
            <span className="text-[12px] text-[#4d5156]">https://example.com › product</span>
            <h3 className="text-[#1a0dab] hover:underline text-lg font-medium cursor-pointer">{formData.product.name || "Product Name"}</h3>
            <div className="flex items-center gap-2 text-[#4d5156] text-xs">
              <span className="text-[#f5c018] font-bold">★★★★★</span>
              <span>4.8 (12 reviews)</span>
              <span>• Price: {formData.product.currency || "USD"} {formData.product.price || "9.99"}</span>
              <span>• {formData.product.availability || "InStock"}</span>
            </div>
            <p className="text-[#4d5156]">{formData.product.description || "Product description snippet."}</p>
          </div>
        )
      // Implement templates for Article, Breadcrumb, Recipe, and fallback
    }
  }
  ```

---

### Task 2: Robots.txt Generator & Validator

**Files:**
- Create: `src/components/tools/robots-generator.tsx`
- Create: `src/app/tools/robots-generator/page.tsx`

- [ ] **Step 1: Build robots.txt generator logic**
  Write a component that outputs robots.txt content using standard directives based on form states (e.g. Sitemap URL, Disallowed bot paths).
  ```typescript
  const generateRobotsTxt = () => {
    let output = "User-agent: *\n"
    if (globalDisallowAll) {
      output += "Disallow: /\n"
    } else {
      output += "Disallow: /admin/\nDisallow: /api/\n"
    }
    customRules.forEach(rule => {
      output += `\nUser-agent: ${rule.bot}\n`
      rule.disallows.forEach(path => output += `Disallow: ${path}\n`)
      rule.allows.forEach(path => output += `Allow: ${path}\n`)
    })
    if (sitemapUrl) {
      output += `\nSitemap: ${sitemapUrl}\n`
    }
    return output
  }
  ```

- [ ] **Step 2: Add validation rules matching parser**
  Implement client-side matching using simple regex.
  ```typescript
  const validatePath = (path: string, robotsTxt: string) => {
    // Simple mock validator returning Allowed/Blocked by parsing Disallow directives
    const lines = robotsTxt.split("\n")
    for (let line of lines) {
      if (line.startsWith("Disallow:")) {
        const pattern = line.replace("Disallow:", "").trim()
        if (pattern && path.startsWith(pattern)) {
          return { allowed: false, rule: line }
        }
      }
    }
    return { allowed: true }
  }
  ```

- [ ] **Step 3: Create UI with two tabs (Output vs. Validator)**
  Left column: controls. Right column: output tab (copy/download text) and validator tab.

---

### Task 3: XML Sitemap Validator & Visualizer

**Files:**
- Create: `src/app/api/tools/fetch-sitemap/route.ts`
- Create: `src/components/tools/sitemap-validator.tsx`
- Create: `src/app/tools/sitemap-validator/page.tsx`

- [ ] **Step 1: Create fetch sitemap CORS proxy API route**
  Create a POST handler that fetches remote XML sitemaps.
  ```typescript
  import { NextResponse } from "next/server"
  export async function POST(req: Request) {
    try {
      const { url } = await req.json()
      const res = await fetch(url)
      const text = await res.text()
      return NextResponse.json({ xml: text })
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 })
    }
  }
  ```

- [ ] **Step 2: Write sitemap parser & visualizer**
  Parse XML string using standard DOMParser in browser, extracting `<loc>`, `<lastmod>`, `<changefreq>`, and `<priority>`.
  ```typescript
  const parseSitemap = (xmlText: string) => {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlText, "text/xml")
    const urls = Array.from(xmlDoc.getElementsByTagName("url")).map(node => ({
      loc: node.getElementsByTagName("loc")[0]?.textContent || "",
      lastmod: node.getElementsByTagName("lastmod")[0]?.textContent || "",
      changefreq: node.getElementsByTagName("changefreq")[0]?.textContent || "",
      priority: node.getElementsByTagName("priority")[0]?.textContent || "0.5",
    }))
    return urls
  }
  ```

- [ ] **Step 3: Display summary stats & visual table**
  Create paginated data table list. Create a collapsible folder structure UI for the paths grouping.

---

### Task 4: Core Web Vitals Speed Checklist

**Files:**
- Create: `src/components/tools/web-vitals.tsx`
- Create: `src/app/tools/web-vitals/page.tsx`

- [ ] **Step 1: Create checklist state & circular score dial**
  Build dynamic score generator: `score = (checkedCount / totalCount) * 100`. Renders circular SVG dial.
  
- [ ] **Step 2: Build categorized checklists & copyable code snippet toggles**
  Accordion items displaying action checklists. Next to each checklist rule, implement an expand drawer containing target solutions:
  - *Hero preload snippet*: `<link rel="preload" href="/hero.webp" as="image" />`
  - *Lazy loading image*: `<img src="pic.jpg" loading="lazy" />`
  - *Font loading css*: `@font-face { font-display: swap; }`
