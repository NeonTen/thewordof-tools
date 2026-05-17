import { google } from '@ai-sdk/google'
import { generateObject } from 'ai'
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { z } from 'zod'

export const maxDuration = 30
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const session = await auth()
    const role = session?.user?.role
    const isBusinessOrAdmin = role === "BUSINESS" || role === "ADMIN"

    if (!isBusinessOrAdmin) {
      return new NextResponse("Unauthorized. Business or Admin tier required.", { status: 403 })
    }

    const { url } = await req.json()
    if (!url) {
      return NextResponse.json({ error: 'invalid_url' }, { status: 400 })
    }

    let targetUrl: URL
    try {
      targetUrl = new URL(url)
    } catch {
      return NextResponse.json({ error: 'invalid_url' }, { status: 400 })
    }

    if (!targetUrl.hostname.includes("linkedin.com") || !targetUrl.pathname.includes("/in/")) {
      return NextResponse.json({ error: 'invalid_url' }, { status: 400 })
    }

    // Set up fetch abort controller with 10-second timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (response.status === 404) {
        return NextResponse.json({ error: 'profile_not_public' }, { status: 400 })
      }

      if (!response.ok) {
        return NextResponse.json({ error: 'fetch_failed' }, { status: 500 })
      }

      const html = await response.text()

      // Basic tag removal and compression to save token space
      const cleanedText = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()

      // Detection of authwalls / login pages served by LinkedIn
      if (
        cleanedText.includes("authwall") || 
        cleanedText.includes("Join to see") || 
        (cleanedText.includes("Sign in") && cleanedText.includes("LinkedIn")) ||
        cleanedText.length < 500
      ) {
        return NextResponse.json({ error: 'profile_not_public' }, { status: 400 })
      }

      // Vercel AI SDK generateObject with typed Zod schema
      const result = await generateObject({
        model: google('gemini-2.5-flash'),
        schema: z.object({
          name: z.string(),
          title: z.string(),
          location: z.string(),
          summary: z.string(),
          skillsText: z.string(),
          experience: z.array(z.object({
            company: z.string(),
            role: z.string(),
            period: z.string(),
            desc: z.string()
          })),
          education: z.array(z.object({
            school: z.string(),
            degree: z.string(),
            period: z.string()
          }))
        }),
        prompt: `You are an expert CV Parser.
Extract professional info from this public LinkedIn profile page text. Return empty strings or arrays for missing details.
Ensure skillsText is a flat comma-separated list of extracted skills (e.g. "React, Next.js, TypeScript").

LinkedIn Profile text:
${cleanedText.substring(0, 35000)}
`
      })

      return NextResponse.json(result.object)
    } catch (fetchErr) {
      clearTimeout(timeoutId)
      console.error("Fetch Exception:", fetchErr)
      return NextResponse.json({ error: 'fetch_failed' }, { status: 500 })
    }
  } catch (error) {
    console.error("AI_LINKEDIN_IMPORT_ERROR", error)
    return NextResponse.json({ error: 'parse_failed' }, { status: 500 })
  }
}
