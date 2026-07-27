# Design Specification: AI CV Auto-Formatting Bullets & Credit Balance Display

## Goal
Automatically format extracted CV experience, project, and summary descriptions into clean `- ` bulleted lines during **Import with AI** parsing, and display the tool's credit cost (`Costs 3 credits (X remaining)`) in the AI Import Parser modal.

---

## Proposed Changes

### 1. AI Auto-Formatting Bullet Points
- **File**: `src/app/api/ai/cv-parser/route.ts`
- Update prompt instructions for `gemini-2.5-flash`:
  - Instruct the AI to format extracted achievements, responsibilities, and key details for `experience[].desc`, `projects[].desc`, and `summary` as lines starting with `- `.

### 2. Credit Balance & Cost Display
- **File**: `src/app/tools/ai-tools/cv-builder/page.tsx`
  - Query `creditsRemaining` from Prisma for the logged-in user and pass `creditsRemaining` to `<CvBuilder />`.
- **Files**: `src/components/tools/cv-builder.tsx`, `src/components/tools/ai-parser-modal.tsx`, `src/components/tools/ai-preview-modal.tsx`
  - Receive `creditsRemaining` in `CvBuilder` and pass to `AIParserModal`.
  - Maintain `localCredits` state initialized from `creditsRemaining`.
  - Under the action buttons at the bottom of `AIParserModal` (and `AIPreviewModal`), render:
    `<p className="text-[11px] text-muted-foreground text-center font-medium mt-2">Costs 3 credits ({localCredits ?? 0} remaining)</p>`
  - Subtract 3 from `localCredits` upon successful parse.

---

## Verification Plan

### Automated Tests
- Create unit test `scratch/test-cv-parser-prompt.ts` to verify prompt string format and schema validity.

### Manual Verification
1. Open `/tools/ai-tools/cv-builder`.
2. Click **Import with AI**.
3. Verify modal shows `Costs 3 credits (X remaining)` under the buttons.
4. Paste unformatted CV text and click **Parse & Import**.
5. Verify experience & project descriptions are returned with `- ` bullet points and render as clean bulleted list items in the CV template.
