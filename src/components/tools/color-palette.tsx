"use client"

import { useState, useEffect, useCallback } from "react"
import { Lock, Unlock, Copy, Download, RefreshCw } from "lucide-react"

// Helper HSL to Hex converter
function hslToHex(h: number, s: number, l: number): string {
  l /= 100
  const a = (s * Math.min(l, 1 - l)) / 100
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, "0")
  }
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase()
}

// Parse Hex to HSL
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  let r = 0, g = 0, b = 0
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16)
    g = parseInt(hex[2] + hex[2], 16)
    b = parseInt(hex[3] + hex[3], 16)
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16)
    g = parseInt(hex.slice(3, 5), 16)
    b = parseInt(hex.slice(5, 7), 16)
  }
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
    h /= 6
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

// Hex to RGB parser
function hexToRgb(hex: string) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b)
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

export function ColorPalette() {
  const [colors, setColors] = useState<string[]>(["#2563EB", "#3B82F6", "#F3F4F6", "#1F2937", "#EC4899"])
  const [locked, setLocked] = useState<boolean[]>([false, false, false, false, false])
  const [harmony, setHarmony] = useState<string>("random")
  const [copiedText, setCopiedText] = useState("")

  const generatePalette = useCallback(() => {
    setColors((prevColors) => {
      const newColors = [...prevColors]
      // Determine base color (use the first locked color, or random if none locked)
      const firstLockedIdx = locked.indexOf(true)
      let baseH = Math.floor(Math.random() * 360)
      let baseS = 65 + Math.floor(Math.random() * 20)
      let baseL = 40 + Math.floor(Math.random() * 30)

      if (firstLockedIdx !== -1) {
        try {
          const hsl = hexToHsl(prevColors[firstLockedIdx])
          baseH = hsl.h
          baseS = hsl.s
          baseL = hsl.l
        } catch (e) {
          // Fallback on invalid user inputs
        }
      }

      for (let i = 0; i < 5; i++) {
        if (locked[i]) continue
        
        let h = baseH, s = baseS, l = baseL
        
        if (harmony === "monochromatic") {
          l = (15 + (i * 18)) % 90
          s = baseS
        } else if (harmony === "analogous") {
          h = (baseH + (i - 2) * 20 + 360) % 360
          l = baseL + (i - 2) * 5
        } else if (harmony === "complementary") {
          if (i >= 3) {
            h = (baseH + 180) % 360
            l = baseL + (i - 4) * 10
          } else {
            l = baseL + (i - 1) * 10
          }
        } else if (harmony === "triadic") {
          if (i === 1 || i === 2) {
            h = (baseH + 120) % 360
          } else if (i === 3 || i === 4) {
            h = (baseH + 240) % 360
          }
          l = baseL + (i % 2) * 10
        } else if (harmony === "split") {
          if (i === 1 || i === 2) {
            h = (baseH + 150) % 360
          } else if (i === 3 || i === 4) {
            h = (baseH + 210) % 360
          }
          l = baseL + (i % 2) * 10
        } else {
          // Completely random
          h = Math.floor(Math.random() * 360)
          s = 50 + Math.floor(Math.random() * 40)
          l = 30 + Math.floor(Math.random() * 50)
        }

        newColors[i] = hslToHex(h, s, l)
      }
      return newColors
    })
  }, [locked, harmony])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault()
        generatePalette()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [generatePalette])

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(label)
    setTimeout(() => setCopiedText(""), 2000)
  }

  const toggleLock = (idx: number) => {
    setLocked((prev) => {
      const next = [...prev]
      next[idx] = !next[idx]
      return next
    })
  }

  const downloadPNG = () => {
    const canvas = document.createElement("canvas")
    canvas.width = 1000
    canvas.height = 300
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    colors.forEach((color, idx) => {
      ctx.fillStyle = color
      ctx.fillRect(idx * 200, 0, 200, 300)
      
      // Calculate readable text color on the swatch
      let r = 0, g = 0, b = 0
      try {
        const rgb = hexToRgb(color)
        if (rgb) {
          r = rgb.r
          g = rgb.g
          b = rgb.b
        }
      } catch (e) {}
      
      const isDark = (r * 0.299 + g * 0.587 + b * 0.114) <= 128
      ctx.fillStyle = isDark ? "#FFFFFF" : "#000000"
      ctx.font = "bold 20px monospace"
      ctx.fillText(color, idx * 200 + 40, 260)
    })

    const link = document.createElement("a")
    link.download = `palette-${colors.join("-")}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 border border-border rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-muted-foreground">Harmony Rule:</span>
          <select 
            value={harmony} 
            onChange={(e) => setHarmony(e.target.value)} 
            className="bg-muted/40 border border-border px-3 py-1.5 rounded-xl text-sm font-bold focus:outline-none cursor-pointer"
          >
            <option value="random">Random / Free</option>
            <option value="monochromatic">Monochromatic</option>
            <option value="analogous">Analogous</option>
            <option value="complementary">Complementary</option>
            <option value="triadic">Triadic</option>
            <option value="split">Split Complementary</option>
          </select>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={generatePalette} 
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 shadow-sm cursor-pointer transition-all"
          >
            <RefreshCw className="h-4 w-4" /> Generate (Spacebar)
          </button>
          <button 
            onClick={downloadPNG} 
            className="p-2.5 border border-border rounded-xl hover:bg-muted/40 shadow-sm cursor-pointer transition-colors" 
            title="Download PNG"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 5 Swatches panel */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 min-h-[350px]">
        {colors.map((color, idx) => (
          <div 
            key={idx} 
            className="relative rounded-2xl overflow-hidden flex flex-col justify-end p-5 transition-all shadow-sm border border-black/5" 
            style={{ backgroundColor: color }}
          >
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => toggleLock(idx)} 
                className="p-2 bg-black/20 hover:bg-black/35 rounded-full text-white cursor-pointer transition-all border border-white/10"
              >
                {locked[idx] ? <Lock className="h-4 w-4 text-amber-400" /> : <Unlock className="h-4 w-4" />}
              </button>
            </div>
            
            <div className="space-y-2 bg-black/25 backdrop-blur-md p-3.5 rounded-xl border border-white/10 text-white">
              <input
                type="color"
                value={color}
                onChange={(e) => {
                  const val = e.target.value
                  setColors((prev) => {
                    const next = [...prev]
                    next[idx] = val
                    return next
                  })
                }}
                className="w-full h-8 border border-white/20 rounded-lg cursor-pointer bg-transparent"
              />
              <div className="flex justify-between items-center gap-2">
                <input
                  type="text"
                  value={color}
                  onChange={(e) => {
                    const val = e.target.value
                    setColors((prev) => {
                      const next = [...prev]
                      next[idx] = val
                      return next
                    })
                  }}
                  className="font-mono font-bold text-xs w-full bg-transparent border-none p-0 focus:ring-0 text-white"
                />
                <button 
                  onClick={() => copyToClipboard(color, `color-${idx}`)} 
                  className="flex items-center gap-1 text-[10px] uppercase font-black tracking-widest opacity-80 hover:opacity-100 cursor-pointer"
                >
                  <Copy className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Export panels */}
      <div className="bg-card p-6 border border-border rounded-2xl space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm">Export Code Snippets</h3>
          {copiedText && (
            <span className="text-xs text-primary font-bold">Copied snippet to clipboard!</span>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 bg-muted/20 border border-border rounded-xl space-y-2 relative">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-muted-foreground font-black uppercase tracking-wider">Tailwind CSS</span>
              <button 
                onClick={() => copyToClipboard(`colors: {\n  color1: "${colors[0]}",\n  color2: "${colors[1]}",\n  color3: "${colors[2]}",\n  color4: "${colors[3]}",\n  color5: "${colors[4]}",\n}`, "tailwind")}
                className="p-1 border border-border rounded hover:bg-muted/60"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
            <pre className="text-[11px] bg-muted/40 p-2.5 rounded border border-border/50 overflow-x-auto text-muted-foreground font-mono">
{`colors: {
  color1: "${colors[0]}",
  color2: "${colors[1]}",
  color3: "${colors[2]}",
  color4: "${colors[3]}",
  color5: "${colors[4]}",
}`}
            </pre>
          </div>
          
          <div className="p-4 bg-muted/20 border border-border rounded-xl space-y-2 relative">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-muted-foreground font-black uppercase tracking-wider">CSS Variables</span>
              <button 
                onClick={() => copyToClipboard(`:root {\n  --color-1: ${colors[0]};\n  --color-2: ${colors[1]};\n  --color-3: ${colors[2]};\n  --color-4: ${colors[3]};\n  --color-5: ${colors[4]};\n}`, "css")}
                className="p-1 border border-border rounded hover:bg-muted/60"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
            <pre className="text-[11px] bg-muted/40 p-2.5 rounded border border-border/50 overflow-x-auto text-muted-foreground font-mono">
{`:root {
  --color-1: ${colors[0]};
  --color-2: ${colors[1]};
  --color-3: ${colors[2]};
  --color-4: ${colors[3]};
  --color-5: ${colors[4]};
}`}
            </pre>
          </div>

          <div className="p-4 bg-muted/20 border border-border rounded-xl space-y-2 relative">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-muted-foreground font-black uppercase tracking-wider">HEX List / JSON</span>
              <button 
                onClick={() => copyToClipboard(JSON.stringify(colors, null, 2), "json")}
                className="p-1 border border-border rounded hover:bg-muted/60"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
            <pre className="text-[11px] bg-muted/40 p-2.5 rounded border border-border/50 overflow-x-auto text-muted-foreground font-mono">
{JSON.stringify(colors, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
