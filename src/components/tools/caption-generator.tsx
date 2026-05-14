"use client"

import React, { useState } from "react"
// Removed useCompletion
import { Loader2, Copy, Check, Sparkles, MessageSquare } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { getDailyUsage, incrementDailyUsage } from "@/lib/usage-limit"

export function CaptionGenerator({ isPro = false }: { isPro?: boolean }) {
  const [usedToday, setUsedToday] = useState(0)
  const MAX_FREE = 3

  React.useEffect(() => {
    if (!isPro) setUsedToday(getDailyUsage("caption-generator"))
  }, [isPro])

  const limitReached = !isPro && usedToday >= MAX_FREE

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  
  const [formData, setFormData] = useState({
    platform: "Instagram",
    tone: "Engaging",
    audience: "",
    topic: "",
    keywords: ""
  })

  const [completion, setCompletion] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setCompletion("")

    try {
      const res = await fetch("/api/ai/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (res.ok && res.body) {
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          setCompletion(prev => prev + decoder.decode(value, { stream: true }))
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
      if (res.ok && !isPro) {
        const newUsed = incrementDailyUsage("caption-generator")
        setUsedToday(newUsed)
      }
    }
  }

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  // Parse the completion by splitting at '---'
  const captions = completion.split('---').map(c => c.trim()).filter(c => c.length > 0)

  return (<>
    <div className="grid lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Generate Captions</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select value={formData.platform} onValueChange={v => setFormData({...formData, platform: v || ""})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    <SelectItem value="Twitter">Twitter / X</SelectItem>
                    <SelectItem value="Facebook">Facebook</SelectItem>
                    <SelectItem value="TikTok">TikTok</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={formData.tone} onValueChange={v => setFormData({...formData, tone: v || ""})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Engaging">Engaging</SelectItem>
                    <SelectItem value="Humorous">Humorous</SelectItem>
                    <SelectItem value="Inspirational">Inspirational</SelectItem>
                    <SelectItem value="Educational">Educational</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Target Audience</Label>
              <Input 
                placeholder="e.g. Startup founders, Fitness enthusiasts" 
                value={formData.audience} 
                onChange={e => setFormData({...formData, audience: e.target.value})} 
              />
            </div>

            <div className="space-y-2">
              <Label>Topic / What is the post about? *</Label>
              <Textarea 
                placeholder="Describe your product launch, blog post, or idea..." 
                rows={4}
                required
                value={formData.topic} 
                onChange={e => setFormData({...formData, topic: e.target.value})} 
              />
            </div>

            <div className="space-y-2">
              <Label>Keywords (Optional)</Label>
              <Input 
                placeholder="e.g. AI, SaaS, Productivity" 
                value={formData.keywords} 
                onChange={e => setFormData({...formData, keywords: e.target.value})} 
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || !formData.topic || limitReached}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              {isLoading ? "Generating..." : limitReached ? "Daily Limit Reached" : "Generate Captions"}
            </Button>
            {limitReached && (
              <p className="text-[10px] text-center text-muted-foreground">
                You've reached your 3 daily generations. <Link href="/pricing" className="text-primary font-bold hover:underline">Upgrade to Pro →</Link>
              </p>
            )}
            {!isPro && !limitReached && (
              <p className="text-[10px] text-center text-muted-foreground">
                {MAX_FREE - usedToday} of {MAX_FREE} free generations left today
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {captions.length === 0 && !isLoading && (
          <div className="h-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
            <MessageSquare className="h-10 w-10 mb-4 opacity-50" />
            <p>Fill out the form and generate to see your AI captions here.</p>
          </div>
        )}

        {captions.map((caption, idx) => (
          <Card key={idx} className="relative overflow-hidden group">
            <CardContent className="p-6">
              <div className="whitespace-pre-wrap text-sm text-foreground/90">
                {caption}
              </div>
              <Button 
                variant="secondary" 
                size="icon" 
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => copyToClipboard(caption, idx)}
              >
                {copiedIndex === idx ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </CardContent>
          </Card>
        ))}

        {isLoading && (
          <Card>
            <CardContent className="p-6 flex items-center justify-center space-x-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>AI is typing...</span>
            </CardContent>
          </Card>
        )}
      </div>
    </div>

    {/* SEO Section */}
    <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12 pb-20">
      <section>
        <h2 className="text-2xl font-black tracking-tight mb-4">What is an AI Caption Generator?</h2>
        <p className="text-muted-foreground leading-relaxed">
          An AI caption generator uses large language models to create engaging, platform-optimized captions for your social media posts. Instead of staring at a blank text box, you provide your topic, tone, and platform — and the AI writes captions tailored to your audience.
        </p>
        <p className="text-muted-foreground mt-4 leading-relaxed">
          Whether you need punchy one-liners for Twitter/X, hashtag-heavy Instagram captions, or professional LinkedIn posts, our generator adapts its style and length to match each platform's best practices.
        </p>
      </section>
      <section className="bg-muted/30 p-8 rounded-3xl border border-primary/5">
        <h3 className="text-xl font-black tracking-tight mb-6">Why Use AI for Social Captions?</h3>
        <ul className="space-y-4 list-none p-0">
          {[
            { title: "Save Hours Weekly", desc: "Eliminate caption writer's block. Generate 10 variations in seconds and pick your favourite." },
            { title: "Platform-Specific Tone", desc: "LinkedIn requires professional language; TikTok needs energy. The AI knows the difference." },
            { title: "Consistent Brand Voice", desc: "Set your tone (witty, professional, inspirational) and every caption matches your brand identity." },
            { title: "SEO & Discoverability", desc: "AI-generated captions include relevant keywords and hashtags that boost organic reach on social platforms." },
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
