"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ProBadge } from "@/components/ui/pro-gate"
import { cn } from "@/lib/utils"
import { 
  Image as ImageIcon, 
  Zap, 
  FileCode, 
  Split, 
  Code, 
  Cpu, 
  FileText, 
  Sparkles, 
  Brain, 
  PenLine, 
  Search, 
  Percent, 
  Coins, 
  TrendingUp, 
  Briefcase, 
  Scale, 
  Monitor, 
  Type, 
  Palette 
} from "lucide-react"

interface ToolItem {
  title: string
  desc: string
  icon: any
  href: string
  pro: boolean
}

interface Category {
  title: string
  tools: ToolItem[]
}

const CATEGORIES: Category[] = [
  {
    title: "Image & Code",
    tools: [
      { title: "Image Converter",   desc: "Convert JPG, PNG, WEBP, AVIF in bulk. Client-side, private.",       icon: ImageIcon,  href: "/tools/image-converter",   pro: false },
      { title: "SVG Compressor",    desc: "Minify, clean and optimize SVG files for faster web pages.",          icon: Zap,        href: "/tools/svg-compressor",    pro: true },
      { title: "QR Code Generator", desc: "Generate QR codes with custom size and colors.",                     icon: Code,       href: "/tools/qr-code",           pro: true },
      { title: "Code Minifier",     desc: "Minify JS, CSS, HTML and beautify in one click.",                     icon: FileCode,   href: "/tools/code-minifier",     pro: false },
      { title: "Text Difference",   desc: "Compare two documents and highlight every change.",                    icon: Split,      href: "/tools/text-diff",         pro: false },
    ]
  },
  {
    title: "Finance & Dev",
    tools: [
      { title: "Invoice Generator", desc: "Create professional PDF invoices in seconds.",                         icon: FileText,   href: "/tools/invoice-generator", pro: true },
      { title: "Work Report Generator", desc: "Compile daily task trackers and print matching standard A4 PDFs.", icon: FileText,   href: "/tools/report",            pro: false },
      { title: "Schema Generator",  desc: "Build JSON-LD structured data for SEO rich results in Google.",       icon: Code,       href: "/tools/schema-generator",  pro: false },
      { title: "LLMS.TXT Generator",desc: "Generate AI-readable site descriptions for LLM crawlers.",            icon: Cpu,        href: "/tools/llms-txt",          pro: false },
    ]
  },
  {
    title: "AI Tools",
    tools: [
      { title: "Product Description Generator", desc: "Create product titles, images and feature lists.",       icon: FileText,   href: "/tools/product-description", pro: false },
      { title: "AI Caption Gen",    desc: "Platform-optimised social media captions powered by Gemini.",         icon: Sparkles,   href: "/tools/caption-generator", pro: true },
      { title: "AI Prompt Gen",     desc: "Build expert-level prompts for ChatGPT, Claude, and Gemini.",         icon: Brain,      href: "/tools/prompt-generator",  pro: true },
      { title: "AI CV Builder",     desc: "ATS-optimised CV summaries written by AI in under 60 seconds.",       icon: PenLine,    href: "/tools/cv-builder",        pro: true },
      { title: "AI SEO Generator",  desc: "Generate optimised meta titles and descriptions that rank.",          icon: Search,     href: "/tools/seo-generator",     pro: true },
    ]
  },
  {
    title: "Design",
    tools: [
      { title: "Color Contrast Checker", desc: "Check foreground and background color contrast against WCAG standards.", icon: Palette, href: "/tools/color-contrast", pro: false },
      { title: "Color Palette Generator", desc: "Generate mathematical color harmonies and export codes or images.", icon: Palette, href: "/tools/color-palette", pro: false },
      { title: "Gradient Generator", desc: "Browse, customize and export CSS / Tailwind code for premium gradients.", icon: Palette, href: "/tools/gradient-generator", pro: false },
      { title: "Gradient Palette Generator", desc: "Generate 5 coordinating harmonious gradients and copy CSS variables.", icon: Palette, href: "/tools/gradient-palette", pro: false }
    ]
  },
  {
    title: "Calculators",
    tools: [
      { title: "EMI Calculator",            desc: "Calculate your monthly EMI payments for home, car, or personal loans.",            icon: Percent,        href: "/tools/calculators/emi",             pro: false },
      { title: "SIP / Mutual Fund",         desc: "Project future returns of your Systematic Investment Plan (SIP) investments.",       icon: Coins,          href: "/tools/calculators/sip",             pro: false },
      { title: "Compound Interest",         desc: "Calculate compound interest returns with annual inflation adjustments.",            icon: TrendingUp,     href: "/tools/calculators/compound-interest", pro: false },
      { title: "Salary to Hourly Converter",desc: "Convert annual/monthly salary to hourly rates, daily rates, and vice-versa.",       icon: Briefcase,      href: "/tools/calculators/salary-to-hourly",  pro: false },
      { title: "GST Calculator",            desc: "Calculate Goods and Services Tax (GST) for baseline or gross sums.",                icon: Percent,        href: "/tools/gst-calculator",              pro: false },
      { title: "BMI Calculator",            desc: "Calculate your Body Mass Index (BMI) using metric or imperial units.",               icon: Scale,          href: "/tools/calculators/bmi",             pro: false },
      { title: "Aspect Ratio Calculator",   desc: "Compute dimension resizes and aspect ratios for layouts and images.",                icon: Monitor,        href: "/tools/calculators/aspect-ratio",    pro: false },
      { title: "Line-height Converter",     desc: "Convert line-height pixels, rems, or percentages into relative CSS values.",        icon: Type,           href: "/tools/calculators/line-height",       pro: false },
      { title: "PX to REM Converter",       desc: "Convert pixels to REM units bidirectionally with lookup sheets.",                    icon: FileCode,       href: "/tools/calculators/px-to-rem",       pro: false },
      { title: "Word Counter",              desc: "Get real-time statistics including word, character, and line counts.",               icon: Type,           href: "/tools/word-counter",                pro: false },
      { title: "HEX/RGB/HSL Converter",     desc: "Convert colors between spaces with sliders and a visual picker.",                    icon: Palette,        href: "/tools/color-converter",             pro: false }
    ]
  }
]

