import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import crypto from "crypto";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PrismaModuleType {
  prisma: import("@prisma/client").PrismaClient;
}

// Helper to obtain a stable identifier – logged in user ID or hashed IP for guests
async function getIdentifier(req: NextRequest): Promise<string> {
  const session = await auth();
  if (session?.user?.id) {
    return session.user.id;
  }

  const headerList = await headers();
  const reqIp = (req as unknown as { ip?: string }).ip;
  const rawIp =
    headerList.get("x-forwarded-for")?.split(",")[0] ||
    headerList.get("x-real-ip") ||
    reqIp ||
    "127.0.0.1";

  return crypto.createHash("sha256").update(rawIp).digest("hex");
}

function getDateStr(period: string): string {
  const now = new Date();
  if (period === "monthly") {
    return now.toISOString().slice(0, 7); // YYYY-MM
  }
  return now.toISOString().split("T")[0]; // YYYY-MM-DD
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const toolKey = searchParams.get("toolKey");
    const period = searchParams.get("period") || "daily";

    if (!toolKey) {
      return NextResponse.json(
        { error: "Missing toolKey parameter" },
        { status: 400 },
      );
    }

    const identifier = await getIdentifier(req);
    const dateStr = getDateStr(period);

    // Load prisma dynamically to bypass circular dependencies
    const prismaModule =
      (await import("@/lib/prisma")) as unknown as PrismaModuleType;
    const prisma = prismaModule.prisma;

    const record = await prisma.toolUsage.findUnique({
      where: {
        toolKey_identifier_date_period: {
          toolKey,
          identifier,
          date: dateStr,
          period,
        },
      },
    });

    const count = record ? record.count : 0;
    return NextResponse.json({ count });
  } catch (error) {
    console.error("GET /api/usage error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { toolKey, period = "daily", amount = 1, payload } = body;

    if (!toolKey) {
      return NextResponse.json(
        { error: "Missing toolKey in body" },
        { status: 400 },
      );
    }

    if (payload) {
      console.log(
        `[Analytics] Tool Used: ${toolKey}, Payload:`,
        JSON.stringify(payload),
      );
    }

    const identifier = await getIdentifier(req);
    const dateStr = getDateStr(period);

    // Load prisma dynamically
    const prismaModule =
      (await import("@/lib/prisma")) as unknown as PrismaModuleType;
    const prisma = prismaModule.prisma;

    const record = await prisma.toolUsage.upsert({
      where: {
        toolKey_identifier_date_period: {
          toolKey,
          identifier,
          date: dateStr,
          period,
        },
      },
      update: {
        count: { increment: amount },
      },
      create: {
        toolKey,
        identifier,
        date: dateStr,
        period,
        count: amount,
      },
    });

    return NextResponse.json({ count: record.count });
  } catch (error) {
    console.error("POST /api/usage error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
