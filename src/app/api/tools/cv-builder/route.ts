import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { subscriptions: true }
    })

    const isPro = user?.role === "PRO" || user?.role === "BUSINESS" || user?.role === "ADMIN" || user?.subscriptions?.[0]?.plan === "PREMIUM" || user?.subscriptions?.[0]?.plan === "BUSINESS"
    if (!isPro) return new NextResponse("Pro subscription required", { status: 403 })

    const list = await prisma.savedResume.findMany({
      where: { userId: session.user.id },
      select: { id: true, title: true, updatedAt: true },
      orderBy: { updatedAt: "desc" }
    })

    return NextResponse.json({ success: true, list })
  } catch (e: any) {
    return new NextResponse(e.message || "Internal Server Error", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { subscriptions: true }
    })

    const isPro = user?.role === "PRO" || user?.role === "BUSINESS" || user?.role === "ADMIN" || user?.subscriptions?.[0]?.plan === "PREMIUM" || user?.subscriptions?.[0]?.plan === "BUSINESS"
    if (!isPro) return new NextResponse("Pro subscription required", { status: 403 })

    const { id, title, data } = await req.json()
    if (!title || !data) return new NextResponse("Missing title or data", { status: 400 })

    let resume
    if (id) {
      // Update
      const existing = await prisma.savedResume.findFirst({
        where: { id, userId: session.user.id }
      })
      if (!existing) return new NextResponse("Resume not found", { status: 404 })

      resume = await prisma.savedResume.update({
        where: { id },
        data: { title, data }
      })
    } else {
      // Create
      resume = await prisma.savedResume.create({
        data: { userId: session.user.id, title, data }
      })
    }

    return NextResponse.json({ success: true, resume })
  } catch (e: any) {
    return new NextResponse(e.message || "Internal Server Error", { status: 500 })
  }
}
