import { SchemaGenerator } from "@/components/tools/schema-generator"

export const metadata = {
  title: "SEO Schema Generator",
  description: "Generate JSON-LD schema markup for your website.",
}

export default function SchemaGeneratorPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Schema Generator</h1>
        <p className="text-muted-foreground mt-2">
          Boost your SEO by adding structured data to your web pages.
        </p>
      </div>

      <SchemaGenerator />
    </div>
  )
}
