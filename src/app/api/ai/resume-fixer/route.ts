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

    const { resumeText, jobDescription } = await req.json();
    if (!resumeText || !jobDescription) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Deduct 2 credits for the fix
    const deduction = await verifyAndDeductCredits(session.user.id, 2);
    if (!deduction.success) {
      return new NextResponse("Quota Exceeded", { status: 403 });
    }

    const prompt = `You are an expert Resume Writer and ATS Optimizer. 
Your task is to rewrite the provided resume so that it better matches the provided job description.
- Naturally incorporate missing keywords from the job description into the resume's experience, skills, or summary sections.
- Do NOT lie or invent completely fake jobs, but rephrase existing points to highlight relevant skills.
- Improve action verbs and impact metrics.
- Output ONLY the rewritten resume in a clean, readable text format (you may use basic markdown like bullet points and bolding). Do not include any meta-commentary or conversational text.

Job Description:
${jobDescription}

Original Resume:
${resumeText}`;

    const result = streamText({
      model: google("gemini-2.5-flash"),
      prompt,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("AI_RESUME_FIX_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
