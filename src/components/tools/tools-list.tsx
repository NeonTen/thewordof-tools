"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ProBadge } from "@/components/ui/pro-gate"
import { cn } from "@/lib/utils"
import { Sparkles, Search } from "lucide-react"

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

export function ToolsList({ categories, isPro, userRole }: { categories: Category[], isPro: boolean, userRole?: string }) {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const categoryNames = useMemo(() => {
    return ["All", ...categories.map(c => c.title)]
  }, [categories])

  const filteredCategories = useMemo(() => {
    return categories
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
  }, [categories, search, selectedCategory])

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
