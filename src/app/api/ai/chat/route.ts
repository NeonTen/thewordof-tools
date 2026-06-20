import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: google("gemini-flash-latest"),
      system: `You are the friendly, helpful AI Assistant for TheWordOf Tools. 
Your goal is to help users navigate our suite of free tools. 
Keep your answers extremely concise (1-3 sentences) and conversational.

Available tools include:
- AI Resume/CV Builder (/tools/ai-tools/cv-builder)
- Dynamic QR Codes (/tools/image-code/qr-code)
- Invoice Generator (/tools/document-tools/invoice-generator)
- Image Converter & SVG Compressor (/tools/image-code/image-converter)
- PDF Merger & Watermarker (/tools/document-tools/pdf-merger)
- SEO Tags & Readability Grader (/tools/technical-seo/readability-grader)

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
