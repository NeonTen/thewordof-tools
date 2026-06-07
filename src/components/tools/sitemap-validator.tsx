"use client"

import React, { useState, useMemo } from "react"
import { Globe, FileCode, CheckCircle2, AlertTriangle, AlertCircle, Search, ArrowRight, Folder, Link as LinkIcon, RefreshCw, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface SitemapURL {
  loc: string
  lastmod: string
  changefreq: string
  priority: string
}

interface TreeItem {
  name: string
  count: number
  isLeaf: boolean
  children: { [key: string]: TreeItem }
}

export function SitemapValidator() {
  const [sitemapUrl, setSitemapUrl] = useState("")
  const [rawXml, setRawXml] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")
  
  // Parsed results
  const [urls, setUrls] = useState<SitemapURL[]>([])
  const [isSitemapIndex, setIsSitemapIndex] = useState(false)
  const [mediaCount, setMediaCount] = useState(0)
  
  const [activeTab, setActiveTab] = useState<"table" | "tree" | "report">("table")
  const [searchQuery, setSearchQuery] = useState("")

  // Table pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 25

  // Parse XML text helper
  const parseXmlString = (xmlText: string) => {
    setErrorMsg("")
    setSuccessMsg("")
    setUrls([])
    setIsSitemapIndex(false)
    setMediaCount(0)

    try {
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xmlText, "text/xml")
      
      // Check for parsing errors
      const parserError = xmlDoc.getElementsByTagName("parsererror")[0]
      if (parserError) {
        throw new Error(parserError.textContent || "Invalid XML format.")
      }

      // Check for sitemap index
      const sitemapIndexNodes = xmlDoc.getElementsByTagName("sitemapindex")
      if (sitemapIndexNodes.length > 0) {
        setIsSitemapIndex(true)
        const sitemaps = Array.from(xmlDoc.getElementsByTagName("sitemap")).map(node => ({
          loc: node.getElementsByTagName("loc")[0]?.textContent || "",
          lastmod: node.getElementsByTagName("lastmod")[0]?.textContent || "N/A",
          changefreq: "N/A",
          priority: "N/A"
        }))
        setUrls(sitemaps)
        setSuccessMsg(`Detected Sitemap Index containing ${sitemaps.length} nested sitemaps.`)
        return
      }

      // Parse standard sitemap
      const urlNodes = Array.from(xmlDoc.getElementsByTagName("url"))
      if (urlNodes.length === 0) {
        throw new Error("No <url> tags detected in the XML sitemap.")
      }

      // Extract URLs
      const parsedUrls = urlNodes.map(node => ({
        loc: node.getElementsByTagName("loc")[0]?.textContent || "",
        lastmod: node.getElementsByTagName("lastmod")[0]?.textContent || "N/A",
        changefreq: node.getElementsByTagName("changefreq")[0]?.textContent || "N/A",
        priority: node.getElementsByTagName("priority")[0]?.textContent || "0.5"
      }))

      // Count media
      let countMedia = 0
      countMedia += xmlDoc.getElementsByTagName("image:image").length
      countMedia += xmlDoc.getElementsByTagName("video:video").length
      setMediaCount(countMedia)

      setUrls(parsedUrls)
      setSuccessMsg(`Sitemap parsed successfully. Found ${parsedUrls.length} pages.`)
    } catch (e: any) {
      setErrorMsg(e.message || "Failed to parse sitemap XML. Make sure sitemap is well-formed.")
    }
  }

  // Handle URL fetch
  const handleFetchSitemap = async () => {
    if (!sitemapUrl) return
    setIsLoading(true)
    setErrorMsg("")
    setSuccessMsg("")
    try {
      const res = await fetch("/api/tools/fetch-sitemap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: sitemapUrl.trim() })
      })
      if (!res.ok) {
        throw new Error(await res.text() || "Failed to fetch sitemap.")
      }
      const data = await res.json()
      if (data.error) {
        throw new Error(data.error)
      }
      setRawXml(data.xml)
      parseXmlString(data.xml)
    } catch (e: any) {
      setErrorMsg(e.message || "Could not retrieve sitemap from URL. Check URL or paste XML directly.")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle manual paste submit
  const handlePasteSubmit = () => {
    if (!rawXml) return
    parseXmlString(rawXml)
  }

  // Filter & Search URLs
  const filteredUrls = useMemo(() => {
    if (!searchQuery) return urls
    return urls.filter(u => u.loc.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [urls, searchQuery])

  const paginatedUrls = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage
    return filteredUrls.slice(startIdx, startIdx + itemsPerPage)
  }, [filteredUrls, currentPage])

  const totalPages = Math.ceil(filteredUrls.length / itemsPerPage)

  // Generate compliance warnings
  const validationReport = useMemo(() => {
    const warnings: { type: "error" | "warning"; msg: string }[] = []
    if (urls.length === 0) return warnings

    // Checks
    const nonHttps = urls.filter(u => u.loc && !u.loc.startsWith("https://"))
    if (nonHttps.length > 0) {
      warnings.push({
        type: "warning",
        msg: `${nonHttps.length} URLs use non-secure HTTP connections instead of HTTPS.`
      })
    }

    const locs = urls.map(u => u.loc)
    const duplicates = locs.filter((item, index) => locs.indexOf(item) !== index)
    if (duplicates.length > 0) {
      warnings.push({
        type: "warning",
        msg: `${duplicates.length} duplicate URL locations detected.`
      })
    }

    const missingLastmod = urls.filter(u => u.lastmod === "N/A" || !u.lastmod)
    if (missingLastmod.length > 0 && !isSitemapIndex) {
      warnings.push({
        type: "warning",
        msg: `${missingLastmod.length} URLs are missing <lastmod> timestamps.`
      })
    }

    const tooLong = urls.filter(u => u.loc && u.loc.length > 2048)
    if (tooLong.length > 0) {
      warnings.push({
        type: "error",
        msg: `${tooLong.length} URLs exceed the standard limit of 2,048 characters.`
      })
    }

    return warnings
  }, [urls, isSitemapIndex])

  // Build Directory Tree structure
  const directoryTree = useMemo(() => {
    const root: TreeItem = { name: "Root", count: 0, isLeaf: false, children: {} }
    urls.forEach(u => {
      try {
        const urlObj = new URL(u.loc)
        const parts = urlObj.pathname.split("/").filter(Boolean)
        let current = root
        current.count++

        parts.forEach((part, idx) => {
          if (!current.children[part]) {
            current.children[part] = {
              name: part,
              count: 0,
              isLeaf: idx === parts.length - 1,
              children: {}
            }
          }
          current = current.children[part]
          current.count++
        })
      } catch (e) {}
    })
    return root
  }, [urls])

  // Render tree node helper
  const renderTreeNode = (node: TreeItem, path = "", depth = 0) => {
    const keys = Object.keys(node.children)
    if (keys.length === 0) return null
    return (
      <div key={path} className={cn("space-y-1.5", depth > 0 ? "ml-4 pl-3.5 border-l border-border" : "")}>
        {keys.map(key => {
          const child = node.children[key]
          return (
            <div key={key} className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold font-mono py-1 text-muted-foreground">
                {child.isLeaf ? (
                  <LinkIcon className="h-3.5 w-3.5 text-primary shrink-0" />
                ) : (
                  <Folder className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                )}
                <span className="text-foreground">{child.name}</span>
                <span className="bg-muted px-1.5 py-0.5 rounded-full text-[9px] text-muted-foreground font-sans">
                  {child.count} {child.count === 1 ? "url" : "urls"}
                </span>
              </div>
              {renderTreeNode(child, `${path}/${key}`, depth + 1)}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-[1fr_2fr] gap-8 items-start">
      {/* Inputs Column */}
      <div className="space-y-6">
        <Card className="border-none shadow-sm bg-muted/20">
          <CardHeader className="bg-muted/30 border-b pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              Sitemap Input Source
            </CardTitle>
            <CardDescription className="text-xs">Provide a sitemap URL to fetch or paste the XML directly.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sitemap-url">Fetch from URL</Label>
              <div className="flex gap-2">
                <Input 
                  id="sitemap-url" 
                  placeholder="https://example.com/sitemap.xml" 
                  value={sitemapUrl}
                  onChange={e => setSitemapUrl(e.target.value)}
                  className="h-10 text-xs"
                />
                <Button 
                  type="button"
                  onClick={handleFetchSitemap} 
                  disabled={isLoading || !sitemapUrl}
                  className="h-10 px-4 shrink-0 cursor-pointer"
                >
                  {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Fetch"}
                </Button>
              </div>
            </div>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink mx-4 text-[10px] text-muted-foreground uppercase font-black tracking-wider">or paste XML</span>
              <div className="flex-grow border-t border-border"></div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sitemap-xml">Raw XML Code</Label>
              <Textarea 
                id="sitemap-xml" 
                placeholder="<urlset xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'>..." 
                className="min-h-[160px] max-h-[300px] font-mono text-xs overflow-y-auto"
                value={rawXml}
                onChange={e => setRawXml(e.target.value)}
              />
            </div>
            <Button type="button" className="w-full h-11 font-black cursor-pointer" onClick={handlePasteSubmit} disabled={!rawXml}>
              Validate & Parse XML
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Visualizer Column */}
      <div className="space-y-4">
        {/* Status badges */}
        {(errorMsg || successMsg) && (
          <div className={cn(
            "p-4 rounded-2xl border flex gap-3 text-xs",
            errorMsg 
              ? "bg-red-500/[0.03] border-red-500/10 text-red-600" 
              : "bg-green-500/[0.03] border-green-500/10 text-green-700"
          )}>
            {errorMsg ? (
              <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
            ) : (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
            )}
            <div className="space-y-0.5 font-bold">
              <p>{errorMsg ? "Sitemap Parsing Error" : "Validation Complete"}</p>
              <p className="text-muted-foreground font-medium">{errorMsg || successMsg}</p>
            </div>
          </div>
        )}

        {urls.length > 0 && (
          <>
            {/* Stat Counters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="border border-border p-4 shadow-sm bg-card">
                <div className="text-[10px] uppercase font-black tracking-wider text-muted-foreground">Total URLs</div>
                <div className="text-2xl font-black mt-1">{urls.length}</div>
              </Card>
              <Card className="border border-border p-4 shadow-sm bg-card">
                <div className="text-[10px] uppercase font-black tracking-wider text-muted-foreground">Type</div>
                <div className="text-sm font-black mt-2 text-primary">{isSitemapIndex ? "Sitemap Index" : "Standard URL Set"}</div>
              </Card>
              <Card className="border border-border p-4 shadow-sm bg-card">
                <div className="text-[10px] uppercase font-black tracking-wider text-muted-foreground">Media Nodes</div>
                <div className="text-2xl font-black mt-1">{mediaCount}</div>
              </Card>
              <Card className="border border-border p-4 shadow-sm bg-card">
                <div className="text-[10px] uppercase font-black tracking-wider text-muted-foreground">Warnings</div>
                <div className="text-2xl font-black mt-1 text-amber-500">{validationReport.length}</div>
              </Card>
            </div>

            {/* Tab selector */}
            <div className="flex items-center justify-between bg-card p-1.5 border border-border rounded-xl">
              <div className="flex gap-1.5">
                <button 
                  type="button"
                  onClick={() => setActiveTab("table")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                    activeTab === "table" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted text-muted-foreground"
                  )}
                >
                  URLs Table
                </button>
                <button 
                  type="button"
                  onClick={() => setActiveTab("tree")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                    activeTab === "tree" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted text-muted-foreground"
                  )}
                >
                  Directory Visualizer
                </button>
                <button 
                  type="button"
                  onClick={() => setActiveTab("report")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                    activeTab === "report" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted text-muted-foreground"
                  )}
                >
                  SEO Issues ({validationReport.length})
                </button>
              </div>

              {activeTab === "table" && (
                <div className="relative w-48 hidden sm:block">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search paths..."
                    value={searchQuery}
                    onChange={e => {
                      setSearchQuery(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="w-full pl-8 pr-3 py-1 bg-muted/40 rounded-lg border border-border text-xs focus:outline-none focus:ring-1 focus:ring-primary/20 text-foreground"
                  />
                </div>
              )}
            </div>

            {/* Tab contents */}
            {activeTab === "table" && (
              <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm animate-in fade-in duration-200">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-muted/30 border-b border-border">
                        <th className="p-3.5 font-bold uppercase tracking-wider text-muted-foreground text-[10px]">URL Location</th>
                        <th className="p-3.5 font-bold uppercase tracking-wider text-muted-foreground text-[10px] w-28">Lastmod</th>
                        <th className="p-3.5 font-bold uppercase tracking-wider text-muted-foreground text-[10px] w-20 text-center">Priority</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {paginatedUrls.map((u, idx) => (
                        <tr key={idx} className="hover:bg-muted/10 transition-colors">
                          <td className="p-3.5 font-mono text-[11px] truncate max-w-md text-primary font-bold">
                            <a href={u.loc} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1.5">
                              <Globe className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                              {u.loc}
                            </a>
                          </td>
                          <td className="p-3.5 text-muted-foreground font-mono text-[11px]">{u.lastmod}</td>
                          <td className="p-3.5 text-center font-bold text-foreground">{u.priority}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="p-4 border-t border-border flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-medium">Page {currentPage} of {totalPages}</span>
                    <div className="flex gap-1">
                      <Button type="button" variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>Prev</Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}>Next</Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "tree" && (
              <Card className="border border-border p-6 rounded-3xl bg-card shadow-sm animate-in fade-in duration-200">
                <h3 className="text-xs uppercase font-black text-muted-foreground tracking-widest mb-4">Hierarchical Directory Visualizer</h3>
                <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                  {renderTreeNode(directoryTree)}
                </div>
              </Card>
            )}

            {activeTab === "report" && (
              <Card className="border border-border p-6 rounded-3xl bg-card shadow-sm animate-in fade-in duration-200 space-y-4">
                <h3 className="text-xs uppercase font-black text-muted-foreground tracking-widest">Sitemap Compliance Health Report</h3>
                <div className="space-y-3">
                  {validationReport.map((rep, idx) => (
                    <div key={idx} className={cn(
                      "p-4 rounded-2xl border flex gap-3 text-xs font-bold leading-relaxed",
                      rep.type === "error" 
                        ? "bg-red-500/[0.02] border-red-500/10 text-red-500" 
                        : "bg-amber-500/[0.02] border-amber-500/10 text-amber-600"
                    )}>
                      {rep.type === "error" ? (
                        <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" />
                      )}
                      <div>
                        <p className="uppercase text-[10px] tracking-wider font-black">{rep.type}</p>
                        <p className="text-muted-foreground font-medium mt-0.5">{rep.msg}</p>
                      </div>
                    </div>
                  ))}
                  {validationReport.length === 0 && (
                    <div className="p-8 text-center space-y-2">
                      <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto" />
                      <p className="font-black text-sm text-foreground">Zero Compliance Issues Found!</p>
                      <p className="text-xs text-muted-foreground">Your sitemap adheres perfectly to standard XML validation parameters.</p>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}
