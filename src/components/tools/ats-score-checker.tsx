"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, CheckCircle2, XCircle, RefreshCw, Download } from "lucide-react"
import Link from "next/link"
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts"

type AtsResult = {
  score: number
  matchedKeywords: string[]
  missingKeywords: string[]
  feedback: string
}

export function AtsScoreChecker({
  creditsRemaining = null,
  isLoggedIn = false
}: {
  creditsRemaining?: number | null
  isLoggedIn?: boolean
}) {
  const [resumeText, setResumeText] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [result, setResult] = useState<AtsResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showScore, setShowScore] = useState(false)
  const [isFixing, setIsFixing] = useState(false)
  const [fixedResume, setFixedResume] = useState("")

  const limitReached = isLoggedIn ? (creditsRemaining !== null && creditsRemaining <= 0) : false
  const fixLimitReached = isLoggedIn ? (creditsRemaining !== null && creditsRemaining < 2) : false

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)
    setShowScore(false)
    setFixedResume("")

    try {
      const res = await fetch("/api/ai/ats-score-checker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription })
      })
      if (res.ok) {
        const data = await res.json()
        setResult(data)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleFixResume = async () => {
    setIsFixing(true)
    setFixedResume("")
    try {
      const res = await fetch("/api/ai/resume-fixer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription })
      })
      if (res.ok && res.body) {
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          setFixedResume(prev => prev + decoder.decode(value, { stream: true }))
        }
      }
    } finally {
      setIsFixing(false)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([fixedResume], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "ATS_Optimized_Resume.md"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const chartData = result ? [
    { name: "Score", value: result.score, color: result.score >= 80 ? "#22c55e" : result.score >= 50 ? "#eab308" : "#ef4444" },
    { name: "Missing", value: 100 - result.score, color: "hsl(var(--muted))" }
  ] : []

  return (
    <div className="space-y-8">
      {!isLoggedIn ? (
        <Card className="border-primary/10">
          <CardContent className="text-center flex flex-col items-center justify-center min-h-[300px] gap-6 py-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            </div>
            <div className="space-y-2 max-w-xs">
              <h3 className="font-bold text-base">AI Tool Requires Account</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                AI utilities require a free account to track monthly credit allocations.
              </p>
            </div>
            <div className="flex gap-3 w-full max-w-xs">
              <Button className="flex-1 font-bold h-9 text-xs" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button variant="outline" className="flex-1 font-bold h-9 text-xs" asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-primary/10">
                <CardHeader>
                  <CardTitle className="text-sm">Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={jobDescription}
                    onChange={e => setJobDescription(e.target.value)}
                    required
                    placeholder="Paste the target job description here..."
                    className="h-80 resize-none overflow-y-auto"
                  />
                </CardContent>
              </Card>

              <Card className="border-primary/10">
                <CardHeader>
                  <CardTitle className="text-sm">Your Resume</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={resumeText}
                    onChange={e => setResumeText(e.target.value)}
                    required
                    placeholder="Paste your resume text here..."
                    className="h-80 resize-none overflow-y-auto"
                  />
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
              <Button type="submit" className="w-full h-12 gap-2 font-bold rounded-xl shadow-lg shadow-primary/20" disabled={isLoading || limitReached || !resumeText || !jobDescription}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Analyzing Data...
                  </span>
                ) : limitReached ? (
                  "Out of Credits"
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Analyze ATS Match
                  </>
                )}
              </Button>
              {!limitReached && (
                <p className="text-[10px] text-muted-foreground font-semibold mt-2">
                  Costs 1 credit ({creditsRemaining ?? 0} remaining)
                </p>
              )}
            </div>
          </form>

          {result && !showScore && (
            <div className="flex justify-center mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Button size="lg" className="h-16 px-12 text-lg font-black tracking-tight rounded-2xl" onClick={() => setShowScore(true)}>
                Reveal My ATS Score
              </Button>
            </div>
          )}

          {result && showScore && (
            <div className="grid lg:grid-cols-2 gap-8 mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <Card className="border-primary/10 flex flex-col items-center justify-center p-8">
                <h3 className="text-xl font-black tracking-tight mb-4">Your ATS Match Score</h3>
                <div className="w-64 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={110}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        stroke="none"
                        animationDuration={1500}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                        <Label
                          value={`${result.score}%`}
                          position="center"
                          fill="currentColor"
                          className="text-4xl font-black tracking-tighter"
                        />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-center text-sm text-muted-foreground mt-4">
                  {result.feedback}
                </p>

                <div className="mt-8 w-full">
                  <Button
                    variant="default"
                    className="w-full h-12 gap-2 font-bold"
                    onClick={handleFixResume}
                    disabled={isFixing || fixLimitReached}
                  >
                    {isFixing ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Improving Resume...
                      </span>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4" />
                        Improve Resume to Boost Score (2 Credits)
                      </>
                    )}
                  </Button>
                </div>
              </Card>

              <div className="space-y-6">
                <Card className="border-green-500/20 bg-green-500/5">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2 text-green-600 dark:text-green-500">
                      <CheckCircle2 className="h-5 w-5" />
                      Matched Keywords
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {result.matchedKeywords.length > 0 ? result.matchedKeywords.map((kw, i) => (
                        <span key={i} className="px-3 py-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-xs font-bold rounded-full border border-green-200 dark:border-green-500/30">
                          {kw}
                        </span>
                      )) : <p className="text-xs text-muted-foreground">No matching keywords found.</p>}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-500/20 bg-red-500/5">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2 text-red-600 dark:text-red-500">
                      <XCircle className="h-5 w-5" />
                      Missing Keywords
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {result.missingKeywords.length > 0 ? result.missingKeywords.map((kw, i) => (
                        <span key={i} className="px-3 py-1 bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 text-xs font-bold rounded-full border border-red-200 dark:border-red-500/30">
                          {kw}
                        </span>
                      )) : <p className="text-xs text-muted-foreground">No missing keywords! Perfect match.</p>}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {fixedResume && (
            <Card className="mt-12 border-primary/20 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Improved Resume (ATS Optimized)</CardTitle>
                  <CardDescription>Your rewritten resume naturally incorporates the missing keywords.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2 shrink-0">
                  <Download className="h-4 w-4" />
                  Download .md
                </Button>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={fixedResume}
                  readOnly
                  className="h-96 resize-none font-mono text-sm"
                />
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
