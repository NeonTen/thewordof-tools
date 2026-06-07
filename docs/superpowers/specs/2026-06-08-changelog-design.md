# Design Specification: Static Markdown-Driven Changelog Page

## Goal
Build a clean, high-performance, version-controlled public changelog page at the `/changelog` route, dynamically parsing the root `CHANGELOG.md` file using the `marked` library.

---

## Proposed System Design

### 1. Data Source
- The existing root [CHANGELOG.md](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/CHANGELOG.md) will be the single source of truth.
- This markdown file contains version releases, dates, and bulleted logs categorized into changes (e.g., "Added", "Fixed", "Improved").

### 2. Markdown Parser
- We will install `marked` to securely convert Markdown strings into clean HTML output.
- Server-side parsing guarantees that clients only download raw rendered HTML.

### 3. Routing and Layout
- **Route**: [page.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/app/changelog/page.tsx)
- The page will be wrapped in the standard layout (`Header` and `Footer`).
- It will utilize the expanded `max-w-[1440px]` width.
- Rendered in a modern vertical timeline:
  - Timeline node for each release header (e.g. `## [1.1.0] - 2026-06-08`).
  - Color-coded badges for types of logs.
  - Interactive scroll transitions.

---

## Verification Plan

### Automated Checks
- Run `npx tsc --noEmit` to verify type safety.
- Run `npm run build` to verify page pre-rendering.

### Manual Verification
- Access `http://localhost:3000/changelog` in the browser.
- Verify that typography, line spacing, and timeline nodes are fully aligned and readable in both light and dark modes.
