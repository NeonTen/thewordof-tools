# Subscription Webhook Emails Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate email notifications in PayPal and Razorpay subscription activation webhooks to send welcome receipts when users upgrade.

**Architecture:** Modify webhook POST endpoints to trigger `sendPaymentSuccessEmail` helper functions with appropriate currency, amount, and reference details.

**Tech Stack:** Next.js (TypeScript), Prisma, Resend API / email helper.

---

### Task 1: Update PayPal Webhook Email Trigger

**Files:**
- Modify: `src/app/api/webhooks/paypal/route.ts`

- [ ] **Step 1: Add imports**

Import `sendPaymentSuccessEmail` and `PLAN_PRICING` at the top of [`src/app/api/webhooks/paypal/route.ts`](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/app/api/webhooks/paypal/route.ts).

```typescript
import { sendPaymentSuccessEmail } from "@/lib/email";
import { PLAN_PRICING } from "@/config/pricing";
```

- [ ] **Step 2: Add email trigger inside `BILLING.SUBSCRIPTION.ACTIVATED`**

In [`src/app/api/webhooks/paypal/route.ts`](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/app/api/webhooks/paypal/route.ts), find the `BILLING.SUBSCRIPTION.ACTIVATED` section (around line 107, at the end of the `if (user)` block) and add the `sendPaymentSuccessEmail` invocation.

Original:
```typescript
          // Create or update subscription record
          await prisma.subscription.upsert({
            where: { subscriptionId },
            update: {
              status: "active",
              currentPeriodEnd: expiresAt,
            },
            create: {
              userId: user.id,
              plan: details.plan,
              status: "active",
              paymentProvider: "PAYPAL",
              subscriptionId: subscriptionId,
              interval: details.interval,
              currentPeriodEnd: expiresAt,
            },
          });
        }
      }
    }
```

Replacement:
```typescript
          // Create or update subscription record
          await prisma.subscription.upsert({
            where: { subscriptionId },
            update: {
              status: "active",
              currentPeriodEnd: expiresAt,
            },
            create: {
              userId: user.id,
              plan: details.plan,
              status: "active",
              paymentProvider: "PAYPAL",
              subscriptionId: subscriptionId,
              interval: details.interval,
              currentPeriodEnd: expiresAt,
            },
          });

          // Send payment success email
          const amount = details.role === "BUSINESS" 
            ? (details.interval === "year" ? PLAN_PRICING.BUSINESS.yearly.USD : PLAN_PRICING.BUSINESS.monthly.USD)
            : (details.interval === "year" ? PLAN_PRICING.PREMIUM.yearly.USD : PLAN_PRICING.PREMIUM.monthly.USD);

          sendPaymentSuccessEmail({
            toEmail: user.email!,
            userName: user.name || "User",
            planName: details.role,
            amount: amount,
            currency: "USD",
            orderId: subscriptionId,
            paymentProvider: "PAYPAL"
          }).catch(err => console.error("PayPal subscription success email trigger error:", err));
        }
      }
    }
```

---

### Task 2: Update Razorpay Webhook Email Trigger

**Files:**
- Modify: `src/app/api/webhooks/razorpay/route.ts`

- [ ] **Step 1: Add imports**

Import `sendPaymentSuccessEmail` at the top of [`src/app/api/webhooks/razorpay/route.ts`](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/app/api/webhooks/razorpay/route.ts).

```typescript
import { sendPaymentSuccessEmail } from "@/lib/email";
```

- [ ] **Step 2: Add email trigger inside `subscription.charged`**

In [`src/app/api/webhooks/razorpay/route.ts`](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/app/api/webhooks/razorpay/route.ts), find the `subscription.charged` section (around line 122, at the end of the `if (user)` block) and add the `sendPaymentSuccessEmail` invocation.

Original:
```typescript
        await prisma.subscription.upsert({
          where: { subscriptionId },
          update: {
            status: "active",
            currentPeriodEnd: expiresAt,
            paymentId: payment.id,
            amount: payment.amount / 100,
            currency: payment.currency,
          },
          create: {
            userId: user.id,
            plan: details.plan,
            status: "active",
            paymentProvider: "RAZORPAY",
            subscriptionId: subscriptionId,
            paymentId: payment.id,
            amount: payment.amount / 100,
            currency: payment.currency,
            interval: details.interval,
            currentPeriodEnd: expiresAt,
          },
        });
      }
    }
```

Replacement:
```typescript
        await prisma.subscription.upsert({
          where: { subscriptionId },
          update: {
            status: "active",
            currentPeriodEnd: expiresAt,
            paymentId: payment.id,
            amount: payment.amount / 100,
            currency: payment.currency,
          },
          create: {
            userId: user.id,
            plan: details.plan,
            status: "active",
            paymentProvider: "RAZORPAY",
            subscriptionId: subscriptionId,
            paymentId: payment.id,
            amount: payment.amount / 100,
            currency: payment.currency,
            interval: details.interval,
            currentPeriodEnd: expiresAt,
          },
        });

        // Send payment success email
        sendPaymentSuccessEmail({
          toEmail: user.email!,
          userName: user.name || "User",
          planName: details.role,
          amount: payment.amount / 100,
          currency: payment.currency,
          orderId: subscriptionId,
          paymentProvider: "RAZORPAY"
        }).catch(err => console.error("Razorpay subscription success email trigger error:", err));
      }
    }
```

- [ ] **Step 3: Commit changes**

Run:
```bash
git add src/app/api/webhooks/paypal/route.ts src/app/api/webhooks/razorpay/route.ts
git commit -m "feat(webhooks): trigger welcome success email on paypal and razorpay subscription activation"
```
