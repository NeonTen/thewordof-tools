import { generateSeoMetadata } from "@/app/lib/seo";
import { ToolHeader } from "@/components/tools/tool-header";
import { CaptionGenerator } from "@/components/tools/caption-generator";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const metadata = generateSeoMetadata({
  title: "AI Caption Generator",
  description: "Generate engaging social media captions with AI.",
  canonical: "/tools/ai-tools/caption-generator",
});

export default async function CaptionGeneratorPage() {
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
          category="AI Tools"
          categoryHref="/tools/ai-tools"
          title="AI Caption Generator"
        />
        <p className="text-muted-foreground mt-2">
          Generate engaging social media captions with AI.
        </p>
      </div>

      <CaptionGenerator
        isPro={isPro}
        creditsRemaining={dbUser?.creditsRemaining ?? null}
        isLoggedIn={!!session?.user}
      />
    </div>
  );
}
