# Design Specification: AI CV Builder Full-Width Accordion Redesign & Live Preview Modal

## Goal
Redesign the AI CV Builder (`src/components/tools/cv-builder.tsx`) into a full-width workspace with a sticky top control toolbar, collapsible Accordion editor sections, and a live full-size CV preview modal overlay.

---

## Proposed Architectural Changes

### 1. Unified Sticky Top Control Toolbar
- Consolidate controls into a sticky top bar (`sticky top-16 z-30 bg-background/95 backdrop-blur border-b`):
  - **Template Selector**: Switch between all 10 templates.
  - **Photo Upload Selector**: Avatar button with preview & remove option.
  - **Skill Mode**: Text vs Bars toggle.
  - **Import with AI**: Opens AI Parser modal.
  - **Preview CV**: Eye icon button opening full-width live CV paper preview modal overlay.
  - **Cloud Save & Load**: Cloud storage operations for Pro users.
  - **Export PDF**: Primary action CTA.

### 2. Full-Width Collapsible Accordion Editor
- Main editor container expands to full width (`w-full max-w-5xl mx-auto`).
- Use `<Accordion type="multiple" defaultValue={["personal", "summary"]}>` for all editor sections:
  1. `personal`: Personal Details (Name, Title, Email, Phone, Location).
  2. `summary`: Summary (Editable Title, AI Write button, Textarea).
  3. `custom-sections`: Dynamic Pro custom content sections (Editable Title, Textarea, Delete).
  4. `skills`: Skills & Expertise (Editable Title, Mode toggle, Text/Bars inputs).
  5. `experience`: Experience (Editable Title, Add Role button, Experience items).
  6. `projects`: Projects (Editable Title, Add Project button, Project items).
  7. `education`: Education (Editable Title, Add Education button, Education items).
- Each Accordion Trigger features section icon, editable title input (with `onClick={(e) => e.stopPropagation()}`), item count badge, and expand indicator.

### 3. Live Full-Size CV Preview Modal Overlay
- Add `isPreviewOpen` state.
- When `isPreviewOpen` is true, render a modal overlay displaying the selected 210mm A4 paper CV template.
- Includes a top bar inside the modal with:
  - Template dropdown selector.
  - Close preview button.
  - "Export PDF" button.

---

## Verification Plan

### Automated Tests
- Create unit test `scratch/test-cv-builder-accordion-state.ts` to test accordion section toggling and state preservation.

### Manual Verification
1. Open `/tools/ai-tools/cv-builder`.
2. Verify top toolbar is sticky and contains template selector, photo upload, skill mode toggle, AI import, Preview CV button, cloud buttons, and Export PDF.
3. Verify editor panel is full width with collapsible accordion cards for Personal Details, Summary, Custom Sections, Skills, Experience, Projects, Education.
4. Expand and collapse individual accordion sections.
5. Click **"Preview CV"** and verify live full-size A4 paper template preview modal opens with template selector and PDF export button.
6. Verify clean build with `npm run build`.
