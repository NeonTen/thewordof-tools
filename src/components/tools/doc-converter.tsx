"use client"

import { useState, useRef } from "react"
import { FileText, Loader2, Upload, Trash2, ArrowRight, Sparkles } from "lucide-react"
import { useUsageLimit } from "@/hooks/use-usage-limit"
import { ProGate, ProBadge } from "@/components/ui/pro-gate"

interface UploadedFile {
  name: string
  size: number
  type: string
  content: ArrayBuffer | string
}

export function DocConverter({ role = "USER" }: { role?: string }) {
  const isPro = role === "PRO" || role === "ADMIN" || role === "BUSINESS"

  const [file, setFile] = useState<UploadedFile | null>(null)
  const [converting, setConverting] = useState(false)
  const [error, setError] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { count: usedToday, increment: incrementUsage } = useUsageLimit("doc-converter", "daily")
  const limitReached = !isPro && usedToday >= 5

  const activeId = "" // placeholder or unneeded

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
    if (limitReached) {
      setError("Daily conversion limit reached. Please upgrade to Pro for unlimited conversions.")
      return
    }

    const ext = selected.name.split(".").pop()?.toLowerCase() || ""
    const allowed = ["docx", "pdf", "txt", "md"]
    if (!allowed.includes(ext)) {
      setError("Unsupported file format. Please upload .docx, .pdf, .txt, or .md")
      return
    }

    if (ext === "pdf" && !isPro) {
      setError("PDF parsing is a Pro feature. Please upgrade to convert PDF documents.")
      return
    }

    const maxSize = isPro ? 25 * 1024 * 1024 : 2 * 1024 * 1024
    if (selected.size > maxSize) {
      setError(`File size exceeds limit. Max allowed is ${isPro ? "25MB" : "2MB (Free)"}.`)
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

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadDocx = (text: string, filename: string) => {
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><title>Document</title><style>body { font-family: Arial; }</style></head><body>"
    const footer = "</body></html>"
    const formattedHtml = text.split("\n").map(p => `<p>${p || "&nbsp;"}</p>`).join("")
    const sourceHTML = header + formattedHtml + footer
    const blob = new Blob([sourceHTML], { type: "application/vnd.ms-word" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename.replace(/\.[^/.]+$/, "") + ".docx"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadPdfFromText = async (text: string, filename: string) => {
    const { jsPDF } = await import("jspdf")
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4"
    })

    const pageWidth = doc.internal.pageSize.getWidth()   // 595.28 pt
    const pageHeight = doc.internal.pageSize.getHeight()  // 841.89 pt
    const margin = 72  // 1 inch margins
    const usableWidth = pageWidth - margin * 2
    const fontSize = 12
    const lineHeight = 18  // 1.5x font size

    doc.setFont("helvetica", "normal")
    doc.setFontSize(fontSize)

    const lines = doc.splitTextToSize(text, usableWidth)
    let y = margin + fontSize // start baseline below top margin

    for (let i = 0; i < lines.length; i++) {
      if (y + lineHeight > pageHeight - margin) {
        doc.addPage()
        y = margin + fontSize
      }
      doc.text(lines[i], margin, y)
      y += lineHeight
    }

    doc.save(filename.replace(/\.[^/.]+$/, "") + ".pdf")
  }

  const downloadPdf = async (htmlContent: string, filename: string) => {
    const { jsPDF } = await import("jspdf")
    const html2canvas = (await import("html2canvas")).default

    const container = document.createElement("div")
    container.id = "pdf-render-container"
    container.style.position = "absolute"
    container.style.top = "0"
    container.style.left = "0"
    container.style.width = "523px" // A4 content area (595.28 - 2×36 margins) — 1px = 1pt
    container.style.padding = "0" // Margins handled by jsPDF margin option for all pages
    container.style.boxSizing = "border-box"
    container.style.background = "#ffffff"
    container.style.color = "#222222"
    container.style.display = "block"
    container.style.overflow = "hidden"
    container.style.zIndex = "99998"

    container.innerHTML = `
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        #pdf-render-container, #pdf-render-container div { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #222; line-height: 1.5; font-size: 11px; overflow-wrap: break-word; word-break: break-word; }
        h1, h2, h3, h4, h5, h6 { color: #1a1a1a; font-weight: 700; line-height: 1.3; }
        h1 { font-size: 20px; margin-bottom: 4px; margin-top: 0; }
        h2 { font-size: 15px; padding-bottom: 2px; margin-top: 10px; margin-bottom: 4px; }
        h3 { font-size: 13px; margin-top: 8px; margin-bottom: 3px; }
        p { margin: 0 0 4px 0; font-size: 11px; text-align: left; }
        ul, ol { margin: 0 0 4px 0; padding-left: 18px; }
        ul { list-style-type: disc; }
        ol { list-style-type: decimal; }
        li { margin-bottom: 2px; font-size: 11px; }
        a { color: #2563eb; text-decoration: none; }
        hr { border: 0; border-top: 1px solid #e5e7eb; margin: 8px 0; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 8px; }
        th, td { border: 1px solid #ddd; padding: 4px; text-align: left; font-size: 10px; }
        th { background-color: #f5f5f5; font-weight: bold; }
        strong { font-weight: 700; }
        em { font-style: italic; }
      </style>
      <div>${htmlContent}</div>
    `
    document.body.appendChild(container)

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4"
      })

      const pageMargin = 36 // 36pt = 0.5 inch on all sides, all pages

      await new Promise<void>((resolve, reject) => {
        doc.html(container, {
          callback: function (pdf) {
            pdf.save(filename.replace(/\.[^/.]+$/, "") + ".pdf")
            resolve()
          },
          x: 0,
          y: 0,
          width: 523.28, // Content area width (A4 width minus margins)
          windowWidth: 523, // Match container width
          margin: [pageMargin, pageMargin, pageMargin, pageMargin], // Consistent margins on ALL pages
          autoPaging: "text",
          html2canvas: {
            scale: 1,
            useCORS: true,
            logging: false,
            windowWidth: 523,
            onclone: (clonedDoc) => {
              clonedDoc.body.style.margin = "0"
              clonedDoc.body.style.padding = "0"
              clonedDoc.body.style.overflow = "visible"
            }
          }
        })
      })
    } catch (err) {
      console.error("HTML to PDF conversion failed, trying fallback text mode", err)
      const doc = new jsPDF()
      const margin = 15
      const pageHeight = doc.internal.pageSize.height
      const plainText = htmlContent.replace(/<[^>]+>/g, "\n").replace(/\n+/g, "\n")
      const splitText = doc.splitTextToSize(plainText, 180)
      let y = 20

      for (let i = 0; i < splitText.length; i++) {
        if (y > pageHeight - 20) {
          doc.addPage()
          y = 20
        }
        doc.text(splitText[i], margin, y)
        y += 8
      }
      doc.save(filename.replace(/\.[^/.]+$/, "") + ".pdf")
    } finally {
      document.body.removeChild(container)
    }
  }

  const handleConvert = async (target: string) => {
    if (!file) return
    setConverting(true)
    setError("")

    try {
      if (file.type === "docx") {
        const mammoth = await import("mammoth")
        const result = await mammoth.convertToHtml({ arrayBuffer: file.content as ArrayBuffer })
        // Clean garbled emoji/icon remnants using DOM-level text node cleanup
        // (string regex can't reliably match because exact byte sequences vary per .docx)
        const cleanDiv = document.createElement("div")
        cleanDiv.innerHTML = result.value
        const walker = document.createTreeWalker(cleanDiv, NodeFilter.SHOW_TEXT)
        while (walker.nextNode()) {
          const node = walker.currentNode
          if (node.textContent) {
            // Strip non-ASCII characters that are NOT embedded within words
            // Garbled emoji remnants are standalone; legitimate accented chars (é, ñ) are mid-word
            node.textContent = node.textContent.replace(/[^\x00-\x7F]+/g, (match, offset, str) => {
              const charBefore = offset > 0 ? str[offset - 1] : ""
              const charAfter = str[offset + match.length] || ""
              // Keep if it's inside a word (letter on both sides)
              if (/[a-zA-Z]/.test(charBefore) && /[a-zA-Z]/.test(charAfter)) {
                return match
              }
              return "" // Strip standalone non-ASCII (garbled emojis, symbol font garbage)
            })
          }
        }
        const html = cleanDiv.innerHTML

        if (target === "txt") {
          const text = html.replace(/<[^>]+>/g, "\n").replace(/\n+/g, "\n")
          downloadFile(text, file.name.replace(".docx", ".txt"), "text/plain")
        } else if (target === "md") {
          const md = html
            .replace(/<h1>(.*?)<\/h1>/g, "# $1\n\n")
            .replace(/<h2>(.*?)<\/h2>/g, "## $1\n\n")
            .replace(/<h3>(.*?)<\/h3>/g, "### $1\n\n")
            .replace(/<p>(.*?)<\/p>/g, "$1\n\n")
            .replace(/<li>(.*?)<\/li>/g, "* $1\n")
            .replace(/<[^>]+>/g, "")
          downloadFile(md, file.name.replace(".docx", ".md"), "text/markdown")
        } else if (target === "pdf") {
          await downloadPdf(html, file.name)
        }
      } else if (file.type === "pdf") {
        const pdfjs = await import("pdfjs-dist")
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version || "6.0.227"}/build/pdf.worker.min.js`
        
        const loadingTask = pdfjs.getDocument({ data: file.content as ArrayBuffer })
        const pdf = await loadingTask.promise
        let textContent = ""
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const content = await page.getTextContent()
          const strings = content.items.map((item: any) => item.str).join(" ")
          textContent += strings + "\n\n"
        }

        if (target === "txt") {
          downloadFile(textContent, file.name.replace(".pdf", ".txt"), "text/plain")
        } else if (target === "docx") {
          downloadDocx(textContent, file.name.replace(".pdf", ".docx"))
        }
      } else if (file.type === "txt" || file.type === "md") {
        const text = new TextDecoder().decode(file.content as ArrayBuffer)
        if (target === "pdf") {
          if (file.type === "md") {
            const { marked } = await import("marked")
            const htmlContent = await marked.parse(text)
            await downloadPdf(htmlContent, file.name)
          } else {
            await downloadPdfFromText(text, file.name)
          }
        } else if (target === "docx") {
          downloadDocx(text, file.name)
        }
      }
      await incrementUsage(1)
    } catch (err: any) {
      console.error(err)
      setError("Conversion failed: " + (err.message || "Unknown error"))
    } finally {
      setConverting(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {converting && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[99999] flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="font-bold text-lg">Generating PDF document...</p>
        </div>
      )}
      <div className="lg:col-span-12">
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-6">
          {!file ? (
            <div className="space-y-4">
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
              {!isPro && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Daily conversions used: {usedToday} / 5 &bull; Max size: 2MB (Free) / 25MB (Pro)
                </p>
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

              {/* Conversion Buttons */}
              <div className="border-t pt-6 space-y-4">
                <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Select Target Format</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {converting ? (
                    <div className="col-span-full flex items-center justify-center gap-2 p-6 border rounded-xl bg-muted/10 text-sm font-semibold">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      Converting document, please wait...
                    </div>
                  ) : (
                    <>
                      {file.type === "docx" && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleConvert("pdf")}
                            className="p-4 border border-border rounded-xl text-center font-bold hover:border-primary hover:bg-primary/5 transition-all text-sm cursor-pointer shadow-sm"
                          >
                            Convert to PDF
                          </button>
                          <button
                            type="button"
                            onClick={() => handleConvert("md")}
                            className="p-4 border border-border rounded-xl text-center font-bold hover:border-primary hover:bg-primary/5 transition-all text-sm cursor-pointer shadow-sm"
                          >
                            Convert to Markdown
                          </button>
                          <button
                            type="button"
                            onClick={() => handleConvert("txt")}
                            className="p-4 border border-border rounded-xl text-center font-bold hover:border-primary hover:bg-primary/5 transition-all text-sm cursor-pointer shadow-sm"
                          >
                            Convert to Plain Text
                          </button>
                        </>
                      )}

                      {file.type === "pdf" && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleConvert("txt")}
                            className="p-4 border border-border rounded-xl text-center font-bold hover:border-primary hover:bg-primary/5 transition-all text-sm cursor-pointer shadow-sm"
                          >
                            Convert to Plain Text
                          </button>
                          <ProGate feature="PDF to Word Converter" isPro={isPro}>
                            <button
                              type="button"
                              onClick={() => handleConvert("docx")}
                              className="p-4 border border-border rounded-xl text-center font-bold hover:border-primary hover:bg-primary/5 transition-all text-sm cursor-pointer shadow-sm w-full"
                            >
                              Convert to Word (.docx) <ProBadge />
                            </button>
                          </ProGate>
                        </>
                      )}

                      {(file.type === "txt" || file.type === "md") && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleConvert("pdf")}
                            className="p-4 border border-border rounded-xl text-center font-bold hover:border-primary hover:bg-primary/5 transition-all text-sm cursor-pointer shadow-sm"
                          >
                            Convert to PDF
                          </button>
                          <button
                            type="button"
                            onClick={() => handleConvert("docx")}
                            className="p-4 border border-border rounded-xl text-center font-bold hover:border-primary hover:bg-primary/5 transition-all text-sm cursor-pointer shadow-sm"
                          >
                            Convert to Word (.docx)
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
