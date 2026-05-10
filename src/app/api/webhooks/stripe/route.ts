import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    if (!session?.metadata?.userId) {
      return new NextResponse("User id is required", { status: 400 })
    }

    await prisma.user.update({
      where: {
        id: session.metadata.userId,
      },
      data: {
        role: "PRO",
      },
    })

    await prisma.subscription.create({
      data: {
        userId: session.metadata.userId,
        plan: "PREMIUM",
        status: "active",
      },
    })
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription
    const user = await prisma.user.findFirst({
        where: {
            email: session.customer_email!
        }
    })

    if (user) {
        await prisma.user.update({
            where: { id: user.id },
            data: { role: "USER" }
        })
    }
  }

  return new NextResponse(null, { status: 200 })
}
