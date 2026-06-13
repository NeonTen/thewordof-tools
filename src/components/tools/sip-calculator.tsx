"use client"

import React, { useState } from "react"
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

const COLORS = ['#10b981', '#6366f1'] // Emerald for invested, Indigo for returns

export function SipCalculator({ isPro = false }: { isPro?: boolean }) {
  const [investment, setInvestment] = useState(10000)
  const [returnRate, setReturnRate] = useState(12)
  const [years, setYears] = useState(10)

  // SIP Formula: M = P * ({[1 + i]n – 1} / i) * (1 + i)
  const calculateSIP = () => {
    const P = investment
    const n = years * 12
    const i = returnRate / 12 / 100
    
    const M = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i)
    return M
  }

  const expectedAmount = calculateSIP()
  const totalInvested = investment * years * 12
  const wealthGained = expectedAmount - totalInvested

  const chartData = [
    { name: 'Invested Amount', value: totalInvested },
    { name: 'Est. Returns', value: wealthGained },
  ]

  return (<>
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>SIP Return Calculator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Monthly Investment (₹)</Label>
                <span className="font-semibold text-primary">
                  ₹{investment.toLocaleString('en-IN')}
                </span>
              </div>
              <Slider 
                value={[investment]} 
                min={500} 
                max={100000} 
                step={500}
                onValueChange={(val: any) => setInvestment(Array.isArray(val) ? val[0] : val)}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Expected Return Rate (p.a)</Label>
                <span className="font-semibold text-primary">
                  {returnRate}%
                </span>
              </div>
              <Slider 
                value={[returnRate]} 
                min={1} 
                max={30} 
                step={0.5}
                onValueChange={(val: any) => setReturnRate(Array.isArray(val) ? val[0] : val)}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Time Period (Years)</Label>
                <span className="font-semibold text-primary">
                  {years} Yr
                </span>
              </div>
              <Slider 
                value={[years]} 
                min={1} 
                max={40} 
                step={1}
                onValueChange={(val: any) => setYears(Array.isArray(val) ? val[0] : val)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Investment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-8 text-center">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Total Invested</p>
                <p className="text-xl font-bold">₹{Math.round(totalInvested).toLocaleString('en-IN')}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Est. Returns</p>
                <p className="text-xl font-bold text-emerald-500">₹{Math.round(wealthGained).toLocaleString('en-IN')}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg col-span-2">
                <p className="text-sm text-muted-foreground mb-1">Total Value</p>
                <p className="text-3xl font-bold text-primary">₹{Math.round(expectedAmount).toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value: any) => `₹${Number(value).toLocaleString('en-IN')}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    {/* SEO Section */}
    <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12">
      <section>
        <h2 className="text-2xl font-black tracking-tight mb-4">What is a SIP Calculator?</h2>
        <p className="text-muted-foreground leading-relaxed">
          A SIP (Systematic Investment Plan) calculator estimates the future value of your monthly mutual fund investments over time. By inputting a fixed monthly amount, expected annual return rate, and investment duration, it shows you the potential corpus you can build through the power of compounding.
        </p>
        <p className="text-muted-foreground mt-4 leading-relaxed">
          SIP is one of the most popular ways to invest in mutual funds in India. Rather than investing a lump sum, SIP lets you invest a small amount every month, reducing the impact of market volatility through rupee cost averaging.
        </p>
      </section>
      <section className="bg-muted/30 p-8 rounded-3xl border border-primary/5">
        <h3 className="text-xl font-black tracking-tight mb-6">Why Invest via SIP?</h3>
        <ul className="space-y-4 list-none p-0">
          {[
            { title: "Power of Compounding", desc: "Returns earned each month are reinvested, generating exponential growth over long periods. ₹5,000/month for 20 years at 12% becomes ₹50 lakhs." },
            { title: "Rupee Cost Averaging", desc: "Buying more units when prices are low and fewer when prices are high averages out your cost over time." },
            { title: "Low Entry Barrier", desc: "Start with as little as ₹500/month. SIPs make equity investing accessible to everyone, not just the wealthy." },
            { title: "Financial Discipline", desc: "Automating monthly investments builds a habit of saving first and spending what remains." },
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
