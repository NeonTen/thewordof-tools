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

  return (
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
  )
}
