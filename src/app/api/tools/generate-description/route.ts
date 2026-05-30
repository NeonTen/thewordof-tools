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

    // Deduct 1 credit for product description generation
    const deduction = await verifyAndDeductCredits(session.user.id, 1)
    if (!deduction.success) {
      return new NextResponse("Quota Exceeded: You do not have enough credits.", { status: 403 })
    }

    const formData = await req.formData()
    const title = formData.get("title") as string
    const featuresRaw = formData.get("features") as string
    const featuresList = featuresRaw ? JSON.parse(featuresRaw) as string[] : []
    const image = formData.get("image") as File | null

    console.log("AI_PRODUCT_DESCRIPTION_REQUEST", { 
      userId: session?.user?.id, 
      title, 
      hasImage: !!image 
    })

    if (!title) {
      return new NextResponse("Product title is required", { status: 400 })
    }

    const featuresPrompt = featuresList.length > 0 
      ? `Key Features:\n${featuresList.map(f => `- ${f}`).join('\n')}`
      : "No specific features provided."

    let promptText = `You are a professional e-commerce copywriter who writes in a warm, natural, human tone. Avoid overly promotional jargon, fake excitement, and complex corporate buzzwords. Use clear, simple, and conversational language.

Generate two versions of an e-commerce product description for:
Product Title: ${title}
${featuresPrompt}

Please format your response in clean Markdown as follows:

### ⚡ Short Version (Punchy & Casual)
- Write a 2-3 sentence overview that captures the product's main value and feel in a warm, easygoing tone.

---

### 📖 Standard Version
- **Headline**: A brief, benefit-driven title.
- **Overview**: 1-2 short paragraphs highlighting the product's main utility in a friendly, conversational tone.
- **Key Highlights**: 3-4 bullet points elaborating on key features (explain them in very simple, benefit-driven terms).
- Keep this version concise and highly readable (do not make it overly long).`

    let result;
    if (image) {
      promptText += `\n\nAnalyze the uploaded product image to understand the product's design, style, color, materials, build quality, and visual aesthetics. Incorporate these observations into the generated description.`
      
      const imageBuffer = new Uint8Array(await image.arrayBuffer())
      
      result = await generateText({
        model: google('gemini-2.5-flash'),
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: promptText },
              {
                type: 'image',
                image: imageBuffer,
                mediaType: image.type,
              },
            ],
          },
        ],
      })
    } else {
      result = await generateText({
        model: google('gemini-2.5-flash'),
        prompt: promptText,
      })
    }

    return NextResponse.json({ description: result.text })
  } catch (error) {
    console.error("AI_PRODUCT_DESCRIPTION_ERROR", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
