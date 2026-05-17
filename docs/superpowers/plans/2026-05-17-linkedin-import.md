# LinkedIn Profile Import Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow Business-tier users to import their public LinkedIn profiles to auto-populate the CV builder after confirming via a rich live preview.

**Architecture:** Create an API route `POST /api/ai/linkedin-import` that fetches public LinkedIn HTML, strips tags, uses Gemini `generateObject` for structured extraction, and adds a multi-stage modal system (Import URL modal → Preview modal) gated by an extended `ProGate` with Business-tier configuration.

**Tech Stack:** Next.js (App Router), TypeScript, TailwindCSS, Zod, Vercel AI SDK (with Gemini), Next-Auth

---

## File Structure

- **Create:** `src/app/api/ai/linkedin-import/route.ts` — Server-side fetch & Gemini extraction API
- **Create:** `src/components/tools/linkedin-import-modal.tsx` — Client modal for inputting LinkedIn URL & displaying loading state
- **Create:** `src/components/tools/linkedin-preview-modal.tsx` — Client modal showing extracted data preview sections
- **Modify:** `src/components/ui/pro-gate.tsx` — Add `tier` prop support for Pro vs Business plan gating
- **Modify:** `src/components/tools/cv-builder.tsx` — Add LinkedIn Import button and state mapping
- **Modify:** `src/app/tools/cv-builder/page.tsx` — Retrieve role from session and pass `isBusiness`
- **Modify:** `src/app/pricing/page.tsx` — Add "LinkedIn Profile Import" feature row to pricing matrix

---

## Tasks

### Task 1: API Route for LinkedIn Profile Extraction

**Files:**
- Create: `src/app/api/ai/linkedin-import/route.ts`

- [ ] **Step 1: Write the minimal endpoint with business role check, fetch request, text cleaning, and Gemini `generateObject` parsing**

Create file `src/app/api/ai/linkedin-import/route.ts`:
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

    const { url } = await req.json()
    if (!url) {
      return NextResponse.json({ error: 'invalid_url' }, { status: 400 })
    }

    let targetUrl: URL
    try {
      targetUrl = new URL(url)
    } catch {
      return NextResponse.json({ error: 'invalid_url' }, { status: 400 })
    }

    if (!targetUrl.hostname.includes("linkedin.com") || !targetUrl.pathname.includes("/in/")) {
      return NextResponse.json({ error: 'invalid_url' }, { status: 400 })
    }

    // Set up fetch abort controller with 10-second timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        return NextResponse.json({ error: 'fetch_failed' }, { status: 500 })
      }

      const html = await response.text()

      // Basic tag removal and compression to save token space
      const cleanedText = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()

      // Detection of authwalls / login pages served by LinkedIn
      if (
        cleanedText.includes("authwall") || 
        cleanedText.includes("Join to see") || 
        (cleanedText.includes("Sign in") && cleanedText.includes("LinkedIn")) ||
        cleanedText.length < 500
      ) {
        return NextResponse.json({ error: 'profile_not_public' }, { status: 400 })
      }

      // Vercel AI SDK generateObject with typed Zod schema
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
Extract professional info from this public LinkedIn profile page text. Return empty strings or arrays for missing details.
Ensure skillsText is a flat comma-separated list of extracted skills (e.g. "React, Next.js, TypeScript").

LinkedIn Profile text:
${cleanedText.substring(0, 35000)}
`
      })

      return NextResponse.json(result.object)
    } catch (fetchErr: any) {
      clearTimeout(timeoutId)
      console.error("Fetch Exception:", fetchErr)
      return NextResponse.json({ error: 'fetch_failed' }, { status: 500 })
    }
  } catch (error) {
    console.error("AI_LINKEDIN_IMPORT_ERROR", error)
    return NextResponse.json({ error: 'parse_failed' }, { status: 500 })
  }
}
```

- [ ] **Step 2: Verify code compiling and lint check**

Run: `npm run lint`
Expected: Passes lint checks with no syntax or TS errors.

---

### Task 2: Extend ProGate with Business Tier Support

