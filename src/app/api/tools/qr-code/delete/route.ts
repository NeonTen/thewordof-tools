import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function DELETE(request: NextRequest) {
  const session = await auth()
  if (!session || !session.user || !session.user.id) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) {
    return new NextResponse("Missing QR ID", { status: 400 })
  }

  try {
    const qrCode = await prisma.qrCode.findUnique({
      where: { id },
    })

    if (!qrCode || qrCode.userId !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 })
    }

    await prisma.qrCode.delete({
      where: { id },
    })

    return new NextResponse("Deleted successfully", { status: 200 })
  } catch (error) {
    console.error("Delete QR Error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
