"use client"

import React, { useState } from "react"
// Removed useCompletion
import { Loader2, Copy, Check, Lightbulb } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PromptGenerator() {
  const [copied, setCopied] = useState(false)
  
  const [formData, setFormData] = useState({
    category: "ChatGPT",
    goal: "",
    context: "",
    constraints: ""
  })

  const [completion, setCompletion] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setCompletion("")

    try {
      const res = await fetch("/api/ai/prompt", {
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
    }
  }

  const copyToClipboard = () => {
    if (!completion) return
    navigator.clipboard.writeText(completion)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (<>
    <div className="grid lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Design Prompt</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>AI Target</Label>
              <Select value={formData.category} onValueChange={v => setFormData({...formData, category: v || ""})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target AI" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ChatGPT">ChatGPT (Text)</SelectItem>
                  <SelectItem value="Midjourney">Midjourney (Images)</SelectItem>
                  <SelectItem value="Claude">Claude (Coding/Writing)</SelectItem>
                  <SelectItem value="Stable Diffusion">Stable Diffusion (Images)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Main Goal / Task *</Label>
              <Input 
                placeholder="e.g. Write a python script to scrape a website..." 
                required
                value={formData.goal} 
                onChange={e => setFormData({...formData, goal: e.target.value})} 
              />
            </div>

            <div className="space-y-2">
              <Label>Context / Background</Label>
              <Textarea 
                placeholder="e.g. I am a beginner in Python and need comments explaining the code." 
                rows={3}
                value={formData.context} 
                onChange={e => setFormData({...formData, context: e.target.value})} 
              />
            </div>

            <div className="space-y-2">
              <Label>Constraints / Rules</Label>
              <Input 
                placeholder="e.g. Do not use external libraries except BeautifulSoup." 
                value={formData.constraints} 
                onChange={e => setFormData({...formData, constraints: e.target.value})} 
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || !formData.goal}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Lightbulb className="mr-2 h-4 w-4" />
              )}
              {isLoading ? "Optimizing..." : "Generate Optimal Prompt"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card className="h-full flex flex-col relative overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">Generated Prompt</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 relative">
            {!completion && !isLoading && (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground min-h-[300px]">
                <Lightbulb className="h-10 w-10 mb-4 opacity-50" />
                <p>Fill out the parameters to generate an expert-level prompt.</p>
              </div>
            )}
            
            {(completion || isLoading) && (
              <div className="bg-muted p-4 rounded-md h-full min-h-[300px] whitespace-pre-wrap text-sm relative">
                {completion}
                {isLoading && (
                  <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1 align-middle"></span>
                )}
                {!isLoading && completion && (
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="absolute top-4 right-4"
                    onClick={copyToClipboard}
                  >
                    {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>

    {/* SEO Section */}
    <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12 pb-20">
      <section>
        <h2 className="text-2xl font-black tracking-tight mb-4">What is AI Prompt Engineering?</h2>
        <p className="text-muted-foreground leading-relaxed">
          Prompt engineering is the practice of crafting precise, structured instructions for AI models (like ChatGPT, Gemini, or Claude) to produce high-quality, relevant outputs. A well-structured prompt specifies the role, context, task, constraints, and output format.
        </p>
        <p className="text-muted-foreground mt-4 leading-relaxed">
          The difference between a vague prompt and an expert prompt can be the difference between a generic one-sentence answer and a detailed, actionable response. Our generator builds expert-level prompts automatically based on your parameters.
        </p>
      </section>
      <section className="bg-muted/30 p-8 rounded-3xl border border-primary/5">
        <h3 className="text-xl font-black tracking-tight mb-6">Elements of a Great AI Prompt</h3>
        <ul className="space-y-4 list-none p-0">
          {[
            { title: "Role Definition", desc: "Tell the AI who to be: 'Act as a senior UX designer with 10 years of experience'. This primes the model for domain expertise." },
            { title: "Clear Context", desc: "Provide background: the audience, the platform, the goal. The more context, the more accurate the response." },
            { title: "Specific Task", desc: "Use action verbs: 'Write', 'Summarise', 'Compare', 'List'. Avoid vague instructions like 'Tell me about...'." },
            { title: "Output Format", desc: "Specify the desired output: 'Return as a numbered list', 'Write in JSON', 'Keep it under 200 words'. Structured outputs are easier to use." },
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
