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

    const deduction = await verifyAndDeductCredits(session.user.id, 1);
    if (!deduction.success) {
      return new NextResponse("Quota Exceeded", { status: 403 });
    }

    const prompt = `You are an expert Resume Reviewer. Analyze the following resume text and provide a detailed review highlighting strengths, action verbs, formatting improvements, and grammar. Return your feedback strictly in Markdown format.\n\nResume Text:\n${resumeText}`;

    const result = streamText({
      model: google("gemini-2.5-flash"),
      prompt,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("AI_RESUME_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
