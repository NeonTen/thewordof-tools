"use client"

import { useState, useMemo, useEffect } from "react"
import { Type, AlertCircle, CheckCircle2, Award, BookOpen, FileText, Globe, RefreshCw, Sparkles, X as CloseIcon, Check, Download } from "lucide-react"
import { useUsageLimit } from "@/hooks/use-usage-limit"
import { diffSentences } from "@/lib/diff"
import Link from "next/link"
import { TagInput } from "@/components/ui/tag-input"

// Simple syllable counter algorithm
function countSyllablesInWord(word: string): number {
  const cleanWord = word.toLowerCase().replace(/[^a-z]/g, "")
  if (cleanWord.length <= 3) return 1
  
  // Remove quiet trailing 'e', 'es', 'ed'
  const suffixCleaned = cleanWord.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "")
  const doubleVowelsMatch = suffixCleaned.replace(/^y/, "").match(/[aeiouy]{1,2}/g)
  
  return doubleVowelsMatch ? Math.max(1, doubleVowelsMatch.length) : 1
}

// Simple check for Dale-Chall list approximation (familiar words are mostly <= 2 syllables and length <= 5)
function isFamiliarWord(word: string): boolean {
  const cleanWord = word.toLowerCase()
  return cleanWord.length <= 5 || countSyllablesInWord(cleanWord) <= 2
}

