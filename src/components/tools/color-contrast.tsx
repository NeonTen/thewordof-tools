"use client"

import { useState, useMemo } from "react"
import { ArrowLeftRight, Copy } from "lucide-react"

// Relative luminance calculation
function getLuminance(r: number, g: number, b: number) {
  const a = [r, g, b].map((v) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
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

const PRESETS = [
  { name: "Slate & Snow", fg: "#0F172A", bg: "#F8FAFC" },
  { name: "Indigo Night", fg: "#EEF2F6", bg: "#312E81" },
  { name: "Forest Glade", fg: "#064E3B", bg: "#ECFDF5" },
  { name: "Coffee Cream", fg: "#451A03", bg: "#FEF3C7" },
  { name: "Neon Matrix", fg: "#10B981", bg: "#060606" },
  { name: "Sunset Plum", fg: "#FDF2F8", bg: "#831843" }
]

export function ColorContrast() {
  const [fg, setFg] = useState("#0F172A")
  const [bg, setBg] = useState("#F8FAFC")
  const [fontSize, setFontSize] = useState(16)
  const [fontWeight, setFontWeight] = useState("normal")
  const [previewText, setPreviewText] = useState("Configure these colors and see WCAG relative luminance ratings in real-time.")
  const [copiedText, setCopiedText] = useState("")

  const ratio = useMemo(() => {
    const rgbFg = hexToRgb(fg)
    const rgbBg = hexToRgb(bg)
    if (!rgbFg || !rgbBg) return 1

    const lumFg = getLuminance(rgbFg.r, rgbFg.g, rgbFg.b)
    const lumBg = getLuminance(rgbBg.r, rgbBg.g, rgbBg.b)

    const brightest = Math.max(lumFg, lumBg)
    const darkest = Math.min(lumFg, lumBg)
    return (brightest + 0.05) / (darkest + 0.05)
  }, [fg, bg])

  const formattedRatio = ratio.toFixed(2)

  const wcag = useMemo(() => {
    return {
      aaNormal: ratio >= 4.5,
      aaaNormal: ratio >= 7.0,
      aaLarge: ratio >= 3.0,
      aaaLarge: ratio >= 4.5,
      ui: ratio >= 3.0
    }
  }, [ratio])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(text)
    setTimeout(() => setCopiedText(""), 2000)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-card p-5 border rounded-2xl space-y-4 shadow-sm">
          <h2 className="text-lg font-bold">Colors Selection</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Text Color (Foreground)</label>
              <div className="flex gap-2 mt-1.5">
                <input 
                  type="color" 
                  value={fg} 
                  onChange={(e) => setFg(e.target.value)} 
                  className="w-10 h-10 border border-border rounded-xl cursor-pointer bg-transparent shrink-0" 
                />
                <input 
                  type="text" 
                  value={fg} 
                  onChange={(e) => setFg(e.target.value)} 
                  placeholder="#000000"
                  className="flex-1 px-3 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-mono" 
                />
              </div>
            </div>
            <div className="flex justify-center py-1">
              <button 
                onClick={() => { const temp = fg; setFg(bg); setBg(temp); }} 
                className="p-2 border border-border rounded-full bg-muted/30 hover:bg-muted/70 transition-colors shadow-sm cursor-pointer"
                title="Swap Colors"
              >
                <ArrowLeftRight className="h-4 w-4" />
              </button>
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Background Color</label>
              <div className="flex gap-2 mt-1.5">
                <input 
                  type="color" 
                  value={bg} 
                  onChange={(e) => setBg(e.target.value)} 
                  className="w-10 h-10 border border-border rounded-xl cursor-pointer bg-transparent shrink-0" 
                />
                <input 
                  type="text" 
                  value={bg} 
                  onChange={(e) => setBg(e.target.value)} 
                  placeholder="#FFFFFF"
                  className="flex-1 px-3 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-mono" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preset list */}
        <div className="bg-card p-5 border rounded-2xl space-y-4 shadow-sm">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Curated Presets</h2>
          <div className="grid grid-cols-2 gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => { setFg(preset.fg); setBg(preset.bg); }}
                className="p-2 border border-border rounded-xl hover:bg-muted/40 transition-all text-left group cursor-pointer shadow-sm"
              >
                <div className="h-6 w-full rounded-md border border-border flex items-center justify-center text-[9px] font-bold" style={{ backgroundColor: preset.bg, color: preset.fg }}>
                  Aa
                </div>
                <p className="text-[10px] font-bold text-muted-foreground mt-1 truncate">{preset.name}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-8 space-y-6">
        <div className="bg-card p-6 border rounded-2xl flex flex-col gap-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Contrast Ratio</h3>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-5xl font-black tracking-tight">{formattedRatio}:1</p>
                <span className={`px-2 py-0.5 rounded text-xs font-black uppercase tracking-wider ${ratio >= 4.5 ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-red-500/10 text-red-600 dark:text-red-400"}`}>
                  {ratio >= 4.5 ? "ACCESSIBLE" : "POOR CONTRAST"}
                </span>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(`Foreground: ${fg}, Background: ${bg}, Contrast: ${formattedRatio}:1`)}
              className="p-2 border border-border rounded-xl hover:bg-muted/50 transition-colors shadow-sm flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            >
              <Copy className="h-3.5 w-3.5" />
              {copiedText ? "Copied!" : "Copy Details"}
            </button>
          </div>

          {/* Compliance Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className={`p-4 border rounded-xl flex items-center justify-between shadow-sm ${wcag.aaNormal ? "border-green-500/20 bg-green-500/[0.02]" : "border-red-500/20 bg-red-500/[0.02]"}`}>
              <div>
                <p className="text-xs font-bold">AA Normal Text</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Ratio &ge; 4.5</p>
              </div>
              <span className={`text-xs font-black ${wcag.aaNormal ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {wcag.aaNormal ? "PASS" : "FAIL"}
              </span>
            </div>
            <div className={`p-4 border rounded-xl flex items-center justify-between shadow-sm ${wcag.aaaNormal ? "border-green-500/20 bg-green-500/[0.02]" : "border-red-500/20 bg-red-500/[0.02]"}`}>
              <div>
                <p className="text-xs font-bold">AAA Normal Text</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Ratio &ge; 7.0</p>
              </div>
              <span className={`text-xs font-black ${wcag.aaaNormal ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {wcag.aaaNormal ? "PASS" : "FAIL"}
              </span>
            </div>
            <div className={`p-4 border rounded-xl flex items-center justify-between shadow-sm ${wcag.aaLarge ? "border-green-500/20 bg-green-500/[0.02]" : "border-red-500/20 bg-red-500/[0.02]"}`}>
              <div>
                <p className="text-xs font-bold">AA Large Text</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Ratio &ge; 3.0</p>
              </div>
              <span className={`text-xs font-black ${wcag.aaLarge ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {wcag.aaLarge ? "PASS" : "FAIL"}
              </span>
            </div>
            <div className={`p-4 border rounded-xl flex items-center justify-between shadow-sm ${wcag.aaaLarge ? "border-green-500/20 bg-green-500/[0.02]" : "border-red-500/20 bg-red-500/[0.02]"}`}>
              <div>
                <p className="text-xs font-bold">AAA Large Text</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Ratio &ge; 4.5</p>
              </div>
              <span className={`text-xs font-black ${wcag.aaaLarge ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {wcag.aaaLarge ? "PASS" : "FAIL"}
              </span>
            </div>
            <div className={`p-4 border rounded-xl flex items-center justify-between shadow-sm ${wcag.ui ? "border-green-500/20 bg-green-500/[0.02]" : "border-red-500/20 bg-red-500/[0.02]"}`}>
              <div>
                <p className="text-xs font-bold">UI Components</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Ratio &ge; 3.0</p>
              </div>
              <span className={`text-xs font-black ${wcag.ui ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {wcag.ui ? "PASS" : "FAIL"}
              </span>
            </div>
          </div>

          {/* Interactive Preview box */}
          <div className="border border-border rounded-2xl overflow-hidden shadow-inner">
            <div className="p-3 bg-muted/30 border-b border-border flex flex-wrap gap-4 items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Interactive Live Preview</span>
              <div className="flex gap-4 items-center flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Size: {fontSize}px</span>
                  <input 
                    type="range" 
                    min="12" 
                    max="64" 
                    value={fontSize} 
                    onChange={(e) => setFontSize(parseInt(e.target.value))} 
                    className="w-24 cursor-pointer accent-primary" 
                  />
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setFontWeight("normal")} 
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${fontWeight === "normal" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                  >
                    Normal
                  </button>
                  <button 
                    onClick={() => setFontWeight("bold")} 
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${fontWeight === "bold" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                  >
                    Bold
                  </button>
                </div>
              </div>
            </div>
            <div className="p-8 min-h-[180px] flex items-center justify-center transition-colors relative" style={{ backgroundColor: bg }}>
              <input
                type="text"
                value={previewText}
                onChange={(e) => setPreviewText(e.target.value)}
                className="w-full text-center bg-transparent border-none focus:outline-none select-all focus:ring-0"
                style={{ color: fg, fontSize: `${fontSize}px`, fontWeight: fontWeight }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="bg-primary/5 border border-primary/10 p-5 rounded-2xl space-y-2">
          <h4 className="text-sm font-bold flex items-center gap-2">
            <span className="h-5 w-5 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><span className="text-[10px] font-black">1</span></span> Why Contrast Matters
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Good color contrast ensures that text is readable for everyone, including users with visual impairments, color blindness, or those viewing screens in direct sunlight.
          </p>
        </div>
        <div className="bg-primary/5 border border-primary/10 p-5 rounded-2xl space-y-2">
          <h4 className="text-sm font-bold flex items-center gap-2">
            <span className="h-5 w-5 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><span className="text-[10px] font-black">2</span></span> WCAG 2.1 Guidelines
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Level AA requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text. Level AAA requires at least 7:1 for normal text and 4.5:1 for large text.
          </p>
        </div>
        <div className="bg-primary/5 border border-primary/10 p-5 rounded-2xl space-y-2">
          <h4 className="text-sm font-bold flex items-center gap-2">
            <span className="h-5 w-5 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><span className="text-[10px] font-black">3</span></span> Inclusive Design
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            By verifying accessibility contrast ratios early in the design phase, you prevent UX issues and make sure your platform complies with standard accessibility laws.
          </p>
        </div>
      </div>

      {/* SEO Section */}
      <div className="grid md:grid-cols-2 gap-12 mt-16 border-t border-border pt-12 pb-20">
        <section>
          <h2 className="text-2xl font-black tracking-tight mb-4">Understanding Color Contrast & Web Accessibility</h2>
          <p className="text-muted-foreground leading-relaxed">
            Web content accessibility is essential for creating inclusive digital products. Color contrast refers to the difference in luminance or color between the active text (foreground) and the backdrop it is written on (background).
          </p>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            Our tool helps you test contrast dynamically using the relative luminance calculations defined by the W3C. This guarantees that your color palettes are compliant with international standards, helping you pass accessibility audits and build better products.
          </p>
        </section>
        <section className="bg-muted/30 p-8 rounded-3xl border border-border">
          <h3 className="text-xl font-black tracking-tight mb-6">WCAG 2.1 Accessibility Checklist</h3>
          <ul className="space-y-4 list-none p-0">
            {[
              { title: "AA Normal Text (Passes at ≥ 4.5:1)", desc: "Essential for standard body text, captions, and general paragraph elements under 18pt (24px) in size." },
              { title: "AAA Normal Text (Passes at ≥ 7.0:1)", desc: "The highest standard of accessibility, ensuring maximum legibility for body text." },
              { title: "AA Large Text (Passes at ≥ 3.0:1)", desc: "Applies to headings, large titles, or bold text over 14pt (approx. 18.6px) or regular text over 18pt." },
              { title: "UI Components & Icons (Passes at ≥ 3.0:1)", desc: "Includes borders of input elements, visual status indicators, active buttons, and custom SVG icons." },
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
