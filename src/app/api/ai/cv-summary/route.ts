import { google } from "@ai-sdk/google";
import { generateText } from "ai";
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

    const { role, skills, experience } = await req.json();

    if (!role) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Deduct 1 credit for resume summary generation
    const deduction = await verifyAndDeductCredits(session.user.id, 1);
    if (!deduction.success) {
      return new NextResponse(
        "Quota Exceeded: You do not have enough credits.",
        { status: 403 },
      );
    }

    const prompt = `You are an expert Resume Writer. Write a compelling, professional 3-4 sentence summary for a resume.
    Target Role: ${role}
    Key Skills: ${skills}
    Years of Experience / Context: ${experience}
    
    Do not include any greeting or formatting. Just output the paragraph.`;

    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt,
    });

    return new NextResponse(text);
  } catch (error) {
    console.error("AI_CV_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
