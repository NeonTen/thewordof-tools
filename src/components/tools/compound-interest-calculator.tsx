"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Calculator, Calendar, ChevronDown, ChevronRight, FileSpreadsheet, Layers, TrendingUp } from "lucide-react"

interface MonthlyCompoundBreakdown {
  monthNumber: number
  overallMonth: number
  monthlyContrib: number
  totalInvested: number
  interestEarnedMonth: number
  nominalValue: number
  realValue: number
}

interface YearlyCompoundAmortization {
  year: number
  investedThisYear: number
  totalInvestedToDate: number
  totalInterestToDate: number
  nominalValue: number
  realValue: number
  months: MonthlyCompoundBreakdown[]
}

export function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState(10000)
  const [contrib, setContrib] = useState(250)
  const [rate, setRate] = useState(8)
  const [tenure, setTenure] = useState(15)
  const [freq, setFreq] = useState<"monthly" | "quarterly" | "annually">("monthly")
  const [inflation, setInflation] = useState(3)
  const [expandedYears, setExpandedYears] = useState<number[]>([])

  // Calculate detailed month-by-month and year-by-year compounding schedule
  const getDetailedCompoundSchedule = (): {
    nominalFutureValue: number
    realFutureValue: number
    totalInvested: number
    totalInterestEarned: number
    yearlySchedule: YearlyCompoundAmortization[]
  } => {
    let freqFactor = 12
    if (freq === "quarterly") freqFactor = 4
    else if (freq === "annually") freqFactor = 1

    const rPerPeriod = (rate / 100) / freqFactor
    let currentNominal = principal
    let currentInvested = principal
    let overallMonth = 0

    const yearlySchedule: YearlyCompoundAmortization[] = []

    for (let y = 1; y <= tenure; y++) {
      let investedInYear = 0
      const monthlyList: MonthlyCompoundBreakdown[] = []

      for (let m = 1; m <= 12; m++) {
        overallMonth++
        const monthlyContribVal = contrib
        currentInvested += monthlyContribVal
        investedInYear += monthlyContribVal

        // Determine if compounding happens this month
        let interestThisMonth = 0
        const isCompoundingMonth = 
          freq === "monthly" ||
          (freq === "quarterly" && m % 3 === 0) ||
          (freq === "annually" && m === 12)

        if (isCompoundingMonth) {
          const prevValue = currentNominal + monthlyContribVal
          currentNominal = prevValue * (1 + rPerPeriod * (freq === "monthly" ? 1 : freq === "quarterly" ? 3 : 12))
          interestThisMonth = currentNominal - prevValue
        } else {
          currentNominal += monthlyContribVal
        }

        const yearsPassed = overallMonth / 12
        const currentReal = currentNominal / Math.pow(1 + inflation / 100, yearsPassed)

        monthlyList.push({
          monthNumber: m,
          overallMonth,
          monthlyContrib: Math.round(monthlyContribVal),
          totalInvested: Math.round(currentInvested),
          interestEarnedMonth: Math.round(interestThisMonth),
          nominalValue: Math.round(currentNominal),
          realValue: Math.round(currentReal)
        })
      }

      const endOfYear = monthlyList[monthlyList.length - 1]

      yearlySchedule.push({
        year: y,
        investedThisYear: Math.round(y === 1 ? principal + (contrib * 12) : contrib * 12),
        totalInvestedToDate: endOfYear.totalInvested,
        totalInterestToDate: Math.max(0, endOfYear.nominalValue - endOfYear.totalInvested),
        nominalValue: endOfYear.nominalValue,
        realValue: endOfYear.realValue,
        months: monthlyList
      })
    }

    const finalNominal = yearlySchedule.length > 0 ? yearlySchedule[yearlySchedule.length - 1].nominalValue : principal
    const finalReal = yearlySchedule.length > 0 ? yearlySchedule[yearlySchedule.length - 1].realValue : principal
    const finalInvested = yearlySchedule.length > 0 ? yearlySchedule[yearlySchedule.length - 1].totalInvestedToDate : principal

    return {
      nominalFutureValue: finalNominal,
      realFutureValue: finalReal,
      totalInvested: finalInvested,
      totalInterestEarned: Math.max(0, finalNominal - finalInvested),
      yearlySchedule
    }
  }

  const {
    nominalFutureValue,
    realFutureValue,
    totalInvested,
    totalInterestEarned,
    yearlySchedule
  } = getDetailedCompoundSchedule()

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
      {/* Top Controls & Returns Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Controls Card */}
        <Card className="border-primary/10 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" /> Investment Settings
              </CardTitle>
              <CardDescription className="text-xs">Adjust sliders or type custom numbers directly</CardDescription>
            </div>
            <select
              value={freq}
              onChange={(e: any) => setFreq(e.target.value)}
              className="h-9 border rounded-xl bg-background px-3 text-xs focus:outline-none font-bold shadow-xs cursor-pointer"
            >
              <option value="monthly">Monthly Compounding</option>
              <option value="quarterly">Quarterly Compounding</option>
              <option value="annually">Annual Compounding</option>
            </select>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Initial Principal */}
            <div className="space-y-3">
              <div className="flex justify-between items-center gap-4">
                <Label htmlFor="principal-input" className="font-bold text-sm">Initial Principal (₹)</Label>
                <div className="relative w-44">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">₹</span>
                  <Input
                    id="principal-input"
                    type="number"
                    min={0}
                    max={100000000}
                    value={principal || ''}
                    onChange={(e) => {
                      const val = Number(e.target.value)
                      setPrincipal(isNaN(val) ? 0 : val)
                    }}
                    className="pl-7 h-9 text-right font-bold text-sm bg-muted/20"
                  />
                </div>
              </div>
              <Slider
                value={[principal]}
                min={1000}
                max={1000000}
                step={5000}
                onValueChange={(val: any) => setPrincipal(Array.isArray(val) ? val[0] : (typeof val === 'number' ? val : 0))}
              />
              <div className="flex justify-between text-[11px] text-muted-foreground font-medium">
                <span>₹1,000</span>
                <span>₹5 Lakh</span>
                <span>₹10 Lakh</span>
              </div>
            </div>

            {/* Monthly Contribution */}
            <div className="space-y-3">
              <div className="flex justify-between items-center gap-4">
                <Label htmlFor="contrib-input" className="font-bold text-sm">Monthly Contribution (₹)</Label>
                <div className="relative w-44">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">₹</span>
                  <Input
                    id="contrib-input"
                    type="number"
                    min={0}
                    max={1000000}
                    value={contrib || ''}
                    onChange={(e) => {
                      const val = Number(e.target.value)
                      setContrib(isNaN(val) ? 0 : val)
                    }}
                    className="pl-7 h-9 text-right font-bold text-sm bg-muted/20"
                  />
                </div>
              </div>
              <Slider
                value={[contrib]}
                min={0}
                max={50000}
                step={100}
                onValueChange={(val: any) => setContrib(Array.isArray(val) ? val[0] : (typeof val === 'number' ? val : 0))}
              />
              <div className="flex justify-between text-[11px] text-muted-foreground font-medium">
                <span>₹0</span>
                <span>₹25,000</span>
                <span>₹50,000</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="space-y-3">
              <div className="flex justify-between items-center gap-4">
                <Label htmlFor="rate-input" className="font-bold text-sm">Interest Rate (% annual)</Label>
                <div className="relative w-32">
                  <Input
                    id="rate-input"
                    type="number"
                    step="0.1"
                    min={0.1}
                    max={40}
                    value={rate || ''}
                    onChange={(e) => {
                      const val = Number(e.target.value)
                      setRate(isNaN(val) ? 0 : val)
                    }}
                    className="pr-7 h-9 text-right font-bold text-sm bg-muted/20"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">%</span>
                </div>
              </div>
              <Slider
                value={[rate]}
                min={1}
                max={25}
                step={0.1}
                onValueChange={(val: any) => setRate(Array.isArray(val) ? val[0] : (typeof val === 'number' ? val : 0))}
              />
              <div className="flex justify-between text-[11px] text-muted-foreground font-medium">
                <span>1%</span>
                <span>12%</span>
                <span>25%</span>
              </div>
            </div>

            {/* Inflation Rate */}
            <div className="space-y-3">
              <div className="flex justify-between items-center gap-4">
                <Label htmlFor="inflation-input" className="font-bold text-sm">Estimated Inflation Rate (% annual)</Label>
                <div className="relative w-32">
                  <Input
                    id="inflation-input"
                    type="number"
                    step="0.5"
                    min={0}
                    max={25}
                    value={inflation || ''}
                    onChange={(e) => {
                      const val = Number(e.target.value)
                      setInflation(isNaN(val) ? 0 : val)
                    }}
                    className="pr-7 h-9 text-right font-bold text-sm bg-muted/20"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">%</span>
                </div>
              </div>
              <Slider
                value={[inflation]}
                min={0}
                max={15}
                step={0.5}
                onValueChange={(val: any) => setInflation(Array.isArray(val) ? val[0] : (typeof val === 'number' ? val : 0))}
              />
              <div className="flex justify-between text-[11px] text-muted-foreground font-medium">
                <span>0%</span>
                <span>6%</span>
                <span>15%</span>
              </div>
            </div>

            {/* Tenure */}
            <div className="space-y-3">
              <div className="flex justify-between items-center gap-4">
                <Label htmlFor="tenure-input" className="font-bold text-sm">Investment Period (Years)</Label>
                <div className="relative w-32">
                  <Input
                    id="tenure-input"
                    type="number"
                    min={1}
                    max={40}
                    value={tenure || ''}
                    onChange={(e) => {
                      const val = Number(e.target.value)
                      setTenure(isNaN(val) ? 0 : val)
                    }}
                    className="pr-10 h-9 text-right font-bold text-sm bg-muted/20"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">Yr</span>
                </div>
              </div>
              <Slider
                value={[tenure]}
                min={1}
                max={40}
                step={1}
                onValueChange={(val: any) => setTenure(Array.isArray(val) ? val[0] : (typeof val === 'number' ? val : 0))}
              />
              <div className="flex justify-between text-[11px] text-muted-foreground font-medium">
                <span>1 Year</span>
                <span>20 Years</span>
                <span>40 Years</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Breakdown & Returns Summary Card */}
        <Card className="border-primary/10 shadow-sm flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Compounded Returns Summary</CardTitle>
            <CardDescription>Nominal growth vs real inflation-adjusted purchasing power</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Nominal Future Value</p>
                <p className="text-2xl font-black text-primary">₹{nominalFutureValue.toLocaleString("en-IN")}</p>
              </div>
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Real Value (Inflation-Adjusted)</p>
                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">₹{realFutureValue.toLocaleString("en-IN")}</p>
              </div>
              <div className="p-3 bg-muted/40 rounded-xl border">
                <p className="text-[11px] font-bold text-muted-foreground mb-1">Total Amount Invested</p>
                <p className="text-lg font-black">₹{totalInvested.toLocaleString("en-IN")}</p>
              </div>
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mb-1">Total Interest Earned</p>
                <p className="text-lg font-black text-indigo-600 dark:text-indigo-400">₹{totalInterestEarned.toLocaleString("en-IN")}</p>
              </div>
            </div>

            <div className="h-[200px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={yearlySchedule}>
                  <defs>
                    <linearGradient id="nominalG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="realG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${Math.round(v/1000)}k`} />
                  <Tooltip formatter={(v: any) => `₹${Number(v).toLocaleString("en-IN")}`} />
                  <Legend />
                  <Area type="monotone" name="Nominal Value" dataKey="nominalValue" stroke="#2563eb" fillOpacity={1} fill="url(#nominalG)" />
                  <Area type="monotone" name="Real Value (Inflation)" dataKey="realValue" stroke="#10b981" fillOpacity={1} fill="url(#realG)" />
                </AreaChart>
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
              <FileSpreadsheet className="h-5 w-5 text-primary" /> Year-by-Year & Monthly Compound Growth Schedule
            </CardTitle>
            <CardDescription className="text-xs">
              Click any year row to expand its detailed 12-month compounding growth report.
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
              {tenure} {tenure === 1 ? 'Year' : 'Years'} Compounding Horizon
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
                    <th className="py-3 px-4 text-right">Total Interest to Date (₹)</th>
                    <th className="py-3 px-4 text-right">Nominal Value (₹)</th>
                    <th className="py-3 px-4 text-right">Real Value (₹)</th>
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
                            ₹{row.totalInterestToDate.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4 text-right font-black text-primary">
                            ₹{row.nominalValue.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                            ₹{row.realValue.toLocaleString('en-IN')}
                          </td>
                        </tr>

                        {/* Nested Monthly Breakdown Accordion Report */}
                        {isExpanded && (
                          <tr className="bg-muted/20 border-b">
                            <td colSpan={7} className="p-0">
                              <div className="p-4 pl-12 space-y-3 bg-muted/10 border-y">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-bold text-xs flex items-center gap-2 text-foreground uppercase tracking-wider">
                                    <TrendingUp className="h-3.5 w-3.5 text-primary" /> Year {row.year} Monthly Compounding Report
                                  </h4>
                                  <span className="text-[11px] text-muted-foreground font-medium">
                                    Months {row.months[0]?.overallMonth} - {row.months[row.months.length - 1]?.overallMonth} of {tenure * 12}
                                  </span>
                                </div>

                                <div className="overflow-x-auto rounded-xl border bg-background shadow-xs">
                                  <table className="w-full text-left border-collapse text-[11px]">
                                    <thead>
                                      <tr className="bg-muted/40 border-b text-muted-foreground font-bold uppercase text-[10px]">
                                        <th className="py-2.5 px-3">Month</th>
                                        <th className="py-2.5 px-3 text-right">Monthly Contrib (₹)</th>
                                        <th className="py-2.5 px-3 text-right">Total Invested (₹)</th>
                                        <th className="py-2.5 px-3 text-right">Interest Gained (₹)</th>
                                        <th className="py-2.5 px-3 text-right">Nominal Value (₹)</th>
                                        <th className="py-2.5 px-3 text-right">Real Value (₹)</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                      {row.months.map((m) => (
                                        <tr key={m.overallMonth} className="hover:bg-muted/30 transition-colors">
                                          <td className="py-2 px-3 font-semibold text-foreground">
                                            Month {m.monthNumber} <span className="text-muted-foreground font-normal">(m#{m.overallMonth})</span>
                                          </td>
                                          <td className="py-2 px-3 text-right font-medium text-emerald-600 dark:text-emerald-400">
                                            ₹{m.monthlyContrib.toLocaleString('en-IN')}
                                          </td>
                                          <td className="py-2 px-3 text-right font-bold">
                                            ₹{m.totalInvested.toLocaleString('en-IN')}
                                          </td>
                                          <td className="py-2 px-3 text-right font-medium text-indigo-600 dark:text-indigo-400">
                                            ₹{m.interestEarnedMonth.toLocaleString('en-IN')}
                                          </td>
                                          <td className="py-2 px-3 text-right font-black text-primary">
                                            ₹{m.nominalValue.toLocaleString('en-IN')}
                                          </td>
                                          <td className="py-2 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                                            ₹{m.realValue.toLocaleString('en-IN')}
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
                    <td className="py-3.5 px-4 text-foreground uppercase">Total ({tenure} Yrs)</td>
                    <td className="py-3.5 px-4 text-right text-emerald-600 dark:text-emerald-400">
                      ₹{Math.round(totalInvested).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right text-foreground">
                      ₹{Math.round(totalInvested).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right text-indigo-600 dark:text-indigo-400">
                      ₹{Math.round(totalInterestEarned).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right text-primary font-black">
                      ₹{Math.round(nominalFutureValue).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right text-emerald-600 dark:text-emerald-400 font-black">
                      ₹{Math.round(realFutureValue).toLocaleString('en-IN')}
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
    </div>
  )
}
