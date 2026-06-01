import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SUBSCRIPTION_PLANS } from "@/config/subscriptions";
import { sendPaymentSuccessEmail } from "@/lib/email";
import { PLAN_PRICING } from "@/config/pricing";

function getPlanDetailsByPlanId(planId: string) {
  const paypalPlans = SUBSCRIPTION_PLANS.paypal;
  if (planId === paypalPlans.PRO_MONTHLY) return { plan: "PREMIUM" as const, interval: "month", role: "PRO" as const };
  if (planId === paypalPlans.PRO_YEARLY) return { plan: "PREMIUM" as const, interval: "year", role: "PRO" as const };
  if (planId === paypalPlans.BUSINESS_MONTHLY) return { plan: "BUSINESS" as const, interval: "month", role: "BUSINESS" as const };
  if (planId === paypalPlans.BUSINESS_YEARLY) return { plan: "BUSINESS" as const, interval: "year", role: "BUSINESS" as const };
  return { plan: "PREMIUM" as const, interval: "month", role: "PRO" as const };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const eventType = body.event_type;
    const resource = body.resource;

    if (eventType === "PAYMENT.CAPTURE.COMPLETED") {
      // One-time checkouts
      const email = resource.payer?.email_address;

      if (email) {
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: { 
              role: "PRO",
              creditsRemaining: 500,
              creditsResetAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            },
          });

          await prisma.subscription.upsert({
            where: { paymentId: resource.id },
            update: { status: "active" },
            create: {
              userId: user.id,
              plan: "PREMIUM",
              status: "active",
              paymentProvider: "PAYPAL",
              paymentId: resource.id,
              amount: parseFloat(resource.amount.value),
              currency: resource.amount.currency_code,
            },
          });
        }
      }
    } 
    else if (eventType === "BILLING.SUBSCRIPTION.ACTIVATED") {
      const subscriptionId = resource.id;
      const userId = resource.custom_id;
      const planId = resource.plan_id;
      const status = resource.status;

      if (status !== "ACTIVE") {
        return NextResponse.json({ received: true, message: `Subscription not active yet: status is ${status}` });
      }

      if (userId) {
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (user) {
          const details = getPlanDetailsByPlanId(planId);
          const expiresAt = new Date();
          if (details.interval === "year") {
            expiresAt.setFullYear(expiresAt.getFullYear() + 1);
          } else {
            expiresAt.setMonth(expiresAt.getMonth() + 1);
          }

          // Update user role and initialize credits
          const defaultAllocation = details.role === "BUSINESS" ? 2000 : 500;
          await prisma.user.update({
            where: { id: user.id },
            data: { 
              role: details.role,
              proExpiresAt: expiresAt,
              creditsRemaining: defaultAllocation,
              creditsResetAt: expiresAt
            },
          });

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
    else if (eventType === "PAYMENT.SALE.COMPLETED") {
      // Recurring subscription charge success
      const subscriptionId = resource.billing_agreement_id;

      if (subscriptionId) {
        const sub = await prisma.subscription.findUnique({
          where: { subscriptionId },
        });

        if (sub) {
          const expiresAt = new Date();
          if (sub.interval === "year") {
            expiresAt.setFullYear(expiresAt.getFullYear() + 1);
          } else {
            expiresAt.setMonth(expiresAt.getMonth() + 1);
          }

          const newRole = sub.plan === "BUSINESS" ? "BUSINESS" : "PRO";

          const defaultAllocation = newRole === "BUSINESS" ? 2000 : 500;
          await prisma.user.update({
            where: { id: sub.userId },
            data: {
              role: newRole,
              proExpiresAt: expiresAt,
              creditsRemaining: defaultAllocation,
              creditsResetAt: expiresAt
            },
          });

          await prisma.subscription.update({
            where: { subscriptionId },
            data: {
              status: "active",
              currentPeriodEnd: expiresAt,
              paymentId: resource.id, // Update latest transaction ID
              amount: parseFloat(resource.amount.total),
              currency: resource.amount.currency,
            },
          });
        }
      }
    } 
    else if (eventType === "BILLING.SUBSCRIPTION.CANCELLED") {
      const subscriptionId = resource.id;

      if (subscriptionId) {
        await prisma.subscription.update({
          where: { subscriptionId },
          data: { status: "cancelled" },
        });
      }
    } 
    else if (eventType === "BILLING.SUBSCRIPTION.EXPIRED" || eventType === "BILLING.SUBSCRIPTION.PAYMENT.FAILED") {
      const subscriptionId = resource.id;

      if (subscriptionId) {
        const sub = await prisma.subscription.update({
          where: { subscriptionId },
          data: { status: "expired" },
        });

        // Revoke active permissions
        await prisma.user.update({
          where: { id: sub.userId },
          data: {
            role: "USER",
            proExpiresAt: null,
          },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[PAYPAL_WEBHOOK_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