export function ToolsList({ isPro, userRole }: { isPro: boolean, userRole?: string }) {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const categoryNames = useMemo(() => {
    return ["All", ...CATEGORIES.map(c => c.title)]
  }, [])

  const filteredCategories = useMemo(() => {
    return CATEGORIES
      .map(cat => {
        if (selectedCategory !== "All" && cat.title !== selectedCategory) {
          return { ...cat, tools: [] }
        }
        const filteredTools = cat.tools.filter(tool => 
          tool.title.toLowerCase().includes(search.toLowerCase()) ||
          tool.desc.toLowerCase().includes(search.toLowerCase())
        )
        return { ...cat, tools: filteredTools }
      })
      .filter(cat => cat.tools.length > 0)
  }, [search, selectedCategory])

  return (
    <div className="space-y-6">
      {/* Search and Category Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-muted/40 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm text-foreground"
          />
        </div>
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {categoryNames.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted/70"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Display filtered categories */}
      <div className="space-y-12">
        {filteredCategories.map((category) => (
          <div key={category.title} className="space-y-4">
            <h2 className="text-2xl font-black tracking-tight text-foreground/80 border-b pb-2">
              {category.title}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {category.tools.map((tool) => {
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
                            {tool.pro && <ProBadge role={userRole} />}
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{tool.desc}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}

              {/* Render Coming Soon block in Calculators section */}
              {category.title === "Calculators" && (
                <Card className="h-full border-dashed border-2 bg-muted/20 flex items-center justify-center p-5 group transition-colors hover:bg-muted/30">
                  <div className="text-center space-y-2">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                      <Sparkles className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="font-bold text-sm text-muted-foreground">More Tools Coming Soon</p>
                    <p className="text-[10px] text-muted-foreground/70 uppercase tracking-widest font-black">Building 24/7</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        ))}
        {filteredCategories.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No tools matched your search criteria.
          </div>
        )}
      </div>
    </div>
  )
}
