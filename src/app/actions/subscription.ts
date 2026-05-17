"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function syncPlanStatus() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { error: "Not authenticated" }
  }

  try {
    // Check local database (for manual Admin upgrades or successful webhook payments)
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        subscriptions: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    })

    if (dbUser?.role === "PRO" || dbUser?.role === "BUSINESS" || dbUser?.role === "ADMIN" || dbUser?.subscriptions?.[0]?.plan === "PREMIUM" || dbUser?.subscriptions?.[0]?.plan === "BUSINESS") {
      revalidatePath("/dashboard")
      return { 
        success: true, 
        message: "Plan verified from database.",
        role: dbUser.role 
      }
    }

    return { message: "No active subscription found. If you just paid, please wait a minute for the payment to be processed." }
  } catch (error: any) {
    console.error("SYNC_PLAN_ERROR", error)
    return { error: error.message }
  }
}
