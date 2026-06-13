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

  return (<>
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
              onValueChange={(val: any) => setWeight(Array.isArray(val) ? val[0] : val)}
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
              onValueChange={(val: any) => setHeight(Array.isArray(val) ? val[0] : val)}
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

    {/* SEO Section */}
    <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12">
      <section>
        <h2 className="text-2xl font-black tracking-tight mb-4">What is Body Mass Index (BMI)?</h2>
        <p className="text-muted-foreground leading-relaxed">
          Body Mass Index (BMI) is a widely recognized medical metric used to estimate a person's body fat based on their height and weight. Calculated by dividing weight in kilograms by the square of height in meters ($BMI = kg/m^2$), it offers a quick way to screen for potential weight-related health conditions.
        </p>
        <p className="text-muted-foreground mt-4 leading-relaxed">
          While BMI does not measure body composition (fat vs. muscle) directly, it is highly useful for classifying weight status into general categories: Underweight (BMI &lt; 18.5), Normal weight (18.5–24.9), Overweight (25–29.9), and Obese (30 or higher). This classification helps health professionals identify individuals who may benefit from weight management support.
        </p>
      </section>
      <section className="bg-muted/30 p-8 rounded-3xl border border-primary/5">
        <h3 className="text-xl font-black tracking-tight mb-6">How to Use & Interpret BMI Results</h3>
        <ul className="space-y-4 list-none p-0">
          {[
            { title: "Select Unit System", desc: "Toggle between Metric (kilograms and centimeters) or Imperial (pounds and feet/inches) input styles." },
            { title: "Input Weight & Height", desc: "Drag the sliders or enter your numbers directly. Accurate height and weight are critical for an exact BMI score." },
            { title: "Check the Classification Index", desc: "View where your indicator line settles on the colored range: blue is underweight, green is normal, orange is overweight, and red is obese." },
            { title: "Understand the Limitations", desc: "Keep in mind that BMI can overestimate body fat in athletes with high muscle mass and underestimate fat in elderly individuals who have lost muscle." },
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
