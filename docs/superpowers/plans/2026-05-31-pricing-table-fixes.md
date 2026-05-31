# Pricing Table and Comparison Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct the pricing lists (in cards and comparison table) to clarify QR code analytics levels, add SVG component exports, and deduplicate Business plan items.

**Architecture:** Update the static data structures representing plans and features in `pricing-cards.tsx` and `src/app/page.tsx`.

**Tech Stack:** React, Next.js, Tailwind CSS

---

### Task 1: Update Pricing Cards Features List

**Files:**
- Modify: `src/components/pricing/pricing-cards.tsx`

- [ ] **Step 1: Replace features arrays**

In [`src/components/pricing/pricing-cards.tsx`](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/pricing/pricing-cards.tsx), replace the `features` arrays for Free, Pro, and Business plans inside the `plans` constant (lines 48-118).

Original (Free, Pro, Business feature lists):
```typescript
      features: [
        { label: "All 13 tools included", included: true },
        { label: `${PLAN_PRICING.FREE.credits} monthly AI credits (shared pool)`, included: true },
        { label: "5 images per batch", included: true },
        { label: "5 SVGs per batch", included: true },
        { label: "3 invoices per month", included: true },
        { label: "All calculators unlimited", included: true },
        { label: "Code Minifier & Text Diff", included: true },
        { label: "1 dynamic QR code (15-day expiry)", included: true },
        { label: "500 monthly AI credits", included: false },
        { label: "2,000 monthly AI credits", included: false },
        { label: "Unlimited batch processing", included: false },
        { label: "Bulk ZIP downloads", included: false },
        { label: "Unlimited invoices", included: false },
        { label: "Dynamic QR scan analytics", included: false },
        { label: "Cloud progress & history tracking", included: false },
        { label: "Priority Tool Requests", included: false },
      ],
    },
    {
      name: "Pro",
      monthlyPrice: PLAN_PRICING.PREMIUM.monthly.INR,
      yearlyPrice: PLAN_PRICING.PREMIUM.yearly.INR,
      monthlyUsd: PLAN_PRICING.PREMIUM.monthly.USD.toString(),
      yearlyUsd: PLAN_PRICING.PREMIUM.yearly.USD.toString(),
      plan: "PREMIUM",
      description: "For power users and professionals who need higher limits and premium tools.",
      cta: "Upgrade to Pro",
      highlight: true,
      badge: "Most Popular",
      features: [
        { label: "Everything in Free", included: true },
        { label: `${PLAN_PRICING.PREMIUM.credits} monthly AI credits (shared pool)`, included: true },
        { label: "AI CV builder (Costs 1 credit)", included: true },
        { label: "Up to 1,000 files per batch", included: true },
        { label: "Bulk ZIP downloads", included: true },
        { label: "Unlimited invoices + branding", included: true },
        { label: "Unlimited dynamic QR codes", included: true },
        { label: "Dynamic QR scan analytics dashboard", included: true },
        { label: "Cloud progress & history tracking", included: true },
        { label: "No upgrade banners", included: true },
        { label: "Early access to new tools", included: true },
        { label: "Email support", included: true },
        { label: "2,000 monthly AI credits", included: false },
        { label: "Priority Tool Requests", included: false },
      ],
    },
    {
      name: "Business",
      monthlyPrice: PLAN_PRICING.BUSINESS.monthly.INR,
      yearlyPrice: PLAN_PRICING.BUSINESS.yearly.INR,
      monthlyUsd: PLAN_PRICING.BUSINESS.monthly.USD.toString(),
      yearlyUsd: PLAN_PRICING.BUSINESS.yearly.USD.toString(),
      plan: "BUSINESS",
      description: "For power creators and businesses needing unlimited processing and priority support.",
      cta: "Upgrade to Business",
      highlight: false,
      features: [
        { label: "Everything in Pro", included: true },
        { label: `${PLAN_PRICING.BUSINESS.credits} monthly AI credits (shared pool)`, included: true },
        { label: "AI CV builder & AI Import (Costs 1-3 credits)", included: true },
        { label: "100% Unlimited batch processing", included: true },
        { label: "Bulk ZIP downloads", included: true },
        { label: "Unlimited invoices + branding", included: true },
        { label: "Unlimited dynamic QR codes + analytics", included: true },
        { label: "Cloud progress & history tracking", included: true },
        { label: "No upgrade banners", included: true },
        { label: "Early access to new tools", included: true },
        { label: "24/7 Priority Support", included: true },
        { label: "Priority Tool Requests", included: true },
      ],
    },
```

