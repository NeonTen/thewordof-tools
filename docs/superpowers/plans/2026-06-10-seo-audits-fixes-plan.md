# SEO Audits & Keyword Density Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix false 404 broken links, implement Pro vs Free scan limits on the backend, add client-side pagination for links, and fix keyword density phrase checking with tokenized matching.

**Architecture:** 
1. Use NextAuth session to query Prisma user role on backend. Set scan limits based on Pro status.
2. Use chunked parallel batch checks of size 10, realistic browser User-Agent headers, and try HEAD with a GET fallback to resolve false 404s.
3. Track client pagination state (page, size) in React and render page links footer.
4. Tokenize target keywords using standard regex and evaluate using a sliding word array loop window.

**Tech Stack:** React, Tailwind CSS, TypeScript, Next.js App Router, Prisma client.

---

### Task 1: Update Broken Links Backend Route

**Files:**
- Modify: `src/app/api/tools/scan-links/route.ts`

- [ ] **Step 1: Modify imports to include Auth and Prisma client**
Include `auth` from `@/auth` and `prisma` from `@/lib/prisma`.

- [ ] **Step 2: Update the route POST handler to verify user subscription status**
Check if session user is Pro/Business/Admin. Set scan limit.

- [ ] **Step 3: Refactor fetch logic to batch queries, use browser User-Agent, and HEAD/GET fallback**
Write chunked loop (batch size 10) to query status codes.

```typescript
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { url } = await req.json()
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    const session = await auth()
    let isPro = false
    if (session?.user?.id) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { subscriptions: true }
      })
      isPro = user?.role === "PRO" || user?.role === "BUSINESS" || user?.role === "ADMIN" || user?.subscriptions?.[0]?.plan === "PREMIUM" || user?.subscriptions?.[0]?.plan === "BUSINESS"
    }

    const formattedUrl = url.startsWith("http") ? url : `https://${url}`
    let base: URL
    try {
      base = new URL(formattedUrl)
    } catch {
      return NextResponse.json({ error: "Invalid URL structure provided." }, { status: 400 })
    }

    const response = await fetch(formattedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      signal: AbortSignal.timeout(8000)
    })

    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch webpage: ${response.statusText}` }, { status: response.status })
    }

    const html = await response.text()
    const linkRegex = /<a\s+(?:[^>]*?\s+)?href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi
    const parsedLinks: { href: string; text: string; type: "internal" | "external" }[] = []
    const seenUrls = new Set<string>()

    let match
    while ((match = linkRegex.exec(html)) !== null) {
      let href = match[1].trim()
      if (!href || href.startsWith("#") || href.startsWith("javascript:") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        continue
      }

      let resolvedUrl = href
      if (href.startsWith("/")) {
        resolvedUrl = `${base.origin}${href}`
      } else if (!href.startsWith("http")) {
        resolvedUrl = `${base.origin}/${href}`
      }

      if (seenUrls.has(resolvedUrl)) {
        continue
      }
      seenUrls.add(resolvedUrl)

      let type: "internal" | "external" = "external"
      try {
        const parsedResolved = new URL(resolvedUrl)
        if (parsedResolved.hostname === base.hostname) {
          type = "internal"
        }
      } catch {
        continue
      }

      const anchorText = match[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() || "[No Text / Icon Link]"
      parsedLinks.push({ href: resolvedUrl, text: anchorText, type })
    }

    const limit = isPro ? parsedLinks.length : 30
    const linksToScan = parsedLinks.slice(0, limit)

    // Batch checks in parallel groups of 10 to avoid connection pooling issues or rate limits
    const batchSize = 10
    const scannedLinks: any[] = []
    const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

    for (let i = 0; i < linksToScan.length; i += batchSize) {
      const batch = linksToScan.slice(i, i + batchSize)
      const results = await Promise.all(
        batch.map(async (link) => {
          let status = 0
          try {
            const headResponse = await fetch(link.href, {
              method: "HEAD",
              headers: { "User-Agent": userAgent },
              signal: AbortSignal.timeout(4000)
            })
            status = headResponse.status
          } catch {
            // ignore and fallback to GET
          }

          if (status < 200 || status >= 400) {
            try {
              const getResponse = await fetch(link.href, {
                method: "GET",
                headers: { "User-Agent": userAgent },
                signal: AbortSignal.timeout(4000)
              })
              status = getResponse.status
            } catch {
              status = 0 // network/connection issue
            }
          }

          return { ...link, status }
        })
      )
      scannedLinks.push(...results)
    }

    return NextResponse.json({ links: scannedLinks })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to audit webpage links" }, { status: 500 })
  }
}
```

