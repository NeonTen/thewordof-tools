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

    const { resumeText, jobDescription } = await req.json();
    if (!resumeText || !jobDescription) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const deduction = await verifyAndDeductCredits(session.user.id, 1);
    if (!deduction.success) {
      return new NextResponse("Quota Exceeded", { status: 403 });
    }

    const prompt = `You are an ATS (Applicant Tracking System) simulation engine. Compare the following resume against the job description.
Your task is to return a structured analysis containing:
1. "score": An integer from 0 to 100 representing the ATS match percentage.
2. "matchedKeywords": An array of strings representing important skills/keywords found in both the resume and JD.
3. "missingKeywords": An array of strings representing critical skills/keywords present in the JD but missing from the resume.
4. "feedback": A brief paragraph summarizing how to improve the match.

Job Description:
${jobDescription}

Resume Text:
${resumeText}`;

    const result = await generateObject({
      model: google("gemini-2.5-flash"),
      prompt,
      schema: z.object({
        score: z.number(),
        matchedKeywords: z.array(z.string()),
        missingKeywords: z.array(z.string()),
        feedback: z.string(),
      })
    });

    return NextResponse.json(result.object);
  } catch (error) {
    console.error("AI_ATS_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
