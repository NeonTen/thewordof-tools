# ATS Score Checker Improved Score & CV Builder Handoff Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Automatically re-evaluate the ATS match score for rewritten resumes in `/tools/ai-tools/ats-score-checker`, displaying score badges and a CTA button that pre-fills and opens the AI Parser modal in `/tools/ai-tools/cv-builder`.

**Architecture:** Extend `ats-score-checker.tsx` to call `/api/ai/ats-score-checker` automatically after resume improvement streams complete, calculate score gain, update UI card header, and store text in `localStorage` before redirecting to `cv-builder.tsx` where `AIParserModal` opens automatically with pre-filled text.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide React icons, Recharts.

---

### Task 1: Add `initialText` Support to `AIParserModal` and Auto-Open in `CvBuilder`

**Files:**
- Modify: `src/components/tools/ai-parser-modal.tsx:1-25`
- Modify: `src/components/tools/cv-builder.tsx:40-60`
- Test: `scratch/test-parser-modal-prop.ts`

- [ ] **Step 1: Write verification script to test initialText state initialization logic**

```typescript
// scratch/test-parser-modal-prop.ts
import assert from "assert";

function getInitialText(provided?: string): string {
  return provided || "";
}

assert.strictEqual(getInitialText("resume text"), "resume text");
assert.strictEqual(getInitialText(), "");
console.log("✅ getInitialText logic verified");
```

- [ ] **Step 2: Run test to verify passes**

Run: `npx tsx scratch/test-parser-modal-prop.ts`
Expected: `✅ getInitialText logic verified`

- [ ] **Step 3: Modify `AIParserModalProps` and state in `ai-parser-modal.tsx`**

In `src/components/tools/ai-parser-modal.tsx`:
```typescript
interface AIParserModalProps {
  onApply: (data: CVParserResult) => void
  onClose: () => void
  initialText?: string
}

export function AIParserModal({ onApply, onClose, initialText = "" }: AIParserModalProps) {
  const [text, setText] = useState(initialText)
```

- [ ] **Step 4: Update `CvBuilder` in `cv-builder.tsx` to check `localStorage` on mount**

In `src/components/tools/cv-builder.tsx`:
Add state: `const [initialParserText, setInitialParserText] = useState("")`

Add `useEffect`:
```typescript
  React.useEffect(() => {
    const savedText = localStorage.getItem("ats_import_text")
    if (savedText) {
      setInitialParserText(savedText)
      setShowAIParserModal(true)
      localStorage.removeItem("ats_import_text")
    }
  }, [])
```

Update `AIParserModal` rendering in `cv-builder.tsx`:
```typescript
{showAIParserModal && (
  <AIParserModal
    initialText={initialParserText}
    onApply={(data) => {
      handleApplyParsedCV(data)
      setShowAIParserModal(false)
    }}
    onClose={() => setShowAIParserModal(false)}
  />
)}
```

- [ ] **Step 5: Run ESLint to verify no lint errors**

Run: `npx eslint src/components/tools/ai-parser-modal.tsx src/components/tools/cv-builder.tsx`
Expected: 0 errors

- [ ] **Step 6: Commit**

```bash
git add src/components/tools/ai-parser-modal.tsx src/components/tools/cv-builder.tsx scratch/test-parser-modal-prop.ts
git commit -m "feat: add initialText prop to AIParserModal and localStorage auto-open in CvBuilder"
```

---

### Task 2: Implement Auto Re-Evaluation & Score Badges in `ats-score-checker.tsx`

**Files:**
- Modify: `src/components/tools/ats-score-checker.tsx:1-339`
- Test: `scratch/test-ats-improved-score.ts`

- [ ] **Step 1: Write test script for score difference calculation**

```typescript
// scratch/test-ats-improved-score.ts
import assert from "assert";

function calculateScoreGain(originalScore: number, improvedScore: number): number {
  return Math.max(0, improvedScore - originalScore);
}

assert.strictEqual(calculateScoreGain(58, 94), 36);
assert.strictEqual(calculateScoreGain(80, 80), 0);
assert.strictEqual(calculateScoreGain(90, 85), 0);
console.log("✅ calculateScoreGain verified");
```

- [ ] **Step 2: Run test script to verify**

