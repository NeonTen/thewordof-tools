"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { calculateBmi } from "@/lib/calculator-math"

export function BmiCalculator() {
  const [isMetric, setIsMetric] = useState(true)
  const [weight, setWeight] = useState(70) // kg (metric) or lbs (imperial)
  const [height, setHeight] = useState(170) // cm (metric) or inches (imperial)

  const toggleUnits = (metric: boolean) => {
    setIsMetric(metric)
    if (metric) {
      setWeight(Math.round(weight * 0.453592) || 70)
      setHeight(Math.round(height * 2.54) || 170)
    } else {
      setWeight(Math.round(weight / 0.453592) || 154)
      setHeight(Math.round(height / 2.54) || 67)
    }
  }

  const { score, category } = calculateBmi(weight, height, isMetric)

  const categoryColors = {
    Underweight: "text-blue-500 bg-blue-500/10",
    Normal: "text-green-500 bg-green-500/10",
    Overweight: "text-orange-500 bg-orange-500/10",
    Obese: "text-red-500 bg-red-500/10",
  }

  const pointerPos = Math.min(Math.max(((score - 15) / (35 - 15)) * 100, 0), 100)

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Measurements</CardTitle>
          <div className="flex bg-muted p-1 rounded-lg">
            <button
              onClick={() => toggleUnits(true)}
              className={`text-xs px-3 py-1.5 rounded-md font-bold transition-all ${isMetric ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
            >
              Metric
            </button>
            <button
              onClick={() => toggleUnits(false)}
              className={`text-xs px-3 py-1.5 rounded-md font-bold transition-all ${!isMetric ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
            >
              Imperial
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Weight ({isMetric ? "kg" : "lbs"})</Label>
              <span className="font-semibold text-primary">{weight} {isMetric ? "kg" : "lbs"}</span>
            </div>
            <Slider
              value={[weight]}
              min={isMetric ? 30 : 66}
              max={isMetric ? 200 : 440}
              step={1}
              onValueChange={(val: any) => setWeight(val[0])}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Height ({isMetric ? "cm" : "inches"})</Label>
              <span className="font-semibold text-primary">
                {isMetric ? `${height} cm` : `${Math.floor(height / 12)}'${height % 12}" (${height} in)`}
              </span>
            </div>
            <Slider
              value={[height]}
              min={isMetric ? 100 : 39}
              max={isMetric ? 220 : 86}
              step={1}
              onValueChange={(val: any) => setHeight(val[0])}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your BMI Results</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-between h-[80%] space-y-6">
          <div className="text-center p-6 bg-muted/30 rounded-2xl border border-primary/5">
            <span className="text-sm text-muted-foreground">Your Body Mass Index</span>
            <h3 className="text-5xl font-black tracking-tight text-primary mt-2">{score}</h3>
            <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-bold ${categoryColors[category]}`}>
              {category}
            </span>
          </div>

          <div className="space-y-2">
            <div className="relative h-2 w-full bg-muted rounded-full overflow-visible">
              <div 
                className="absolute top-[-8px] h-6 w-1 bg-primary rounded-full transition-all duration-300"
                style={{ left: `${pointerPos}%` }}
              />
              <div className="absolute top-3 left-0 w-full flex justify-between text-[10px] text-muted-foreground px-1">
                <span className="text-blue-500">&lt;18.5 Under</span>
                <span className="text-green-500">18.5-25 Norm</span>
                <span className="text-orange-500">25-30 Over</span>
                <span className="text-red-500">30+ Obese</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
