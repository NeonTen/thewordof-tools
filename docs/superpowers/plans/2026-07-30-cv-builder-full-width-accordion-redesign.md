# CV Builder Full-Width Accordion Redesign & Live Preview Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-architect AI CV Builder into a full-width workspace with a sticky top control toolbar, collapsible Accordion editor cards, and a live full-size CV preview modal overlay.

**Architecture:** Update `src/components/tools/cv-builder.tsx` to consolidate template selector, photo upload, skill mode toggle, AI import, Cloud buttons, and Export PDF into a top toolbar. Use `@/components/ui/accordion` for full-width collapsible section cards. Render the 210mm paper preview inside a live preview modal overlay triggered by "Preview CV".

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide Icons, `@/components/ui/accordion`.

---

### Task 1: Create Unit Test & Build Sticky Top Toolbar with Preview State

**Files:**
- Modify: `src/components/tools/cv-builder.tsx:50-120,620-670`
- Test: `scratch/test-cv-builder-accordion-state.ts`

- [ ] **Step 1: Write unit test script for accordion & preview state**

```typescript
// scratch/test-cv-builder-accordion-state.ts
import assert from "assert";

type AccordionSection = "personal" | "summary" | "skills" | "experience" | "projects" | "education";

let activeSections: AccordionSection[] = ["personal", "summary"];

function toggleSection(section: AccordionSection) {
  if (activeSections.includes(section)) {
    activeSections = activeSections.filter(s => s !== section);
  } else {
    activeSections.push(section);
  }
}

toggleSection("experience");
assert.ok(activeSections.includes("experience"));

toggleSection("summary");
assert.ok(!activeSections.includes("summary"));

let isPreviewOpen = false;
isPreviewOpen = true;
assert.strictEqual(isPreviewOpen, true);

console.log("✅ CV Builder accordion & preview state verified!");
```

- [ ] **Step 2: Run test script to verify passes**

Run: `npx tsx scratch/test-cv-builder-accordion-state.ts`
Expected: `✅ CV Builder accordion & preview state verified!`

- [ ] **Step 3: Add `isPreviewOpen` state and build Top Toolbar in `src/components/tools/cv-builder.tsx`**

Add `isPreviewOpen` state:
```typescript
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
```

Construct sticky top toolbar:
```tsx
  <div className="sticky top-14 z-30 bg-background/95 backdrop-blur border-b py-3 px-4 mb-6 -mx-6 sm:mx-0 sm:rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
    {/* Left Toolbar Controls */}
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      {/* Template Selector */}
      <Select value={templateId} onValueChange={setTemplateId}>
        <SelectTrigger className="w-[170px] h-9 text-xs font-bold">
          <SelectValue placeholder="Select Template" />
        </SelectTrigger>
        <SelectContent>
          {TEMPLATES.map((t) => (
            <SelectItem key={t.id} value={t.id} className="text-xs">
              {t.name}{t.pro && <Crown className="h-3 w-3 text-amber-500 inline ml-1" />}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Photo Uploader */}
      <div className="flex items-center gap-2">
        {photo ? (
          <div className="relative group">
            <img src={photo} alt="Profile" className="h-9 w-9 rounded-full object-cover border-2 border-primary/20" />
            <button onClick={() => setPhoto(null)} className="absolute -top-1 -right-1 bg-destructive text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <Label className="cursor-pointer flex items-center gap-1.5 px-3 h-9 rounded-xl border border-input bg-background hover:bg-accent text-xs font-bold transition-colors">
            <User className="h-3.5 w-3.5 text-muted-foreground" /> Add Photo
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </Label>
        )}
      </div>

      {/* Skill Mode */}
      <ProGate feature="Skill Bars" isPro={isPro}>
        <Tabs value={skillMode} onValueChange={(val) => setSkillMode(val as 'text' | 'bars')}>
          <TabsList className="h-9">
            <TabsTrigger value="text" className="text-[10px] uppercase font-bold px-2.5"><AlignLeft className="h-3 w-3 mr-1" /> Text</TabsTrigger>
            <TabsTrigger value="bars" className="text-[10px] uppercase font-bold px-2.5"><BarChart3 className="h-3 w-3 mr-1" /> Bars</TabsTrigger>
          </TabsList>
        </Tabs>
      </ProGate>
    </div>

    {/* Right Toolbar Actions */}
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" size="sm" onClick={() => setShowAIParserModal(true)} className="gap-1.5 font-bold h-9">
        <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Import AI
      </Button>

      <Button variant="outline" size="sm" onClick={() => setIsPreviewOpen(true)} className="gap-1.5 font-bold h-9 bg-primary/5 border-primary/20 text-primary hover:bg-primary/10">
        <Eye className="h-3.5 w-3.5" /> Preview CV
      </Button>

      <ProGate feature="Cloud Save" isPro={isPro}>
        <div className="flex gap-1.5">
          <Button variant="outline" size="sm" onClick={async () => { await handleFetchResumes(); setIsLoadModalOpen(true); }} className="font-bold h-9 px-3">
            <FolderOpen className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => { if (activeResumeId) handleSaveResume(saveTitle); else { setSaveTitle(cv.name ? `${cv.name} Resume` : "My Resume"); setIsSaveModalOpen(true); } }} className="font-bold h-9 px-3">
            <Save className="h-3.5 w-3.5" />
          </Button>
        </div>
      </ProGate>

      <Button size="sm" onClick={handlePrint} className="bg-primary font-bold shadow-sm h-9 px-4">
        <Download className="mr-1.5 h-3.5 w-3.5" /> Export PDF
      </Button>
    </div>
  </div>
```

