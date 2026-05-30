# Credit-Based Quota System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Secure all AI-powered actions with a database-backed monthly credit quota system, displaying remaining credits on the dashboard and enabling admins to view and modify user credits.

**Architecture:**
1. Update `prisma/schema.prisma` with `creditsRemaining` and `creditsResetAt` fields.
2. Build credit auto-reset, validation, and deduction helper methods in `src/lib/credits.ts`.
3. Integrate checks into all AI API endpoints.
4. Build a premium `CreditOverview` widget in the dashboard.
5. Update admin pages and user update endpoints to expose credit adjustment functionality.

**Tech Stack:** Next.js (App Router), Prisma, PostgreSQL.

---

### Task 1: Update Database Schema

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Add fields to User model in `prisma/schema.prisma`**
  Add `creditsRemaining` and `creditsResetAt` fields:
  ```prisma
  model User {
    id                String    @id @default(cuid())
    // ... existing fields ...
    creditsRemaining  Int       @default(20)
    creditsResetAt    DateTime  @default(now())
  }
  ```

- [ ] **Step 2: Generate database client & push changes**
  Run schema migration/push to update database structure:
  ```bash
  npx prisma db push
  ```

- [ ] **Step 3: Commit schema changes**
  ```bash
  git add prisma/schema.prisma
  git commit -m "db(schema): add credit fields to User model"
  ```

---

### Task 2: Implement Core Credit Helper Library

**Files:**
- Create: `src/lib/credits.ts`

- [ ] **Step 1: Write `src/lib/credits.ts`**
  Create the core utility managing deduction, auto-reset cycles, and plan credit boundaries:
  ```typescript
  import { prisma } from "@/lib/prisma"

  export function getCurrentCreditAllocation(role: string): number {
    switch (role.toUpperCase()) {
      case "PRO":
      case "PREMIUM":
        return 500
      case "BUSINESS":
        return 2000
      case "ADMIN":
        return 999999
      default:
        return 20
    }
  }

  export async function verifyAndDeductCredits(userId: string, cost: number): Promise<{ success: boolean; remaining: number; resetAt: Date }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { creditsRemaining: true, creditsResetAt: true, role: true }
    })

    if (!user) {
      throw new Error("User not found")
    }

    const now = new Date()
    let currentRemaining = user.creditsRemaining
    let currentResetAt = user.creditsResetAt

    // Check if billing cycle / calendar month has passed, triggering a reset
    if (now >= currentResetAt) {
      const nextReset = new Date(currentResetAt)
      if (user.role === "PRO" || user.role === "BUSINESS" || user.role === "ADMIN") {
        nextReset.setMonth(nextReset.getMonth() + 1)
      } else {
        // Free user resets on the 1st of next month
        nextReset.setMonth(nextReset.getMonth() + 1)
        nextReset.setDate(1)
        nextReset.setHours(0, 0, 0, 0)
      }

      currentRemaining = getCurrentCreditAllocation(user.role)
      currentResetAt = nextReset

      await prisma.user.update({
        where: { id: userId },
        data: {
          creditsRemaining: currentRemaining,
          creditsResetAt: currentResetAt
        }
      })
    }

    if (currentRemaining >= cost) {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          creditsRemaining: {
            decrement: cost
          }
        },
        select: { creditsRemaining: true, creditsResetAt: true }
      })

      return {
        success: true,
        remaining: updatedUser.creditsRemaining,
        resetAt: updatedUser.creditsResetAt
      }
    }

    return {
      success: false,
      remaining: currentRemaining,
      resetAt: currentResetAt
    }
  }
  ```

- [ ] **Step 2: Commit helper class**
  ```bash
  git add src/lib/credits.ts
  git commit -m "feat(credits): add verifyAndDeductCredits helper"
  ```

---

### Task 3: Integrate Credit Checks into AI Endpoints

**Files:**
- Modify: `src/app/api/ai/caption/route.ts`
- Modify: `src/app/api/ai/cv-summary/route.ts`
- Modify: `src/app/api/ai/cv-parser/route.ts`
- Modify: `src/app/api/tools/ai-schema/route.ts`
- Modify: `src/app/api/ai/seo/route.ts`
- Modify: `src/app/api/ai/prompt/route.ts`
- Modify: `src/app/api/tools/generate-description/route.ts`
- Modify: `src/app/api/ai/llms-txt/route.ts`