Run: `npx tsx scratch/test-ats-improved-score.ts`
Expected: `✅ calculateScoreGain verified`

- [ ] **Step 3: Update `ats-score-checker.tsx` state and auto-eval logic in `handleFixResume`**

Add states:
```typescript
const [improvedResult, setImprovedResult] = useState<AtsResult | null>(null)
const [isReEvaluating, setIsReEvaluating] = useState(false)
```

In `handleFixResume`:
```typescript
      let fullFixed = ""
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        fullFixed += chunk
        setFixedResume(prev => prev + chunk)
      }

      // Auto re-evaluate score for improved resume (0 extra credits)
      if (fullFixed.trim()) {
        setIsReEvaluating(true)
        try {
          const evalRes = await fetch("/api/ai/ats-score-checker", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ resumeText: fullFixed, jobDescription })
          })
          if (evalRes.ok) {
            const evalData = await evalRes.json()
            setImprovedResult(evalData)
          }
        } catch (err) {
          console.error("Auto score re-evaluation failed", err)
        } finally {
          setIsReEvaluating(false)
        }
      }
```

- [ ] **Step 4: Update "Improved Resume (ATS Optimized)" Card Header with Badges**

In `src/components/tools/ats-score-checker.tsx`, replace the CardHeader for `fixedResume`:

```tsx
<CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
  <div>
    <div className="flex items-center gap-3 flex-wrap">
      <CardTitle className="text-lg">Improved Resume (ATS Optimized)</CardTitle>
      {improvedResult && result && (
        <div className="flex items-center gap-2">
          <span className={cn(
            "px-2.5 py-0.5 rounded-full text-xs font-black border",
            improvedResult.score >= 80 ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30" : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30"
          )}>
            {improvedResult.score}% ATS Match
          </span>
          {improvedResult.score > result.score && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              +{improvedResult.score - result.score}% Boost
            </span>
          )}
        </div>
      )}
      {isReEvaluating && (
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground animate-pulse font-semibold">
          <span className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Calculating Improved Score...
        </span>
      )}
    </div>
    <CardDescription className="mt-1">
      Your rewritten resume naturally incorporates missing keywords to maximize your ATS match score.
    </CardDescription>
  </div>
  <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2 shrink-0">
    <Download className="h-4 w-4" />
    Download .md
  </Button>
</CardHeader>
```

- [ ] **Step 5: Add CTA Banner at the bottom of Improved Resume Card**

In `src/components/tools/ats-score-checker.tsx`, below the `<Textarea value={fixedResume} ... />`:

```tsx
<div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
  <div className="space-y-1">
    <h4 className="font-bold text-sm flex items-center gap-2">
      <Sparkles className="h-4 w-4 text-primary" />
      Turn this ATS-Optimized Resume into a Professional CV
    </h4>
    <p className="text-xs text-muted-foreground">
      Import this updated text directly into our AI CV Builder to generate a beautifully styled PDF or Word resume.
    </p>
  </div>
  <Button 
    className="gap-2 font-bold shrink-0 rounded-xl shadow-md shadow-primary/20"
    onClick={() => {
      if (fixedResume) {
        localStorage.setItem("ats_import_text", fixedResume)
      }
      window.location.href = "/tools/ai-tools/cv-builder"
    }}
  >
    <Sparkles className="h-4 w-4" />
    Turn into Professional CV
  </Button>
</div>
```

- [ ] **Step 6: Run ESLint to verify**

Run: `npx eslint src/components/tools/ats-score-checker.tsx`
Expected: 0 errors

- [ ] **Step 7: Commit**

```bash
git add src/components/tools/ats-score-checker.tsx scratch/test-ats-improved-score.ts
git commit -m "feat: auto re-evaluate ATS score for improved resume and add CV builder CTA"
```

---

### Task 3: Build Verification & Clean Up

- [ ] **Step 1: Run project build**

Run: `npm run build`
Expected: Build succeeds with 0 errors.

- [ ] **Step 2: Clean up scratch test files**

Run: `rm scratch/test-parser-modal-prop.ts scratch/test-ats-improved-score.ts`

- [ ] **Step 3: Commit build verification**

```bash
git commit --allow-empty -m "build: verify clean build for ATS score checker improvements"
```
