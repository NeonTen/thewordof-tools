"use client"

import { useState, useMemo } from "react"
import { ProGate, ProBadge } from "@/components/ui/pro-gate"
import { RefreshCw, Search, CheckCircle2, AlertTriangle, Link2, ExternalLink, ShieldAlert, Sparkles, Filter, HelpCircle } from "lucide-react"
import { useUsageLimit } from "@/hooks/use-usage-limit"

interface ContrastFailure {
  tag: string
  selector: string
  text: string
  fgColor: string
  bgColor: string
  ratio: number
  requiredRatio: number
  isLargeText: boolean
  aaFailed: boolean
  aaaFailed: boolean
}

export function ColorContrastScanner({ isPro }: { isPro: boolean }) {
  const [url, setUrl] = useState("")
  const [failures, setFailures] = useState<ContrastFailure[]>([])

  const [totalScanned, setTotalScanned] = useState(0)
  const [scanning, setScanning] = useState(false)
  const [scanError, setScanError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "aa" | "aaa" | "text" | "ui">("all")

  // Usage Limit
  const { count: usedThisMonth, increment: incrementUsage } = useUsageLimit("color-contrast-scanner", "monthly")
  const limitReached = !isPro && usedThisMonth >= 5
  const isFeatureUnlocked = isPro || usedThisMonth < 5

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    if (limitReached) {
      setScanError("Free plan limit reached (5 URL scans/month). Upgrade to Pro to bypass.")
      return
    }

    setScanning(true)
    setScanError("")

    try {
      const res = await fetch("/api/tools/scan-contrast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      })
      const data = await res.json()
      if (data.error) {
        setScanError(data.error)
      } else {
        setFailures(data.failures)
        setTotalScanned(data.totalScanned || 0)
        await incrementUsage()
      }
    } catch {
      setScanError("Failed to fetch or analyze the target website.")
    } finally {
      setScanning(false)
    }
  }

  // Filtered Failures List
  const filteredFailures = useMemo(() => {
    return failures.filter((item) => {
      const matchesSearch =
        item.selector.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.text.toLowerCase().includes(searchQuery.toLowerCase())

      if (!matchesSearch) return false

      if (filterType === "aa") return item.aaFailed
      if (filterType === "aaa") return item.aaaFailed
      if (filterType === "text") return item.tag === "p" || item.tag === "span" || item.tag === "li"
      if (filterType === "ui") return item.tag === "button" || item.tag === "a"

      return true
    })
  }, [failures, searchQuery, filterType])

  // Statistics Computations
  const stats = useMemo(() => {
    const totalFailures = failures.length
    const passedCount = Math.max(0, totalScanned - totalFailures)
    const complianceRate = totalScanned > 0 ? Math.round((passedCount / totalScanned) * 100) : 100

    return {
      passed: passedCount,
      failed: totalFailures,
      complianceRate,
    }
  }, [failures, totalScanned])

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Scan controls */}
      <div className="lg:col-span-12">
        <div className="bg-card p-6 border rounded-2xl shadow-sm space-y-4">
          <div className="flex justify-between items-center max-w-2xl gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold flex items-center gap-2">
                Color Contrast Scanner
                {!isPro && <ProBadge />}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setUrl("https://tools.thewordof.com")
                  setFailures([
                    {
                      tag: "button",
                      selector: "button.btn-primary",
                      text: "Submit Form",
                      fgColor: "#777777",
                      bgColor: "#ffffff",
                      ratio: 2.4,
                      requiredRatio: 4.5,
                      isLargeText: false,
                      aaFailed: true,
                      aaaFailed: true,
                    },
                    {
                      tag: "p",
                      selector: "p.description",
                      text: "Read our comprehensive terms of services to understand your rights.",
                      fgColor: "#999999",
                      bgColor: "#f8fafc",
                      ratio: 2.84,
                      requiredRatio: 4.5,
                      isLargeText: false,
                      aaFailed: true,
                      aaaFailed: true,
                    },
                    {
                      tag: "a",
                      selector: "a.nav-link",
                      text: "Pricing Plans",
                      fgColor: "#f43f5e",
                      bgColor: "#ffe4e6",
                      ratio: 3.12,
                      requiredRatio: 4.5,
                      isLargeText: false,
                      aaFailed: true,
                      aaaFailed: true,
                    },
                    {
                      tag: "h3",
                      selector: "h3.card-title",
                      text: "Premium Service",
                      fgColor: "#fbbf24",
                      bgColor: "#ffffff",
                      ratio: 1.63,
                      requiredRatio: 3.0,
                      isLargeText: true,
                      aaFailed: true,
                      aaaFailed: true,
                    }
                  ])
                  setTotalScanned(45)
                }}
                className="text-xs font-bold text-primary hover:underline cursor-pointer focus:outline-none"
              >
                Try an Example
              </button>
            </div>
            {!isPro && (
              <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full font-semibold shrink-0">
                {Math.max(0, 5 - usedThisMonth)} of 5 free scans left this month
              </span>
            )}
          </div>

          <ProGate feature="Color Contrast URL Scanner" isPro={isFeatureUnlocked}>
            <form onSubmit={handleScan} className="flex gap-2 max-w-2xl">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="e.g. tools.thewordof.com"
                className="flex-1 px-3 py-2 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                disabled={limitReached}
              />
              <button
                type="submit"
                disabled={scanning || limitReached}
                className="px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                {scanning ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : null}
                {scanning ? "Scanning..." : "Scan URL"}
              </button>
            </form>
          </ProGate>

          {scanError && <p className="text-xs text-destructive font-semibold">{scanError}</p>}
        </div>
      </div>

      {/* Metrics Summary Panels */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-card p-5 border rounded-2xl shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Audit Overview</h3>
          
          <div className="flex flex-col items-center justify-center py-4 border-b border-border">
            <div className="relative flex items-center justify-center">
              <svg className="w-28 h-28 transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  className="stroke-muted"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  className={`transition-all duration-1000 ${
                    stats.complianceRate >= 90 ? "stroke-green-500" :
                    stats.complianceRate >= 70 ? "stroke-amber-500" :
                    "stroke-red-500"
                  }`}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={301.6}
                  strokeDashoffset={301.6 - (301.6 * stats.complianceRate) / 100}
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-2xl font-black">{stats.complianceRate}%</span>
                <span className="text-[10px] text-muted-foreground block font-bold uppercase">Compliance</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 bg-muted/20 border border-border/60 rounded-xl text-center">
              <span className="text-[9px] text-muted-foreground uppercase font-bold block">Elements</span>
              <span className="text-sm font-black">{totalScanned}</span>
            </div>
            <div className="p-2.5 bg-green-500/[0.02] border border-green-500/10 rounded-xl text-center">
              <span className="text-[9px] text-green-600 dark:text-green-400 uppercase font-bold block">Passes</span>
              <span className="text-sm font-black text-green-600 dark:text-green-400">{stats.passed}</span>
            </div>
            <div className="p-2.5 bg-red-500/[0.02] border border-red-500/10 rounded-xl text-center">
              <span className="text-[9px] text-red-600 dark:text-red-400 uppercase font-bold block">Failures</span>
              <span className="text-sm font-black text-red-600 dark:text-red-400">{stats.failed}</span>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-card p-5 border rounded-2xl shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Search & Filters</h3>
          
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by selector or text..."
              className="w-full pl-9 pr-3 py-2 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Severity Filter</span>
            {[
              { id: "all", label: "Show All Issues" },
              { id: "aa", label: "AA Failures Only" },
              { id: "aaa", label: "AAA Failures Only" },
              { id: "text", label: "Text Elements Only (p, span, li)" },
              { id: "ui", label: "Interactive Elements Only (buttons, links)" },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setFilterType(btn.id as any)}
                className={`w-full px-3 py-2 rounded-xl text-[11px] font-bold text-left cursor-pointer flex justify-between items-center transition-colors ${
                  filterType === btn.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Results Panel */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-card border rounded-2xl overflow-hidden shadow-sm flex flex-col min-h-[440px]">
          <div className="p-4 bg-muted/20 border-b border-border flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Compliance Auditor Log</span>
            <span className="text-[10px] bg-muted px-2 py-0.5 rounded-md font-bold text-muted-foreground">
              Showing {filteredFailures.length} issues
            </span>
          </div>

          <div className="divide-y divide-border/60">
            {filteredFailures.map((failure, idx) => (
              <div key={idx} className="p-5 hover:bg-muted/10 transition-colors flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="space-y-2 max-w-md">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-muted text-muted-foreground">
                      {failure.tag}
                    </span>
                    <code className="text-xs font-mono text-primary font-bold bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                      {failure.selector}
                    </code>
                    {failure.aaFailed && (
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-red-500/10 text-red-600 dark:text-red-400">
                        Fail AA
                      </span>
                    )}
                    {failure.aaaFailed && !failure.aaFailed && (
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        Fail AAA
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-foreground italic leading-relaxed border-l-2 border-border pl-3">
                    "{failure.text}"
                  </p>
                  
                  {/* Colors & Suggestion Details */}
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 rounded-full border border-border" style={{ backgroundColor: failure.fgColor }} />
                      <span className="font-mono text-[11px] text-muted-foreground">FG: {failure.fgColor}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 rounded-full border border-border" style={{ backgroundColor: failure.bgColor }} />
                      <span className="font-mono text-[11px] text-muted-foreground">BG: {failure.bgColor}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-border">
                  <div className="text-right">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Contrast</span>
                    <span className="text-2xl font-black text-red-500">{failure.ratio}:1</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Required</span>
                    <span className="text-sm font-bold text-foreground">{failure.requiredRatio}:1</span>
                  </div>
                </div>
              </div>
            ))}

            {filteredFailures.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-3">
                <CheckCircle2 className="h-10 w-10 text-green-500" />
                <h4 className="font-bold text-sm">Perfect Accessibility Contrast!</h4>
                <p className="text-xs text-muted-foreground max-w-xs">
                  No elements failed the active WCAG parameters. Colors are fully accessible for readers.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="lg:col-span-12 grid md:grid-cols-3 gap-6 mt-8">
        <div className="bg-primary/5 border border-primary/10 p-5 rounded-2xl space-y-2">
          <h4 className="text-sm font-bold flex items-center gap-2">
            <span className="h-5 w-5 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><span className="text-[10px] font-black">1</span></span> Page Contrast Rule
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Ensure color choices are accessible. Text elements must satisfy WCAG AA thresholds to remain readable for color-blind users.
          </p>
        </div>
        <div className="bg-primary/5 border border-primary/10 p-5 rounded-2xl space-y-2">
          <h4 className="text-sm font-bold flex items-center gap-2">
            <span className="h-5 w-5 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><span className="text-[10px] font-black">2</span></span> Typography Impact
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Larger fonts (18pt/24px or bold 14pt/18.6px) are allowed a relaxed 3.0:1 ratio, while standard body text requires a strict 4.5:1.
          </p>
        </div>
        <div className="bg-primary/5 border border-primary/10 p-5 rounded-2xl space-y-2">
          <h4 className="text-sm font-bold flex items-center gap-2">
            <span className="h-5 w-5 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><span className="text-[10px] font-black">3</span></span> Audit Audibility
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Fix failures by either darkening text or lightening background until you exceed the target compliance parameters.
          </p>
        </div>
      </div>
    </div>
  )
}
