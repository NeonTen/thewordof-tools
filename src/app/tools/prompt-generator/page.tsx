import { PromptGenerator } from "@/components/tools/prompt-generator"
import { auth } from "@/auth"

export const metadata = {
  title: "AI Prompt Generator",
  description: "Create high-quality prompts for ChatGPT, Midjourney, and more.",
}

export default async function PromptGeneratorPage() {
  const session = await auth()
  const isPro = session?.user?.role === "PRO" || session?.user?.role === "BUSINESS" || session?.user?.role === "ADMIN"

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Prompt Generator</h1>
        <p className="text-muted-foreground mt-2">
          Create high-quality prompts for ChatGPT, Midjourney, and more.
        </p>
      </div>

      <PromptGenerator isPro={isPro} />
    </div>
  )
}
