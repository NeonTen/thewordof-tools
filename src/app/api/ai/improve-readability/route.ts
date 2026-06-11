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

    const { text } = await req.json()
    if (!text || typeof text !== 'string') {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    // Deduct 2 credits for improving readability
    const deduction = await verifyAndDeductCredits(session.user.id, 2)
    if (!deduction.success) {
      return new NextResponse("Quota Exceeded: You do not have enough credits.", { status: 403 })
    }

    const prompt = `You are an expert copywriter and editor. Your task is to rewrite the following text to make it significantly easier to read.
    
    Target: Improve the Flesch Reading Ease score of the text to be 60 or higher (Standard Plain English / 8th-9th Grade level).
    Rules:
    - Simplify complex and multi-syllabic words with simpler synonyms.
    - Break up long, complex sentences into shorter, clear sentences.
    - Keep the original meaning, tone, and information intact.
    - Do NOT add markdown formatting, code blocks, or HTML tag wrappers around the output. Just return the clean, plain rewritten text.

    Original Text:
    ${text}`

    const { text: improvedText } = await generateText({
      model: google('gemini-2.5-flash'),
      prompt,
    })

    return NextResponse.json({
      originalText: text,
      improvedText: improvedText.trim()
    })
  } catch (error) {
    console.error("AI_IMPROVE_READABILITY_ERROR", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
