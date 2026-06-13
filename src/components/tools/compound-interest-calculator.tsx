"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { calculateCompoundInterest } from "@/lib/calculator-math"

export function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState(10000)
  const [contrib, setContrib] = useState(250)
  const [rate, setRate] = useState(8)
  const [tenure, setTenure] = useState(15)
  const [freq, setFreq] = useState<"monthly" | "quarterly" | "annually">("monthly")
  const [inflation, setInflation] = useState(3)

  const {
    nominalFutureValue,
    realFutureValue,
    totalInvested,
    totalInterestEarned,
    yearlyBreakdown,
  } = calculateCompoundInterest({
    principal,
    monthlyContrib: contrib,
    rate,
    tenureYears: tenure,
    frequency: freq,
    inflationRate: inflation,
  })

  return (<>
    <div className="grid lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Investment Settings</CardTitle>
          <select
            value={freq}
            onChange={(e: any) => setFreq(e.target.value)}
            className="h-8 border rounded-lg bg-background px-2 text-xs focus:outline-none font-bold"
          >
            <option value="monthly">Monthly Compounding</option>
            <option value="quarterly">Quarterly Compounding</option>
            <option value="annually">Annual Compounding</option>
          </select>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Initial Principal (₹)</Label>
              <span className="font-semibold text-primary">₹{principal.toLocaleString("en-IN")}</span>
            </div>
            <Slider
              value={[principal]}
              min={1000}
              max={1000000}
              step={5000}
              onValueChange={(val: any) => setPrincipal(Array.isArray(val) ? val[0] : val)}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Monthly Contribution (₹)</Label>
              <span className="font-semibold text-primary">₹{contrib.toLocaleString("en-IN")}</span>
            </div>
            <Slider
              value={[contrib]}
              min={0}
              max={50000}
              step={100}
              onValueChange={(val: any) => setContrib(Array.isArray(val) ? val[0] : val)}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Interest Rate (% annual)</Label>
              <span className="font-semibold text-primary">{rate}%</span>
            </div>
            <Slider
              value={[rate]}
              min={1}
              max={25}
              step={0.1}
              onValueChange={(val: any) => setRate(Array.isArray(val) ? val[0] : val)}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Estimated Inflation Rate (% annual)</Label>
              <span className="font-semibold text-primary">{inflation}%</span>
            </div>
            <Slider
              value={[inflation]}
              min={0}
              max={15}
              step={0.5}
              onValueChange={(val: any) => setInflation(Array.isArray(val) ? val[0] : val)}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Investment Period (Years)</Label>
              <span className="font-semibold text-primary">{tenure} Yrs</span>
            </div>
            <Slider
              value={[tenure]}
              min={1}
              max={40}
              step={1}
              onValueChange={(val: any) => setTenure(Array.isArray(val) ? val[0] : val)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Returns Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6 text-center">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Nominal Future Value</p>
                <p className="text-xl font-black text-primary">₹{nominalFutureValue.toLocaleString("en-IN")}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Real Value (Inflation-Adjusted)</p>
                <p className="text-xl font-black text-green-500">₹{realFutureValue.toLocaleString("en-IN")}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Total Amount Invested</p>
                <p className="text-lg font-bold">₹{totalInvested.toLocaleString("en-IN")}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Total Interest Earned</p>
                <p className="text-lg font-bold">₹{totalInterestEarned.toLocaleString("en-IN")}</p>
              </div>
            </div>

            <div className="h-[250px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={yearlyBreakdown}>
                  <defs>
                    <linearGradient id="nominalG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0088FE" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#0088FE" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="realG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${Math.round(v/1000)}k`} />
                  <Tooltip formatter={(v: any) => `₹${Number(v).toLocaleString("en-IN")}`} />
                  <Legend />
                  <Area type="monotone" name="Nominal Value" dataKey="nominalValue" stroke="#0088FE" fillOpacity={1} fill="url(#nominalG)" />
                  <Area type="monotone" name="Real Value (Inflation)" dataKey="realValue" stroke="#10B981" fillOpacity={1} fill="url(#realG)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    {/* SEO Section */}
    <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12">
      <section>
        <h2 className="text-2xl font-black tracking-tight mb-4">The Power of Compound Interest & Inflation</h2>
        <p className="text-muted-foreground leading-relaxed">
          Compound interest is the interest earned on your initial principal amount plus the interest accumulated over previous periods. Widely regarded as the "eighth wonder of the world," compounding accelerates wealth growth because your returns generate their own returns, compounding exponentially over longer investment horizons.
        </p>
        <p className="text-muted-foreground mt-4 leading-relaxed">
          However, inflation naturally erodes the purchasing power of your money. A nominal return of ₹1,00,000 in 20 years will not buy the same amount of goods as it does today. Our calculator accounts for this by computing the "Real Future Value" (inflation-adjusted), letting you see the true buying power of your wealth in today's currency value.
        </p>
      </section>
      <section className="bg-muted/30 p-8 rounded-3xl border border-primary/5">
        <h3 className="text-xl font-black tracking-tight mb-6">How to Use the Compound Interest Calculator</h3>
        <ul className="space-y-4 list-none p-0">
          {[
            { title: "Enter Initial Investment", desc: "Set the start principal amount you have available to invest immediately." },
            { title: "Add Monthly Contributions", desc: "Specify any recurring monthly savings you will add to the portfolio to speed up growth." },
            { title: "Define Interest Rate & Horizon", desc: "Select the annual interest rate (nominal yield) and the total number of years you want the investment to compound." },
            { title: "Adjust the Inflation Rate", desc: "Input an average expected annual inflation rate (typically 3–7%) to see the real, deflated value of your future capital." },
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
