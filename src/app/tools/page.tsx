import Link from "next/link"
import { Image as ImageIcon, Zap, FileCode, Split, Calculator, Code, Cpu, FileText, Sparkles, PenLine, Search, Brain, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { ProBadge } from "@/components/ui/pro-gate"
import { cn } from "@/lib/utils"

export const metadata = {
  title: "13+ Free Online AI Tools — TheWordOf Utility Dashboard",
  description: "Access a suite of free, browser-based tools for image conversion, SVG optimization, AI SEO generation, professional invoices, and financial calculators. No sign-up required.",
  keywords: ["free online tools", "AI productivity", "browser based utilities", "bulk image converter", "SVG minifier", "AI tools for creators"]
}

const allTools = [
  { title: "Image Converter",   desc: "Convert JPG, PNG, WEBP, AVIF in bulk. Client-side, private.",       icon: ImageIcon,  href: "/tools/image-converter",   pro: false },
  { title: "SVG Compressor",    desc: "Minify, clean and optimize SVG files for faster web pages.",          icon: Zap,        href: "/tools/svg-compressor",    pro: false },
  { title: "Code Minifier",     desc: "Minify JS, CSS, HTML and beautify in one click.",                     icon: FileCode,   href: "/tools/code-minifier",     pro: false },
  { title: "Text Difference",   desc: "Compare two documents and highlight every change.",                    icon: Split,      href: "/tools/text-diff",         pro: false },
  { title: "Calculators",       desc: "EMI and SIP calculators for smarter financial planning.",             icon: Calculator, href: "/tools/calculators",       pro: false },
  { title: "Schema Generator",  desc: "Build JSON-LD structured data for SEO rich results in Google.",       icon: Code,       href: "/tools/schema-generator",  pro: false },
  { title: "LLMS.TXT Generator",desc: "Generate AI-readable site descriptions for LLM crawlers.",            icon: Cpu,        href: "/tools/llms-txt",          pro: false },
  { title: "Invoice Generator", desc: "Create professional PDF invoices in seconds.",                         icon: FileText,   href: "/tools/invoice-generator", pro: false },
  { title: "AI Caption Gen",    desc: "Platform-optimised social media captions powered by Gemini.",         icon: Sparkles,   href: "/tools/caption-generator", pro: true },
  { title: "AI CV Builder",     desc: "ATS-optimised CV summaries written by AI in under 60 seconds.",       icon: PenLine,    href: "/tools/cv-builder",        pro: true },
  { title: "AI Prompt Gen",     desc: "Build expert-level prompts for ChatGPT, Claude, and Gemini.",         icon: Brain,      href: "/tools/prompt-generator",  pro: true },
  { title: "AI SEO Generator",  desc: "Generate optimised meta titles and descriptions that rank.",          icon: Search,     href: "/tools/seo-generator",     pro: true },
]

import { auth } from "@/auth"

export default async function ToolsPage() {
  const session = await auth()
  const isPro = session?.user?.role === "PRO" || session?.user?.role === "ADMIN"

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-4xl font-black tracking-tight">All Tools</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Free, browser-based tools. No account required. {!isPro && (
            <Link href="/pricing" className="text-primary font-semibold hover:underline">Upgrade for more →</Link>
          )}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {allTools.map((tool) => {
          const Icon = tool.icon
          return (
            <Link key={tool.href} href={tool.href}>
              <Card className={cn(
                "h-full group transition-all duration-200",
                tool.pro
                  ? "hover:border-amber-500/30 hover:bg-amber-500/5 border-amber-500/10 bg-amber-500/[0.02]"
                  : "hover:border-primary/30 hover:bg-primary/5"
              )}>
                <CardContent className="p-5 flex gap-4 items-start">
                  <div className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                    tool.pro ? "bg-amber-500/10 group-hover:bg-amber-500/20" : "bg-primary/10 group-hover:bg-primary/15"
                  )}>
                    <Icon className={cn("h-5 w-5", tool.pro ? "text-amber-600 dark:text-amber-400" : "text-primary")} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-bold text-sm leading-tight">{tool.title}</p>
                      {tool.pro && <ProBadge />}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{tool.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
