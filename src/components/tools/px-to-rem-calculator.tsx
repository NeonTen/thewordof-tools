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

  return (
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
  )
}
