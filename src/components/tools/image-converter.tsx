"use client"

import React, { useState, useRef, useCallback } from "react"
import Link from "next/link"
import { 
  Upload, 
  Download, 
  Image as ImageIcon, 
  Settings, 
  X, 
  Check, 
  Loader2, 
  Maximize2, 
  FileArchive,
  ArrowRight,
  Lock,
  Unlock,
  Layers,
  Trash2,
  AlertTriangle
} from "lucide-react"
import JSZip from "jszip"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { processImage, IMAGE_PRESETS, formatBytes, ResizeOptions } from "@/lib/image-utils"
import { useUsageLimit } from "@/hooks/use-usage-limit"

interface ImageFile {
  id: string
  file: File
  preview: string
  status: "idle" | "processing" | "completed" | "error"
  progress: number
  resultBlob?: Blob
  resultUrl?: string
  originalSize: number
  resultSize?: number
  resultWidth?: number
  resultHeight?: number
}

const MAX_FREE_IMAGES = 5

// ─── Native Toggle — no Base UI, no library, pure reliable HTML ────────────
function NativeToggle({ 
  checked, 
  onChange, 
  label, 
  description 
}: { 
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  description?: string 
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <p className="text-sm font-bold">{label}</p>
        {description && <p className="text-[10px] text-muted-foreground">{description}</p>}
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

export function ImageConverter({ role = "USER" }: { role?: string }) {
  const isPro = role === "PRO" || role === "ADMIN" || role === "BUSINESS"
  const isBusiness = role === "BUSINESS" || role === "ADMIN"

  const [images, setImages] = useState<ImageFile[]>([])
  const [format, setFormat] = useState<string>("image/webp")
  const [quality, setQuality] = useState<number>(80)
  const [isProcessing, setIsProcessing] = useState(false)
  const [globalProgress, setGlobalProgress] = useState(0)
  const { count: usedToday, increment: incrementUsage } = useUsageLimit("image-converter", "daily")
  
  const currentMax = isBusiness
    ? 100000
    : isPro
      ? 1000
      : Math.max(0, MAX_FREE_IMAGES - usedToday)
  
  // Resize states
  const [resizeMode, setResizeMode] = useState<"original" | "manual" | "preset">("original")
  const [preset, setPreset] = useState<string>("none")
  const [manualWidth, setManualWidth] = useState<string>("")
  const [manualHeight, setManualHeight] = useState<string>("")
  const [lockAspectRatio, setLockAspectRatio] = useState(true)
  
  // Advanced states — plain booleans, no Switch library
  const [stripMetadata, setStripMetadata] = useState(true)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return
    setImages(prev => {
      const remaining = currentMax - prev.length
      if (remaining <= 0) return prev
      const newImages: ImageFile[] = Array.from(files).slice(0, remaining).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file),
        status: "idle",
        progress: 0,
        originalSize: file.size
      }))
      return [...prev, ...newImages]
    })
  }, [])

  const removeImage = (id: string) => {
    setImages(prev => {
      const removed = prev.find(img => img.id === id)
      if (removed?.preview) URL.revokeObjectURL(removed.preview)
      if (removed?.resultUrl) URL.revokeObjectURL(removed.resultUrl)
      return prev.filter(img => img.id !== id)
    })
  }

  const processAll = async () => {
    setIsProcessing(true)
    setGlobalProgress(0)

    const resizeOptions: ResizeOptions = {
      quality,
      format,
      maintainAspectRatio: lockAspectRatio,
    }

    if (resizeMode === "manual") {
      resizeOptions.width = parseInt(manualWidth) || undefined
      resizeOptions.height = parseInt(manualHeight) || undefined
    } else if (resizeMode === "preset" && preset !== "none") {
      const p = IMAGE_PRESETS[preset as keyof typeof IMAGE_PRESETS]
      resizeOptions.width = p.width
      resizeOptions.height = p.height
    }

    // Reset ALL images to idle so re-converting with new settings works
    setImages(prev => prev.map(i => ({
      ...i,
      status: "idle",
      resultBlob: undefined,
      resultUrl: undefined,
      resultSize: undefined,
      resultWidth: undefined,
      resultHeight: undefined,
      progress: 0
    })))

    // Use the current images list (all will be re-processed)
    const snapshot = [...images]
    const total = snapshot.length
    let done = 0

    for (const img of snapshot) {
      setImages(prev => prev.map(i => i.id === img.id ? { ...i, status: "processing" } : i))

      try {
        const result = await processImage(img.file, resizeOptions)
        setImages(prev => prev.map(i => i.id === img.id ? {
          ...i,
          status: "completed",
          resultBlob: result.blob,
          resultUrl: result.url,
          resultSize: result.size,
          resultWidth: result.width,
          resultHeight: result.height,
          progress: 100
        } : i))
      } catch (err) {
        console.error("Image processing failed:", err)
        setImages(prev => prev.map(i => i.id === img.id ? { ...i, status: "error" } : i))
      }

      done++
      setGlobalProgress((done / total) * 100)
    }

    setIsProcessing(false)
    if (!isPro) {
      await incrementUsage(done)
    }
  }

  const downloadAll = async () => {
    // Read directly from current React state — all images are done at this point
    const currentImages = images
    const zip = new JSZip()
    let count = 0

    for (const img of currentImages) {
      if (img.resultBlob && img.status === "completed") {
        const ext = format.split("/")[1] === "jpeg" ? "jpg" : format.split("/")[1]
        const baseName = img.file.name.replace(/\.[^/.]+$/, "")
        zip.file(`${baseName}.${ext}`, img.resultBlob)
        count++
      }
    }

    if (count === 0) return

    const content = await zip.generateAsync({ type: "blob" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(content)
    link.download = `converted-images-${Date.now()}.zip`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
  }

  const totalSaved = images.reduce((acc, img) => {
    if (img.resultSize) return acc + (img.originalSize - img.resultSize)
    return acc
  }, 0)

  const completedImages = images.filter(i => i.status === "completed")

  return (<>
    <div className="grid xl:grid-cols-3 gap-8 pb-8 md:pb-20">
      <div className="xl:col-span-2 space-y-8">
        {/* Upload Area */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-10">
            <div 
              className={cn(
                "border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center transition-all hover:bg-primary/5 group relative",
                images.length >= currentMax ? "opacity-50 cursor-not-allowed border-muted-foreground/20" : "border-primary/20 cursor-pointer"
              )}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                if (images.length < currentMax) handleFiles(e.dataTransfer.files)
              }}
              onClick={() => images.length < currentMax && fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                multiple
                ref={fileInputRef}
                className="hidden" 
                accept="image/*"
                onChange={(e) => handleFiles(e.target.files)}
                disabled={images.length >= currentMax}
              />
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Upload className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-black text-2xl tracking-tight">Drop your images here</h3>
              <p className="text-muted-foreground mt-2 max-w-sm">
                {isBusiness
                  ? "Bulk process unlimited images at once. Supports JPG, PNG, WEBP, AVIF."
                  : isPro 
                    ? "Bulk process up to 1,000 images at once. Supports JPG, PNG, WEBP, AVIF." 
                    : `Process up to 5 images per day. You have ${currentMax} left for today.`}
              </p>
              
              {images.length >= currentMax && !isPro && (
                <div className="mt-4 flex items-center gap-2 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
                  <AlertTriangle className="h-4 w-4" /> Free Limit Reached
                </div>
              )}
            </div>
          </CardContent>
        </Card>
 
        {/* Image Queue */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              Conversion Queue ({images.length}/{isBusiness ? "Unlimited" : currentMax})
            </h3>
            {images.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setImages([])} className="text-destructive hover:bg-destructive/10">
                <Trash2 className="h-4 w-4 mr-2" /> Clear All
              </Button>
            )}
          </div>

          <div className="grid gap-4">
            <AnimatePresence>
              {images.map((img) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="overflow-hidden border-primary/10">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden shrink-0 border relative">
                        <img src={img.preview} alt="Preview" className="w-full h-full object-cover" />
                        {img.status === "completed" && (
                          <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                            <Check className="h-8 w-8 text-white drop-shadow-md" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-sm font-bold break-all pr-4">{img.file.name}</p>
                          <p className="text-[10px] font-black uppercase text-muted-foreground bg-muted px-2 py-0.5 rounded shrink-0">
                            {formatBytes(img.originalSize)}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {img.status === "completed" ? (
                            <>
                              <span className="text-green-500 font-bold flex items-center gap-1">
                                <ArrowRight className="h-3 w-3" /> {formatBytes(img.resultSize!)}
                              </span>
                              <span className="bg-primary/5 text-primary px-2 py-0.5 rounded">
                                Saved {Math.round(((img.originalSize - img.resultSize!) / img.originalSize) * 100)}%
                              </span>
                            </>
                          ) : img.status === "processing" ? (
                            <span className="text-primary animate-pulse font-medium">Processing…</span>
                          ) : img.status === "error" ? (
                            <span className="text-destructive font-medium">Failed</span>
                          ) : (
                            <span>Ready to process</span>
                          )}
                        </div>

                        {img.status === "processing" && (
                          <div className="mt-2">
                            <Progress value={img.progress} className="h-1" />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {img.status === "completed" ? (
                          <a 
                            href={img.resultUrl} 
                            download={`${img.file.name.replace(/\.[^/.]+$/, "")}.${format.split("/")[1] === "jpeg" ? "jpg" : format.split("/")[1]}`}
                            className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-green-500/20 text-green-600 hover:bg-green-500/10 transition-colors"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        ) : (
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="rounded-full h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => removeImage(img.id)}
                            disabled={isProcessing}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {images.length === 0 && (
              <div className="py-20 text-center border-2 border-dashed rounded-2xl opacity-20">
                <ImageIcon className="h-12 w-12 mx-auto mb-4" />
                <p className="font-bold">Queue is empty</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      <div className="space-y-8">
        <Card className="sticky top-24 border-primary/20 shadow-xl shadow-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Conversion Settings
            </CardTitle>
            <CardDescription>Configure output format and quality</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Output Format</Label>
                <Select value={format} onValueChange={(val) => setFormat(val || "")}>
                  <SelectTrigger className="h-12 font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image/webp">WEBP (Modern & Small)</SelectItem>
                    <SelectItem value="image/jpeg">JPG (Standard)</SelectItem>
                    <SelectItem value="image/png">PNG (Lossless)</SelectItem>
                    <SelectItem value="image/avif">AVIF (Next-Gen)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Quality: {quality}%</Label>
                  <span className={cn(
                    "text-[10px] font-black px-2 py-0.5 rounded",
                    quality > 80 ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"
                  )}>
                    {quality > 80 ? "HIGH" : quality > 50 ? "MEDIUM" : "LOW"}
                  </span>
                </div>
                <Slider 
                  value={[quality]} 
                  min={1} 
                  max={100} 
                  step={1}
                  onValueChange={(val) => setQuality(Array.isArray(val) ? val[0] : val)}
                  disabled={format === "image/png"}
                  className="py-4"
                />
              </div>
            </div>

            <div className="space-y-4 border-t pt-8">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <Maximize2 className="h-4 w-4 text-primary" />
                Resizing Options
              </h4>
              
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "original", label: "Original" },
                  { id: "manual", label: "Manual" },
                  { id: "preset", label: "Presets" },
                ].map((mode) => (
                  <Button
                    key={mode.id}
                    variant={resizeMode === mode.id ? "default" : "outline"}
                    size="sm"
                    className="h-10 font-bold"
                    onClick={() => setResizeMode(mode.id as "original" | "manual" | "preset")}
                  >
                    {mode.label}
                  </Button>
                ))}
              </div>

              {resizeMode === "preset" && (
                <Select value={preset} onValueChange={(val) => setPreset(val || "")}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select preset..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(IMAGE_PRESETS).map(([key, p]) => (
                      <SelectItem key={key} value={key}>{p.label} ({p.width}x{p.height})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {resizeMode === "manual" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Width</Label>
                      <Input 
                        placeholder="px" 
                        value={manualWidth} 
                        onChange={(e) => setManualWidth(e.target.value)}
                        className="font-mono h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Height</Label>
                      <Input 
                        placeholder="px" 
                        value={manualHeight} 
                        onChange={(e) => setManualHeight(e.target.value)}
                        className="font-mono h-10"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-muted/50 p-2 rounded-lg">
                    <span className="text-xs font-bold">Lock Aspect Ratio</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => setLockAspectRatio(!lockAspectRatio)}
                    >
                      {lockAspectRatio ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Strip Metadata — pure native toggle, zero library dependency */}
            <div className="border-t pt-6">
              <NativeToggle
                checked={stripMetadata}
                onChange={setStripMetadata}
                label="Strip Metadata"
                description="Remove GPS, camera info, etc."
              />
            </div>

            <div className="pt-2">
              <Button 
                className="w-full h-14 text-lg font-black tracking-tight shadow-lg shadow-primary/20" 
                onClick={processAll}
                disabled={images.length === 0 || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Processing {Math.round(globalProgress)}%
                  </>
                ) : (
                  <>
                    Start Bulk Conversion
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats + Download All */}
        {completedImages.length > 0 && (
          <Card className="bg-green-500/5 border-green-500/20 overflow-hidden relative">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-500/10 p-3 rounded-2xl">
                  <FileArchive className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    {completedImages.length} of {images.length} Converted
                  </p>
                  <p className="text-3xl font-black text-green-600 tracking-tighter">{formatBytes(totalSaved)}</p>
                  <p className="text-xs text-muted-foreground">saved</p>
                </div>
              </div>
              <Button 
                className="w-full mt-6 bg-green-600 hover:bg-green-700 h-12 font-bold" 
                onClick={downloadAll}
              >
                <Download className="h-4 w-4 mr-2" />
                Download All as ZIP ({completedImages.length} files)
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Upgrade Prompt */}
        {!isPro && (
          <Card className="bg-primary border-none text-primary-foreground overflow-hidden">
            <CardContent className="p-6 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
              <h4 className="text-xl font-black tracking-tight mb-1">Go Pro for Unlimited</h4>
              <p className="text-xs opacity-80 mb-6">Process thousands of images with 1-click download and zero limits.</p>
              <Button variant="secondary" className="w-full font-bold h-10" asChild>
                <Link href="/pricing">Upgrade Now</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>

    {/* SEO Info Section */}
    <div className="grid md:grid-cols-2 gap-12 mt-8 md:mt-16 border-t pt-12 pb-20">
      <section>
        <h2 className="text-2xl font-black tracking-tight mb-4">What is Image Conversion?</h2>
        <p className="text-muted-foreground leading-relaxed">
          Image conversion is the process of changing an image from one file format to another — for example, converting a PNG to WEBP or a JPG to AVIF. Different formats use different compression algorithms, which can dramatically affect file size, quality, and browser compatibility.
        </p>
        <p className="text-muted-foreground mt-4 leading-relaxed">
          Our tool performs all conversion directly in your browser using the HTML5 Canvas API. Your images are never uploaded to a server — ensuring complete privacy and instant processing with no file size restrictions per image.
        </p>
        <h3 className="text-lg font-bold mt-8 mb-3">Supported Formats</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { fmt: "WEBP", desc: "Best overall: 30% smaller than JPG with similar quality." },
            { fmt: "AVIF", desc: "Next-gen: up to 50% smaller, perfect for modern browsers." },
            { fmt: "JPG", desc: "Universal compatibility, ideal for photos." },
            { fmt: "PNG", desc: "Lossless quality, best for logos and graphics with transparency." },
          ].map(item => (
            <div key={item.fmt} className="bg-muted/40 rounded-xl p-3 border border-primary/5">
              <p className="font-black text-primary text-sm">{item.fmt}</p>
              <p className="text-[11px] text-muted-foreground mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted/30 p-8 rounded-3xl border border-primary/5">
        <h3 className="text-xl font-black tracking-tight mb-6">Why Optimize Your Images?</h3>
        <ul className="space-y-5 list-none p-0">
          {[
            { title: "Faster Page Loads", desc: "Images account for up to 75% of a webpage's total data. Converting to WEBP or AVIF can cut that dramatically, improving Time to Interactive (TTI)." },
            { title: "Better Core Web Vitals", desc: "Google's ranking algorithm uses Largest Contentful Paint (LCP) as a key signal. Optimized images directly improve your LCP score." },
            { title: "Lower Bandwidth Costs", desc: "Smaller images mean less data transferred — saving money for sites with high traffic or users on metered connections." },
            { title: "Improved Mobile UX", desc: "Mobile users on slower networks benefit the most from optimized images. A 2MB PNG converted to a 200KB WEBP loads 10x faster." },
            { title: "Bulk Processing", desc: "Process up to 5 images at once in the free plan. Each image is independently optimized and can be downloaded separately or as a ZIP archive." },
          ].map((item, i) => (
            <li key={i} className="flex gap-4">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black text-primary">
                {i + 1}
              </div>
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
