"use client"

import React, { useState, useEffect, useRef } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { useUsageLimit } from "@/hooks/use-usage-limit"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

// Helper conversion functions
function hexToRgb(hex: string) {
  const cleaned = hex.replace("#", "")
  const num = parseInt(cleaned, 16)
  if (cleaned.length === 3) {
    const r = (num >> 8) & 0xf
    const g = (num >> 4) & 0xf
    const b = num & 0xf
    return { r: (r << 4) | r, g: (g << 4) | g, b: (b << 4) | b }
  }
  const r = (num >> 16) & 0xff
  const g = (num >> 8) & 0xff
  const b = num & 0xff
  return { r, g, b }
}

function rgbToHex(r: number, g: number, b: number) {
  const toHex = (n: number) => n.toString(16).padStart(2, "0")
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h *= 60
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function hslToRgb(h: number, s: number, l: number) {
  s /= 100; l /= 100
  const c = (1 - Math.abs(2 * l - 1)) * s
  const hh = h / 60
  const x = c * (1 - Math.abs((hh % 2) - 1))
  let r = 0, g = 0, b = 0
  if (hh >= 0 && hh < 1) { r = c; g = x; }
  else if (hh >= 1 && hh < 2) { r = x; g = c; }
  else if (hh >= 2 && hh < 3) { g = c; b = x; }
  else if (hh >= 3 && hh < 4) { g = x; b = c; }
  else if (hh >= 4 && hh < 5) { r = x; b = c; }
  else if (hh >= 5 && hh < 6) { r = c; b = x; }
  const m = l - c / 2
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  }
}

interface ColorConverterProps {
  isPro?: boolean
}

