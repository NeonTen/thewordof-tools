"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { calculateLineHeight } from "@/lib/calculator-math"

export function LineHeightCalculator() {
  const [baseSize, setBaseSize] = useState(16)
  const [value, setValue] = useState(24)
  const [unit, setUnit] = useState<"px" | "rem" | "percent">("px")

  const relative = calculateLineHeight(baseSize, value, unit)

  return (<>
    <div className="grid lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Converter Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Base Font Size (px)</Label>
            <Input
              type="number"
              value={baseSize}
              onChange={(e) => setBaseSize(Number(e.target.value) || 0)}
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2 space-y-2">
              <Label>Line-Height Value</Label>
              <Input
                type="number"
                value={value}
                onChange={(e) => setValue(Number(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label>Unit</Label>
              <select
                value={unit}
                onChange={(e: any) => setUnit(e.target.value)}
                className="w-full h-10 border rounded-lg bg-background px-3 text-sm focus:outline-none"
              >
                <option value="px">px</option>
                <option value="rem">rem</option>
                <option value="percent">%</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Results & Live Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-5 bg-muted/30 rounded-2xl border border-primary/5 text-center">
            <p className="text-xs text-muted-foreground">Relative Unitless Line-Height</p>
            <h3 className="text-4xl font-black text-primary mt-2">{relative}</h3>
            <p className="text-[10px] text-muted-foreground mt-2">
              In Tailwind CSS: <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono">leading-[{relative}]</code>
            </p>
          </div>

          <div className="space-y-2">
            <Label>Typography Preview</Label>
            <div className="p-4 border rounded-2xl bg-muted/10">
              <p 
                className="text-foreground transition-all duration-200"
                style={{
                  fontSize: `${baseSize}px`,
                  lineHeight: relative,
                }}
              >
                The quick brown fox jumps over the lazy dog. A fast preview demonstrating vertical rhythm, margins, baseline consistency, and text tracking in web typography.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    {/* SEO Section */}
    <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12 pb-20">
      <section>
        <h2 className="text-2xl font-black tracking-tight mb-4">What is Line-height and Why Does it Matter?</h2>
        <p className="text-muted-foreground leading-relaxed">
          Line-height (also known as leading) is a CSS property that controls the vertical space between lines of text in web typography. Setting the correct line-height is fundamental to improving readability and visual aesthetic. Too little line-height crowds text and strains the eyes, while too much line-height breaks the reader's flow.
        </p>
        <p className="text-muted-foreground mt-4 leading-relaxed">
          In professional web development, it is recommended to use unitless, relative line-height values (e.g. `1.5` instead of `24px`). A unitless value is inherited dynamically relative to the font-size of elements, preventing layout overflow issues when users resize text.
        </p>
      </section>
      <section className="bg-muted/30 p-8 rounded-3xl border border-primary/5">
        <h3 className="text-xl font-black tracking-tight mb-6">How to Convert Line-height Formats</h3>
        <ul className="space-y-4 list-none p-0">
          {[
            { title: "Define the Base Font Size", desc: "Input the current font-size of your text in pixels (e.g. 16px). This establishes the scale for conversions." },
            { title: "Input Current Line-height", desc: "Enter your styling value and select its format (absolute PX, relative REM, or percentage)." },
            { title: "Generate Relative Multipliers", desc: "Read the converted relative line-height output (e.g., 1.5) to configure dynamic sizing stylesheets." },
            { title: "Review typography Layout", desc: "Observe the typography preview box to evaluate the visual vertical rhythm and text density in real time." },
          ].map((item, i) => (
            <li key={i} className="flex gap-4">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black text-primary">{i + 1}</div>
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
