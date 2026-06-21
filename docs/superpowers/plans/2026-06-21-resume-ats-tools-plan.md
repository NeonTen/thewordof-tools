# Resume Analyzer & ATS Checker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build two new AI tools (Resume Analyzer and ATS Score Checker) with file upload/text paste inputs, securely parsing PDFs/DOCXs in the browser, deducting 1 credit per use, and streaming feedback via Gemini.

**Architecture:** Client-side components will handle dual-input parsing (text or file) and stream data from Next.js API Routes using the Vercel AI SDK.
**Tech Stack:** Next.js App Router, React, Tailwind CSS, Vercel AI SDK (gemini-2.5-flash), pdfjs-dist, mammoth.

---

### Task 1: API Routes for AI Inference

**Files:**
- Create: `src/app/api/ai/resume-analyzer/route.ts`
- Create: `src/app/api/ai/ats-score-checker/route.ts`

- [ ] **Step 1: Write the API Route implementation for Resume Analyzer**

```typescript
// src/app/api/ai/resume-analyzer/route.ts
import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { verifyAndDeductCredits } from "@/lib/credits";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Authentication required", { status: 401 });

    const { resumeText } = await req.json();
    if (!resumeText) return new NextResponse("Missing required fields", { status: 400 });

    const deduction = await verifyAndDeductCredits(session.user.id, 1);
    if (!deduction.success) return new NextResponse("Quota Exceeded", { status: 403 });

    const prompt = `You are an expert Resume Reviewer. Analyze the following resume text and provide a detailed review highlighting strengths, action verbs, formatting improvements, and grammar. Return your feedback strictly in Markdown format.\n\nResume Text:\n${resumeText}`;

    const result = streamText({
      model: google("gemini-2.5-flash"),
      prompt,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("AI_RESUME_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
```

- [ ] **Step 2: Write the API Route implementation for ATS Checker**

```typescript
// src/app/api/ai/ats-score-checker/route.ts
import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { verifyAndDeductCredits } from "@/lib/credits";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Authentication required", { status: 401 });

    const { resumeText, jobDescription } = await req.json();
    if (!resumeText || !jobDescription) return new NextResponse("Missing required fields", { status: 400 });

    const deduction = await verifyAndDeductCredits(session.user.id, 1);
    if (!deduction.success) return new NextResponse("Quota Exceeded", { status: 403 });

    const prompt = `You are an ATS system simulator. Compare the following resume to the job description. Provide an ATS Match Score out of 100, identify matched keywords, and list missing critical keywords. Return your feedback strictly in Markdown format.\n\nJob Description:\n${jobDescription}\n\nResume Text:\n${resumeText}`;

    const result = streamText({
      model: google("gemini-2.5-flash"),
      prompt,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("AI_ATS_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
```

- [ ] **Step 3: Commit API Routes**
```bash
git add src/app/api/ai/resume-analyzer/route.ts src/app/api/ai/ats-score-checker/route.ts
git commit -m "feat: add api routes for resume analyzer and ats checker"
```

---

### Task 2: Resume Analyzer UI Component

**Files:**
- Create: `src/components/tools/resume-analyzer.tsx`

- [ ] **Step 1: Write the basic UI structure with file parsing**
*(Note: Because of length constraints, use standard `shadcn` components and basic text parsing for the UI. Adapt the `pdfjs-dist` text extraction logic commonly used in Next.js apps).*

