"use client"

import React, { useState } from "react"
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Calculator, Calendar, ChevronDown, ChevronRight, FileSpreadsheet, Layers } from "lucide-react"

const COLORS = ['#2563eb', '#f97316']

interface MonthlyBreakdown {
  monthNumber: number
  overallMonth: number
  principalPaid: number
  interestPaid: number
  totalPaid: number
  balance: number
}

interface YearlyAmortization {
  year: number
  principalPaid: number
  interestPaid: number
  totalPaid: number
  balance: number
  percentPaid: number
  months: MonthlyBreakdown[]
}

export function EmiCalculator({ isPro = false }: { isPro?: boolean }) {
  const [principal, setPrincipal] = useState(500000)
  const [rate, setRate] = useState(8.5)
  const [tenure, setTenure] = useState(20)
  const [expandedYears, setExpandedYears] = useState<number[]>([])

  // EMI Formula: P x R x (1+R)^N / [(1+R)^N-1]
  const calculateEMI = () => {
    const p = principal
    const r = rate / 12 / 100
    const n = tenure * 12
    if (r === 0 || n === 0) return n > 0 ? p / n : 0
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    return isNaN(emi) ? 0 : emi
  }

  const emi = calculateEMI()
  const totalPayment = emi * tenure * 12
  const totalInterest = Math.max(0, totalPayment - principal)

  const chartData = [
    { name: 'Principal Amount', value: principal },
    { name: 'Total Interest', value: totalInterest },
  ]

  // Calculate year-by-year schedule with monthly breakdown
  const getYearlySchedule = (): YearlyAmortization[] => {
    const monthlyRate = rate / 12 / 100
    const totalMonths = tenure * 12
    if (monthlyRate <= 0 || totalMonths <= 0 || principal <= 0) return []

    const currentEmi = emi
    let currentBalance = principal
    const schedule: YearlyAmortization[] = []

    let overallMonthCount = 0

    for (let y = 1; y <= tenure; y++) {
      let yearInterest = 0
      let yearPrincipal = 0
      const monthlyList: MonthlyBreakdown[] = []

      for (let m = 1; m <= 12; m++) {
        if (currentBalance <= 0) break
        overallMonthCount++
        const interestForMonth = currentBalance * monthlyRate
        let principalForMonth = currentEmi - interestForMonth
        if (principalForMonth > currentBalance) {
          principalForMonth = currentBalance
        }
        yearInterest += interestForMonth
        yearPrincipal += principalForMonth
        currentBalance -= principalForMonth

        monthlyList.push({
          monthNumber: m,
          overallMonth: overallMonthCount,
          principalPaid: Math.round(principalForMonth),
          interestPaid: Math.round(interestForMonth),
          totalPaid: Math.round(principalForMonth + interestForMonth),
          balance: Math.round(Math.max(0, currentBalance))
        })
      }

      const balanceAtEnd = Math.max(0, currentBalance)
      const percentPaid = Math.min(100, Math.round(((principal - balanceAtEnd) / principal) * 100))

      schedule.push({
        year: y,
        principalPaid: Math.round(yearPrincipal),
        interestPaid: Math.round(yearInterest),
        totalPaid: Math.round(yearPrincipal + yearInterest),
        balance: Math.round(balanceAtEnd),
        percentPaid,
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
              <Calculator className="h-5 w-5 text-primary" /> Loan Parameters
            </CardTitle>
            <CardDescription>
              Adjust sliders or type custom numbers directly into the fields.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Principal Amount */}
            <div className="space-y-3">
              <div className="flex justify-between items-center gap-4">
                <Label htmlFor="principal-input" className="font-bold text-sm">Loan Amount (₹)</Label>
                <div className="relative w-44">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">₹</span>
                  <Input
                    id="principal-input"
                    type="number"
                    min={10000}
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
                min={100000} 
                max={50000000} 
                step={50000}
                onValueChange={(val: any) => setPrincipal(Array.isArray(val) ? val[0] : (typeof val === 'number' ? val : 0))}
              />
              <div className="flex justify-between text-[11px] text-muted-foreground font-medium">
                <span>₹1 Lakh</span>
                <span>₹2.5 Cr</span>
                <span>₹5 Cr</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="space-y-3">
              <div className="flex justify-between items-center gap-4">
                <Label htmlFor="rate-input" className="font-bold text-sm">Interest Rate (% p.a)</Label>
                <div className="relative w-32">
                  <Input
                    id="rate-input"
                    type="number"
                    step="0.1"
                    min={0.1}
                    max={30}
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
                max={20} 
                step={0.1}
                onValueChange={(val: any) => setRate(Array.isArray(val) ? val[0] : (typeof val === 'number' ? val : 0))}
              />
              <div className="flex justify-between text-[11px] text-muted-foreground font-medium">
                <span>1%</span>
                <span>10%</span>
                <span>20%</span>
              </div>
            </div>

            {/* Tenure */}
            <div className="space-y-3">
              <div className="flex justify-between items-center gap-4">
                <Label htmlFor="tenure-input" className="font-bold text-sm">Loan Tenure (Years)</Label>
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
                max={30} 
                step={1}
                onValueChange={(val: any) => setTenure(Array.isArray(val) ? val[0] : (typeof val === 'number' ? val : 0))}
              />
              <div className="flex justify-between text-[11px] text-muted-foreground font-medium">
                <span>1 Year</span>
                <span>15 Years</span>
                <span>30 Years</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Breakdown Summary Card */}
        <Card className="border-primary/10 shadow-sm flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-xl font-bold">EMI & Payment Summary</CardTitle>
            <CardDescription>Monthly installment and lifetime cost breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl col-span-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Monthly EMI</p>
                <p className="text-3xl font-black text-primary">₹{Math.round(emi).toLocaleString('en-IN')}</p>
              </div>
              <div className="p-3 bg-muted/40 rounded-xl border">
                <p className="text-[11px] font-bold text-muted-foreground mb-1">Principal Loan</p>
                <p className="text-lg font-black">₹{Math.round(principal).toLocaleString('en-IN')}</p>
              </div>
              <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                <p className="text-[11px] font-bold text-orange-600 dark:text-orange-400 mb-1">Total Interest</p>
                <p className="text-lg font-black text-orange-600 dark:text-orange-400">₹{Math.round(totalInterest).toLocaleString('en-IN')}</p>
              </div>
              <div className="p-3 bg-muted/40 rounded-xl border col-span-2">
                <p className="text-[11px] font-bold text-muted-foreground mb-1">Total Payment (Principal + Interest)</p>
                <p className="text-xl font-black">₹{Math.round(totalPayment).toLocaleString('en-IN')}</p>
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
              <FileSpreadsheet className="h-5 w-5 text-primary" /> Year-by-Year & Monthly Loan Repayment Schedule
            </CardTitle>
            <CardDescription className="text-xs">
              Click any year row to expand its detailed 12-month payment report.
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
              {tenure} {tenure === 1 ? 'Year' : 'Years'} Loan Duration
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {yearlySchedule.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Please enter valid loan parameters to generate repayment schedule.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b bg-muted/40 text-muted-foreground font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4 w-12 text-center"></th>
                    <th className="py-3 px-4">Year</th>
                    <th className="py-3 px-4 text-right">Principal Paid (₹)</th>
                    <th className="py-3 px-4 text-right">Interest Paid (₹)</th>
                    <th className="py-3 px-4 text-right">Total Payment (₹)</th>
                    <th className="py-3 px-4 text-right">Balance Remaining (₹)</th>
                    <th className="py-3 px-4 text-center">Loan Repaid</th>
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
                            ₹{row.principalPaid.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4 text-right font-medium text-orange-600 dark:text-orange-400">
                            ₹{row.interestPaid.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4 text-right font-bold">
                            ₹{row.totalPaid.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-muted-foreground">
                            ₹{row.balance.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center gap-2 justify-center">
                              <div className="w-16 bg-muted h-2 rounded-full overflow-hidden">
                                <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: `${row.percentPaid}%` }} />
                              </div>
                              <span className="text-[10px] font-bold w-7 text-right">{row.percentPaid}%</span>
                            </div>
                          </td>
                        </tr>

                        {/* Nested Monthly Breakdown Accordion Report */}
                        {isExpanded && (
                          <tr className="bg-muted/20 border-b">
                            <td colSpan={7} className="p-0">
                              <div className="p-4 pl-12 space-y-3 bg-muted/10 border-y">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-bold text-xs flex items-center gap-2 text-foreground uppercase tracking-wider">
                                    <Calendar className="h-3.5 w-3.5 text-primary" /> Year {row.year} Monthly Breakdown
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
                                        <th className="py-2.5 px-3 text-right">Principal Paid (₹)</th>
                                        <th className="py-2.5 px-3 text-right">Interest Paid (₹)</th>
                                        <th className="py-2.5 px-3 text-right">Total EMI (₹)</th>
                                        <th className="py-2.5 px-3 text-right">Ending Balance (₹)</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                      {row.months.map((m) => (
                                        <tr key={m.overallMonth} className="hover:bg-muted/30 transition-colors">
                                          <td className="py-2 px-3 font-semibold text-foreground">
                                            Month {m.monthNumber} <span className="text-muted-foreground font-normal">(m#{m.overallMonth})</span>
                                          </td>
                                          <td className="py-2 px-3 text-right font-medium text-emerald-600 dark:text-emerald-400">
                                            ₹{m.principalPaid.toLocaleString('en-IN')}
                                          </td>
                                          <td className="py-2 px-3 text-right font-medium text-orange-600 dark:text-orange-400">
                                            ₹{m.interestPaid.toLocaleString('en-IN')}
                                          </td>
                                          <td className="py-2 px-3 text-right font-bold">
                                            ₹{m.totalPaid.toLocaleString('en-IN')}
                                          </td>
                                          <td className="py-2 px-3 text-right font-bold text-muted-foreground">
                                            ₹{m.balance.toLocaleString('en-IN')}
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
                      ₹{Math.round(principal).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right text-orange-600 dark:text-orange-400">
                      ₹{Math.round(totalInterest).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right text-primary">
                      ₹{Math.round(totalPayment).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right text-muted-foreground">₹0</td>
                    <td className="py-3.5 px-4 text-center text-primary font-bold">100%</td>
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
          <h2 className="text-2xl font-black tracking-tight mb-4">What is an EMI Calculator?</h2>
          <p className="text-muted-foreground leading-relaxed">
            An EMI (Equated Monthly Instalment) calculator helps you determine the fixed monthly payment required to repay a loan over a specified period. It takes into account the principal loan amount, annual interest rate, and the loan tenure to calculate your exact monthly obligation.
          </p>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            The formula used is: EMI = P × r × (1+r)^n / ((1+r)^n - 1), where P is the principal, r is the monthly interest rate, and n is the number of months. Our calculator does this instantly and also shows you total interest paid over the loan lifetime.
          </p>
        </section>
        <section className="bg-muted/30 p-8 rounded-3xl border border-primary/5">
          <h3 className="text-xl font-black tracking-tight mb-6">How to Use an EMI Calculator</h3>
          <ul className="space-y-4 list-none p-0">
            {[
              { title: "Enter Loan Amount", desc: "Input the total amount you wish to borrow, e.g. ₹10,00,000 for a home loan or ₹5,00,000 for a personal loan." },
              { title: "Set Interest Rate", desc: "Enter the annual interest rate offered by your bank. Home loans typically range from 8–12%, personal loans from 10–24%." },
              { title: "Choose Loan Tenure", desc: "Select the repayment period in months or years. Longer tenure means smaller EMI but higher total interest paid." },
              { title: "Compare Options", desc: "Use the calculator multiple times with different tenures or rates to find the EMI that fits your monthly budget." },
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
