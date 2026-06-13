"use client"

import { useState, useMemo } from "react"
import { Copy, RefreshCw } from "lucide-react"

interface GradientPreset {
  name: string
  colors: string[]
  angle: number
  type: "linear" | "radial"
}

const PRESETS: GradientPreset[] = [
  { name: "Sunset Breeze", colors: ["#FF5E62", "#FF9966"], angle: 135, type: "linear" },
  { name: "Ocean Glass", colors: ["#1FA2FF", "#12D8FA", "#A6FFCB"], angle: 90, type: "linear" },
  { name: "Neon Sunrise", colors: ["#F857A6", "#FF5858"], angle: 45, type: "linear" },
  { name: "Royal Purple", colors: ["#7F00FF", "#E100FF"], angle: 120, type: "linear" },
  { name: "Cotton Candy", colors: ["#FFAFBD", "#ffc3a0"], angle: 135, type: "linear" },
  { name: "Minty Fresh", colors: ["#00CDAC", "#8DDAD5"], angle: 90, type: "linear" },
  { name: "Dark Nebula", colors: ["#0F2027", "#203A43", "#2C5364"], angle: 135, type: "linear" },
  { name: "Cyberpunk", colors: ["#F12711", "#F5AF19"], angle: 60, type: "linear" },
  { name: "Emerald Dream", colors: ["#11998E", "#38EF7D"], angle: 135, type: "linear" }
]

interface ColorStop {
  id: string
  color: string
  position: number
}

function presetToStops(preset: GradientPreset): ColorStop[] {
  return preset.colors.map((color, index) => ({
    id: `stop-${index}-${Date.now()}-${Math.random()}`,
    color,
    position: Math.round((index / (preset.colors.length - 1)) * 100),
  }))
}