- [ ] **Step 4: Commit changes**
Stage and commit changes to `src/app/api/tools/scan-links/route.ts`.

---

### Task 2: Implement Pagination in Broken Links UI

**Files:**
- Modify: `src/components/tools/broken-links.tsx`

- [ ] **Step 1: Add state and hook setup**
Add `currentPage` and `pageSize` state variables. Add `useEffect` to reset page to 1 when filter changes.

- [ ] **Step 2: Modify table mapping to render paginated slice**
Slice `filteredLinks` from `(currentPage - 1) * pageSize` to `currentPage * pageSize`.

- [ ] **Step 3: Implement Pagination Footer layout**
Below the table container, add table page controls: Page Size Selector (options 10, 25, 50, 100, and "all"), page counts, and Prev/Next buttons.

```typescript
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState<number | "all">(10)

  // Reset page when filter changes
  useMemo(() => {
    setCurrentPage(1)
  }, [filter])

  const paginatedLinks = useMemo(() => {
    if (pageSize === "all") return filteredLinks
    const start = (currentPage - 1) * pageSize
    return filteredLinks.slice(start, start + pageSize)
  }, [filteredLinks, currentPage, pageSize])

  const totalPages = useMemo(() => {
    if (pageSize === "all" || filteredLinks.length === 0) return 1
    return Math.ceil(filteredLinks.length / pageSize)
  }, [filteredLinks, pageSize])
```

- [ ] **Step 4: Commit changes**
Stage and commit changes to `src/components/tools/broken-links.tsx`.

---

### Task 3: Fix Target Keyword Matcher in Keyword Density

**Files:**
- Modify: `src/components/tools/keyword-density.tsx`

- [ ] **Step 1: Rewrite targetsAnalysis using tokenized match regex**
Update `targetsAnalysis` to parse search inputs using the same tokenization pattern as raw text, and loop matching slices of any length.

```typescript
  // Target Keywords Validator
  const targetsAnalysis = useMemo(() => {
    const keywords = targetKeywords
      .split(",")
      .map(k => k.trim())
      .filter(k => k.length > 0)
    
    return keywords.map(kw => {
      // Tokenize target keyword using the exact same word regex pattern
      const parts = kw.match(/[a-zA-Z0-9'-]+/g) || []
      let count = 0
      
      if (parts.length > 0) {
        const matchLength = parts.length
        for (let i = 0; i <= parsedWords.length - matchLength; i++) {
          let match = true
          for (let j = 0; j < matchLength; j++) {
            const wordA = caseSensitive ? parsedWords[i + j] : parsedWords[i + j].toLowerCase()
            const wordB = caseSensitive ? parts[j] : parts[j].toLowerCase()
            if (wordA !== wordB) {
              match = false
              break
            }
          }
          if (match) count++
        }
      }

      const density = totalWordsCount > 0 ? (count / totalWordsCount) * 100 : 0
      
      // Evaluation
      let status: "good" | "warning" | "over" | "under" = "good"
      let message = "Optimal density (1.0% - 2.5%)"
      if (density === 0) {
        status = "under"
        message = "Keyword not found on page"
      } else if (density < 1.0) {
        status = "warning"
        message = "Low density (< 1.0%) - consider adding more"
      } else if (density > 2.5) {
        status = "over"
        message = "Over-optimized (> 2.5%) - risk of keyword stuffing"
      }

      return { keyword: kw, count, density, status, message }
    })
  }, [targetKeywords, parsedWords, totalWordsCount, caseSensitive])
```

- [ ] **Step 2: Commit changes**
Stage and commit changes to `src/components/tools/keyword-density.tsx`.

---

### Task 4: Run Verifications

- [ ] **Step 1: Check typescript compile output**
Run: `npx tsc --noEmit`
Expected: Succeeds with no errors.
