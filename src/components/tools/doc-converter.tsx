"use client"

import { useState, useRef } from "react"
import { FileText, Loader2, Upload, Trash2, ArrowRight } from "lucide-react"

interface UploadedFile {
  name: string
  size: number
  type: string
  content: ArrayBuffer | string
}

export function DocConverter() {
  const [file, setFile] = useState<UploadedFile | null>(null)
  const [converting, setConverting] = useState(false)
  const [error, setError] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      processFile(droppedFile)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      processFile(selected)
    }
  }

  const processFile = (selected: File) => {
    setError("")
    const ext = selected.name.split(".").pop()?.toLowerCase() || ""
    const allowed = ["docx", "pdf", "txt", "md"]
    if (!allowed.includes(ext)) {
      setError("Unsupported file format. Please upload .docx, .pdf, .txt, or .md")
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setFile({
        name: selected.name,
        size: selected.size,
        type: ext,
        content: reader.result as ArrayBuffer || "",
      })
    }
    reader.readAsArrayBuffer(selected)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="lg:col-span-12">
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-6">
          {!file ? (
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all space-y-4 ${
                dragActive 
                  ? "border-primary bg-primary/5 scale-[0.99]" 
                  : "border-border hover:border-primary/50 hover:bg-muted/30"
              }`}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                accept=".docx,.pdf,.txt,.md"
                onChange={handleFileChange}
                className="hidden" 
              />
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                <Upload className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-lg">Drag & Drop Document Here</p>
                <p className="text-xs text-muted-foreground">Supports DOCX, PDF, TXT, and MD files</p>
              </div>
              {error && (
                <p className="text-xs text-destructive font-bold">{error}</p>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* File Info Card */}
              <div className="flex justify-between items-center bg-muted/20 p-4 border rounded-xl">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB &bull; {file.type.toUpperCase()} File
                    </p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setFile(null)} 
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                  title="Remove file"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              {/* Conversion Buttons Placeholder */}
              <div className="border-t pt-6 space-y-4">
                <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Select Target Format</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-4 border rounded-xl text-center text-xs text-muted-foreground italic">
                    Conversion options loading...
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
