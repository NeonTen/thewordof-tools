"use client"

import { useState } from "react"
import { Loader2, X, AlertTriangle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AIPreviewModal, type CVParserResult } from "./ai-preview-modal"
export type { CVParserResult }

interface AIParserModalProps {
  onApply: (data: CVParserResult) => void
  onClose: () => void
}

export function AIParserModal({ onApply, onClose }: AIParserModalProps) {
  const [text, setText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [parsedData, setParsedData] = useState<CVParserResult | null>(null)

  const handleParse = async () => {
    if (!text.trim() || text.trim().length < 100) {
      setError("Please enter a substantial amount of text (minimum 100 characters) to parse successfully.")
      return
    }
    setIsLoading(true)
    setError(null)
    setParsedData(null)

    try {
      const res = await fetch("/api/ai/cv-parser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        if (data.error === "text_too_short") {
          setError("The text is too short. Please copy and paste more professional details.")
        } else {
          setError("AI was unable to extract CV data from your text. Please verify the content and try again.")
        }
      } else {
        setParsedData(data)
      }
    } catch (e) {
      console.error(e)
      setError("Failed to reach AI parser endpoint due to network connection issues.")
    } finally {
      setIsLoading(false)
    }
  }

  if (parsedData) {
    return (
      <AIPreviewModal
        data={parsedData}
        onApply={(data) => {
          onApply(data)
          onClose()
        }}
        onBack={() => setParsedData(null)}
        onClose={onClose}
      />
    )
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md animate-in fade-in duration-200" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border bg-background p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <Button variant="ghost" size="icon" className="absolute top-4 right-4 h-8 w-8 rounded-full" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>

        <div className="space-y-6 pt-2">
          <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-lg font-bold tracking-tight">AI Resume Parser</h3>
            <p className="text-xs text-muted-foreground px-4">
              Paste raw text from your LinkedIn page, old resume, or bio. We&apos;ll instantly structure and map it.
            </p>
          </div>

          <div className="space-y-3">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste here... E.g.
Sajid Khan
Senior Engineer

Experience:
Smartworking Solutions (2022 - Present)
- Developed fullstack features using React and Next.js..."
              className="w-full min-h-[200px] text-xs p-4 rounded-2xl border bg-muted/20 focus:bg-background outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
            />

            {error && (
              <div className="flex gap-2 rounded-2xl bg-destructive/10 border border-destructive/20 p-3.5 text-xs text-destructive">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 rounded-2xl h-11" onClick={onClose}>
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              onClick={handleParse}
              className="flex-1 rounded-2xl h-11 bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Parsing...
                </>
              ) : (
                "✨ Parse & Import"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
