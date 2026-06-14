# SEO Metadata Migration Spec

## Objective
Standardize SEO meta tags across the entire application by migrating all individual Next.js `page.tsx` files to use the centralized `generateSeoMetadata` helper. This ensures every page automatically receives properly formatted OpenGraph, Twitter cards, canonical URLs, and other advanced SEO configurations.

## Scope
- Affects approximately 50+ individual `page.tsx` and `layout.tsx` files currently using hardcoded `export const metadata = { title: "...", description: "..." }`.
- Does not change the core architecture of the `generateSeoMetadata` helper, only its utilization across the app.

## Implementation Approach: The Automated Sweep

To prevent manual error and save significant time, we will write a one-off Node.js script to perform an Automated Sweep across the codebase.

### The Transformation Script
We will write a temporary script (e.g., `scratch/migrate-metadata.js`) that will:
1. **Traverse** the `src/app` directory recursively to find all `page.tsx` files.
2. **Detect** files that have a hardcoded `export const metadata = { ... }` block but do not import `generateSeoMetadata`.
3. **Parse** the existing `title` and `description` string values using Regex or AST.
4. **Transform** the code by:
   - Injecting `import { generateSeoMetadata } from "@/app/lib/seo"` at the top of the file (handling existing imports correctly).
   - Replacing the static metadata object with:
     ```typescript
     export const metadata = generateSeoMetadata({
       title: "Extracted Title",
       description: "Extracted Description",
     });
     ```
5. **Format** the updated files using the project's Prettier configuration to ensure code style consistency.

### Edge Cases
- **Files already using the helper:** The script will skip these to avoid duplicate imports or double-wrapping.
- **Dynamic Metadata:** Files using `export async function generateMetadata(...)` will be flagged and migrated manually if necessary, as they require dynamic route parameters.
- **Complex Objects:** If a metadata object contains more than just `title` and `description` (e.g., specific robots tags or canonical overrides), the script will preserve them by passing them into the `generateSeoMetadata` object argument (assuming the helper supports passing arbitrary overrides, which we will verify).

## Verification Plan
1. **Dry Run:** The script will first run in "dry-run" mode to output the list of files it intends to modify and the extracted titles/descriptions to ensure parsing is accurate.
2. **Execution:** The script will be executed to modify the files.
3. **Build Check:** We will run `npx tsc --noEmit` and `npm run build` to verify there are no missing imports, type errors, or Next.js metadata conflicts.
4. **Spot Check:** Manually review 3-4 transformed files to ensure formatting and syntax are correct.

## Transition to Implementation
Once this spec is approved, we will create the detailed step-by-step implementation plan tracking the creation of the script, its execution, and the cleanup.
