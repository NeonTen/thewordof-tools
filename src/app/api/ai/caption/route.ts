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
    const { platform, tone, audience, topic, keywords } = body;

    if (!platform || !topic) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Deduct 1 credit for social caption generation
    const deduction = await verifyAndDeductCredits(session.user.id, 1);
    if (!deduction.success) {
      return new NextResponse(
        "Quota Exceeded: You do not have enough credits.",
        { status: 403 },
      );
    }

    const isPro =
      session?.user?.role === "PRO" ||
      session?.user?.role === "BUSINESS" ||
      session?.user?.role === "ADMIN";

    const count = isPro ? 10 : 3;
    const prompt = `You are an expert social media manager. Create ${count} highly engaging captions for ${platform}.
    Topic: ${topic}
    Tone: ${tone || "Professional"}
    Target Audience: ${audience || "General audience"}
    Keywords to include: ${keywords || "None"}
    
    For each caption, include relevant emojis and a strong call-to-action (CTA). Also provide 5-7 relevant hashtags at the end.
    Separate each caption with '---'.`;

    const result = streamText({
      model: google("gemini-2.5-flash"),
      prompt,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("AI_CAPTION_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
