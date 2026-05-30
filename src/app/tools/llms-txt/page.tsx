import { LlmsTxtGenerator } from "@/components/tools/llms-txt-generator"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export const metadata = {
  title: "llms.txt Generator",
  description: "Generate AI-optimized descriptions for your website.",
}

export default async function LlmsTxtPage() {
  const session = await auth()
  const isPro = session?.user?.role === "PRO" || session?.user?.role === "BUSINESS" || session?.user?.role === "ADMIN"

  const dbUser = session?.user?.id ? await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { creditsRemaining: true }
  }) : null

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">llms.txt Generator</h1>
        <p className="text-muted-foreground mt-2">
          Generate AI-optimized descriptions for your website.
        </p>
      </div>

      <LlmsTxtGenerator 
        isPro={isPro} 
        creditsRemaining={dbUser?.creditsRemaining ?? null} 
        isLoggedIn={!!session?.user} 
      />
    </div>
  )
}
