import { CaptionGenerator } from "@/components/tools/caption-generator"
import { auth } from "@/auth"

export const metadata = {
  title: "AI Caption Generator",
  description: "Generate engaging social media captions with AI.",
}

export default async function CaptionGeneratorPage() {
  const session = await auth()
  const isPro = session?.user?.role === "PRO" || session?.user?.role === "ADMIN"

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Caption Generator</h1>
        <p className="text-muted-foreground mt-2">
          Generate engaging social media captions with AI.
        </p>
      </div>

      <CaptionGenerator isPro={isPro} />
    </div>
  )
}
