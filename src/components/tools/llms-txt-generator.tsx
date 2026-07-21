"use client"

import React, { useState, useEffect } from "react"
import { Cpu, Copy, Check, Download, Sparkles, HelpCircle, FileText, Globe, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Link from "next/link"

export function LlmsTxtGenerator({ 
  isPro = false,
  creditsRemaining = null,
  isLoggedIn = false
}: { 
  isPro?: boolean
  creditsRemaining?: number | null
  isLoggedIn?: boolean
}) {
  const [localCredits, setLocalCredits] = useState<number | null>(creditsRemaining)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalCredits(creditsRemaining)
  }, [creditsRemaining])

  const limitReached = isLoggedIn 
    ? (localCredits !== null && localCredits < 3) 
    : false

  const [formData, setFormData] = useState({
    sitemapUrl: "",
    websiteUrl: "",
    specificUrls: ""
  })

  const [output, setOutput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setOutput("")

    try {
      const res = await fetch("/api/ai/llms-txt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (res.ok && res.body) {
        setLocalCredits(prev => (prev !== null ? Math.max(0, prev - 3) : null))
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          setOutput(prev => prev + chunk)
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const downloadFile = () => {
    const blob = new Blob([output], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "llms.txt"
    a.click()
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle className="text-lg">Site Details</CardTitle>
            <CardDescription>Tell us about your website for AI optimization</CardDescription>
          </CardHeader>
          <CardContent>
            {!isLoggedIn ? (
              <div className="text-center flex flex-col items-center justify-center min-h-[300px] gap-6 py-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                </div>
                <div className="max-w-sm space-y-2">
                  <h3 className="font-bold text-base">Authentication Required</h3>
                  <p className="text-xs text-muted-foreground">Sign in to generate optimization files for search engines and AI crawlers.</p>
                </div>
                <div className="flex w-full gap-4 max-w-sm">
                  <Button className="flex-1 font-bold h-9 text-xs" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button variant="outline" className="flex-1 font-bold h-9 text-xs" asChild>
                    <Link href="/register">Sign Up</Link>
                  </Button>
                </div>
              </div>

            ) : (
              <form onSubmit={handleGenerate} className="space-y-4">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="font-bold">Sitemap URL</Label>
                    <p className="text-xs text-muted-foreground">Best for large sites: point to your sitemap.xml and we&apos;ll crawl all listed pages.</p>
                    <Input 
                      placeholder="https://example.com/sitemap.xml" 
                      value={formData.sitemapUrl}
                      onChange={(e) => setFormData({...formData, sitemapUrl: e.target.value, websiteUrl: "", specificUrls: ""})}
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground font-bold">OR</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-bold">Website URL</Label>
                    <p className="text-xs text-muted-foreground">We&apos;ll scan your homepage and follow internal links automatically.</p>
                    <Input 
                      placeholder="https://example.com" 
                      value={formData.websiteUrl}
                      onChange={(e) => setFormData({...formData, websiteUrl: e.target.value, sitemapUrl: "", specificUrls: ""})}
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground font-bold">OR</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-bold">Paste specific URLs</Label>
                    <p className="text-xs text-muted-foreground">One URL per line, useful when you only want specific pages included.</p>
                    <Textarea 
                      placeholder="https://example.com/page1&#10;https://example.com/page2"
                      rows={5}
                      value={formData.specificUrls}
                      onChange={(e) => setFormData({...formData, specificUrls: e.target.value, sitemapUrl: "", websiteUrl: ""})}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 gap-2 mt-4 font-bold rounded-xl shadow-lg shadow-primary/20" disabled={isLoading || limitReached || (!formData.sitemapUrl && !formData.websiteUrl && !formData.specificUrls)}>
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Crawling & Generating...
                    </span>
                  ) : limitReached ? (
                    "Out of Credits"
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate llms.txt
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
                    Costs 3 credits ({localCredits ?? 0} remaining)
                  </p>
                )}
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="h-full border-primary/10 flex flex-col relative overflow-hidden bg-muted/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-sm">Live Preview</CardTitle>
              <CardDescription className="text-xs">llms.txt output format</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={copyToClipboard} disabled={!output} className="h-8 gap-2 text-xs font-bold">
                {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                Copy
              </Button>
              <Button variant="ghost" size="sm" onClick={downloadFile} disabled={!output} className="h-8 gap-2 text-xs font-bold">
                <Download className="h-3 w-3" />
                Download
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className={cn(
              "flex-1 min-h-[500px] p-6 font-mono text-[13px] bg-background border border-border/50 rounded-xl whitespace-pre-wrap leading-relaxed shadow-inner",
              !output && "flex items-center justify-center text-muted-foreground italic"
            )}>
              {output || "Your generated llms.txt will appear here..."}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SEO & Educational Sections */}
      <div className="md:col-span-2 grid md:grid-cols-3 gap-8 mt-12 border-t pt-12">
        <div className="space-y-4">
          <div className="bg-primary/10 p-3 w-fit rounded-2xl">
            <HelpCircle className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold">What is llms.txt?</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            llms.txt is a new standard for website descriptions optimized specifically for Large Language Models (LLMs). It helps AI agents, crawlers, and assistants understand your site structure, documentation, and core purpose efficiently.
          </p>
        </div>
        <div className="space-y-4">
          <div className="bg-primary/10 p-3 w-fit rounded-2xl">
            <Globe className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold">Why AI SEO matters?</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            As more users search via AI assistants (Perplexity, ChatGPT, Gemini), traditional SEO is evolving. Providing a machine-readable summary ensures your brand is represented accurately in AI-generated answers.
          </p>
        </div>
        <div className="space-y-4">
          <div className="bg-primary/10 p-3 w-fit rounded-2xl">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold">How to use it?</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Simply host the generated file at <code className="text-primary font-bold">/llms.txt</code> in your website&apos;s root directory. This acts as a &quot;robots.txt&quot; for AI models, guiding them to your most important content.
          </p>
        </div>
      </div>
    </div>
  )
}
