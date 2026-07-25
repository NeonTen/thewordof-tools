# Design Specification: ATS Score Checker Improved Resume Score & CV Builder Handoff

## Goal
Enhance the **ATS Score Checker** (`/tools/ai-tools/ats-score-checker`) so that when a user generates an **Improved Resume (ATS Optimized)**:
1. The system automatically re-evaluates the rewritten resume against the job description to calculate and display the new improved ATS score and score gain (boost).
2. Provides a Call-to-Action (CTA) banner that seamlessly transitions the user to the **AI CV Builder** (`/tools/ai-tools/cv-builder`), automatically popping up the "Import with AI" parser modal pre-filled with the improved resume content.

---

## Key Features & User Flow

### 1. Automatic ATS Score Re-Evaluation
- **Trigger**: Immediately after `handleFixResume` completes streaming the improved resume text (`fixedResume`), the client automatically calls `fetch("/api/ai/ats-score-checker")` passing `{ resumeText: fixedResume, jobDescription }`.
- **State**:
  - `improvedResult`: Stores `{ score: number, matchedKeywords: string[], missingKeywords: string[], feedback: string }`.
  - `scoreBoost`: Calculated as `improvedResult.score - originalResult.score`.
- **Credit Policy**: **0 additional credits**. The 2 credits already charged for "Improve Resume" cover both the AI rewrite and the auto score check.

### 2. UI Representation in "Improved Resume (ATS Optimized)" Card Header
- **Card Header Badges**:
  - Score badge: `94% ATS Match` (styled with green/amber badge based on score).
  - Score gain pill: `+36% Score Boost` (styled in green).
- **Matched / Missing Keywords Summary**:
  - Displays the updated matching keywords count (e.g., `18/20 Keywords Matched`).

### 3. CTA & Handoff to AI CV Builder
- **CTA Banner**: Displayed at the bottom of the "Improved Resume (ATS Optimized)" card.
  - Headline: *"Turn this ATS-Optimized Resume into a Professional CV"*
  - Subtitle: *"Import your updated text into our AI CV Builder to generate a beautifully styled PDF or Word resume."*
  - Button: **`Turn into Professional CV`** (`Sparkles` icon).
- **Seamless LocalStorage Handoff**:
  - On click, saves `fixedResume` into `localStorage.setItem("ats_import_text", fixedResume)`.
  - Navigates to `/tools/ai-tools/cv-builder`.
- **AI CV Builder Auto-Import**:
  - `CvBuilder` component detects `ats_import_text` on mount in `useEffect`.
  - Sets `initialText` prop for `AIParserModal`.
  - Opens `AIParserModal` with the text pre-filled into the textarea and cleans up `localStorage.removeItem("ats_import_text")`.

---

## Component Updates & Architecture

1. **`src/components/tools/ats-score-checker.tsx`**:
   - Add `improvedResult` state (`AtsResult | null`).
   - Trigger auto re-eval call in `handleFixResume` upon completion.
   - Render score badge, boost pill, and updated keyword counts in the card header.
   - Add CTA banner linking to `/tools/ai-tools/cv-builder` with click handler populating `localStorage`.

2. **`src/components/tools/ai-parser-modal.tsx`**:
   - Add optional `initialText?: string` prop to `AIParserModalProps`.
   - Initialize `text` state with `initialText || ""`.

3. **`src/components/tools/cv-builder.tsx`**:
   - In `useEffect` on mount, check `localStorage.getItem("ats_import_text")`.
   - If present, set `initialParserText` and set `showAIParserModal(true)`.

---

## Verification Plan

### Automated Tests
- Unit test for score difference calculation logic in `scratch/test-ats-improved-score.ts`.

### Manual Verification
1. Run `npm run dev`.
2. Navigate to `/tools/ai-tools/ats-score-checker`.
3. Paste job description and original resume. Click "Analyze ATS Match".
4. Click "Improve Resume to Boost Score (2 Credits)".
5. Observe the improved resume stream into view.
6. Verify that immediately upon completion, the "Improved Resume (ATS Optimized)" card updates with the new score badge (e.g. `94% ATS Match`) and score boost pill (e.g. `+36% Score Boost`).
7. Click "Turn into Professional CV" CTA.
8. Verify redirect to `/tools/ai-tools/cv-builder` and confirm that `AIParserModal` automatically opens with the improved resume text pre-filled into the text area.
