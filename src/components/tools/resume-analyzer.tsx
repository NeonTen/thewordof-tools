"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, CheckCircle2, XCircle, RefreshCw, Download } from "lucide-react"
import Link from "next/link"
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts"
import { ResumeUploader } from "./resume-uploader"

type AnalyzerResult = {
  score: number
  strengths: string[]
  weaknesses: string[]
  feedback: string
}

export function ResumeAnalyzer({ 
  creditsRemaining = null, 
  isLoggedIn = false 
}: { 
  creditsRemaining?: number | null
  isLoggedIn?: boolean 
}) {
  const [resumeText, setResumeText] = useState("")
  const [result, setResult] = useState<AnalyzerResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showScore, setShowScore] = useState(false)
  const [isFixing, setIsFixing] = useState(false)
  const [hasImproved, setHasImproved] = useState(false)
  const [fixedResume, setFixedResume] = useState("")
  const [localCredits, setLocalCredits] = useState<number | null>(creditsRemaining ?? null)

  useEffect(() => {
    setLocalCredits(creditsRemaining ?? null)
  }, [creditsRemaining])

  const limitReached = isLoggedIn ? (localCredits !== null && localCredits <= 0) : false
  const fixLimitReached = isLoggedIn ? (localCredits !== null && localCredits < 2) : false

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)
    setShowScore(false)
    setFixedResume("")
    
    try {
      const res = await fetch("/api/ai/resume-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText })
      })
      if (res.ok) {
        const data = await res.json()
        setResult(data)
        if (localCredits !== null) {
          setLocalCredits(prev => (prev !== null ? prev - 1 : null))
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleFixResume = async () => {
    setIsFixing(true)
    setFixedResume("")
    try {
      const res = await fetch("/api/ai/resume-improver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText })
      })
      if (res.ok && res.body) {
        if (localCredits !== null) {
          setLocalCredits(prev => (prev !== null ? prev - 2 : null))
        }
        setHasImproved(true)
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
    a.download = "Optimized_Resume.md"
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
            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle className="text-sm">Your Resume</CardTitle>
                <CardDescription>Paste your full resume text below to get an AI-powered critique and score.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ResumeUploader onUpload={(text) => setResumeText(text)} />
                <Textarea 
                  value={resumeText} 
                  onChange={e => setResumeText(e.target.value)} 
                  required 
                  placeholder="Paste your resume text here (experience, skills, education)..." 
                  className="h-96 resize-none overflow-y-auto"
                />
              </CardContent>
            </Card>

            <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
              <Button type="submit" className="w-full h-12 gap-2 font-bold rounded-xl shadow-lg shadow-primary/20" disabled={isLoading || limitReached || !resumeText}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Analyzing Resume...
                  </span>
                ) : limitReached ? (
                  "Out of Credits"
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Analyze Resume
                  </>
                )}
              </Button>
              {!limitReached && (
                <p className="text-[10px] text-muted-foreground font-semibold mt-2">
                  Costs 1 credit ({localCredits ?? 0} remaining)
                </p>
              )}
            </div>
          </form>

          {result && !showScore && (
            <div className="flex justify-center mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Button size="lg" className="h-16 px-12 text-lg font-black tracking-tight rounded-2xl" onClick={() => setShowScore(true)}>
                Reveal My Resume Score
              </Button>
            </div>
          )}

          {result && showScore && (
            <div className="grid lg:grid-cols-2 gap-8 mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <Card className="border-primary/10 flex flex-col items-center justify-center p-8">
                <h3 className="text-xl font-black tracking-tight mb-4">Overall Resume Score</h3>
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
                    disabled={isFixing || fixLimitReached || hasImproved}
                  >
                    {isFixing ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Improving Resume...
                      </span>
                    ) : hasImproved ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Resume Improved!
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4" />
                        Improve Resume Automatically (2 Credits)
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
                      Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {result.strengths.length > 0 ? result.strengths.map((kw, i) => (
                        <span key={i} className="px-3 py-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-xs font-bold rounded-full border border-green-200 dark:border-green-500/30">
                          {kw}
                        </span>
                      )) : <p className="text-xs text-muted-foreground">No prominent strengths found.</p>}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-500/20 bg-red-500/5">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2 text-red-600 dark:text-red-500">
                      <XCircle className="h-5 w-5" />
                      Areas for Improvement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {result.weaknesses.length > 0 ? result.weaknesses.map((kw, i) => (
                        <span key={i} className="px-3 py-1 bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 text-xs font-bold rounded-full border border-red-200 dark:border-red-500/30">
                          {kw}
                        </span>
                      )) : <p className="text-xs text-muted-foreground">No obvious weaknesses! Great job.</p>}
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
                  <CardTitle>Improved Resume</CardTitle>
                  <CardDescription>Your rewritten resume with stronger action verbs and optimized formatting.</CardDescription>
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
                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground bg-muted/30 p-4 rounded-xl">
                  <p>
                    Want this in a different format? Use our{" "}
                    <Link href="/tools/document-tools/doc-converter" className="font-semibold text-primary hover:underline">
                      Document Converter
                    </Link>{" "}
                    to easily convert this downloaded .md file into a beautifully formatted .docx or .pdf!
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