Replacement:
```typescript
      features: [
        { label: "All 13 tools included", included: true },
        { label: `${PLAN_PRICING.FREE.credits} monthly AI credits (shared pool)`, included: true },
        { label: "5 images per batch", included: true },
        { label: "5 SVGs per batch", included: true },
        { label: "3 invoices per month", included: true },
        { label: "All calculators unlimited", included: true },
        { label: "Code Minifier & Text Diff", included: true },
        { label: "1 dynamic QR code (15-day expiry)", included: true },
        { label: "500 monthly AI credits", included: false },
        { label: "2,000 monthly AI credits", included: false },
        { label: "Unlimited batch processing", included: false },
        { label: "Bulk ZIP downloads", included: false },
        { label: "Unlimited invoices", included: false },
        { label: "Basic dynamic QR analytics (timeline/device/browser)", included: false },
        { label: "Geographic (country/city) scan tracking", included: false },
        { label: "Export SVGs as React/Vue/Svelte components", included: false },
        { label: "Cloud progress & history tracking", included: false },
        { label: "Priority Tool Requests", included: false },
      ],
    },
    {
      name: "Pro",
      monthlyPrice: PLAN_PRICING.PREMIUM.monthly.INR,
      yearlyPrice: PLAN_PRICING.PREMIUM.yearly.INR,
      monthlyUsd: PLAN_PRICING.PREMIUM.monthly.USD.toString(),
      yearlyUsd: PLAN_PRICING.PREMIUM.yearly.USD.toString(),
      plan: "PREMIUM",
      description: "For power users and professionals who need higher limits and premium tools.",
      cta: "Upgrade to Pro",
      highlight: true,
      badge: "Most Popular",
      features: [
        { label: "Everything in Free", included: true },
        { label: `${PLAN_PRICING.PREMIUM.credits} monthly AI credits (shared pool)`, included: true },
        { label: "AI CV builder (Costs 1 credit)", included: true },
        { label: "Up to 1,000 files per batch", included: true },
        { label: "Bulk ZIP downloads", included: true },
        { label: "Unlimited invoices + branding", included: true },
        { label: "Unlimited dynamic QR codes", included: true },
        { label: "Basic dynamic QR analytics (timeline/device/browser)", included: true },
        { label: "Export SVGs as React/Vue/Svelte components", included: true },
        { label: "Cloud progress & history tracking", included: true },
        { label: "No upgrade banners", included: true },
        { label: "Early access to new tools", included: true },
        { label: "Email support", included: true },
        { label: "Geographic (country/city) scan tracking", included: false },
        { label: "2,000 monthly AI credits", included: false },
        { label: "Priority Tool Requests", included: false },
      ],
    },
    {
      name: "Business",
      monthlyPrice: PLAN_PRICING.BUSINESS.monthly.INR,
      yearlyPrice: PLAN_PRICING.BUSINESS.yearly.INR,
      monthlyUsd: PLAN_PRICING.BUSINESS.monthly.USD.toString(),
      yearlyUsd: PLAN_PRICING.BUSINESS.yearly.USD.toString(),
      plan: "BUSINESS",
      description: "For power creators and businesses needing unlimited processing and priority support.",
      cta: "Upgrade to Business",
      highlight: false,
      features: [
        { label: "Everything in Pro", included: true },
        { label: `${PLAN_PRICING.BUSINESS.credits} monthly AI credits (shared pool)`, included: true },
        { label: "AI CV builder & AI Import (Costs 1-3 credits)", included: true },
        { label: "100% Unlimited batch processing", included: true },
        { label: "Geographic (country/city) scan tracking", included: true },
        { label: "No upgrade banners", included: true },
        { label: "Early access to new tools", included: true },
        { label: "24/7 Priority Support", included: true },
        { label: "Priority Tool Requests", included: true },
      ],
    },
```

---

### Task 2: Update Home Page Comparison Table

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Replace comparison table rows**

In [`src/app/page.tsx`](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/app/page.tsx), replace lines 223-224 inside the comparison table features list.

Original:
```typescript
                        ["Dynamic QR Codes", "1 (15-day expiry)", "Unlimited (Lifetime)", "Unlimited + Analytics"],
                        ["Advanced SEO Schema", "Basic", "Advanced", "Advanced"],
```

Replacement:
```typescript
                        ["Dynamic QR Codes", "1 (15-day expiry)", "Unlimited (Lifetime)", "Unlimited (Lifetime)"],
                        ["Dynamic QR Analytics", "—", "Basic (Timeline, Device, Browser)", "Advanced (Timeline, Device, Browser + Geo Country/City)"],
                        ["SVG Framework Exports", "—", "✅ Yes (React/Vue/Svelte)", "✅ Yes (React/Vue/Svelte)"],
                        ["Advanced SEO Schema", "Basic", "Advanced", "Advanced"],
```

- [ ] **Step 2: Commit changes**

Run:
```bash
git add src/components/pricing/pricing-cards.tsx src/app/page.tsx
git commit -m "feat(pricing): fix pricing cards, deduplicate business options, and add SVG exports"
```
