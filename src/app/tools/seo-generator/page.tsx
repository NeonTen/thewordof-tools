import { SeoGenerator } from "@/components/tools/seo-generator"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export const metadata = {
  title: "AI SEO Generator",
  description: "Generate SEO-optimized meta titles and descriptions.",
}

export default async function SeoGeneratorPage() {
  const session = await auth()
  const isPro = session?.user?.role === "PRO" || session?.user?.role === "BUSINESS" || session?.user?.role === "ADMIN"

  const dbUser = session?.user?.id ? await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { creditsRemaining: true }
  }) : null

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI SEO Generator</h1>
        <p className="text-muted-foreground mt-2">
          Generate SEO-optimized meta titles and descriptions.
        </p>
      </div>

      <SeoGenerator 
        isPro={isPro} 
        creditsRemaining={dbUser?.creditsRemaining ?? null} 
        isLoggedIn={!!session?.user} 
      />
    </div>
  )
}
