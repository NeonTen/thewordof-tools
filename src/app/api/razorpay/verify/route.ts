import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

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
      currency
    } = await req.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);

      // Update user to PRO and set expiration
      await prisma.user.update({
        where: { id: session.user.id },
        data: { 
          role: "PRO",
          proExpiresAt: expiresAt 
        },
      });

      // Create subscription record
      await prisma.subscription.create({
        data: {
          userId: session.user.id,
          plan: "PREMIUM",
          status: "active",
          paymentProvider: "RAZORPAY",
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          amount: parseFloat(amount),
          currency: currency,
          currentPeriodEnd: expiresAt,
        },
      });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Verification failed" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("[RAZORPAY_VERIFY_ERROR]", error);
    return NextResponse.json({ error: error.message || "Internal Error" }, { status: 500 });
  }
}
