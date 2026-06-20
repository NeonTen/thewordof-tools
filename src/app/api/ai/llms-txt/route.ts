import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { verifyAndDeductCredits } from "@/lib/credits";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Authentication required", { status: 401 });
    }

    const body = await req.json();
    const {
      brandName,
      description,
      rawUrls,
    } = body;

    if (!brandName || !description) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Deduct 1 credit for llms.txt generation
    const deduction = await verifyAndDeductCredits(session.user.id, 1);
    if (!deduction.success) {
      return new NextResponse(
        "Quota Exceeded: You do not have enough credits.",
        { status: 403 },
      );
    }

    const prompt = `You are an AI SEO expert. Generate a professional llms.txt file strictly following the official llmstxt.org specification for the following website.

    Brand Name: ${brandName}
    Description: ${description}
    Raw URLs: ${rawUrls || "None provided"}

    The llms.txt format MUST strictly follow these rules:
    1. The very first line MUST be an H1 header with the brand name (e.g. # ${brandName}).
    2. The second block MUST be a blockquote (> ) containing a concise 1-2 sentence summary of the website, condensed from the Description.
    3. Categorize the Raw URLs into appropriate H2 (##) sections (e.g. ## Getting Started, ## API Reference, ## Documentation, ## Optional).
    4. Format all URLs as markdown lists with a brief descriptive name and optional note: - [Link Name](URL): Brief note explaining what this link is for.
    5. Do not include introductory text, conversational filler, or wrap the response in markdown code blocks (\`\`\`markdown). Output ONLY the raw markdown content.`;

    const result = streamText({
      model: google("gemini-1.5-flash-latest"),
      prompt,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("AI_LLMS_TXT_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
