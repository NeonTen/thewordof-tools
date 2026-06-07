import { ToolHeader } from "@/components/tools/tool-header"
import { SchemaGenerator } from "@/components/tools/schema-generator"
import { auth } from "@/auth"

export const metadata = {
  title: "SEO Schema Generator",
  description: "Generate JSON-LD schema markup for your website.",
}

export default async function SchemaGeneratorPage() {
  const session = await auth()
  const isPro = session?.user?.role === "PRO" || session?.user?.role === "BUSINESS" || session?.user?.role === "ADMIN"

  return (
    <div className="flex flex-col gap-8">
      <div>
        <ToolHeader category="Technical SEO" categoryHref="/tools/technical-seo" title="Schema Generator" />
        <p className="text-muted-foreground mt-2">
          Boost your SEO by adding structured data to your web pages.
        </p>
      </div>

      <SchemaGenerator isPro={isPro} />
    </div>
  )
}
