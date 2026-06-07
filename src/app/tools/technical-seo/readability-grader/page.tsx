import { ToolHeader } from "@/components/tools/tool-header"
import { ReadabilityGrader } from "@/components/tools/readability-grader"
import { auth } from "@/auth"

export const metadata = {
  title: "SEO Readability & Content Grader | TheWordOf Tools",
  description: "Grade writing readability using Flesch Reading Ease metrics, inspect sentence lengths, and optimize text readability.",
}

export default async function ReadabilityGraderPage() {
  const session = await auth()
  const isPro = session?.user?.role === "PRO" || session?.user?.role === "BUSINESS" || session?.user?.role === "ADMIN"

  return (
    <div className="flex flex-col gap-8">
      <div>
        <ToolHeader category="Technical SEO" categoryHref="/tools/technical-seo" title="SEO Readability" />
        <p className="text-muted-foreground mt-2">
          Calculate standard readability scores, evaluate sentence complexities, and optimize content structure for web readers.
        </p>
      </div>

      <ReadabilityGrader isPro={isPro} />
    </div>
  )
}
