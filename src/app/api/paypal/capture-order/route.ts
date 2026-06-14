import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { capturePayPalOrder } from "@/lib/paypal";
import { sendPaymentSuccessEmail, sendPaymentFailedEmail } from "@/lib/email";
import { getCurrentCreditAllocation } from "@/lib/credits";

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

      // Update user to PRO/BUSINESS and set expiration/credits
      const defaultAllocation = getCurrentCreditAllocation(newRole);
      const creditsResetAt = new Date();
      creditsResetAt.setMonth(creditsResetAt.getMonth() + 1);

      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          role: newRole,
          proExpiresAt: expiresAt,
          creditsRemaining: defaultAllocation,
          creditsResetAt: creditsResetAt,
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

      // Send Success Email
      if (session.user.email) {
        sendPaymentSuccessEmail({
          toEmail: session.user.email,
          userName: session.user.name || "Customer",
          planName: plan,
          amount: parseFloat(capture.amount.value),
          currency: capture.amount.currency_code,
          orderId: orderId,
          paymentProvider: "PAYPAL",
        }).catch((err) =>
          console.error("PayPal success email trigger error:", err),
        );
      }

      return NextResponse.json({ success: true, data: captureData });
    } else {
      // Send Failure Email
      if (session.user.email) {
        const estimatedAmount =
          plan === "BUSINESS"
            ? interval === "year"
              ? 9999
              : 999
            : interval === "year"
              ? 4999
              : 499;
        sendPaymentFailedEmail({
          toEmail: session.user.email,
          userName: session.user.name || "Customer",
          planName: plan,
          amount: estimatedAmount,
          currency: "INR",
          paymentProvider: "PAYPAL",
          errorMsg: `PayPal capture status: ${captureData.status}. The transaction was not completed by PayPal.`,
        }).catch((err) =>
          console.error("PayPal failure email trigger error:", err),
        );
      }

      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 },
      );
    }
  } catch (error: any) {
    console.error("[PAYPAL_CAPTURE_ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Internal Error" },
      { status: 500 },
    );
  }
}
