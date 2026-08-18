import { groq } from "@ai-sdk/groq";
import { streamText } from "ai";
import { navGroups } from "@/config/tools";

export const maxDuration = 30;
export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const toolsList = navGroups
      .flatMap((g) => g.items)
      .filter((i) => !i.title.startsWith("All "))
      .map((i) => `- ${i.title} (${i.href})`)
      .join("\n");

    const result = streamText({
      model: groq("openai/gpt-oss-20b"),
      maxRetries: 0,
      system: `You are the friendly, helpful AI Assistant for TheWordOf Tools. 
Your goal is to help users navigate our suite of tools and understand our features and pricing plans. 
Keep your answers concise (1-3 sentences) and conversational.

CRITICAL RULES:
1. ONLY answer questions related to TheWordOf Tools, its features, pricing, or navigating the site. If a user asks about coding, math, or general knowledge entirely unrelated to our tools, politely decline.
2. Link formatting: Always provide direct internal links using standard markdown syntax with relative paths (e.g., [Invoice Generator](/tools/document-tools/invoice-generator) or [Pricing](/pricing)). Do NOT include domain or localhost prefixes.

PRICING & TIERS KNOWLEDGE:
- Free Tier: Includes free access to all utility tools with reasonable limits (e.g., 3 invoices per month, 20 monthly AI credits, 5 files per batch, 1 dynamic QR code with 15-day expiry).
- Pro Tier (₹499/mo or $5.99/mo): Unlocks unlimited invoices with custom branding, 500 monthly AI credits, unlimited dynamic QR codes with scan analytics, batch processing up to 1,000 files with bulk ZIP downloads, AI CV builder (10 templates), and no upgrade banners.
- Business Tier (₹1499/mo or $19.99/mo): 2,000 monthly AI credits, 100% unlimited batch processing, geographic scan tracking, UTM campaign builder, QR analytics export (CSV/PDF), and 24/7 priority support.
- If users ask about pricing or upgrading, direct them to [Pricing](/pricing).

Available tools include:
${toolsList}`,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate response" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
