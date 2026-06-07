# Phase 1: Color Tools Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add three new color utility tools (Color Contrast Checker, Color Palette Generator, Gradient Explorer) to the platform and add search/filtering functionality to the main tools list page.

**Architecture:** Create three new client-side interactive React components in `src/components/tools/` and mount them on corresponding page routes under `src/app/tools/`. Update the tools category database/listing in `src/app/tools/page.tsx` to support search query filtering and category tabs client-side.

**Tech Stack:** Next.js App Router (React 19), Tailwind CSS v4, Lucide React icons, and standard Web APIs (Canvas, Clipboard).

---

### Task 1: Tools Page Search & Filtering

**Files:**
- Modify: `src/app/tools/page.tsx`

- [ ] **Step 1: Check existing Tools Page structure**
  Read the current page.tsx to see imports and layout structure.
  Run: `git status`

- [ ] **Step 2: Convert page to client-side component or use a wrapper client component**
  Since `page.tsx` is currently an `async` server component (doing `await auth()`), we will implement a client-side wrapper component `src/components/tools/tools-list.tsx` to handle the search search terms and category filter tabs state, then render the category lists.
  
  Create: `src/components/tools/tools-list.tsx`
  ```tsx
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
              className="w-full pl-9 pr-4 py-2 bg-muted/40 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
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
  ```

- [ ] **Step 3: Update `src/app/tools/page.tsx`**
  Modify the tools listing in `src/app/tools/page.tsx` to add a new "Design" category, register the three new tools, import `ToolsList` and delegate rendering.
  
  Add to categories in `src/app/tools/page.tsx`:
  ```tsx
  {
    title: "Design",
    tools: [
      { title: "Color Contrast Checker", desc: "Check foreground and background color contrast against WCAG standards.", icon: Palette, href: "/tools/color-contrast", pro: false },
      { title: "Color Palette Generator", desc: "Generate mathematical color harmonies and export codes or images.", icon: Palette, href: "/tools/color-palette", pro: false },
      { title: "Gradient Generator", desc: "Browse, customize and export CSS / Tailwind code for premium gradients.", icon: Palette, href: "/tools/gradient-generator", pro: false }
    ]
  }
  ```

- [ ] **Step 4: Verify Compilation**
  Run: `npx tsc --noEmit`
  Expected: Success without TS errors.

- [ ] **Step 5: Commit**
  Run: `git add src/app/tools/page.tsx src/components/tools/tools-list.tsx`
  Run: `git commit -m "feat: add search/filtering & define new color tools on list page"`

---

### Task 2: Color Contrast Checker

**Files:**
- Create: `src/app/tools/color-contrast/page.tsx`
- Create: `src/components/tools/color-contrast.tsx`

