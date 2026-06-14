import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { targetUrl, fgColor, bgColor, size, logoUrl } = await request.json();
    if (!targetUrl) {
      return new NextResponse("Missing URL", { status: 400 });
    }

    // Check User Role & QR Limit
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { qrCodes: true },
    });

    if (!user) return new NextResponse("User not found", { status: 404 });

    const isPro =
      user.role === "PRO" || user.role === "BUSINESS" || user.role === "ADMIN";
    if (!isPro && user.qrCodes.length >= 1) {
      return new NextResponse("Limit Reached", { status: 403 });
    }

    const qrCode = await prisma.qrCode.create({
      data: {
        userId: user.id,
        targetUrl,
        fgColor: fgColor || "#000000",
        bgColor: bgColor || "#ffffff",
        size: size || 256,
        logoUrl: logoUrl || null,
      },
    });

    return NextResponse.json({ id: qrCode.id });
  } catch (error) {
    console.error("QR Code Create Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
