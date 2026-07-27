# AI CV Parser Custom Sections & Heading Extraction Integration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend AI Resume Parser API to extract summary headings (e.g. "Professional Summary") and custom content sections, displaying them in AIPreviewModal and mapping them to builder state on import.

**Architecture:** Update Zod schema & prompt in `/api/ai/cv-parser/route.ts`. Update `CVParserResult` in `ai-preview-modal.tsx` to display extracted custom sections. Update `handleApplyAIData` in `cv-builder.tsx` to set `headings.summary` and populate `customSections` state.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Vercel AI SDK (Gemini 2.5 Flash), Zod.

---

### Task 1: Update API Route Schema & Prompt for Summary Heading & Custom Sections

**Files:**
- Modify: `src/app/api/ai/cv-parser/route.ts:45-85`
- Test: `scratch/test-cv-parser-integration.ts`

- [ ] **Step 1: Write test script for parser response mapping**

```typescript
// scratch/test-cv-parser-integration.ts
import assert from "assert";

type CVParserResult = {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summaryHeading?: string;
  summary: string;
  skillsText: string;
  experience: Array<{ company: string; role: string; period: string; desc: string }>;
  education: Array<{ school: string; degree: string; period: string }>;
  projects: Array<{ title: string; link: string; desc: string }>;
  customSections?: Array<{ title: string; content: string }>;
};

const sampleParsedData: CVParserResult = {
  name: "Sajid Khan",
  title: "Senior Technical Lead",
  email: "sajid@example.com",
  phone: "+1 555 1234",
  location: "San Francisco, CA",
  summaryHeading: "Professional Summary",
  summary: "- 10+ years WordPress experience",
  skillsText: "WordPress, PHP, React",
  experience: [],
  education: [],
  projects: [],
  customSections: [
    { title: "Certifications", content: "- AWS Certified Architect" },
    { title: "Languages", content: "- English\n- Spanish" }
  ]
};

assert.strictEqual(sampleParsedData.summaryHeading, "Professional Summary");
assert.strictEqual(sampleParsedData.customSections?.length, 2);
assert.strictEqual(sampleParsedData.customSections[0].title, "Certifications");

console.log("✅ Parser integration schema test verified!");
```

- [ ] **Step 2: Run test script to verify passes**

Run: `npx tsx scratch/test-cv-parser-integration.ts`
Expected: `✅ Parser integration schema test verified!`

- [ ] **Step 3: Update `src/app/api/ai/cv-parser/route.ts`**

Update schema in `route.ts`:
```typescript
      schema: z.object({
        name: z.string(),
        title: z.string(),
        email: z.string(),
        phone: z.string(),
        location: z.string(),
        summaryHeading: z.string().describe("The exact summary section title used in text e.g. 'Professional Summary' or 'Summary'"),
        summary: z.string(),
        skillsText: z.string(),
        experience: z.array(
          z.object({
            company: z.string(),
            role: z.string(),
            period: z.string(),
            desc: z.string(),
          }),
        ),
        education: z.array(
          z.object({
            school: z.string(),
            degree: z.string(),
            period: z.string(),
          }),
        ),
        projects: z.array(
          z.object({
            title: z.string(),
            link: z.string(),
            desc: z.string(),
          }),
        ),
        customSections: z.array(
          z.object({
            title: z.string(),
            content: z.string(),
          }),
        ).describe("Additional custom content sections found after summary such as Certifications, Key Achievements, Languages, Publications, etc."),
      }),
```

Update prompt in `route.ts`:
```typescript
      prompt: `You are an expert CV Parser.
Extract professional info from this raw CV text, LinkedIn profile copy, or professional bio. 
Return empty strings or arrays for missing details.
Extract the exact summary section heading (e.g. "Professional Summary", "Executive Profile", or "Summary") into summaryHeading.
Ensure skillsText is a flat comma-separated list of extracted skills (e.g. "React, Next.js, TypeScript").
Identify any notable key projects (e.g., LearningMole, ProfileTree) and populate them in the projects array with title, link (if any), and desc.
Identify any extra custom content sections after summary (e.g., Certifications, Languages, Key Achievements, Awards, Volunteering, Publications) and populate them in customSections with title and content.
For experience[].desc, projects[].desc, customSections[].content, and summary, format multi-item achievements, responsibilities, or bullet points as separate lines starting with "- " separated by newlines \\n (e.g., "- Developed scalable APIs\\n- Managed team of 4"). NEVER concatenate bullet items onto a single line or join them with ".-".

