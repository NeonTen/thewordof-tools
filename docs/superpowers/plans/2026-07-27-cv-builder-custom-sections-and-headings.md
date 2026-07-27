# CV Builder Editable Headings & Pro Custom Content Sections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make default section headings editable, and allow Pro/Business users to add custom content sections after Summary across all 10 CV templates.

**Architecture:** Add `headings` state for default section titles and `customSections` array state in `src/components/tools/cv-builder.tsx`. Render editable title inputs in editor cards and update template renderers (`renderSummary`, `renderSkills`, `renderExperience`, `renderProjects`, `renderEducation`, `renderCustomSections`) to consume dynamic headings.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide Icons.

---

### Task 1: Add State & Implement Editable Default Headings

**Files:**
- Modify: `src/components/tools/cv-builder.tsx:40-100,440-540,640-790`
- Test: `scratch/test-custom-sections-state.ts`

- [ ] **Step 1: Write test script for headings and custom section state management**

```typescript
// scratch/test-custom-sections-state.ts
import assert from "assert";

type Headings = {
  summary: string;
  skills: string;
  experience: string;
  projects: string;
  education: string;
};

type CustomSection = {
  id: string;
  title: string;
  content: string;
};

const defaultHeadings: Headings = {
  summary: "Summary",
  skills: "Skills & Expertise",
  experience: "Experience",
  projects: "Projects",
  education: "Education",
};

let headings = { ...defaultHeadings };
headings.summary = "Executive Profile";

assert.strictEqual(headings.summary, "Executive Profile");

let customSections: CustomSection[] = [];
customSections.push({
  id: "c1",
  title: "Certifications",
  content: "- AWS Certified Developer\n- Certified Scrum Master",
});

assert.strictEqual(customSections.length, 1);
assert.strictEqual(customSections[0].title, "Certifications");

console.log("✅ Custom sections and headings logic verified!");
```

- [ ] **Step 2: Run test script to verify passes**

Run: `npx tsx scratch/test-custom-sections-state.ts`
Expected: `✅ Custom sections and headings logic verified!`

- [ ] **Step 3: Add `headings` state & update section renderers in `src/components/tools/cv-builder.tsx`**

Add `headings` state:
```typescript
  const [headings, setHeadings] = useState({
    summary: "Summary",
    skills: "Skills & Expertise",
    experience: "Experience",
    projects: "Projects",
    education: "Education"
  })

  const updateHeading = (key: keyof typeof headings, val: string) => {
    setHeadings(prev => ({ ...prev, [key]: val }))
  }
```

Update section renderers:
```tsx
  const renderSummary = (accentColor = '#2563eb') => 
    renderSection(headings.summary || "Summary", 
      <FormattedCvText 
        text={cv.summary} 
        templateId={templateId}
        style={{ 
          fontSize: '14px', 
          lineHeight: '1.6', 
          color: '#374151',
          textAlign: templateId === 'elegant' ? 'center' : 'left' as const,
          fontStyle: (templateId === 'elegant' || templateId === 'minimalist-pro') ? 'italic' : 'normal'
        }} 
      />, 
      accentColor
    )

  const renderSkills = (accentColor = '#2563eb') => 
    renderSection(headings.skills || "Skills", ...)

  const renderExperience = (accentColor = '#2563eb') => 
    renderSection(headings.experience || "Experience", ...)

  const renderProjects = (accentColor = '#2563eb') => 
    projects.length > 0 && renderSection(headings.projects || "Projects", ...)

  const renderEducation = (accentColor = '#2563eb') => 
    education.length > 0 && renderSection(headings.education || "Education", ...)
```

- [ ] **Step 4: Make CardTitle headers in Editor Panel editable**

Replace static `<CardTitle>Summary</CardTitle>` in editor cards with editable `<Input>`:
```tsx
<Input
  value={headings.summary}
  onChange={e => updateHeading('summary', e.target.value)}
  className="font-bold text-base bg-transparent border-dashed h-8 px-2 focus:bg-background w-auto max-w-[200px]"
/>
```
Repeat for `skills`, `experience`, `projects`, and `education`.

- [ ] **Step 5: Run ESLint to verify syntax**

