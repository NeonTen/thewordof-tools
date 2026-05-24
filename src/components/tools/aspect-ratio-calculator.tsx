"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { calculateAspectRatio, getGcd } from "@/lib/calculator-math"

const PRESETS = [
  { name: "16:9 (HD Video)", w: 16, h: 9 },
  { name: "4:3 (Retro TV)", w: 4, h: 3 },
  { name: "1:1 (Square)", w: 1, h: 1 },
  { name: "9:16 (Story/TikTok)", w: 9, h: 16 },
  { name: "21:9 (Ultrawide)", w: 21, h: 9 },
]

export function AspectRatioCalculator() {
  const [w, setW] = useState(1920)
  const [h, setH] = useState(1080)
  const [targetVal, setTargetVal] = useState(1280)
  const [mode, setMode] = useState<"width" | "height">("width")

  const calculatedVal = calculateAspectRatio(w, h, targetVal, mode)
  const gcd = getGcd(w, h)
  const ratioString = gcd > 0 ? `${w / gcd}:${h / gcd}` : "N/A"

  const applyPreset = (presetW: number, presetH: number) => {
    setW(presetW)
    setH(presetH)
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Base Aspect Ratio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Original Width (px)</Label>
              <Input
                type="number"
                value={w}
                onChange={(e) => setW(Number(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label>Original Height (px)</Label>
              <Input
                type="number"
                value={h}
                onChange={(e) => setH(Number(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Presets</Label>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => applyPreset(p.w, p.h)}
                  className="text-xs border px-3 py-1.5 rounded-lg font-bold hover:bg-muted/80 transition-colors"
                >
                  {p.w}:{p.h}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dimension Calculation & Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4 p-4 bg-muted/30 rounded-2xl border border-primary/5 justify-around text-center">
            <div>
              <p className="text-xs text-muted-foreground">Detected Ratio</p>
              <p className="text-2xl font-black text-primary mt-1">{ratioString}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Target Size</p>
              <p className="text-2xl font-black text-foreground mt-1">
                {mode === "width" ? `${targetVal} × ${calculatedVal}` : `${calculatedVal} × ${targetVal}`}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <div className="flex justify-between items-center">
                <Label>Target Value</Label>
                <div className="flex bg-muted p-0.5 rounded-lg text-xs">
                  <button
                    onClick={() => setMode("width")}
                    className={`px-3 py-1 rounded-md font-bold transition-all ${mode === "width" ? "bg-background text-foreground" : "text-muted-foreground"}`}
                  >
                    Set Width
                  </button>
                  <button
                    onClick={() => setMode("height")}
                    className={`px-3 py-1 rounded-md font-bold transition-all ${mode === "height" ? "bg-background text-foreground" : "text-muted-foreground"}`}
                  >
                    Set Height
                  </button>
                </div>
              </div>
              <Input
                type="number"
                value={targetVal}
                onChange={(e) => setTargetVal(Number(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Visual Ratio Preview</Label>
            <div className="flex items-center justify-center p-6 border rounded-2xl bg-muted/20 min-h-[160px]">
              <div
                className="bg-primary/20 border-2 border-primary/40 rounded-xl transition-all duration-300 flex items-center justify-center text-xs font-bold text-primary max-w-full"
                style={{
                  aspectRatio: ratioString.includes("N/A") ? "1" : ratioString.replace(":", "/"),
                  width: "150px",
                }}
              >
                {ratioString}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
