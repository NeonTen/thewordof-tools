import { google } from '@ai-sdk/google'
import { generateText } from 'ai'
import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export const maxDuration = 30
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const session = await auth()

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

    let promptText = `You are an expert e-commerce copywriter. Generate a highly engaging, SEO-optimized product description.
Product Title: ${title}
${featuresPrompt}

Please return a beautiful, ready-to-use product description in markdown. It must contain:
1. An engaging, benefit-driven product title/headline.
2. A compelling introductory hook explaining why this product is must-have.
3. An expanded bulleted list of key features (elaborate and explain the benefit of each feature mentioned).
4. A concluding paragraph detailing who this is perfect for and a strong call-to-action.`

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
