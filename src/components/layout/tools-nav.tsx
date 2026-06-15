"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
  LayoutGrid,
  QrCode,
  Palette,
  ChevronDown,
  ChevronRight,
  Type
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"

type NavItem = { title: string; href: string; icon: React.ElementType }
type NavGroup = { label: string; items: NavItem[] }

const navGroups: NavGroup[] = [
  {
    label: "All Tools",
    items: [
      { title: "All Tools", href: "/tools", icon: LayoutGrid },
    ],
  },
  {
    label: "Image & Code",
    items: [
      { title: "All Image & Code",  href: "/tools/image-code",      icon: LayoutGrid },
      { title: "Image Converter",  href: "/tools/image-code/image-converter",  icon: ImageIcon },
      { title: "SVG Compressor",   href: "/tools/image-code/svg-compressor",   icon: Zap },
      { title: "QR Code Gen",      href: "/tools/image-code/qr-code",          icon: QrCode },
      { title: "Code Minifier",    href: "/tools/image-code/code-minifier",    icon: FileCode },
      { title: "Text Difference",  href: "/tools/image-code/text-diff",        icon: Split },

    ],
  },
  {
    label: "Calculators",
    items: [
      { title: "All Calculators",  href: "/tools/calculators",      icon: Calculator },
      { title: "EMI Calculator",    href: "/tools/calculators/emi",   icon: Calculator },
      { title: "SIP / Mutual Fund", href: "/tools/calculators/sip",   icon: Calculator },
      { title: "Compound Interest", href: "/tools/calculators/compound-interest", icon: Calculator },
      { title: "Salary to Hourly",  href: "/tools/calculators/salary-to-hourly",  icon: Calculator },
      { title: "GST Calculator",    href: "/tools/calculators/gst-calculator",    icon: Calculator },
      { title: "BMI Calculator",    href: "/tools/calculators/bmi",   icon: Calculator },
      { title: "Aspect Ratio",      href: "/tools/calculators/aspect-ratio",     icon: Calculator },
      { title: "Line-height",       href: "/tools/calculators/line-height",      icon: Calculator },
      { title: "PX to REM",         href: "/tools/calculators/px-to-rem",        icon: Calculator },
      { title: "Word Counter",      href: "/tools/calculators/word-counter",      icon: Calculator },
      { title: "Color Converter",   href: "/tools/calculators/color-converter",   icon: Calculator },
    ],
  },
  {
    label: "Document Tools",
    items: [
      { title: "All Document Tools",href: "/tools/document-tools",      icon: LayoutGrid },
      { title: "Doc Converter",    href: "/tools/document-tools/doc-converter",    icon: FileText },
      { title: "Invoice Generator",href: "/tools/document-tools/invoice-generator",icon: FileText },
      { title: "PDF Merger",       href: "/tools/document-tools/pdf-merger",       icon: FileText },
      { title: "PDF Watermarker",  href: "/tools/document-tools/pdf-watermark",    icon: FileText },
      { title: "Work Report",      href: "/tools/document-tools/report",           icon: FileText },
    ],
  },
  {
    label: "Design",
    items: [
      { title: "All Design Tools", href: "/tools/design",           icon: LayoutGrid },
      { title: "Color Contrast",   href: "/tools/design/color-contrast",   icon: Palette },
      { title: "Contrast Scanner", href: "/tools/design/color-contrast-scanner", icon: Palette },
      { title: "Color Palette",    href: "/tools/design/color-palette",    icon: Palette },
      { title: "Gradient Gen",     href: "/tools/design/gradient-generator", icon: Palette },
      { title: "Gradient Palette", href: "/tools/design/gradient-palette", icon: Palette },
    ],
  },
  {
    label: "Technical SEO",
    items: [
      { title: "All Technical SEO",href: "/tools/technical-seo",    icon: LayoutGrid },
      { title: "Schema Generator", href: "/tools/technical-seo/schema-generator", icon: Code },
      { title: "Robots.txt Gen",   href: "/tools/technical-seo/robots-generator", icon: FileText },
      { title: "Sitemap Validator",href: "/tools/technical-seo/sitemap-validator",icon: ImageIcon },
      { title: "LLMS.TXT Gen",     href: "/tools/technical-seo/llms-txt",         icon: Cpu },
      { title: "SERP Previewer",   href: "/tools/technical-seo/serp-preview",     icon: Search },
      { title: "Keyword Density",  href: "/tools/technical-seo/keyword-density",  icon: FileText },
      { title: "SEO Readability",  href: "/tools/technical-seo/readability-grader",icon: Type },
      { title: "Broken Links",     href: "/tools/technical-seo/broken-links",     icon: Zap },
    ],
  },
  {
    label: "AI Tools",
    items: [
      { title: "All AI Tools",     href: "/tools/ai-tools",         icon: LayoutGrid },
      { title: "Product Desc Gen", href: "/tools/ai-tools/product-description", icon: Sparkles },
      { title: "Caption Gen",      href: "/tools/ai-tools/caption-generator",icon: Sparkles },
      { title: "Prompt Gen",       href: "/tools/ai-tools/prompt-generator", icon: Brain },
      { title: "CV Builder",       href: "/tools/ai-tools/cv-builder",       icon: PenLine },
      { title: "SEO Generator",    href: "/tools/ai-tools/seo-generator",    icon: Search },
    ],
  },
]

