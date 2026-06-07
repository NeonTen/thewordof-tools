import { ToolHeader } from "@/components/tools/tool-header"
import { SitemapValidator } from "@/components/tools/sitemap-validator"

import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "XML Sitemap Validator & Visualizer - Technical SEO Tools",
  description: "Load, parse, validate and visualize your website's XML sitemaps to verify crawler link coverage.",
}

export default function SitemapValidatorPage() {
  return (
    <div className="flex flex-col gap-6">
      
      <div>
        <ToolHeader category="Technical SEO" categoryHref="/tools/technical-seo" title="XML Sitemap Validator" />
        <p className="text-muted-foreground mt-2">
          Verify formatting compliance, trace link attributes, and visualize hierarchical directory depths.
        </p>
      </div>
      <SitemapValidator />
    </div>
  )
}
