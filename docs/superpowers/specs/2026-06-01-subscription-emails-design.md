# Subscription Webhook Emails Design Spec

Enable automated welcome/success emails when subscriptions are activated via PayPal and Razorpay.

## Proposed Changes

### [`src/app/api/webhooks/paypal/route.ts`](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/app/api/webhooks/paypal/route.ts)

- Import `sendPaymentSuccessEmail` and `PLAN_PRICING`.
- Trigger `sendPaymentSuccessEmail` with computed pricing amount and USD currency when `BILLING.SUBSCRIPTION.ACTIVATED` matches and is ACTIVE.

### [`src/app/api/webhooks/razorpay/route.ts`](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/app/api/webhooks/razorpay/route.ts)

- Import `sendPaymentSuccessEmail`.
- Trigger `sendPaymentSuccessEmail` when `subscription.charged` matches.

## Verification Plan

### Automated
- Run `npm run build` to verify the codebase compiles successfully.
