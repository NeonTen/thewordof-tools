import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { razorpay } from "@/lib/razorpay";
import { SUBSCRIPTION_PLANS } from "@/config/subscriptions";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan, interval = "month" } = await req.json();

    const mappedPlan = plan === "PREMIUM" ? "PRO" : plan;
    const mappedInterval = interval === "year" ? "YEARLY" : "MONTHLY";
    const planKey = `${mappedPlan}_${mappedInterval}` as keyof typeof SUBSCRIPTION_PLANS.razorpay;
    const planId = SUBSCRIPTION_PLANS.razorpay[planKey];

    if (!planId) {
      return NextResponse.json({ error: "Invalid subscription plan selection" }, { status: 400 });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error("Razorpay keys are missing");
      return NextResponse.json({ error: "Razorpay credentials not configured" }, { status: 500 });
    }

    // Create subscription on Razorpay
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: interval === "year" ? 10 : 120, // Charging cycles (10 years or 10 years in months)
      quantity: 1,
      notes: {
        userId: session.user.id,
        plan: plan,
        interval: interval
      }
    });

    return NextResponse.json(subscription);
  } catch (error) {
    const err = error as Error;
    console.error("[RAZORPAY_CREATE_SUBSCRIPTION_ERROR]", err);
    return NextResponse.json({ error: err.message || "Internal Error" }, { status: 500 });
  }
}
