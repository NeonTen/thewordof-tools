# Design Specification: AI CV Parser Custom Sections & Heading Extraction Integration

## Goal
Enhance the AI Resume Parser (`/api/ai/cv-parser`) to extract custom summary section headings (e.g. "Professional Summary") and capture extra content sections (e.g. "Certifications", "Languages", "Key Achievements") into structured `customSections`, mapping them directly into the CV Builder editor state and templates upon import.

---

## Proposed Changes

### 1. API Route Schema & Prompt Update
- **File**: `src/app/api/ai/cv-parser/route.ts`
- Update schema:
  ```typescript
  summaryHeading: z.string(),
  customSections: z.array(
    z.object({
      title: z.string(),
      content: z.string(),
    })
  ),
  ```
- Update system prompt to instruct Gemini to extract exact summary headings (e.g., "Professional Summary") and parse any extra sections after Summary (e.g. Certifications, Languages, Key Achievements) into `customSections`.

### 2. Preview Modal Integration
- **Files**: `src/components/tools/ai-preview-modal.tsx`, `src/components/tools/ai-parser-modal.tsx`
- Update `CVParserResult` type to include:
  - `summaryHeading?: string`
  - `customSections?: Array<{ title: string; content: string }>`
- Render extracted custom sections in `AIPreviewModal` for user verification before importing.

### 3. Builder State Mapping
- **File**: `src/components/tools/cv-builder.tsx`
- In `handleApplyAIData(data)`:
  - Update `headings.summary` if `data.summaryHeading` is present.
  - Map `data.customSections` to `customSections` state with generated unique IDs.

---

## Verification Plan

### Automated Tests
- Create unit test `scratch/test-cv-parser-integration.ts` to test parser response structure mapping to builder state.

### Manual Verification
1. Open `/tools/ai-tools/cv-builder`.
2. Click **Import with AI**.
3. Paste raw text with "Professional Summary" and extra sections "Certifications" and "Key Achievements".
4. Click **Parse & Import**.
5. Verify `AIPreviewModal` shows "Professional Summary" and the extra custom sections.
6. Click **Apply Data** and verify:
   - Summary card heading updates to "Professional Summary".
   - "Certifications" and "Key Achievements" cards appear in the editor panel under Summary.
   - All custom sections appear in the 10 CV templates and PDF export.
