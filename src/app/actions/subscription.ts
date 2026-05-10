"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"
import { revalidatePath } from "next/cache"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as any,
})

export async function syncPlanStatus() {
  const session = await auth()
  
  if (!session?.user?.email) {
    return { error: "Not authenticated" }
  }

  try {
    const customers = await stripe.customers.list({
      email: session.user.email,
      limit: 5,
    })

    if (customers.data.length === 0) {
      return { message: `No Stripe customer found for email ${session.user.email}. Please ensure you used this email for payment.` }
    }

    let foundActive = false
    for (const customer of customers.data) {
      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: "active",
        limit: 1,
      })
      if (subscriptions.data.length > 0) {
        foundActive = true
        break
      }
    }

    if (foundActive) {
      // User has an active subscription! Update DB.
      const userEmail = session.user?.email
      
      try {
        await prisma.user.update({
          where: { email: userEmail! },
          data: { role: "PRO" },
        })
        
        revalidatePath("/dashboard")
        return { success: true, message: `Success! Account ${userEmail} is now PRO.` }
      } catch (dbError: any) {
        return { error: `DB Error: ${dbError.message}` }
      }
    }

    return { message: `Found ${customers.data.length} Stripe customer(s) for ${session.user.email}, but NO active PRO subscription was found.` }
  } catch (error: any) {
    console.error("SYNC_PLAN_ERROR", error)
    return { error: error.message }
  }
}
