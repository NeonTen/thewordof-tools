import { google } from '@ai-sdk/google'
import { streamText } from 'ai'
import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export const maxDuration = 30
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const session = await auth()
    const isPro = session?.user?.role === "PRO" || session?.user?.role === "BUSINESS" || session?.user?.role === "ADMIN"

    const body = await req.json()
    const { brandName, description, sitemapUrl, contactInfo, documentationUrls, apiUrls } = body

    if (!brandName || !description) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const prompt = `You are an AI SEO expert. Generate a professional llms.txt file for the following website.
    Brand Name: ${brandName}
    Description: ${description}
    Sitemap: ${sitemapUrl || 'Not provided'}
    Contact: ${contactInfo || 'Not provided'}
    Docs: ${documentationUrls || 'Not provided'}
    API: ${apiUrls || 'Not provided'}
    
    The llms.txt format should follow these rules:
    1. Start with a # Title (Brand Name)
    2. Provide a brief summary
    3. Use > for key information/metadata
    4. List sections like Documentation, API, and important links as markdown links.
    5. Keep it concise and machine-readable.
    
    Output ONLY the content of the llms.txt file.`

    const result = streamText({
      model: google('gemini-2.5-flash'),
      prompt,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("AI_LLMS_TXT_ERROR", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
