import { PLAN_PRICING } from "@/config/pricing"
import { prisma } from "@/lib/prisma"

export function getCurrentCreditAllocation(role: string): number {
  const key = role.toUpperCase() === "PRO" || role.toUpperCase() === "PREMIUM" ? "PREMIUM" : role.toUpperCase();
  if (key === "ADMIN") return 999999;
  return PLAN_PRICING[key as keyof typeof PLAN_PRICING]?.credits ?? 20;
}

export async function verifyAndDeductCredits(userId: string, cost: number): Promise<{ success: boolean; remaining: number; resetAt: Date }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { creditsRemaining: true, creditsResetAt: true, role: true }
  })

  if (!user) {
    throw new Error("User not found")
  }

  const now = new Date()
  let currentRemaining = user.creditsRemaining
  let currentResetAt = user.creditsResetAt

  // Check if billing cycle / calendar month has passed, triggering a reset
  if (now >= currentResetAt) {
    const nextReset = new Date(currentResetAt)
    if (user.role === "PRO" || user.role === "BUSINESS" || user.role === "ADMIN") {
      nextReset.setMonth(nextReset.getMonth() + 1)
    } else {
      // Free user resets on the 1st of next month
      nextReset.setMonth(nextReset.getMonth() + 1)
      nextReset.setDate(1)
      nextReset.setHours(0, 0, 0, 0)
    }

    currentRemaining = getCurrentCreditAllocation(user.role)
    currentResetAt = nextReset

    await prisma.user.update({
      where: { id: userId },
      data: {
        creditsRemaining: currentRemaining,
        creditsResetAt: currentResetAt
      }
    })
  }

  if (currentRemaining >= cost) {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        creditsRemaining: {
          decrement: cost
        }
      },
      select: { creditsRemaining: true, creditsResetAt: true }
    })

    return {
      success: true,
      remaining: updatedUser.creditsRemaining,
      resetAt: updatedUser.creditsResetAt
    }
  }

  return {
    success: false,
    remaining: currentRemaining,
    resetAt: currentResetAt
  }
}
