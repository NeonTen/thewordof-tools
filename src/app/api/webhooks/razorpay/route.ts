import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

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
          data: { role: "PRO" },
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

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[RAZORPAY_WEBHOOK_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
