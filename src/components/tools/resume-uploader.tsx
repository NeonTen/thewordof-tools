"use client"

import React, { useRef, useState } from "react"
import { Upload, Loader2, FileText } from "lucide-react"

export function ResumeUploader({ onUpload }: { onUpload: (text: string) => void }) {
  const [isParsing, setIsParsing] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFile = async (file: File) => {
    setError("")
    setIsParsing(true)

    const ext = file.name.split(".").pop()?.toLowerCase() || ""
    const allowed = ["docx", "pdf", "txt", "md"]
    if (!allowed.includes(ext)) {
      setError("Unsupported format. Please upload .docx, .pdf, .txt, or .md")
      setIsParsing(false)
      return
    }

    try {
      if (ext === "docx") {
        const reader = new FileReader()
        reader.onload = async () => {
          try {
            const mammoth = await import("mammoth")
            const result = await mammoth.extractRawText({ arrayBuffer: reader.result as ArrayBuffer })
            onUpload(result.value)
          } catch (e: any) {
            setError("Failed to parse DOCX: " + e.message)
          } finally {
            setIsParsing(false)
          }
        }
        reader.readAsArrayBuffer(file)
      } else if (ext === "pdf") {
        const reader = new FileReader()
        reader.onload = async () => {
          try {
            const pdfjs = await import("pdfjs-dist")
            pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version || "6.0.227"}/build/pdf.worker.min.js`
            const loadingTask = pdfjs.getDocument({ data: reader.result as ArrayBuffer })
            const pdf = await loadingTask.promise
            let fullText = ""
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i)
              const content = await page.getTextContent()
              const pageText = content.items.map((item: any) => item.str).join(" ")
              fullText += pageText + "\n\n"
            }
            onUpload(fullText)
          } catch (e: any) {
            setError("Failed to parse PDF: " + e.message)
          } finally {
            setIsParsing(false)
          }
        }
        reader.readAsArrayBuffer(file)
      } else {
        // txt or md
        const reader = new FileReader()
        reader.onload = () => {
          onUpload(reader.result as string)
          setIsParsing(false)
        }
        reader.readAsText(file)
      }
    } catch (err: any) {
      console.error(err)
      setError("An error occurred during file parsing.")
      setIsParsing(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      processFile(selected)
    }
    // Reset input so the same file can be uploaded again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-muted/20 border border-border rounded-xl gap-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
          {isParsing ? <Loader2 className="h-5 w-5 animate-spin" /> : <FileText className="h-5 w-5" />}
        </div>
        <div>
          <p className="text-sm font-bold">Auto-fill via Document</p>
          <p className="text-xs text-muted-foreground">Upload a PDF or DOCX to extract text automatically.</p>
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-1">
        <input 
          ref={fileInputRef}
          type="file" 
          accept=".docx,.pdf,.txt,.md"
          onChange={handleFileChange}
          className="hidden" 
        />
        <button
          type="button"
          disabled={isParsing}
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-bold text-xs rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isParsing ? "Extracting..." : (
            <>
              <Upload className="h-3 w-3" />
              Upload Resume
            </>
          )}
        </button>
        {error && <p className="text-[10px] text-destructive font-semibold max-w-[200px] text-right truncate">{error}</p>}
      </div>
    </div>
  )
}
