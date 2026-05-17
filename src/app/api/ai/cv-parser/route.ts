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

    const { text } = await req.json()
    if (!text || text.trim().length < 100) {
      return NextResponse.json({ error: 'text_too_short' }, { status: 400 })
    }

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
Extract professional info from this raw CV text, LinkedIn profile copy, or professional bio. 
Return empty strings or arrays for missing details.
Ensure skillsText is a flat comma-separated list of extracted skills (e.g. "React, Next.js, TypeScript").

Raw input text:
${text.substring(0, 30000)}
`
    })

    return NextResponse.json(result.object)
  } catch (error) {
    console.error("AI_CV_PARSER_ERROR", error)
    return NextResponse.json({ error: 'parse_failed' }, { status: 500 })
  }
}
