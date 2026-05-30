# Multi-Currency Pricing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Auto-detect user timezone to show ₹ INR or $ USD pricing, add a manual pill toggle, and adapt the payment dialog so USD users only see PayPal.

**Architecture:** `PricingCards` (client component) gains a `currency` state initialised to `"INR"`, then a `useEffect` reads the browser timezone on mount and switches to `"USD"` for non-India locales. A pill toggle in the header row lets users override. The `currency` value is passed as a prop to `UpgradeButton`, which conditionally hides Razorpay and adjusts copy when currency is `"USD"`.

**Tech Stack:** Next.js 16 (App Router), React `useState`/`useEffect`, `Intl.DateTimeFormat` browser API, Razorpay checkout, `@paypal/react-paypal-js`

**Spec:** `docs/superpowers/specs/2026-05-29-multi-currency-pricing-design.md`

---

### Task 1: Add currency state + timezone detection to PricingCards

**Files:**
- Modify: `src/components/pricing/pricing-cards.tsx`

- [ ] **Step 1: Add `useEffect` import and `currency` state**

  At the top of `pricing-cards.tsx`, the existing import is:
  ```ts
  import { useState } from "react"
  ```
  Change it to:
  ```ts
  import { useState, useEffect } from "react"
  ```

  Inside `PricingCards`, after the existing `const [isYearly, setIsYearly] = useState(false)` line, add:
  ```ts
  const [currency, setCurrency] = useState<"INR" | "USD">("INR")

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
      setCurrency(tz === "Asia/Kolkata" ? "INR" : "USD")
    } catch {
      // fallback: keep "INR" default
    }
  }, [])
  ```

- [ ] **Step 2: Verify the state compiles**

  Run: `npx tsc --noEmit`
  Expected: no errors

- [ ] **Step 3: Commit**

  ```bash
  git add src/components/pricing/pricing-cards.tsx
  git commit -m "feat(pricing): add currency state with timezone auto-detection"
  ```

---

### Task 2: Add currency pill toggle to the toggle row + dynamic price display

**Files:**
- Modify: `src/components/pricing/pricing-cards.tsx`

- [ ] **Step 1: Replace the toggle row JSX**

  Find the existing toggle row (the `<div className="flex justify-center items-center gap-3">` block). Replace it entirely with:

  ```tsx
  {/* Billing period + currency toggle row */}
  <div className="flex flex-wrap justify-center items-center gap-4">
    {/* Monthly / Yearly toggle */}
    <div className="flex items-center gap-3">
      <span className={cn("text-sm font-bold", !isYearly ? "text-foreground" : "text-muted-foreground")}>Monthly</span>
      <button
        onClick={() => setIsYearly(!isYearly)}
        className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-primary"
        role="switch"
        aria-checked={isYearly}
      >
        <span className={cn("pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out", isYearly ? "translate-x-5" : "translate-x-0")} />
      </button>
      <span className={cn("text-sm font-bold flex items-center gap-1.5", isYearly ? "text-foreground" : "text-muted-foreground")}>
        Yearly <span className="text-[10px] bg-green-500/20 text-green-600 px-2 py-0.5 rounded-full uppercase tracking-widest font-black">Save 20%</span>
      </span>
    </div>

    {/* Vertical divider */}
    <div className="hidden sm:block h-5 w-px bg-border" />

    {/* Currency pill toggle */}
    <div className="flex items-center gap-1 bg-muted/50 border border-border rounded-full p-1">
      <button
        onClick={() => setCurrency("INR")}
        className={cn(
          "px-3 py-1 rounded-full text-xs font-black transition-all duration-200",
          currency === "INR"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        ₹ INR
      </button>
      <button
        onClick={() => setCurrency("USD")}
        className={cn(
          "px-3 py-1 rounded-full text-xs font-black transition-all duration-200",
          currency === "USD"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        $ USD
      </button>
    </div>
  </div>
  ```

- [ ] **Step 2: Update price display in each card**

  Inside the card `.map()`, find the price display JSX:
  ```tsx
  <span className="text-5xl font-black tracking-tight">₹{price}</span>
  ```
  Replace with:
  ```tsx
  <span className="text-5xl font-black tracking-tight">
    {currency === "INR" ? `₹${price}` : `$${usdPrice}`}
  </span>
  ```

- [ ] **Step 3: Type-check**

  Run: `npx tsc --noEmit`
  Expected: no errors

- [ ] **Step 4: Commit**

  ```bash
  git add src/components/pricing/pricing-cards.tsx
  git commit -m "feat(pricing): add INR/USD pill toggle and dynamic price display"
  ```

---

### Task 3: Thread currency prop to UpgradeButton

**Files:**
- Modify: `src/components/pricing/upgrade-button.tsx`
- Modify: `src/components/pricing/pricing-cards.tsx`

- [ ] **Step 1: Add `currency` to `UpgradeButtonProps` in upgrade-button.tsx**

  Find the `interface UpgradeButtonProps` block and add `currency`:
  ```ts
  interface UpgradeButtonProps {
    user: { name?: string | null; email?: string | null; id?: string | null } | null | undefined
    className?: string
    children: React.ReactNode
    amount?: number
    usdAmount?: string
    plan?: string
    interval?: string
    currency?: "INR" | "USD"
  }
  ```

