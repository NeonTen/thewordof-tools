"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Loader2, Download } from "lucide-react"
import { ColorPicker } from "@/components/ui/color-picker"
import { useUsageLimit } from "@/hooks/use-usage-limit"
import Link from "next/link"

interface QRCodeProps {
  isPro?: boolean
}

export function QRCodeGenerator({ isPro = false }: QRCodeProps) {
  const [text, setText] = useState("")
  const [size, setSize] = useState(256)
  const [fgColor, setFgColor] = useState("#000000")
  const [bgColor, setBgColor] = useState("#ffffff")
  const [qrDataUrl, setQrDataUrl] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")

  const { count: usedToday, increment: incrementUsage } = useUsageLimit("qr-code", "daily")
  const MAX_FREE = 5
  const limitReached = !isPro && usedToday >= MAX_FREE

  const generateQR = async () => {
    if (!text || limitReached) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/tools/generate-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, size, fgColor, bgColor }),
      })
      if (!res.ok) throw new Error("Failed to generate QR code")
      const data = await res.json()
      setQrDataUrl(data.dataUrl)
      
      // Increment and track usage with analytics payload
      await incrementUsage(1, {
        size,
        fgColor,
        bgColor,
        textLength: text.length,
      })
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const downloadPNG = () => {
    if (!qrDataUrl) return
    const link = document.createElement("a")
    link.href = qrDataUrl
    link.download = "qr-code.png"
    link.click()
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <Card className="glassmorphism p-6 h-fit">
        <CardHeader className="px-0 pt-0">
          <CardTitle>QR Parameters</CardTitle>
          <CardDescription>Configure QR code text, size, and custom glassmorphism‑matching colors.</CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground" htmlFor="qr-text">Text / URL *</label>
            <Input id="qr-text" value={text} onChange={e => setText(e.target.value)} placeholder="e.g. https://google.com" required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Size: {size}px</label>
            <Slider
              min={128}
              max={512}
              step={16}
              value={[size]}
              onValueChange={v => setSize(Array.isArray(v) ? v[0] : v)}
            />
          </div>

          <div className="flex gap-4 items-center">
            <ColorPicker
              label="Foreground Color"
              id="fg-color"
              value={fgColor}
              onChange={setFgColor}
              className="flex-1"
            />
            <ColorPicker
              label="Background Color"
              id="bg-color"
              value={bgColor}
              onChange={setBgColor}
              className="flex-1"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button onClick={generateQR} disabled={loading || !text || limitReached} className="w-full flex items-center justify-center">
            {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
            {limitReached ? "Daily Limit Reached" : "Generate QR Code"}
          </Button>
          {limitReached && (
            <p className="text-[10px] text-center text-muted-foreground">
              You&apos;ve reached your 5 daily generations. <Link href="/pricing" className="text-primary font-bold hover:underline">Upgrade to Pro →</Link>
            </p>
          )}
          {!isPro && !limitReached && (
            <p className="text-[10px] text-center text-muted-foreground">
              {MAX_FREE - usedToday} of {MAX_FREE} free generations left today
            </p>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        {!qrDataUrl && !loading && (
          <Card className="h-full flex flex-col items-center justify-center p-8 text-center text-muted-foreground min-h-[350px]">
            <p>Generate QR code to view live preview here.</p>
          </Card>
        )}

        {loading && (
          <Card className="h-full flex items-center justify-center min-h-[350px]">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Generating QR code...</span>
            </div>
          </Card>
        )}

        {qrDataUrl && !loading && (
          <Card className="p-6 flex flex-col items-center justify-center min-h-[350px]">
            <div 
              className="p-4 rounded-xl border bg-card shadow-inner flex items-center justify-center"
              style={{ backgroundColor: bgColor }}
            >
              <img 
                src={qrDataUrl} 
                alt="Generated QR Code" 
                className="max-w-full h-auto object-contain"
                style={{ width: size, height: size }}
              />
            </div>
            <Button onClick={downloadPNG} className="mt-6 flex items-center gap-2">
              <Download className="h-4 w-4" /> Download PNG
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
