"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Check, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { UpgradeButton } from "@/components/pricing/upgrade-button"

interface PricingCardsProps {
  session: import("next-auth").Session | null
  isPro: boolean
  isBusiness: boolean
  isAdmin: boolean
}

export function PricingCards({ session, isPro, isBusiness, isAdmin }: PricingCardsProps) {
  const [isYearly, setIsYearly] = useState(false)
  const [currency, setCurrency] = useState<"INR" | "USD">("INR")

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
      setCurrency(tz === "Asia/Kolkata" ? "INR" : "USD")
    } catch {
      // fallback: keep "INR" default
    }
  }, [])

  const plans = [
    {
      name: "Free",
      monthlyPrice: 0,
      yearlyPrice: 0,
      monthlyUsd: "0.00",
      yearlyUsd: "0.00",
      plan: "FREE",
      description: "Everything you need to get started. No credit card required.",
      cta: "Get Started Free",
      ctaHref: "/dashboard",
      highlight: false,
      features: [
        { label: "All 13 tools included", included: true },
        { label: "5 images per batch", included: true },
        { label: "5 SVGs per batch", included: true },
        { label: "3 AI captions per generation", included: true },
        { label: "3 invoices per month", included: true },
        { label: "All calculators unlimited", included: true },
        { label: "Code Minifier & Text Diff", included: true },
        { label: "1 dynamic QR code (15-day expiry)", included: true },
        { label: "Unlimited batch processing", included: false },
        { label: "Bulk ZIP downloads", included: false },
        { label: "10 AI captions + all platforms", included: false },
        { label: "AI CV builder (8 Pro templates + Import with AI)", included: false },
        { label: "Unlimited invoices", included: false },
        { label: "Dynamic QR scan analytics", included: false },
        { label: "Cloud progress & history tracking", included: false },
        { label: "Priority AI generation", included: false },
        { label: "No upgrade banners", included: false },
        { label: "1-on-1 Onboarding", included: false },
        { label: "Priority Tool Requests", included: false },
      ],
    },
    {
      name: "Pro",
      monthlyPrice: 499,
      yearlyPrice: 4999,
      monthlyUsd: "5.99",
      yearlyUsd: "59.99",
      plan: "PREMIUM",
      description: "For power users and professionals who need higher limits and premium tools.",
      cta: "Upgrade to Pro",
      highlight: true,
      badge: "Most Popular",
      features: [
        { label: "Everything in Free", included: true },
        { label: "Up to 1,000 files per batch", included: true },
        { label: "Bulk ZIP downloads", included: true },
        { label: "10 AI captions + all platforms", included: true },
        { label: "AI CV builder (8 Pro templates)", included: true },
        { label: "Unlimited invoices + branding", included: true },
        { label: "Unlimited dynamic QR codes", included: true },
        { label: "Dynamic QR scan analytics dashboard", included: true },
        { label: "Cloud progress & history tracking", included: true },
        { label: "Priority AI generation", included: true },
        { label: "No upgrade banners", included: true },
        { label: "Early access to new tools", included: true },
        { label: "Email support", included: true },
        { label: "1-on-1 Onboarding", included: false },
        { label: "Priority Tool Requests", included: false },
      ],
    },
    {
      name: "Business",
      monthlyPrice: 999,
      yearlyPrice: 9999,
      monthlyUsd: "19.99",
      yearlyUsd: "199.99",
      plan: "BUSINESS",
      description: "For power creators and businesses needing unlimited processing and priority support.",
      cta: "Upgrade to Business",
      highlight: false,
      features: [
        { label: "Everything in Pro", included: true },
        { label: "100% Unlimited batch processing", included: true },
        { label: "Bulk ZIP downloads", included: true },
        { label: "Unlimited AI captions", included: true },
        { label: "AI CV builder (8 Pro templates + Import with AI)", included: true },
        { label: "Unlimited invoices + branding", included: true },
        { label: "Unlimited dynamic QR codes + analytics", included: true },
        { label: "Cloud progress & history tracking", included: true },
        { label: "Highest Priority AI queue", included: true },
        { label: "No upgrade banners", included: true },
        { label: "Early access to new tools", included: true },
        { label: "24/7 Priority Support", included: true },
        { label: "1-on-1 Onboarding", included: true },
        { label: "Priority Tool Requests", included: true },
      ],
    },
  ]

  return (
    <div className="space-y-8">
      {/* Billing period + currency toggle row */}
      <div className="flex flex-wrap justify-center items-center gap-4">
        {/* Monthly / Yearly toggle */}
        <div className="flex items-center gap-3">
          <span className={cn("text-sm font-bold", !isYearly ? "text-foreground" : "text-muted-foreground")}>Monthly</span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-primary"
            role="switch"
            aria-checked={isYearly}
          >
            <span className={cn("pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out", isYearly ? "translate-x-5" : "translate-x-0")} />
          </button>
          <span className={cn("text-sm font-bold flex items-center gap-1.5", isYearly ? "text-foreground" : "text-muted-foreground")}>
            Yearly <span className="text-[10px] bg-green-500/20 text-green-600 px-2 py-0.5 rounded-full uppercase tracking-widest font-black">Save 20%</span>
          </span>
        </div>

        {/* Vertical divider */}
        <div className="hidden sm:block h-5 w-px bg-border" />

        {/* Currency pill toggle */}
        <div className="flex items-center gap-1 bg-muted/50 border border-border rounded-full p-1">
          <button
            onClick={() => setCurrency("INR")}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-black transition-all duration-200",
              currency === "INR"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            ₹ INR
          </button>
          <button
            onClick={() => setCurrency("USD")}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-black transition-all duration-200",
              currency === "USD"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            $ USD
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => {
          const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice
          const usdPrice = isYearly ? plan.yearlyUsd : plan.monthlyUsd
          const period = isYearly ? "per year" : "per month"
          
          let showCurrentPlanBtn = false
          if (plan.name === "Free" && !isPro && !isBusiness && !isAdmin) showCurrentPlanBtn = true
          if (plan.name === "Pro" && isPro) showCurrentPlanBtn = true
          if (plan.name === "Business" && isBusiness) showCurrentPlanBtn = true
          
          let overrideBtnText = ""
          let disableBtn = false
          
          if (isAdmin) {
            overrideBtnText = "Admin Access"
            disableBtn = true
            showCurrentPlanBtn = false
          } else if (isBusiness && plan.name === "Pro") {
            overrideBtnText = "Downgrade to Pro"
          } else if (isPro && plan.name === "Business") {
            overrideBtnText = "Upgrade to Business"
          }

          return (
            <Card
              key={plan.name}
              className={cn(
                "relative overflow-hidden flex flex-col",
                plan.highlight
                  ? "border-primary shadow-2xl shadow-primary/10 bg-gradient-to-b from-primary/5 to-background md:-mt-4 md:mb-4"
                  : "border-border"
              )}
            >
              {plan.badge && (
                <div className="absolute top-4 right-4">
                  <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-primary text-primary-foreground">
                    {plan.badge}
                  </span>
                </div>
              )}
              {plan.highlight && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
              )}

              <CardHeader className="pb-4 pt-8 px-8 flex-none">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{plan.name}</p>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-5xl font-black tracking-tight">
                    {currency === "INR" ? `₹${price}` : `$${usdPrice}`}
                  </span>
                  <span className="text-muted-foreground text-sm">/{period}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
              </CardHeader>

              <CardContent className="px-8 pb-8 space-y-6 flex-1 flex flex-col">
                <div className="flex-none">
                  {showCurrentPlanBtn ? (
                    <Button className="w-full h-12 font-black tracking-tight bg-green-600 hover:bg-green-700" disabled>
                      Current Plan
                    </Button>
                  ) : plan.name === "Free" ? (
                    <Button className="w-full h-12 font-bold" variant="outline" asChild>
                      <Link href={plan.ctaHref!}>
                        {session ? "Go to Dashboard" : plan.cta}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  ) : disableBtn ? (
                    <Button className="w-full h-12 font-bold" variant="secondary" disabled>
                      {overrideBtnText || plan.cta}
                    </Button>
                  ) : (
                    <UpgradeButton 
                      user={session?.user}
                      className={plan.highlight ? "shadow-lg shadow-primary/20" : ""}
                      amount={price}
                      usdAmount={usdPrice}
                      plan={plan.plan}
                      interval={isYearly ? "year" : "month"}
                      currency={currency}
                    >
                      {overrideBtnText || plan.cta}
                    </UpgradeButton>
                  )}
                </div>

                <ul className="space-y-3 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      {feature.included ? (
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                      ) : (
                        <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                          <X className="h-3 w-3 text-muted-foreground" />
                        </div>
                      )}
                      <span className={cn("text-sm", !feature.included && "text-muted-foreground line-through")}>
                        {feature.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
