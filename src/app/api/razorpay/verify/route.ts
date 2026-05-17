import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendPaymentSuccessEmail, sendPaymentFailedEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      amount,
      currency,
      plan = "PREMIUM",
      interval = "month"
    } = await req.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      const expiresAt = new Date();
      if (interval === "year") {
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      } else {
        expiresAt.setMonth(expiresAt.getMonth() + 1);
      }

      const newRole = plan === "BUSINESS" ? "BUSINESS" : "PRO";

      // Update user to PRO/BUSINESS and set expiration
      await prisma.user.update({
        where: { id: session.user.id },
        data: { 
          role: newRole,
          proExpiresAt: expiresAt 
        },
      });

      // Create subscription record
      await prisma.subscription.create({
        data: {
          userId: session.user.id,
          plan: plan,
          status: "active",
          paymentProvider: "RAZORPAY",
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          amount: parseFloat(amount),
          currency: currency,
          interval: interval,
          currentPeriodEnd: expiresAt,
        },
      });

      // Send Success Email
      if (session.user.email) {
        // Send email asynchronously in background so we don't delay client response
        sendPaymentSuccessEmail({
          toEmail: session.user.email,
          userName: session.user.name || "Customer",
          planName: plan,
          amount: parseFloat(amount),
          currency: currency,
          orderId: razorpay_order_id || razorpay_payment_id,
          paymentProvider: "RAZORPAY"
        }).catch(err => console.error("Verify success email trigger error:", err));
      }

      return NextResponse.json({ success: true });
    } else {
      // Send Failure Email
      if (session.user.email) {
        sendPaymentFailedEmail({
          toEmail: session.user.email,
          userName: session.user.name || "Customer",
          planName: plan,
          amount: parseFloat(amount),
          currency: currency,
          paymentProvider: "RAZORPAY",
          errorMsg: "Signature verification failed. The payment signature could not be verified securely."
        }).catch(err => console.error("Verify failure email trigger error:", err));
      }

      return NextResponse.json({ error: "Verification failed" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("[RAZORPAY_VERIFY_ERROR]", error);
    return NextResponse.json({ error: error.message || "Internal Error" }, { status: 500 });
  }
}
