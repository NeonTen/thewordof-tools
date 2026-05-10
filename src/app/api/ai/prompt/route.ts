import { google } from '@ai-sdk/google'
import { streamText } from 'ai'
import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export const maxDuration = 30
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const session = await auth()
    const isPro = session?.user?.role === "PRO" || session?.user?.role === "ADMIN"

    const body = await req.json()
    const { category, goal, context, constraints } = body

    if (!goal) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const prompt = `You are a Prompt Engineering Expert. Create an incredibly detailed, highly optimized prompt for an AI model based on the following inputs.

    AI Category: ${category || 'ChatGPT'}
    Goal/Task: ${goal}
    Context/Background: ${context || 'None provided'}
    Constraints/Rules: ${constraints || 'None provided'}
    
    Output ONLY the final optimized prompt. The prompt should be structured using best practices (e.g., assigning a role, providing context, specifying the exact format, providing step-by-step reasoning if needed). Do not include any meta-commentary like "Here is your prompt:". Just the prompt itself.`

    const result = streamText({
      model: google('gemini-2.5-flash'),
      prompt,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("AI_PROMPT_ERROR", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
