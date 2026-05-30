"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, Copy, Check, Sparkles } from "lucide-react"
import Link from "next/link"

interface ProductDescriptionProps {
  isPro?: boolean
  creditsRemaining?: number | null
  isLoggedIn?: boolean
}

export function ProductDescription({ 
  isPro = false,
  creditsRemaining = null,
  isLoggedIn = false
}: ProductDescriptionProps) {
  const [title, setTitle] = useState("")
  const [featuresText, setFeaturesText] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [generated, setGenerated] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const [localCredits, setLocalCredits] = useState<number | null>(creditsRemaining)

  useEffect(() => {
    setLocalCredits(creditsRemaining)
  }, [creditsRemaining])

  const limitReached = isLoggedIn 
    ? (localCredits !== null && localCredits <= 0) 
    : false

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (limitReached) return

    setLoading(true)
    setError("")
    try {
      const featuresList = featuresText
        .split("\n")
        .map(f => f.trim())
        .filter(f => f.length > 0)

      const formData = new FormData()
      formData.append("title", title)
      formData.append("features", JSON.stringify(featuresList))
      if (imageFile) formData.append("image", imageFile)

      const res = await fetch("/api/tools/generate-description", {
        method: "POST",
        body: formData,
      })
      if (!res.ok) throw new Error("Failed to generate description")
      setLocalCredits(prev => (prev !== null ? Math.max(0, prev - 1) : null))
      const data = await res.json()
      setGenerated(data.description)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generated)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <Card className="glassmorphism p-6 h-fit">
        <CardHeader className="px-0 pt-0">
          <CardTitle>Product Parameters</CardTitle>
          <CardDescription>Enter product details to generate an optimized description.</CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0">
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground" htmlFor="title">Product Title *</label>
                <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Ergonomic Office Chair" required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground" htmlFor="image">Product Image (optional)</label>
                <Input id="image" type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] ?? null)} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground" htmlFor="features">Key Features (one per line)</label>
                <Textarea
                  id="features"
                  value={featuresText}
                  onChange={e => setFeaturesText(e.target.value)}
                  placeholder="High density foam seat&#10;Adjustable lumbar support&#10;3D armrests&#10;Tilt mechanism"
                  rows={5}
                  className="w-full text-sm"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" disabled={loading || limitReached} className="w-full flex items-center justify-center">
                {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                {limitReached ? "Out of Credits" : "Generate Description"}
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
        {!generated && !loading && (
          <Card className="h-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground min-h-[350px]">
            <p>Generate product description to see AI output here.</p>
          </Card>
        )}

        {loading && (
          <Card className="h-full flex items-center justify-center min-h-[350px]">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Generating product description...</span>
            </div>
          </Card>
        )}

        {generated && !loading && (
          <Card className="p-6">
            <CardHeader className="px-0 pt-0 flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Generated Output</CardTitle>
              <Button variant="ghost" size="sm" onClick={handleCopy} className="flex items-center gap-1">
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground border rounded-lg p-4 bg-muted/10 font-sans max-h-[450px] overflow-y-auto">
                {generated}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
