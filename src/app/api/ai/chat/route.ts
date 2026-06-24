import { google } from "@ai-sdk/google";
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
      model: google("gemini-1.5-flash-latest"),
      maxRetries: 0,
      system: `You are the friendly, helpful AI Assistant for TheWordOf Tools. 
Your goal is to help users navigate our suite of free tools. 
Keep your answers extremely concise (1-3 sentences) and conversational.

CRITICAL RULE: You MUST ONLY answer questions related to TheWordOf Tools or navigating the site. If the user asks about coding, math, general knowledge, or anything unrelated to this platform, politely decline and state that you are only here to help with TheWordOf Tools.

Available tools include:
${toolsList}

If a user asks how to do something, provide a direct link to the tool using markdown: [Tool Name](/tools/category/tool).`,
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