Raw input text:
${text.substring(0, 30000)}
`,
```

- [ ] **Step 4: Run ESLint to verify syntax**

Run: `npx eslint src/app/api/ai/cv-parser/route.ts`
Expected: 0 errors

- [ ] **Step 5: Commit**

```bash
git add src/app/api/ai/cv-parser/route.ts scratch/test-cv-parser-integration.ts
git commit -m "feat: add summaryHeading and customSections extraction to AI CV Parser API"
```

---

### Task 2: Update Preview Modal & Builder State Mapping

**Files:**
- Modify: `src/components/tools/ai-preview-modal.tsx:6-30,120-180`
- Modify: `src/components/tools/cv-builder.tsx:110-180`

- [ ] **Step 1: Update `CVParserResult` type & render custom sections in `AIPreviewModal`**

In `src/components/tools/ai-preview-modal.tsx`:
```typescript
export type CVParserResult = {
  name: string
  title: string
  email: string
  phone: string
  location: string
  summaryHeading?: string
  summary: string
  skillsText: string
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
  projects: Array<{
    title: string
    link: string
    desc: string
  }>
  customSections?: Array<{
    title: string
    content: string
  }>
}
```

And in `AIPreviewModal` body preview:
```tsx
{data.customSections && data.customSections.length > 0 && (
  <div className="space-y-3">
    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Custom Sections ({data.customSections.length})</h4>
    <div className="space-y-2">
      {data.customSections.map((cs, i) => (
        <div key={i} className="p-3 rounded-xl bg-muted/20 border text-xs">
          <span className="font-bold block text-primary">{cs.title}</span>
          <p className="text-muted-foreground mt-1 whitespace-pre-line">{cs.content}</p>
        </div>
      ))}
    </div>
  </div>
)}
```

- [ ] **Step 2: Update `handleApplyAIData` in `src/components/tools/cv-builder.tsx`**

In `handleApplyAIData`:
```typescript
  const handleApplyAIData = (data: CVParserResult) => {
    setCv(prev => ({
      ...prev,
      name: data.name || prev.name,
      title: data.title || prev.title,
      email: data.email || prev.email,
      phone: data.phone || prev.phone,
      location: data.location || prev.location,
      summary: data.summary || prev.summary,
      skillsText: data.skillsText || prev.skillsText,
    }))

    if (data.summaryHeading) {
      setHeadings(prev => ({ ...prev, summary: data.summaryHeading }))
    }

    if (data.experience && data.experience.length > 0) {
      setExperience(data.experience.map((e, i) => ({
        id: Date.now() + i + Math.random(),
        company: e.company || "",
        role: e.role || "",
        period: e.period || "",
        desc: e.desc || "",
      })))
    }

    if (data.education && data.education.length > 0) {
      setEducation(data.education.map((e, i) => ({
        id: Date.now() + i + Math.random(),
        school: e.school || "",
        degree: e.degree || "",
        period: e.period || "",
      })))
    }

    if (data.projects && data.projects.length > 0) {
      setProjects(data.projects.map((p, i) => ({
        id: Date.now() + i + Math.random(),
        title: p.title || "",
        link: p.link || "",
        desc: p.desc || "",
      })))
    }

    if (data.customSections && data.customSections.length > 0) {
      setCustomSections(data.customSections.map((cs, i) => ({
        id: (Date.now() + i + Math.random()).toString(),
        title: cs.title || "Additional Section",
        content: cs.content || "",
      })))
    }
  }
```

- [ ] **Step 3: Run ESLint to verify syntax**

Run: `npx eslint src/components/tools/ai-preview-modal.tsx src/components/tools/cv-builder.tsx`
Expected: 0 errors

- [ ] **Step 4: Commit**

```bash
git add src/components/tools/ai-preview-modal.tsx src/components/tools/cv-builder.tsx
git commit -m "feat: map summaryHeading and customSections from AI Parser to CV Builder state"
```

---

### Task 3: Production Build Verification & Cleanup

- [ ] **Step 1: Run production build**

Run: `npm run build`
Expected: Build completes cleanly with 0 errors.

- [ ] **Step 2: Remove test scratch file**

Run: `rm scratch/test-cv-parser-integration.ts`

- [ ] **Step 3: Commit final build state**

```bash
git commit --allow-empty -m "build: verify clean production build for AI CV parser custom sections integration"
```
