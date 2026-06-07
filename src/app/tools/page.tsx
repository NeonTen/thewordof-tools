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
import { auth } from "@/auth"
import { ToolsList } from "@/components/tools/tools-list"

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
    title: "Design",
    tools: [
      { title: "Color Contrast Checker", desc: "Check foreground and background color contrast against WCAG standards.", icon: Palette, href: "/tools/color-contrast", pro: false },
      { title: "Color Palette Generator", desc: "Generate mathematical color harmonies and export codes or images.", icon: Palette, href: "/tools/color-palette", pro: false },
      { title: "Gradient Generator", desc: "Browse, customize and export CSS / Tailwind code for premium gradients.", icon: Palette, href: "/tools/gradient-generator", pro: false }
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

      <ToolsList categories={categories} isPro={isPro} userRole={session?.user?.role} />
    </div>
  )
}
