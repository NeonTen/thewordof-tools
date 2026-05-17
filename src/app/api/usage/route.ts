import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import crypto from "crypto"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// Helper to hash visitor IP addresses securely for GDPR compliance
async function getIdentifier(req: NextRequest): Promise<string> {
  const session = await auth()
  if (session?.user?.id) {
    return session.user.id
  }
  
  const headerList = await headers()
  const rawIp = headerList.get("x-forwarded-for")?.split(",")[0] || 
                headerList.get("x-real-ip") || 
                req.ip ||
                "127.0.0.1"
                
  return crypto.createHash("sha256").update(rawIp).digest("hex")
}

function getDateStr(period: string): string {
  const now = new Date()
  if (period === "monthly") {
    return now.toISOString().slice(0, 7) // YYYY-MM
  }
  return now.toISOString().split("T")[0] // YYYY-MM-DD
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const toolKey = searchParams.get("toolKey")
    const period = searchParams.get("period") || "daily"

    if (!toolKey) {
      return NextResponse.json({ error: "Missing toolKey parameter" }, { status: 400 })
    }

    const identifier = await getIdentifier(req)
    const dateStr = getDateStr(period)

    const record = await prisma.toolUsage.findUnique({
      where: {
        toolKey_identifier_date_period: {
          toolKey,
          identifier,
          date: dateStr,
          period,
        },
      },
    })

    return NextResponse.json({ count: record ? record.count : 0 })
  } catch (error) {
    console.error("GET /api/usage error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { toolKey, period = "daily", amount = 1 } = body

    if (!toolKey) {
      return NextResponse.json({ error: "Missing toolKey in body" }, { status: 400 })
    }

    const identifier = await getIdentifier(req)
    const dateStr = getDateStr(period)

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
    })

    return NextResponse.json({ count: record.count })
  } catch (error) {
    console.error("POST /api/usage error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
