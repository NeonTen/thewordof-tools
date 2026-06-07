import { ToolHeader } from "@/components/tools/tool-header"
import { SerpPreviewer } from "@/components/tools/serp-preview"
import { auth } from "@/auth"

export const metadata = {
  title: "Google SERP Previewer & Meta Tag Generator | TheWordOf Tools",
  description: "Preview search result listings and optimize meta tags for SEO.",
}

export default async function SerpPreviewPage() {
  const session = await auth()
  const isPro = session?.user?.role === "PRO" || session?.user?.role === "BUSINESS" || session?.user?.role === "ADMIN"

  return (
    <div className="flex flex-col gap-8">
      <div>
        <ToolHeader category="Technical SEO" categoryHref="/tools/technical-seo" title="SERP Previewer" />
        <p className="text-muted-foreground mt-2">
          Preview how your pages display in Google search results and verify meta tag accessibility standards.
        </p>
      </div>

      <SerpPreviewer isPro={isPro} />
    </div>
  )
}
