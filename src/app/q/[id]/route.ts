import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const qrCode = await prisma.qrCode.findUnique({
      where: { id },
      include: { user: { include: { subscriptions: true } } },
    })

    if (!qrCode) {
      return new NextResponse("QR Code not found", { status: 404 })
    }

    // Check Expiration for Free Tier (USER role)
    const isPro = qrCode.user.role === "PRO" || qrCode.user.role === "BUSINESS" || qrCode.user.role === "ADMIN"
    const ageInDays = (Date.now() - new Date(qrCode.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    if (!isPro && ageInDays > 15) {
      return NextResponse.redirect(new URL(`/tools/qr-code/expired?id=${id}`, request.url))
    }

    // Parse User-Agent
    const uaString = request.headers.get("user-agent") || ""
    let device = "Desktop"
    if (/tablet|ipad|playbook|silk/i.test(uaString)) {
      device = "Tablet"
    } else if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile|webos/i.test(uaString)) {
      device = "Mobile"
    }

    let os = "Unknown"
    if (/windows/i.test(uaString)) os = "Windows"
    else if (/macintosh|mac os x/i.test(uaString)) os = "macOS"
    else if (/iphone|ipad|ipod/i.test(uaString)) os = "iOS"
    else if (/android/i.test(uaString)) os = "Android"
    else if (/linux/i.test(uaString)) os = "Linux"

    let browser = "Unknown"
    if (/chrome|crios/i.test(uaString) && !/edge|edg/i.test(uaString)) browser = "Chrome"
    else if (/safari/i.test(uaString) && !/chrome|crios/i.test(uaString)) browser = "Safari"
    else if (/firefox|fxios/i.test(uaString)) browser = "Firefox"
    else if (/edge|edg/i.test(uaString)) browser = "Edge"

    // Unique vs Repeat check via cookie
    const cookieName = `qr_scanned_${id}`
    const hasCookie = request.cookies.has(cookieName)
    const isUnique = !hasCookie

    // Record Scan
    await prisma.qrScan.create({
      data: {
        qrCodeId: id,
        device,
        os,
        browser,
        isUnique,
      },
    })

    const response = NextResponse.redirect(qrCode.targetUrl)
    if (isUnique) {
      response.cookies.set(cookieName, "1", {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: "/",
      })
    }
    return response
  } catch (error) {
    console.error("QR Code Redirect Error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