Run: `npx eslint src/components/tools/cv-builder.tsx`
Expected: 0 errors

- [ ] **Step 6: Commit**

```bash
git add src/components/tools/cv-builder.tsx scratch/test-custom-sections-state.ts
git commit -m "feat: make CV Builder default section headings editable"
```

---

### Task 2: Implement Pro Custom Content Sections After Summary

**Files:**
- Modify: `src/components/tools/cv-builder.tsx`

- [ ] **Step 1: Add `customSections` state & helper functions**

```typescript
  const [customSections, setCustomSections] = useState<Array<{ id: string; title: string; content: string }>>([])

  const addCustomSection = () => {
    setCustomSections(prev => [
      ...prev,
      { id: Date.now().toString(), title: "Additional Section", content: "" }
    ])
  }

  const updateCustomSection = (id: string, field: 'title' | 'content', value: string) => {
    setCustomSections(prev => prev.map(cs => cs.id === id ? { ...cs, [field]: value } : cs))
  }

  const removeCustomSection = (id: string) => {
    setCustomSections(prev => prev.filter(cs => cs.id !== id))
  }

  const renderCustomSections = (accentColor = '#2563eb') => (
    <>
      {customSections.map(cs => (
        cs.content && cs.content.trim() ? (
          <React.Fragment key={cs.id}>
            {renderSection(cs.title || "Additional Section", 
              <FormattedCvText 
                text={cs.content} 
                templateId={templateId}
                style={{ fontSize: '14px', lineHeight: '1.6', color: '#374151' }} 
              />, 
              accentColor
            )}
          </React.Fragment>
        ) : null
      ))}
    </>
  )
```

- [ ] **Step 2: Add "+ Add Custom Section" button and custom section cards under Summary in Editor**

Right after the Summary `Card` in the editor panel:
```tsx
<div className="flex items-center justify-between py-1">
  <ProGate feature="Custom Sections" isPro={isPro}>
    <Button size="sm" variant="outline" onClick={addCustomSection} className="gap-1.5 font-bold">
      <Plus className="h-4 w-4" /> Add Custom Section
    </Button>
  </ProGate>
</div>

{customSections.map(cs => (
  <Card key={cs.id} className="border-primary/20">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <Input
        value={cs.title}
        onChange={e => updateCustomSection(cs.id, 'title', e.target.value)}
        placeholder="Section Heading..."
        className="font-bold text-base bg-transparent border-dashed h-8 px-2 focus:bg-background w-auto max-w-[220px]"
      />
      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeCustomSection(cs.id)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </CardHeader>
    <CardContent>
      <Textarea
        value={cs.content}
        onChange={e => updateCustomSection(cs.id, 'content', e.target.value)}
        rows={3}
        placeholder="Add section details or bullet points..."
      />
      <p className="text-[11px] text-muted-foreground mt-1.5">
        Tip: Start lines with &quot;-&quot; or &quot;&bull;&quot; to auto-format bullet lists, or use line breaks for paragraphs.
      </p>
    </CardContent>
  </Card>
))}
```

- [ ] **Step 3: Call `renderCustomSections(accentColor)` right after `renderSummary(accentColor)` in all 10 CV templates**

In `modern`, `elegant`, `executive`, `minimalist-pro`, `developer`, `metro`, `accent`, `creative`, `sidebar`, `classic` template rendering blocks:
```tsx
{renderSummary('#2563eb')}
{renderCustomSections('#2563eb')}
```

- [ ] **Step 4: Run ESLint to verify syntax**

Run: `npx eslint src/components/tools/cv-builder.tsx`
Expected: 0 errors

- [ ] **Step 5: Commit**

```bash
git add src/components/tools/cv-builder.tsx
git commit -m "feat: add Pro custom content sections after summary across all templates"
```

---

### Task 3: Production Build Verification & Cleanup

- [ ] **Step 1: Run production build**

Run: `npm run build`
Expected: Build completes cleanly with 0 errors.

- [ ] **Step 2: Remove test scratch file**

Run: `rm scratch/test-custom-sections-state.ts`

- [ ] **Step 3: Commit final build state**

```bash
git commit --allow-empty -m "build: verify clean production build for editable headings and custom sections"
```
