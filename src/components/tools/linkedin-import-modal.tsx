"use client"

import { useState } from "react"
import { Loader2, Linkedin, X, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LinkedInPreviewModal } from "./linkedin-preview-modal"

export type LinkedInImportResult = {
  name: string
  title: string
  location: string
  summary: string
  skillsText: string
  experience: Array<{
    company: string
    role: string
    period: string
    desc: string
  }>
  education: Array<{
    school: string
    degree: string
    period: string
  }>
}

interface LinkedInImportModalProps {
  onApply: (data: LinkedInImportResult) => void
  onClose: () => void
}

export function LinkedInImportModal({ onApply, onClose }: LinkedInImportModalProps) {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [parsedData, setParsedData] = useState<LinkedInImportResult | null>(null)

  const handleFetch = async () => {
    if (!url.trim()) return
    setIsLoading(true)
    setError(null)
    setParsedData(null)

    try {
      const res = await fetch("/api/ai/linkedin-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        const errMap: Record<string, string> = {
          invalid_url: "Please enter a valid LinkedIn profile URL (e.g. linkedin.com/in/your-name).",
          profile_not_public: "We couldn't read this profile. Make sure it's set to 'Public' on LinkedIn.",
          fetch_failed: "Couldn't reach LinkedIn. Check the URL or try again later.",
          parse_failed: "AI was unable to extract your profile info. Please verify your profile details."
        }
        setError(errMap[data.error] || "An unexpected error occurred during profile extraction.")
      } else {
        setParsedData(data)
      }
    } catch (e) {
      console.error(e)
      setError("Failed to complete import request due to network connection issues.")
    } finally {
      setIsLoading(false)
    }
  }

  if (parsedData) {
    return (
      <LinkedInPreviewModal
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
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border bg-background p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <Button variant="ghost" size="icon" className="absolute top-4 right-4 h-8 w-8 rounded-full" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>

        <div className="space-y-6 pt-2">
          <div className="mx-auto w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Linkedin className="h-6 w-6 text-blue-500 fill-blue-500" />
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold tracking-tight">Import from LinkedIn</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Paste your public LinkedIn profile URL. We will extract details using AI to pre-fill your CV.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="https://www.linkedin.com/in/username"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
                className="h-10 px-4 rounded-xl border-muted-foreground/20"
              />
            </div>

            {error && (
              <div className="flex gap-2 p-3.5 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive text-xs leading-relaxed">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <Button
              className="w-full h-11 font-semibold rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition-all shadow-md shadow-blue-500/25"
              onClick={handleFetch}
              disabled={isLoading || !url.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Extracting profile details...
                </>
              ) : (
                "Fetch & Preview Data"
              )}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-[11px] text-muted-foreground">
              💡 Ensure your LinkedIn profile has public visibility enabled under LinkedIn settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
