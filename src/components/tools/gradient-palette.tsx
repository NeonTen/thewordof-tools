"use client"

import { useState, useEffect, useCallback } from "react"
import { Lock, Unlock, Copy, Download, RefreshCw } from "lucide-react"

interface GradientCard {
  colors: string[]
  angle: number
}

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

export function GradientPalette() {
  const [globalAngle, setGlobalAngle] = useState<number>(135)
  const [globalStops, setGlobalStops] = useState<number>(2)
  const [gradients, setGradients] = useState<GradientCard[]>([
    { colors: ["#FF5E62", "#FF9966"], angle: 135 },
    { colors: ["#7F00FF", "#E100FF"], angle: 135 },
    { colors: ["#11998E", "#38EF7D"], angle: 135 },
    { colors: ["#0F2027", "#2C5364"], angle: 135 },
    { colors: ["#F857A6", "#FF5858"], angle: 135 }
  ])
  const [locked, setLocked] = useState<boolean[]>([false, false, false, false, false])
  const [harmony, setHarmony] = useState<string>("random")
  const [copiedText, setCopiedText] = useState("")

  const generateGradients = useCallback(() => {
    setGradients((prevGradients) => {
      const nextGradients = [...prevGradients]
      const firstLockedIdx = locked.indexOf(true)
      
      let baseH = Math.floor(Math.random() * 360)
      let baseS = 65 + Math.floor(Math.random() * 20)
      let baseL = 40 + Math.floor(Math.random() * 30)

      const angleOffset = Math.floor(Math.random() * 360)

      if (firstLockedIdx !== -1) {
        try {
          const hsl = hexToHsl(prevGradients[firstLockedIdx].colors[0])
          baseH = hsl.h
          baseS = hsl.s
          baseL = hsl.l
        } catch (e) {}
      }

      for (let i = 0; i < 5; i++) {
        if (locked[i]) continue
        
        let h = baseH, s = baseS, l = baseL
        
        if (harmony === "monochromatic") {
          l = (15 + (i * 18) + Math.floor(Math.random() * 10)) % 90
          s = Math.max(25, Math.min(100, baseS + Math.floor(Math.random() * 20) - 10))
        } else if (harmony === "analogous") {
          h = (baseH + (i - 2) * 25 + angleOffset) % 360
        } else if (harmony === "complementary") {
          if (i >= 3) h = (baseH + 180 + angleOffset) % 360
          else h = (baseH + angleOffset) % 360
        } else if (harmony === "triadic") {
          const steps = [0, 120, 240]
          const step = steps[Math.floor(Math.random() * steps.length)]
          h = (baseH + step + angleOffset) % 360
        } else if (harmony === "split") {
          const steps = [0, 150, 210]
          const step = steps[Math.floor(Math.random() * steps.length)]
          h = (baseH + step + angleOffset) % 360
        } else {
          h = Math.floor(Math.random() * 360)
          s = 55 + Math.floor(Math.random() * 30)
          l = 35 + Math.floor(Math.random() * 40)
        }

        // Generate N colors dynamically
        const cardColors: string[] = []
        for (let j = 0; j < globalStops; j++) {
          const shiftH = (h + j * (180 / globalStops) + Math.floor(Math.random() * 20)) % 360
          const shiftL = Math.max(15, Math.min(85, l + (j - (globalStops - 1) / 2) * 12))
          cardColors.push(hslToHex(shiftH, s, shiftL))
        }

        nextGradients[i] = {
          colors: cardColors,
          angle: globalAngle
        }
      }
      return nextGradients
    })
  }, [locked, harmony, globalAngle, globalStops])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault()
        generateGradients()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [generateGradients])

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

  const handleColorChange = (idx: number, colorIdx: number, val: string) => {
    setGradients((prev) => {
      const next = [...prev]
      const newColors = [...next[idx].colors]
      newColors[colorIdx] = val
      next[idx] = { ...next[idx], colors: newColors }
      return next
    })
  }

  const changeGlobalAngle = (val: number) => {
    setGlobalAngle(val)
    setGradients((prev) => prev.map((g) => ({ ...g, angle: val })))
  }

  const changeGlobalStops = (val: number) => {
    setGlobalStops(val)
    setGradients((prev) =>
      prev.map((g) => {
        let newColors = [...g.colors]
        if (newColors.length < val) {
          while (newColors.length < val) {
            const lastColor = newColors[newColors.length - 1]
            try {
              const hsl = hexToHsl(lastColor)
              const newColor = hslToHex((hsl.h + 30) % 360, hsl.s, Math.max(20, Math.min(80, hsl.l + 10)))
              newColors.push(newColor)
            } catch (e) {
              newColors.push("#FFFFFF")
            }
          }
        } else if (newColors.length > val) {
          newColors = newColors.slice(0, val)
        }
        return { ...g, colors: newColors }
      })
    )
  }

  const downloadPNG = () => {
    const canvas = document.createElement("canvas")
    canvas.width = 1000
    canvas.height = 300
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    gradients.forEach((grad, idx) => {
      const cx = idx * 200 + 100
      const cy = 150
      const rad = ((grad.angle - 90) * Math.PI) / 180
      const length = Math.sqrt(200 * 200 + 300 * 300) / 2
      const x0 = cx - Math.cos(rad) * length
      const y0 = cy - Math.sin(rad) * length
      const x1 = cx + Math.cos(rad) * length
      const y1 = cy + Math.sin(rad) * length

      const canvasGrad = ctx.createLinearGradient(x0, y0, x1, y1)
      grad.colors.forEach((color, cIdx) => {
        const offset = cIdx / (grad.colors.length - 1)
        canvasGrad.addColorStop(offset, color)
      })

      ctx.fillStyle = canvasGrad
      ctx.fillRect(idx * 200, 0, 200, 300)

      ctx.fillStyle = "rgba(0, 0, 0, 0.4)"
      ctx.fillRect(idx * 200, 210, 200, 90)

      ctx.fillStyle = "#FFFFFF"
      ctx.font = "bold 11px monospace"
      ctx.fillText(`${grad.angle}°`, idx * 200 + 15, 230)
      grad.colors.forEach((color, cIdx) => {
        ctx.fillText(color, idx * 200 + 15, 250 + cIdx * 14)
      })
    })

    const link = document.createElement("a")
    link.download = `gradient-palette.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row gap-4 items-center justify-between bg-card p-4 border border-border rounded-2xl shadow-sm">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2.5">
            <span className="text-xs sm:text-sm font-bold text-muted-foreground">Harmony:</span>
            <select 
              value={harmony} 
              onChange={(e) => setHarmony(e.target.value)} 
              className="bg-muted/40 border border-border px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold focus:outline-none cursor-pointer"
            >
              <option value="random">Random / Free</option>
              <option value="monochromatic">Monochromatic</option>
              <option value="analogous">Analogous</option>
              <option value="complementary">Complementary</option>
              <option value="triadic">Triadic</option>
              <option value="split">Split Complementary</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold text-muted-foreground">Angle:</span>
            <input 
              type="range"
              min="0"
              max="360"
              value={globalAngle}
              onChange={(e) => changeGlobalAngle(parseInt(e.target.value))}
              className="w-20 sm:w-28 h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <span className="text-xs font-bold font-mono w-10 text-right">{globalAngle}°</span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xs sm:text-sm font-bold text-muted-foreground">Stops:</span>
            <select 
              value={globalStops} 
              onChange={(e) => changeGlobalStops(parseInt(e.target.value))} 
              className="bg-muted/40 border border-border px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold focus:outline-none cursor-pointer"
            >
              <option value={2}>2 Colors</option>
              <option value={3}>3 Colors</option>
              <option value={4}>4 Colors</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 w-full xl:w-auto">
          <button 
            onClick={generateGradients} 
            className="flex-1 xl:flex-none flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 shadow-sm cursor-pointer transition-all"
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

      {/* 5 swatches panel */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 min-h-[380px]">
        {gradients.map((grad, idx) => {
          const cssCode = `linear-gradient(${grad.angle}deg, ${grad.colors.join(", ")})`
          return (
            <div 
              key={idx}
              className="relative rounded-none overflow-hidden flex flex-col justify-end p-5 transition-all shadow-sm border border-black/5"
              style={{ background: cssCode }}
            >
              <div className="absolute top-4 right-4 flex gap-1.5">
                <button 
                  onClick={() => toggleLock(idx)} 
                  className="p-2 bg-black/20 hover:bg-black/35 rounded-full text-white cursor-pointer transition-all border border-white/10"
                >
                  {locked[idx] ? <Lock className="h-4 w-4 text-amber-400" /> : <Unlock className="h-4 w-4" />}
                </button>
              </div>

              <div className="space-y-3 bg-black/30 backdrop-blur-md p-3.5 rounded-xl border border-white/10 text-white">
                <div className="space-y-2 text-[11px] font-mono">
                  {grad.colors.map((color, colorIdx) => (
                    <div key={colorIdx} className="flex items-center gap-1.5 justify-between">
                      <div className="flex items-center gap-1.5 w-full">
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => handleColorChange(idx, colorIdx, e.target.value)}
                          className="w-5 h-5 rounded border border-white/30 shrink-0 shadow-sm cursor-pointer p-0 bg-transparent [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch]:rounded"
                        />
                        <input
                          type="text"
                          value={color}
                          onChange={(e) => handleColorChange(idx, colorIdx, e.target.value)}
                          className="font-mono font-bold text-[11px] w-full bg-transparent border-none p-0 focus:ring-0 text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-1">
                  <button 
                    onClick={() => copyToClipboard(`background: ${cssCode};`, `grad-${idx}`)}
                    className="w-full py-1.5 text-[10px] text-center bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg font-black uppercase tracking-widest cursor-pointer transition-all"
                  >
                    {copiedText === `grad-${idx}` ? "Copied!" : "Copy CSS"}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="bg-primary/5 border border-primary/10 p-5 rounded-2xl space-y-2">
          <h4 className="text-sm font-bold flex items-center gap-2">
            <span className="h-5 w-5 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><span className="text-[10px] font-black">1</span></span> Harmonious Gradients
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Generate 5 coordinating gradients using HSL color wheel mathematics, creating perfect options for layout collections.
          </p>
        </div>
        <div className="bg-primary/5 border border-primary/10 p-5 rounded-2xl space-y-2">
          <h4 className="text-sm font-bold flex items-center gap-2">
            <span className="h-5 w-5 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><span className="text-[10px] font-black">2</span></span> Locked Gradients
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Lock down specific gradient combinations and randomize the other swatches to explore alternative color options.
          </p>
        </div>
        <div className="bg-primary/5 border border-primary/10 p-5 rounded-2xl space-y-2">
          <h4 className="text-sm font-bold flex items-center gap-2">
            <span className="h-5 w-5 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><span className="text-[10px] font-black">3</span></span> Single-Click Copy & Stops
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Configure custom angles globally, add 3-4 multi-color stops per card, download the palette, or copy pure CSS rules instantly.
          </p>
        </div>
      </div>

      {/* SEO Section */}
      <div className="grid md:grid-cols-2 gap-12 mt-16 border-t border-border pt-12">
        <section>
          <h2 className="text-2xl font-black tracking-tight mb-4">Unlocking Creativity with Gradient Palettes</h2>
          <p className="text-muted-foreground leading-relaxed">
            A gradient palette consists of multiple linear transitions that work together cohesive to create high-fidelity user experiences. They are excellent for UI cards, feature lists, pricing tables, or presentation slide templates.
          </p>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            By lockable individual cards, our generator lets you find complementary gradient matches and export CSS directly to your styles or Tailwind config arrays. Press Spacebar to shuffle and view new presets.
          </p>
        </section>
        <section className="bg-muted/30 p-8 rounded-3xl border border-border">
          <h3 className="text-xl font-black tracking-tight mb-6">Designing with Multi-Gradient Schemes</h3>
          <ul className="space-y-4 list-none p-0">
            {[
              { title: "Fluid UI Transitions", desc: "Create visually unified sections on a web page using slightly shifting gradient tones." },
              { title: "Visual Hierarchy", desc: "Use high-contrast gradients for calls to action, and low-contrast monochromatic ones for standard cards." },
              { title: "Accented Components", desc: "Gradients are excellent for highlighting pricing tiers, border decorations, or active tab states." },
              { title: "No Extra Load", desc: "Renders via pure CSS, providing premium graphics without layout shifts or extra image payload requests." },
            ].map((item, i) => (
              <li key={i} className="flex gap-4">
                <div className="h-6 w-6 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black text-primary">{i + 1}</div>
                <div>
                  <h4 className="font-bold text-foreground leading-none mb-1">{item.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
