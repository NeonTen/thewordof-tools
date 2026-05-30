# AI Tool Login Gating Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Require login for all AI tools, showing an inline signup card for logged-out users, and displaying the actual remaining credit balance (costs, overrides) for logged-in users. Keep non-AI tools (Calculators, converters) available anonymously with their daily count badges.

**Architecture:**
1. Refactor five AI tool routes (`caption-generator/page.tsx`, `seo-generator/page.tsx`, `prompt-generator/page.tsx`, `product-description/page.tsx`, `llms-txt/page.tsx`) to pull user session details and credits remaining from the database.
2. Thread these properties into the client components.
3. Update each tool component to display the login overlay overlay if `isLoggedIn` is false.
4. Render the cost information underneath the trigger buttons, and disable inputs/generation once credit allocations run out.

**Tech Stack:** Next.js (App Router), Prisma, TailwindCSS.

---

### Task 1: Refactor Page Routes to Pass Credits and Session Status

**Files:**
- Modify: `src/app/tools/caption-generator/page.tsx`
- Modify: `src/app/tools/seo-generator/page.tsx`
- Modify: `src/app/tools/prompt-generator/page.tsx`
- Modify: `src/app/tools/product-description/page.tsx`
- Modify: `src/app/tools/llms-txt/page.tsx`

- [ ] **Step 1: Refactor page routes**
  Update the code of all five pages to pull the session and query `creditsRemaining` from the database.
  
  Example (apply to all five files matching their respective imports/exports):
  ```typescript
  import { auth } from "@/auth"
  import { prisma } from "@/lib/prisma"

  export default async function PageName() {
    const session = await auth()
    const isPro = session?.user?.role === "PRO" || session?.user?.role === "BUSINESS" || session?.user?.role === "ADMIN"

    const dbUser = session?.user?.id ? await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { creditsRemaining: true }
    }) : null

    return (
      <div className="flex flex-col gap-8">
        {/* Header content... */}
        <Component 
          isPro={isPro} 
          creditsRemaining={dbUser?.creditsRemaining ?? null} 
          isLoggedIn={!!session?.user} 
        />
      </div>
    )
  }
  ```

- [ ] **Step 2: Commit page routing updates**
  ```bash
  git add src/app/tools/
  git commit -m "feat(gating): pass credit allocations and session status to AI tools"
  ```

---

### Task 2: Implement Gating UI Overlay & Balance Displays in Client Components

**Files:**
- Modify: `src/components/tools/caption-generator.tsx`
- Modify: `src/components/tools/seo-generator.tsx`
- Modify: `src/components/tools/prompt-generator.tsx`
- Modify: `src/components/tools/product-description.tsx`
- Modify: `src/components/tools/llms-txt-generator.tsx`

- [ ] **Step 1: Create a shared LockCard or integrate direct inline lock JSX**
  If `isLoggedIn` is false, render the lock overlay instead of the form inputs inside the `Card` of each generator tool:
  ```tsx
  import { Sparkles } from "lucide-react"
  import Link from "next/link"

  // Render when !isLoggedIn:
  <Card className="border-dashed border-2 border-primary/20 bg-muted/20 relative overflow-hidden">
    <CardContent className="p-8 text-center flex flex-col items-center justify-center min-h-[350px] gap-6">
      <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
        <Sparkles className="h-7 w-7 text-primary animate-pulse" />
      </div>
      <div className="space-y-2 max-w-sm">
        <h3 className="font-bold text-lg">AI Tool Requires Account</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          AI utilities require a free account to track monthly credit allocations. Register today to claim 20 free monthly AI credits!
        </p>
      </div>
      <div className="flex gap-4 w-full max-w-xs">
        <Button className="w-full font-bold" asChild>
          <Link href="/login">Login</Link>
        </Button>
        <Button variant="outline" className="w-full font-bold" asChild>
          <Link href="/register">Sign Up</Link>
        </Button>
      </div>
    </CardContent>
  </Card>
  ```

- [ ] **Step 2: Display Cost and Remaining balance**
  If logged in, remove the local storage badge:
  `{MAX_FREE - usedToday} of {MAX_FREE} free generations left today`
  Replace it with:
  ```tsx
  {isLoggedIn && (
    <p className="text-[10px] text-center text-muted-foreground">
      Costs 1 credit ({creditsRemaining ?? 0} remaining)
    </p>
  )}
  ```

- [ ] **Step 3: Handle out of credits state**
  If `creditsRemaining` is `<= 0`, disable the "Generate" button, change its label to `"Out of Credits"`, and display:
  ```tsx
  {creditsRemaining !== null && creditsRemaining <= 0 && (
    <p className="text-[10px] text-center text-destructive font-bold">
      You have exhausted your credit balance. <Link href="/pricing" className="text-primary hover:underline">Upgrade to Pro &rarr;</Link>
    </p>
  )}
  ```

- [ ] **Step 4: Commit UI components changes**
  ```bash
  git add src/components/tools/
  git commit -m "feat(gating): implement inline login gates and cost labels inside AI tools"
  ```

---

### Task 3: Build & Validation

- [ ] **Step 1: Check build & types**
  Run:
  ```bash
  npx tsc --noEmit
  npm run build
  ```
