import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// To properly verify PayPal webhooks, you usually need to call the PayPal API 
// to verify the signature. This is a simplified version.

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const eventType = body.event_type;

    if (eventType === "PAYMENT.CAPTURE.COMPLETED") {
      const resource = body.resource;
      const orderId = resource.supplementary_data?.related_ids?.order_id || resource.parent_payment;
      const email = resource.payer?.email_address;

      if (email) {
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: { role: "PRO" },
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

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[PAYPAL_WEBHOOK_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
