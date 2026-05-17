# Global AI CV Parser Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a premium, 100% reliable copy-paste "Global AI CV Parser" gated under the Business subscription tier, and remove the previous unstable web-scraping logic.

**Architecture:** Create a new API route `/api/ai/cv-parser` that parses raw text using Gemini AI structured output. Create modern, premium client-side input and preview modals. Repurpose the entry points inside the CV Builder and the Pricing page.

**Tech Stack:** Next.js, Vercel AI SDK, Google Gemini AI (gemini-2.5-flash), TailwindCSS, TypeScript.

---

### Task 1: Create Backend API Route

**Files:**
- Create: `src/app/api/ai/cv-parser/route.ts`

- [ ] **Step 1: Write the API route logic**
  Create `src/app/api/ai/cv-parser/route.ts` with Gemini parsing instructions:

  ```typescript
  import { google } from '@ai-sdk/google'
  import { generateObject } from 'ai'
  import { NextResponse } from 'next/server'
  import { auth } from '@/auth'
  import { z } from 'zod'

  export const maxDuration = 30
  export const dynamic = "force-dynamic"

  export async function POST(req: Request) {
    try {
      const session = await auth()
      const role = session?.user?.role
      const isBusinessOrAdmin = role === "BUSINESS" || role === "ADMIN"

      if (!isBusinessOrAdmin) {
        return new NextResponse("Unauthorized. Business or Admin tier required.", { status: 403 })
      }

      const { text } = await req.json()
      if (!text || text.trim().length < 100) {
        return NextResponse.json({ error: 'text_too_short' }, { status: 400 })
      }

      const result = await generateObject({
        model: google('gemini-2.5-flash'),
        schema: z.object({
          name: z.string(),
          title: z.string(),
          location: z.string(),
          summary: z.string(),
          skillsText: z.string(),
          experience: z.array(z.object({
            company: z.string(),
            role: z.string(),
            period: z.string(),
            desc: z.string()
          })),
          education: z.array(z.object({
            school: z.string(),
            degree: z.string(),
            period: z.string()
          }))
        }),
        prompt: `You are an expert CV Parser.
  Extract professional info from this raw CV text, LinkedIn profile copy, or professional bio. 
  Return empty strings or arrays for missing details.
  Ensure skillsText is a flat comma-separated list of extracted skills (e.g. "React, Next.js, TypeScript").

  Raw input text:
  ${text.substring(0, 30000)}
  `
      })

      return NextResponse.json(result.object)
    } catch (error) {
      console.error("AI_CV_PARSER_ERROR", error)
      return NextResponse.json({ error: 'parse_failed' }, { status: 500 })
    }
  }
  ```

- [ ] **Step 2: Verify ESLint on new route**
  Run: `npx eslint src/app/api/ai/cv-parser/route.ts`
  Expected: Clean execution (0 errors).

- [ ] **Step 3: Commit Task 1**
  ```bash
  git add src/app/api/ai/cv-parser/route.ts
  git commit -m "feat: add Global AI CV Parser API endpoint"
  ```

---

### Task 2: Create UI Components (AIParserModal & AIPreviewModal)

**Files:**
- Create: `src/components/tools/ai-parser-modal.tsx`
- Create: `src/components/tools/ai-preview-modal.tsx`

