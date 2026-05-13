"use client"

import React, { useState, useCallback } from "react"
import { Split, Copy, Check, FileText, Upload, Trash2, ArrowLeftRight } from "lucide-react"
import { diffLines, Change } from "diff"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export function TextDiff({ isPro = false }: { isPro?: boolean }) {
  const [text1, setText1] = useState("")
  const [text2, setText2] = useState("")
  const [diffResult, setDiffResult] = useState<Change[]>([])
  const [isCompared, setIsCompared] = useState(false)
  const [viewMode, setViewMode] = useState<"side" | "inline">("side")
  const [isCopied, setIsCopied] = useState(false)

  const handleCompare = useCallback(() => {
    const result = diffLines(text1, text2)
    setDiffResult(result)
    setIsCompared(true)
  }, [text1, text2])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      setter(event.target?.result as string)
    }
    reader.readAsText(file)
  }

  const handleClear = () => {
    setText1("")
    setText2("")
    setDiffResult([])
    setIsCompared(false)
  }

  const copyDiff = () => {
    const diffText = diffResult.map(change => {
      const prefix = change.added ? "+ " : change.removed ? "- " : "  "
      return change.value.split('\n').filter(l => l).map(line => prefix + line).join('\n')
    }).join('\n')
    navigator.clipboard.writeText(diffText)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className="space-y-8">
      {!isCompared ? (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-sm">Original Text</CardTitle>
                <CardDescription className="text-xs">Paste or upload source file</CardDescription>
              </div>
              <Label className="cursor-pointer">
                <div className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors">
                  <Upload className="h-3 w-3" /> Upload
                </div>
                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, setText1)} />
              </Label>
            </CardHeader>
            <CardContent>
              <Textarea 
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                placeholder="Paste original text here..."
                className="h-[400px] font-mono text-sm leading-relaxed resize-none"
              />
            </CardContent>
          </Card>

          <Card className="border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-sm">Modified Text</CardTitle>
                <CardDescription className="text-xs">Paste or upload changed file</CardDescription>
              </div>
              <Label className="cursor-pointer">
                <div className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors">
                  <Upload className="h-3 w-3" /> Upload
                </div>
                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, setText2)} />
              </Label>
            </CardHeader>
            <CardContent>
              <Textarea 
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                placeholder="Paste modified text here..."
                className="h-[400px] font-mono text-sm leading-relaxed resize-none"
              />
            </CardContent>
          </Card>

          <div className="md:col-span-2 flex justify-center pt-4">
            <Button size="lg" onClick={handleCompare} className="gap-2 px-12 h-14 text-lg font-bold rounded-full shadow-lg shadow-primary/20">
              <Split className="h-5 w-5" /> Compare Texts
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-muted/50 p-4 rounded-2xl border">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => setIsCompared(false)} className="gap-2">
                <ArrowLeftRight className="h-4 w-4" /> Edit Input
              </Button>
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
                <TabsList className="h-9">
                  <TabsTrigger value="side" className="text-xs">Side-by-Side</TabsTrigger>
                  <TabsTrigger value="inline" className="text-xs">Inline</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={copyDiff} className="gap-2">
                {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                Copy Diff
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClear} className="text-destructive hover:bg-destructive/10 gap-2">
                <Trash2 className="h-4 w-4" /> Clear All
              </Button>
            </div>
          </div>

          <div className="border rounded-2xl overflow-hidden bg-card max-h-[600px] overflow-y-auto">
            {viewMode === "inline" ? (
              <div className="divide-y divide-border/50">
                {diffResult.map((change, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "px-4 py-1 font-mono text-sm whitespace-pre-wrap flex gap-4",
                      change.added ? "bg-green-500/10 text-green-500" : 
                      change.removed ? "bg-red-500/10 text-red-500" : ""
                    )}
                  >
                    <span className="w-4 shrink-0 opacity-50 select-none">
                      {change.added ? "+" : change.removed ? "-" : " "}
                    </span>
                    <div className="flex-1">
                      {change.value.split('\n').map((line, li) => (
                        line && <div key={li}>{line}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 divide-x divide-border">
                {/* Left Side - Removed or Unchanged */}
                <div className="divide-y divide-border/20">
                  <div className="px-4 py-2 bg-muted/50 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border/50">Original Version</div>
                  {diffResult.map((change, i) => (
                    !change.added && (
                      <div 
                        key={i} 
                        className={cn(
                          "px-4 py-0.5 font-mono text-[13px] whitespace-pre-wrap min-h-[1.5rem]",
                          change.removed ? "bg-red-500/15 text-red-500" : "text-muted-foreground/80"
                        )}
                      >
                        {change.value}
                      </div>
                    )
                  ))}
                </div>
                {/* Right Side - Added or Unchanged */}
                <div className="divide-y divide-border/20">
                  <div className="px-4 py-2 bg-muted/50 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border/50">Modified Version</div>
                  {diffResult.map((change, i) => (
                    !change.removed && (
                      <div 
                        key={i} 
                        className={cn(
                          "px-4 py-0.5 font-mono text-[13px] whitespace-pre-wrap min-h-[1.5rem]",
                          change.added ? "bg-green-500/15 text-green-500" : "text-muted-foreground/80"
                        )}
                      >
                        {change.value}
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats and Help */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-primary/5 border-primary/10">
          <CardContent className="pt-6">
            <h4 className="font-bold mb-2">Code Support</h4>
            <p className="text-sm text-muted-foreground">Compare JSON, CSS, JavaScript, HTML, and Markdown files with ease. Syntax highlighting is coming soon in future updates.</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/10">
          <CardContent className="pt-6">
            <h4 className="font-bold mb-2">Privacy First</h4>
            <p className="text-sm text-muted-foreground">All comparisons are performed locally in your browser. Your data never leaves your device or touches our servers.</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/10">
          <CardContent className="pt-6">
            <h4 className="font-bold mb-2">How it works</h4>
            <p className="text-sm text-muted-foreground">We use the diff-match-patch algorithm to detect line-by-line changes, identifying additions and subtractions.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
