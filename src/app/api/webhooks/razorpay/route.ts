import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { SUBSCRIPTION_PLANS } from "@/config/subscriptions";

function getRazorpayPlanDetails(planId: string) {
  const rzpPlans = SUBSCRIPTION_PLANS.razorpay;
  if (planId === rzpPlans.PRO_MONTHLY) return { plan: "PREMIUM" as const, interval: "month", role: "PRO" as const };
  if (planId === rzpPlans.PRO_YEARLY) return { plan: "PREMIUM" as const, interval: "year", role: "PRO" as const };
  if (planId === rzpPlans.BUSINESS_MONTHLY) return { plan: "BUSINESS" as const, interval: "month", role: "BUSINESS" as const };
  if (planId === rzpPlans.BUSINESS_YEARLY) return { plan: "BUSINESS" as const, interval: "year", role: "BUSINESS" as const };
  return { plan: "PREMIUM" as const, interval: "month", role: "PRO" as const };
}

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      return new NextResponse("Invalid signature", { status: 400 });
    }

    const event = JSON.parse(body);

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;
      const email = payment.email;

      // Find user by email (as fallback if we don't have metadata)
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

        // Upsert subscription
        await prisma.subscription.upsert({
          where: { orderId: orderId },
          update: { status: "active", paymentId: payment.id },
          create: {
            userId: user.id,
            plan: "PREMIUM",
            status: "active",
            paymentProvider: "RAZORPAY",
            orderId: orderId,
            paymentId: payment.id,
            amount: payment.amount / 100,
            currency: payment.currency,
          },
        });
      }
    } 
    else if (event.event === "subscription.charged") {
      const subscription = event.payload.subscription.entity;
      const payment = event.payload.payment.entity;
      const subscriptionId = subscription.id;
      const userId = subscription.notes?.userId;
      const planId = subscription.plan_id;

      const user = await prisma.user.findUnique({
        where: { id: userId || "" },
      });

      if (user) {
        const details = getRazorpayPlanDetails(planId);
        const expiresAt = subscription.current_end ? new Date(subscription.current_end * 1000) : new Date();
        if (!subscription.current_end) {
          if (details.interval === "year") {
            expiresAt.setFullYear(expiresAt.getFullYear() + 1);
          } else {
            expiresAt.setMonth(expiresAt.getMonth() + 1);
          }
        }

        const defaultAllocation = details.role === "BUSINESS" ? 2000 : 500;
        await prisma.user.update({
          where: { id: user.id },
          data: {
            role: details.role,
            proExpiresAt: expiresAt,
            creditsRemaining: defaultAllocation,
            creditsResetAt: expiresAt,
          },
        });

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
    else if (event.event === "subscription.cancelled") {
      const subscription = event.payload.subscription.entity;
      const subscriptionId = subscription.id;

      await prisma.subscription.updateMany({
        where: { subscriptionId },
        data: { status: "cancelled" },
      });
    } 
    else if (
      event.event === "subscription.completed" || 
      event.event === "subscription.expired" || 
      event.event === "subscription.halted" || 
      event.event === "subscription.paused"
    ) {
      const subscription = event.payload.subscription.entity;
      const subscriptionId = subscription.id;

      const updatedSubs = await prisma.subscription.findMany({
        where: { subscriptionId },
      });

      for (const sub of updatedSubs) {
        await prisma.subscription.update({
          where: { id: sub.id },
          data: { status: event.event === "subscription.paused" ? "paused" : "expired" },
        });

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
    console.error("[RAZORPAY_WEBHOOK_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
