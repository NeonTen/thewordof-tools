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

    const { role, skills, experience } = await req.json()

    if (!role) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const prompt = `You are an expert Resume Writer. Write a compelling, professional 3-4 sentence summary for a resume.
    Target Role: ${role}
    Key Skills: ${skills}
    Years of Experience / Context: ${experience}
    
    Do not include any greeting or formatting. Just output the paragraph.`

    const { text } = await generateText({
      model: google('gemini-2.5-flash'),
      prompt,
    })

    return new NextResponse(text)
  } catch (error) {
    console.error("AI_CV_ERROR", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
