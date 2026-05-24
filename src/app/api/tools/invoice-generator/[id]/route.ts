import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

    const { id } = await params
    const invoice = await prisma.savedInvoice.findFirst({
      where: { id, userId: session.user.id }
    })
    if (!invoice) return new NextResponse("Invoice not found", { status: 404 })

    return NextResponse.json({ success: true, invoice })
  } catch (e: any) {
    return new NextResponse(e.message || "Internal Server Error", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

    const { id } = await params
    const existing = await prisma.savedInvoice.findFirst({
      where: { id, userId: session.user.id }
    })
    if (!existing) return new NextResponse("Invoice not found", { status: 404 })

    await prisma.savedInvoice.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return new NextResponse(e.message || "Internal Server Error", { status: 500 })
  }
}
