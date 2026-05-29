"use client"

import React, { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import ratesData from "@/app/tools/gst-calculator/rates.json"
import { useUsageLimit } from "@/hooks/use-usage-limit"
import { DollarSign, Landmark, Info } from "lucide-react"

interface Rate {
  region: string
  rate: number // e.g., 0.18 for 18%
}

interface GSTCalculatorProps {
  isPro?: boolean
}

function NativeToggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  description?: string
}) {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="space-y-0.5">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          checked ? "bg-primary" : "bg-muted border-muted-foreground/30"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  )
}

export function GSTCalculator({ isPro = false }: GSTCalculatorProps) {
  const [region, setRegion] = useState<string>(ratesData[0].region)
  const [amount, setAmount] = useState<number>(0)
  const [inclusive, setInclusive] = useState<boolean>(false)
  const [result, setResult] = useState<{ gst: number; total: number; net: number }>({ gst: 0, total: 0, net: 0 })
  const { increment: incrementUsage } = useUsageLimit("gst-calculator", "daily")

  const getRate = (regionName: string): number => {
    const r = (ratesData as Rate[]).find(r => r.region === regionName)
    return r ? r.rate : 0
  }

  useEffect(() => {
    const rate = getRate(region)
    if (inclusive) {
      const gst = amount - amount / (1 + rate)
      const net = amount - gst
      setResult({ gst: Number(gst.toFixed(2)), total: Number(amount.toFixed(2)), net: Number(net.toFixed(2)) })
    } else {
      const gst = amount * rate
      const total = amount + gst
      setResult({ gst: Number(gst.toFixed(2)), total: Number(total.toFixed(2)), net: Number(amount.toFixed(2)) })
    }
  }, [region, amount, inclusive])

  // Track GST calculator usage on calculation (debounced)
  useEffect(() => {
    if (amount > 0) {
      const timer = setTimeout(() => {
        incrementUsage(1, { region, amount, inclusive }).catch(console.error)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [region, amount, inclusive, incrementUsage])

  return (
    <div className="grid xl:grid-cols-4 gap-8 pb-8 md:pb-20">
      {/* Left Input Fields */}
      <div className="xl:col-span-3 space-y-6">
        <Card className="glassmorphism p-6 h-full flex flex-col justify-between">
          <div>
            <CardHeader className="px-0 pt-0 mb-6">
              <CardTitle>Calculation Inputs</CardTitle>
              <CardDescription>Select standard global rates and calculate baseline or gross sums.</CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground block mb-1" htmlFor="region-select">Region</label>
                  <Select value={region} onValueChange={val => setRegion(val || "")}>
                    <SelectTrigger id="region-select" className="w-full">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      {(ratesData as Rate[]).map(r => (
                        <SelectItem key={r.region} value={r.region}>
                          {r.region} ({(r.rate * 100).toFixed(0)}% GST)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground block mb-1" htmlFor="amount-input">Amount</label>
                  <Input
                    id="amount-input"
                    type="number"
                    value={amount === 0 ? "" : amount}
                    onChange={e => setAmount(parseFloat(e.target.value) || 0)}
                    placeholder="Enter baseline amount"
                    min={0}
                    className="text-base"
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="max-w-md">
                  <NativeToggle
                    label="Inclusive Pricing"
                    description="The entered amount already includes tax"
                    checked={inclusive}
                    onChange={setInclusive}
                  />
                </div>
              </div>

              {/* GST Breakdown inside left card */}
              <div className="pt-6 border-t space-y-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">GST Breakdown</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 bg-muted/15 p-3 rounded-xl">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary shrink-0">
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Net (Pre‑Tax)</p>
                      <p className="text-lg font-black text-foreground tracking-tighter">
                        ${result.net.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-muted/15 p-3 rounded-xl">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary shrink-0">
                      <Landmark className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">GST Amount</p>
                      <p className="text-lg font-black text-primary tracking-tighter">
                        ${result.gst.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-primary/5 border border-primary/10 p-3 rounded-xl">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary shrink-0">
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Total (Gross)</p>
                      <p className="text-lg font-black text-primary tracking-tighter">
                        ${result.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>

      {/* Right Sidebar Results & Info */}
      <div className="space-y-6">
        {/* Region specific detail */}
        <Card className="glassmorphism p-6 space-y-4">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Info className="h-4 w-4" /> Tax Rules
          </CardTitle>
          <div className="text-xs text-muted-foreground leading-relaxed">
            {region === "India" && (
              <p>
                In India, GST is split equally into <strong>CGST (Central GST)</strong> and <strong>SGST (State GST)</strong> for intra-state sales. CGST portion: <strong>${(result.gst / 2).toFixed(2)}</strong>, SGST portion: <strong>${(result.gst / 2).toFixed(2)}</strong>.
              </p>
            )}
            {region === "Canada" && (
              <p>
                In Canada, provincial taxes may include GST (5%), PST, or HST depending on the destination province. The base federal GST rate is 5%.
              </p>
            )}
            {region === "Australia" && (
              <p>
                In Australia, GST is a flat 10% tax on most goods, services, and other items sold or consumed in the country.
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
