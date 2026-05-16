import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { hash } from "bcryptjs"

// Update User (Role, Plan, Status)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params
    
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { role, plan, status, resetPassword } = body

    if (resetPassword) {
      const hashedPassword = await hash(resetPassword, 12)
      await prisma.user.update({
        where: { id },
        data: { password: hashedPassword }
      })
      return NextResponse.json({ message: "Password reset successfully" })
    }

    // Update Role
    if (role) {
      await prisma.user.update({
        where: { id },
        data: { role }
      })

      // If role is PRO or ADMIN, ensure they have a PREMIUM subscription
      if (role === "PRO" || role === "ADMIN") {
        const existingSub = await prisma.subscription.findFirst({
          where: { userId: id }
        })

        if (existingSub) {
          await prisma.subscription.update({
            where: { id: existingSub.id },
            data: { plan: "PREMIUM", status: "active" }
          })
        } else {
          await prisma.subscription.create({
            data: { userId: id, plan: "PREMIUM", status: "active" }
          })
        }
      }
    }

    // Update Plan
    if (plan) {
      // First check if user has a subscription
      const existingSub = await prisma.subscription.findFirst({
        where: { userId: id }
      })

      if (existingSub) {
        await prisma.subscription.update({
          where: { id: existingSub.id },
          data: { plan, status: status || 'active' }
        })
      } else {
        await prisma.subscription.create({
          data: {
            userId: id,
            plan,
            status: status || 'active'
          }
        })
      }

      // If plan is PREMIUM, ensure role is at least PRO
      if (plan === "PREMIUM") {
        const user = await prisma.user.findUnique({ where: { id } })
        if (user && user.role === "USER") {
          await prisma.user.update({
            where: { id },
            data: { role: "PRO" }
          })
        }
      } else if (plan === "FREE") {
        // Optional: downgrade PRO to USER if plan becomes FREE
        const user = await prisma.user.findUnique({ where: { id } })
        if (user && user.role === "PRO") {
          await prisma.user.update({
            where: { id },
            data: { role: "USER" }
          })
        }
      }
    }

    return NextResponse.json({ message: "User updated successfully" })
  } catch (error: any) {
    console.error("ADMIN_USER_PATCH", error)
    return NextResponse.json({ error: error.message || "Internal Error" }, { status: 500 })
  }
}

// Delete User
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params
    
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Don't allow deleting self
    if (id === session.user.id) {
      return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 })
    }

    await prisma.user.delete({
      where: { id }
    })

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error: any) {
    console.error("ADMIN_USER_DELETE", error)
    return NextResponse.json({ error: error.message || "Internal Error" }, { status: 500 })
  }
}
