# Multi-Currency Pricing Design Spec

**Date:** 2026-05-29  
**Status:** Approved  
**Scope:** `pricing-cards.tsx`, `upgrade-button.tsx`

---

## Overview

TheWordOf Tools targets a global audience. Currently all pricing is displayed in ₹ INR and the checkout always prioritises Razorpay — which is India-only. This change auto-detects the user's region using browser timezone and displays pricing in $ USD for international users, with a manual override pill. The checkout dialog adapts accordingly: INR users see Razorpay first, USD users see only PayPal.

---

## Design Decisions

| # | Decision | Choice | Rationale |
|---|---|---|---|
| 1 | Detection method | Browser timezone | Zero cost, zero API calls, instant, accurate for 95%+ of users |
| 2 | Manual override | Pill toggle (₹ INR / $ USD) next to billing toggle | Consistent with existing UI patterns, unobtrusive |
| 3 | Payment dialog (USD) | PayPal only, Razorpay hidden | Razorpay is India-specific — showing it to international users causes confusion |

---

## Detection Logic

```ts
// In PricingCards on mount
const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
const isIndia = tz === "Asia/Kolkata"
setCurrency(isIndia ? "INR" : "USD")
```

- Default state before detection resolves: `"INR"` (avoids layout shift for the majority of users who are Indian)
- Detection runs once on mount via `useEffect`
- User can manually override via the pill toggle at any time

---

## UI Changes

### Pricing Cards (`pricing-cards.tsx`)

**New state:**
```ts
const [currency, setCurrency] = useState<"INR" | "USD">("INR")
```

**Timezone detection on mount:**
```ts
useEffect(() => {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  setCurrency(tz === "Asia/Kolkata" ? "INR" : "USD")
}, [])
```

**Currency pill toggle** — placed in the same flex row as the Monthly/Yearly toggle, separated by a vertical divider:

```
[ Monthly ] [toggle] [ Yearly  Save 20% ]    |    [ ₹ INR ] [ $ USD ]
```

- Active pill: filled background matching primary color
- Inactive pill: ghost/muted text
- Clicking either pill sets `currency` state

**Price display:**
- `currency === "INR"` → `₹{price}` (existing behaviour)
- `currency === "USD"` → `${usdPrice}` (from existing `monthlyUsd`/`yearlyUsd` fields)

**UpgradeButton props:**
- Pass `currency` as a new prop to `<UpgradeButton>`

### Plan Data (no changes needed)

All plans already have `monthlyUsd` and `yearlyUsd` fields populated:

| Plan | INR Monthly | USD Monthly | INR Yearly | USD Yearly |
|---|---|---|---|---|
| Free | ₹0 | $0.00 | ₹0 | $0.00 |
| Pro | ₹499 | $5.99 | ₹4,999 | $59.99 |
| Business | ₹999 | $19.99 | ₹9,999 | $199.99 |

---

## Payment Dialog (`upgrade-button.tsx`)

**New prop:**
```ts
currency?: "INR" | "USD"  // defaults to "INR"
```

**Conditional rendering:**

| Currency | Razorpay | PayPal |
|---|---|---|
| INR | Shown first (current behaviour) | Shown second |
| USD | Hidden | Shown only, with "200+ countries" note |

**USD dialog copy:**
- Title: `"Choose Payment Method"`
- Description: `"Pay securely with PayPal — accepted in 200+ countries"`
- No divider / "Or pay with" separator (only one option)
- Footer note: `"Secured by PayPal"`

---

## Error Handling

- If `Intl.DateTimeFormat` is unavailable (very old browser): `catch` falls back to `"INR"` silently
- If `usdAmount` is missing or `"0.00"` for a paid plan: fall back to showing INR price (shouldn't happen — all plans have USD prices populated)

---

## Out of Scope

- EUR or other currencies — USD only for non-India
- Server-side geo detection — timezone is sufficient
- Persisting currency preference across sessions — session-only state
- Changing Razorpay plan IDs for USD — Razorpay is not shown to USD users
- Any changes outside the two pricing component files

---

## Files Changed

| File | Type | Change |
|---|---|---|
| `src/components/pricing/pricing-cards.tsx` | MODIFY | Add `currency` state, timezone detection, pill toggle UI, pass `currency` to `UpgradeButton` |
| `src/components/pricing/upgrade-button.tsx` | MODIFY | Accept `currency` prop, conditionally render Razorpay (INR only) and PayPal (always) |

---

## Verification

- `npx tsc --noEmit` — no type errors
- `npm run build` — clean production build
- Manual: timezone `Asia/Kolkata` → ₹ shown by default, Razorpay in dialog
- Manual: timezone `America/New_York` → $ shown by default, only PayPal in dialog
- Manual: Toggle pill in both directions — price and dialog adapt correctly
