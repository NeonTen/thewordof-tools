# Design Document: Credit Quota Reset on Plan Upgrade

## Goal Description
Fix the issue where users who upgrade to Pro or Business still see their old Free credit count (e.g. 19/500 remaining) instead of their new plan's default quota (500 or 2000). We will update the sync plan action and all payment capture and webhook routes to initialize credits when the user's role is updated to PRO or BUSINESS.

## Proposed Changes

### Subscription Sync Action
* `src/app/actions/subscription.ts`: If user is PRO/BUSINESS and creditsRemaining is <= 20, reset creditsRemaining to plan default and set creditsResetAt to one month from now.

### Payment Capture and Webhook Routes
Initialize `creditsRemaining` and `creditsResetAt` to plan defaults when updating user roles in:
* `src/app/api/razorpay/verify/route.ts`
* `src/app/api/paypal/capture-order/route.ts`
* `src/app/api/webhooks/razorpay/route.ts`
* `src/app/api/webhooks/paypal/route.ts`

## Verification Plan
* Validate build with `npm run build` and `npx tsc --noEmit`.
