"use client"

import React, { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useUsageLimit } from "@/hooks/use-usage-limit"
import { FileText, Clock, AlignLeft } from "lucide-react"

function NativeToggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  description?: string
}) {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="space-y-0.5">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          checked ? "bg-primary" : "bg-muted border-muted-foreground/30"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  )
}

export function WordCounter() {
  const [text, setText] = useState("")
  const [includeSpaces, setIncludeSpaces] = useState(true)
  const { increment: incrementUsage } = useUsageLimit("word-counter", "daily")

  const countWords = (str: string) => {
    const trimmed = str.trim()
    if (!trimmed) return 0
    return trimmed.split(/\s+/).length
  }

  const countChars = (str: string) => {
    if (includeSpaces) return str.length
    return str.replace(/\s/g, "").length
  }

  const countLines = (str: string) => {
    if (!str) return 0
    return str.split("\n").length
  }

  const countParagraphs = (str: string) => {
    if (!str) return 0
    return str.split(/\n\s*\n/).filter(Boolean).length
  }

  const words = countWords(text)
  const chars = countChars(text)
  const lines = countLines(text)
  const paragraphs = countParagraphs(text)
  const readingTime = Math.max(1, Math.ceil(words / 200))

  useEffect(() => {
    if (text.length > 0) {
      const timer = setTimeout(() => {
        incrementUsage(1, { length: text.length, words, lines }).catch(console.error)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [text, words, lines, incrementUsage])

  return (
    <div className="grid xl:grid-cols-4 gap-8 pb-8 md:pb-20">
      {/* Left Input Field */}
      <div className="xl:col-span-3 space-y-6">
        <Card className="glassmorphism p-6 h-full min-h-[400px] flex flex-col">
          <CardHeader className="px-0 pt-0">
            <CardTitle>Enter your text</CardTitle>
            <CardDescription>Type or paste your content to get real‑time metrics.</CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-0 flex-1 flex flex-col">
            <Textarea
              placeholder="Start typing or paste your content here..."
              value={text}
              onChange={e => setText(e.target.value)}
              className="flex-grow text-base font-sans p-4 resize-none min-h-[300px] bg-background/30"
            />
          </CardContent>
        </Card>
      </div>

      {/* Right Sidebar Stats & Options */}
      <div className="space-y-6">
        {/* Toggle Option */}
        <Card className="glassmorphism p-6">
          <NativeToggle
            label="Spaces Filter"
            description="Include spaces in char count"
            checked={includeSpaces}
            onChange={setIncludeSpaces}
          />
        </Card>

        {/* Counter Summary */}
        <Card className="glassmorphism p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-xl text-primary">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Words</p>
              <p className="text-3xl font-black text-primary tracking-tighter">{words}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t pt-4">
            <div className="bg-primary/10 p-3 rounded-xl text-primary">
              <AlignLeft className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Characters</p>
              <p className="text-3xl font-black text-primary tracking-tighter">{chars}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t pt-4">
            <div className="bg-primary/10 p-3 rounded-xl text-primary">
              <AlignLeft className="h-6 w-6 rotate-90" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Lines</p>
              <p className="text-3xl font-black text-primary tracking-tighter">{lines}</p>
            </div>
          </div>
        </Card>

        {/* Extra Statistics */}
        <Card className="glassmorphism p-6 space-y-4">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Statistics</CardTitle>
          <div className="flex justify-between items-center text-sm border-b pb-2">
            <span className="text-muted-foreground">Paragraphs</span>
            <span className="font-bold">{paragraphs}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Clock className="h-4 w-4" /> Est. Read Time
            </span>
            <span className="font-bold">{text ? `${readingTime} min` : "0 min"}</span>
          </div>
        </Card>
      </div>
    </div>
  )
}