**Files:**
- Modify: `src/components/ui/pro-gate.tsx`

- [ ] **Step 1: Update type signature and modal structure to distinguish Pro vs Business tier**

Open `src/components/ui/pro-gate.tsx` and edit lines 9-18 to add `tier?: 'pro' | 'business'`. In the component body, customize the prompt text dynamically depending on the tier.

```tsx
interface ProGateProps {
  children: React.ReactNode
  /** Short name of the feature, e.g. "Bulk ZIP Download" */
  feature: string
  /** When true the feature works normally. When false, clicking shows upgrade prompt. */
  isPro?: boolean
  /** Extra classes on the wrapper */
  className?: string
  /** The specific subscription tier needed to unlock */
  tier?: 'pro' | 'business'
}

export function ProGate({ children, feature, isPro = false, className, tier = 'pro' }: ProGateProps) {
  const [showPrompt, setShowPrompt] = useState(false)

  if (isPro) return <>{children}</>

  const isBusinessTier = tier === 'business'

  return (
    <div className={cn("relative group", className)}>
      {/* Intercept click via invisible overlay */}
      <div
        className="absolute inset-0 z-10 cursor-pointer"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setShowPrompt(true)
        }}
      />
      
      {/* Visual Indicator: Dimmed + Lock Icon */}
      <div className="pointer-events-none opacity-40 select-none grayscale-[0.8] transition-all group-hover:grayscale-0 group-hover:opacity-60">
        <div className="absolute top-1 right-1 z-[5] bg-primary/10 backdrop-blur-md p-1 rounded-md border border-primary/20 shadow-sm">
          <Lock className="h-2.5 w-2.5 text-primary" />
        </div>
        {children}
      </div>

      {/* Fixed Modal upgrade prompt */}
      {showPrompt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setShowPrompt(false)}
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border bg-background p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="absolute top-4 right-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => setShowPrompt(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-center space-y-6">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight">
                  {isBusinessTier ? "Business Feature" : "Pro Feature"}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  <span className="font-bold text-foreground">{feature}</span> requires a {isBusinessTier ? "Business" : "Pro"} subscription. Upgrade now to unlock all premium tools and business resources.
                </p>
              </div>

              <div className="grid gap-3 pt-2">
                <Button size="lg" className="h-12 font-black text-base shadow-xl shadow-primary/20" asChild>
                  <Link href="/pricing" onClick={() => setShowPrompt(false)}>
                    View {isBusinessTier ? "Business" : "Pro"} Plans <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  className="font-bold text-muted-foreground"
                  onClick={() => setShowPrompt(false)}
                >
                  Maybe later
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Run build lint check to ensure ProBadge and other ProGate components compile**

Run: `npm run lint`
Expected: Success.

---

### Task 3: Build the Input and Fetching Modal

**Files:**
- Create: `src/components/tools/linkedin-import-modal.tsx`

- [ ] **Step 1: Write client component with input, loading, and custom API call**

Create file `src/components/tools/linkedin-import-modal.tsx`:
```tsx
"use client"

import { useState } from "react"
import { Loader2, Linkedin, X, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LinkedInPreviewModal } from "./linkedin-preview-modal"

