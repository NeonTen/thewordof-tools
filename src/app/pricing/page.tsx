import Link from "next/link"
import { Check, X, Sparkles, Zap, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { auth } from "@/auth"
import { UpgradeButton } from "@/components/pricing/upgrade-button"

export const metadata = {
  title: "Transparent Pricing — TheWordOf Tools Pro",
  description: "Start for free and stay for free. Upgrade to Pro for unlimited batch processing, priority AI generation, and full CV building. Simple monthly billing, cancel anytime.",
  keywords: ["SaaS pricing", "AI tools pricing", "TheWordOf Pro features", "affordable AI utilities"]
}

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default async function PricingPage() {
  const session = await auth()
  const isPro = session?.user?.role === "PRO" || session?.user?.role === "ADMIN"

  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      description: "Everything you need to get started. No credit card required.",
      cta: "Get Started Free",
      ctaHref: "/dashboard",
      highlight: false,
      features: [
        { label: "All 13 tools included", included: true },
        { label: "5 images per batch (Image Converter)", included: true },
        { label: "5 SVGs per batch (SVG Compressor)", included: true },
        { label: "3 AI captions per generation", included: true },
        { label: "3 invoices per month", included: true },
        { label: "All calculators unlimited", included: true },
        { label: "Code Minifier & Text Diff unlimited", included: true },
        { label: "Unlimited batch processing", included: false },
        { label: "Bulk ZIP downloads (unlimited)", included: false },
        { label: "10 AI captions + all platforms", included: false },
        { label: "Full CV Builder (all sections)", included: false },
        { label: "Unlimited invoices", included: false },
        { label: "Priority AI generation", included: false },
        { label: "No upgrade banners", included: false },
      ],
    },
    {
      name: "Pro",
      price: "₹499",
      period: "per month",
      description: "For power users and professionals who need zero limits.",
      cta: "Upgrade to Pro",
      priceId: process.env.STRIPE_PRO_PRICE_ID || "price_placeholder_id",
      highlight: true,
      badge: "Most Popular",
      features: [
        { label: "Everything in Free", included: true },
        { label: "Unlimited batch processing", included: true },
        { label: "Bulk ZIP downloads (unlimited)", included: true },
        { label: "10 AI captions + all platforms", included: true },
        { label: "Full CV Builder (all sections)", included: true },
        { label: "Unlimited invoices + custom branding", included: true },
        { label: "Priority AI generation", included: true },
        { label: "No upgrade banners", included: true },
        { label: "Early access to new tools", included: true },
        { label: "Email support", included: true },
      ],
    },
  ]

  const faqs = [
    {
      q: "Do I need to create an account to use the tools?",
      a: "No. All tools are accessible without an account. Simply visit the tool you need and start using it immediately. Creating an account lets you save history and upgrade to Pro.",
    },
    {
      q: "Are the free limits enforced strictly?",
      a: "In the current version, free limits are soft limits — they show an upgrade prompt but do not block access. Full enforcement will come with the Pro launch.",
    },
    {
      q: "Is my data safe?",
      a: "Yes. All image processing, SVG compression, code minification, and calculations happen entirely in your browser. Nothing is uploaded to our servers unless you're using an AI tool.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We will support UPI, Credit/Debit cards (Visa, Mastercard, RuPay), and Net Banking at launch via Razorpay.",
    },
    {
      q: "Can I cancel my Pro subscription anytime?",
      a: "Yes. Cancel anytime from your account settings. You'll retain Pro access until the end of your billing period.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-20 space-y-24">
        {/* Hero */}
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
            <Sparkles className="h-3 w-3" /> Simple, transparent pricing
          </div>
          <h1 className="text-5xl font-black tracking-tight leading-tight">
            Free forever.<br />
            <span className="text-primary">Pro when you need it.</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Every tool is free to use. Upgrade to Pro for unlimited processing, bulk exports, and priority AI generation.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "relative overflow-hidden",
                plan.highlight
                  ? "border-primary shadow-2xl shadow-primary/10 bg-gradient-to-b from-primary/5 to-background"
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

              <CardHeader className="pb-4 pt-8 px-8">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{plan.name}</p>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-5xl font-black tracking-tight">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">/{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
              </CardHeader>

              <CardContent className="px-8 pb-8 space-y-6">
                {plan.name === "Pro" ? (
                  isPro ? (
                    <Button className="w-full h-12 font-black tracking-tight bg-green-600 hover:bg-green-700" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <UpgradeButton 
                      priceId={plan.priceId!} 
                      className="shadow-lg shadow-primary/20"
                    >
                      {plan.cta}
                    </UpgradeButton>
                  )
                ) : (
                  <Button
                    className="w-full h-12 font-bold"
                    variant="outline"
                    asChild
                  >
                    <Link href={plan.ctaHref!}>
                      {isPro ? "Go to Dashboard" : plan.cta}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                )}

                <ul className="space-y-3">
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
          ))}
        </div>

        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black tracking-tight">Detailed Feature Comparison</h2>
            <p className="text-muted-foreground">Everything you get with our Free and Pro plans.</p>
          </div>
          <div className="overflow-x-auto -mx-6 px-6 pb-4">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden border rounded-2xl bg-background">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th scope="col" className="py-4 px-6 text-left text-sm font-black uppercase tracking-widest text-foreground">Feature</th>
                      <th scope="col" className="py-4 px-6 text-center text-sm font-black uppercase tracking-widest text-foreground">Free</th>
                      <th scope="col" className="py-4 px-6 text-center text-sm font-black uppercase tracking-widest text-primary">Pro</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      ["Core Utility Tools", "Unlimited", "Unlimited"],
                      ["Batch Image Processing", "5 / day", "Unlimited"],
                      ["SVG Optimization", "5 / day", "Unlimited"],
                      ["Bulk ZIP Exports", "5 / day", "Unlimited"],
                      ["AI Caption Generator", "3 per gen", "10+ per gen"],
                      ["AI CV Builder", "Basic Summary", "Full Pro CV + PDF"],
                      ["Invoice Generator", "3 / month", "Unlimited + Branding"],
                      ["AI SEO Generator", "3 / day", "Unlimited"],
                      ["AI Prompt Optimizer", "3 / day", "Unlimited + History"],
                      ["LLMS.txt Builder", "1 / day", "Unlimited"],
                      ["Advanced SEO Schema", "Basic", "Advanced"],
                      ["Priority AI Queue", "—", "✓ Instant"],
                      ["Ad-Free Experience", "—", "✓"],
                      ["History Tracking", "—", "✓"],
                      ["Early Access", "—", "✓"],
                      ["Priority Support", "—", "✓ Email"],
                    ].map(([feature, free, pro], i) => (
                      <tr key={i} className="hover:bg-muted/5 transition-colors">
                        <td className="py-4 px-8 font-bold whitespace-nowrap">{feature}</td>
                        <td className="py-4 px-8 text-center text-muted-foreground whitespace-nowrap">{free}</td>
                        <td className="py-4 px-8 text-center text-primary font-black whitespace-nowrap">{pro}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black tracking-tight text-center mb-12">Frequently asked questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border rounded-2xl p-6 bg-muted/20">
                <h3 className="font-bold mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Bottom */}
        <div className="text-center bg-primary/5 border border-primary/10 rounded-3xl p-16 space-y-6">
          <h2 className="text-4xl font-black tracking-tight">{session ? "Ready to dive in?" : "Ready to get started?"}</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {session ? "You're all set to use our premium utility toolkit." : "All tools are free to use today. No credit card, no account required."}
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="h-14 px-8 font-bold text-base" asChild>
              <Link href={session ? "/dashboard" : "/register"}>
                {session ? "Go to Dashboard" : "Start for Free"} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 font-bold text-base" asChild>
              <Link href="/tools">View All Tools</Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
