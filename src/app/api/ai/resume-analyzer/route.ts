import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { verifyAndDeductCredits } from "@/lib/credits";
import { z } from "zod";

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

    const prompt = `You are an expert Resume Reviewer and Career Coach. Analyze the following resume.
Your task is to return a structured analysis containing:
1. "score": An integer from 0 to 100 representing the overall quality, impact, and formatting of the resume.
2. "strengths": An array of strings representing the strongest points of the resume (e.g., "Strong action verbs", "Clear metrics").
3. "weaknesses": An array of strings representing critical areas to improve (e.g., "Passive language", "Missing education details").
4. "feedback": A brief paragraph summarizing how to improve the overall quality of the resume.

Resume Text:
${resumeText}`;

    const result = await generateObject({
      model: google("gemini-2.5-flash"),
      prompt,
      schema: z.object({
        score: z.number(),
        strengths: z.array(z.string()),
        weaknesses: z.array(z.string()),
        feedback: z.string(),
      })
    });

    return NextResponse.json(result.object);
  } catch (error) {
    console.error("AI_RESUME_ANALYZER_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
