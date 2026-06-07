"use client"

import { useState, useMemo } from "react"
import { Copy, Download, Globe, Smartphone, Monitor, Info, RefreshCw } from "lucide-react"

// Simple pixel-width estimator for standard Google Fonts (Sans-serif)
function estimatePixelWidth(text: string, isTitle: boolean = false): number {
  let width = 0
  const charWidths: { [key: string]: number } = {
    w: 12, m: 12, W: 14, M: 14, i: 3, l: 3, t: 4, f: 4, I: 4, " ": 4,
    r: 5, j: 5, "(": 5, ")": 5, "[": 5, "]": 5, "{": 5, "}": 5,
    "-": 6, _: 6, c: 7, s: 7, z: 7, v: 7, x: 7, y: 7,
    a: 8, b: 8, d: 8, e: 8, g: 8, h: 8, k: 8, n: 8, o: 8, p: 8, q: 8, u: 8,
    A: 10, B: 10, C: 11, D: 11, E: 10, F: 9, G: 11, H: 11, J: 8, K: 10, L: 9,
    N: 11, O: 12, P: 10, Q: 12, R: 10, S: 10, T: 9, U: 11, V: 10, X: 10, Y: 10, Z: 9,
    "1": 5, "2": 8, "3": 8, "4": 8, "5": 8, "6": 8, "7": 8, "8": 8, "9": 8, "0": 8
  }

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    let charW = charWidths[char] || 8
    if (isTitle) {
      charW *= 1.2 // Titles are styled bolder/larger
    }
    width += charW
  }
  return Math.round(width)
}