type LinkedInImportResult = {
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

interface LinkedInImportModalProps {
  onApply: (data: LinkedInImportResult) => void
  onClose: () => void
}

export function LinkedInImportModal({ onApply, onClose }: LinkedInImportModalProps) {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [parsedData, setParsedData] = useState<LinkedInImportResult | null>(null)

  const handleFetch = async () => {
    if (!url.trim()) return
    setIsLoading(true)
    setError(null)
    setParsedData(null)

    try {
      const res = await fetch("/api/ai/linkedin-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        const errMap: Record<string, string> = {
          invalid_url: "Please enter a valid LinkedIn profile URL (e.g. linkedin.com/in/your-name).",
          profile_not_public: "We couldn't read this profile. Make sure it's set to 'Public' on LinkedIn.",
          fetch_failed: "Couldn't reach LinkedIn. Check the URL or try again later.",
          parse_failed: "AI was unable to extract your profile info. Please verify your profile details."
        }
        setError(errMap[data.error] || "An unexpected error occurred during profile extraction.")
      } else {
        setParsedData(data)
      }
    } catch (e) {
      console.error(e)
      setError("Failed to complete import request due to network connection issues.")
    } finally {
      setIsLoading(false)
    }
  }

  if (parsedData) {
    return (
      <LinkedInPreviewModal
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
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border bg-background p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <Button variant="ghost" size="icon" className="absolute top-4 right-4 h-8 w-8 rounded-full" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>

        <div className="space-y-6 pt-2">
          <div className="mx-auto w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Linkedin className="h-6 w-6 text-blue-500 fill-blue-500" />
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold tracking-tight">Import from LinkedIn</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Paste your public LinkedIn profile URL. We will extract details using AI to pre-fill your CV.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="https://www.linkedin.com/in/username"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
                className="h-10 px-4 rounded-xl border-muted-foreground/20"
              />
            </div>

            {error && (
              <div className="flex gap-2 p-3.5 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive text-xs leading-relaxed">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <Button
              className="w-full h-11 font-semibold rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition-all shadow-md shadow-blue-500/25"
              onClick={handleFetch}
              disabled={isLoading || !url.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Extracting profile details...
                </>
              ) : (
                "Fetch & Preview Data"
              )}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-[11px] text-muted-foreground">
              💡 Ensure your LinkedIn profile has public visibility enabled under LinkedIn settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit initial Modal Component code**

```bash
git add src/components/tools/linkedin-import-modal.tsx
git commit -m "feat: add linkedin-import-modal layout and API integration"
```

---

### Task 4: Build the Preview & Apply Modal

**Files:**
- Create: `src/components/tools/linkedin-preview-modal.tsx`

- [ ] **Step 1: Write component with collapsable sections, data checkboxes and apply mappings**

Create file `src/components/tools/linkedin-preview-modal.tsx`:
```tsx
"use client"

import { Check, ArrowLeft, X, Briefcase, GraduationCap, Code, FileText, User } from "lucide-react"
import { Button } from "@/components/ui/button"

type LinkedInImportResult = {
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

interface LinkedInPreviewModalProps {
  data: LinkedInImportResult
  onApply: (data: LinkedInImportResult) => void
  onBack: () => void
  onClose: () => void
}

export function LinkedInPreviewModal({ data, onApply, onBack, onClose }: LinkedInPreviewModalProps) {
  const hasExperience = data.experience && data.experience.length > 0
  const hasEducation = data.education && data.education.length > 0
  const skillsArray = data.skillsText ? data.skillsText.split(",").map(s => s.trim()).filter(Boolean) : []

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md animate-in fade-in duration-200" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border bg-background shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-blue-500/5">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h3 className="text-base font-black text-foreground leading-tight">LinkedIn Profile Preview</h3>
              <p className="text-[11px] text-blue-500 font-semibold tracking-wide">✓ Parsed Successfully — Review Details</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 max-h-[50vh]">
          
          {/* Personal Card */}
          <div className="border rounded-2xl p-4 bg-muted/10 space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" /> Personal Details
              </span>
              <span className="h-4 w-4 bg-emerald-500/10 rounded-full flex items-center justify-center text-[10px] text-emerald-500 font-bold">✓</span>
            </div>
            <div className="space-y-2 text-sm leading-relaxed">
              <div><span className="font-bold text-muted-foreground w-16 inline-block">Name:</span> <span className="font-bold text-blue-500">{data.name || "—"}</span></div>
              <div><span className="font-bold text-muted-foreground w-16 inline-block">Title:</span> <span>{data.title || "—"}</span></div>
              <div><span className="font-bold text-muted-foreground w-16 inline-block">Location:</span> <span>{data.location || "—"}</span></div>
            </div>
          </div>

          {/* Summary Card */}
          {data.summary && (
            <div className="border rounded-2xl p-4 bg-muted/10 space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" /> Professional Summary
                </span>
                <span className="h-4 w-4 bg-emerald-500/10 rounded-full flex items-center justify-center text-[10px] text-emerald-500 font-bold">✓</span>
              </div>
              <p className="text-xs text-muted-foreground italic leading-relaxed">{data.summary}</p>
            </div>
          )}

          {/* Experience Card */}
          {hasExperience && (
            <div className="border rounded-2xl p-4 bg-muted/10 space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5" /> Work Experience
                </span>
                <span className="h-4 w-4 bg-emerald-500/10 rounded-full flex items-center justify-center text-[10px] text-emerald-500 font-bold">✓</span>
              </div>
              <div className="space-y-4">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="font-bold text-foreground">{exp.role}</div>
                    <div className="text-blue-500/80 font-medium">{exp.company} · <span className="text-muted-foreground">{exp.period}</span></div>
                    {exp.desc && <p className="text-muted-foreground/80 mt-1 leading-relaxed">{exp.desc}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Card */}
          {hasEducation && (
            <div className="border rounded-2xl p-4 bg-muted/10 space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5" /> Education Details
                </span>
                <span className="h-4 w-4 bg-emerald-500/10 rounded-full flex items-center justify-center text-[10px] text-emerald-500 font-bold">✓</span>
              </div>
              <div className="space-y-3">
                {data.education.map((edu, idx) => (
                  <div key={idx} className="space-y-0.5 text-xs">
                    <div className="font-bold text-foreground">{edu.school}</div>
                    <div className="text-muted-foreground">{edu.degree} · {edu.period}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Card */}
          {skillsArray.length > 0 && (
            <div className="border rounded-2xl p-4 bg-muted/10 space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <Code className="h-3.5 w-3.5" /> Skills & Abilities
                </span>
                <span className="h-4 w-4 bg-emerald-500/10 rounded-full flex items-center justify-center text-[10px] text-emerald-500 font-bold">✓</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {skillsArray.map((skill, idx) => (
                  <span key={idx} className="text-[10px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/10 px-2.5 py-0.5 rounded-md">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t flex items-center gap-4 bg-muted/5">
          <Button variant="outline" className="flex-1 h-11 font-bold rounded-xl" onClick={onBack}>
            ← Go Back
          </Button>
          <Button className="flex-1 h-11 font-bold rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/20" onClick={() => onApply(data)}>
            Apply to CV <Check className="h-4 w-4 ml-2" />
          </Button>
        </div>

      </div>
    </div>
  )
}
```

- [ ] **Step 2: Run lint verification**

Run: `npm run lint`
Expected: Compile success with zero missing imports or types.

---

### Task 5: Integrate Import Flow in CV Builder

**Files:**
- Modify: `src/components/tools/cv-builder.tsx`

- [ ] **Step 1: Accept `isBusiness` prop, add button to Personal Details header, state replacement hook**

Open `src/components/tools/cv-builder.tsx`. Modify the component signature:
```tsx
export function CvBuilder({ isPro = false, isBusiness = false }: { isPro?: boolean; isBusiness?: boolean }) {
```

Add imports to the top of the file:
```tsx
import { LinkedInImportModal } from "./linkedin-import-modal"
```

Add local import modal state inside `CvBuilder`:
```tsx
const [showLinkedInModal, setShowLinkedInModal] = useState(false)
```

Find CardHeader of "Personal Details" (around line 343). Insert the `<ProGate>` import wrapper side by side with the user photo:
```tsx
<CardHeader className="flex flex-row items-center justify-between pb-4">
  <CardTitle>Personal Details</CardTitle>
  <div className="flex items-center gap-3">
    <ProGate feature="LinkedIn Import" isPro={isBusiness} tier="business">
      <Button 
        size="sm" 
        variant="outline" 
        onClick={() => setShowLinkedInModal(true)} 
        className="font-bold border-purple-500/20 hover:bg-purple-500/5 text-purple-600 dark:text-purple-400 gap-1.5"
      >
        <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
        Import from LinkedIn
      </Button>
    </ProGate>

    {/* User photo upload gate */}
    <ProGate feature="User Photo" isPro={isPro}>
      <div className="flex items-center gap-3">
        {photo && <img src={photo} className="h-10 w-10 rounded-full object-cover border-2 border-primary shadow-sm" alt="Profile" />}
        <label className="cursor-pointer bg-primary text-white hover:bg-primary/90 p-2.5 rounded-xl transition-all shadow-md shadow-primary/20 flex items-center justify-center">
          <ImageIcon className="h-5 w-5" />
          <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
        </label>
      </div>
    </ProGate>
  </div>
</CardHeader>
```

Add state application logic to map the extracted result to the form:
```tsx
const handleApplyLinkedInData = (data: any) => {
  // Update main details
  setCv(prev => ({
    ...prev,
    name: data.name || prev.name,
    title: data.title || prev.title,
    location: data.location || prev.location,
    summary: data.summary || prev.summary,
    skillsText: data.skillsText || prev.skillsText
  }))

  // Map experience
  if (data.experience && data.experience.length > 0) {
    setExperience(data.experience.map((exp: any, idx: number) => ({
      id: Date.now() + idx,
      company: exp.company || "",
      role: exp.role || "",
      period: exp.period || "",
      desc: exp.desc || ""
    })))
  }

  // Map education
  if (data.education && data.education.length > 0) {
    setEducation(data.education.map((edu: any, idx: number) => ({
      id: Date.now() + idx,
      school: edu.school || "",
      degree: edu.degree || "",
      period: edu.period || ""
    })))
  }
}
```

Insert the modal renderer at the bottom of the JSX tree:
```tsx
    {showLinkedInModal && (
      <LinkedInImportModal
        onApply={handleApplyLinkedInData}
        onClose={() => setShowLinkedInModal(false)}
      />
    )}
  </>
)
```

- [ ] **Step 2: Run dev/build verification to verify UI logic checks out**

Run: `npm run lint`
Expected: Passes.

---

### Task 6: Pass Subscription Tier from Page Context

**Files:**
- Modify: `src/app/tools/cv-builder/page.tsx`

- [ ] **Step 1: Check session role for BUSINESS role and pass down to CvBuilder**

Modify `src/app/tools/cv-builder/page.tsx`:
```tsx
import { CvBuilder } from "@/components/tools/cv-builder"
import { auth } from "@/auth"

export const metadata = {
  title: "AI CV Builder",
  description: "Create a professional, ATS-optimized CV with AI.",
}

export default async function CvBuilderPage() {
  const session = await auth()
  const role = session?.user?.role
  const isPro = role === "PRO" || role === "BUSINESS" || role === "ADMIN"
  const isBusiness = role === "BUSINESS" || role === "ADMIN"

  return (
    <div className="flex flex-col gap-8">
      <div className="print:hidden">
        <h1 className="text-3xl font-bold tracking-tight">AI CV Builder</h1>
        <p className="text-muted-foreground mt-2">
          Create a professional, ATS-optimized CV with AI.
        </p>
      </div>

      <CvBuilder isPro={isPro} isBusiness={isBusiness} />
    </div>
  )
}
```

- [ ] **Step 2: Commit task code**

```bash
git add src/components/tools/cv-builder.tsx src/app/tools/cv-builder/page.tsx
git commit -m "feat: wire up linkedin-import UI trigger to cv-builder state"
```

---

### Task 7: Update Pricing Plans Grid

**Files:**
- Modify: `src/app/pricing/page.tsx`

- [ ] **Step 1: Add row to detailed comparison list**

Open `src/app/pricing/page.tsx`. Find the detailed feature grid (around line 96). Insert `"LinkedIn Profile Import"` row gated only to Business:
```tsx
  ["AI CV Builder", "Basic Summary", "Full Pro CV + PDF", "Full Pro CV + PDF"],
  ["LinkedIn Profile Import", "—", "—", "✓ One-click import"],
  ["Invoice Generator", "3 / month", "Unlimited + Branding", "Unlimited + Branding"],
```

- [ ] **Step 2: Final compile verify**

Run: `npm run build`
Expected: Project builds cleanly with no issues.

---
