import { CaptionGenerator } from "@/components/tools/caption-generator"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export const metadata = {
  title: "AI Caption Generator",
  description: "Generate engaging social media captions with AI.",
}

export default async function CaptionGeneratorPage() {
  const session = await auth()
  const isPro = session?.user?.role === "PRO" || session?.user?.role === "BUSINESS" || session?.user?.role === "ADMIN"

  const dbUser = session?.user?.id ? await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { creditsRemaining: true }
  }) : null

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Caption Generator</h1>
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
  )
}
