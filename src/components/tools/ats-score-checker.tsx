"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles } from "lucide-react"
import ReactMarkdown from "react-markdown"
import Link from "next/link"

export function AtsScoreChecker({ 
  creditsRemaining = null, 
  isLoggedIn = false 
}: { 
  creditsRemaining?: number | null
  isLoggedIn?: boolean 
}) {
  const [resumeText, setResumeText] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [output, setOutput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const limitReached = isLoggedIn ? (creditsRemaining !== null && creditsRemaining <= 0) : false

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setOutput("")
    
    try {
      const res = await fetch("/api/ai/ats-score-checker", {
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
          setOutput(prev => prev + decoder.decode(value, { stream: true }))
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle>Input Details</CardTitle>
            <CardDescription>Paste the Job Description and your Resume text to check the match.</CardDescription>
          </CardHeader>
          <CardContent>
            {!isLoggedIn ? (
              <div className="text-center flex flex-col items-center justify-center min-h-[300px] gap-6 py-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                </div>
                <div className="space-y-2 max-w-xs">
                  <h3 className="font-bold text-base">AI Tool Requires Account</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    AI utilities require a free account to track monthly credit allocations. Register today to claim free monthly AI credits!
                  </p>
                </div>
                <div className="flex gap-3 w-full">
                  <Button className="flex-1 font-bold h-9 text-xs" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button variant="outline" className="flex-1 font-bold h-9 text-xs" asChild>
                    <Link href="/register">Sign Up</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleGenerate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Job Description</label>
                  <Textarea 
                    rows={6} 
                    value={jobDescription} 
                    onChange={e => setJobDescription(e.target.value)} 
                    required 
                    placeholder="Paste the target job description here..." 
                    className="resize-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold">Your Resume</label>
                  <Textarea 
                    rows={8} 
                    value={resumeText} 
                    onChange={e => setResumeText(e.target.value)} 
                    required 
                    placeholder="Paste your resume text here..." 
                    className="resize-none"
                  />
                </div>
                
                <Button type="submit" className="w-full h-12 gap-2 mt-4 font-bold rounded-xl shadow-lg shadow-primary/20" disabled={isLoading || limitReached || !resumeText || !jobDescription}>
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Checking Score...
                    </span>
                  ) : limitReached ? (
                    "Out of Credits"
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Check ATS Score
                    </>
                  )}
                </Button>
                
                {limitReached && (
                  <p className="text-[10px] text-center text-destructive font-bold mt-2">
                    You have exhausted your credit balance. <Link href="/pricing" className="text-primary hover:underline">Upgrade to Pro &rarr;</Link>
                  </p>
                )}
                {!limitReached && (
                  <p className="text-[10px] text-center text-muted-foreground font-semibold mt-2">
                    Costs 1 credit ({creditsRemaining ?? 0} remaining)
                  </p>
                )}
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="h-full border-primary/10 flex flex-col relative overflow-hidden bg-muted/20">
          <CardHeader>
            <CardTitle className="text-sm">ATS Analysis</CardTitle>
            <CardDescription className="text-xs">Match score and missing keywords</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className={`flex-1 min-h-[500px] p-6 text-[14px] bg-background border border-border/50 rounded-xl leading-relaxed shadow-inner overflow-auto ${!output ? 'flex items-center justify-center text-muted-foreground italic' : ''}`}>
              {output ? (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{output}</ReactMarkdown>
                </div>
              ) : (
                "Your ATS score analysis will appear here..."
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
