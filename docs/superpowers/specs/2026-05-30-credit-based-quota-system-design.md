# Design Specification: Credit-Based Quota System

## Background & Goal
Currently, client-side soft limits exist using localStorage to track tool usage. However, for AI tools backed by paid APIs (Google Gemini `gemini-2.5-flash`), this configuration is insecure. To protect system usage and prevent high billing costs, we are implementing a database-backed, tier-based credit quota system for all AI-powered actions. 

Additionally, superusers require the ability to view and manually adjust user credit balances from the admin panel (`/admin/users`).

## Quota Allocations
* **Free Plan:** 20 credits / month
* **Pro Plan:** 500 credits / month
* **Business Plan:** 2,000 credits / month

## Credit Consumption Rules
* **0 Credits (Free):** All non-AI utilities (GST calculator, Image converters, SEO tag analyzer, etc.), and Dynamic QR Code generations.
* **1 Credit:** Standard AI generators (AI Caption Generator, AI SEO Meta Generator, AI Prompt Optimizer, AI llms.txt Builder).
* **3 Credits:** Heavy AI utilities (AI CV Builder, CV Parser, LinkedIn profile imports).

---

## Technical Architecture

### 1. Database Schema (`prisma/schema.prisma`)
Add quota fields to the `User` model:
```prisma
model User {
  id                String    @id @default(cuid())
  // ... existing fields ...
  creditsRemaining  Int       @default(20)
  creditsResetAt    DateTime  @default(now())
}
```

### 2. Quota Check & Deduction Helper (`src/lib/credits.ts`)
Write helper functions:
* **`getCurrentCreditAllocation(role: string): number`**
  Returns credit count based on user subscription/role (Free → 20, Pro/Premium → 500, Business → 2000).
* **`verifyAndDeductCredits(userId: string, cost: number): Promise<{ success: boolean; remaining: number }>`**
  - Fetch the user's role, `creditsRemaining`, and `creditsResetAt` from the database.
  - If `new Date() >= creditsResetAt`:
    - Calculate the next reset date (exactly 1 month from `creditsResetAt` if Pro/Business, or 1st of next month if Free).
    - Update `creditsRemaining = allocation` and `creditsResetAt = nextResetDate` in the database.
  - If `creditsRemaining >= cost`:
    - Decrement `creditsRemaining = creditsRemaining - cost`.
    - Return `{ success: true, remaining: newBalance }`.
  - Else:
    - Return `{ success: false, remaining: currentBalance }`.

### 3. API Integration
Inject `verifyAndDeductCredits` at the beginning of each generative AI route handler. If `success: false` is returned, abort generation and return `403 Forbidden` with a descriptive JSON response.

### 4. Admin Panel Support (`/admin/users`)
* **Display:** Extend the user listing page to display `Credits Remaining` and `Next Reset Date`.
* **Actions:** Add a modal or inline action to update/override a user's credit balance (`creditsRemaining`) which calls a new `PATCH /api/admin/users/[userId]` endpoint.

### 5. Premium Dashboard UI
Create a card widget inside the Dashboard overview page:
* Shows a sleek visual progress bar (`Remaining / Maximum`).
* Shows next reset date context.
* Provides a quick action linking to the upgrade flow if low on credits.

---

## Verification Plan

### Automated Tests
* Run `npx tsc --noEmit` to ensure type safety.
* Run `npm run build` to verify production builds.

### Manual Verification
* Test a Free account to verify that generating 20 captions blocks further generations and returns a Quota Exceeded state.
* Verify that upgrading a user account resets their credits to the corresponding plan amount.
* Verify admin credit adjustments apply successfully in the database.
