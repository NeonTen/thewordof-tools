"use client"

import { useState, useMemo } from "react"
import { Copy, RefreshCw, FileText, Globe, CheckCircle2, AlertCircle } from "lucide-react"
import { useUsageLimit } from "@/hooks/use-usage-limit"

const DEFAULT_STOPWORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", "as", "at", 
  "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", 
  "can", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", 
  "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", 
  "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", 
  "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", 
  "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", 
  "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", 
  "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", 
  "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't", 
  "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves"
])

interface DensityItem {
  phrase: string
  count: number
  percentage: number
}

export function KeywordDensityAnalyzer({ isPro }: { isPro: boolean }) {
  const [text, setText] = useState("Search engine optimization (SEO) is the process of improving the quality and volume of website traffic to a website or a web page from search engines. SEO targets unpaid traffic rather than direct traffic or paid traffic. Unpaid traffic may originate from different kinds of searches, including image search, video search, academic search, news search, and industry-specific vertical search engines. Optimizing a website involves editing content, adding HTML tags, and modifying code to increase its relevance to specific keywords.")
  const [url, setUrl] = useState("")
  const [fetching, setFetching] = useState(false)
  const [fetchError, setFetchError] = useState("")
  
  const [inputMode, setInputMode] = useState<"text" | "url">("text")
  const [excludeStopwords, setExcludeStopwords] = useState(true)
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [targetKeywords, setTargetKeywords] = useState("SEO, traffic, search, website")
  const [activeGram, setActiveGram] = useState<1 | 2 | 3>(1)

  // Usage Limit
  const { count: usedThisMonth, increment: incrementUsage } = useUsageLimit("keyword-density", "monthly")
  const limitReached = !isPro && usedThisMonth >= 5

  // Web Scraper
  const handleFetchText = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    if (limitReached) {
      setFetchError("Free plan limit reached (5 URL scrapes/month). Upgrade to Pro to bypass.")
      return
    }

    setFetching(true)
    setFetchError("")
    try {
      const res = await fetch("/api/tools/fetch-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      })
      const data = await res.json()
      if (data.error) {
        setFetchError(data.error)
      } else {
        setText(data.text)
        setInputMode("text")
        // Increment limit count
        await incrementUsage()
      }
    } catch {
      setFetchError("Failed to fetch page content. Please verify the URL.")
    } finally {
      setFetching(false)
    }
  }

  // Text Parsing & Statistics
  const parsedWords = useMemo(() => {
    // Split text by non-alphanumeric characters but preserve hyphenated words
    const matches = text.match(/[a-zA-Z0-9'-]+/g) || []
    return matches.map(word => caseSensitive ? word : word.toLowerCase())
  }, [text, caseSensitive])

  const totalWordsCount = parsedWords.length

  const filteredWords = useMemo(() => {
    if (!excludeStopwords) return parsedWords
    return parsedWords.filter(w => !DEFAULT_STOPWORDS.has(w.toLowerCase()))
  }, [parsedWords, excludeStopwords])

  // N-gram frequency generators
  const densityData = useMemo(() => {
    const list = filteredWords
    const totalCount = list.length
    if (totalCount === 0) return { 1: [], 2: [], 3: [] }

    const freq1: { [key: string]: number } = {}
    const freq2: { [key: string]: number } = {}
    const freq3: { [key: string]: number } = {}

    for (let i = 0; i < list.length; i++) {
      // 1-Gram
      const w1 = list[i]
      freq1[w1] = (freq1[w1] || 0) + 1

      // 2-Gram
      if (i < list.length - 1) {
        const w2 = `${list[i]} ${list[i + 1]}`
        freq2[w2] = (freq2[w2] || 0) + 1
      }

      // 3-Gram
      if (i < list.length - 2) {
        const w3 = `${list[i]} ${list[i + 1]} ${list[i + 2]}`
        freq3[w3] = (freq3[w3] || 0) + 1
      }
    }

    const sortAndFormat = (freq: { [key: string]: number }, totalWords: number): DensityItem[] => {
      return Object.entries(freq)
        .map(([phrase, count]) => ({
          phrase,
          count,
          percentage: totalWords > 0 ? (count / totalWords) * 100 : 0
        }))
        .sort((a, b) => b.count - a.count || a.phrase.localeCompare(b.phrase))
    }

    return {
      1: sortAndFormat(freq1, totalWordsCount), // Calculate density based on overall words
      2: sortAndFormat(freq2, totalWordsCount - 1),
      3: sortAndFormat(freq3, totalWordsCount - 2)
    }
  }, [filteredWords, totalWordsCount])

  // Target Keywords Validator
  const targetsAnalysis = useMemo(() => {
    const keywords = targetKeywords
      .split(",")
      .map(k => k.trim())
      .filter(k => k.length > 0)
    
    return keywords.map(kw => {
      // Tokenize target keyword using the exact same word regex pattern
      const parts = kw.match(/[a-zA-Z0-9'-]+/g) || []
      let count = 0
      
      if (parts.length > 0) {
        const matchLength = parts.length
        for (let i = 0; i <= parsedWords.length - matchLength; i++) {
          let match = true
          for (let j = 0; j < matchLength; j++) {
            const wordA = caseSensitive ? parsedWords[i + j] : parsedWords[i + j].toLowerCase()
            const wordB = caseSensitive ? parts[j] : parts[j].toLowerCase()
            if (wordA !== wordB) {
              match = false
              break
            }
          }
          if (match) count++
        }
      }

      const density = totalWordsCount > 0 ? (count / totalWordsCount) * 100 : 0
      
      // Evaluation
      let status: "good" | "warning" | "over" | "under" = "good"
      let message = "Optimal density (1.0% - 2.5%)"
      if (density === 0) {
        status = "under"
        message = "Keyword not found on page"
      } else if (density < 1.0) {
        status = "warning"
        message = "Low density (< 1.0%) - consider adding more"
      } else if (density > 2.5) {
        status = "over"
        message = "Over-optimized (> 2.5%) - risk of keyword stuffing"
      }

      return { keyword: kw, count, density, status, message }
    })
  }, [targetKeywords, parsedWords, totalWordsCount, caseSensitive])

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Configuration Inputs */}
      <div className="lg:col-span-5 space-y-6">
        {/* Input Switcher */}
        <div className="bg-card p-5 border rounded-2xl space-y-4 shadow-sm">
          <div className="flex bg-muted/40 p-1 rounded-xl border border-border">
            <button 
              onClick={() => setInputMode("text")}
              className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${inputMode === "text" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              <FileText className="h-3.5 w-3.5" />
              Raw Text
            </button>
            <button 
              onClick={() => setInputMode("url")}
              className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${inputMode === "url" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Globe className="h-3.5 w-3.5" />
              Scrape URL
            </button>
          </div>

          {inputMode === "url" ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs text-muted-foreground font-bold px-1">
                <span>Scrape Page URL</span>
                {!isPro && (
                  <span className="bg-muted px-2 py-0.5 rounded-full">
                    {Math.max(0, 5 - usedThisMonth)} of 5 free scrapes left this month
                  </span>
                )}
              </div>
              <form onSubmit={handleFetchText} className="flex gap-2">
                <input 
                  type="text" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="e.g. tools.thewordof.com/tools"
                  className="flex-1 px-3 py-2 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                  disabled={limitReached}
                />
                <button 
                  type="submit" 
                  disabled={fetching || limitReached}
                  className="px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  {fetching ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : null}
                  {fetching ? "Scraping..." : "Scrape"}
                </button>
              </form>
            </div>
          ) : (
            <textarea 
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={10}
              placeholder="Paste your content here..."
              className="w-full px-3 py-2.5 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm leading-relaxed"
            />
          )}
          {fetchError && <p className="text-xs text-destructive font-semibold">{fetchError}</p>}
        </div>

        {/* Options & Target Keywords */}
        <div className="bg-card p-5 border rounded-2xl space-y-4 shadow-sm">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Analysis Configuration</h2>
          
          <div className="flex flex-wrap gap-4 pt-1">
            <label className="flex items-center gap-2 text-xs font-bold text-foreground cursor-pointer">
              <input 
                type="checkbox" 
                checked={excludeStopwords}
                onChange={(e) => setExcludeStopwords(e.target.checked)}
                className="rounded border-border text-primary focus:ring-0 cursor-pointer"
              />
              Exclude Stopwords
            </label>
            <label className="flex items-center gap-2 text-xs font-bold text-foreground cursor-pointer">
              <input 
                type="checkbox" 
                checked={caseSensitive}
                onChange={(e) => setCaseSensitive(e.target.checked)}
                className="rounded border-border text-primary focus:ring-0 cursor-pointer"
              />
              Case Sensitive
            </label>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Target Keywords (comma-separated)</label>
            <input 
              type="text" 
              value={targetKeywords}
              onChange={(e) => setTargetKeywords(e.target.value)}
              placeholder="e.g. SEO, keywords, optimization"
              className="w-full px-3 py-2 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-semibold"
            />
          </div>
        </div>
      </div>

      {/* Visual Analytics */}
      <div className="lg:col-span-7 space-y-6">
        {/* Target density validator results */}
        {targetsAnalysis.length > 0 && (
          <div className="bg-card p-5 border rounded-2xl space-y-3 shadow-sm">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Target Keywords Optimization</h3>
            <div className="grid gap-2">
              {targetsAnalysis.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`p-3.5 border rounded-xl flex items-center justify-between shadow-sm ${
                    item.status === "good" ? "border-green-500/20 bg-green-500/[0.02]" :
                    item.status === "warning" ? "border-amber-500/20 bg-amber-500/[0.02]" :
                    "border-red-500/20 bg-red-500/[0.02]"
                  }`}
                >
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground flex items-center gap-1.5">
                      {item.keyword}
                      <span className="text-xs font-mono font-bold text-muted-foreground">({item.count} occurrences)</span>
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-none">{item.message}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black tracking-tight">{item.density.toFixed(2)}%</span>
                    {item.status === "good" ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* N-Gram Freq Lists */}
        <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 bg-muted/20 border-b border-border flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Top Phrases & N-Grams</span>
            <div className="flex bg-muted/40 p-1 rounded-lg border border-border">
              {([1, 2, 3] as const).map(n => (
                <button 
                  key={n}
                  onClick={() => setActiveGram(n)}
                  className={`px-3 py-1 rounded-md text-xs font-bold cursor-pointer transition-colors ${activeGram === n ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {n}-Gram
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/10 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  <th className="p-3 pl-5">Phrase</th>
                  <th className="p-3 text-center">Occurrences</th>
                  <th className="p-3 text-right pr-5">Density</th>
                </tr>
              </thead>
              <tbody>
                {densityData[activeGram].slice(0, 10).map((item, idx) => (
                  <tr key={idx} className="border-b border-border last:border-none hover:bg-muted/10 transition-colors">
                    <td className="p-3 pl-5 font-semibold text-foreground max-w-[200px] truncate">{item.phrase}</td>
                    <td className="p-3 text-center font-bold text-muted-foreground">{item.count}</td>
                    <td className="p-3 text-right pr-5 font-black text-foreground">{item.percentage.toFixed(2)}%</td>
                  </tr>
                ))}
                {densityData[activeGram].length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-xs text-muted-foreground">
                      No words analyzed. Please enter content or verify stopword settings.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="lg:col-span-12 grid md:grid-cols-3 gap-6 mt-8">
        <div className="bg-primary/5 border border-primary/10 p-5 rounded-2xl space-y-2">
          <h4 className="text-sm font-bold flex items-center gap-2">
            <span className="h-5 w-5 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><span className="text-[10px] font-black">1</span></span> Keyword stuffing
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Avoid stuffing keywords. Maintain natural content flow while ensuring keywords are integrated harmoniously within target semantic bounds.
          </p>
        </div>
        <div className="bg-primary/5 border border-primary/10 p-5 rounded-2xl space-y-2">
          <h4 className="text-sm font-bold flex items-center gap-2">
            <span className="h-5 w-5 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><span className="text-[10px] font-black">2</span></span> Phrase matching
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Check 2-gram and 3-gram frequencies. Multiple word key phrases are often the highest-converting searches on organic engines.
          </p>
        </div>
        <div className="bg-primary/5 border border-primary/10 p-5 rounded-2xl space-y-2">
          <h4 className="text-sm font-bold flex items-center gap-2">
            <span className="h-5 w-5 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><span className="text-[10px] font-black">3</span></span> Stopwords exclusion
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Filter common English stopwords to surface the actual core context of your article, focusing SEO audit signals where they matter most.
          </p>
        </div>
      </div>

      {/* SEO Section */}
      <div className="lg:col-span-12 grid md:grid-cols-2 gap-12 mt-16 border-t border-border pt-12 pb-20">
        <section>
          <h2 className="text-2xl font-black tracking-tight mb-4">Understanding Keyword Density & Organic SEO</h2>
          <p className="text-muted-foreground leading-relaxed">
            Keyword density represents the percentage of times a particular phrase or keyword appears on a web page compared to the total word count. Historically used as a primary ranking indicator, modern search engines utilize it to categorize topic relevancy.
          </p>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            Targeting a natural balance (typically between 1.0% and 2.5%) helps guarantee that crawlers identify the key themes of your content without triggering spam alarms that penalize ranking performance.
          </p>
        </section>
        <section className="bg-muted/30 p-8 rounded-3xl border border-border">
          <h3 className="text-xl font-black tracking-tight mb-6">Optimization Checklist</h3>
          <ul className="space-y-4 list-none p-0">
            {[
              { title: "Avoid Keyword Stuffing", desc: "Forcing keywords repeatedly degrades read experiences. Focus on semantic keyword synonyms instead." },
              { title: "Utilize Long-Tail Phrases", desc: "Longer 2-word and 3-word n-gram phrases carry lower search competition and have high conversion potential." },
              { title: "Prioritize Core Placements", desc: "Integrate target keywords in the initial paragraph, heading titles (H1/H2), and target HTML meta descriptions." },
              { title: "Remove Excess Stopwords", desc: "Write concise sentences that convey clarity. Clean body text assists semantic layout parsers." },
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
