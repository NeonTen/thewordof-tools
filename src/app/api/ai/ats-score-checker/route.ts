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

    const deduction = await verifyAndDeductCredits(session.user.id, 1);
    if (!deduction.success) {
      return new NextResponse("Quota Exceeded", { status: 403 });
    }

    const prompt = `You are an ATS system simulator. Compare the following resume to the job description. Provide an ATS Match Score out of 100, identify matched keywords, and list missing critical keywords. Return your feedback strictly in Markdown format.\n\nJob Description:\n${jobDescription}\n\nResume Text:\n${resumeText}`;

    const result = streamText({
      model: google("gemini-2.5-flash"),
      prompt,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("AI_ATS_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
