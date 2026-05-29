import Link from "next/link"
import { 
  Image as ImageIcon, 
  Zap, 
  FileCode, 
  Split, 
  Calculator, 
  Code, 
  Cpu, 
  FileText, 
  Sparkles, 
  PenLine, 
  Search, 
  Brain,
  Percent,
  Coins,
  Scale,
  Monitor,
  Type,
  TrendingUp,
  Briefcase,
  Palette
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { ProBadge } from "@/components/ui/pro-gate"
import { cn } from "@/lib/utils"
import { auth } from "@/auth"

export const metadata = {
  title: "Free Online AI Tools & Growing — TheWordOf Utility Dashboard",
  description: "Access a suite of free, browser-based tools for image conversion, SVG optimization, AI SEO generation, professional invoices, and financial calculators. No sign-up required.",
  keywords: ["free online tools", "AI productivity", "browser based utilities", "bulk image converter", "SVG minifier", "AI tools for creators"]
}

const categories = [
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

export default async function ToolsPage() {
  const session = await auth()
  const isPro = session?.user?.role === "PRO" || session?.user?.role === "BUSINESS" || session?.user?.role === "ADMIN"

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

      <div className="space-y-12">
        {categories.map((category) => (
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
                            {tool.pro && <ProBadge role={session?.user?.role} />}
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{tool.desc}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}

              {/* Render Coming Soon block only in the last section for visual balance */}
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
      </div>
    </div>
  )
}
