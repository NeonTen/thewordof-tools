import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createPayPalSubscription } from "@/lib/paypal";
import { SUBSCRIPTION_PLANS } from "@/config/subscriptions";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan, interval = "month" } = await req.json(); // plan: "PREMIUM" or "BUSINESS"

    const mappedPlan = plan === "PREMIUM" ? "PRO" : plan;
    const mappedInterval = interval === "year" ? "YEARLY" : "MONTHLY";
    const planKey = `${mappedPlan}_${mappedInterval}` as keyof typeof SUBSCRIPTION_PLANS.paypal;
    const planId = SUBSCRIPTION_PLANS.paypal[planKey];

    if (!planId) {
      return NextResponse.json({ error: "Invalid subscription plan selection" }, { status: 400 });
    }

    const subscription = await createPayPalSubscription(planId, session.user.id, session.user.email || undefined);

    return NextResponse.json(subscription);
  } catch (error) {
    const err = error as Error;
    console.error("[PAYPAL_CREATE_SUBSCRIPTION_ERROR]", err);
    return NextResponse.json({ error: err.message || "Internal Error" }, { status: 500 });
  }
}