export function GradientGenerator() {
  const [selected, setSelected] = useState<GradientPreset>(PRESETS[0])
  const [stops, setStops] = useState<ColorStop[]>(() => presetToStops(PRESETS[0]))
  const [activeStopId, setActiveStopId] = useState<string>("")
  const [angle, setAngle] = useState(PRESETS[0].angle)
  const [type, setType] = useState<"linear" | "radial">(PRESETS[0].type)
  const [copiedText, setCopiedText] = useState("")

  const activeId = activeStopId || (stops[0]?.id || "")

  const handleSelectPreset = (preset: GradientPreset) => {
    setSelected(preset)
    const newStops = presetToStops(preset)
    setStops(newStops)
    setActiveStopId(newStops[0]?.id || "")
    setAngle(preset.angle)
    setType(preset.type)
  }

  const handleColorChange = (idx: number, val: string) => {
    setColors((prev) => {
      const next = [...prev]
      next[idx] = val
      return next
    })
  }

  const cssCode = useMemo(() => {
    if (type === "radial") {
      return `background: radial-gradient(circle, ${colors.join(", ")});`
    }
    return `background: linear-gradient(${angle}deg, ${colors.join(", ")});`
  }, [colors, angle, type])

  const tailwindCode = useMemo(() => {
    if (type === "radial") return `bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[${colors[0]}] to-[${colors[colors.length - 1]}]`
    let dir = "bg-gradient-to-r"
    if (angle >= 22.5 && angle < 67.5) dir = "bg-gradient-to-tr"
    else if (angle >= 67.5 && angle < 112.5) dir = "bg-gradient-to-r"
    else if (angle >= 112.5 && angle < 157.5) dir = "bg-gradient-to-br"
    else if (angle >= 157.5 && angle < 202.5) dir = "bg-gradient-to-b"
    else if (angle >= 202.5 && angle < 247.5) dir = "bg-gradient-to-bl"
    else if (angle >= 247.5 && angle < 292.5) dir = "bg-gradient-to-l"
    else if (angle >= 292.5 && angle < 337.5) dir = "bg-gradient-to-tl"
    else dir = "bg-gradient-to-t"

    const colorStops = colors.map((c, i) => {
      if (i === 0) return `from-[${c}]`
      if (i === colors.length - 1) return `to-[${c}]`
      return `via-[${c}]`
    })
    return `${dir} ${colorStops.join(" ")}`
  }, [colors, angle, type])

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(label)
    setTimeout(() => setCopiedText(""), 2000)
  }

  return (<>
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Preset Selector */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-card p-5 border border-border rounded-2xl space-y-4 shadow-sm">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Presets Gallery</h2>
          <div className="grid grid-cols-2 gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handleSelectPreset(preset)}
                className={`p-2 border rounded-xl text-left cursor-pointer transition-all ${selected.name === preset.name ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:bg-muted/40"}`}
              >
                <div className="h-10 w-full rounded-lg mb-1.5" style={{ background: `linear-gradient(${preset.angle}deg, ${preset.colors.join(", ")})` }} />
                <p className="text-[10px] font-bold truncate">{preset.name}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Preview and Editor */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-card p-6 border border-border rounded-2xl flex flex-col gap-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Preview Block */}
            <div 
              className="w-full md:w-1/2 aspect-video rounded-2xl border border-border overflow-hidden flex items-center justify-center relative shadow-inner" 
              style={{ background: type === "radial" ? `radial-gradient(circle, ${colors.join(", ")})` : `linear-gradient(${angle}deg, ${colors.join(", ")})` }}
            >
              <div className="bg-black/45 backdrop-blur-md px-4 py-2 rounded-xl text-white text-xs font-bold border border-white/10 shadow-sm">
                Live Preview
              </div>
            </div>

            {/* Editor controls */}
            <div className="w-full md:w-1/2 space-y-4">
              <h3 className="font-bold text-sm text-foreground uppercase tracking-wider text-muted-foreground">Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Type</label>
                  <div className="flex gap-2 mt-1.5">
                    <button 
                      onClick={() => setType("linear")} 
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${type === "linear" ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                    >
                      Linear
                    </button>
                    <button 
                      onClick={() => setType("radial")} 
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${type === "radial" ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                    >
                      Radial
                    </button>
                  </div>
                </div>
                {type === "linear" && (
                  <div>
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-muted-foreground uppercase tracking-wider">Angle</span>
                      <span className="font-mono">{angle}°</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="360" 
                      value={angle} 
                      onChange={(e) => setAngle(parseInt(e.target.value))} 
                      className="w-full mt-1.5 cursor-pointer accent-primary" 
                    />
                  </div>
                )}
                <div>
                  <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Edit Colors</label>
                  <div className="flex gap-2 mt-1.5">
                    {colors.map((c, i) => (
                      <input 
                        key={i} 
                        type="color" 
                        value={c} 
                        onChange={(e) => handleColorChange(i, e.target.value)} 
                        className="w-10 h-10 border border-border rounded-xl cursor-pointer bg-transparent" 
                      />
                    ))}
                    <button 
                      onClick={() => setColors([...colors].reverse())} 
                      className="p-2 border border-border rounded-xl hover:bg-muted/50 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <RefreshCw className="h-3.5 w-3.5" /> Flip
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Code outputs */}
          <div className="space-y-3 pt-3 border-t border-border">
            <div className="p-3 bg-muted/20 border border-border rounded-xl flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-muted-foreground font-black uppercase tracking-wider">CSS Code</span>
                <p className="font-mono text-xs text-muted-foreground truncate pr-4 mt-1">{cssCode}</p>
              </div>
              <button 
                onClick={() => copyToClipboard(cssCode, "css")} 
                className="p-2 border border-border rounded-xl hover:bg-muted/40 shrink-0 shadow-sm cursor-pointer" 
                title="Copy CSS"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <div className="p-3 bg-muted/20 border border-border rounded-xl flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-muted-foreground font-black uppercase tracking-wider">Tailwind CSS Classes</span>
                <p className="font-mono text-xs text-muted-foreground truncate pr-4 mt-1">{tailwindCode}</p>
              </div>
              <button 
                onClick={() => copyToClipboard(tailwindCode, "tailwind")} 
                className="p-2 border border-border rounded-xl hover:bg-muted/40 shrink-0 shadow-sm cursor-pointer" 
                title="Copy Tailwind"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
          {copiedText && (
            <span className="text-xs text-primary font-bold text-center">Copied snippet to clipboard!</span>
          )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="bg-primary/5 border border-primary/10 p-5 rounded-2xl space-y-2">
          <h4 className="text-sm font-bold flex items-center gap-2">
            <span className="h-5 w-5 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><span className="text-[10px] font-black">1</span></span> Curated Presets
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Instantly browse beautiful, hand-crafted gradients optimized for backgrounds, header banners, buttons, and card states.
          </p>
        </div>
        <div className="bg-primary/5 border border-primary/10 p-5 rounded-2xl space-y-2">
          <h4 className="text-sm font-bold flex items-center gap-2">
            <span className="h-5 w-5 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><span className="text-[10px] font-black">2</span></span> Angle & Type Tuners
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Switch between linear and radial layouts, modify angles from 0° to 360°, and reverse color stop directions with one click.
          </p>
        </div>
        <div className="bg-primary/5 border border-primary/10 p-5 rounded-2xl space-y-2">
          <h4 className="text-sm font-bold flex items-center gap-2">
            <span className="h-5 w-5 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><span className="text-[10px] font-black">3</span></span> Production Export
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Export generated gradients to standard CSS rules or matching Tailwind CSS configuration utility classes instantly.
          </p>
        </div>
      </div>

      {/* SEO Section */}
      <div className="grid md:grid-cols-2 gap-12 mt-16 border-t border-border pt-12">
        <section>
          <h2 className="text-2xl font-black tracking-tight mb-4">Enhance Your UI with Premium Gradients</h2>
          <p className="text-muted-foreground leading-relaxed">
            Gradients add depth, character, and visual hierarchy to modern web interfaces. By combining two or more harmonious colors, you create eye-catching focal points for landing pages and call-to-actions.
          </p>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            This tool helps developers quickly experiment with color stop modifications and angle selections, saving hours of manual CSS writing. Build high-quality visuals and test them in real-time before pushing to production.
          </p>
        </section>
        <section className="bg-muted/30 p-8 rounded-3xl border border-border">
          <h3 className="text-xl font-black tracking-tight mb-6">Benefits of Modern Web Gradients</h3>
          <ul className="space-y-4 list-none p-0">
            {[
              { title: "Visual Depth", desc: "Transitions mimic natural lighting, making buttons and containers feel interactive and tactile." },
              { title: "Brand Identity", desc: "Custom brand gradients create instantly recognizable landing pages and product banners." },
              { title: "No Extra Load", desc: "CSS gradients compile directly in the browser, providing high-fidelity graphics without downloading heavy image files." },
              { title: "Tailwind Integration", desc: "Our copy-paste Tailwind code lets you easily apply custom gradient styles inside your utility classes." },
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
    </>)
}