export function SerpPreviewer() {
  const [title, setTitle] = useState("TheWordOf Tools - Free Online Developer & SEO Utilities")
  const [description, setDescription] = useState("Access a suite of essential free online tools for developers and SEO professionals. Generate schema, validate robots.txt, check contrast, and analyze keyword density instantly.")
  const [url, setUrl] = useState("https://tools.thewordof.com")
  const [slug, setSlug] = useState("seo-audit/serp-preview")
  
  // URL Fetcher States
  const [fetchUrl, setFetchUrl] = useState("")
  const [fetching, setFetching] = useState(false)
  const [fetchError, setFetchError] = useState("")
  
  // Display Options
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop")
  const [activeTab, setActiveTab] = useState<"preview" | "meta">("preview")
  const [copiedText, setCopiedText] = useState("")

  // Sizing Calculations
  const titleChars = title.length
  const titlePixels = useMemo(() => estimatePixelWidth(title, true), [title])
  const descChars = description.length
  const descPixels = useMemo(() => estimatePixelWidth(description, false), [description])

  // Validation Flags
  const isTitleOverChars = titleChars > 60
  const isTitleOverPixels = titlePixels > 580
  const isDescOverChars = descChars > 160
  const isDescOverPixels = descPixels > 990

  // Format full preview URL
  const previewUrl = useMemo(() => {
    try {
      const parsed = new URL(url)
      const cleanBase = parsed.origin
      return `${cleanBase}/${slug.replace(/^\//, "")}`
    } catch {
      return `${url}/${slug.replace(/^\//, "")}`
    }
  }, [url, slug])

  // Clean title/description snippet truncation
  const truncatedTitle = useMemo(() => {
    if (device === "desktop" && titlePixels > 580) {
      let current = ""
      for (const char of title) {
        if (estimatePixelWidth(current + char + "...", true) > 580) {
          return current.trim() + "..."
        }
        current += char
      }
    }
    if (device === "mobile" && titlePixels > 620) {
      let current = ""
      for (const char of title) {
        if (estimatePixelWidth(current + char + "...", true) > 620) {
          return current.trim() + "..."
        }
        current += char
      }
    }
    return title
  }, [title, titlePixels, device])

  const truncatedDesc = useMemo(() => {
    const limit = device === "desktop" ? 990 : 760
    const pixels = device === "desktop" ? descPixels : estimatePixelWidth(description, false) * 0.85
    if (pixels > limit) {
      let current = ""
      for (const char of description) {
        if (estimatePixelWidth(current + char + "...", false) * (device === "mobile" ? 0.85 : 1) > limit) {
          return current.trim() + "..."
        }
        current += char
      }
    }
    return description
  }, [description, descPixels, device])

  // Scrape Page Meta Tags
  const handleFetchMeta = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fetchUrl) return
    setFetching(true)
    setFetchError("")
    try {
      const response = await fetch("/api/tools/fetch-meta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: fetchUrl })
      })
      const data = await response.json()
      if (data.error) {
        setFetchError(data.error)
      } else {
        if (data.title) setTitle(data.title)
        if (data.description) setDescription(data.description)
        try {
          const parsed = new URL(fetchUrl.startsWith("http") ? fetchUrl : `https://${fetchUrl}`)
          setUrl(parsed.origin)
          setSlug(parsed.pathname.slice(1))
        } catch {
          setUrl(fetchUrl)
        }
      }
    } catch (err) {
      setFetchError("Connection timed out or failed to parse metadata.")
    } finally {
      setFetching(false)
    }
  }

  // Meta Code Output
  const generatedMetaHtml = useMemo(() => {
    return `<!-- Standard SEO Meta Tags -->
<title>${title}</title>
<meta name="description" content="${description}" />
<link rel="canonical" href="${previewUrl}" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${previewUrl}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${previewUrl}" />
<meta property="twitter:title" content="${title}" />
<meta property="twitter:description" content="${description}" />`
  }, [title, description, previewUrl])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText("Copied!")
    setTimeout(() => setCopiedText(""), 2000)
  }

  const downloadMetaTags = () => {
    const blob = new Blob([generatedMetaHtml], { type: "text/plain" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "seo-meta-tags.txt"
    link.click()
  }

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Configuration Controls */}
      <div className="lg:col-span-6 space-y-6">
        {/* Scrape Form */}
        <div className="bg-card p-5 border rounded-2xl space-y-4 shadow-sm">
          <h2 className="text-lg font-bold">Import Metadata from URL</h2>
          <form onSubmit={handleFetchMeta} className="flex gap-2">
            <input 
              type="text" 
              value={fetchUrl}
              onChange={(e) => setFetchUrl(e.target.value)}
              placeholder="e.g. google.com"
              className="flex-1 px-3 py-2 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
            />
            <button 
              type="submit" 
              disabled={fetching}
              className="px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              {fetching ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : null}
              {fetching ? "Fetching..." : "Fetch"}
            </button>
          </form>
          {fetchError && <p className="text-xs text-destructive font-semibold">{fetchError}</p>}
        </div>

        {/* Manual Configuration Inputs */}
        <div className="bg-card p-5 border rounded-2xl space-y-5 shadow-sm">
          <h2 className="text-lg font-bold">Configure Meta Tags</h2>
          
          <div className="space-y-1.5">
            <div className="flex justify-between items-baseline">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Page Title</label>
              <span className={`text-xs font-mono font-bold ${isTitleOverChars ? "text-destructive" : "text-muted-foreground"}`}>
                {titleChars} / 60 Chars
              </span>
            </div>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-semibold"
            />
            <div className="flex items-center justify-between text-[10px] text-muted-foreground px-1">
              <span>Pixel Width (approx): <span className="font-mono font-bold">{titlePixels}px</span></span>
              {isTitleOverPixels && <span className="text-destructive font-bold">Exceeds Google limit (580px)</span>}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-baseline">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Meta Description</label>
              <span className={`text-xs font-mono font-bold ${isDescOverChars ? "text-destructive" : "text-muted-foreground"}`}>
                {descChars} / 160 Chars
              </span>
            </div>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2.5 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm leading-relaxed"
            />
            <div className="flex items-center justify-between text-[10px] text-muted-foreground px-1">
              <span>Pixel Width (approx): <span className="font-mono font-bold">{descPixels}px</span></span>
              {isDescOverPixels && <span className="text-destructive font-bold">Exceeds Google limit (990px)</span>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Base Domain</label>
              <input 
                type="text" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-mono text-muted-foreground"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Path Slug</label>
              <input 
                type="text" 
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-2 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Visualizations & Meta Exports */}
      <div className="lg:col-span-6 space-y-6">
        <div className="bg-card border rounded-2xl overflow-hidden shadow-sm flex flex-col h-full min-h-[500px]">
          {/* Header tabs */}
          <div className="p-4 bg-muted/20 border-b border-border flex items-center justify-between flex-wrap gap-2">
            <div className="flex gap-1.5">
              <button 
                onClick={() => setActiveTab("preview")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${activeTab === "preview" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted/50"}`}
              >
                SERP Preview
              </button>
              <button 
                onClick={() => setActiveTab("meta")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${activeTab === "meta" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted/50"}`}
              >
                Export Meta Tags
              </button>
            </div>

            {activeTab === "preview" && (
              <div className="flex bg-muted/40 p-1 rounded-lg border border-border">
                <button 
                  onClick={() => setDevice("desktop")}
                  className={`p-1.5 rounded-md cursor-pointer transition-colors ${device === "desktop" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                  title="Desktop View"
                >
                  <Monitor className="h-3.5 w-3.5" />
                </button>
                <button 
                  onClick={() => setDevice("mobile")}
                  className={`p-1.5 rounded-md cursor-pointer transition-colors ${device === "mobile" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                  title="Mobile View"
                >
                  <Smartphone className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {activeTab === "meta" && (
              <div className="flex gap-2">
                <button 
                  onClick={() => copyToClipboard(generatedMetaHtml)}
                  className="px-2.5 py-1.5 bg-muted/50 hover:bg-muted text-xs font-bold rounded-lg border border-border flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Copy className="h-3 w-3" />
                  {copiedText ? "Copied!" : "Copy HTML"}
                </button>
                <button 
                  onClick={downloadMetaTags}
                  className="px-2.5 py-1.5 bg-muted/50 hover:bg-muted text-xs font-bold rounded-lg border border-border flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Download className="h-3 w-3" />
                  Download
                </button>
              </div>
            )}
          </div>

          {/* Main Workspace Frame */}
          <div className="flex-1 p-6 flex items-center justify-center bg-muted/10">
            {activeTab === "preview" ? (
              <div className="w-full max-w-lg">
                {device === "desktop" ? (
                  // Google Desktop Preview
                  <div className="bg-background p-6 rounded-2xl border border-border/80 shadow-md font-sans text-sm text-[#4d5156] space-y-1">
                    <div className="text-[12px] leading-relaxed text-[#202124] flex items-center gap-1 truncate mb-0.5">
                      <span>{url.replace(/https?:\/\//i, "")}</span>
                      <span className="text-[#5f6368]">› {slug.replace(/\//g, " › ")}</span>
                    </div>
                    <a className="text-[#1a0dab] hover:underline text-[20px] leading-[26px] font-medium cursor-pointer block truncate">
                      {truncatedTitle || "Please enter a title"}
                    </a>
                    <p className="text-[14px] leading-[22px] text-[#4d5156] mt-1 break-words">
                      {truncatedDesc || "Please enter a description for your snippet."}
                    </p>
                  </div>
                ) : (
                  // Google Mobile Preview
                  <div className="bg-background p-5 rounded-2xl border border-border/80 shadow-md font-sans text-sm text-[#4d5156] space-y-2 max-w-[360px] mx-auto">
                    <div className="flex items-center gap-2 text-[12px]">
                      <div className="h-6 w-6 rounded-full bg-[#f1f3f4] flex items-center justify-center shrink-0">
                        <Globe className="h-3.5 w-3.5 text-[#5f6368]" />
                      </div>
                      <div className="flex flex-col truncate">
                        <span className="text-[#202124] font-medium truncate leading-tight">{url.replace(/https?:\/\//i, "")}</span>
                        <span className="text-[#5f6368] text-[10px] leading-none truncate">{previewUrl}</span>
                      </div>
                    </div>
                    <a className="text-[#1558d6] hover:underline text-[18px] leading-[22px] font-medium cursor-pointer block mt-1">
                      {truncatedTitle || "Please enter a title"}
                    </a>
                    <p className="text-[12px] leading-[18px] text-[#3c4043] mt-1 break-words">
                      {truncatedDesc || "Please enter a description for your snippet."}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              // Meta Tag code preview
              <div className="w-full h-full flex flex-col">
                <pre className="flex-1 w-full bg-muted/40 p-4 border border-border/80 rounded-2xl text-[11px] font-mono text-muted-foreground overflow-auto whitespace-pre-wrap leading-relaxed max-h-[360px]">
                  <code>{generatedMetaHtml}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="lg:col-span-12 grid md:grid-cols-3 gap-6 mt-8">
        <div className="bg-primary/5 border border-primary/10 p-5 rounded-2xl space-y-2">
          <h4 className="text-sm font-bold flex items-center gap-2">
            <span className="h-5 w-5 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><span className="text-[10px] font-black">1</span></span> Optimize CTR
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your SERP snippet title and description are key elements determining Click-Through Rate (CTR) from organic search result rankings.
          </p>
        </div>
        <div className="bg-primary/5 border border-primary/10 p-5 rounded-2xl space-y-2">
          <h4 className="text-sm font-bold flex items-center gap-2">
            <span className="h-5 w-5 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><span className="text-[10px] font-black">2</span></span> Char vs Pixel Limits
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            While character lengths are helpful general guides, Google actually measures pixel length. Keep titles under 580px and descriptions under 990px.
          </p>
        </div>
        <div className="bg-primary/5 border border-primary/10 p-5 rounded-2xl space-y-2">
          <h4 className="text-sm font-bold flex items-center gap-2">
            <span className="h-5 w-5 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><span className="text-[10px] font-black">3</span></span> Structured Meta Tags
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Adding standard HTML metadata alongside Open Graph and Twitter tags helps both web search crawlers and social media link cards parse page contexts.
          </p>
        </div>
      </div>

      {/* SEO Section */}
      <div className="lg:col-span-12 grid md:grid-cols-2 gap-12 mt-16 border-t border-border pt-12 pb-20">
        <section>
          <h2 className="text-2xl font-black tracking-tight mb-4">Mastering Meta Tags & Search Snippets</h2>
          <p className="text-muted-foreground leading-relaxed">
            Meta tags are fragments of text placed inside the header section of your site's HTML page. They tell browser engines and search scrapers key information about the page context, helping them index and categorize text correctly.
          </p>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            When you enter optimized titles and descriptions, search engines use them to create the snippet shown on search result pages. Preventing truncation ensures that searchers get clean, readable marketing descriptions that improve CTR.
          </p>
        </section>
        <section className="bg-muted/30 p-8 rounded-3xl border border-border">
          <h3 className="text-xl font-black tracking-tight mb-6">SEO Snippet Guidelines</h3>
          <ul className="space-y-4 list-none p-0">
            {[
              { title: "Optimize Title Lengths (50 - 60 chars)", desc: "Titles longer than 60 characters or ~580px are truncated by search bots, replacing terminal text with ellipses (...)." },
              { title: "Write Actionable Descriptions (120 - 160 chars)", desc: "Write distinct summaries that explicitly detail value, using natural language and incorporating primary target keywords." },
              { title: "Define Canonical URLs", desc: "Always explicitly specify canonical URLs to instruct crawlers on the primary URL path, preventing duplicate indexing issues." },
              { title: "Social Graph Tags (OG & Twitter)", desc: "Always provide Open Graph and Twitter tags to control how layout links appear when shared across platforms like Facebook or Slack." },
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
