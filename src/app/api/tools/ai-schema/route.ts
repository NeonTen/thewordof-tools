import { google } from "@ai-sdk/google"
import { generateText } from "ai"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { verifyAndDeductCredits } from "@/lib/credits"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Check Pro status
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { subscriptions: true }
    })

    const isPro = user?.role === "PRO" || user?.role === "BUSINESS" || user?.role === "ADMIN" || user?.subscriptions?.[0]?.plan === "PREMIUM" || user?.subscriptions?.[0]?.plan === "BUSINESS"

    if (!isPro) {
      return new NextResponse("Pro subscription required", { status: 403 })
    }

    // Deduct 1 credit for Pro AI Schema Generation
    const deduction = await verifyAndDeductCredits(session.user.id, 1)
    if (!deduction.success) {
      return new NextResponse("Quota Exceeded: You do not have enough credits.", { status: 403 })
    }

    const { prompt } = await req.json()

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 })
    }

    console.log("AI_SCHEMA_REQUEST", { promptLength: prompt.length })

    const systemPrompt = `You are an expert SEO specialist. Generate exactly ONE single valid JSON-LD schema object representing the primary entity described by the user. 
    Do NOT output multiple root-level schemas or wrap it in a @graph or array unless explicitly requested by the user. Detect the most appropriate schema type from the context.
    Return ONLY the JSON object. Do not include markdown code blocks. 
    Ensure it follows schema.org standards.`

    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      system: systemPrompt,
      prompt: prompt,
    })

    let cleanJson = text.trim()
    if (cleanJson.includes("```")) {
      cleanJson = cleanJson.replace(/```json/g, "").replace(/```/g, "").trim()
    }

    try {
      const json = JSON.parse(cleanJson)
      return NextResponse.json(json)
    } catch (e) {
      console.error("AI_SCHEMA_PARSE_ERROR", { text, error: e })
      return NextResponse.json({ 
        error: "Failed to parse AI response as JSON", 
        raw: text 
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error("AI_SCHEMA_ERROR", error.message || error)
    return new NextResponse(error.message || "Internal Error", { status: 500 })
  }
}
