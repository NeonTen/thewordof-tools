import { generateSeoMetadata } from "@/app/lib/seo";
import { ToolHeader } from "@/components/tools/tool-header";
import { ReadabilityGrader } from "@/components/tools/readability-grader";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const metadata = generateSeoMetadata({
  title: "SEO Readability & Content Grader | TheWordOf Tools",
  description:
    "Grade writing readability using Flesch Reading Ease metrics, inspect sentence lengths, and optimize text readability.",
  canonical: "/tools/technical-seo/readability-grader",
});

export default async function ReadabilityGraderPage() {
  const session = await auth();
  const isPro =
    session?.user?.role === "PRO" ||
    session?.user?.role === "BUSINESS" ||
    session?.user?.role === "ADMIN";

  const dbUser = session?.user?.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { creditsRemaining: true },
      })
    : null;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <ToolHeader
          category="Technical SEO"
          categoryHref="/tools/technical-seo"
          title="SEO Readability"
        />
        <p className="text-muted-foreground mt-2">
          Calculate standard readability scores, evaluate sentence complexities,
          and optimize content structure for web readers.
        </p>
      </div>

      <ReadabilityGrader
        isPro={isPro}
        creditsRemaining={dbUser?.creditsRemaining ?? null}
        isLoggedIn={!!session?.user}
      />
    </div>
  );
}
