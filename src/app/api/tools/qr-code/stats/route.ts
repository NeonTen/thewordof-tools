import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const qrId = searchParams.get("id");
  if (!qrId) {
    return new NextResponse("Missing QR ID", { status: 400 });
  }

  try {
    const qrCode = await prisma.qrCode.findUnique({
      where: { id: qrId },
      include: { scans: true },
    });

    if (!qrCode || qrCode.userId !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Group scan analytics
    const totalScans = qrCode.scans.length;
    const uniqueScans = qrCode.scans.filter((s) => s.isUnique).length;

    const devices = qrCode.scans.reduce((acc: Record<string, number>, s) => {
      acc[s.device] = (acc[s.device] || 0) + 1;
      return acc;
    }, {});

    const osList = qrCode.scans.reduce((acc: Record<string, number>, s) => {
      acc[s.os] = (acc[s.os] || 0) + 1;
      return acc;
    }, {});

    const browsers = qrCode.scans.reduce((acc: Record<string, number>, s) => {
      acc[s.browser] = (acc[s.browser] || 0) + 1;
      return acc;
    }, {});

    const countries = qrCode.scans.reduce((acc: Record<string, number>, s) => {
      if (s.country) {
        acc[s.country] = (acc[s.country] || 0) + 1;
      }
      return acc;
    }, {});

    const cities = qrCode.scans.reduce((acc: Record<string, number>, s) => {
      if (s.city) {
        acc[s.city] = (acc[s.city] || 0) + 1;
      }
      return acc;
    }, {});

    const scansList = qrCode.scans.map((s) => ({
      createdAt: s.createdAt,
      isUnique: s.isUnique,
      device: s.device,
      os: s.os,
      browser: s.browser,
      country: s.country,
      city: s.city,
    }));

    return NextResponse.json({
      totalScans,
      uniqueScans,
      devices,
      os: osList,
      browsers,
      countries,
      cities,
      scans: scansList,
    });
  } catch (error) {
    console.error("Stats API Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