function stripMarkdown(md: string): string {
  return md
    .replace(/^#+\s+/gm, '') // headings
    .replace(/^\s*[-*]\s+/gm, '') // lists
    .replace(/\*\*/g, '') // bold
}

export function ReadabilityGrader({ 
  isPro, 
  creditsRemaining = null,
  isLoggedIn = false
}: { 
  isPro: boolean
  creditsRemaining?: number | null
  isLoggedIn?: boolean
}) {
  const [text, setText] = useState("")
  const [formattedText, setFormattedText] = useState("")
  const [localCredits, setLocalCredits] = useState<number | null>(creditsRemaining)
  const [isImproving, setIsImproving] = useState(false)
  const [improvedText, setImprovedText] = useState("")
  const [showDiffModal, setShowDiffModal] = useState(false)
  const [improveError, setImproveError] = useState("")
  const [showExportMenu, setShowExportMenu] = useState(false)

  // Algorithm and protected keywords state
  const [selectedAlgo, setSelectedAlgo] = useState<"flesch" | "gunning" | "dale" | "ari" | "smog">("flesch")
  const [protectedKeywords, setProtectedKeywords] = useState<string[]>([])
  const [showMoreAlgo, setShowMoreAlgo] = useState(false)

  useEffect(() => {
    setLocalCredits(creditsRemaining)
  }, [creditsRemaining])
  
  // Scraper States
  const [url, setUrl] = useState("")
  const [fetching, setFetching] = useState(false)
  const [fetchError, setFetchError] = useState("")
  const [inputMode, setInputMode] = useState<"text" | "url">("text")

  // Usage Limit
  const { count: usedThisMonth, increment: incrementUsage } = useUsageLimit("readability-grader", "monthly")
  const limitReached = !isPro && usedThisMonth >= 5

  // Scraper Action
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
        setFormattedText("")
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

  const handleImproveReadability = async () => {
    if (!text.trim() || isImproving) return
    setIsImproving(true)
    setImproveError("")
    try {
      const res = await fetch("/api/ai/improve-readability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, protectedKeywords })
      })
      if (!res.ok) {
        const errMsg = await res.text()
        throw new Error(errMsg || "Failed to process text.")
      }
      const data = await res.json()
      setImprovedText(data.improvedText)
      setShowDiffModal(true)
      if (localCredits !== null) {
        setLocalCredits(prev => Math.max(0, (prev ?? 2) - 2))
      }
    } catch (err: any) {
      setImproveError(err.message || "An error occurred while improving text.")
    } finally {
      setIsImproving(false)
    }
  }

  const downloadMd = () => {
    const sourceText = formattedText || text
    if (!sourceText.trim()) return
    const blob = new Blob([sourceText], { type: "text/markdown;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "readability-content.md"
    link.click()
    URL.revokeObjectURL(url)
  }

  const downloadRtf = () => {
    const sourceText = formattedText || text
    if (!sourceText.trim()) return

    // Basic Markdown to RTF converter
    let rtfContent = sourceText
      // Escape RTF special characters first
      .replace(/\\/g, '\\\\')
      .replace(/{/g, '\\{')
      .replace(/}/g, '\\}')
      // Headings
      .replace(/^# (.*?)$/gm, '\\line\\cf1\\b\\fs32 $1\\b0\\cf0\\fs22\\par\\line')
      .replace(/^## (.*?)$/gm, '\\line\\cf1\\b\\fs28 $1\\b0\\cf0\\fs22\\par\\line')
      .replace(/^### (.*?)$/gm, '\\line\\cf1\\b\\fs24 $1\\b0\\cf0\\fs22\\par\\line')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '\\b $1\\b0')
      // List items
      .replace(/^\s*[-*]\s+(.*?)$/gm, '{\\pntext\\tab\\\'b7\\tab}{\\*\\pndec}\\fi-360\\li720 $1\\par')
      // Paragraph breaks
      .replace(/\n\n/g, '\\par\\line ')
      .replace(/\n/g, '\\par ')

    const rtfDoc = `{\\rtf1\\ansi\\ansicpg1252\\deff0\\deflang1033{\\fonttbl{\\f0\\fnil\\fcharset0 Calibri;}}
{\\colortbl ;\\red30\\green58\\blue138;\\red51\\green65\\blue85;}
\\f0\\fs22\\cf2
${rtfContent}
}`

    const blob = new Blob([rtfDoc], { type: "application/rtf;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "readability-content.rtf"
    link.click()
    URL.revokeObjectURL(url)
  }

  const downloadDocx = () => {
    const sourceText = formattedText || text
    if (!sourceText.trim()) return
    // Very simple Markdown-to-HTML converter
    let htmlContent = sourceText
      .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
      .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
      .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^\s*[-*]\s+(.*?)$/gm, '<li>$1</li>')
      // Wrap sequential <li> tags in <ul>
      .replace(/(<li>.*?<\/li>)+/g, '<ul>$&</ul>')
      // Handle paragraphs
      .split('\n\n')
      .map(p => {
        if (p.trim().startsWith('<h') || p.trim().startsWith('<ul')) return p
        return `<p>${p.replace(/\n/g, '<br/>')}</p>`
      })
      .join('\n')

    const docxTemplate = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <title>Readability Grader Content</title>
        <!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->
        <style>
          body { font-family: 'Calibri', Arial, sans-serif; line-height: 1.5; color: #111111; }
          h1 { font-size: 20pt; font-weight: bold; margin-top: 12pt; margin-bottom: 6pt; color: #1e3a8a; }
          h2 { font-size: 16pt; font-weight: bold; margin-top: 12pt; margin-bottom: 6pt; color: #1e3a8a; }
          h3 { font-size: 13pt; font-weight: bold; margin-top: 12pt; margin-bottom: 6pt; color: #1e3a8a; }
          p { margin-bottom: 8pt; font-size: 11pt; }
          ul { margin-bottom: 8pt; margin-left: 20pt; }
          li { font-size: 11pt; margin-bottom: 4pt; }
          strong { font-weight: bold; }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `

    const blob = new Blob(['\ufeff' + docxTemplate], { type: "application/msword;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "readability-content.doc"
    link.click()
    URL.revokeObjectURL(url)
  }

  const diffs = useMemo(() => {
    if (!showDiffModal) return { originalDiff: [], improvedDiff: [] }
    return diffSentences(text, improvedText)
  }, [showDiffModal, text, improvedText])

  const algoDetails = {
    flesch: {
      name: "Flesch Reading Ease",
      desc: "Measures readability based on sentence length and syllable density. Higher scores mean easier reading.",
      detailedDesc: "Best for general web copywriting, blog articles, and consumer-facing content. Flesch Reading Ease is the default standard for SEO optimization because search engines reward content that matches the reading ability of the general public (equivalent to an 8th-grade level or a score of 60-70). Use this algorithm when writing general marketing copy, e-commerce descriptions, and informative articles where maximum accessibility is essential.",
      formula: "206.835 - 1.015 × (Words/Sentences) - 84.6 × (Syllables/Words)",
    },
    gunning: {
      name: "Gunning Fog Index",
      desc: "Estimates the years of formal education needed to understand the text on the first reading.",
      detailedDesc: "Best for business communications, technical documents, and professional reports. The Gunning Fog Index calculates the number of formal education years needed to understand a piece of writing on the first read. High-fog content (scores above 12) is common in scientific papers or legal briefs but should be avoided in general marketing. Use this to ensure your business pitches or technical documents are concise and free of unnecessary jargon.",
      formula: "0.4 × [ (Words/Sentences) + 100 × (Complex Words/Words) ]",
    },
    dale: {
      name: "Dale-Chall Formula",
      desc: "Calculates readability based on a list of familiar words. Better for general vocabulary assessment.",
      detailedDesc: "Best for educational materials, textbooks, and content targeting younger readers or non-native English speakers. Unlike syllable-based formulas, Dale-Chall matches words against a list of 3,000 common words that 80% of 4th-grade students understand. Words not on this list are flagged as 'difficult.' Use this algorithm if you are writing instructions, training manuals, or educational content where vocabulary choice is more critical than sentence length.",
      formula: "0.1579 × (% Difficult Words) + 0.0496 × (Words/Sentences) (+ 3.6365 if difficult > 5%)",
    },
    ari: {
      name: "Automated Readability Index",
      desc: "Uses character and word counts to determine the grade level of the text. Common in technical writing.",
      detailedDesc: "Best for technical manuals, software documentation, and military specifications. ARI is unique because it measures characters per word rather than syllables per word, which is easier and faster for computers to calculate accurately. It provides a precise grade-level score. Use ARI when writing developer guides, API documentations, or technical specifications where character-level complexity is a key factor.",
      formula: "4.71 × (Characters/Words) + 0.5 × (Words/Sentences) - 21.43",
    },
    smog: {
      name: "SMOG Grade (Simple Measure of Gobbledygook)",
      desc: "Measures readability by counting polysyllabic words. Widely used in healthcare and education.",
      detailedDesc: "Best for medical, healthcare, consumer safety, and legal readability checks. SMOG is the gold standard for healthcare documentation because it is highly sensitive to complex vocabulary. It estimates the grade level required to understand the text. Use SMOG when validating patient education materials, terms of service, or general compliance documents.",
      formula: "1.0430 × √[ 30 × (Polysyllable Count / Sentences) ] + 3.1291",
    }
  }

  // Compute linguistic details
  const stats = useMemo(() => {
    const cleanText = text.trim()
    if (!cleanText) {
      return { words: 0, sentences: 0, syllables: 0, characters: 0, readingTimeMin: 0, score: 0 }
    }

    const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0).length || 1
    const wordsList = cleanText.match(/[a-zA-Z0-9'-]+/g) || []
    const words = wordsList.length || 1
    const characters = cleanText.length

    let syllables = 0
    let complexWords = 0
    let difficultWords = 0

    wordsList.forEach(w => {
      const syl = countSyllablesInWord(w)
      syllables += syl
      if (syl >= 3) {
        complexWords++
      }
      if (!isFamiliarWord(w)) {
        difficultWords++
      }
    })

    const asl = words / sentences
    const asw = syllables / words

    let score = 0
    if (selectedAlgo === "flesch") {
      const rawScore = 206.835 - (1.015 * asl) - (84.6 * asw)
      score = Math.max(0, Math.min(100, Math.round(rawScore)))
    } else if (selectedAlgo === "gunning") {
      const rawScore = 0.4 * (asl + 100 * (complexWords / words))
      score = Math.max(0, Math.round(rawScore * 10) / 10)
    } else if (selectedAlgo === "dale") {
      const pctDifficult = (difficultWords / words) * 100
      let rawScore = 0.1579 * pctDifficult + 0.0496 * asl
      if (pctDifficult > 5) {
        rawScore += 3.6365
      }
      score = Math.max(0, Math.round(rawScore * 10) / 10)
    } else if (selectedAlgo === "ari") {
      const ariChars = (cleanText.match(/[a-zA-Z0-9]/g) || []).length || 1
      const rawScore = 4.71 * (ariChars / words) + 0.5 * asl - 21.43
      score = Math.max(1, Math.round(rawScore * 10) / 10)
    } else if (selectedAlgo === "smog") {
      const rawScore = 1.043 * Math.sqrt(30 * (complexWords / sentences)) + 3.1291
      score = Math.max(0, Math.round(rawScore * 10) / 10)
    }

    // Estimated reading time: 200 Words Per Minute
    const readingTimeMin = Math.max(1, Math.round(words / 200))

    return { words, sentences, syllables, characters, readingTimeMin, score }
  }, [text, selectedAlgo])

  // Grade & Assessment Interpretations
  const gradeLevel = useMemo(() => {
    const score = stats.score
    switch (selectedAlgo) {
      case "flesch": {
        if (score >= 90) return { grade: "5th Grade", ease: "Very Easy", desc: "Easy to read for an average 11-year-old student.", color: "text-green-600 dark:text-green-400 bg-green-500/10 dark:bg-green-500/20 border-green-500/20" }
        if (score >= 80) return { grade: "6th Grade", ease: "Easy", desc: "Conversational language, very easy to follow.", color: "text-green-600 dark:text-green-400 bg-green-500/10 dark:bg-green-500/20 border-green-500/20" }
        if (score >= 70) return { grade: "7th Grade", ease: "Fairly Easy", desc: "Standard plain English style, accessible to most readers.", color: "text-green-600 dark:text-green-400 bg-green-500/10 dark:bg-green-500/20 border-green-500/20" }
        if (score >= 60) return { grade: "8th & 9th Grade", ease: "Standard / Plain English", desc: "Ideal readability level for web articles, blogs, and public documentation.", color: "text-primary bg-primary/10 border-primary/20" }
        if (score >= 50) return { grade: "10th to 12th Grade", ease: "Fairly Difficult", desc: "Somewhat complex language, appropriate for high school students.", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" }
        if (score >= 30) return { grade: "College Student", ease: "Difficult", desc: "Dense text containing advanced terminology and long sentences.", color: "text-red-600 dark:text-red-400 bg-red-500/10 dark:bg-red-500/20 border-red-500/20 dark:border-red-500/30" }
        return { grade: "College Graduate", ease: "Very Difficult", desc: "Academic, scientific, or highly professional prose requiring post-graduate reading levels.", color: "text-red-600 dark:text-red-400 bg-red-500/10 dark:bg-red-500/20 border-red-500/20 dark:border-red-500/30" }
      }
      case "gunning": {
        if (score < 6) return { grade: "5th Grade & under", ease: "Very Easy", desc: "Readable for elementary school students.", color: "text-green-600 dark:text-green-400 bg-green-500/10 dark:bg-green-500/20 border-green-500/20" }
        if (score < 8) return { grade: `${Math.round(score)}th Grade`, ease: "Easy", desc: "Conversational plain English.", color: "text-green-600 dark:text-green-400 bg-green-500/10 dark:bg-green-500/20 border-green-500/20" }
        if (score < 10) return { grade: "High School Freshman/Sophomore", ease: "Standard", desc: "Ideal for general public and online articles.", color: "text-primary bg-primary/10 border-primary/20" }
        if (score < 12) return { grade: "High School Junior/Senior", ease: "Fairly Difficult", desc: "Requires high school level reading skills.", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" }
        if (score < 16) return { grade: "College Student", ease: "Difficult", desc: "Academic or professional level text.", color: "text-red-600 dark:text-red-400 bg-red-500/10 dark:bg-red-500/20 border-red-500/20 dark:border-red-500/30" }
        return { grade: "College Graduate", ease: "Very Difficult", desc: "Extremely complex, academic or technical writing.", color: "text-red-600 dark:text-red-400 bg-red-500/10 dark:bg-red-500/20 border-red-500/20 dark:border-red-500/30" }
      }
      case "dale": {
        if (score <= 4.9) return { grade: "4th Grade or lower", ease: "Very Easy", desc: "Easily understood by young children.", color: "text-green-600 dark:text-green-400 bg-green-500/10 dark:bg-green-500/20 border-green-500/20" }
        if (score <= 5.9) return { grade: "5th - 6th Grade", ease: "Easy", desc: "Simple language suitable for pre-teens.", color: "text-green-600 dark:text-green-400 bg-green-500/10 dark:bg-green-500/20 border-green-500/20" }
        if (score <= 6.9) return { grade: "7th - 8th Grade", ease: "Fairly Easy", desc: "Standard plain English, clear and readable.", color: "text-green-600 dark:text-green-400 bg-green-500/10 dark:bg-green-500/20 border-green-500/20" }
        if (score <= 7.9) return { grade: "9th - 10th Grade", ease: "Standard", desc: "A bit more vocabulary diversity, good for general audiences.", color: "text-primary bg-primary/10 border-primary/20" }
        if (score <= 8.9) return { grade: "11th - 12th Grade", ease: "Fairly Difficult", desc: "Contains more complex terminology.", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" }
        if (score <= 9.9) return { grade: "College Student", ease: "Difficult", desc: "Academic and professional vocabulary levels.", color: "text-red-600 dark:text-red-400 bg-red-500/10 dark:bg-red-500/20 border-red-500/20 dark:border-red-500/30" }
        return { grade: "College Graduate", ease: "Very Difficult", desc: "Highly technical or advanced prose.", color: "text-red-600 dark:text-red-400 bg-red-500/10 dark:bg-red-500/20 border-red-500/20 dark:border-red-500/30" }
      }
      case "ari": {
        const rounded = Math.round(score)
        if (rounded <= 1) return { grade: "Kindergarten (Age 5-6)", ease: "Very Easy", desc: "Extremely simple sentences.", color: "text-green-600 dark:text-green-400 bg-green-500/10 dark:bg-green-500/20 border-green-500/20" }
        if (rounded <= 4) return { grade: "1st - 3rd Grade (Age 6-9)", ease: "Easy", desc: "Simple sentences and basic vocabulary.", color: "text-green-600 dark:text-green-400 bg-green-500/10 dark:bg-green-500/20 border-green-500/20" }
        if (rounded <= 6) return { grade: "4th - 5th Grade (Age 9-11)", ease: "Fairly Easy", desc: "Easy conversational prose.", color: "text-green-600 dark:text-green-400 bg-green-500/10 dark:bg-green-500/20 border-green-500/20" }
        if (rounded <= 8) return { grade: "6th - 7th Grade (Age 11-13)", ease: "Standard", desc: "Standard plain English.", color: "text-primary bg-primary/10 border-primary/20" }
        if (rounded <= 10) return { grade: "8th - 9th Grade (Age 13-15)", ease: "Standard", desc: "Ideal for blogs, articles, and public portals.", color: "text-primary bg-primary/10 border-primary/20" }
        if (rounded <= 12) return { grade: "10th - 11th Grade (Age 15-17)", ease: "Fairly Difficult", desc: "Requires high school comprehension.", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" }
        if (rounded === 13) return { grade: "12th Grade (Age 17-18)", ease: "Fairly Difficult", desc: "Advanced high school reading level.", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" }
        return { grade: "College / Graduate (Age 18+)", ease: "Difficult", desc: "Advanced or professional text.", color: "text-red-600 dark:text-red-400 bg-red-500/10 dark:bg-red-500/20 border-red-500/20 dark:border-red-500/30" }
      }
      case "smog": {
        if (score < 6) return { grade: "5th Grade & under", ease: "Very Easy", desc: "Easily readable by young children.", color: "text-green-600 dark:text-green-400 bg-green-500/10 dark:bg-green-500/20 border-green-500/20" }
        if (score < 8) return { grade: `${Math.round(score)}th Grade`, ease: "Easy", desc: "Conversational plain English.", color: "text-green-600 dark:text-green-400 bg-green-500/10 dark:bg-green-500/20 border-green-500/20" }
        if (score < 10) return { grade: "High School Freshman/Sophomore", ease: "Standard", desc: "Ideal for public information.", color: "text-primary bg-primary/10 border-primary/20" }
        if (score < 12) return { grade: "High School Junior/Senior", ease: "Fairly Difficult", desc: "Requires high school reading level.", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" }
        if (score < 16) return { grade: "College Student", ease: "Difficult", desc: "Academic and professional publications.", color: "text-red-600 dark:text-red-400 bg-red-500/10 dark:bg-red-500/20 border-red-500/20 dark:border-red-500/30" }
        return { grade: "College Graduate", ease: "Very Difficult", desc: "Extremely dense academic or technical writing.", color: "text-red-600 dark:text-red-400 bg-red-500/10 dark:bg-red-500/20 border-red-500/20 dark:border-red-500/30" }
      }
      default:
        return { grade: "N/A", ease: "N/A", desc: "", color: "" }
    }
  }, [selectedAlgo, stats.score])

  // Context Recommendations
  const recommendations = useMemo(() => {
    const list: string[] = []
    const asl = stats.words / (stats.sentences || 1)
    
    if (stats.words === 0) return []

    if (asl > 18) {
      list.push("Sentence length is high (avg. " + asl.toFixed(1) + " words). Break up long sentences to improve flow.")
    } else {
      list.push("Excellent average sentence length (" + asl.toFixed(1) + " words). Good for reader retention.")
    }

    const syllablesPerWord = stats.syllables / stats.words
    if (syllablesPerWord > 1.6) {
      list.push("High density of multi-syllable words. Consider replacing complex terms with simpler synonyms.")
    }

    if (stats.score < 60) {
      list.push("Readability is below standard plain English. Try editing passive voice and splitting paragraphs.")
    } else if (stats.score >= 60 && stats.score <= 80) {
      list.push("Your content hits the target web readability sweet spot! Great job.")
    }

    return list
  }, [stats])

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Editor Block */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-card p-5 border rounded-2xl space-y-4 shadow-sm flex flex-col h-full min-h-[400px]">
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
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-xs text-muted-foreground font-bold px-1">
                <span>Scrape Webpage URL</span>
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
            <>
              <div className="flex justify-between items-center text-xs text-muted-foreground font-bold px-1 pt-1">
                <span>Raw Text Content</span>
                <button
                  type="button"
                  onClick={() => {
                    setText("Search engine optimization is the practice of orienting your website to rank higher on a search engine results page, so that you receive more traffic. The difference between organic SEO and paid advertising is that SEO involves organic ranking, which means you do not pay to be in that space. To make it simple, search engine optimization means taking a piece of online content and optimizing it so search engines like Google show it at the top of the page when someone searches for something.")
                  }}
                  className="text-xs font-bold text-primary hover:underline cursor-pointer focus:outline-none"
                >
                  Try an Example
                </button>
              </div>
              <textarea 
                value={text}
                onChange={(e) => {
                  setText(e.target.value)
                  setFormattedText("")
                }}
                rows={14}
                placeholder="Paste or write your content here to analyze readability stats..."
                className="flex-1 w-full px-3 py-2.5 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm leading-relaxed"
              />
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Protected Keywords (AI will not simplify these)</label>
                  <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-bold">Optional</span>
                </div>
                <TagInput tags={protectedKeywords} onChange={setProtectedKeywords} placeholder="Type keyword and press Enter..." />
              </div>
            </>
          )}
          {fetchError && <p className="text-xs text-destructive font-semibold">{fetchError}</p>}
        </div>
      </div>

      {/* Analytics Panel */}
      <div className="lg:col-span-5 space-y-6">
        {/* Score Card */}
        <div className="bg-card p-6 border rounded-2xl shadow-sm text-center space-y-4 relative overflow-hidden">
          <div className="absolute top-3 right-3 text-muted-foreground/30">
            <Award className="h-20 w-20 pointer-events-none" />
          </div>

          <div className="space-y-2 relative z-10">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Readability Algorithm</label>
            <div className="relative inline-block w-full max-w-xs mx-auto">
              <select
                value={selectedAlgo}
                onChange={(e) => {
                  setSelectedAlgo(e.target.value as any)
                  setShowMoreAlgo(false)
                }}
                className="w-full pl-3 pr-10 py-2.5 bg-muted/50 border border-border rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer appearance-none text-foreground"
              >
                <option value="flesch">Flesch Reading Ease</option>
                <option value="gunning">Gunning Fog Index</option>
                <option value="dale">Dale-Chall Readability</option>
                <option value="ari">Automated Readability Index (ARI)</option>
                <option value="smog">SMOG Grade Index</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
            <p className="text-6xl font-black tracking-tight text-foreground pt-1">{stats.score}</p>
          </div>

          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${gradeLevel.color}`}>
            <span>{gradeLevel.ease}</span>
            <span>•</span>
            <span>{gradeLevel.grade}</span>
          </div>

          <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
            {gradeLevel.desc}
          </p>

          {(gradeLevel.ease === "Difficult" || gradeLevel.ease === "Very Difficult") && (
            <div className="pt-4 border-t border-border/50 mt-4 space-y-2.5">
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                This content is hard to read. Use AI to simplify sentences and replace complex vocabulary.
              </p>
              {!isLoggedIn ? (
                <Link
                  href="/register"
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                  Simplify with AI (Costs 2 Credits)
                </Link>
              ) : localCredits !== null && localCredits < 2 ? (
                <Link
                  href="/pricing"
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-amber-500/10 text-amber-650 dark:text-amber-400 hover:bg-amber-500/20 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Out of Credits (Buy More)
                </Link>
              ) : (
                <button
                  onClick={handleImproveReadability}
                  disabled={isImproving || !text.trim()}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm shadow-primary/20"
                >
                  {isImproving ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="h-3.5 w-3.5" />
                  )}
                  {isImproving ? "Rewriting..." : "Simplify with AI (2 Credits)"}
                </button>
              )}
              {improveError && (
                <p className="text-[10px] text-destructive font-semibold mt-1">{improveError}</p>
              )}
              {localCredits !== null && (
                <p className="text-[10px] text-muted-foreground">
                  Available: <span className="font-bold text-foreground">{localCredits} AI Credits</span>
                </p>
              )}
            </div>
          )}

          {/* Download / Export Options (Only shows after AI Simplify is applied) */}
          {formattedText && (
            <div className="pt-4 border-t border-border/50 mt-4 relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm shadow-primary/10"
              >
                <Download className="h-3.5 w-3.5" />
                Download / Export Content
              </button>

              {showExportMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowExportMenu(false)}
                  />
                  <div className="absolute left-0 right-0 bottom-full mb-2 bg-card border border-border rounded-xl shadow-xl z-50 p-1 space-y-1 animate-in slide-in-from-bottom-2 duration-150 text-left">
                    <button
                      onClick={() => {
                        downloadMd()
                        setShowExportMenu(false)
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      <FileText className="h-4 w-4 text-primary" />
                      Download as Markdown (.md)
                    </button>
                    <button
                      onClick={() => {
                        downloadRtf()
                        setShowExportMenu(false)
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      <BookOpen className="h-4 w-4 text-primary" />
                      Download as RTF (.rtf for macOS Pages)
                    </button>
                    <button
                      onClick={() => {
                        downloadDocx()
                        setShowExportMenu(false)
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      <Award className="h-4 w-4 text-primary" />
                      Download as Word (.docx for MS Word)
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Algorithm Explanation Card */}
        <div className="bg-primary/5 border border-primary/10 p-5 rounded-2xl space-y-2.5 shadow-sm text-left">
          <div className="flex items-center gap-2 text-primary">
            <BookOpen className="h-4 w-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">About the Algorithm</h4>
          </div>
          <p className="text-xs font-bold text-foreground">{algoDetails[selectedAlgo].name}</p>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {algoDetails[selectedAlgo].desc}
          </p>

          {showMoreAlgo && (
            <p className="text-[11px] text-muted-foreground leading-relaxed pt-2 border-t border-dashed border-primary/10 animate-in fade-in duration-200">
              {algoDetails[selectedAlgo].detailedDesc}
            </p>
          )}

          <div className="pt-1">
            <button
              onClick={() => setShowMoreAlgo(!showMoreAlgo)}
              className="text-[10px] font-bold text-primary hover:underline cursor-pointer focus:outline-none"
            >
              {showMoreAlgo ? "Show less..." : "Show more..."}
            </button>
          </div>

          <div className="pt-2 border-t border-primary/10">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold block mb-1">Formula</span>
            <code className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-1 rounded-lg block overflow-x-auto whitespace-nowrap">
              {algoDetails[selectedAlgo].formula}
            </code>
          </div>
        </div>

        {/* Linguistic Statistics */}
        <div className="bg-card p-5 border rounded-2xl shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Linguistic Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-muted/20 border border-border/60 rounded-xl">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold block">Words</span>
              <span className="text-xl font-black">{stats.words}</span>
            </div>
            <div className="p-3 bg-muted/20 border border-border/60 rounded-xl">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold block">Sentences</span>
              <span className="text-xl font-black">{stats.sentences}</span>
            </div>
            <div className="p-3 bg-muted/20 border border-border/60 rounded-xl">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold block">Syllables</span>
              <span className="text-xl font-black">{stats.syllables}</span>
            </div>
            <div className="p-3 bg-muted/20 border border-border/60 rounded-xl">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold block">Reading Time</span>
              <span className="text-xl font-black flex items-center gap-1">
                <BookOpen className="h-4 w-4 text-primary" />
                {stats.readingTimeMin} min
              </span>
            </div>
          </div>
        </div>

        {/* Content Grader Recommendations */}
        {recommendations.length > 0 && (
          <div className="bg-card p-5 border rounded-2xl shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">SEO Recommendations</h3>
            <ul className="space-y-2.5">
              {recommendations.map((rec, i) => (
                <li key={i} className="flex gap-2.5 text-xs text-muted-foreground leading-relaxed">
                  {rec.includes("Excellent") || rec.includes("sweet spot") ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  )}
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Info Cards */}
      <div className="lg:col-span-12 grid md:grid-cols-3 gap-6 mt-8">
        <div className="bg-primary/5 border border-primary/10 p-5 rounded-2xl space-y-2">
          <h4 className="text-sm font-bold flex items-center gap-2">
            <span className="h-5 w-5 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><span className="text-[10px] font-black">1</span></span> Simple Sentences
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Keep average sentence lengths under 15 words. Shorter layouts reduce cognitive friction, boosting time-on-page metrics.
          </p>
        </div>
        <div className="bg-primary/5 border border-primary/10 p-5 rounded-2xl space-y-2">
          <h4 className="text-sm font-bold flex items-center gap-2">
            <span className="h-5 w-5 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><span className="text-[10px] font-black">2</span></span> Plain English standard
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Aim for Flesch scores between 60 and 70 (8th/9th grade equivalent). This ensures your text is easily readable by the general public.
          </p>
        </div>
        <div className="bg-primary/5 border border-primary/10 p-5 rounded-2xl space-y-2">
          <h4 className="text-sm font-bold flex items-center gap-2">
            <span className="h-5 w-5 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><span className="text-[10px] font-black">3</span></span> Reading retention
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Highly readable content leads to improved search ranking factors by reducing bounce rates and encouraging user click-through interactions.
          </p>
        </div>
      </div>

      {/* SEO Section */}
      <div className="lg:col-span-12 border-t border-border pt-12 space-y-12">
        <div className="grid md:grid-cols-2 gap-12">
          <section>
            <h2 className="text-2xl font-black tracking-tight mb-4">Readability Formulas & Search Engine Optimization</h2>
            <p className="text-muted-foreground leading-relaxed">
              Readability represents a critical component of search engine optimization. Search engine crawlers evaluate user engagement indicators such as dwell time, click-through rates, and bounce rates. When a visitor lands on page content that is easy to comprehend, they stay longer and browse further, signaling high-quality content to search algorithms.
            </p>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              Our analyzer helps you evaluate your text using four industry-standard formulas, ensuring your writing is perfectly tailored to your target audience.
            </p>
          </section>
          
          <section className="bg-muted/30 p-8 rounded-3xl border border-border">
            <h3 className="text-xl font-black tracking-tight mb-6">Readability Best Practices</h3>
            <ul className="space-y-4 list-none p-0">
              {[
                { title: "Target Plain Language", desc: "Focus writing styles to achieve Flesch Reading Ease scores over 60, catering to mainstream web demographics." },
                { title: "Trim Sentence Lengths", desc: "Sentences spanning over 25 words confuse readers. Break long paragraphs into shorter separate thoughts." },
                { title: "Limit Multi-Syllabic Terms", desc: "Minimize complex jargon. Use simple words (e.g. 'use' instead of 'utilize') to reach a wider target audience." },
                { title: "Organize with Subheadings", desc: "Break sections into digestible parts under H2/H3 headers. Scan-friendliness improves reading flow." },
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

        {/* Deep Dive into Readability Algorithms */}
        <section className="space-y-6">
          <h3 className="text-2xl font-black tracking-tight text-foreground text-center">Supported Readability Algorithms</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                name: "Flesch Reading Ease",
                formula: "206.835 - 1.015 × ASL - 84.6 × ASW",
                useCase: "Best for: general web copywriting, blog articles, and public-facing content.",
                desc: "The global benchmark for general readability. It rates text on a 100-point scale. The higher the score, the easier it is to read. Web standards recommend target scores between 60 and 70 (8th-9th grade level)."
              },
              {
                name: "Gunning Fog Index",
                formula: "0.4 × [ ASL + 100 × (Complex Words / Words) ]",
                useCase: "Best for: corporate communications, research documents, and whitepapers.",
                desc: "Estimates the number of formal education years required to understand the text. A score of 12 represents high school senior level, while scores above 16 indicate graduate school complexity. Lower scores ensure accessibility."
              },
              {
                name: "Dale-Chall Readability",
                formula: "0.1579 × (% Difficult Words) + 0.0496 × ASL",
                useCase: "Best for: children's literature, textbooks, and non-native English instruction.",
                desc: "Uses a pre-compiled dictionary of 3,000 familiar English words. Content containing words outside this list gets penalized, making this formula extremely reliable for assessing vocabulary complexity rather than just syllables."
              },
              {
                name: "Automated Readability Index (ARI)",
                formula: "4.71 × (Characters / Words) + 0.5 × ASL - 21.43",
                useCase: "Best for: technical specs, manuals, and software guides.",
                desc: "Calculates character count per word rather than syllable count, which provides a highly sensitive grade-level output. Very common in technical documentation writing tools."
              },
              {
                name: "SMOG Grade (Simple Measure of Gobbledygook)",
                formula: "1.0430 × √[ 30 × (Polysyllable Count / Sentences) ] + 3.1291",
                useCase: "Best for: medical, healthcare, consumer safety, and legal readability checks.",
                desc: "Measures readability by counting polysyllabic words. Widely considered the gold standard for healthcare documentation due to its focus on word complexity and accuracy."
              }
            ].map((algo, i) => (
              <div key={i} className="bg-card border border-border p-6 rounded-2xl space-y-4 shadow-sm flex flex-col justify-between">
                <div className="space-y-2">
                  <h4 className="text-base font-black text-foreground">{algo.name}</h4>
                  <p className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-md inline-block">{algo.useCase}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{algo.desc}</p>
                </div>
                <div className="pt-3 border-t border-border">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground block mb-1">Formula</span>
                  <code className="text-[9px] font-mono text-foreground bg-muted/65 p-1.5 rounded block overflow-x-auto whitespace-nowrap">{algo.formula}</code>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Diff Preview Modal */}
      {showDiffModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-md animate-in fade-in duration-205"
            onClick={() => setShowDiffModal(false)}
          />
          <div className="relative w-full max-w-5xl h-[85vh] flex flex-col rounded-3xl border bg-card shadow-2xl animate-in zoom-in-95 duration-205 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h3 className="text-lg font-black tracking-tight">Compare Readability Improvement</h3>
                <p className="text-xs text-muted-foreground">Review simplified changes before applying to your document.</p>
              </div>
              <button
                onClick={() => setShowDiffModal(false)}
                className="h-8 w-8 rounded-full flex items-center justify-center border border-border hover:bg-muted transition-colors cursor-pointer"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Split Content */}
            <div className="flex-1 overflow-y-auto p-6 grid md:grid-cols-2 gap-6 min-h-0 bg-muted/10">
              {/* Original Left Pane */}
              <div className="flex flex-col h-full bg-card border border-border rounded-2xl p-5 overflow-hidden">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex justify-between">
                  <span>Original Text</span>
                  <span className="text-red-500 font-bold bg-red-500/10 px-2 py-0.5 rounded-md text-[10px]">Complex Text</span>
                </div>
                <div className="flex-1 overflow-y-auto text-sm leading-relaxed whitespace-pre-wrap pr-2">
                  {diffs.originalDiff.map((block, idx) => (
                    <span
                      key={idx}
                      className={
                        block.type === 'removed'
                          ? 'bg-red-500/15 text-red-700 dark:text-red-400 border-b border-red-500/20 px-0.5 rounded'
                          : ''
                      }
                    >
                      {stripMarkdown(block.text)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Improved Right Pane */}
              <div className="flex flex-col h-full bg-card border border-border rounded-2xl p-5 overflow-hidden">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex justify-between">
                  <span>AI Simplified Draft</span>
                  <span className="text-green-500 font-bold bg-green-500/10 px-2 py-0.5 rounded-md text-[10px]">Easy to Read</span>
                </div>
                <div className="flex-1 overflow-y-auto text-sm leading-relaxed whitespace-pre-wrap pr-2">
                  {diffs.improvedDiff.map((block, idx) => (
                    <span
                      key={idx}
                      className={
                        block.type === 'added'
                          ? 'bg-green-500/15 text-green-700 dark:text-green-400 border-b border-green-500/20 px-0.5 rounded'
                          : ''
                      }
                    >
                      {stripMarkdown(block.text)}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-border bg-card flex justify-end gap-3 shrink-0">
              <button
                onClick={() => setShowDiffModal(false)}
                className="px-4 py-2 border border-border hover:bg-muted text-sm font-bold rounded-xl transition-colors cursor-pointer"
              >
                Discard Draft
              </button>
              <button
                onClick={() => {
                  setFormattedText(improvedText)
                  setText(stripMarkdown(improvedText))
                  setShowDiffModal(false)
                }}
                className="px-5 py-2 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Check className="h-4 w-4" />
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
