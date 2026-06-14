import { generateSeoMetadata } from "@/app/lib/seo";
import { ToolHeader } from "@/components/tools/tool-header";
import { PromptGenerator } from "@/components/tools/prompt-generator";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const metadata = generateSeoMetadata({
  title: "AI Prompt Generator",
  description: "Create high-quality prompts for ChatGPT, Midjourney, and more.",
});

export default async function PromptGeneratorPage() {
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
          title="AI Prompt Generator"
        />
        <p className="text-muted-foreground mt-2">
          Create high-quality prompts for ChatGPT, Midjourney, and more.
        </p>
      </div>

      <PromptGenerator
        isPro={isPro}
        creditsRemaining={dbUser?.creditsRemaining ?? null}
        isLoggedIn={!!session?.user}
      />
    </div>
  );
}
