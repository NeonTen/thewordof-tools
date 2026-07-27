# Design Specification: Editable Section Headings & Pro Custom Content Sections in AI CV Builder

## Goal
Allow users to edit default section headings (Summary, Experience, Skills, Projects, Education) and enable Pro/Business users to add dynamic custom content sections with headings directly after Summary across all 10 CV templates and PDF exports.

---

## Proposed Changes

### 1. Editable Default Headings
- **File**: `src/components/tools/cv-builder.tsx`
- Add state:
  ```typescript
  const [headings, setHeadings] = useState({
    summary: "Summary",
    skills: "Skills & Expertise",
    experience: "Experience",
    projects: "Projects",
    education: "Education",
  });
  ```
- Replace static `<CardTitle>Summary</CardTitle>` etc. in the editor panel with editable inputs.
- Update template renderers `renderSummary`, `renderSkills`, `renderExperience`, `renderProjects`, `renderEducation` to pass dynamic `headings[key]` to `renderSection`.

### 2. Pro/Business Custom Content Sections
- **File**: `src/components/tools/cv-builder.tsx`
- Add state:
  ```typescript
  const [customSections, setCustomSections] = useState<Array<{ id: string; title: string; content: string }>>([]);
  ```
- Add **"+ Add Custom Section"** button under the Summary card in the editor panel, wrapped in `<ProGate feature="Custom Sections" isPro={isPro}>`.
- Render a card for each custom section in `customSections` with:
  - Editable section title input.
  - Content `Textarea` with `FormattedCvText` formatting guidance.
  - Delete button.
- Render custom sections in all 10 CV templates directly after Summary using `renderSection(cs.title, <FormattedCvText text={cs.content} />, accentColor)`.

---

## Verification Plan

### Automated Tests
- Create unit test `scratch/test-custom-sections-state.ts` to test adding, editing heading/content, and removing custom sections.

### Manual Verification
1. Open `/tools/ai-tools/cv-builder`.
2. Edit "Summary" heading to "Executive Summary" and verify it updates in the preview across all templates.
3. Click "+ Add Custom Section" under Summary, enter title "Certifications" and text "- AWS Certified Solutions Architect".
4. Verify "Certifications" section appears right after Summary in all 10 template previews and in exported PDFs.