export function ToolsNav() {
  const path = usePathname()
  const { data: session } = useSession()
  const isPro = session?.user?.role === "PRO" || session?.user?.role === "BUSINESS" || session?.user?.role === "ADMIN"

  const [openGroups, setOpenGroups] = useState<{ [key: string]: boolean }>({
    "All Tools": true,
    "Image & Code": true,
    "Calculators": false,
    "Document Tools": false,
    "Design": false,
    "Technical SEO": true,
    "AI Tools": false,
  })

  // Auto-expand group that contains active link
  useEffect(() => {
    const activeGroup = navGroups.find(group => 
      group.items.some(item => path === item.href || (item.href !== "/tools" && path.startsWith(item.href + "/")))
    )
    if (activeGroup) {
      setOpenGroups(prev => ({ ...prev, [activeGroup.label]: true }))
    }
  }, [path])

  return (
    <nav className="flex flex-col gap-0.5 py-5 px-3">
      {navGroups.map((group) => {
        const isOpen = !!openGroups[group.label]
        
        if (group.label === "All Tools") {
          const item = group.items[0]
          const isActive = path === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 mb-4",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <span className="flex items-center gap-3">
                <LayoutGrid className={cn("h-4 w-4 shrink-0", isActive ? "text-primary" : "group-hover:text-foreground")} />
                <span>{item.title}</span>
              </span>
            </Link>
          )
        }

        return (
          <div key={group.label} className="mb-2">
            <button
              onClick={() => setOpenGroups(prev => ({ ...prev, [group.label]: !prev[group.label] }))}
              className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-black uppercase tracking-widest text-muted-foreground/60 hover:text-foreground/80 select-none cursor-pointer transition-colors"
            >
              <span>{group.label}</span>
              {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </button>
            
            {isOpen && (
              <div className="mt-1 space-y-0.5 pl-1 animate-in slide-in-from-top-1 duration-150">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const isCategoryIndex = item.title.startsWith("All ")
                  const isActive = path === item.href || (!isCategoryIndex && item.href !== "/tools" && path.startsWith(item.href + "/"))
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className={cn("h-3.5 w-3.5 shrink-0", isActive ? "text-primary" : "group-hover:text-foreground")} />
                        <span>{item.title}</span>
                      </span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}

      {/* Upgrade CTA */}
      {!isPro && (
        <div className="px-1 mt-2">
          <Link
            href="/pricing"
            className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 px-4 py-3 hover:from-primary/15 transition-all"
          >
            <div className="h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-black text-foreground leading-none">Upgrade to Pro</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-none">Unlock all features</p>
            </div>
          </Link>
        </div>
      )}
    </nav>
  )
}