- [ ] **Step 2: Destructure `currency` + rename `_usdAmount` → `usdAmount`**

  Find the function signature:
  ```ts
  export function UpgradeButton({ 
    user, 
    className, 
    children,
    amount = 499,
    usdAmount: _usdAmount = "5.99",
    plan = "PREMIUM",
    interval = "month"
  }: UpgradeButtonProps) {
  ```
  Replace with:
  ```ts
  export function UpgradeButton({ 
    user, 
    className, 
    children,
    amount = 499,
    usdAmount = "5.99",
    plan = "PREMIUM",
    interval = "month",
    currency = "INR"
  }: UpgradeButtonProps) {
  ```

- [ ] **Step 3: Pass `currency` from pricing-cards.tsx**

  In `pricing-cards.tsx`, find the `<UpgradeButton` usage and add the `currency` prop:
  ```tsx
  <UpgradeButton 
    user={session?.user}
    className={plan.highlight ? "shadow-lg shadow-primary/20" : ""}
    amount={price}
    usdAmount={usdPrice}
    plan={plan.plan}
    interval={isYearly ? "year" : "month"}
    currency={currency}
  >
    {overrideBtnText || plan.cta}
  </UpgradeButton>
  ```

- [ ] **Step 4: Type-check**

  Run: `npx tsc --noEmit`
  Expected: no errors

- [ ] **Step 5: Commit**

  ```bash
  git add src/components/pricing/pricing-cards.tsx src/components/pricing/upgrade-button.tsx
  git commit -m "feat(pricing): thread currency prop from PricingCards to UpgradeButton"
  ```

---

### Task 4: Adapt payment dialog for USD users in UpgradeButton

**Files:**
- Modify: `src/components/pricing/upgrade-button.tsx`

- [ ] **Step 1: Replace dialog inner content with currency-aware layout**

  Find the `<DialogContent className="sm:max-w-md">` block and replace everything inside it with:

  ```tsx
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Choose Payment Method</DialogTitle>
      <DialogDescription>
        {currency === "USD"
          ? "Pay securely with PayPal — accepted in 200+ countries."
          : `Select your preferred way to pay for TheWordOf Tools ${plan}.`}
      </DialogDescription>
    </DialogHeader>
    <div className="space-y-4 py-4">
      {/* Razorpay — INR only */}
      {currency === "INR" && (
        <Button 
          variant="outline" 
          className="w-full h-16 text-lg font-bold flex items-center justify-between px-6 border-2 hover:border-primary hover:bg-primary/5 transition-all"
          onClick={handleRazorpay}
          disabled={loading}
        >
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/10 p-2 rounded-lg">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-left">
              <p>Razorpay</p>
              <p className="text-[10px] text-muted-foreground font-normal">UPI, Cards, Netbanking (India)</p>
            </div>
          </div>
          <span className="text-primary">₹{amount}</span>
        </Button>
      )}

      {/* Divider — only when both options visible */}
      {currency === "INR" && (
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or pay with</span>
          </div>
        </div>
      )}

      {/* PayPal — always shown */}
      <PayPalScriptProvider options={{ 
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
        currency: "USD",
        vault: true
      }}>
        <PayPalButtons 
          style={{ layout: "vertical", shape: "rect", label: "paypal" }}
          disabled={!user}
          createSubscription={async () => {
            const res = await fetch("/api/paypal/create-subscription", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ plan, interval })
            })
            const sub = await res.json()
            return sub.id
          }}
          onApprove={async () => {
            router.push("/dashboard?status=success")
          }}
        />
      </PayPalScriptProvider>

      {/* USD security note */}
      {currency === "USD" && (
        <p className="text-[10px] text-center text-muted-foreground">
          🔒 Secured by PayPal — ${usdAmount}/{interval}
        </p>
      )}

      {!user && (
        <p className="text-[10px] text-center text-destructive font-bold">
          Please login to proceed with payment.
        </p>
      )}
    </div>
  </DialogContent>
  ```

- [ ] **Step 2: Type-check**

  Run: `npx tsc --noEmit`
  Expected: no errors

- [ ] **Step 3: Commit**

  ```bash
  git add src/components/pricing/upgrade-button.tsx
  git commit -m "feat(pricing): PayPal-only dialog for USD, hide Razorpay for international users"
  ```

---

### Task 5: Final verification

**Files:** none (verification only)

- [ ] **Step 1: Full type check**

  Run: `npx tsc --noEmit`
  Expected: no output (clean)

- [ ] **Step 2: Production build**

  Run: `npm run build`
  Expected: build completes with no errors

- [ ] **Step 3: Smoke test — INR path**

  Open pricing page (`/pricing`). Your timezone is `Asia/Kolkata` so it auto-selects INR.
  - Prices show `₹499`, `₹999`
  - `₹ INR` pill is active (filled)
  - Click "Upgrade to Pro" → dialog shows Razorpay first + PayPal second

- [ ] **Step 4: Smoke test — USD path**

  Click the `$ USD` pill on the pricing page:
  - Prices switch to `$5.99`, `$19.99`
  - Click "Upgrade to Pro" → dialog shows **only PayPal** + "🔒 Secured by PayPal — $5.99/month" note
  - No Razorpay button visible

- [ ] **Step 5: Final commit**

  ```bash
  git add -A
  git commit -m "feat(pricing): multi-currency pricing complete"
  ```
