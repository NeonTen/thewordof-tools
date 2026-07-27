# Design Specification: Multi-Paragraph & Bullet List Text Formatting in AI CV Builder

## Goal
Improve the visual readability of Summary, Experience descriptions, and Project descriptions in the **AI CV Builder** (`/tools/ai-tools/cv-builder`) by replacing wall-of-text rendering with smart auto-detection for bullet lists (`<ul>` / `<ol>`) and multi-paragraph blocks (`<p>`).

---

## Proposed Changes

### 1. Smart Formatting Component (`FormattedCvText`)
Create a helper component in `src/components/tools/cv-builder.tsx`:
- **Inputs**: `text` (string), `fontSize` (optional), `color` (optional), `lineHeight` (optional), `fontStyle` (optional), `textAlign` (optional).
- **Logic**:
  1. If `text` contains lines starting with bullet markers (`- `, `* `, `• `, `1. `, `2. ` etc.):
     - Extracts list items.
     - Renders them inside an HTML `<ul>` / `<ol>` element with clean list styling (`listStyleType: 'disc'`, `paddingLeft: '18px'`, `margin: '4px 0'`).
  2. Else if `text` contains newlines (`\n`):
     - Splits text on newlines.
     - Renders each non-empty line as a distinct `<p>` paragraph with vertical margin (`margin: '0 0 6px 0'`).
  3. Else:
     - Renders standard single `<p>` paragraph.

### 2. Integration Across CV Templates
Replace raw text renders `{cv.summary}`, `{e.desc}`, and `{p.desc}` across all CV section renderers (`renderSummary`, `renderExperience`, `renderProjects`) with `<FormattedCvText text={...} />`.

### 3. Editor Guidance Helper
In the form editor sidebar (`src/components/tools/cv-builder.tsx`), add subtle helper text under Summary, Experience description, and Project description textareas:
- `"Tip: Use line breaks or start lines with '-' or '•' to auto-format bullet lists in your exported CV."`

---

## Verification Plan

### Automated Tests
- Create a unit test script `scratch/test-formatted-text-parser.ts` to test bullet line extraction and paragraph splitting functions.

### Manual Verification
1. Run `npm run dev`.
2. Open `/tools/ai-tools/cv-builder`.
3. Enter multi-line summary and experience text with `-` bullets.
4. Verify web preview renders clean bullet lists and paragraphs.
5. Click **Export / Print PDF** and verify the generated PDF output displays formatted bullet lists and distinct paragraphs.