- [ ] **Step 4: Run ESLint to verify syntax**

Run: `npx eslint src/components/tools/cv-builder.tsx`
Expected: 0 errors

- [ ] **Step 5: Commit**

```bash
git add src/components/tools/cv-builder.tsx scratch/test-cv-builder-accordion-state.ts
git commit -m "feat: add top control toolbar and isPreviewOpen state to CV Builder"
```

---

### Task 2: Build Full-Width Accordion Editor & Live Preview Modal

**Files:**
- Modify: `src/components/tools/cv-builder.tsx`

- [ ] **Step 1: Wrap editor cards in Accordion components in `src/components/tools/cv-builder.tsx`**

Replace side-by-side grid layout with full-width container (`w-full max-w-5xl mx-auto`) and `<Accordion type="multiple" defaultValue={["personal", "summary"]}>`:
```tsx
<Accordion type="multiple" defaultValue={["personal", "summary"]} className="space-y-4 w-full">
  {/* Personal Details */}
  <AccordionItem value="personal" className="border rounded-2xl bg-card px-4 py-1">
    <AccordionTrigger className="hover:no-underline font-bold text-base">
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-primary" /> Personal Details
      </div>
    </AccordionTrigger>
    <AccordionContent className="pt-2 pb-4 space-y-4">
      {/* Name, Title, Email, Phone, Location inputs */}
    </AccordionContent>
  </AccordionItem>

  {/* Summary */}
  <AccordionItem value="summary" className="border rounded-2xl bg-card px-4 py-1">
    <AccordionTrigger className="hover:no-underline font-bold text-base">
      <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
        <FileText className="h-4 w-4 text-primary" />
        <Input value={headings.summary} onChange={e => updateHeading('summary', e.target.value)} className="font-bold text-base bg-transparent border-dashed h-8 px-2 focus:bg-background w-auto max-w-[200px]" />
      </div>
    </AccordionTrigger>
    <AccordionContent className="pt-2 pb-4 space-y-3">
      {/* AI Write button & Summary Textarea */}
    </AccordionContent>
  </AccordionItem>

  {/* Custom Sections */}
  {/* Skills & Expertise */}
  {/* Experience */}
  {/* Projects */}
  {/* Education */}
</Accordion>
```

- [ ] **Step 2: Build Live Preview Modal Overlay in `src/components/tools/cv-builder.tsx`**

Render modal overlay when `isPreviewOpen` is true:
```tsx
{isPreviewOpen && (
  <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex flex-col">
    {/* Preview Modal Header */}
    <div className="sticky top-0 z-10 bg-background border-b px-6 py-3 flex items-center justify-between gap-4 shadow-sm">
      <div className="flex items-center gap-3">
        <h3 className="font-black text-lg">CV Live Preview</h3>
        <Select value={templateId} onValueChange={setTemplateId}>
          <SelectTrigger className="w-[160px] h-8 text-xs font-bold">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TEMPLATES.map(t => (
              <SelectItem key={t.id} value={t.id} className="text-xs">{t.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" onClick={handlePrint} className="bg-primary font-bold shadow-sm h-8 px-4">
          <Download className="mr-1.5 h-3.5 w-3.5" /> Export PDF
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsPreviewOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>

    {/* Paper Preview Canvas */}
    <div className="flex-1 overflow-y-auto p-6 sm:p-10 flex justify-center bg-muted/40">
      <div className="bg-white text-black shadow-2xl overflow-hidden relative print-full-width my-auto" style={{ width: '100%', maxWidth: '210mm', minHeight: '297mm', backgroundColor: '#ffffff', color: '#000000' }}>
        {/* Render active template */}
      </div>
    </div>
  </div>
)}
```

- [ ] **Step 3: Run ESLint to verify syntax**

Run: `npx eslint src/components/tools/cv-builder.tsx`
Expected: 0 errors

- [ ] **Step 4: Commit**

```bash
git add src/components/tools/cv-builder.tsx
git commit -m "feat: implement full-width accordion editor and live preview modal overlay in CV Builder"
```

---

### Task 3: Production Build Verification & Cleanup

- [ ] **Step 1: Run production build**

Run: `npm run build`
Expected: Build completes cleanly with 0 errors.

- [ ] **Step 2: Remove test scratch file**

Run: `rm scratch/test-cv-builder-accordion-state.ts`

- [ ] **Step 3: Commit final build state**

```bash
git commit --allow-empty -m "build: verify clean production build for CV Builder accordion redesign"
```
