import { google } from '@ai-sdk/google'
import { generateText } from 'ai'
import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export const maxDuration = 30
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const session = await auth()
    const isPro = session?.user?.role === "PRO" || session?.user?.role === "BUSINESS" || session?.user?.role === "ADMIN"

    const { keyword, audience, pageType, tone } = await req.json()

    if (!keyword || !pageType) {
      return new NextResponse("Missing required fields", { status: 400 })
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
