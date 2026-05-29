# Spec: Global Multi-Currency Pricing

We are adding multi-currency (USD/INR) support to the pricing catalog and checkout triggers.

## Goal
Improve conversion rates for users outside of India by displaying plans in USD ($) and prioritizing PayPal checkout, while keeping INR (₹) and prioritizing Razorpay for users in India.

## Proposed Changes

### 1. Pricing Page Cards (`src/components/pricing/pricing-cards.tsx`)
- Add a new state `currency` ("INR" | "USD").
- On mount (`useEffect`), perform browser timezone checking:
  - If the timezone does not start with `Asia/Kolkata` or `Asia/Calcutta`, default the currency to `"USD"`.
  - Otherwise, default to `"INR"`.
- Render a stylish manual Currency Selector (tabs or pills) next to the monthly/yearly billing toggle.
- Condition the displayed symbol (`₹` vs `$`) and pricing values (`price` vs `usdPrice`) based on the currency state.
- Pass the chosen currency preference to `UpgradeButton`.

### 2. Payment Checkout Modal (`src/components/pricing/upgrade-button.tsx`)
- Receive `currency` ("INR" | "USD") as a prop.
- Re-order/prioritize the payment buttons:
  - If `currency === "USD"`, list PayPal first as the primary method, with Razorpay below as secondary.
  - If `currency === "INR"`, list Razorpay first as the primary method, with PayPal below as secondary.

## Verification
- Run typescript compilation checks (`npx tsc --noEmit`).
- Run production build checks (`npm run build`).
