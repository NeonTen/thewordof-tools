# AI CV Auto-Formatting Bullets & Credit Balance Display Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Auto-format extracted experience/project/summary items into `- ` bullet lines during AI CV parsing, and display the tool's 3-credit cost and remaining balance in the AI Import Parser modal.

**Architecture:** Update the Gemini prompt in `/api/ai/cv-parser/route.ts` to instruct `- ` bullet formatting. Query `creditsRemaining` in `cv-builder/page.tsx` and pass it down through `CvBuilder` to `AIParserModal` for rendering `<p className="...">Costs 3 credits ({localCredits ?? 0} remaining)</p>`.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Prisma, Vercel AI SDK (Gemini 2.5 Flash).

---

### Task 1: Update AI CV Parser Prompt to Auto-Format Bullets

**Files:**
- Modify: `src/app/api/ai/cv-parser/route.ts:76-85`

- [ ] **Step 1: Update system prompt in `src/app/api/ai/cv-parser/route.ts`**

```typescript
      prompt: `You are an expert CV Parser.
Extract professional info from this raw CV text, LinkedIn profile copy, or professional bio. 
Return empty strings or arrays for missing details.
Ensure skillsText is a flat comma-separated list of extracted skills (e.g. "React, Next.js, TypeScript").
Identify any notable key projects (e.g., LearningMole, ProfileTree) and populate them in the projects array with title, link (if any), and desc.
For experience[].desc, projects[].desc, and summary, format multi-item achievements, responsibilities, or bullet points as clean lines starting with "- " (e.g., "- Developed scalable APIs\\n- Managed team of 4").

Raw input text:
${text.substring(0, 30000)}
`,
```

- [ ] **Step 2: Run ESLint to verify syntax**

Run: `npx eslint src/app/api/ai/cv-parser/route.ts`
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/app/api/ai/cv-parser/route.ts
git commit -m "feat: instruct AI CV parser to format experience and project descriptions into bullet lines"
```

---

### Task 2: Pass and Display `creditsRemaining` in AI Parser Popup

**Files:**
- Modify: `src/app/tools/ai-tools/cv-builder/page.tsx:1-28`
- Modify: `src/components/tools/cv-builder.tsx:41,605,612`
- Modify: `src/components/tools/ai-parser-modal.tsx:9-139`

- [ ] **Step 1: Fetch `creditsRemaining` in `src/app/tools/ai-tools/cv-builder/page.tsx`**

```tsx
import { generateSeoMetadata } from "@/app/lib/seo";
import { ToolHeader } from "@/components/tools/tool-header";
import { CvBuilder } from "@/components/tools/cv-builder";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const metadata = generateSeoMetadata({
  title: "AI CV Builder",
  description: "Create a professional, ATS-optimized CV with AI.",
});

export default async function CvBuilderPage() {
  const session = await auth();
  const role = session?.user?.role;
  const isPro = role === "PRO" || role === "BUSINESS" || role === "ADMIN";
  const isBusiness = role === "BUSINESS" || role === "ADMIN";

  const dbUser = session?.user?.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { creditsRemaining: true },
      })
    : null;

  return (
    <div className="flex flex-col gap-6">
      <ToolHeader
        category="AI Tools"
        categoryHref="/tools/ai-tools"
        title="AI CV Builder"
      />
      <CvBuilder 
        isPro={isPro} 
        isBusiness={isBusiness} 
        creditsRemaining={dbUser?.creditsRemaining ?? null} 
      />
    </div>
  );
}
```

- [ ] **Step 2: Update `CvBuilder` to accept `creditsRemaining` prop and pass to `AIParserModal`**

In `src/components/tools/cv-builder.tsx`:
```tsx
export function CvBuilder({ 
  isPro = false, 
  isBusiness = false,
  creditsRemaining = null
}: { 
  isPro?: boolean; 
  isBusiness?: boolean;
  creditsRemaining?: number | null;
}) {
```
And where `<AIParserModal />` is rendered:
```tsx
{showAIParserModal && (
  <AIParserModal
    initialText={initialParserText}
    creditsRemaining={creditsRemaining}
    onApply={(data) => {
      // apply logic
    }}
    onClose={() => {
      setShowAIParserModal(false)
      setInitialParserText("")
    }}
  />
)}
```

- [ ] **Step 3: Update `AIParserModal` to render credit usage text**

In `src/components/tools/ai-parser-modal.tsx`:
```tsx
interface AIParserModalProps {
  onApply: (data: CVParserResult) => void
  onClose: () => void
  initialText?: string
  creditsRemaining?: number | null
}

export function AIParserModal({ onApply, onClose, initialText = "", creditsRemaining = null }: AIParserModalProps) {
  const [localCredits, setLocalCredits] = useState<number | null>(creditsRemaining)

  // In handleParse when parse succeeds:
  setLocalCredits(prev => (prev !== null ? Math.max(0, prev - 3) : null))
```

And below the buttons in `AIParserModal`:
```tsx
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

          <p className="text-[11px] text-muted-foreground text-center font-medium -mt-2">
            Costs 3 credits ({localCredits ?? 0} remaining)
          </p>
```

- [ ] **Step 4: Run ESLint to verify**

Run: `npx eslint src/app/tools/ai-tools/cv-builder/page.tsx src/components/tools/cv-builder.tsx src/components/tools/ai-parser-modal.tsx`
Expected: 0 errors

- [ ] **Step 5: Commit**

```bash
git add src/app/tools/ai-tools/cv-builder/page.tsx src/components/tools/cv-builder.tsx src/components/tools/ai-parser-modal.tsx
git commit -m "feat: display credit cost and remaining balance in AI CV Parser modal"
```

---

### Task 3: Production Build Verification

- [ ] **Step 1: Run production build**

Run: `npm run build`
Expected: Build completes cleanly with 0 errors.

- [ ] **Step 2: Commit final build state**

```bash
git commit --allow-empty -m "build: verify clean production build for AI CV parser bullets and credit display"
```