- [ ] **Step 1: Write AIPreviewModal component**
  Create `src/components/tools/ai-preview-modal.tsx` to render the extracted JSON structure:

  ```tsx
  "use client"

  import { X, CheckCircle, ArrowLeft, Briefcase, GraduationCap, Code, FileText, User } from "lucide-react"
  import { Button } from "@/components/ui/button"

  export type CVParserResult = {
    name: string
    title: string
    location: string
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
  }

  interface AIPreviewModalProps {
    data: CVParserResult
    onApply: (data: CVParserResult) => void
    onBack: () => void
    onClose: () => void
  }

  export function AIPreviewModal({ data, onApply, onBack, onClose }: AIPreviewModalProps) {
    const hasExp = data.experience && data.experience.length > 0
    const hasEdu = data.education && data.education.length > 0
    const hasSkills = data.skillsText && data.skillsText.trim().length > 0

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-md animate-in fade-in duration-200" onClick={onClose} />
        
        <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border bg-background shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="p-6 border-b flex items-center justify-between bg-muted/20">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h3 className="text-lg font-bold tracking-tight">Review Parsed Profile</h3>
                <p className="text-xs text-muted-foreground">Verify CV data extracted by AI</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Summary */}
            <div className="space-y-3 rounded-2xl border p-4 bg-muted/10">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                  <User className="h-4 w-4 text-primary" /> Personal Information
                </h4>
                {data.name && <CheckCircle className="h-4 w-4 text-emerald-500 fill-emerald-500/10" />}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm pt-1">
                <div>
                  <span className="text-xs text-muted-foreground block">Name</span>
                  <span className="font-medium">{data.name || "—"}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Title</span>
                  <span className="font-medium">{data.title || "—"}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-muted-foreground block">Location</span>
                  <span className="font-medium">{data.location || "—"}</span>
                </div>
                {data.summary && (
                  <div className="col-span-2 pt-2 border-t">
                    <span className="text-xs text-muted-foreground block mb-1">Professional Summary</span>
                    <p className="text-muted-foreground text-xs leading-relaxed">{data.summary}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-3 rounded-2xl border p-4 bg-muted/10">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                  <Briefcase className="h-4 w-4 text-primary" /> Work Experience
                </h4>
                {hasExp && <CheckCircle className="h-4 w-4 text-emerald-500 fill-emerald-500/10" />}
              </div>
              {!hasExp ? (
                <p className="text-xs text-muted-foreground italic">No work history identified.</p>
              ) : (
                <div className="space-y-4 pt-2">
                  {data.experience.map((item, idx) => (
                    <div key={idx} className="text-xs space-y-1 relative pl-4 border-l-2 border-primary/20 last:pb-0 pb-2">
                      <div className="flex justify-between items-start">
                        <h5 className="font-bold text-foreground">{item.role}</h5>
                        <span className="text-muted-foreground font-medium shrink-0">{item.period}</span>
                      </div>
                      <p className="text-muted-foreground font-semibold">{item.company}</p>
                      {item.desc && <p className="text-muted-foreground leading-relaxed pt-1">{item.desc}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Education */}
            <div className="space-y-3 rounded-2xl border p-4 bg-muted/10">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                  <GraduationCap className="h-4 w-4 text-primary" /> Education
                </h4>
                {hasEdu && <CheckCircle className="h-4 w-4 text-emerald-500 fill-emerald-500/10" />}
              </div>
              {!hasEdu ? (
                <p className="text-xs text-muted-foreground italic">No education details identified.</p>
              ) : (
                <div className="space-y-4 pt-2">
                  {data.education.map((item, idx) => (
                    <div key={idx} className="text-xs space-y-0.5 relative pl-4 border-l-2 border-primary/20 last:pb-0 pb-1">
                      <div className="flex justify-between items-start">
                        <h5 className="font-bold text-foreground">{item.degree}</h5>
                        <span className="text-muted-foreground font-medium shrink-0">{item.period}</span>
                      </div>
                      <p className="text-muted-foreground font-semibold">{item.school}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Skills */}
            <div className="space-y-3 rounded-2xl border p-4 bg-muted/10">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                  <Code className="h-4 w-4 text-primary" /> Extracted Skills
                </h4>
                {hasSkills && <CheckCircle className="h-4 w-4 text-emerald-500 fill-emerald-500/10" />}
              </div>
              {!hasSkills ? (
                <p className="text-xs text-muted-foreground italic">No skills identified.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {data.skillsText.split(',').map((skill, idx) => {
                    const cleaned = skill.trim()
                    if (!cleaned) return null
                    return (
                      <span key={idx} className="text-[10px] font-semibold bg-primary/5 border text-primary rounded-full px-2 py-0.5">
                        {cleaned}
                      </span>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t flex gap-3 bg-muted/20">
            <Button variant="outline" className="flex-1 rounded-2xl h-11" onClick={onBack}>
              Discard & Edit
            </Button>
            <Button className="flex-1 rounded-2xl h-11 bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20" onClick={() => onApply(data)}>
              Apply to Resume
            </Button>
          </div>
        </div>
      </div>
    )
  }
  ```

