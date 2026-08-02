"use client"

import React, { useState } from "react"
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Calculator, Calendar, ChevronDown, ChevronRight, FileSpreadsheet, Layers, TrendingUp } from "lucide-react"

const COLORS = ['#10b981', '#6366f1'] // Emerald for invested, Indigo for returns

interface MonthlySipBreakdown {
  monthNumber: number
  overallMonth: number
  monthlyDeposit: number
  totalInvested: number
  estimatedReturns: number
  corpusValue: number
}

interface YearlySipAmortization {
  year: number
  investedThisYear: number
  totalInvestedToDate: number
  estimatedReturnsToDate: number
  corpusValue: number
  months: MonthlySipBreakdown[]
}

export function SipCalculator({ isPro = false }: { isPro?: boolean }) {
  const [investment, setInvestment] = useState(10000)
  const [returnRate, setReturnRate] = useState(12)
  const [years, setYears] = useState(10)
  const [expandedYears, setExpandedYears] = useState<number[]>([])

  // SIP Formula: M = P * ({[1 + i]n – 1} / i) * (1 + i)
  const calculateSIP = () => {
    const P = investment
    const n = years * 12
    const i = returnRate / 12 / 100
    if (i <= 0 || n <= 0) return P * n
    
    const M = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i)
    return isNaN(M) ? 0 : M
  }

  const expectedAmount = calculateSIP()
  const totalInvested = investment * years * 12
  const wealthGained = Math.max(0, expectedAmount - totalInvested)

  const chartData = [
    { name: 'Invested Amount', value: totalInvested },
    { name: 'Est. Returns', value: wealthGained },
  ]

  // Calculate year-by-year and month-by-month SIP growth schedule
  const getYearlySchedule = (): YearlySipAmortization[] => {
    const P = investment
    const rate = returnRate / 12 / 100
    if (P <= 0 || rate <= 0 || years <= 0) return []

    const schedule: YearlySipAmortization[] = []
    let overallMonthCount = 0

    for (let y = 1; y <= years; y++) {
      const monthlyList: MonthlySipBreakdown[] = []

      for (let m = 1; m <= 12; m++) {
        overallMonthCount++
        const n = overallMonthCount
        const corpus = P * ((Math.pow(1 + rate, n) - 1) / rate) * (1 + rate)
        const cumInvested = P * n
        const estReturns = Math.max(0, corpus - cumInvested)

        monthlyList.push({
          monthNumber: m,
          overallMonth: n,
          monthlyDeposit: Math.round(P),
          totalInvested: Math.round(cumInvested),
          estimatedReturns: Math.round(estReturns),
          corpusValue: Math.round(corpus)
        })
      }

      const endOfYearMonth = monthlyList[monthlyList.length - 1]

      schedule.push({
        year: y,
        investedThisYear: Math.round(P * 12),
        totalInvestedToDate: endOfYearMonth.totalInvested,
        estimatedReturnsToDate: endOfYearMonth.estimatedReturns,
        corpusValue: endOfYearMonth.corpusValue,
        months: monthlyList
      })
    }

    return schedule
  }

  const yearlySchedule = getYearlySchedule()

  const toggleYear = (year: number) => {
    setExpandedYears(prev => 
      prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year]
    )
  }

  const toggleAllYears = () => {
    if (expandedYears.length === yearlySchedule.length) {
      setExpandedYears([])
    } else {
      setExpandedYears(yearlySchedule.map(s => s.year))
    }
  }

  return (
    <div className="space-y-10">
      {/* Top Input & Summary Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Controls Card */}
        <Card className="border-primary/10 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <Calculator className="h-5 w-5 text-primary" /> SIP Parameters
            </CardTitle>
            <CardDescription>
              Adjust sliders or type custom values directly into the fields.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Monthly Investment */}
            <div className="space-y-3">
              <div className="flex justify-between items-center gap-4">
                <Label htmlFor="investment-input" className="font-bold text-sm">Monthly Investment (₹)</Label>
                <div className="relative w-44">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">₹</span>
                  <Input
                    id="investment-input"
                    type="number"
                    min={100}
                    max={10000000}
                    value={investment || ''}
                    onChange={(e) => {
                      const val = Number(e.target.value)
                      setInvestment(isNaN(val) ? 0 : val)
                    }}
                    className="pl-7 h-9 text-right font-bold text-sm bg-muted/20"
                  />
                </div>
              </div>
              <Slider 
                value={[investment]} 
                min={500} 
                max={100000} 
                step={500}
                onValueChange={(val: any) => setInvestment(Array.isArray(val) ? val[0] : (typeof val === 'number' ? val : 0))}
              />
              <div className="flex justify-between text-[11px] text-muted-foreground font-medium">
                <span>₹500</span>
                <span>₹50,000</span>
                <span>₹1 Lakh</span>
              </div>
            </div>

            {/* Expected Return Rate */}
            <div className="space-y-3">
              <div className="flex justify-between items-center gap-4">
                <Label htmlFor="rate-input" className="font-bold text-sm">Expected Return Rate (% p.a)</Label>
                <div className="relative w-32">
                  <Input
                    id="rate-input"
                    type="number"
                    step="0.5"
                    min={1}
                    max={40}
                    value={returnRate || ''}
                    onChange={(e) => {
                      const val = Number(e.target.value)
                      setReturnRate(isNaN(val) ? 0 : val)
                    }}
                    className="pr-7 h-9 text-right font-bold text-sm bg-muted/20"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">%</span>
                </div>
              </div>
              <Slider 
                value={[returnRate]} 
                min={1} 
                max={30} 
                step={0.5}
                onValueChange={(val: any) => setReturnRate(Array.isArray(val) ? val[0] : (typeof val === 'number' ? val : 0))}
              />
              <div className="flex justify-between text-[11px] text-muted-foreground font-medium">
                <span>1%</span>
                <span>15%</span>
                <span>30%</span>
              </div>
            </div>

            {/* Time Period */}
            <div className="space-y-3">
              <div className="flex justify-between items-center gap-4">
                <Label htmlFor="years-input" className="font-bold text-sm">Time Period (Years)</Label>
                <div className="relative w-32">
                  <Input
                    id="years-input"
                    type="number"
                    min={1}
                    max={40}
                    value={years || ''}
                    onChange={(e) => {
                      const val = Number(e.target.value)
                      setYears(isNaN(val) ? 0 : val)
                    }}
                    className="pr-10 h-9 text-right font-bold text-sm bg-muted/20"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">Yr</span>
                </div>
              </div>
              <Slider 
                value={[years]} 
                min={1} 
                max={40} 
                step={1}
                onValueChange={(val: any) => setYears(Array.isArray(val) ? val[0] : (typeof val === 'number' ? val : 0))}
              />
              <div className="flex justify-between text-[11px] text-muted-foreground font-medium">
                <span>1 Year</span>
                <span>20 Years</span>
                <span>40 Years</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Breakdown Summary Card */}
        <Card className="border-primary/10 shadow-sm flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Investment Returns Summary</CardTitle>
            <CardDescription>Wealth accumulation and total corpus value projection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl col-span-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Expected Total Corpus Value</p>
                <p className="text-3xl font-black text-primary">₹{Math.round(expectedAmount).toLocaleString('en-IN')}</p>
              </div>
              <div className="p-3 bg-muted/40 rounded-xl border">
                <p className="text-[11px] font-bold text-muted-foreground mb-1">Total Invested Amount</p>
                <p className="text-lg font-black">₹{Math.round(totalInvested).toLocaleString('en-IN')}</p>
              </div>
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mb-1">Est. Returns (Wealth Gained)</p>
                <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">₹{Math.round(wealthGained).toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
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

      {/* Year-by-Year Amortization Schedule Table with Monthly Accordions */}
      <Card className="border-primary/10 shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/20 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
          <div>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-primary" /> Year-by-Year & Monthly Investment Growth Schedule
            </CardTitle>
            <CardDescription className="text-xs">
              Click any year row to expand its detailed 12-month investment growth report.
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            {yearlySchedule.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={toggleAllYears}
                className="h-8 text-xs font-bold gap-1.5"
              >
                <Layers className="h-3.5 w-3.5" />
                {expandedYears.length === yearlySchedule.length ? "Collapse All Years" : "Expand All Years"}
              </Button>
            )}
            <div className="text-xs font-bold bg-primary/10 text-primary px-3 py-1.5 rounded-full border border-primary/20 shrink-0">
              {years} {years === 1 ? 'Year' : 'Years'} Investment Period
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {yearlySchedule.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Please enter valid investment parameters to generate schedule.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b bg-muted/40 text-muted-foreground font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4 w-12 text-center"></th>
                    <th className="py-3 px-4">Year</th>
                    <th className="py-3 px-4 text-right">Invested in Year (₹)</th>
                    <th className="py-3 px-4 text-right">Total Invested to Date (₹)</th>
                    <th className="py-3 px-4 text-right">Est. Returns to Date (₹)</th>
                    <th className="py-3 px-4 text-right">Corpus Value (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {yearlySchedule.map((row) => {
                    const isExpanded = expandedYears.includes(row.year)
                    return (
                      <React.Fragment key={row.year}>
                        <tr 
                          onClick={() => toggleYear(row.year)}
                          className="hover:bg-muted/30 transition-colors cursor-pointer select-none group"
                        >
                          <td className="py-3 px-4 text-center">
                            <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4 text-primary" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 font-bold text-foreground flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-primary" />
                            <span>Year {row.year}</span>
                            <span className="text-[10px] font-normal text-muted-foreground">({row.months.length} Months)</span>
                          </td>
                          <td className="py-3 px-4 text-right font-medium text-emerald-600 dark:text-emerald-400">
                            ₹{row.investedThisYear.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4 text-right font-bold">
                            ₹{row.totalInvestedToDate.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4 text-right font-medium text-indigo-600 dark:text-indigo-400">
                            ₹{row.estimatedReturnsToDate.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4 text-right font-black text-primary">
                            ₹{row.corpusValue.toLocaleString('en-IN')}
                          </td>
                        </tr>

                        {/* Nested Monthly Breakdown Accordion Report */}
                        {isExpanded && (
                          <tr className="bg-muted/20 border-b">
                            <td colSpan={6} className="p-0">
                              <div className="p-4 space-y-3 bg-muted/10 border-y">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-bold text-xs flex items-center gap-2 text-foreground uppercase tracking-wider">
                                    <TrendingUp className="h-3.5 w-3.5 text-primary" /> Year {row.year} Monthly Growth Breakdown
                                  </h4>
                                  <span className="text-[11px] text-muted-foreground font-medium">
                                    Months {row.months[0]?.overallMonth} - {row.months[row.months.length - 1]?.overallMonth} of {years * 12}
                                  </span>
                                </div>

                                <div className="overflow-x-auto rounded-xl border bg-background shadow-xs">
                                  <table className="w-full text-left border-collapse text-[11px]">
                                    <thead>
                                      <tr className="bg-muted/40 border-b text-muted-foreground font-bold uppercase text-[10px]">
                                        <th className="py-2.5 px-3">Month</th>
                                        <th className="py-2.5 px-3 text-right">Monthly SIP (₹)</th>
                                        <th className="py-2.5 px-3 text-right">Total Invested (₹)</th>
                                        <th className="py-2.5 px-3 text-right">Est. Returns (₹)</th>
                                        <th className="py-2.5 px-3 text-right">Corpus Value (₹)</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                      {row.months.map((m) => (
                                        <tr key={m.overallMonth} className="hover:bg-muted/30 transition-colors">
                                          <td className="py-2 px-3 font-semibold text-foreground">
                                            Month {m.monthNumber} <span className="text-muted-foreground font-normal">(m#{m.overallMonth})</span>
                                          </td>
                                          <td className="py-2 px-3 text-right font-medium text-emerald-600 dark:text-emerald-400">
                                            ₹{m.monthlyDeposit.toLocaleString('en-IN')}
                                          </td>
                                          <td className="py-2 px-3 text-right font-bold">
                                            ₹{m.totalInvested.toLocaleString('en-IN')}
                                          </td>
                                          <td className="py-2 px-3 text-right font-medium text-indigo-600 dark:text-indigo-400">
                                            ₹{m.estimatedReturns.toLocaleString('en-IN')}
                                          </td>
                                          <td className="py-2 px-3 text-right font-black text-primary">
                                            ₹{m.corpusValue.toLocaleString('en-IN')}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-primary/5 font-black border-t text-xs">
                    <td className="py-3.5 px-4 text-center">✓</td>
                    <td className="py-3.5 px-4 text-foreground uppercase">Total ({years} Yrs)</td>
                    <td className="py-3.5 px-4 text-right text-emerald-600 dark:text-emerald-400">
                      ₹{Math.round(totalInvested).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right text-foreground">
                      ₹{Math.round(totalInvested).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right text-indigo-600 dark:text-indigo-400">
                      ₹{Math.round(wealthGained).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right text-primary font-black">
                      ₹{Math.round(expectedAmount).toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SEO Section */}
      <div className="grid md:grid-cols-2 gap-12 border-t pt-12">
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
    </div>
  )
}
