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
  
  if (!session?.user?.id) {
    return { error: "Not authenticated" }
  }

  try {
    // 1. Check local database first (for manual Admin upgrades)
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        subscriptions: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    })

    if (dbUser?.role === "PRO" || dbUser?.role === "ADMIN" || dbUser?.subscriptions?.[0]?.plan === "PREMIUM") {
      revalidatePath("/dashboard")
      return { 
        success: true, 
        message: "Plan synced successfully from database.",
        role: dbUser.role 
      }
    }

    // 2. If not Pro in DB, check Stripe
    if (!session.user.email) return { error: "Email missing" }
    
    const customers = await stripe.customers.list({
      email: session.user.email,
      limit: 5,
    })

    if (customers.data.length === 0) {
      return { message: `No Stripe customer found for email ${session.user.email}.` }
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
      await prisma.user.update({
        where: { id: session.user.id },
        data: { role: "PRO" },
      })
      
      // Also ensure a Premium subscription record exists
      await prisma.subscription.upsert({
        where: { id: dbUser?.subscriptions?.[0]?.id || "new" },
        update: { plan: "PREMIUM", status: "active" },
        create: { userId: session.user.id, plan: "PREMIUM", status: "active" }
      })

      revalidatePath("/dashboard")
      return { success: true, message: "Success! Your Stripe subscription was found and synced.", role: "PRO" }
    }

    return { message: "No active Stripe subscription found. If you just paid, please wait a minute and try again." }
  } catch (error: any) {
    console.error("SYNC_PLAN_ERROR", error)
    return { error: error.message }
  }
}
