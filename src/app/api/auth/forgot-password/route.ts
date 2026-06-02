import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendPasswordResetEmail } from "@/lib/email"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) {
      return new NextResponse("Email is required", { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      // For security, return success even if user isn't found to avoid email enumeration
      return NextResponse.json({ success: true })
    }

    const token = crypto.randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 3600000) // 1 hour expiration

    await prisma.passwordResetToken.upsert({
      where: { email_token: { email, token } },
      update: { token, expires },
      create: { email, token, expires },
    })

    await sendPasswordResetEmail({ toEmail: email, token })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
