import { ToolHeader } from "@/components/tools/tool-header"
import { KeywordDensityAnalyzer } from "@/components/tools/keyword-density"
import { auth } from "@/auth"

export const metadata = {
  title: "Keyword Density & Frequency Analyzer | TheWordOf Tools",
  description: "Calculate keyword density percentages, count phrase frequencies, and optimize on-page SEO targeting guidelines.",
}

export default async function KeywordDensityPage() {
  const session = await auth()
  const isPro = session?.user?.role === "PRO" || session?.user?.role === "BUSINESS" || session?.user?.role === "ADMIN"

  return (
    <div className="flex flex-col gap-8">
      <div>
        <ToolHeader category="Technical SEO" categoryHref="/tools/technical-seo" title="Keyword Density" />
        <p className="text-muted-foreground mt-2">
          Inspect word frequency distributions, filter common stop-words, and optimize your semantic target keywords density.
        </p>
      </div>

      <KeywordDensityAnalyzer isPro={isPro} />
    </div>
  )
}
