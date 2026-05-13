"use client"

import React, { useState } from "react"
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

const COLORS = ['#0088FE', '#FF8042']

export function EmiCalculator({ isPro = false }: { isPro?: boolean }) {
  const [principal, setPrincipal] = useState(500000)
  const [rate, setRate] = useState(8.5)
  const [tenure, setTenure] = useState(20)

  // EMI Formula: P x R x (1+R)^N / [(1+R)^N-1]
  const calculateEMI = () => {
    const p = principal
    const r = rate / 12 / 100
    const n = tenure * 12
    if (r === 0) return p / n
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    return emi
  }

  const emi = calculateEMI()
  const totalPayment = emi * tenure * 12
  const totalInterest = totalPayment - principal

  const chartData = [
    { name: 'Principal Loan Amount', value: principal },
    { name: 'Total Interest', value: totalInterest },
  ]

  return (<>
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Home/Car Loan EMI Calculator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Loan Amount (₹)</Label>
                <span className="font-semibold text-primary">
                  ₹{principal.toLocaleString('en-IN')}
                </span>
              </div>
              <Slider 
                value={[principal]} 
                min={100000} 
                max={50000000} 
                step={50000}
                onValueChange={(val: any) => setPrincipal(Array.isArray(val) ? val[0] : val)}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Interest Rate (p.a)</Label>
                <span className="font-semibold text-primary">
                  {rate}%
                </span>
              </div>
              <Slider 
                value={[rate]} 
                min={1} 
                max={20} 
                step={0.1}
                onValueChange={(val: any) => setRate(Array.isArray(val) ? val[0] : val)}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Loan Tenure (Years)</Label>
                <span className="font-semibold text-primary">
                  {tenure} Yr
                </span>
              </div>
              <Slider 
                value={[tenure]} 
                min={1} 
                max={30} 
                step={1}
                onValueChange={(val: any) => setTenure(Array.isArray(val) ? val[0] : val)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>EMI Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-8 text-center">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Monthly EMI</p>
                <p className="text-2xl font-bold text-primary">₹{Math.round(emi).toLocaleString('en-IN')}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Principal Amount</p>
                <p className="text-xl font-bold">₹{Math.round(principal).toLocaleString('en-IN')}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Total Interest</p>
                <p className="text-xl font-bold">₹{Math.round(totalInterest).toLocaleString('en-IN')}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                <p className="text-xl font-bold">₹{Math.round(totalPayment).toLocaleString('en-IN')}</p>
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
    <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12 pb-20">
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
  </>)
}
