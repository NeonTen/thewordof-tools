"use client"

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
  MessageSquare,
  LayoutGrid,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ProBadge } from "@/components/ui/pro-gate"

type NavItem = { title: string; href: string; icon: React.ElementType; pro?: boolean }
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
      { title: "Image Converter",  href: "/tools/image-converter",  icon: ImageIcon },
      { title: "SVG Compressor",   href: "/tools/svg-compressor",   icon: Zap },
      { title: "Code Minifier",    href: "/tools/code-minifier",    icon: FileCode },
      { title: "Text Difference",  href: "/tools/text-diff",        icon: Split },
    ],
  },
  {
    label: "Finance",
    items: [
      { title: "Calculators",      href: "/tools/calculators",      icon: Calculator },
      { title: "Invoice Generator",href: "/tools/invoice-generator",icon: FileText },
    ],
  },
  {
    label: "SEO & Dev",
    items: [
      { title: "Schema Generator", href: "/tools/schema-generator", icon: Code },
      { title: "LLMS.TXT Gen",     href: "/tools/llms-txt",         icon: Cpu },
    ],
  },
  {
    label: "AI Tools",
    items: [
      { title: "Caption Gen",      href: "/tools/caption-generator",icon: Sparkles,      pro: true },
      { title: "Prompt Gen",       href: "/tools/prompt-generator", icon: Brain,         pro: true },
      { title: "CV Builder",       href: "/tools/cv-builder",       icon: PenLine,       pro: true },
      { title: "SEO Generator",    href: "/tools/seo-generator",    icon: Search,        pro: true },
    ],
  },
]

import { useSession } from "next-auth/react"

export function ToolsNav() {
  const path = usePathname()
  const { data: session } = useSession()
  const isPro = session?.user?.role === "PRO" || session?.user?.role === "BUSINESS" || session?.user?.role === "ADMIN"

  return (
    <nav className="flex flex-col gap-0.5 py-5 px-3">
      {navGroups.map((group) => (
        <div key={group.label} className="mb-4">
          <p className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 select-none">
            {group.label}
          </p>
          {group.items.map((item) => {
            const Icon = item.icon
            const isActive = path === item.href || (item.href !== "/tools" && path.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <span className="flex items-center gap-3">
                  <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary" : "group-hover:text-foreground")} />
                  <span>{item.title}</span>
                </span>
                {item.pro && <ProBadge role={session?.user?.role} />}
              </Link>
            )
          })}
        </div>
      ))}

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
