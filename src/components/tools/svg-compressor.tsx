"use client"

import React, { useState, useCallback } from "react"
import { 
  FileCode, 
  Upload, 
  Download, 
  Trash2, 
  Settings, 
  Copy, 
  Check, 
  Code as CodeIcon, 
  Zap, 
  Monitor, 
  ArrowRight,
  Maximize2,
  Search,
  LayoutSplit,
  Eye,
  Info,
  ChevronRight,
  FileUp,
  Type,
  FileArchive
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import JSZip from "jszip"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { optimizeSVG, SVGOptions } from "@/lib/svg-utils"

// Pure native toggle — no Base UI dependency, always reliable
function NativeToggle({
  checked,
  onChange,
  label,
  description,
  bordered = false
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  description?: string
  bordered?: boolean
}) {
  return (
    <div className={cn("flex items-center justify-between", bordered && "border-t pt-4")}>
      <div className="space-y-0.5">
        <p className="text-xs font-bold">{label}</p>
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

interface SVGFile {
  id: string
  name: string
  originalCode: string
  optimizedCode: string
  originalSize: number
  optimizedSize: number
  status: "idle" | "optimized"
}

const MAX_FREE_FILES = 5

export function SVGCompressor({ isPro = false }: { isPro?: boolean }) {
  const [activeTab, setActiveTab] = useState<string>("upload")
  const [pastedCode, setPastedCode] = useState<string>("")
  const [svgFiles, setSvgFiles] = useState<SVGFile[]>([])
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [copied, setCopied] = useState(false)
  
  const currentMax = isPro ? 1000 : MAX_FREE_FILES
  
  // Optimization settings
  const [options, setOptions] = useState<SVGOptions>({
    minify: true,
    removeMetadata: true,
    removeComments: true,
    currentColor: false,
    pretty: false,
  })

  const handleFileUpload = useCallback(async (files: FileList | null) => {
    if (!files) return

    setSvgFiles(prev => {
      const remaining = currentMax - prev.length
      if (remaining <= 0) return prev
      
      const newFiles: SVGFile[] = []
      const filesArray = Array.from(files).slice(0, remaining)
      
      for (const file of filesArray) {
        if (file.type !== "image/svg+xml") continue
        
        // Use a promise to read file text since we're inside setState
        const readFile = async () => {
          const text = await file.text()
          setSvgFiles(current => {
            if (current.some(f => f.name === file.name && f.originalSize === text.length)) return current
            return [...current, {
              id: Math.random().toString(36).substr(2, 9),
              name: file.name,
              originalCode: text,
              optimizedCode: "",
              originalSize: text.length,
              optimizedSize: 0,
              status: "idle"
            }]
          })
        }
        readFile()
      }
      return prev
    })
  }, [currentMax])

  const optimizeAll = () => {
    setIsOptimizing(true)
    
    // If in Paste mode
    if (activeTab === "paste" && pastedCode) {
      const optimized = optimizeSVG(pastedCode, options)
      setSvgFiles([{
        id: "paste-result",
        name: "pasted-svg.svg",
        originalCode: pastedCode,
        optimizedCode: optimized,
        originalSize: pastedCode.length,
        optimizedSize: optimized.length,
        status: "optimized"
      }])
    } else {
      // Reset all to idle first, then re-optimize with new settings
      setSvgFiles(prev => prev.map(file => {
        const optimized = optimizeSVG(file.originalCode, options)
        return {
          ...file,
          optimizedCode: optimized,
          optimizedSize: optimized.length,
          status: "optimized" as const
        }
      }))
    }
    
    // Use isOptimizing (not isProcessing — that was a bug)
    setIsOptimizing(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadFile = (file: SVGFile) => {
    const blob = new Blob([file.optimizedCode], { type: "image/svg+xml" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = file.name
    link.click()
  }

  const downloadAllAsZip = async () => {
    const zip = new JSZip()
    svgFiles.forEach(file => {
      if (file.optimizedCode) {
        zip.file(file.name, file.optimizedCode)
      }
    })
    const content = await zip.generateAsync({ type: "blob" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(content)
    link.download = "optimized-svgs.zip"
    link.click()
  }

  const totalSaved = svgFiles.reduce((acc, file) => acc + (file.originalSize - file.optimizedSize), 0)
  const averageSaving = svgFiles.length > 0 
    ? Math.round((totalSaved / svgFiles.reduce((acc, file) => acc + file.originalSize, 0)) * 100) 
    : 0

  return (
    <div className="space-y-8 pb-20">
      <div className="grid xl:grid-cols-4 gap-8">
        {/* Input Section */}
        <div className="xl:col-span-3 space-y-8">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-1 pt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="px-6 flex items-center justify-between">
                  <TabsList className="bg-background/50 border">
                    <TabsTrigger value="upload" className="font-bold gap-2">
                      <Upload className="h-4 w-4" /> Upload Files
                    </TabsTrigger>
                    <TabsTrigger value="paste" className="font-bold gap-2">
                      <CodeIcon className="h-4 w-4" /> Paste Code
                    </TabsTrigger>
                  </TabsList>
                  
                  {svgFiles.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => setSvgFiles([])} className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" /> Clear All
                    </Button>
                  )}
                </div>

                <TabsContent value="upload" className="p-6">
                    <div 
                      className={cn(
                        "border-2 border-dashed border-primary/20 rounded-2xl p-12 flex flex-col items-center justify-center text-center transition-all group",
                        svgFiles.length >= currentMax ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-primary/5"
                      )}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault()
                        if (svgFiles.length < currentMax) handleFileUpload(e.dataTransfer.files)
                      }}
                      onClick={() => svgFiles.length < currentMax && document.getElementById("svg-upload")?.click()}
                    >
                      <input 
                        type="file" 
                        id="svg-upload"
                        multiple 
                        accept=".svg" 
                        className="hidden" 
                        onChange={(e) => handleFileUpload(e.target.files)}
                        disabled={svgFiles.length >= currentMax}
                      />
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <FileUp className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-black tracking-tight">Drop your SVG files</h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        Bulk process up to {currentMax} SVGs at once.
                      </p>

                      {svgFiles.length >= currentMax && !isPro && (
                        <div className="mt-4 flex items-center gap-2 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
                          <Zap className="h-4 w-4" /> Free Limit Reached
                        </div>
                      )}
                    </div>
                </TabsContent>

                <TabsContent value="paste" className="p-6 space-y-4">
                  <div className="relative">
                    <Textarea 
                      placeholder="Paste your <svg> code here..." 
                      className="min-h-[300px] font-mono text-xs bg-background/50 focus:ring-primary/20"
                      value={pastedCode}
                      onChange={(e) => setPastedCode(e.target.value)}
                    />
                    <div className="absolute top-4 right-4">
                      <Type className="h-4 w-4 text-muted-foreground opacity-20" />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Results List */}
          <div className="grid gap-4">
            <AnimatePresence>
              {svgFiles.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="overflow-hidden border-primary/10 hover:border-primary/30 transition-colors">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        {/* Preview */}
                        <div className="w-full md:w-48 h-48 bg-muted/50 flex items-center justify-center p-8 border-r border-primary/5 relative group">
                          <div 
                            className="w-full h-full flex items-center justify-center"
                            dangerouslySetInnerHTML={{ __html: file.optimizedCode || file.originalCode }}
                          />
                          <div className="absolute top-2 left-2 bg-background/80 backdrop-blur px-2 py-0.5 rounded text-[10px] font-black uppercase">
                            Preview
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 p-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold truncate max-w-[200px]">{file.name}</h4>
                            <div className="flex items-center gap-2">
                              {file.status === "optimized" && (
                                <span className="bg-green-500/10 text-green-600 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest">
                                  Optimized
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-8">
                            <div className="space-y-1">
                              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Original</p>
                              <p className="text-sm font-mono">{(file.originalSize / 1024).toFixed(2)} KB</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Optimized</p>
                              <p className="text-sm font-mono text-green-600">
                                {file.optimizedSize ? (file.optimizedSize / 1024).toFixed(2) : "--"} KB
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Savings</p>
                              <p className="text-sm font-mono font-bold">
                                {file.optimizedSize ? Math.round(((file.originalSize - file.optimizedSize) / file.originalSize) * 100) : "0"}%
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-2">
                            <Button variant="outline" size="sm" className="h-8 font-bold gap-2" onClick={() => copyToClipboard(file.optimizedCode || file.originalCode)}>
                              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                              Copy Code
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 font-bold gap-2" onClick={() => downloadFile(file)}>
                              <Download className="h-3 w-3" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <Card className="sticky top-24 border-primary/20 shadow-xl shadow-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Settings className="h-5 w-5 text-primary" />
                Optimization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <NativeToggle
                  label="Minify SVG"
                  description="Remove all whitespace"
                  checked={options.minify}
                  onChange={(val) => setOptions(prev => ({ ...prev, minify: val }))}
                />
                <NativeToggle
                  label="Remove Metadata"
                  description="Remove XML, creator tags"
                  checked={options.removeMetadata}
                  onChange={(val) => setOptions(prev => ({ ...prev, removeMetadata: val }))}
                />
                <NativeToggle
                  label="Remove Comments"
                  description="Strip HTML comments"
                  checked={options.removeComments}
                  onChange={(val) => setOptions(prev => ({ ...prev, removeComments: val }))}
                />
                <NativeToggle
                  label="CurrentColor Mode"
                  description="Replace colors with inherit"
                  checked={options.currentColor}
                  onChange={(val) => setOptions(prev => ({ ...prev, currentColor: val }))}
                />
                <NativeToggle
                  label="Pretty Print"
                  description="Indented clean output"
                  checked={options.pretty}
                  onChange={(val) => setOptions(prev => ({ ...prev, pretty: val }))}
                  bordered
                />
              </div>

              <Button 
                className="w-full h-12 font-black tracking-tight" 
                onClick={optimizeAll}
                disabled={isOptimizing || (activeTab === "paste" ? !pastedCode : svgFiles.length === 0)}
              >
                {isOptimizing ? "Optimizing..." : "Compress SVG"}
                <Zap className="h-4 w-4 ml-2 fill-current" />
              </Button>
            </CardContent>
          </Card>

          {/* Savings Summary */}
          {svgFiles.some(f => f.status === "optimized") && (
            <Card className="bg-green-500/5 border-green-500/20">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-green-500/10 p-3 rounded-xl">
                    <Zap className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Total Savings</p>
                    <p className="text-2xl font-black text-green-600 tracking-tighter">
                      {averageSaving}% Saved
                    </p>
                  </div>
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700 h-10 font-bold gap-2" onClick={downloadAllAsZip}>
                  <FileArchive className="h-4 w-4" /> Download All ZIP
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Pro Banner */}
          {!isPro && (
            <Card className="bg-primary text-primary-foreground border-none overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
              <CardContent className="p-6 relative">
                <h4 className="font-black text-lg leading-tight mb-2">Need unlimited batch?</h4>
                <p className="text-xs opacity-80 mb-4">Compress thousands of SVGs at once with our Premium API.</p>
                <Button variant="secondary" className="w-full font-bold h-9" asChild>
                  <Link href="/pricing">Upgrade Now</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* SEO Section */}
      <div className="prose prose-sm dark:prose-invert max-w-none grid md:grid-cols-2 gap-12 mt-12 border-t pt-12">
        <section>
          <h2 className="text-2xl font-black tracking-tight mb-6">What is SVG Optimization?</h2>
          <p className="text-muted-foreground leading-relaxed text-base">
            SVG (Scalable Vector Graphics) files are essentially XML code. Like any code, they often contain redundant information such as editor metadata, comments, hidden elements, and overly precise coordinates that aren&apos;t visible to the naked eye.
          </p>
          <p className="text-muted-foreground mt-4 leading-relaxed text-base">
            SVG compression works by stripping away this bloat while preserving the visual integrity of the image. This results in significantly smaller file sizes, leading to faster website load times and improved Core Web Vitals.
          </p>
        </section>
        
        <section className="bg-muted/30 p-8 rounded-3xl border border-primary/5">
          <h3 className="text-xl font-black tracking-tight mb-6">Why Compress SVGs?</h3>
          <ul className="space-y-4 list-none p-0">
            {[
              { title: "Better Performance", desc: "Smaller assets mean faster page loads and less bandwidth." },
              { title: "SEO Benefits", desc: "Google prioritizes fast-loading sites in search rankings." },
              { title: "Cleaner Code", desc: "Optimized SVGs are easier to read and manipulate via CSS/JS." },
              { title: "Mobile Optimized", desc: "Crucial for users on slow mobile data connections." }
            ].map((item, i) => (
              <li key={i} className="flex gap-4">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <ChevronRight className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground leading-none mb-1">{item.title}</h4>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
