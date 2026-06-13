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

    const { text, protectedKeywords = [] } = await req.json()
    if (!text || typeof text !== 'string') {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    // Deduct 2 credits for improving readability
    const deduction = await verifyAndDeductCredits(session.user.id, 2)
    if (!deduction.success) {
      return new NextResponse("Quota Exceeded: You do not have enough credits.", { status: 403 })
    }

    const rules = [
      "- Simplify complex and multi-syllabic words with simpler synonyms.",
      "- Break up long, complex sentences into shorter, clear sentences.",
      "- Keep the original meaning, tone, and information intact.",
      "- Preserve or introduce clear formatting using standard Markdown. Use '#' or '##' for sections/headings, list blocks ('-' or '1.') for key items, and '**' for emphasis where it makes the text easier to scan.",
      "- Do NOT include HTML tag wrappers, code block backticks (like ```markdown), or other non-plain-text symbols. Just return the raw markdown content."
    ]

    if (Array.isArray(protectedKeywords) && protectedKeywords.length > 0) {
      rules.push(`- CRITICAL RULE: You MUST preserve the following terms exactly as they are without any modifications, simplification, or substitution: ${protectedKeywords.map(k => `"${k}"`).join(", ")}. Do NOT rewrite or simplify these words/phrases.`)
    }

    const prompt = `You are an expert copywriter and editor. Your task is to rewrite the following text to make it significantly easier to read.
    
    Target: Improve the Flesch Reading Ease score of the text to be 60 or higher (Standard Plain English / 8th-9th Grade level).
    Rules:
    ${rules.join("\n")}

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
