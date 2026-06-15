"use client"

import { useState, useRef } from "react"
import { PDFDocument, rgb, degrees } from "pdf-lib"
import { useUsageLimit } from "@/hooks/use-usage-limit"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { UploadCloud, File, AlertCircle, Crown, Download, Image as ImageIcon } from "lucide-react"
import Link from "next/link"

interface PdfWatermarkerProps {
  role: string
}

export function PdfWatermarker({ role }: PdfWatermarkerProps) {
  const isPro = role === "PRO" || role === "BUSINESS" || role === "ADMIN"
  const limit = 5
  const { count, increment, loading } = useUsageLimit("pdf-watermark", "monthly")
  
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  
  // Text Watermark State
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL")
  const [fontSize, setFontSize] = useState("48")
  const [opacity, setOpacity] = useState("0.5")
  const [rotation, setRotation] = useState("45")
  const [color, setColor] = useState("#FF0000") // hex
  
  // Image Watermark State
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageScale, setImageScale] = useState("0.5")
  const [imageOpacity, setImageOpacity] = useState("0.5")

  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const pdfInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const limitReached = !isPro && count >= limit

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPdfFile(e.target.files[0])
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0])
    }
  }

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
    } : { r: 1, g: 0, b: 0 }
  }

  const doApplyTextWatermark = async () => {
    if (!pdfFile) return setError("Please upload a PDF file.")
    if (!watermarkText.trim()) return setError("Please enter watermark text.")
    
    setError(null)
    setIsProcessing(true)

    try {
      const arrayBuffer = await pdfFile.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      const pages = pdfDoc.getPages()
      const { r, g, b } = hexToRgb(color)

      for (const page of pages) {
        const { width, height } = page.getSize()
        page.drawText(watermarkText, {
          x: width / 4,
          y: height / 4,
          size: parseInt(fontSize) || 48,
          color: rgb(r, g, b),
          opacity: parseFloat(opacity) || 0.5,
          rotate: degrees(parseInt(rotation) || 45)
        })
      }
      
      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `watermarked-${pdfFile.name}`
      link.click()
      URL.revokeObjectURL(url)

      if (!isPro) increment()
    } catch (e: any) {
      setError(e.message || "Failed to apply text watermark")
    } finally {
      setIsProcessing(false)
    }
  }

  const doApplyImageWatermark = async () => {
    if (!pdfFile) return setError("Please upload a PDF file.")
    if (!imageFile) return setError("Please upload an image for the watermark.")
    
    setError(null)
    setIsProcessing(true)

    try {
      const pdfArrayBuffer = await pdfFile.arrayBuffer()
      const pdfDoc = await PDFDocument.load(pdfArrayBuffer)
      const pages = pdfDoc.getPages()

      const imageArrayBuffer = await imageFile.arrayBuffer()
      let watermarkImage
      if (imageFile.type === 'image/png') {
        watermarkImage = await pdfDoc.embedPng(imageArrayBuffer)
      } else if (imageFile.type === 'image/jpeg' || imageFile.type === 'image/jpg') {
        watermarkImage = await pdfDoc.embedJpg(imageArrayBuffer)
      } else {
        throw new Error("Only PNG and JPG images are supported.")
      }

      const imgDims = watermarkImage.scale(parseFloat(imageScale) || 0.5)

      for (const page of pages) {
        const { width, height } = page.getSize()
        page.drawImage(watermarkImage, {
          x: width / 2 - imgDims.width / 2,
          y: height / 2 - imgDims.height / 2,
          width: imgDims.width,
          height: imgDims.height,
          opacity: parseFloat(imageOpacity) || 0.5,
        })
      }
      
      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `watermarked-${pdfFile.name}`
      link.click()
      URL.revokeObjectURL(url)

      if (!isPro) increment()
    } catch (e: any) {
      setError(e.message || "Failed to apply image watermark")
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
            <CardTitle>PDF Watermarker</CardTitle>
            <CardDescription>Apply custom text or image watermarks to all pages of a PDF securely in your browser.</CardDescription>
          </div>
          {!isPro && (
            <div className="text-sm font-semibold px-3 py-1 bg-muted rounded-full">
              {count} / {limit} uses
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {error && (
          <div className="p-4 bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="font-medium text-sm">{error}</span>
          </div>
        )}

        {/* 1. Upload Target PDF */}
        <div className="space-y-3">
          <Label className="text-base">1. Upload Target PDF</Label>
          <div 
            className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors cursor-pointer bg-muted/20"
            onClick={() => pdfInputRef.current?.click()}
          >
            <input type="file" accept="application/pdf" className="hidden" ref={pdfInputRef} onChange={handlePdfUpload} />
            <UploadCloud className="w-8 h-8 text-muted-foreground" />
            <p className="font-medium">Click to select PDF</p>
          </div>
          {pdfFile && (
            <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
              <File className="w-5 h-5 text-primary shrink-0" />
              <span className="text-sm font-medium truncate">{pdfFile.name}</span>
            </div>
          )}
        </div>

        {/* 2. Configure Watermark */}
        <div className="space-y-3">
          <Label className="text-base">2. Configure Watermark</Label>
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="text">Text Watermark</TabsTrigger>
              <TabsTrigger value="image">Image Watermark</TabsTrigger>
            </TabsList>

            {/* TEXT WATERMARK */}
            <TabsContent value="text" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label>Watermark Text</Label>
                  <Input value={watermarkText} onChange={e => setWatermarkText(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Color (Hex)</Label>
                  <Input type="color" value={color} onChange={e => setColor(e.target.value)} className="h-10 cursor-pointer" />
                </div>
                <div className="space-y-2">
                  <Label>Font Size</Label>
                  <Input type="number" value={fontSize} onChange={e => setFontSize(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Opacity (0.1 to 1.0)</Label>
                  <Input type="number" step="0.1" min="0.1" max="1" value={opacity} onChange={e => setOpacity(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Rotation (Degrees)</Label>
                  <Input type="number" value={rotation} onChange={e => setRotation(e.target.value)} />
                </div>
              </div>

              <Button 
                size="lg" 
                className="w-full font-bold" 
                disabled={!pdfFile || isProcessing}
                onClick={doApplyTextWatermark}
              >
                {isProcessing ? "Processing..." : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Apply & Download PDF
                  </>
                )}
              </Button>
            </TabsContent>

            {/* IMAGE WATERMARK */}
            <TabsContent value="image" className="space-y-6">
              <div 
                className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors cursor-pointer bg-muted/20"
                onClick={() => imageInputRef.current?.click()}
              >
                <input type="file" accept="image/png, image/jpeg" className="hidden" ref={imageInputRef} onChange={handleImageUpload} />
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
                <p className="font-medium">Click to select PNG/JPG Logo</p>
              </div>
              {imageFile && (
                <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                  <ImageIcon className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm font-medium truncate">{imageFile.name}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Scale</Label>
                  <Input type="number" step="0.1" min="0.1" value={imageScale} onChange={e => setImageScale(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Opacity (0.1 to 1.0)</Label>
                  <Input type="number" step="0.1" min="0.1" max="1" value={imageOpacity} onChange={e => setImageOpacity(e.target.value)} />
                </div>
              </div>

              <Button 
                size="lg" 
                className="w-full font-bold" 
                disabled={!pdfFile || !imageFile || isProcessing}
                onClick={doApplyImageWatermark}
              >
                {isProcessing ? "Processing..." : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Apply & Download PDF
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}
