# PayPal & Razorpay Subscriptions Integration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transition payment workflows from one-time simulated payments to native PayPal and Razorpay recurring subscriptions using existing database schemas.

**Architecture:** Map merchant-configured Plan IDs in environment configuration. Create backend routes to initialize subscription orders on the respective gateways, and handle renewal/cancellations via webhook events.

**Tech Stack:** Next.js, Prisma, Razorpay SDK, PayPal REST APIs.

---

## 🛠️ Tasks

### Task 1: Environment Plan Configurations

**Files:**
- Create: `src/config/subscriptions.ts`
- Modify: `.env.example`

- [ ] **Step 1: Create subscriptions.ts file**
  Write the map associating tier/interval keys with environment variables.
  ```typescript
  export const SUBSCRIPTION_PLANS = {
    paypal: {
      PRO_MONTHLY: process.env.PAYPAL_PLAN_PRO_MONTHLY || "",
      PRO_YEARLY: process.env.PAYPAL_PLAN_PRO_YEARLY || "",
      BUSINESS_MONTHLY: process.env.PAYPAL_PLAN_BUSINESS_MONTHLY || "",
      BUSINESS_YEARLY: process.env.PAYPAL_PLAN_BUSINESS_YEARLY || "",
    },
    razorpay: {
      PRO_MONTHLY: process.env.RAZORPAY_PLAN_PRO_MONTHLY || "",
      PRO_YEARLY: process.env.RAZORPAY_PLAN_PRO_YEARLY || "",
      BUSINESS_MONTHLY: process.env.RAZORPAY_PLAN_BUSINESS_MONTHLY || "",
      BUSINESS_YEARLY: process.env.RAZORPAY_PLAN_BUSINESS_YEARLY || "",
    }
  };
  ```
- [ ] **Step 2: Add placeholder variables to .env.example**
  Add keys for plans to `.env.example`.
- [ ] **Step 3: Verify configuration typechecks**
  Run: `npx tsc --noEmit`
  Expected: PASS

---

### Task 2: PayPal Subscriptions backend functions & routes

**Files:**
- Modify: `src/lib/paypal.ts`
- Create: `src/app/api/paypal/create-subscription/route.ts`

- [ ] **Step 1: Add createPayPalSubscription to paypal.ts**
  Create subscription request payload targeting the `/v1/billing/subscriptions` PayPal endpoint.
- [ ] **Step 2: Create api/paypal/create-subscription/route.ts**
  Create Next.js API handler resolving the requested tier to Plan ID, calling `createPayPalSubscription`.
- [ ] **Step 3: Verify TypeScript compilation**
  Run: `npx tsc --noEmit`
  Expected: PASS

---

### Task 3: Razorpay Subscriptions backend SDK setup & routes

**Files:**
- Create: `src/app/api/razorpay/create-subscription/route.ts`

- [ ] **Step 1: Create api/razorpay/create-subscription/route.ts**
  Resolve tier/interval, make calls using `razorpay.subscriptions.create(...)` passing the required plan ID, and return the subscription payload.
- [ ] **Step 2: Verify compile correctness**
  Run: `npx tsc --noEmit`
  Expected: PASS

---

### Task 4: Webhook Handler for PayPal Subscriptions

**Files:**
- Modify: `src/app/api/webhooks/paypal/route.ts`

- [ ] **Step 1: Parse and handle subscription webhooks**
  Update webhook logic to process subscription events:
  - `BILLING.SUBSCRIPTION.ACTIVATED`: Set subscription record active.
  - `PAYMENT.SALE.COMPLETED`: Renew expiry (`currentPeriodEnd` + 1 month/year) and user `role`.
  - `BILLING.SUBSCRIPTION.CANCELLED` / `BILLING.SUBSCRIPTION.EXPIRED`: Set status to cancelled/expired and adjust access boundaries.
- [ ] **Step 2: Verify file typechecks**
  Run: `npx tsc --noEmit`
  Expected: PASS

---

### Task 5: Webhook Handler for Razorpay Subscriptions

**Files:**
- Modify: `src/app/api/webhooks/razorpay/route.ts`

- [ ] **Step 1: Parse and handle Razorpay subscription events**
  Support:
  - `subscription.charged`: Extend active period and user Pro/Business role.
  - `subscription.cancelled` / `subscription.expired`: Revert user level to Free.
- [ ] **Step 2: Verify typechecking**
  Run: `npx tsc --noEmit`
  Expected: PASS

---

### Task 6: Update Pricing Upgrade UI Button

**Files:**
- Modify: `src/components/pricing/upgrade-button.tsx`

- [ ] **Step 1: Update PayPal Button option payload**
  Instead of `createOrder` calling orders API, mount standard PayPal buttons configured with `createSubscription` pointing to the subscription billing endpoints.
- [ ] **Step 2: Update Razorpay Checkout options**
  Pass `subscription_id` instead of `order_id` in Razorpay options configuration.
- [ ] **Step 3: Verify frontend typechecks**
  Run: `npx tsc --noEmit`
  Expected: PASS

---

### Task 7: Update Billing Portal Dashboard

**Files:**
- Modify: `src/app/dashboard/billing/page.tsx`
- Create: `src/app/api/subscription/cancel/route.ts`

- [ ] **Step 1: Create cancel subscription API**
  API calls to PayPal and Razorpay subscription cancel endpoints depending on `paymentProvider`.
- [ ] **Step 2: Update Billing Page layout**
  Add a "Cancel Subscription" button showing cancellation status and expiration details.
- [ ] **Step 3: Run full verification build**
  Run: `npm run build`
  Expected: PASS
