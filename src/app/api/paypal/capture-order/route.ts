import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { capturePayPalOrder } from "@/lib/paypal";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, plan = "PREMIUM", interval = "month" } = await req.json();

    const captureData = await capturePayPalOrder(orderId);

    if (captureData.status === "COMPLETED") {
      const expiresAt = new Date();
      if (interval === "year") {
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      } else {
        expiresAt.setMonth(expiresAt.getMonth() + 1);
      }

      const newRole = plan === "BUSINESS" ? "BUSINESS" : "PRO";

      // Update user to PRO/BUSINESS
      await prisma.user.update({
        where: { id: session.user.id },
        data: { 
          role: newRole,
          proExpiresAt: expiresAt
        },
      });

      const purchaseUnit = captureData.purchase_units[0];
      const capture = purchaseUnit.payments.captures[0];

      // Create subscription record
      await prisma.subscription.create({
        data: {
          userId: session.user.id,
          plan: plan,
          status: "active",
          paymentProvider: "PAYPAL",
          orderId: orderId,
          paymentId: capture.id,
          amount: parseFloat(capture.amount.value),
          currency: capture.amount.currency_code,
          interval: interval,
          currentPeriodEnd: expiresAt,
        },
      });

      return NextResponse.json({ success: true, data: captureData });
    } else {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("[PAYPAL_CAPTURE_ERROR]", error);
    return NextResponse.json({ error: error.message || "Internal Error" }, { status: 500 });
  }
}
