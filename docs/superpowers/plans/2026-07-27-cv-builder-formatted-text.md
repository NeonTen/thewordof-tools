# CV Builder Multi-Paragraph & Bullet Text Formatting Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform single-line wall-of-text blocks in CV Builder template previews & PDF prints into clean, readable bulleted lists (`<ul>` / `<ol>`) and multi-paragraph structures (`<p>`).

**Architecture:** Create a `FormattedCvText` helper component in `src/components/tools/cv-builder.tsx` that detects bullet points (`- `, `* `, `• `, `1. ` etc.) and line breaks (`\n`), replacing raw string rendering in `renderSummary`, `renderExperience`, `renderProjects`, and `renderEducation`. Add helper text to editor textareas.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4.

---

### Task 1: Create `FormattedCvText` Helper Component & Text Parsing Logic

**Files:**
- Modify: `src/components/tools/cv-builder.tsx:370-395`
- Test: `scratch/test-formatted-text-parser.ts`

- [ ] **Step 1: Write test script for bullet point and newline parsing logic**

```typescript
// scratch/test-formatted-text-parser.ts
import assert from "assert";

type ParsedContent = 
  | { type: "bullets"; items: string[] }
  | { type: "paragraphs"; items: string[] }
  | { type: "plain"; text: string };

function parseTextStructure(text: string): ParsedContent {
  if (!text || !text.trim()) return { type: "plain", text: "" };
  
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const bulletRegex = /^[-*•\d+.]\s+/;
  
  const hasBullets = lines.some(l => bulletRegex.test(l));
  
  if (hasBullets) {
    const items = lines.map(l => l.replace(bulletRegex, "").trim()).filter(Boolean);
    return { type: "bullets", items };
  }
  
  if (lines.length > 1) {
    return { type: "paragraphs", items: lines };
  }
  
  return { type: "plain", text: text.trim() };
}

// Test cases
assert.deepStrictEqual(
  parseTextStructure("- Developed React app\n- Scaled DB by 50%"),
  { type: "bullets", items: ["Developed React app", "Scaled DB by 50%"] }
);

assert.deepStrictEqual(
  parseTextStructure("First paragraph\nSecond paragraph"),
  { type: "paragraphs", items: ["First paragraph", "Second paragraph"] }
);

assert.deepStrictEqual(
  parseTextStructure("Single line text"),
  { type: "plain", text: "Single line text" }
);

console.log("✅ parseTextStructure verified!");
```

- [ ] **Step 2: Run test script to verify passes**

Run: `npx tsx scratch/test-formatted-text-parser.ts`
Expected: `✅ parseTextStructure verified!`

- [ ] **Step 3: Add `FormattedCvText` component to `src/components/tools/cv-builder.tsx`**

```tsx
function FormattedCvText({ 
  text, 
  style = {}, 
  templateId = 'modern'
}: { 
  text: string
  style?: React.CSSProperties
  templateId?: string
}) {
  if (!text || !text.trim()) return null

  if (templateId === 'tech') {
    return <p style={{ margin: 0, ...style }}>{`/* ${text} */`}</p>
  }

  const lines = text.split("\n").map(l => l.trim()).filter(Boolean)
  const bulletRegex = /^([-*•]|\d+[.)])\s+/

  const hasBullets = lines.some(l => bulletRegex.test(l))

  if (hasBullets) {
    return (
      <ul style={{ margin: '4px 0', paddingLeft: '18px', listStyleType: 'disc', ...style }}>
        {lines.map((line, idx) => {
          const cleanLine = line.replace(bulletRegex, "").trim()
          if (!cleanLine) return null
          return (
            <li key={idx} style={{ marginBottom: '3px', lineHeight: '1.5' }}>
              {cleanLine}
            </li>
          )
        })}
      </ul>
    )
  }

  if (lines.length > 1) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {lines.map((line, idx) => (
          <p key={idx} style={{ margin: 0, lineHeight: '1.6', ...style }}>
            {line}
          </p>
        ))}
      </div>
    )
  }

  return (
    <p style={{ margin: 0, lineHeight: '1.6', ...style }}>
      {text}
    </p>
  )
}
```