- [ ] **Step 1: Update API routes to check and deduct credits**
  Add the session check and deduction logic at the top of each API handler:
  ```typescript
  import { verifyAndDeductCredits } from "@/lib/credits"

  // Inside POST handler:
  const session = await auth()
  if (!session?.user?.id) {
    return new NextResponse("Authentication required", { status: 401 })
  }

  // Cost calculation: 1 for standard, 3 for CV Parser/LinkedIn Import
  const cost = 1 
  const deduction = await verifyAndDeductCredits(session.user.id, cost)
  if (!deduction.success) {
    return new NextResponse("Quota Exceeded: You do not have enough credits.", { status: 403 })
  }
  ```

- [ ] **Step 2: Commit API integrations**
  ```bash
  git add src/app/api/
  git commit -m "feat(credits): secure AI endpoints with database credit deduction"
  ```

---

### Task 4: Premium Dashboard Widget

**Files:**
- Create: `src/components/dashboard/credit-overview.tsx`
- Modify: `src/app/dashboard/page.tsx`

- [ ] **Step 1: Write `CreditOverview` component**
  Build a gorgeous component that shows remaining credits, maximum allotment, a progress bar, and reset information.
  ```typescript
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
  import { Progress } from "@/components/ui/progress"
  import { Badge } from "@/components/ui/badge"
  import { Zap } from "lucide-react"

  interface CreditOverviewProps {
    creditsRemaining: number
    creditsMax: number
    resetDate: Date
    isFree: boolean
  }

  export function CreditOverview({ creditsRemaining, creditsMax, resetDate, isFree }: CreditOverviewProps) {
    const usagePercent = Math.max(0, Math.min(100, (creditsRemaining / creditsMax) * 100))
    const formattedReset = new Date(resetDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    })

    return (
      <Card className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background border-primary/25">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-amber-500 fill-amber-500" /> AI Usage Credits
          </CardTitle>
          <Badge variant={usagePercent < 10 ? "destructive" : "secondary"}>
            {Math.round(usagePercent)}% Available
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black">{creditsRemaining}</span>
            <span className="text-sm text-muted-foreground">/ {creditsMax} remaining</span>
          </div>
          <Progress value={usagePercent} className="h-2 bg-muted" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Resets on {formattedReset}</span>
            {isFree && (
              <a href="/pricing" className="text-primary font-bold hover:underline">
                Get more credits &rarr;
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }
  ```

- [ ] **Step 2: Add CreditOverview to Dashboard page**
  Query `creditsRemaining`, `creditsResetAt` and `role` fields from database inside `src/app/dashboard/page.tsx`, and render the component.

- [ ] **Step 3: Commit dashboard changes**
  ```bash
  git add src/components/dashboard/credit-overview.tsx src/app/dashboard/page.tsx
  git commit -m "feat(dashboard): add CreditOverview card"
  ```

---

### Task 5: Admin Panel Support

**Files:**
- Modify: `src/app/api/admin/users/[userId]/route.ts` (or create if needed)
- Modify: `src/app/api/admin/users/route.ts`
- Modify: `src/app/admin/users/page.tsx`

- [ ] **Step 1: Extend admin fetch endpoints**
  Make sure `/api/admin/users` returns `creditsRemaining` and `creditsResetAt` for all user listings.

- [ ] **Step 2: Add credit update PATCH route**
  Create or modify the admin user update endpoint `src/app/api/admin/users/[userId]/route.ts` to allow adjusting credits:
  ```typescript
  import { prisma } from "@/lib/prisma"
  // Inside PATCH:
  const body = await req.json()
  const { creditsRemaining } = body
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { creditsRemaining: parseInt(creditsRemaining) }
  })
  ```

- [ ] **Step 3: Update Admin User list view**
  Show the credits column and add a dialog/input to adjust credits directly from the dashboard view in `src/app/admin/users/page.tsx`.

- [ ] **Step 4: Commit Admin changes**
  ```bash
  git add src/app/admin/ src/app/api/admin/
  git commit -m "feat(admin): support user credit displaying and adjustments"
  ```

---

### Task 6: Build & Validation

- [ ] **Step 1: Check build & types**
  Run:
  ```bash
  npx tsc --noEmit
  npm run build
  ```
