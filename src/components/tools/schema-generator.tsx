"use client"

import React, { useState } from "react"
import { Copy, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SchemaGenerator() {
  const [copied, setCopied] = useState(false)

  // Article State
  const [articleState, setArticleState] = useState({
    headline: "Article Headline",
    image: "https://example.com/image.jpg",
    author: "Author Name",
    datePublished: new Date().toISOString().split('T')[0]
  })

  // FAQ State
  const [faqState, setFaqState] = useState([
    { q: "What is this tool?", a: "This is a schema generator." }
  ])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const generateArticleSchema = () => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": articleState.headline,
      "image": [articleState.image],
      "datePublished": `${articleState.datePublished}T08:00:00+08:00`,
      "author": [{
          "@type": "Person",
          "name": articleState.author
      }]
    }
    return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`
  }

  const generateFAQSchema = () => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqState.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.a
        }
      }))
    }
    return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>JSON-LD Schema Builder</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="article" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="article">Article Schema</TabsTrigger>
              <TabsTrigger value="faq">FAQ Schema</TabsTrigger>
            </TabsList>

            <TabsContent value="article" className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Headline</Label>
                  <Input value={articleState.headline} onChange={e => setArticleState({...articleState, headline: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <Input value={articleState.image} onChange={e => setArticleState({...articleState, image: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Author</Label>
                  <Input value={articleState.author} onChange={e => setArticleState({...articleState, author: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Date Published</Label>
                  <Input type="date" value={articleState.datePublished} onChange={e => setArticleState({...articleState, datePublished: e.target.value})} />
                </div>
              </div>
              <div className="relative">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="absolute top-2 right-2 bg-background"
                  onClick={() => copyToClipboard(generateArticleSchema())}
                >
                  {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre-wrap h-[300px]">
                  {generateArticleSchema()}
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="faq" className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                {faqState.map((faq, idx) => (
                  <div key={idx} className="space-y-2 p-4 border rounded-md relative">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="absolute top-1 right-1 text-red-500"
                      onClick={() => setFaqState(faqState.filter((_, i) => i !== idx))}
                    >
                      Remove
                    </Button>
                    <Label>Question {idx + 1}</Label>
                    <Input 
                      value={faq.q} 
                      onChange={e => {
                        const newFaq = [...faqState]
                        newFaq[idx].q = e.target.value
                        setFaqState(newFaq)
                      }} 
                    />
                    <Label>Answer</Label>
                    <Textarea 
                      value={faq.a} 
                      onChange={e => {
                        const newFaq = [...faqState]
                        newFaq[idx].a = e.target.value
                        setFaqState(newFaq)
                      }} 
                    />
                  </div>
                ))}
                <Button onClick={() => setFaqState([...faqState, { q: "", a: "" }])}>
                  Add Question
                </Button>
              </div>
              <div className="relative">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="absolute top-2 right-2 bg-background"
                  onClick={() => copyToClipboard(generateFAQSchema())}
                >
                  {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre-wrap h-full min-h-[300px]">
                  {generateFAQSchema()}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* SEO Section */}
      <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12 pb-20">
        <section>
          <h2 className="text-2xl font-black tracking-tight mb-4">What is JSON-LD Schema Markup?</h2>
          <p className="text-muted-foreground leading-relaxed">
            JSON-LD (JavaScript Object Notation for Linked Data) is the recommended format by Google for adding structured data to your web pages. It allows search engines to understand the content and context of your page, enabling rich results in Google Search like star ratings, FAQs, and article details.
          </p>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            Unlike microdata, JSON-LD is placed in a <code className="text-primary font-bold bg-primary/10 px-1 rounded">{"<script>"}</code> tag in your page's head and does not require modifying your HTML structure. This makes it easy to implement and maintain.
          </p>
        </section>
        <section className="bg-muted/30 p-8 rounded-3xl border border-primary/5">
          <h3 className="text-xl font-black tracking-tight mb-6">Why Schema Markup Matters</h3>
          <ul className="space-y-4 list-none p-0">
            {[
              { title: "Rich Results in Google", desc: "Schema enables rich snippets — FAQ dropdowns, article dates, star ratings — that increase CTR by up to 30% compared to standard results." },
              { title: "Better AI Understanding", desc: "As AI-powered search grows, structured data helps LLMs and AI agents understand and cite your content accurately." },
              { title: "No Ranking Impact, Big CTR Impact", desc: "Schema doesn't directly improve rankings, but richer search listings drive significantly more clicks from the same position." },
              { title: "FAQ Schema", desc: "FAQ schema is particularly powerful — it shows expandable Q&A pairs directly in search results, taking up 3–4x more screen real estate." },
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
    </>
  )
}
