import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Search, 
  FileText, 
  Type, 
  Zap 
} from "lucide-react"

export const metadata = {
  title: "SEO Content Audit & Optimization Tools | TheWordOf Tools",
  description: "Free online tools to analyze SERP snippet layouts, calculate keyword densities, check reading ease grade levels, and audit broken target page links.",
}

const tools = [
  {
    title: "SERP Previewer & Meta Tag Analyzer",
    description: "Preview search results snippet presentation on Google Search, compute title/description sizing, and generate standard SEO and Open Graph tags.",
    href: "/tools/seo-audit/serp-preview",
    icon: Search,
    pro: false,
  },
  {
    title: "Keyword Density Analyzer",
    description: "Extract text directly from URL imports or raw text blocks to calculate word frequency and search optimization ratios.",
    href: "/tools/seo-audit/keyword-density",
    icon: FileText,
    pro: false,
  },
  {
    title: "SEO Readability & Content Grader",
    description: "Grade standard content readability scores using linguistic formulas including Flesch Reading Ease calculations.",
    href: "/tools/seo-audit/readability-grader",
    icon: Type,
    pro: false,
  },
  {
    title: "Broken Link & Anchor Text Auditor",
    description: "Inspect external websites to identify broken links, redirects, internal vs external ratios, and anchor texts.",
    href: "/tools/seo-audit/broken-links",
    icon: Zap,
    pro: true,
  },
]

export default function SeoAuditPage() {
  return (
    <div className="flex flex-col gap-8 pb-16">
      <div>
        <h1 className="text-3xl font-black tracking-tight">SEO Audit Tools</h1>
        <p className="text-muted-foreground mt-2 text-base">
          Analyze content readability grades, inspect page keywords optimization ratios, audit outbound broken link signals, and generate optimized SERP snippets.
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
