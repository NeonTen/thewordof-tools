# Document Tools Category Page Refactor

## Purpose
Convert the `/tools/document-tools` page into a dedicated, standalone category landing page (similar to `/tools/design`), removing the global search and filter UI. Additionally, clean up legacy internal links pointing to the deprecated `/tools/finance-dev` paths.

## Architecture & Changes

### 1. Dedicated Category Page (`src/app/tools/document-tools/page.tsx`)
- **Current State:** Renders the `<ToolsList />` component which displays all tools across the app.
- **New State:** A standalone page rendering a static grid of cards specifically for Document Tools.
- **Tools to Include:**
  - Doc Converter (`/tools/document-tools/converter` or as currently defined)
  - Invoice Generator (`/tools/document-tools/invoice-generator` - PRO)
  - Work Report Generator (`/tools/document-tools/report`)
- **UI Elements:** Use `@/components/ui/card` and `lucide-react` icons (FileText, etc.) exactly mirroring the structure and CSS classes used in `src/app/tools/design/page.tsx`.

### 2. Internal Link Cleanup
- **Goal:** Ensure all internal navigation uses the new `/tools/document-tools` route prefix, avoiding client-side redirects.
- **Files to Update:**
  - `src/app/sitemap.ts`: Update XML sitemap entries from `/finance-dev` to `/document-tools`.
  - `src/components/tools/related-tools.tsx`: Update the `"finance-dev"` key and internal paths to `document-tools`.
  - `src/components/tools/tools-list.tsx`: Update the paths in the `CATEGORIES` array for the Invoice Generator and Work Report Generator.

### 3. Redirect Preservation
- The existing Next.js page redirects in `src/app/tools/finance-dev/page.tsx` and related sub-pages will remain unchanged to handle old bookmarks and external links gracefully.

## Scope & Constraints
- Only the `document-tools` and `finance-dev` related routing and presentation is changing. No core tool functionality is being modified.
