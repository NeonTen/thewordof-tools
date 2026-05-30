"use client"

import React, { useState, useEffect } from "react"
import { Loader2, Copy, Check, Search, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface SeoResult {
  title: string
  description: string
  keywords: string[]
}

export function SeoGenerator({ 
  isPro = false,
  creditsRemaining = null,
  isLoggedIn = false
}: { 
  isPro?: boolean
  creditsRemaining?: number | null
  isLoggedIn?: boolean
}) {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<SeoResult | null>(null)
  const [localCredits, setLocalCredits] = useState<number | null>(creditsRemaining)

  useEffect(() => {
    setLocalCredits(creditsRemaining)
  }, [creditsRemaining])

  const limitReached = isLoggedIn 
    ? (localCredits !== null && localCredits <= 0) 
    : false
  
  const [formData, setFormData] = useState({
    keyword: "",
    audience: "",
    pageType: "Blog Post",
    tone: "Professional"
  })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)
    
    try {
      const res = await fetch("/api/ai/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        setLocalCredits(prev => (prev !== null ? Math.max(0, prev - 1) : null))
        const data = await res.json()
        setResult(data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  return (<>
    <div className="grid lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>SEO Parameters</CardTitle>
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
                  AI utilities require a free account to track monthly credit allocations. Register today to claim 20 free monthly AI credits!
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
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Primary Keyword *</Label>
                <Input 
                  placeholder="e.g. Best wireless earbuds 2024" 
                  required
                  value={formData.keyword} 
                  onChange={e => setFormData({...formData, keyword: e.target.value})} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Page Type</Label>
                  <Select value={formData.pageType} onValueChange={v => setFormData({...formData, pageType: v || "Blog Post"})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Blog Post">Blog Post</SelectItem>
                      <SelectItem value="Landing Page">Landing Page</SelectItem>
                      <SelectItem value="Product Page">Product Page</SelectItem>
                      <SelectItem value="Service Page">Service Page</SelectItem>
                      <SelectItem value="About Page">About Page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tone</Label>
                  <Select value={formData.tone} onValueChange={v => setFormData({...formData, tone: v || "Professional"})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Professional">Professional</SelectItem>
                      <SelectItem value="Persuasive">Persuasive</SelectItem>
                      <SelectItem value="Informative">Informative</SelectItem>
                      <SelectItem value="Exciting">Exciting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Target Audience</Label>
                <Input 
                  placeholder="e.g. Audiophiles, Tech enthusiasts" 
                  value={formData.audience} 
                  onChange={e => setFormData({...formData, audience: e.target.value})} 
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading || !formData.keyword || limitReached}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Search className="mr-2 h-4 w-4" />
                )}
                {isLoading ? "Analyzing..." : limitReached ? "Out of Credits" : "Generate SEO Meta"}
              </Button>
              {limitReached && (
                <p className="text-[10px] text-center text-destructive font-bold">
                  You have exhausted your credit balance. <Link href="/pricing" className="text-primary hover:underline">Upgrade to Pro &rarr;</Link>
                </p>
              )}
              {!limitReached && (
                <p className="text-[10px] text-center text-muted-foreground font-semibold">
                  Costs 1 credit ({localCredits ?? 0} remaining)
                </p>
              )}
            </form>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        {!result && !isLoading && (
          <Card className="h-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground min-h-[300px]">
            <Search className="h-10 w-10 mb-4 opacity-50" />
            <p>Enter your primary keyword to generate optimized metadata.</p>
          </Card>
        )}

        {isLoading && (
          <Card className="h-full flex items-center justify-center min-h-[300px]">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Generating SEO metadata...</span>
            </div>
          </Card>
        )}

        {result && !isLoading && (
          <div className="space-y-4">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm">SEO Title</CardTitle>
              </CardHeader>
              <CardContent className="relative pb-4">
                <p className="pr-8 text-lg font-medium text-blue-600 dark:text-blue-400">{result.title}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className={`text-xs ${result.title.length > 60 ? 'text-red-500' : 'text-green-500'}`}>
                    {result.title.length} / 60 chars
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.title, 'title')}>
                    {copiedField === 'title' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm">Meta Description</CardTitle>
              </CardHeader>
              <CardContent className="relative pb-4">
                <p className="pr-8 text-sm">{result.description}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className={`text-xs ${result.description.length > 155 ? 'text-red-500' : 'text-green-500'}`}>
                    {result.description.length} / 155 chars
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.description, 'desc')}>
                    {copiedField === 'desc' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm">Target Keywords</CardTitle>
              </CardHeader>
              <CardContent className="relative pb-4 flex flex-wrap gap-2">
                {result.keywords.map((kw: string) => (
                  <span key={kw} className="bg-muted px-2 py-1 rounded-md text-xs">{kw}</span>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>

    {/* SEO Section */}
    <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12 pb-20">
      <section>
        <h2 className="text-2xl font-black tracking-tight mb-4">What is SEO Meta Generation?</h2>
        <p className="text-muted-foreground leading-relaxed">
          SEO meta tags are HTML elements that describe your page content to search engines and social media platforms. The two most important are the title tag (shown in search results) and the meta description (the snippet of text below the title). Getting these right is critical for click-through rate (CTR).
        </p>
        <p className="text-muted-foreground mt-4 leading-relaxed">
          Our AI analyses your page content and target keywords to generate optimised title tags (under 60 characters) and meta descriptions (under 155 characters) that are compelling to both search engine algorithms and human readers.
        </p>
      </section>
      <section className="bg-muted/30 p-8 rounded-3xl border border-primary/5">
        <h3 className="text-xl font-black tracking-tight mb-6">SEO Meta Tag Best Practices</h3>
        <ul className="space-y-4 list-none p-0">
          {[
            { title: "Title Tag Length", desc: "Keep titles between 50–60 characters. Too short and you waste valuable real estate. Too long and Google truncates it with '...'." },
            { title: "Include Primary Keyword", desc: "Place your main keyword near the start of the title. This signals relevance to Google and helps users understand the page topic instantly." },
            { title: "Compelling Meta Descriptions", desc: "Meta descriptions don't directly affect ranking but massively influence CTR. Use active language and include a call-to-action." },
            { title: "Unique Per Page", desc: "Every page on your site should have a unique title and meta description. Duplicate meta tags confuse search engines and dilute your SEO." },
          ].map((item, i) => (
            <li key={i} className="flex gap-4">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black text-primary">{i + 1}</div>
              <div>
                <h4 className="font-bold text-foreground leading-none mb-1">{item.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  </>)
}
