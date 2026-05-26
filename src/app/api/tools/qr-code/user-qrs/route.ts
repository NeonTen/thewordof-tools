import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session || !session.user || !session.user.id) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const qrCodes = await prisma.qrCode.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { scans: true }
        }
      }
    })

    return NextResponse.json({ qrCodes })
  } catch (error) {
    console.error("List QR Error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
