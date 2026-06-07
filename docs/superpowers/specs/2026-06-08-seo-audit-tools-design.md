# Phase 3: SEO Audit Tools Design Specification

This specification covers the design and layout of the new SEO Audit Tools suite. The suite consists of four client-facing tools to help users audit and optimize content for search engines.

## Proposed Changes

We will create a new category `/tools/seo-audit` containing the following four new tools:

### 1. SERP Previewer & Meta Tag Analyzer
*   **Route:** `/tools/seo-audit/serp-preview`
*   **Files:**
    *   [NEW] `src/app/tools/seo-audit/serp-preview/page.tsx`: Page wrapper.
    *   [NEW] `src/components/tools/serp-preview.tsx`: Visual preview and generator component.
    *   [NEW] `src/app/api/tools/fetch-meta/route.ts`: CORS proxy API route to scrape metadata from any URL.
*   **Features:**
    *   Inputs for Page Title, Meta Description, and URL slug.
    *   Dynamic characters and pixels counter (warning markers if title is > 60 chars / 580px or description is > 160 chars / 990px).
    *   Live responsive SERP Google Snippet Preview supporting both Desktop and Mobile tabs.
    *   HTML Meta Tag Generator (producing standard SEO, Open Graph, and Twitter card tags).
    *   URL Meta Scraper to fetch and pre-fill fields directly from any live website.

### 2. Keyword Density & Optimization Analyzer
*   **Route:** `/tools/seo-audit/keyword-density`
*   **Files:**
    *   [NEW] `src/app/tools/seo-audit/keyword-density/page.tsx`: Page wrapper.
    *   [NEW] `src/components/tools/keyword-density.tsx`: Content analyzer component.
    *   [NEW] `src/app/api/tools/fetch-text/route.ts`: CORS proxy API to download readable text from a URL.
*   **Features:**
    *   Input modes: Raw Textarea or URL fetch import.
    *   N-gram density analyzer extracting top single keywords, 2-word phrases, and 3-word phrases.
    *   Common English stop-word filtration.
    *   Interactive tabular summary with keyword counts and density percentage metrics.
    *   Target keyword optimization check (evaluating if target density is in the recommended 1.0% - 2.5% zone).

### 3. SEO Readability & Content Grader
*   **Route:** `/tools/seo-audit/readability-grader`
*   **Files:**
    *   [NEW] `src/app/tools/seo-audit/readability-grader/page.tsx`: Page wrapper.
    *   [NEW] `src/components/tools/readability-grader.tsx`: Readability scoring component.
*   **Features:**
    *   Calculates Flesch Reading Ease score.
    *   Calculates estimated reading time.
    *   Full linguistic stats: word count, sentence count, average sentence length, syllable count.
    *   Readability Grade output (e.g. Standard, Fairly Easy, Difficult) and recommendations.

### 4. Broken Link & Anchor Text Auditor
*   **Route:** `/tools/seo-audit/broken-links`
*   **Files:**
    *   [NEW] `src/app/tools/seo-audit/broken-links/page.tsx`: Page wrapper.
    *   [NEW] `src/components/tools/broken-links.tsx`: Scanned links auditor component.
    *   [NEW] `src/app/api/tools/scan-links/route.ts`: API route checking all target page anchor tags.
*   **Features:**
    *   Takes a URL input, requests the page server-side, extracts all `<a>` tags.
    *   Asynchronously tests status codes (HEAD/GET requests) for all parsed links.
    *   Displays overall summary metrics: total links, broken count, redirects, internal vs external count.
    *   Presents an interactive filterable table showing Anchor Text, URL, HTTP Status (red badge for 404, yellow for 301, green for 200), and Link type.
