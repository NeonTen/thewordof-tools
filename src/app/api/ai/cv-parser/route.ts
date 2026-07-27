import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { z } from "zod";

import { verifyAndDeductCredits } from "@/lib/credits";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Authentication required", { status: 401 });
    }

    const role = session?.user?.role;
    const isBusinessOrAdmin = role === "BUSINESS" || role === "ADMIN";

    if (!isBusinessOrAdmin) {
      return new NextResponse(
        "Unauthorized. Business or Admin tier required.",
        { status: 403 },
      );
    }

    // Deduct 3 credits for heavy CV parsing task
    const deduction = await verifyAndDeductCredits(session.user.id, 3);
    if (!deduction.success) {
      return new NextResponse(
        "Quota Exceeded: You do not have enough credits.",
        { status: 403 },
      );
    }

    const { text } = await req.json();
    if (!text || text.trim().length < 100) {
      return NextResponse.json({ error: "text_too_short" }, { status: 400 });
    }

    const result = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: z.object({
        name: z.string(),
        title: z.string(),
        email: z.string(),
        phone: z.string(),
        location: z.string(),
        summary: z.string(),
        skillsText: z.string(),
        experience: z.array(
          z.object({
            company: z.string(),
            role: z.string(),
            period: z.string(),
            desc: z.string(),
          }),
        ),
        education: z.array(
          z.object({
            school: z.string(),
            degree: z.string(),
            period: z.string(),
          }),
        ),
        projects: z.array(
          z.object({
            title: z.string(),
            link: z.string(),
            desc: z.string(),
          }),
        ),
      }),
      prompt: `You are an expert CV Parser.
Extract professional info from this raw CV text, LinkedIn profile copy, or professional bio. 
Return empty strings or arrays for missing details.
Ensure skillsText is a flat comma-separated list of extracted skills (e.g. "React, Next.js, TypeScript").
Identify any notable key projects (e.g., LearningMole, ProfileTree) and populate them in the projects array with title, link (if any), and desc.
For experience[].desc, projects[].desc, and summary, format multi-item achievements, responsibilities, or bullet points as separate lines starting with "- " separated by newlines \n (e.g., "- Developed scalable APIs\n- Managed team of 4"). NEVER concatenate bullet items onto a single line or join them with ".-".

Raw input text:
${text.substring(0, 30000)}
`,
    });

    return NextResponse.json(result.object);
  } catch (error) {
    console.error("AI_CV_PARSER_ERROR", error);
    return NextResponse.json({ error: "parse_failed" }, { status: 500 });
  }
}
