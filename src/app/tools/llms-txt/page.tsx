import { LlmsTxtGenerator } from "@/components/tools/llms-txt-generator"
import { auth } from "@/auth"

export const metadata = {
  title: "llms.txt Generator",
  description: "Generate AI-optimized descriptions for your website.",
}

export default async function LlmsTxtPage() {
  const session = await auth()
  const isPro = session?.user?.role === "PRO" || session?.user?.role === "BUSINESS" || session?.user?.role === "ADMIN"

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">llms.txt Generator</h1>
        <p className="text-muted-foreground mt-2">
          Generate AI-optimized descriptions for your website.
        </p>
      </div>

      <LlmsTxtGenerator isPro={isPro} />
    </div>
  )
}
