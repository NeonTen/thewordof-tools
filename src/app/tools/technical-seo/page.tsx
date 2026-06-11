import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Code, 
  FileText, 
  Layers, 
  Cpu,
  Search,
  Type,
  Zap
} from "lucide-react"

export const metadata = {
  title: "Technical SEO Validation & Audit Tools | TheWordOf Tools",
  description: "Free online tools to generate structured schema markup, manage robots.txt directives, inspect sitemaps, analyze SERP layouts, and check readability.",
}

const tools = [
  {
    title: "Schema Generator",
    description: "Build JSON-LD structured data for Google Rich Results with live search previews.",
    href: "/tools/technical-seo/schema-generator",
    icon: Code,
    pro: false,
  },
  {
    title: "Robots.txt Gen & Tester",
    description: "Configure robots.txt crawler directives and test path access rules locally.",
    href: "/tools/technical-seo/robots-generator",
    icon: FileText,
    pro: false,
  },
  {
    title: "Sitemap Validator",
    description: "Fetch, validate, audit, and visually map XML Sitemap hierarchical structures.",
    href: "/tools/technical-seo/sitemap-validator",
    icon: Layers,
    pro: false,
  },
  {
    title: "LLMS.TXT Generator",
    description: "Generate AI-readable site summaries and specifications for LLM web crawlers.",
    href: "/tools/technical-seo/llms-txt",
    icon: Cpu,
    pro: false,
  },
  {
    title: "SERP Previewer & Meta Tag Analyzer",
    description: "Preview search results snippet presentation on Google Search, compute title/description sizing, and generate standard SEO and Open Graph tags.",
    href: "/tools/technical-seo/serp-preview",
    icon: Search,
    pro: false,
  },
  {
    title: "Keyword Density Analyzer",
    description: "Extract text directly from URL imports or raw text blocks to calculate word frequency and search optimization ratios.",
    href: "/tools/technical-seo/keyword-density",
    icon: FileText,
    pro: false,
  },
  {
    title: "SEO Readability & Content Grader",
    description: "Grade standard content readability scores using linguistic formulas including Flesch Reading Ease calculations.",
    href: "/tools/technical-seo/readability-grader",
    icon: Type,
    pro: true,
  },
  {
    title: "Broken Link & Anchor Text Auditor",
    description: "Inspect external websites to identify broken links, redirects, internal vs external ratios, and anchor texts.",
    href: "/tools/technical-seo/broken-links",
    icon: Zap,
    pro: true,
  },
]

export default function TechnicalSeoPage() {
  return (
    <div className="flex flex-col gap-8 pb-16">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Technical SEO Tools</h1>
        <p className="text-muted-foreground mt-2 text-base">
          Audit website indexing signals, generate structured metadata, and optimize for both search engine crawlers and LLM bots.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon
          return (
            <Link key={tool.href} href={tool.href} className="group block h-full">
              <Card className="h-full border border-border/50 bg-card hover:bg-muted/30 transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                  <div className="p-2.5 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    {tool.pro && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
                        PRO
                      </span>
                    )}
                    <CardTitle className="text-lg font-black group-hover:text-primary transition-colors duration-200 mt-1">
                      {tool.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                    {tool.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
