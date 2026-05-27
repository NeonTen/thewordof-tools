import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { cancelPayPalSubscription } from "@/lib/paypal";
import { razorpay } from "@/lib/razorpay";

export async function POST(_req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sub = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: "active",
      },
    });

    if (!sub || !sub.subscriptionId) {
      return NextResponse.json({ error: "No active subscription found" }, { status: 404 });
    }

    if (sub.paymentProvider === "PAYPAL") {
      const res = await cancelPayPalSubscription(sub.subscriptionId);
      if (res && 'error' in res && res.error) {
        const payPalError = res.error as { message?: string };
        return NextResponse.json({ error: payPalError.message || "Failed to cancel PayPal subscription" }, { status: 400 });
      }
    } else if (sub.paymentProvider === "RAZORPAY") {
      try {
        await razorpay.subscriptions.cancel(sub.subscriptionId);
      } catch (err) {
        const razorpayError = err as Error;
        return NextResponse.json({ error: razorpayError.message || "Failed to cancel Razorpay subscription" }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: "Unsupported billing provider" }, { status: 400 });
    }

    // Set status to cancelled in database
    await prisma.subscription.update({
      where: { id: sub.id },
      data: { status: "cancelled" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const mainError = error as Error;
    console.error("[CANCEL_SUBSCRIPTION_ERROR]", mainError);
    return NextResponse.json({ error: mainError.message || "Internal Error" }, { status: 500 });
  }
}
