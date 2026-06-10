# Design Spec: Broken Links Auditor and Keyword Density Fixes

We will implement:
1. **Broken Links Backend**: Dynamic scanning limits based on user role (PRO/BUSINESS/ADMIN get all links audited, free users get 30), concurrent batching in chunks of 10, realistic browser User-Agent headers, and robust HEAD/GET fallback checking to prevent false 404 status codes.
2. **Broken Links UI**: Standard client-side pagination with "Prev/Next" buttons, page size dropdown selector, and status counts.
3. **Keyword Density Matcher**: Universal tokenization for target keywords matching raw text cleaning, and a dynamic sliding window matching algorithm to support keywords of any length.

## Proposed Changes

### Broken Links Auditor

#### [MODIFY] [route.ts](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/app/api/tools/scan-links/route.ts)
- Import `auth` from `@/auth` and `prisma` from `@/lib/prisma`.
- Determine if the user is Pro. If Pro, check all links; if Free, limit to 30.
- Audit links in chunks of 10 to avoid socket resource depletion.
- Set a realistic browser User-Agent.
- Try `HEAD` first; fallback to `GET` for any non-2xx status or timeout.
- Mark timeout/error as status `0` (indicating connection error) instead of `404`.

#### [MODIFY] [broken-links.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/tools/broken-links.tsx)
- Add state variables: `currentPage: number = 1` and `pageSize: number | "all" = 10`.
- Reset `currentPage` to 1 when `filter` changes.
- Calculate paginated slice of `filteredLinks`.
- Add a footer to the inventory table with a page size dropdown (`10`, `25`, `50`, `100`, `All`), showing item offsets ("Showing X-Y of Z"), and page navigation buttons.

### Keyword Density Analyzer

#### [MODIFY] [keyword-density.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/tools/keyword-density.tsx)
- Refactor the keyword matching loop inside `targetsAnalysis`.
- Tokenize target keywords using `match(/[a-zA-Z0-9'-]+/g) || []` to match how the main text is parsed.
- Implement a sliding window matching algorithm that iterates through `parsedWords` and compares slices of length `parts.length`.

## Verification Plan

### Automated Verification
- Run typescript compilation (`npx tsc --noEmit`) to verify no type errors.

### Manual Verification
- Test broken links audit using standard websites.
- Verify target keywords count (e.g. adding hyphenated keywords or phrases of any length) returns exact occurrences.
