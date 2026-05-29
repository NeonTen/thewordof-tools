# Design Specification: Dynamic Email Links & Admin Notifications

## Background & Goal
Currently, success and failure transactional emails hardcode the domain URL to `https://tools.thewordof.com/dashboard` and `https://tools.thewordof.com/pricing`. In production, the tools and user dashboards are located under the main `https://thewordof.com` domain. Additionally, admins need real-time email notification when a customer successfully subscribes or fails a payment attempt to monitor billing health.

This design updates the URL logic to use `process.env.NEXT_PUBLIC_APP_URL` and implements transactional admin notification emails to `info@thewordof.com`.

## Proposed Changes

### 1. Link Dynamism in `src/lib/email.ts`
- Extract a base URL:
  ```typescript
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://thewordof.com";
  ```
- Replace hardcoded `https://tools.thewordof.com/dashboard` with `${baseUrl}/dashboard` in success emails.
- Replace hardcoded `https://tools.thewordof.com/pricing` with `${baseUrl}/pricing` in payment failed emails.

### 2. Admin Email Notifications
- Send copy or summary emails to the admin address `info@thewordof.com` upon success/failure triggers:
  - **Success Notifications:** Sent when `sendPaymentSuccessEmail` executes.
    - **Subject:** `[Admin Notification] New Subscription Activated — ${badgeText}`
    - **Content:** Key-value layout featuring the subscriber's name, email, plan, provider, transaction ID, and amount paid.
  - **Failure Notifications:** Sent when `sendPaymentFailedEmail` executes.
    - **Subject:** `[Admin Notification] Payment Failed — ${planName}`
    - **Content:** Subscriber's email/name, intended plan, amount, gateway provider, and the error decline reason.

## Verification Plan

### Automated Tests
- Verification using TypeScript type-checking to ensure variables and imports are correct:
  ```bash
  npx tsc --noEmit
  ```

### Manual Verification
- Reviewing Resend logs / stdout logs on local development when testing checkout flows to confirm recipient and URL structures.