export function ColorConverter({ isPro = false }: ColorConverterProps) {
  const [hex, setHex] = useState("#ff0000")
  const [rgb, setRgb] = useState({ r: 255, g: 0, b: 0 })
  const [hsl, setHsl] = useState({ h: 0, s: 100, l: 50 })
  const { increment: incrementUsage } = useUsageLimit("color-converter", "daily")

  const [copiedField, setCopiedField] = useState<string | null>(null)
  const updatingRef = useRef(false)

  // Sync color changes from HEX source
  const updateFromHex = (newHex: string) => {
    if (updatingRef.current) return
    updatingRef.current = true
    setHex(newHex)
    
    const cleaned = newHex.replace("#", "")
    if (cleaned.length === 3 || cleaned.length === 6) {
      try {
        const { r, g, b } = hexToRgb(newHex)
        setRgb({ r, g, b })
        setHsl(rgbToHsl(r, g, b))
      } catch (e) {
        // Invalid currently
      }
    }
    updatingRef.current = false
  }

  // Sync color changes from RGB source
  const updateFromRgb = (newRgb: { r: number; g: number; b: number }) => {
    if (updatingRef.current) return
    updatingRef.current = true
    setRgb(newRgb)
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b)
    setHex(newHex)
    setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b))
    updatingRef.current = false
  }

  // Sync color changes from HSL source
  const updateFromHsl = (newHsl: { h: number; s: number; l: number }) => {
    if (updatingRef.current) return
    updatingRef.current = true
    setHsl(newHsl)
    const { r, g, b } = hslToRgb(newHsl.h, newHsl.s, newHsl.l)
    setRgb({ r, g, b })
    setHex(rgbToHex(r, g, b))
    updatingRef.current = false
  }

  // Track color converter usage (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      incrementUsage(1, { hex }).catch(console.error)
    }, 4000)
    return () => clearTimeout(timer)
  }, [hex, incrementUsage])

  const handleRgbChange = (channel: "r" | "g" | "b", val: number) => {
    const v = Math.min(255, Math.max(0, val))
    updateFromRgb({ ...rgb, [channel]: v })
  }

  const handleHslChange = (channel: "h" | "s" | "l", val: number) => {
    if (channel === "h") {
      const v = (val + 360) % 360
      updateFromHsl({ ...hsl, h: v })
    } else {
      const v = Math.min(100, Math.max(0, val))
      updateFromHsl({ ...hsl, [channel]: v })
    }
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  return (
    <div className="grid xl:grid-cols-4 gap-8">
      {/* Left Column Input Controls */}
      <div className="xl:col-span-3 space-y-6">
        <Card className="glassmorphism p-6 h-full flex flex-col justify-between">
          <div>
            <CardHeader className="px-0 pt-0 mb-6">
              <CardTitle>Color Conversions</CardTitle>
              <CardDescription>Drag color space channel sliders or write values below.</CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0 space-y-6">
              {/* HEX Manual Input */}
              <div className="space-y-2 pt-4">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2" htmlFor="hex-input">HEX Code</label>
                <Input
                  id="hex-input"
                  value={hex}
                  onChange={e => updateFromHex(e.target.value)}
                  placeholder="#ff0000"
                  className="font-mono text-base max-w-[200px]"
                />
              </div>

              {/* RGB Slider Panel */}
              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">RGB Color Channels</h4>
                <div className="grid md:grid-cols-3 gap-6">
                  {(["r", "g", "b"] as const).map(channel => (
                    <div key={channel} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-semibold text-muted-foreground uppercase" htmlFor={`rgb-${channel}`}>
                          {channel === "r" ? "Red" : channel === "g" ? "Green" : "Blue"}
                        </label>
                        <span className="text-sm font-bold font-mono">{rgb[channel]}</span>
                      </div>
                      <Slider
                        min={0}
                        max={255}
                        step={1}
                        value={[rgb[channel]]}
                        onValueChange={v => handleRgbChange(channel, Array.isArray(v) ? v[0] : v)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* HSL Slider Panel */}
              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">HSL Color Channels</h4>
                <div className="grid md:grid-cols-3 gap-6">
                  {(["h", "s", "l"] as const).map(channel => (
                    <div key={channel} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-semibold text-muted-foreground uppercase" htmlFor={`hsl-${channel}`}>
                          {channel === "h" ? "Hue" : channel === "s" ? "Saturation" : "Lightness"}
                        </label>
                        <span className="text-sm font-bold font-mono">
                          {hsl[channel]}{channel === "h" ? "°" : "%"}
                        </span>
                      </div>
                      <Slider
                        min={0}
                        max={channel === "h" ? 359 : 100}
                        step={1}
                        value={[hsl[channel]]}
                        onValueChange={v => handleHslChange(channel, Array.isArray(v) ? v[0] : v)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>

      {/* Right Column Pickers & Dev Code Output */}
      <div className="space-y-6">
        {/* Large Dynamic Color Box */}
        <Card 
          className="w-full aspect-[3/1] rounded-2xl shadow-lg border border-white/20 transition-all duration-300"
          style={{ backgroundColor: hex }}
        />

        {/* Copy Dev Code Snippets */}
        <Card className="glassmorphism p-6 space-y-4">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">CSS Declarations</CardTitle>
          
          <div className="space-y-3">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">HEX</span>
              <div className="flex items-center gap-2">
                <Input readOnly value={`color: ${hex};`} className="font-mono text-xs bg-muted/20 h-8" />
                <Button variant="outline" size="icon" className="h-8 w-8 shrink-0" onClick={() => copyToClipboard(`color: ${hex};`, "hex")}>
                  {copiedField === "hex" ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">RGB</span>
              <div className="flex items-center gap-2">
                <Input readOnly value={`color: rgb(${rgb.r}, ${rgb.g}, ${rgb.b});`} className="font-mono text-xs bg-muted/20 h-8" />
                <Button variant="outline" size="icon" className="h-8 w-8 shrink-0" onClick={() => copyToClipboard(`color: rgb(${rgb.r}, ${rgb.g}, ${rgb.b});`, "rgb")}>
                  {copiedField === "rgb" ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">HSL</span>
              <div className="flex items-center gap-2">
                <Input readOnly value={`color: hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%);`} className="font-mono text-xs bg-muted/20 h-8" />
                <Button variant="outline" size="icon" className="h-8 w-8 shrink-0" onClick={() => copyToClipboard(`color: hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%);`, "hsl")}>
                  {copiedField === "hsl" ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
