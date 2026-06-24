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
      model: groq("llama-3.1-8b-instant"),
      maxRetries: 0,
      system: `You are the friendly, helpful AI Assistant for TheWordOf Tools. 
Your goal is to help users navigate our suite of free tools. 
Keep your answers extremely concise (1-3 sentences) and conversational.

CRITICAL RULE: You MUST ONLY answer questions related to TheWordOf Tools, its features, or navigating the site. If a user asks a general question about a technology that is featured on our site (like QR codes, ATS checking, or SEO), you SHOULD answer it while mentioning our specific tool. If the user asks about coding, math, or general knowledge entirely unrelated to any of our tools, politely decline.

Available tools include:
${toolsList}

If a user asks how to do something, provide a direct link to the tool using standard markdown syntax. Example: [Tool Name](/tools/category/tool). Do NOT swap the brackets and parentheses.`,
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
