# Document Tools Category Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the `/tools/document-tools` page into a standalone category layout and clean up legacy internal `/finance-dev` routing links.

**Architecture:** We are updating Next.js `page.tsx` routing components to render a static grid of document tools instead of the global `ToolsList` component. We are also doing a search-and-replace on hardcoded routing strings in the sitemap and internal navigation to prevent client-side redirects from `finance-dev` paths.

**Tech Stack:** Next.js (App Router), React, TailwindCSS, TypeScript.

---

### Task 1: Clean up internal paths in `tools-list.tsx` and `related-tools.tsx`

**Files:**
- Modify: `src/components/tools/tools-list.tsx`
- Modify: `src/components/tools/related-tools.tsx`

- [ ] **Step 1: Write the minimal implementation for `tools-list.tsx`**

Modify `src/components/tools/tools-list.tsx` lines 58-60 to update the `href` paths from `finance-dev` to `document-tools`.

```tsx
// Inside CATEGORIES array, under "Document Tools":
      { title: "Doc Converter",     desc: "Convert document formats like PDF, DOCX, and TXT seamlessly.",         icon: FileText,     href: "/tools/image-code/doc-converter",         pro: false }, // Note: Doc converter seems to be in image-code, ensure this points to the right path if we moved it. Let's point it to /tools/document-tools/doc-converter if it exists, or leave as is if not. Wait, the spec said to include Doc Converter. The actual path is /tools/image-code/doc-converter right now, but we just need to fix invoice-generator and report here.
      { title: "Invoice Generator", desc: "Create professional PDF invoices in seconds.",                         icon: FileText,   href: "/tools/document-tools/invoice-generator", pro: true },
      { title: "Work Report Generator", desc: "Compile daily task trackers and print matching standard A4 PDFs.", icon: FileText,   href: "/tools/document-tools/report",            pro: false },
```

- [ ] **Step 2: Write the minimal implementation for `related-tools.tsx`**

Modify `src/components/tools/related-tools.tsx` to update the `"finance-dev"` key to `"document-tools"`.

```tsx
  "document-tools": {
    title: "Document Tools",
    items: [
      { name: "Invoice Generator", href: "/tools/document-tools/invoice-generator", desc: "Create, customize, and export professional invoice receipts." },
      { name: "Work Report Generator", href: "/tools/document-tools/report", desc: "Generate professional work reports and daily trackers." }
    ]
  },
```

- [ ] **Step 3: Run typescript check to verify it passes**

Run: `npx tsc --noEmit`
Expected: PASS (No new errors)

- [ ] **Step 4: Commit**

```bash
git add src/components/tools/tools-list.tsx src/components/tools/related-tools.tsx
git commit -m "refactor: update finance-dev paths to document-tools in components"
```

---

### Task 2: Update Sitemap

**Files:**
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Write the minimal implementation**

Modify `src/app/sitemap.ts` to replace `finance-dev` paths with `document-tools`.

```tsx
    // Document Tools
    '/tools/document-tools',
    '/tools/document-tools/invoice-generator',
    '/tools/document-tools/report',
```

- [ ] **Step 2: Run typescript check**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "chore: update sitemap with document-tools paths"
```

---

### Task 3: Build Standalone Category Page

**Files:**
- Modify: `src/app/tools/document-tools/page.tsx`

- [ ] **Step 1: Write the minimal implementation**

Replace the contents of `src/app/tools/document-tools/page.tsx` with a static layout matching the design category.

```tsx
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Files } from "lucide-react"

export const metadata = {
  title: "Document Tools | TheWordOf Tools",
  description: "Free online document utilities, PDF converters, professional invoice generators, and work report templates.",
}

const tools = [
  {
    title: "Doc Converter",
    description: "Convert document formats like PDF, DOCX, and TXT seamlessly.",
    href: "/tools/image-code/doc-converter", // Update if Doc Converter is moved
    icon: Files,
    pro: false,
  },
  {
    title: "Invoice Generator",
    description: "Create and export professional PDF invoices in seconds.",
    href: "/tools/document-tools/invoice-generator",
    icon: FileText,
    pro: true,
  },
  {
    title: "Work Report Generator",
    description: "Compile daily task trackers and print matching standard A4 PDFs.",
    href: "/tools/document-tools/report",
    icon: FileText,
    pro: false,
  },
]

export default function DocumentToolsPage() {
  return (
    <div className="flex flex-col gap-8 pb-16">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Document Tools</h1>
        <p className="text-muted-foreground mt-2 text-base">
          Professional PDF generation, document conversion, and invoicing utilities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon
          return (
            <Link key={tool.href} href={tool.href} className="group block h-full">
              <Card className="h-full border border-border/50 bg-card hover:bg-muted/30 transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                  <div className="p-2.5 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    {tool.pro && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
                        PRO
                      </span>
                    )}
                    <CardTitle className="text-lg font-black group-hover:text-primary transition-colors duration-200 mt-1">
                      {tool.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                    {tool.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Run verification**

Run: `npm run build`
Expected: Successful build, no routing conflicts.

- [ ] **Step 3: Commit**

```bash
git add src/app/tools/document-tools/page.tsx
git commit -m "feat: rebuild document-tools page as dedicated category landing page"
```
