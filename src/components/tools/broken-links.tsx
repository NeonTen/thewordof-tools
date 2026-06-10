"use client"

import { useState, useMemo } from "react"
import { ProGate } from "@/components/ui/pro-gate"
import { RefreshCw, Search, CheckCircle2, AlertCircle, Link2, ExternalLink, ShieldAlert } from "lucide-react"
import { useUsageLimit } from "@/hooks/use-usage-limit"

interface ScannedLink {
  href: string
  text: string
  type: "internal" | "external"
  status: number
}

export function BrokenLinksAuditor({ isPro }: { isPro: boolean }) {
  const [url, setUrl] = useState("")
  const [links, setLinks] = useState<ScannedLink[]>([
    { href: "https://tools.thewordof.com", text: "Home Overview", type: "internal", status: 200 },
    { href: "https://tools.thewordof.com/tools", text: "All Utilities Directory", type: "internal", status: 200 },
    { href: "https://tools.thewordof.com/pricing", text: "Plans & Pro Billing", type: "internal", status: 200 },
    { href: "https://google.com/search-console", text: "Google Webmaster Console", type: "external", status: 200 },
    { href: "https://example.com/broken-page-demo", text: "Legacy Resource Document", type: "external", status: 404 },
    { href: "https://httpstat.us/301", text: "Redirected Target API", type: "external", status: 301 }
  ])
  
  const [scanning, setScanning] = useState(false)
  const [scanError, setScanError] = useState("")
  const [showSlowScanNotice, setShowSlowScanNotice] = useState(false)
  const [filter, setFilter] = useState<"all" | "broken" | "redirect" | "internal" | "external">("all")

  // Usage Limit
  const { count: usedThisMonth, increment: incrementUsage } = useUsageLimit("broken-links", "monthly")
  const limitReached = !isPro && usedThisMonth >= 3
  const isFeatureUnlocked = isPro || usedThisMonth < 3

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState<number | "all">(10)

  // Scan Action
  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    if (limitReached) {
      setScanError("Free plan limit reached (3 page audits/month). Upgrade to Pro to bypass.")
      return
    }

    setScanning(true)
    setScanError("")
    setShowSlowScanNotice(false)

    // Set a timer to show slow scan notice after 8 seconds
    const timer = setTimeout(() => {
      setShowSlowScanNotice(true)
    }, 8000)

    try {
      const res = await fetch("/api/tools/scan-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      })
      const data = await res.json()
      if (data.error) {
        setScanError(data.error)
      } else {
        setLinks(data.links)
        await incrementUsage()
      }
    } catch {
      setScanError("Connection timed out or failed to parse target URL links.")
    } finally {
      clearTimeout(timer)
      setShowSlowScanNotice(false)
      setScanning(false)
    }
  }

  // Statistics Calculations
  const stats = useMemo(() => {
    const total = links.length
    const ok = links.filter(l => l.status >= 200 && l.status < 300).length
    const redirects = links.filter(l => l.status >= 300 && l.status < 400).length
    const broken = links.filter(l => l.status >= 400 || l.status === 0).length
    const internal = links.filter(l => l.type === "internal").length
    const external = links.filter(l => l.type === "external").length
    return { total, ok, redirects, broken, internal, external }
  }, [links])

  const filteredLinks = useMemo(() => {
    return links.filter(l => {
      if (filter === "broken") return l.status >= 400 || l.status === 0
      if (filter === "redirect") return l.status >= 300 && l.status < 400
      if (filter === "internal") return l.type === "internal"
      if (filter === "external") return l.type === "external"
      return true
    })
  }, [links, filter])

  // Reset page when filter or links change
  useMemo(() => {
    setCurrentPage(1)
  }, [filter, links])

  const paginatedLinks = useMemo(() => {
    if (pageSize === "all") return filteredLinks
    const start = (currentPage - 1) * pageSize
    return filteredLinks.slice(start, start + pageSize)
  }, [filteredLinks, currentPage, pageSize])

  const totalPages = useMemo(() => {
    if (pageSize === "all" || filteredLinks.length === 0) return 1
    return Math.ceil(filteredLinks.length / pageSize)
  }, [filteredLinks, pageSize])

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Scan controls */}
      <div className="lg:col-span-12">
        <div className="bg-card p-6 border rounded-2xl shadow-sm space-y-4">
          <div className="flex justify-between items-center max-w-2xl gap-4">
            <h2 className="text-lg font-bold">Inspect Page Outbound Links</h2>
            {!isPro && (
              <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full font-semibold shrink-0">
                {Math.max(0, 3 - usedThisMonth)} of 3 free audits left this month
              </span>
            )}
          </div>
          
          <ProGate feature="Broken Link Checker" isPro={isFeatureUnlocked}>
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
                {scanning ? "Scanning..." : "Scan Links"}
              </button>
            </form>

            {scanning && showSlowScanNotice && (
              <p className="text-xs text-amber-500 font-semibold animate-pulse mt-2.5 flex items-center gap-1.5">
                <RefreshCw className="h-3 w-3 animate-spin" />
                Analyzing link inventory... Since this page has a large number of links, it may take a minute or two.
              </p>
            )}
          </ProGate>

          {scanError && <p className="text-xs text-destructive font-semibold">{scanError}</p>}
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-card p-5 border rounded-2xl shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Scanned Summary</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-muted/20 border border-border/60 rounded-xl">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold block">Total Links</span>
              <span className="text-xl font-black">{stats.total}</span>
            </div>
            <div className="p-3 bg-green-500/[0.02] border border-green-500/10 rounded-xl">
              <span className="text-[10px] text-green-600 dark:text-green-400 uppercase tracking-wider font-bold block">Active Links</span>
              <span className="text-xl font-black text-green-600 dark:text-green-400">{stats.ok}</span>
            </div>
            <div className="p-3 bg-amber-500/[0.02] border border-amber-500/10 rounded-xl">
              <span className="text-[10px] text-amber-600 dark:text-amber-400 uppercase tracking-wider font-bold block">Redirects</span>
              <span className="text-xl font-black text-amber-600 dark:text-amber-400">{stats.redirects}</span>
            </div>
            <div className="p-3 bg-red-500/[0.02] border border-red-500/10 rounded-xl">
              <span className="text-[10px] text-red-600 dark:text-red-400 uppercase tracking-wider font-bold block">Broken</span>
              <span className="text-xl font-black text-red-600 dark:text-red-400">{stats.broken}</span>
            </div>
          </div>

          <div className="border-t border-border pt-4 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-muted-foreground">Internal Links</span>
              <span className="text-foreground">{stats.internal}</span>
            </div>
            <div className="flex justify-between text-xs font-bold">
              <span className="text-muted-foreground">External Links</span>
              <span className="text-foreground">{stats.external}</span>
            </div>
          </div>
        </div>

        {/* Filter List Buttons */}
        <div className="bg-card p-5 border rounded-2xl shadow-sm space-y-2.5">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Filter Scanned Links</h3>
          <div className="flex flex-col gap-1">
            {[
              { id: "all", label: "Show All Links", badge: stats.total },
              { id: "broken", label: "Show Broken Only", badge: stats.broken, color: "text-red-500 bg-red-500/5" },
              { id: "redirect", label: "Show Redirects Only", badge: stats.redirects, color: "text-amber-500 bg-amber-500/5" },
              { id: "internal", label: "Show Internal Only", badge: stats.internal },
              { id: "external", label: "Show External Only", badge: stats.external }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setFilter(item.id as any)}
                className={`w-full px-3 py-2 rounded-xl text-xs font-bold text-left cursor-pointer flex justify-between items-center transition-colors ${filter === item.id ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted/40 text-muted-foreground hover:text-foreground"}`}
              >
                <span>{item.label}</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${filter === item.id ? "bg-primary-foreground/20 text-primary-foreground" : item.color || "bg-muted text-muted-foreground"}`}>{item.badge}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-card border rounded-2xl overflow-hidden shadow-sm flex flex-col min-h-[440px]">
          <div className="p-4 bg-muted/20 border-b border-border flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Outbound Link Inventory</span>
            <span className="text-[10px] bg-muted px-2 py-0.5 rounded-md font-bold text-muted-foreground">
              {pageSize === "all" ? `Showing all ${filteredLinks.length} items` : `Showing ${filteredLinks.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}-${Math.min(filteredLinks.length, currentPage * pageSize)} of ${filteredLinks.length} items`}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/10 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  <th className="p-3 pl-5">Anchor Text / Status</th>
                  <th className="p-3">Destination Link</th>
                  <th className="p-3 text-right pr-5">Type</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLinks.map((link, idx) => (
                  <tr key={idx} className="border-b border-border last:border-none hover:bg-muted/10 transition-colors">
                    <td className="p-3 pl-5">
                      <div className="space-y-1 max-w-[200px]">
                        <p className="font-semibold text-foreground truncate">{link.text}</p>
                        <div className="flex items-center gap-1.5">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                            link.status >= 200 && link.status < 300 ? "bg-green-500/10 text-green-600 dark:text-green-400" :
                            link.status >= 300 && link.status < 400 ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" :
                            "bg-red-500/10 text-red-600 dark:text-red-400"
                          }`}>
                            HTTP {link.status}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {link.status >= 200 && link.status < 300 ? "OK" : link.status >= 300 && link.status < 400 ? "Redirect" : "Broken"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <a 
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 truncate max-w-[280px]"
                    >
                        <Link2 className="h-3 w-3 shrink-0" />
                        <span className="truncate">{link.href}</span>
                        <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                      </a>
                    </td>
                    <td className="p-3 text-right pr-5">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                        {link.type}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredLinks.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-xs text-muted-foreground">
                      No matching outbound links found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {filteredLinks.length > 0 && (
            <div className="p-4 bg-muted/10 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Show</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    const val = e.target.value
                    setPageSize(val === "all" ? "all" : Number(val))
                    setCurrentPage(1)
                  }}
                  className="bg-background border border-border rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-primary font-bold text-foreground cursor-pointer"
                >
                  <option value={10}>10 items</option>
                  <option value={25}>25 items</option>
                  <option value={50}>50 items</option>
                  <option value={100}>100 items</option>
                  <option value="all">All items</option>
                </select>
              </div>

              {pageSize !== "all" && (
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 border border-border rounded-xl bg-card text-foreground font-bold hover:bg-muted/40 transition-colors disabled:opacity-40 disabled:hover:bg-card cursor-pointer"
                    >
                      Prev
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 border border-border rounded-xl bg-card text-foreground font-bold hover:bg-muted/40 transition-colors disabled:opacity-40 disabled:hover:bg-card cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Info Cards */}
      <div className="lg:col-span-12 grid md:grid-cols-3 gap-6 mt-8">
        <div className="bg-primary/5 border border-primary/10 p-5 rounded-2xl space-y-2">
          <h4 className="text-sm font-bold flex items-center gap-2">
            <span className="h-5 w-5 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><span className="text-[10px] font-black">1</span></span> Page Link equity
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Broken links drain website authority and disrupt the transmission of PageRank authority signals through internal link navigation.
          </p>
        </div>
        <div className="bg-primary/5 border border-primary/10 p-5 rounded-2xl space-y-2">
          <h4 className="text-sm font-bold flex items-center gap-2">
            <span className="h-5 w-5 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><span className="text-[10px] font-black">2</span></span> UX friction
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Clicking on a link that returns a 404 Error frustrates visitors, hurting brand authority and degrading website conversion stats.
          </p>
        </div>
        <div className="bg-primary/5 border border-primary/10 p-5 rounded-2xl space-y-2">
          <h4 className="text-sm font-bold flex items-center gap-2">
            <span className="h-5 w-5 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><span className="text-[10px] font-black">3</span></span> Crawl budget waste
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Search engine crawlers allocate finite time to indexing pages. Auditing redirects prevents wasting valuable crawl resources.
          </p>
        </div>
      </div>

      {/* SEO Section */}
      <div className="lg:col-span-12 grid md:grid-cols-2 gap-12 mt-16 border-t border-border pt-12 pb-20">
        <section>
          <h2 className="text-2xl font-black tracking-tight mb-4">The Importance of Outbound Link Audits</h2>
          <p className="text-muted-foreground leading-relaxed">
            Every link you include on a page acts as a trust signal. Outbound links connecting to broken pages or loop redirects look unprofessional and suggest that a page is unmaintained, which can hurt your organic search engine trust score.
          </p>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            Using our checker regularly to trace status codes ensures that your link assets are healthy, improving accessibility compliance and keeping visitors engaged.
          </p>
        </section>
        <section className="bg-muted/30 p-8 rounded-3xl border border-border">
          <h3 className="text-xl font-black tracking-tight mb-6">Link Health Guidelines</h3>
          <ul className="space-y-4 list-none p-0">
            {[
              { title: "Fix 404 Status Errors", desc: "Always replace broken links with updated target URLs or remove them completely if the resource no longer exists." },
              { title: "Minimize Redirect Chains", desc: "Avoid multiple hops. Point links directly to their final destination to prevent crawl overhead." },
              { title: "Review Anchor Text Relevance", desc: "Use specific anchor descriptions (like 'contrast checker tool') rather than generic terms ('click here')." },
              { title: "Separate Internal vs External Ratios", desc: "Create a healthy link layout by balancing internal pages and external resource links." },
            ].map((item, i) => (
              <li key={i} className="flex gap-4">
                <div className="h-6 w-6 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black text-primary">{i + 1}</div>
                <div>
                  <h4 className="font-bold text-foreground leading-none mb-1">{item.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
