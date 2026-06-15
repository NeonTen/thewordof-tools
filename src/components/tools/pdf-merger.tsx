"use client"

import { useState, useRef } from "react"
import { PDFDocument } from "pdf-lib"
import { useUsageLimit } from "@/hooks/use-usage-limit"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { UploadCloud, File, X, Download, AlertCircle, Crown } from "lucide-react"
import Link from "next/link"

interface PdfMergerProps {
  role: string
}

export function PdfMerger({ role }: PdfMergerProps) {
  const isPro = role === "PRO" || role === "BUSINESS" || role === "ADMIN"
  const limit = 5
  const { count, increment, loading } = useUsageLimit("pdf-merger", "monthly")
  
  const [mergeFiles, setMergeFiles] = useState<File[]>([])
  const [splitFile, setSplitFile] = useState<File | null>(null)
  const [splitStart, setSplitStart] = useState<string>("1")
  const [splitEnd, setSplitEnd] = useState<string>("1")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mergeInputRef = useRef<HTMLInputElement>(null)
  const splitInputRef = useRef<HTMLInputElement>(null)

  const limitReached = !isPro && count >= limit

  const handleMergeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMergeFiles(prev => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const removeMergeFile = (index: number) => {
    setMergeFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSplitUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSplitFile(e.target.files[0])
    }
  }

  const doMerge = async () => {
    if (mergeFiles.length < 2) {
      setError("Please add at least 2 PDF files to merge.")
      return
    }
    setError(null)
    setIsProcessing(true)

    try {
      const mergedPdf = await PDFDocument.create()
      for (const file of mergeFiles) {
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await PDFDocument.load(arrayBuffer)
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        copiedPages.forEach((page) => mergedPdf.addPage(page))
      }
      
      const pdfBytes = await mergedPdf.save()
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "merged-document.pdf"
      link.click()
      URL.revokeObjectURL(url)

      if (!isPro) increment()
    } catch (e: any) {
      setError(e.message || "Failed to merge PDFs")
    } finally {
      setIsProcessing(false)
    }
  }

  const doSplit = async () => {
    if (!splitFile) {
      setError("Please select a PDF file to split.")
      return
    }
    const start = parseInt(splitStart)
    const end = parseInt(splitEnd)
    if (isNaN(start) || isNaN(end) || start < 1 || start > end) {
      setError("Please enter a valid page range.")
      return
    }

    setError(null)
    setIsProcessing(true)

    try {
      const arrayBuffer = await splitFile.arrayBuffer()
      const originalPdf = await PDFDocument.load(arrayBuffer)
      const totalPages = originalPdf.getPageCount()
      
      if (end > totalPages) {
        throw new Error(`End page exceeds total pages (${totalPages}).`)
      }

      const newPdf = await PDFDocument.create()
      // pdf-lib pages are 0-indexed
      const pageIndices = Array.from({ length: end - start + 1 }, (_, i) => start - 1 + i)
      const copiedPages = await newPdf.copyPages(originalPdf, pageIndices)
      copiedPages.forEach((page) => newPdf.addPage(page))
      
      const pdfBytes = await newPdf.save()
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `split-document-${start}-${end}.pdf`
      link.click()
      URL.revokeObjectURL(url)

      if (!isPro) increment()
    } catch (e: any) {
      setError(e.message || "Failed to split PDF")
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading) return null

  if (limitReached) {
    return (
      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
            <Crown className="w-6 h-6 text-amber-500" />
          </div>
          <CardTitle className="text-2xl">Monthly Limit Reached</CardTitle>
          <CardDescription className="text-base mt-2">
            You've used your {limit} free PDF operations for this month. 
            Upgrade to Pro to unlock unlimited operations and support our servers.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-8">
          <Button size="lg" asChild className="font-bold">
            <Link href="/pricing">Upgrade to Pro</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>PDF Tools</CardTitle>
            <CardDescription>All processing happens locally in your browser.</CardDescription>
          </div>
          {!isPro && (
            <div className="text-sm font-semibold px-3 py-1 bg-muted rounded-full">
              {count} / {limit} uses
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="font-medium text-sm">{error}</span>
          </div>
        )}

        <Tabs defaultValue="merge" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="merge">Merge PDFs</TabsTrigger>
            <TabsTrigger value="split">Extract Pages</TabsTrigger>
          </TabsList>

          {/* MERGE TAB */}
          <TabsContent value="merge" className="space-y-6">
            <div 
              className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center gap-4 hover:border-primary/50 transition-colors cursor-pointer bg-muted/20"
              onClick={() => mergeInputRef.current?.click()}
            >
              <input 
                type="file" 
                multiple 
                accept="application/pdf" 
                className="hidden" 
                ref={mergeInputRef} 
                onChange={handleMergeUpload}
              />
              <UploadCloud className="w-10 h-10 text-muted-foreground" />
              <div className="text-center">
                <p className="font-medium">Click to select PDF files</p>
                <p className="text-sm text-muted-foreground">Select 2 or more files to merge</p>
              </div>
            </div>

            {mergeFiles.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-widest">Selected Files ({mergeFiles.length})</h4>
                <div className="grid gap-2">
                  {mergeFiles.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <File className="w-5 h-5 text-primary shrink-0" />
                        <span className="text-sm font-medium truncate">{f.name}</span>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeMergeFile(i)} className="text-muted-foreground hover:text-red-500">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button 
              size="lg" 
              className="w-full font-bold" 
              disabled={mergeFiles.length < 2 || isProcessing}
              onClick={doMerge}
            >
              {isProcessing ? "Processing..." : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Merge & Download
                </>
              )}
            </Button>
          </TabsContent>

          {/* SPLIT TAB */}
          <TabsContent value="split" className="space-y-6">
            <div 
              className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center gap-4 hover:border-primary/50 transition-colors cursor-pointer bg-muted/20"
              onClick={() => splitInputRef.current?.click()}
            >
              <input 
                type="file" 
                accept="application/pdf" 
                className="hidden" 
                ref={splitInputRef} 
                onChange={handleSplitUpload}
              />
              <UploadCloud className="w-10 h-10 text-muted-foreground" />
              <div className="text-center">
                <p className="font-medium">Click to select a PDF file</p>
                <p className="text-sm text-muted-foreground">Select 1 file to extract pages from</p>
              </div>
            </div>

            {splitFile && (
              <div className="flex items-center gap-3 p-4 rounded-lg border bg-card border-primary/20">
                <File className="w-6 h-6 text-primary shrink-0" />
                <span className="text-sm font-bold truncate">{splitFile.name}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Page</Label>
                <Input type="number" min="1" value={splitStart} onChange={e => setSplitStart(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>End Page</Label>
                <Input type="number" min="1" value={splitEnd} onChange={e => setSplitEnd(e.target.value)} />
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full font-bold" 
              disabled={!splitFile || isProcessing}
              onClick={doSplit}
            >
              {isProcessing ? "Processing..." : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Extract Pages
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
