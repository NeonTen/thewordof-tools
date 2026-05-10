import { NextResponse } from "next/server"
import { auth } from "@/auth"
import Stripe from "stripe"

export async function POST(req: Request) {
  try {
    const session = await auth()
    
    const apiKey = process.env.STRIPE_SECRET_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Stripe API key is missing. Check STRIPE_SECRET_KEY in .env" }, { status: 500 })
    }

    const stripe = new Stripe(apiKey, {
      apiVersion: "2023-10-16" as any,
      typescript: true,
    })

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { priceId } = await req.json()
    console.log("CHECKOUT_REQUEST", { priceId, userId: session.user.id })

    if (!priceId || priceId === "price_placeholder_id") {
      console.error("INVALID_PRICE_ID", priceId)
      return NextResponse.json({ error: "Invalid Price ID. Please check your configuration." }, { status: 400 })
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: session.user.email!,
      billing_address_collection: "required", // Required for India export compliance
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: {
        userId: session.user.id!,
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error: any) {
    console.error("[STRIPE_ERROR]", error)
    return NextResponse.json({ 
      error: error.message || "Internal Error",
      details: error.raw?.message || error.toString()
    }, { status: 500 })
  }
}