- [ ] **Step 1: Create the color-contrast.tsx Component**
  Implement the relative luminance formula, contrast ratio check, WCAG threshold checks, text preview sliders, and presets.
  
  ```tsx
  "use client"

  import { useState, useMemo } from "react"
  import { ArrowLeftRight, Check, AlertTriangle, Copy } from "lucide-react"

  // Relative luminance calculation
  function getLuminance(r: number, g: number, b: number) {
    const a = [r, g, b].map((v) => {
      v /= 255
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    })
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
  }

  // Hex to RGB parser
  function hexToRgb(hex: string) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
    const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b)
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  export function ColorContrast() {
    const [fg, setFg] = useState("#000000")
    const [bg, setBg] = useState("#FFFFFF")
    const [fontSize, setFontSize] = useState(16)
    const [fontWeight, setFontWeight] = useState("normal")
    const [previewText, setPreviewText] = useState("The quick brown fox jumps over the lazy dog.")

    const ratio = useMemo(() => {
      const rgbFg = hexToRgb(fg)
      const rgbBg = hexToRgb(bg)
      if (!rgbFg || !rgbBg) return 1

      const lumFg = getLuminance(rgbFg.r, rgbFg.g, rgbFg.b)
      const lumBg = getLuminance(rgbBg.r, rgbBg.g, rgbBg.b)

      const brightest = Math.max(lumFg, lumBg)
      const darkest = Math.min(lumFg, lumBg)
      return (brightest + 0.05) / (darkest + 0.05)
    }, [fg, bg])

    const formattedRatio = ratio.toFixed(2)

    const wcag = useMemo(() => {
      return {
        aaNormal: ratio >= 4.5,
        aaaNormal: ratio >= 7,
        aaLarge: ratio >= 3.0,
        aaaLarge: ratio >= 4.5,
        ui: ratio >= 3.0
      }
    }, [ratio])

    return (
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card p-5 border rounded-2xl space-y-4">
            <h2 className="text-lg font-bold">Colors Selection</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground font-bold">Text Color (Foreground)</label>
                <div className="flex gap-2 mt-1">
                  <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="w-10 h-10 border rounded-lg cursor-pointer bg-transparent" />
                  <input type="text" value={fg} onChange={(e) => setFg(e.target.value)} className="flex-1 px-3 bg-muted/40 border rounded-lg focus:outline-none text-sm" />
                </div>
              </div>
              <div className="flex justify-center">
                <button onClick={() => { const temp = fg; setFg(bg); setBg(temp); }} className="p-2 border rounded-full bg-muted/40 hover:bg-muted/80 transition-colors">
                  <ArrowLeftRight className="h-4 w-4" />
                </button>
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-bold">Background Color</label>
                <div className="flex gap-2 mt-1">
                  <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="w-10 h-10 border rounded-lg cursor-pointer bg-transparent" />
                  <input type="text" value={bg} onChange={(e) => setBg(e.target.value)} className="flex-1 px-3 bg-muted/40 border rounded-lg focus:outline-none text-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="bg-card p-5 border rounded-2xl flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-muted-foreground">Contrast Ratio</h3>
                <p className="text-5xl font-black tracking-tight mt-1">{formattedRatio}:1</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="p-3 border rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold">AA Normal Text</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Ratio &ge; 4.5</p>
                </div>
                {wcag.aaNormal ? <span className="text-green-500 font-black">PASS</span> : <span className="text-red-500 font-black">FAIL</span>}
              </div>
              <div className="p-3 border rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold">AAA Normal Text</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Ratio &ge; 7.0</p>
                </div>
                {wcag.aaaNormal ? <span className="text-green-500 font-black">PASS</span> : <span className="text-red-500 font-black">FAIL</span>}
              </div>
              <div className="p-3 border rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold">AA Large Text</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Ratio &ge; 3.0</p>
                </div>
                {wcag.aaLarge ? <span className="text-green-500 font-black">PASS</span> : <span className="text-red-500 font-black">FAIL</span>}
              </div>
              <div className="p-3 border rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold">AAA Large Text</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Ratio &ge; 4.5</p>
                </div>
                {wcag.aaaLarge ? <span className="text-green-500 font-black">PASS</span> : <span className="text-red-500 font-black">FAIL</span>}
              </div>
              <div className="p-3 border rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold">UI Components</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Ratio &ge; 3.0</p>
                </div>
                {wcag.ui ? <span className="text-green-500 font-black">PASS</span> : <span className="text-red-500 font-black">FAIL</span>}
              </div>
            </div>

            {/* Interactive Preview box */}
            <div className="border rounded-xl overflow-hidden">
              <div className="p-3 bg-muted/30 border-b flex flex-wrap gap-4 items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">Interactive Preview</span>
                <div className="flex gap-4 items-center">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold">Size: {fontSize}px</span>
                    <input type="range" min="12" max="64" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-24 cursor-pointer" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setFontWeight("normal")} className={`px-2 py-1 rounded text-xs font-bold ${fontWeight === "normal" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>Normal</button>
                    <button onClick={() => setFontWeight("bold")} className={`px-2 py-1 rounded text-xs font-bold ${fontWeight === "bold" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>Bold</button>
                  </div>
                </div>
              </div>
              <div className="p-8 min-h-[160px] flex items-center justify-center transition-colors" style={{ backgroundColor: bg }}>
                <input
                  type="text"
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  className="w-full text-center bg-transparent border-none focus:outline-none select-all focus:ring-0"
                  style={{ color: fg, fontSize: `${fontSize}px`, fontWeight: fontWeight }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  ```

- [ ] **Step 2: Create the route file**
  Create `src/app/tools/color-contrast/page.tsx`.
  
  ```tsx
  import { ColorContrast } from "@/components/tools/color-contrast"
  
  export const metadata = {
    title: "Color Contrast Checker - WCAG 2.1 Accessibility Tool",
    description: "Check text legibility and accessibility contrast ratios under WCAG 2.1 AA & AAA standards dynamically.",
  }
  
  export default function ColorContrastPage() {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Color Contrast Checker</h1>
          <p className="text-muted-foreground mt-2">
            Validate foreground and background color pairings for web accessibility standards.
          </p>
        </div>
        <ColorContrast />
      </div>
    )
  }
  ```

- [ ] **Step 3: Verify TypeScript Compilation**
  Run: `npx tsc --noEmit`
  Expected: Success without TS errors.

- [ ] **Step 4: Commit**
  Run: `git add src/app/tools/color-contrast/page.tsx src/components/tools/color-contrast.tsx`
  Run: `git commit -m "feat: add Color Contrast Checker with WCAG accessibility checker"`

---

### Task 3: Color Palette Generator

**Files:**
- Create: `src/app/tools/color-palette/page.tsx`
- Create: `src/components/tools/color-palette.tsx`

- [ ] **Step 1: Implement `src/components/tools/color-palette.tsx`**
  Support locking/unlocking colors, Spacebar generator, harmony mode algorithms (analogous, complementary, monochromatic, etc.), export code structures, and PNG download.
  
  ```tsx
  "use client"

  import { useState, useEffect, useCallback } from "react"
  import { Lock, Unlock, Copy, Download, RefreshCw } from "lucide-react"

  // Helper HSL to Hex
  function hslToHex(h: number, s: number, l: number): string {
    l /= 100
    const a = (s * Math.min(l, 1 - l)) / 100
    const f = (n: number) => {
      const k = (n + h / 30) % 12
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
      return Math.round(255 * color).toString(16).padStart(2, "0")
    }
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase()
  }

  // Parse Hex to HSL
  function hexToHsl(hex: string): { h: number; s: number; l: number } {
    let r = 0, g = 0, b = 0
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16)
      g = parseInt(hex[2] + hex[2], 16)
      b = parseInt(hex[3] + hex[3], 16)
    } else if (hex.length === 7) {
      r = parseInt(hex.slice(1, 3), 16)
      g = parseInt(hex.slice(3, 5), 16)
      b = parseInt(hex.slice(5, 7), 16)
    }
    r /= 255; g /= 255; b /= 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h = 0, s = 0, l = (max + min) / 2
    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h /= 6
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
  }

  export function ColorPalette() {
    const [colors, setColors] = useState<string[]>(["#2563EB", "#3B82F6", "#F3F4F6", "#1F2937", "#EC4899"])
    const [locked, setLocked] = useState<boolean[]>([false, false, false, false, false])
    const [harmony, setHarmony] = useState<string>("random")

    const generatePalette = useCallback(() => {
      setColors((prevColors) => {
        const newColors = [...prevColors]
        // Determine base color (use the first locked color, or random if none locked)
        const firstLockedIdx = locked.indexOf(true)
        let baseH = Math.floor(Math.random() * 360)
        let baseS = 65 + Math.floor(Math.random() * 20)
        let baseL = 40 + Math.floor(Math.random() * 30)

        if (firstLockedIdx !== -1) {
          const hsl = hexToHsl(prevColors[firstLockedIdx])
          baseH = hsl.h
          baseS = hsl.s
          baseL = hsl.l
        }

        for (let i = 0; i < 5; i++) {
          if (locked[i]) continue
          
          let h = baseH, s = baseS, l = baseL
          
          if (harmony === "monochromatic") {
            l = (15 + (i * 18)) % 90
            s = baseS
          } else if (harmony === "analogous") {
            h = (baseH + (i - 2) * 20 + 360) % 360
            l = baseL + (i - 2) * 5
          } else if (harmony === "complementary") {
            if (i >= 3) {
              h = (baseH + 180) % 360
              l = baseL + (i - 4) * 10
            } else {
              l = baseL + (i - 1) * 10
            }
          } else if (harmony === "triadic") {
            if (i === 1 || i === 2) {
              h = (baseH + 120) % 360
            } else if (i === 3 || i === 4) {
              h = (baseH + 240) % 360
            }
            l = baseL + (i % 2) * 10
          } else if (harmony === "split") {
            if (i === 1 || i === 2) {
              h = (baseH + 150) % 360
            } else if (i === 3 || i === 4) {
              h = (baseH + 210) % 360
            }
            l = baseL + (i % 2) * 10
          } else {
            // Completely random
            h = Math.floor(Math.random() * 360)
            s = 50 + Math.floor(Math.random() * 40)
            l = 30 + Math.floor(Math.random() * 50)
          }

          newColors[i] = hslToHex(h, s, l)
        }
        return newColors
      })
    }, [locked, harmony])

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === "Space" && document.activeElement?.tagName !== "INPUT") {
          e.preventDefault()
          generatePalette()
        }
      }
      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [generatePalette])

    const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text)
    }

    const toggleLock = (idx: number) => {
      setLocked((prev) => {
        const next = [...prev]
        next[idx] = !next[idx]
        return next
      })
    }

    const downloadPNG = () => {
      const canvas = document.createElement("canvas")
      canvas.width = 1000
      canvas.height = 300
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      colors.forEach((color, idx) => {
        ctx.fillStyle = color
        ctx.fillRect(idx * 200, 0, 200, 300)
        
        ctx.fillStyle = parseInt(color.slice(1), 16) > 0x7FFFFF ? "#000000" : "#FFFFFF"
        ctx.font = "bold 20px monospace"
        ctx.fillText(color, idx * 200 + 40, 260)
      })

      const link = document.createElement("a")
      link.download = `palette-${colors.join("-")}.png`
      link.href = canvas.toDataURL()
      link.click()
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 border rounded-2xl">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-muted-foreground">Harmony Rule:</span>
            <select value={harmony} onChange={(e) => setHarmony(e.target.value)} className="bg-muted px-3 py-1.5 rounded-xl text-sm font-bold focus:outline-none">
              <option value="random">Random/Free</option>
              <option value="monochromatic">Monochromatic</option>
              <option value="analogous">Analogous</option>
              <option value="complementary">Complementary</option>
              <option value="triadic">Triadic</option>
              <option value="split">Split Complementary</option>
            </select>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button onClick={generatePalette} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90">
              <RefreshCw className="h-4 w-4" /> Generate (Spacebar)
            </button>
            <button onClick={downloadPNG} className="p-2 border rounded-xl hover:bg-muted/40" title="Download PNG">
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 5 Swatches panel */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 h-[400px] md:h-[300px]">
          {colors.map((color, idx) => (
            <div key={idx} className="relative rounded-2xl overflow-hidden flex flex-col justify-end p-5 transition-transform hover:scale-[1.01]" style={{ backgroundColor: color }}>
              <div className="absolute top-4 right-4 flex gap-1.5">
                <button onClick={() => toggleLock(idx)} className="p-2 bg-black/20 hover:bg-black/30 rounded-full text-white cursor-pointer">
                  {locked[idx] ? <Lock className="h-4 w-4 text-amber-400" /> : <Unlock className="h-4 w-4" />}
                </button>
              </div>
              <div className="space-y-2 bg-black/30 backdrop-blur-sm p-3 rounded-xl text-white">
                <input
                  type="text"
                  value={color}
                  onChange={(e) => {
                    const val = e.target.value
                    setColors((prev) => {
                      const next = [...prev]
                      next[idx] = val
                      return next
                    })
                  }}
                  className="font-mono font-bold text-sm w-full bg-transparent border-none p-0 focus:ring-0 text-white"
                />
                <button onClick={() => copyToClipboard(color)} className="flex items-center gap-1 text-[10px] uppercase font-black tracking-widest opacity-80 hover:opacity-100">
                  <Copy className="h-3 w-3" /> Copy
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Export panels */}
        <div className="bg-card p-5 border rounded-2xl space-y-4">
          <h3 className="font-bold text-sm">Export Options</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-3 bg-muted/30 rounded-xl space-y-1">
              <span className="text-[10px] text-muted-foreground font-black uppercase">Tailwind Config</span>
              <pre className="text-xs bg-muted p-2 rounded overflow-x-auto text-muted-foreground font-mono">
                {`colors: {
  color1: "${colors[0]}",
  color2: "${colors[1]}",
  color3: "${colors[2]}",
  color4: "${colors[3]}",
  color5: "${colors[4]}",
}`}
              </pre>
            </div>
            <div className="p-3 bg-muted/30 rounded-xl space-y-1">
              <span className="text-[10px] text-muted-foreground font-black uppercase">CSS Custom Properties</span>
              <pre className="text-xs bg-muted p-2 rounded overflow-x-auto text-muted-foreground font-mono">
                {`:root {
  --color-1: ${colors[0]};
  --color-2: ${colors[1]};
  --color-3: ${colors[2]};
  --color-4: ${colors[3]};
  --color-5: ${colors[4]};
}`}
              </pre>
            </div>
            <div className="p-3 bg-muted/30 rounded-xl space-y-1">
              <span className="text-[10px] text-muted-foreground font-black uppercase">JSON Array</span>
              <pre className="text-xs bg-muted p-2 rounded overflow-x-auto text-muted-foreground font-mono">
                {JSON.stringify(colors, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    )
  }
  ```

- [ ] **Step 2: Create the route file**
  Create `src/app/tools/color-palette/page.tsx`.
  
  ```tsx
  import { ColorPalette } from "@/components/tools/color-palette"
  
  export const metadata = {
    title: "Color Palette Generator - Generate Color Harmonies",
    description: "Generate mathematical color palettes based on harmony rules. Lock colors and export to CSS or Tailwind.",
  }
  
  export default function ColorPalettePage() {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Color Palette Generator</h1>
          <p className="text-muted-foreground mt-2">
            Create beautiful, mathematically balanced palettes using standard color harmony theories.
          </p>
        </div>
        <ColorPalette />
      </div>
    )
  }
  ```

- [ ] **Step 3: Verify TS Compilation**
  Run: `npx tsc --noEmit`
  Expected: Success without TS errors.

- [ ] **Step 4: Commit**
  Run: `git add src/app/tools/color-palette/page.tsx src/components/tools/color-palette.tsx`
  Run: `git commit -m "feat: add Color Palette Generator component and page"`

---

### Task 4: Gradient Generator

**Files:**
- Create: `src/app/tools/gradient-generator/page.tsx`
- Create: `src/components/tools/gradient-generator.tsx`

- [ ] **Step 1: Create the `src/components/tools/gradient-generator.tsx` component**
  Curate 12 modern presets, add type selection (linear/radial), angle adjuster slider, stop editor inputs, flip buttons, and exports.
  
  ```tsx
  "use client"

  import { useState, useMemo } from "react"
  import { Copy, RefreshCw } from "lucide-react"

  interface GradientPreset {
    name: string
    colors: string[]
    angle: number
    type: "linear" | "radial"
  }

  const PRESETS: GradientPreset[] = [
    { name: "Sunset Breeze", colors: ["#FF5E62", "#FF9966"], angle: 135, type: "linear" },
    { name: "Ocean Glass", colors: ["#1FA2FF", "#12D8FA", "#A6FFCB"], angle: 90, type: "linear" },
    { name: "Neon Sunrise", colors: ["#F857A6", "#FF5858"], angle: 45, type: "linear" },
    { name: "Royal Purple", colors: ["#7F00FF", "#E100FF"], angle: 120, type: "linear" },
    { name: "Cotton Candy", colors: ["#FFAFBD", "#ffc3a0"], angle: 135, type: "linear" },
    { name: "Minty Fresh", colors: ["#00CDAC", "#8DDAD5"], angle: 90, type: "linear" },
    { name: "Dark Nebula", colors: ["#0F2027", "#203A43", "#2C5364"], angle: 135, type: "linear" },
    { name: "Cyberpunk", colors: ["#F12711", "#F5AF19"], angle: 60, type: "linear" },
    { name: "Emerald Dream", colors: ["#11998E", "#38EF7D"], angle: 135, type: "linear" }
  ]

  export function GradientGenerator() {
    const [selected, setSelected] = useState<GradientPreset>(PRESETS[0])
    const [colors, setColors] = useState<string[]>([...PRESETS[0].colors])
    const [angle, setAngle] = useState(PRESETS[0].angle)
    const [type, setType] = useState<"linear" | "radial">(PRESETS[0].type)

    const handleSelectPreset = (preset: GradientPreset) => {
      setSelected(preset)
      setColors([...preset.colors])
      setAngle(preset.angle)
      setType(preset.type)
    }

    const handleColorChange = (idx: number, val: string) => {
      setColors((prev) => {
        const next = [...prev]
        next[idx] = val
        return next
      })
    }

    const cssCode = useMemo(() => {
      if (type === "radial") {
        return `background: radial-gradient(circle, ${colors.join(", ")});`
      }
      return `background: linear-gradient(${angle}deg, ${colors.join(", ")});`
    }, [colors, angle, type])

    const tailwindCode = useMemo(() => {
      if (type === "radial") return `bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[${colors[0]}] to-[${colors[colors.length - 1]}]`
      let dir = "bg-gradient-to-r"
      if (angle >= 22.5 && angle < 67.5) dir = "bg-gradient-to-tr"
      else if (angle >= 67.5 && angle < 112.5) dir = "bg-gradient-to-r"
      else if (angle >= 112.5 && angle < 157.5) dir = "bg-gradient-to-br"
      else if (angle >= 157.5 && angle < 202.5) dir = "bg-gradient-to-b"
      else if (angle >= 202.5 && angle < 247.5) dir = "bg-gradient-to-bl"
      else if (angle >= 247.5 && angle < 292.5) dir = "bg-gradient-to-l"
      else if (angle >= 292.5 && angle < 337.5) dir = "bg-gradient-to-tl"
      else dir = "bg-gradient-to-t"

      const colorStops = colors.map((c, i) => {
        if (i === 0) return `from-[${c}]`
        if (i === colors.length - 1) return `to-[${c}]`
        return `via-[${c}]`
      })
      return `${dir} ${colorStops.join(" ")}`
    }, [colors, angle, type])

    const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text)
    }

    return (
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Preset Selector */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card p-5 border rounded-2xl space-y-4">
            <h2 className="text-lg font-bold">Presets Gallery</h2>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-2 border rounded-xl text-left cursor-pointer transition-all ${selected.name === preset.name ? "border-primary bg-primary/5 shadow-sm" : "hover:bg-muted/40"}`}
                >
                  <div className="h-10 w-full rounded-lg mb-1.5" style={{ background: `linear-gradient(${preset.angle}deg, ${preset.colors.join(", ")})` }} />
                  <p className="text-xs font-bold truncate">{preset.name}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview and Editor */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-card p-5 border rounded-2xl flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              {/* Preview Block */}
              <div className="w-full md:w-1/2 aspect-video rounded-2xl border overflow-hidden flex items-center justify-center relative shadow-inner" style={{ background: type === "radial" ? `radial-gradient(circle, ${colors.join(", ")})` : `linear-gradient(${angle}deg, ${colors.join(", ")})` }}>
                <div className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-xl text-white text-xs font-bold">
                  Live Preview
                </div>
              </div>

              {/* Editor controls */}
              <div className="w-full md:w-1/2 space-y-4">
                <h3 className="font-bold text-sm">Gradient Settings</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground font-bold">Type</label>
                    <div className="flex gap-2 mt-1">
                      <button onClick={() => setType("linear")} className={`flex-1 py-1.5 rounded-lg text-xs font-bold ${type === "linear" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>Linear</button>
                      <button onClick={() => setType("radial")} className={`flex-1 py-1.5 rounded-lg text-xs font-bold ${type === "radial" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>Radial</button>
                    </div>
                  </div>
                  {type === "linear" && (
                    <div>
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-muted-foreground">Angle</span>
                        <span>{angle}°</span>
                      </div>
                      <input type="range" min="0" max="360" value={angle} onChange={(e) => setAngle(parseInt(e.target.value))} className="w-full mt-1 cursor-pointer" />
                    </div>
                  )}
                  <div>
                    <label className="text-xs text-muted-foreground font-bold">Edit Colors</label>
                    <div className="flex gap-2 mt-1">
                      {colors.map((c, i) => (
                        <input key={i} type="color" value={c} onChange={(e) => handleColorChange(i, e.target.value)} className="w-10 h-10 border rounded-lg cursor-pointer bg-transparent" />
                      ))}
                      <button onClick={() => setColors([...colors].reverse())} className="p-2 border rounded-xl hover:bg-muted text-xs font-bold flex items-center gap-1">
                        <RefreshCw className="h-3 w-3" /> Flip
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Code outputs */}
            <div className="space-y-3 pt-3 border-t">
              <div className="p-3 bg-muted/30 rounded-xl flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-muted-foreground font-black uppercase">CSS Code</span>
                  <p className="font-mono text-xs text-muted-foreground truncate pr-4 mt-0.5">{cssCode}</p>
                </div>
                <button onClick={() => copyToClipboard(cssCode)} className="p-2 border rounded-xl hover:bg-muted/40 shrink-0" title="Copy CSS">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              <div className="p-3 bg-muted/30 rounded-xl flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-muted-foreground font-black uppercase">Tailwind CSS Classes</span>
                  <p className="font-mono text-xs text-muted-foreground truncate pr-4 mt-0.5">{tailwindCode}</p>
                </div>
                <button onClick={() => copyToClipboard(tailwindCode)} className="p-2 border rounded-xl hover:bg-muted/40 shrink-0" title="Copy Tailwind">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  ```

- [ ] **Step 2: Create the route file**
  Create `src/app/tools/gradient-generator/page.tsx`.
  
  ```tsx
  import { GradientGenerator } from "@/components/tools/gradient-generator"
  
  export const metadata = {
    title: "Gradient Generator - CSS Gradient Builder & Preset Explorer",
    description: "Browse curated gradients, customize parameters, swap angles, and export code snippets for CSS or Tailwind.",
  }
  
  export default function GradientGeneratorPage() {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gradient Generator</h1>
          <p className="text-muted-foreground mt-2">
            Explore and customize beautiful gradient presets, with instant code exports.
          </p>
        </div>
        <GradientGenerator />
      </div>
    )
  }
  ```

- [ ] **Step 3: Verify TypeScript Compilation**
  Run: `npx tsc --noEmit`
  Expected: Success without TS errors.

- [ ] **Step 4: Commit**
  Run: `git add src/app/tools/gradient-generator/page.tsx src/components/tools/gradient-generator.tsx`
  Run: `git commit -m "feat: add Gradient Generator component and page"`

---

### Task 5: Build & Production Verification

- [ ] **Step 1: Check build correctness**
  Run: `npm run build`
  Expected: Production bundle builds successfully without typescript or linting errors.
