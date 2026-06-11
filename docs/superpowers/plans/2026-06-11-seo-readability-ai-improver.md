# SEO Readability AI Improver Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a paid (2 AI credits) "Auto-Simplify with AI" feature to the SEO Readability Grader with a side-by-side diff preview, supporting Markdown styling preservation and downloads in `.md` and `.rtf` (macOS Pages-compatible) format, hiding raw markdown syntax from the editor and diff modal.

**Architecture:** Create an API route `/api/ai/improve-readability` using `@ai-sdk/google` (`gemini-2.5-flash`) that verifies and deducts 2 credits. On the client side, write a simple sentence-level diffing utility to highlight additions/deletions, render a comparative preview modal (stripping raw markdown tags for visibility), and support exports via Markdown-to-RTF conversion.

**Tech Stack:** Next.js, React, Tailwind CSS, Lucide icons, `@ai-sdk/google`, Prisma.

---

### Task 1: API Endpoint Creation [COMPLETED]

---

### Task 2: Diff Utility [COMPLETED]

---

### Task 3: UI Integration & Comparison Modal [COMPLETED]

---

### Task 4: AI Prompt Update for Markdown Preservation [COMPLETED]

---

### Task 5: RTF Exporter, Markdown Stripping, and UI Update

**Files:**
- Modify: `src/components/tools/readability-grader.tsx`

- [ ] **Step 1: Implement download helpers, stripMarkdown, and UI updates inside readability-grader.tsx**
Add functions for markdown-to-RTF conversion and file generation, strip markdown tags inside the preview modal and main editor, and show the Download Markdown / RTF buttons under the Score Card.

Add this helper:
```typescript
function stripMarkdown(md: string): string {
  return md
    .replace(/^#+\s+/gm, '') // headings
    .replace(/^\s*[-*]\s+/gm, '') // lists
    .replace(/\*\*/g, '') // bold
}
```

Replace `downloadDocx` with `downloadRtf`:
```typescript
  const downloadRtf = () => {
    const sourceText = formattedText || text
    if (!sourceText.trim()) return

    // Basic Markdown to RTF converter
    let rtfContent = sourceText
      // Escape RTF special characters first
      .replace(/\\/g, '\\\\')
      .replace(/{/g, '\\{')
      .replace(/}/g, '\\}')
      // Headings
      .replace(/^# (.*?)$/gm, '\\line\\cf1\\b\\fs32 $1\\b0\\cf0\\fs22\\par\\line')
      .replace(/^## (.*?)$/gm, '\\line\\cf1\\b\\fs28 $1\\b0\\cf0\\fs22\\par\\line')
      .replace(/^### (.*?)$/gm, '\\line\\cf1\\b\\fs24 $1\\b0\\cf0\\fs22\\par\\line')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '\\b $1\\b0')
      // List items
      .replace(/^\s*[-*]\s+(.*?)$/gm, '{\\pntext\\tab\\\'b7\\tab}{\\*\\pndec}\\fi-360\\li720 $1\\par')
      // Paragraph breaks
      .replace(/\n\n/g, '\\par\\line ')
      .replace(/\n/g, '\\par ')

    const rtfDoc = `{\\rtf1\\ansi\\ansicpg1252\\deff0\\deflang1033{\\fonttbl{\\f0\\fnil\\fcharset0 Calibri;}}
{\\colortbl ;\\red30\\green58\\blue138;\\red51\\green65\\blue85;}
\\f0\\fs22\\cf2
${rtfContent}
}`

    const blob = new Blob([rtfDoc], { type: "application/rtf;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "readability-content.rtf"
    link.click()
    URL.revokeObjectURL(url)
  }
```

Update the `downloadMd` method to use `formattedText || text`:
```typescript
  const downloadMd = () => {
    const sourceText = formattedText || text
    if (!sourceText.trim()) return
    const blob = new Blob([sourceText], { type: "text/markdown;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "readability-content.md"
    link.click()
    URL.revokeObjectURL(url)
  }
```

- [ ] **Step 2: Verify compiling**
Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**
```bash
git add src/components/tools/readability-grader.tsx
git commit -m "feat: add RTF download and Markdown stripping logic to readability grader"
```
