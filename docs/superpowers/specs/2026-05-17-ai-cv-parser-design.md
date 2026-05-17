# Global AI CV Parser — Design Spec

**Date:** 2026-05-17  
**Feature:** Global AI CV Parser (Copy-Paste Text Import)  
**Status:** Approved  

---

## Overview

Allow Business-tier users to instantly build their resume by pasting text from an existing CV, LinkedIn profile, or professional bio. The pasted text is sent directly to the Gemini AI parser, which extracts and structures personal details, summaries, work histories, educational background, and skills. The user reviews the extracted data in a premium preview modal before applying it directly to the CV Builder.

---

## Decisions Made

| Question | Decision |
|---|---|
| Import mechanism | Copy-paste plain text from any CV/profile → server-side Gemini AI extraction |
| Gate tier | Business only (exclusive premium feature) |
| UI flow | "Import with AI" CTA → Paste Modal → Structured Review Modal → Confirm & Apply |
| Scraping removal | Completely remove previous fragile LinkedIn scraping logic to avoid HTTP 999/404 rate-limiting and blocks |

---

## Architecture

### New API Route

**`POST /api/ai/cv-parser`**

- Accepts `{ text: string }` in the request body
- Validates that text is not empty or too short (minimum 100 characters)
- Sends the text to Gemini with a structured extraction prompt to identify:
  - Name, current title, location, and professional summary
  - List of past work experience (Company, Role, Period, Description)
  - List of education history (School, Degree, Period)
  - Flattened list of skills
- Returns the parsed object or `{ error: ErrorCode }` on failure
- Protected: requires `BUSINESS` or `ADMIN` role checked server-side via `auth()`

### UI Components

**`AIParserModal`** (`src/components/tools/ai-parser-modal.tsx`)

- Repurposed from `LinkedInImportModal`
- Spacious dark textarea with premium micro-copy encouraging pasting of any CV text, portfolio, or bio
- Loading state: smooth looping AI animation ("AI is structuring your resume...")
- Handles errors: e.g. text too short, or parser failures

**`AIPreviewModal`** (`src/components/tools/ai-preview-modal.tsx`)

- Repurposed from `LinkedInPreviewModal`
- Renders parsed CV elements in neat collapsible categories with high-fidelity review checklist indicators
- "Apply to CV" calls the parent state update mapping function and closes the modal

### File Changes

1.  **Delete:** `src/app/api/ai/linkedin-import/route.ts` (scraping no longer needed)
2.  **Delete:** `src/components/tools/linkedin-import-modal.tsx`
3.  **Delete:** `src/components/tools/linkedin-preview-modal.tsx`
4.  **Create:** `src/app/api/ai/cv-parser/route.ts`
5.  **Create:** `src/components/tools/ai-parser-modal.tsx`
6.  **Create:** `src/components/tools/ai-preview-modal.tsx`
7.  **Modify:** `src/components/tools/cv-builder.tsx`
    - Change button label to "✨ Import with AI"
    - Open `AIParserModal` instead of `LinkedInImportModal`
8.  **Modify:** `src/app/pricing/page.tsx`
    - Change text row from "LinkedIn Profile Import" to "✨ Global AI CV Parser"

---

## Data Contracts

### Parsed Result Shape

```typescript
type CVParserResult = {
  name: string
  title: string
  location: string
  summary: string
  skillsText: string          // Comma-separated list of skills
  experience: Array<{
    company: string
    role: string
    period: string
    desc: string
  }>
  education: Array<{
    school: string
    degree: string
    period: string
  }>
}
```

---

## Pricing Matrix

| Feature | Free | Pro | Business |
|---|---|---|---|
| Global AI CV Parser | — | — | ✓ One-click copy-paste import |

---

## Testing Plan

1.  **Manual smoke test:** Paste a plain text CV bio and verify that Gemini structures the name, experiences, and skills cleanly.
2.  **Lint check:** Ensure new imports and component states are fully clean.
3.  **Compilation verification:** Run `npm run build` to confirm zero static rendering or TS compiling issues.
