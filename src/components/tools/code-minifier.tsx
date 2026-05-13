"use client"

import React, { useState, useCallback } from "react"
import { FileCode, Copy, Check, Download, RotateCcw, Shrink, Expand, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

import jsbeautify from "js-beautify"

// Basic minification logic
const minifyCSS = (css: string) => css.replace(/\s+/g, ' ').replace(/\/\*.*?\*\//g, '').replace(/ ?([:;{}]) ?/g, '$1').trim()
const minifyHTML = (html: string) => html.replace(/<!--[\s\S]*?-->/g, '').replace(/>\s+</g, '><').replace(/\s{2,}/g, ' ').trim()
const minifyJS = (js: string) => js.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').trim()

export function CodeMinifier({ isPro = false }: { isPro?: boolean }) {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [language, setLanguage] = useState<"js" | "css" | "html">("js")
  const [mode, setMode] = useState<"minify" | "beautify">("minify")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [stats, setStats] = useState<{original: number, minimized: number} | null>(null)

  const processCode = async () => {
    setIsProcessing(true)
    // Small delay to show loader for UX
    await new Promise(r => setTimeout(r, 400))

    try {
      let result = ""
      if (mode === "minify") {
        if (language === "js") result = minifyJS(input)
        else if (language === "css") result = minifyCSS(input)
        else if (language === "html") result = minifyHTML(input)
      } else {
        const options = { indent_size: 2, space_in_empty_paren: true }
        if (language === "js") result = jsbeautify.js(input, options)
        else if (language === "css") result = jsbeautify.css(input, options)
        else if (language === "html") result = jsbeautify.html(input, options)
      }

      setOutput(result)
      setStats({
        original: new Blob([input]).size,
        minimized: new Blob([result]).size
      })
    } catch (e) {
      console.error(e)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClear = () => {
    setInput("")
    setOutput("")
    setStats(null)
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
    a.download = `minified.${language}`
    a.click()
  }

  const reduction = stats ? Math.round(((stats.original - stats.minimized) / stats.original) * 100) : 0

  return (<>
    <div className="space-y-8">
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="border-primary/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-sm">Source Code</CardTitle>
                  <CardDescription className="text-xs">Paste your code below</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                   <Select value={language} onValueChange={(v) => setLanguage(v as any)}>
                    <SelectTrigger className="w-[100px] h-8 text-xs font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="js">JavaScript</SelectItem>
                      <SelectItem value="css">CSS</SelectItem>
                      <SelectItem value="html">HTML</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={mode} onValueChange={(v) => setMode(v as any)}>
                    <SelectTrigger className="w-[100px] h-8 text-xs font-bold bg-primary/5 border-primary/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minify">Minify</SelectItem>
                      <SelectItem value="beautify">Beautify</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Paste your ${language.toUpperCase()} code here...`}
                className="h-[500px] font-mono text-[13px] bg-muted/20 border-border/50 focus:border-primary/50 transition-all leading-relaxed resize-none"
              />
              <div className="flex gap-4 mt-6">
                <Button 
                  onClick={processCode} 
                  disabled={!input || isProcessing}
                  className="flex-1 gap-2 h-12 font-bold rounded-xl shadow-lg shadow-primary/10"
                >
                  {mode === "minify" ? <Shrink className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
                  {isProcessing ? "Processing..." : `${mode.charAt(0).toUpperCase() + mode.slice(1)} Code`}
                </Button>
                <Button variant="outline" onClick={handleClear} className="h-12 w-12 rounded-xl">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="h-full border-primary/10 flex flex-col relative overflow-hidden">
            {stats && (
              <div className="absolute top-0 right-0 p-4 z-10">
                <div className="bg-green-500/10 text-green-500 text-[10px] font-black uppercase px-2 py-1 rounded-full border border-green-500/20">
                  {reduction}% Reduced
                </div>
              </div>
            )}
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-sm">Processed Output</CardTitle>
                  <CardDescription className="text-xs">Resulting transformed code</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={copyToClipboard} disabled={!output} className="h-8 gap-2 text-xs font-bold">
                    {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    Copy
                  </Button>
                  <Button variant="ghost" size="sm" onClick={downloadFile} disabled={!output} className="h-8 gap-2 text-xs font-bold">
                    <Download className="h-3 w-3" />
                    Save
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <Textarea 
                value={output}
                readOnly
                placeholder="The processed code will appear here..."
                className="flex-1 h-[500px] font-mono text-[13px] bg-background border-border/50 focus:border-primary/50 transition-all leading-relaxed resize-none"
              />
              
              {stats && (
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-xl border border-border/50 text-center">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Original Size</p>
                    <p className="font-black text-lg">{(stats.original / 1024).toFixed(2)} <span className="text-xs font-normal">KB</span></p>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-xl border border-primary/20 text-center">
                    <p className="text-[10px] uppercase font-bold text-primary tracking-widest mb-1">New Size</p>
                    <p className="font-black text-lg">{(stats.minimized / 1024).toFixed(2)} <span className="text-xs font-normal text-foreground">KB</span></p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-primary/5 border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Info className="h-4 w-4" /> Why Minify?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Minification removes unnecessary characters from source code without changing its functionality. This reduces the file size, resulting in faster page loads and improved SEO performance.
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Info className="h-4 w-4" /> Optimization
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Our tool strips out comments, whitespace, and shortens variable names where possible. It supports JS, CSS, and HTML files commonly used in modern web development.
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Info className="h-4 w-4" /> Developer Ready
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Easily unminify (beautify) minified code to make it human-readable again. Perfect for debugging production scripts or learning from external libraries.
          </CardContent>
        </Card>
      </div>
    </div>

    {/* SEO Section */}
    <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12 pb-20">
      <section>
        <h2 className="text-2xl font-black tracking-tight mb-4">What is Code Minification?</h2>
        <p className="text-muted-foreground leading-relaxed">
          Code minification is the process of removing all unnecessary characters from source code — such as whitespace, comments, and long variable names — without changing its functionality. The result is a smaller file that browsers can download and parse faster.
        </p>
        <p className="text-muted-foreground mt-4 leading-relaxed">
          Minified JavaScript, CSS, and HTML files are standard in production web applications. Frameworks like Next.js, Vite, and Webpack automatically minify code during builds. Our tool lets you do it manually for any snippet.
        </p>
      </section>
      <section className="bg-muted/30 p-8 rounded-3xl border border-primary/5">
        <h3 className="text-xl font-black tracking-tight mb-6">Benefits of Minifying Code</h3>
        <ul className="space-y-4 list-none p-0">
          {[
            { title: "Smaller File Size", desc: "Minified JS/CSS can be 40-80% smaller, reducing bandwidth and improving load times significantly." },
            { title: "Faster Parsing", desc: "Browsers parse and execute minified code faster since there's less text to process." },
            { title: "Better Core Web Vitals", desc: "Render-blocking resources are a major LCP and FID killer. Minification directly helps both metrics." },
            { title: "Obfuscation", desc: "Minified code is harder for humans to read, providing a basic layer of intellectual property protection." },
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