- [ ] **Step 4: Run ESLint to verify**

Run: `npx eslint src/components/tools/cv-builder.tsx`
Expected: 0 errors

- [ ] **Step 5: Commit**

```bash
git add src/components/tools/cv-builder.tsx scratch/test-formatted-text-parser.ts
git commit -m "feat: add FormattedCvText helper to parse bullets and paragraphs in CV Builder"
```

---

### Task 2: Integrate `FormattedCvText` in Template Renderers & Add Editor Helper Hints

**Files:**
- Modify: `src/components/tools/cv-builder.tsx:380-480,570-690`

- [ ] **Step 1: Update `renderSummary`, `renderExperience`, `renderProjects` in `cv-builder.tsx`**

In `renderSummary`:
```tsx
  const renderSummary = (accentColor = '#2563eb') => 
    renderSection("Summary", 
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
```

In `renderExperience`:
```tsx
  const renderExperience = (accentColor = '#2563eb') => 
    renderSection("Experience", 
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {experience.map(e => {
          if (templateId === 'tech') {
            return <div key={e.id} style={{ paddingLeft: '20px', color: '#334155', fontSize: '13px' }}><p style={{ margin: 0 }}>{`{ role: "${e.role}", company: "${e.company}", desc: "${e.desc}" },`}</p></div>
          }
          return (
            <div key={e.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>{e.role} {templateId === 'elegant' ? '|' : '@'} {e.company}</span>
                <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 'normal' }}>{e.period}</span>
              </div>
              <div style={{ marginTop: '4px' }}>
                <FormattedCvText 
                  text={e.desc} 
                  style={{ fontSize: '13px', color: '#4b5563' }} 
                />
              </div>
            </div>
          )
        })}
      </div>, 
      accentColor
    )
```

In `renderProjects`:
```tsx
  const renderProjects = (accentColor = '#2563eb') => 
    projects.length > 0 && renderSection("Projects", 
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {projects.map(p => {
          if (templateId === 'tech') {
            return <div key={p.id} style={{ paddingLeft: '20px', color: '#334155', fontSize: '13px' }}><p style={{ margin: 0 }}>{`{ title: "${p.title}", link: "${p.link}", desc: "${p.desc}" },`}</p></div>
          }
          return (
            <div key={p.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontWeight: '600', color: '#111827', margin: 0, fontSize: '14px' }}>{p.title}</h3>
                <span style={{ fontSize: '12px', color: accentColor }}>{p.link}</span>
              </div>
              <div style={{ marginTop: '4px' }}>
                <FormattedCvText 
                  text={p.desc} 
                  style={{ fontSize: '14px', color: '#374151' }} 
                />
              </div>
            </div>
          )
        })}
      </div>, 
      accentColor
    )
```

- [ ] **Step 2: Add helper text under Textareas in Editor Sidebar**

Under Summary textarea:
```tsx
<p className="text-[11px] text-muted-foreground mt-1">
  Tip: Start lines with &quot;-&quot; or &quot;&bull;&quot; to auto-format bullet lists, or use line breaks for paragraphs.
</p>
```

Under Experience & Project description textareas:
```tsx
<p className="text-[11px] text-muted-foreground mt-1">
  Tip: Start lines with &quot;-&quot; or &quot;&bull;&quot; to auto-format bullet lists.
</p>
```

- [ ] **Step 3: Run ESLint to verify**

Run: `npx eslint src/components/tools/cv-builder.tsx`
Expected: 0 errors

- [ ] **Step 4: Commit**

```bash
git add src/components/tools/cv-builder.tsx
git commit -m "feat: format summary, experience, and projects with FormattedCvText and add editor hints"
```

---

### Task 3: Production Build Verification & Cleanup

- [ ] **Step 1: Run production build**

Run: `npm run build`
Expected: Build completes cleanly with 0 errors.

- [ ] **Step 2: Remove test scratch file**

Run: `rm scratch/test-formatted-text-parser.ts`

- [ ] **Step 3: Commit final build state**

```bash
git commit --allow-empty -m "build: verify clean build for CV builder text formatting improvements"
```