- [ ] **Step 2: Write AIParserModal component**
  Create `src/components/tools/ai-parser-modal.tsx`:

  ```tsx
  "use client"

  import { useState } from "react"
  import { Loader2, X, AlertTriangle, Sparkles, FileText } from "lucide-react"
  import { Button } from "@/components/ui/button"
  import { AIPreviewModal, CVParserResult } from "./ai-preview-modal"

  interface AIParserModalProps {
    onApply: (data: CVParserResult) => void
    onClose: () => void
  }

  export function AIParserModal({ onApply, onClose }: AIParserModalProps) {
    const [text, setText] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [parsedData, setParsedData] = useState<CVParserResult | null>(null)

    const handleParse = async () => {
      if (!text.trim() || text.trim().length < 100) {
        setError("Please enter a substantial amount of text (minimum 100 characters) to parse successfully.")
        return
      }
      setIsLoading(true)
      setError(null)
      setParsedData(null)

      try {
        const res = await fetch("/api/ai/cv-parser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text })
        })

        const data = await res.json()

        if (!res.ok || data.error) {
          if (data.error === "text_too_short") {
            setError("The text is too short. Please copy and paste more professional details.")
          } else {
            setError("AI was unable to extract CV data from your text. Please verify the content and try again.")
          }
        } else {
          setParsedData(data)
        }
      } catch (e) {
        console.error(e)
        setError("Failed to reach AI parser endpoint due to network connection issues.")
      } finally {
        setIsLoading(false)
      }
    }

    if (parsedData) {
      return (
        <AIPreviewModal
          data={parsedData}
          onApply={(data) => {
            onApply(data)
            onClose()
          }}
          onBack={() => setParsedData(null)}
          onClose={onClose}
        />
      )
    }

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-md animate-in fade-in duration-200" onClick={onClose} />
        
        {/* Modal */}
        <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border bg-background p-6 shadow-2xl animate-in zoom-in-95 duration-200">
          <Button variant="ghost" size="icon" className="absolute top-4 right-4 h-8 w-8 rounded-full" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>

          <div className="space-y-6 pt-2">
            <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold tracking-tight">AI Resume Parser</h3>
              <p className="text-xs text-muted-foreground px-4">
                Paste raw text from your LinkedIn page, old resume, or bio. We'll instantly structure and map it.
              </p>
            </div>

            <div className="space-y-3">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste here... E.g.
  Sajid Khan
  Senior Engineer
  
  Experience:
  Smartworking Solutions (2022 - Present)
  - Developed fullstack features using React and Next.js..."
                className="w-full min-h-[200px] text-xs p-4 rounded-2xl border bg-muted/20 focus:bg-background outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
              />

              {error && (
                <div className="flex gap-2 rounded-2xl bg-destructive/10 border border-destructive/20 p-3.5 text-xs text-destructive">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-2xl h-11" onClick={onClose}>
                Cancel
              </Button>
              <Button
                disabled={isLoading}
                onClick={handleParse}
                className="flex-1 rounded-2xl h-11 bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Parsing...
                  </>
                ) : (
                  "✨ Parse & Import"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  ```

- [ ] **Step 3: Verify linting of UI components**
  Run: `npx eslint src/components/tools/ai-parser-modal.tsx src/components/tools/ai-preview-modal.tsx`
  Expected: Clean execution (0 errors).

- [ ] **Step 4: Commit Task 2**
  ```bash
  git add src/components/tools/ai-parser-modal.tsx src/components/tools/ai-preview-modal.tsx
  git commit -m "feat: add AIParserModal and AIPreviewModal components"
  ```

---

### Task 3: Clean up Outdated LinkedIn Files & Integrate AI Parser

**Files:**
- Delete: `src/app/api/ai/linkedin-import/route.ts`
- Delete: `src/components/tools/linkedin-import-modal.tsx`
- Delete: `src/components/tools/linkedin-preview-modal.tsx`
- Modify: `src/components/tools/cv-builder.tsx`
- Modify: `src/app/pricing/page.tsx`

- [ ] **Step 1: Delete unstable LinkedIn scraper files**
  Run: `rm src/app/api/ai/linkedin-import/route.ts src/components/tools/linkedin-import-modal.tsx src/components/tools/linkedin-preview-modal.tsx`
  Expected: Command finishes successfully.

- [ ] **Step 2: Update cv-builder.tsx integrations**
  Modify `src/components/tools/cv-builder.tsx`:
  - Change import from `./linkedin-import-modal` to `./ai-parser-modal`
  - Rename the local state triggers and functions (e.g. change `"Import from LinkedIn"` to `"✨ Import with AI"`)
  - Update imports of `LinkedInImportResult` to `CVParserResult`
  - Let's read `cv-builder.tsx` import and trigger lines to verify the replacement content.

- [ ] **Step 3: Update pricing/page.tsx comparative text**
  Modify `src/app/pricing/page.tsx` column row value:
  - Find "LinkedIn Profile Import" and replace with "✨ Global AI CV Parser"

- [ ] **Step 4: Verify linting of all modified files**
  Run: `npx eslint src/components/tools/cv-builder.tsx src/app/pricing/page.tsx`
  Expected: Clean execution (0 errors).

- [ ] **Step 5: Commit Task 3**
  ```bash
  git add src/components/tools/cv-builder.tsx src/app/pricing/page.tsx
  git commit -m "refactor: remove LinkedIn scraper and integrate new AI Resume Parser UI"
  ```

---

### Task 4: Run Production Build and Verification

- [ ] **Step 1: Check production compilation**
  Run: `npm run build`
  Expected: Compiled successfully with 0 errors.

- [ ] **Step 2: Commit plan changes**
  ```bash
  git add docs/superpowers/plans/2026-05-17-ai-cv-parser-plan.md docs/superpowers/specs/2026-05-17-ai-cv-parser-design.md
  git commit -m "docs: finalize and commit AI Parser specifications and plans"
  ```
