# Technical SEO Tools & Schema Enhancements Design Spec

This document details the functional specifications, page routes, state structures, and visual designs for the Phase 2 Technical SEO Suite.

## Route Architecture
The tools are separated into individual routes to optimize SEO indexing and layout workspaces:
1. **Schema Generator (Enhanced)**: [schema-generator.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/tools/schema-generator.tsx) (existing page modified to top dropdown and live visual previews).
2. **Robots.txt Generator & Validator**: `/tools/robots-generator` (New page and component).
3. **XML Sitemap Validator & Visualizer**: `/tools/sitemap-validator` (New page and component).
4. **Core Web Vitals Speed Checklist**: `/tools/web-vitals` (New page and component).

---

## 1. Schema Generator (Enhanced)
### Refactored UI & Top Dropdown
- Move the left vertical selection list into a top `Select` element.
- The editor card uses a 2-column layout on desktop:
  - **Left Column**: Form inputs for the selected schema type.
  - **Right Column**: Tabbed viewer:
    - **Tab 1: JSON-LD**: Syntax-highlighted output with copy/download options.
    - **Tab 2: Google Rich Result Preview**: HTML/CSS mockup showing how Google represents the schema in search results.
      - *FAQ*: Renders as list items with expanding drop-downs.
      - *Product*: Includes star rating, price, and stock availability badge.
      - *Article*: Headline, date published, and thumbnail.
      - *Breadcrumb*: Nested navigational trail.
      - *Recipe*: Shows cook time, calories, and rating stars.

---

## 2. Robots.txt Generator & Validator
### Features
- **Global Settings**: Directives for Sitemap URL, and default Allow/Disallow rule for all bots (`User-agent: *`).
- **Bot-Specific Directives**: Form list allowing users to add specific user-agents (e.g. `Googlebot`, `GPTBot`) with custom Allow/Disallow path rules.
- **Syntax Validator**: Real-time evaluation of user-inputted paths (e.g., `/admin/dashboard`) against the active robots.txt rules, printing a **Green (Allowed)** or **Red (Blocked)** status along with the directive line that triggered it.
- **Copy & Download**: Export generated rules easily.

---

## 3. XML Sitemap Validator & Visualizer
### Features
- **Fetch Proxy API**: A server-side API handler `src/app/api/tools/fetch-sitemap/route.ts` to fetch sitemaps from remote URLs and bypass browser CORS limitations.
- **Summary Badges**: Count of total URLs, index sitemaps, media tags (images/videos), and formatting warnings.
- **Tab 1: URL Database Table**: A paginated list supporting column sorting for Priority, Frequency, LastMod date, and fuzzy path searches.
- **Tab 2: Visual Tree Map**: Collapsible tree diagram organizing links by depth level (e.g. `domain/` -> `blog/` -> `posts/`).
- **Tab 3: Compliance Warnings**: Alert logs for dead URLs, missing attributes, or non-secure HTTP targets.

---

## 4. Core Web Vitals Checklist
### Features
- **Score Dial**: Dynamic radial gauge (0 to 100) incremented as checklist items are toggled.
- **Checklist Sections**: Accordions corresponding to:
  - **LCP (Largest Contentful Paint)**: preloading hero images, font-display swap, lazy loading assets.
  - **INP (Interaction to Next Paint)**: yielding thread tasks, optimizing listener triggers.
  - **CLS (Cumulative Layout Shift)**: setting width/height, styling fallback slots.
- **Inline Fix Panels**: Click-to-expand explanation drawers with copy-pasteable HTML preload markup, CSS aspect-ratio configurations, or async script templates.
