import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(req: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userRole = session.user.role
    if (userRole !== "PRO" && userRole !== "BUSINESS" && userRole !== "ADMIN") {
      return NextResponse.json({ error: "Premium access required." }, { status: 403 })
    }

    const { subject, message, type } = await req.json()

    if (!subject || !message) {
      return NextResponse.json({ error: "Subject and message are required." }, { status: 400 })
    }

    // Determine type securely
    const ticketType = type === "TOOL_REQUEST" && (userRole === "BUSINESS" || userRole === "ADMIN") 
      ? "TOOL_REQUEST" 
      : "SUPPORT"

    // 1. Save ticket to Database
    const ticket = await prisma.supportTicket.create({
      data: {
        userId: session.user.id,
        subject,
        message,
        type: ticketType,
        status: "OPEN"
      }
    })

    // 2. Attempt to email support@thewordof.com
    const resendKey = process.env.RESEND_API_KEY
    if (resendKey) {
      try {
        const resend = new Resend(resendKey)
        await resend.emails.send({
          from: "TheWordOf Tools <no-reply@thewordof.com>", // Using a standard format, requires verified domain in Resend
          to: "support@thewordof.com",
          replyTo: session.user.email || undefined,
          subject: `[${ticketType}] ${subject} - From: ${session.user.email}`,
          html: `
            <h3>New ${ticketType} Ticket (#${ticket.id})</h3>
            <p><strong>From:</strong> ${session.user.name || "User"} (${session.user.email})</p>
            <p><strong>Role:</strong> ${userRole}</p>
            <hr />
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          `
        })
      } catch (emailError) {
        console.error("Failed to send email via Resend:", emailError)
        // We don't throw here because the ticket was successfully saved to DB.
      }
    } else {
      console.warn("RESEND_API_KEY not found. Ticket saved to DB but email was not sent.")
    }

    return NextResponse.json({ success: true, ticketId: ticket.id })
  } catch (error) {
    console.error("Support Ticket Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
