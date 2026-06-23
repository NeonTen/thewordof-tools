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

    const { resumeText } = await req.json();
    if (!resumeText) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Deduct 2 credits for the fix
    const deduction = await verifyAndDeductCredits(session.user.id, 2);
    if (!deduction.success) {
      return new NextResponse("Quota Exceeded", { status: 403 });
    }

    const prompt = `You are an expert Resume Writer and Career Coach. 
Your task is to completely rewrite and improve the provided resume.
- Strengthen action verbs and highlight impact/metrics.
- Improve formatting by using a clean, readable structure (use markdown, bolding, bullet points).
- Remove fluff, clichés, and passive language.
- Ensure the tone is highly professional and achievement-oriented.
- Do NOT invent fake jobs or fake metrics; just present the existing information in the most powerful way possible.
- Output ONLY the rewritten resume text.

Original Resume:
${resumeText}`;

    const result = streamText({
      model: google("gemini-2.5-flash"),
      prompt,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("AI_RESUME_IMPROVER_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
