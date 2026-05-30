import { google } from '@ai-sdk/google'
import { generateText } from 'ai'
import { NextResponse } from 'next/server'
import { auth } from '@/auth'

import { verifyAndDeductCredits } from '@/lib/credits'

export const maxDuration = 30
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new NextResponse("Authentication required", { status: 401 })
    }

    const { keyword, audience, pageType, tone } = await req.json()

    if (!keyword || !pageType) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    // Deduct 1 credit for SEO metadata generation
    const deduction = await verifyAndDeductCredits(session.user.id, 1)
    if (!deduction.success) {
      return new NextResponse("Quota Exceeded: You do not have enough credits.", { status: 403 })
    }

    const prompt = `You are an expert SEO specialist. Generate highly optimized SEO metadata for a webpage.
    Target Keyword: ${keyword}
    Page Type: ${pageType}
    Target Audience: ${audience || 'General'}
    Tone: ${tone || 'Professional'}
    
    You must return a raw JSON object with NO markdown formatting, NO backticks, and NO code blocks. The JSON must have exactly this structure:
    {
      "title": "A highly clickable SEO title (under 60 chars)",
      "description": "A compelling meta description (under 155 chars)",
      "ogTitle": "Title optimized for social sharing",
      "ogDescription": "Description optimized for social sharing",
      "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
    }`

    const { text } = await generateText({
      model: google('gemini-2.5-flash'),
      prompt,
    })

    // Remove any markdown formatting if the model accidentally includes it
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim()
    const metadata = JSON.parse(cleanJson)

    return NextResponse.json(metadata)
  } catch (error) {
    console.error("AI_SEO_ERROR", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
