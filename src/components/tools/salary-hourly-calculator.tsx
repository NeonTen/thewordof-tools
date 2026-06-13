"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { calculateSalaryToHourly } from "@/lib/calculator-math"

export function SalaryHourlyCalculator() {
  const [amount, setAmount] = useState(50000)
  const [frequency, setFrequency] = useState<"annual" | "monthly" | "weekly" | "hourly">("annual")
  const [hours, setHours] = useState(40)
  const [weeks, setWeeks] = useState(52)

  const breakdown = calculateSalaryToHourly(amount, frequency, hours, weeks)

  const frequencies = [
    { label: "Hourly", value: breakdown.hourly, key: "hourly" },
    { label: "Daily (8h/day)", value: breakdown.daily, key: "daily" },
    { label: "Weekly", value: breakdown.weekly, key: "weekly" },
    { label: "Bi-weekly", value: breakdown.biweekly, key: "biweekly" },
    { label: "Monthly", value: breakdown.monthly, key: "monthly" },
    { label: "Annual", value: breakdown.annual, key: "annual" },
  ]

  return (<>
    <div className="grid lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Base Compensation Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2 space-y-2">
              <Label>Base Amount (₹)</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label>Period</Label>
              <select
                value={frequency}
                onChange={(e: any) => setFrequency(e.target.value)}
                className="w-full h-10 border rounded-lg bg-background px-3 text-sm focus:outline-none font-bold"
              >
                <option value="annual">Yearly</option>
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="hourly">Hourly</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Work Hours / Week</Label>
              <Input
                type="number"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label>Work Weeks / Year</Label>
              <Input
                type="number"
                value={weeks}
                onChange={(e) => setWeeks(Number(e.target.value) || 0)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Salary Conversion Equivalents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {frequencies.map((f) => (
              <div 
                key={f.key} 
                className={`p-4 bg-muted/40 rounded-xl border border-primary/5 transition-all duration-200 ${frequency === f.key ? "bg-primary/5 border-primary/20 scale-[1.02]" : ""}`}
              >
                <p className="text-xs text-muted-foreground">{f.label} Equivalent</p>
                <p className="text-xl font-black text-foreground mt-1">₹{f.value.toLocaleString("en-IN")}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>

    {/* SEO Section */}
    <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12">
      <section>
        <h2 className="text-2xl font-black tracking-tight mb-4">Why Calculate Salary to Hourly Rates?</h2>
        <p className="text-muted-foreground leading-relaxed">
          Converting an annual salary into an hourly wage (and vice-versa) is highly valuable when comparing job offers, negotiating contract positions, or determining freelance rates. Knowing your exact hourly earnings lets you measure the true financial value of your time and evaluate if a salary matches your work-life expectations.
        </p>
        <p className="text-muted-foreground mt-4 leading-relaxed">
          A standard full-time position consists of a 40-hour work week over 52 weeks a year, totaling 2,080 working hours. However, your actual hours and paid vacation weeks may vary. This calculator takes those factors into account to deliver an exact, personalized breakdown of your daily, weekly, bi-weekly, monthly, and yearly earnings.
        </p>
      </section>
      <section className="bg-muted/30 p-8 rounded-3xl border border-primary/5">
        <h3 className="text-xl font-black tracking-tight mb-6">How to Convert Compensation Rates</h3>
        <ul className="space-y-4 list-none p-0">
          {[
            { title: "Input Base Pay Amount", desc: "Type in your starting wage amount (e.g. ₹6,00,000 for annual or ₹50,000 for monthly)." },
            { title: "Select Compensation Period", desc: "Select the frequency matching your pay amount: yearly, monthly, weekly, or hourly." },
            { title: "Configure Weekly Work Hours", desc: "Specify the number of hours you work each week (typically 35, 40, or 45 hours) to ensure precise division." },
            { title: "Set Annual Working Weeks", desc: "Enter the number of working weeks per year (default is 52). You can subtract unpaid weeks off if applicable." },
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
