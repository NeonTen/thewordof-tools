"use client"

import { useState, useMemo } from "react"
import { Type, AlertCircle, CheckCircle2, Award, BookOpen } from "lucide-react"

// Simple syllable counter algorithm
function countSyllablesInWord(word: string): number {
  const cleanWord = word.toLowerCase().replace(/[^a-z]/g, "")
  if (cleanWord.length <= 3) return 1
  
  // Remove quiet trailing 'e', 'es', 'ed'
  const suffixCleaned = cleanWord.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "")
  const doubleVowelsMatch = suffixCleaned.replace(/^y/, "").match(/[aeiouy]{1,2}/g)
  
  return doubleVowelsMatch ? Math.max(1, doubleVowelsMatch.length) : 1
}

export function ReadabilityGrader() {
  const [text, setText] = useState("Search engine optimization is the practice of orienting your website to rank higher on a search engine results page, so that you receive more traffic. The difference between organic SEO and paid advertising is that SEO involves organic ranking, which means you do not pay to be in that space. To make it simple, search engine optimization means taking a piece of online content and optimizing it so search engines like Google show it at the top of the page when someone searches for something.")

  // Compute linguistic details
  const stats = useMemo(() => {
    const cleanText = text.trim()
    if (!cleanText) {
      return { words: 0, sentences: 0, syllables: 0, characters: 0, readingTimeMin: 0, score: 0 }
    }

    const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0).length || 1
    const wordsList = cleanText.match(/[a-zA-Z]+/g) || []
    const words = wordsList.length || 1
    const characters = cleanText.length

    let syllables = 0
    wordsList.forEach(w => {
      syllables += countSyllablesInWord(w)
    })

    // Flesch Reading Ease Formula
    // 206.835 - (1.015 * ASL) - (84.6 * ASW)
    const asl = words / sentences
    const asw = syllables / words
    const rawScore = 206.835 - (1.015 * asl) - (84.6 * asw)
    const score = Math.max(0, Math.min(100, Math.round(rawScore)))

    // Estimated reading time: 200 Words Per Minute
    const readingTimeMin = Math.max(1, Math.round(words / 200))

    return { words, sentences, syllables, characters, readingTimeMin, score }
  }, [text])

  // Grade & Assessment Interpretations
  const gradeLevel = useMemo(() => {
    const score = stats.score
    if (score >= 90) return { grade: "5th Grade", ease: "Very Easy", desc: "Easy to read for an average 11-year-old student.", color: "text-green-500 bg-green-500/10 border-green-500/20" }
    if (score >= 80) return { grade: "6th Grade", ease: "Easy", desc: "Conversational language, very easy to follow.", color: "text-green-500 bg-green-500/10 border-green-500/20" }
    if (score >= 70) return { grade: "7th Grade", ease: "Fairly Easy", desc: "Standard plain English style, accessible to most readers.", color: "text-green-400 bg-green-500/5 border-green-400/20" }
    if (score >= 60) return { grade: "8th & 9th Grade", ease: "Standard / Plain English", desc: "Ideal readability level for web articles, blogs, and public documentation.", color: "text-primary bg-primary/10 border-primary/20" }
    if (score >= 50) return { grade: "10th to 12th Grade", ease: "Fairly Difficult", desc: "Somewhat complex language, appropriate for high school students.", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" }
    if (score >= 30) return { grade: "College Student", ease: "Difficult", desc: "Dense text containing advanced terminology and long sentences.", color: "text-destructive bg-destructive/10 border-destructive/20" }
    return { grade: "College Graduate", ease: "Very Difficult", desc: "Academic, scientific, or highly professional prose requiring post-graduate reading levels.", color: "text-destructive bg-destructive/10 border-destructive/20" }
  }, [stats.score])

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
          <h2 className="text-lg font-bold">Content Editor</h2>
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={14}
            placeholder="Paste or write your content here to analyze readability stats..."
            className="flex-1 w-full px-3 py-2.5 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm leading-relaxed"
          />
        </div>
      </div>

      {/* Analytics Panel */}
      <div className="lg:col-span-5 space-y-6">
        {/* Score Card */}
        <div className="bg-card p-6 border rounded-2xl shadow-sm text-center space-y-4 relative overflow-hidden">
          <div className="absolute top-3 right-3 text-muted-foreground/30">
            <Award className="h-20 w-20 pointer-events-none" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Readability Score</h3>
            <p className="text-6xl font-black tracking-tight text-foreground">{stats.score}</p>
          </div>

          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${gradeLevel.color}`}>
            <span>{gradeLevel.ease}</span>
            <span>•</span>
            <span>{gradeLevel.grade}</span>
          </div>

          <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
            {gradeLevel.desc}
          </p>
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
      <div className="lg:col-span-12 grid md:grid-cols-2 gap-12 mt-16 border-t border-border pt-12 pb-20">
        <section>
          <h2 className="text-2xl font-black tracking-tight mb-4">The Impact of Readability on SEO Rankings</h2>
          <p className="text-muted-foreground leading-relaxed">
            While readability is not a direct ranking algorithm signal, search engines heavily measure user engagement metrics. Content that is easy to scan, read, and digest leads to longer user sessions and lower search return bounce rates.
          </p>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            Formatting text using simple terms, dividing arguments with descriptive headers, and breaking up complex sentences helps both human visitors and indexing crawler engines catalog pages effectively.
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
    </div>
  )
}
