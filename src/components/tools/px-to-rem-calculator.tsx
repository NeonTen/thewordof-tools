"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { pxToRem, remToPx } from "@/lib/calculator-math"

const REF_SIZES = [4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96, 128]

export function PxToRemCalculator() {
  const [base, setBase] = useState(16)
  const [px, setPx] = useState(16)
  const [rem, setRem] = useState(1)

  const handlePxChange = (val: number) => {
    setPx(val)
    setRem(pxToRem(val, base))
  }

  const handleRemChange = (val: number) => {
    setRem(val)
    setPx(remToPx(val, base))
  }

  const handleBaseChange = (val: number) => {
    setBase(val)
    setRem(pxToRem(px, val))
  }

  return (<>
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Conversion Panel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Base Font Size (px)</Label>
              <Input
                type="number"
                value={base}
                onChange={(e) => handleBaseChange(Number(e.target.value) || 0)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Pixels (px)</Label>
                <Input
                  type="number"
                  value={px}
                  onChange={(e) => handlePxChange(Number(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label>REM (rem)</Label>
                <Input
                  type="number"
                  value={rem}
                  step={0.0625}
                  onChange={(e) => handleRemChange(Number(e.target.value) || 0)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Conversion Chart (Base: {base}px)</CardTitle>
        </CardHeader>
        <CardContent className="max-h-[350px] overflow-y-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-muted-foreground font-semibold">Pixels</th>
                <th className="py-2 text-muted-foreground font-semibold">REMs</th>
                <th className="py-2 text-muted-foreground font-semibold">Tailwind Class</th>
              </tr>
            </thead>
            <tbody>
              {REF_SIZES.map((size) => {
                const calculatedRem = pxToRem(size, base)
                const tailwindClass = size % 4 === 0 ? `w-${size / 4}` : `w-[${size}px]`
                return (
                  <tr 
                    key={size} 
                    className={`border-b hover:bg-muted/30 transition-colors cursor-pointer ${px === size ? "bg-primary/5 font-bold text-primary" : ""}`}
                    onClick={() => handlePxChange(size)}
                  >
                    <td className="py-2">{size}px</td>
                    <td className="py-2 text-primary">{calculatedRem}rem</td>
                    <td className="py-2 font-mono text-xs text-muted-foreground">{tailwindClass}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>

    {/* SEO Section */}
    <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12 pb-20">
      <section>
        <h2 className="text-2xl font-black tracking-tight mb-4">Why Convert PX to REM?</h2>
        <p className="text-muted-foreground leading-relaxed">
          Pixel (PX) is an absolute sizing unit, meaning it represents a fixed physical dot on a screen. REM (Root EM) is a relative sizing unit whose value is calculated relative to the HTML document's root font-size. By default, most modern web browsers define the base font-size as 16px.
        </p>
        <p className="text-muted-foreground mt-4 leading-relaxed">
          Converting pixel dimensions to REM units is an industry-standard best practice for building accessible, responsive web designs. If a user increases their browser's default font size (e.g. for accessibility or visual impairment), REM-based typography, margins, and padding scale proportionally, preventing content overlaps and broken layouts.
        </p>
      </section>
      <section className="bg-muted/30 p-8 rounded-3xl border border-primary/5">
        <h3 className="text-xl font-black tracking-tight mb-6">How to Use the PX to REM Converter</h3>
        <ul className="space-y-4 list-none p-0">
          {[
            { title: "Define the Root Base Size", desc: "Set the base font-size (default is 16px). This value represents what 1rem evaluates to in pixels." },
            { title: "Enter Absolute Pixels", desc: "Type in any pixel dimension (e.g., 24px) to instantly see its relative REM equivalent (e.g., 1.5rem)." },
            { title: "Convert REMs Back to Pixels", desc: "Type in a REM value to calculate its corresponding pixel size based on the set base value." },
            { title: "Use Tailwind Sizing Mapping", desc: "Reference the interactive conversion chart to quickly copy Tailwind utility class names (like w-4, p-8) into your code." },
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