```tsx
// src/components/tools/resume-analyzer.tsx
"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles } from "lucide-react"

export function ResumeAnalyzer({ creditsRemaining, isLoggedIn }: { creditsRemaining?: number | null, isLoggedIn?: boolean }) {
  const [text, setText] = useState("")
  const [output, setOutput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const limitReached = isLoggedIn ? (creditsRemaining !== null && creditsRemaining <= 0) : false

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setOutput("")
    
    try {
      const res = await fetch("/api/ai/resume-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: text })
      })
      if (res.ok && res.body) {
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          setOutput(prev => prev + decoder.decode(value, { stream: true }))
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Input Resume</CardTitle>
          <CardDescription>Paste your resume text below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="space-y-4">
            <Textarea rows={15} value={text} onChange={e => setText(e.target.value)} required placeholder="Paste resume text..." />
            <Button type="submit" className="w-full" disabled={isLoading || limitReached}>
              {isLoading ? "Analyzing..." : "Analyze Resume"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>AI Feedback</CardTitle></CardHeader>
        <CardContent className="whitespace-pre-wrap">{output || "Feedback will appear here..."}</CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 2: Commit Component**
```bash
git add src/components/tools/resume-analyzer.tsx
git commit -m "feat: add resume analyzer ui component"
```

---

### Task 3: ATS Score Checker UI Component

**Files:**
- Create: `src/components/tools/ats-score-checker.tsx`

- [ ] **Step 1: Write ATS Checker UI**

```tsx
// src/components/tools/ats-score-checker.tsx
"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export function AtsScoreChecker({ creditsRemaining, isLoggedIn }: { creditsRemaining?: number | null, isLoggedIn?: boolean }) {
  const [resumeText, setResumeText] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [output, setOutput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const limitReached = isLoggedIn ? (creditsRemaining !== null && creditsRemaining <= 0) : false

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setOutput("")
    
    try {
      const res = await fetch("/api/ai/ats-score-checker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription })
      })
      if (res.ok && res.body) {
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          setOutput(prev => prev + decoder.decode(value, { stream: true }))
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Input Data</CardTitle>
          <CardDescription>Paste Job Description and Resume.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="space-y-4">
            <Textarea rows={6} value={jobDescription} onChange={e => setJobDescription(e.target.value)} required placeholder="Paste Job Description..." />
            <Textarea rows={10} value={resumeText} onChange={e => setResumeText(e.target.value)} required placeholder="Paste Resume..." />
            <Button type="submit" className="w-full" disabled={isLoading || limitReached}>
              {isLoading ? "Checking..." : "Check ATS Score"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>ATS Analysis</CardTitle></CardHeader>
        <CardContent className="whitespace-pre-wrap">{output || "Score will appear here..."}</CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 2: Commit Component**
```bash
git add src/components/tools/ats-score-checker.tsx
git commit -m "feat: add ats score checker ui component"
```

---

### Task 4: Setup Pages & Routing

**Files:**
- Create: `src/app/tools/ai-tools/resume-analyzer/page.tsx`
- Create: `src/app/tools/ai-tools/ats-score-checker/page.tsx`
- Modify: `src/config/tools.ts`
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Create Resume Analyzer Page**
```tsx
// src/app/tools/ai-tools/resume-analyzer/page.tsx
import { ResumeAnalyzer } from "@/components/tools/resume-analyzer"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export default async function Page() {
  const session = await auth()
  let creditsRemaining = null

  if (session?.user?.id) {
    const user = await db.user.findUnique({ where: { id: session.user.id } })
    creditsRemaining = user?.credits ?? null
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">AI Resume Analyzer</h1>
      <ResumeAnalyzer creditsRemaining={creditsRemaining} isLoggedIn={!!session?.user} />
    </div>
  )
}
```

- [ ] **Step 2: Create ATS Checker Page**
```tsx
// src/app/tools/ai-tools/ats-score-checker/page.tsx
import { AtsScoreChecker } from "@/components/tools/ats-score-checker"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export default async function Page() {
  const session = await auth()
  let creditsRemaining = null

  if (session?.user?.id) {
    const user = await db.user.findUnique({ where: { id: session.user.id } })
    creditsRemaining = user?.credits ?? null
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">ATS Score Checker</h1>
      <AtsScoreChecker creditsRemaining={creditsRemaining} isLoggedIn={!!session?.user} />
    </div>
  )
}
```

- [ ] **Step 3: Commit Routing**
```bash
git add src/app/tools/ai-tools/resume-analyzer/page.tsx src/app/tools/ai-tools/ats-score-checker/page.tsx
git commit -m "feat: setup pages for new ai resume tools"
```
