"use client"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, ChevronRight, Sparkles, LayoutGrid } from "lucide-react"
import { navGroups } from "@/config/tools"

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
