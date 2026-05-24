import Link from "next/link"
import { Check, X, Sparkles, Zap, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { auth } from "@/auth"


export const metadata = {
  title: "Transparent Pricing — TheWordOf Tools Pro",
  description: "Start for free and stay for free. Upgrade to Pro for unlimited batch processing, priority AI generation, and full CV building. Simple monthly billing, cancel anytime.",
  keywords: ["SaaS pricing", "AI tools pricing", "TheWordOf Pro features", "affordable AI utilities"]
}

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

import { PricingCards } from "@/components/pricing/pricing-cards"

export default async function PricingPage() {
  const session = await auth()
  const role = session?.user?.role
  const isPro = role === "PRO"
  const isBusiness = role === "BUSINESS"
  const isAdmin = role === "ADMIN"

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

        {/* Pricing Cards Component */}
        <PricingCards session={session} isPro={isPro} isBusiness={isBusiness} isAdmin={isAdmin} />

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
                      <th scope="col" className="py-4 px-6 text-center text-sm font-black uppercase tracking-widest text-foreground">Business</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      ["Core Utility Tools", "Unlimited", "Unlimited", "Unlimited"],
                      ["Batch Image Processing", "5 / day", "Up to 1,000 / batch", "Unlimited"],
                      ["SVG Optimization", "5 / day", "Up to 1,000 / batch", "Unlimited"],
                      ["Bulk ZIP Exports", "5 / day", "Up to 1,000 / batch", "Unlimited"],
                      ["AI Caption Generator", "3 per gen", "10+ per gen", "Unlimited"],
                      ["AI CV Builder", "Basic Summary", "8 Pro Templates", "8 Pro Templates + Import with AI"],
                      ["Invoice Generator", "3 / month", "Unlimited + Branding", "Unlimited + Branding"],
        ["Cloud progress saving", "—", "✅ Unlimited", "✅ Unlimited"],
                      ["AI SEO Generator", "3 / day", "Unlimited", "Unlimited"],
                      ["AI Prompt Optimizer", "3 / day", "Unlimited + History", "Unlimited + History"],
                      ["LLMS.txt Builder", "1 / day", "Unlimited", "Unlimited"],
                      ["Advanced SEO Schema", "Basic", "Advanced", "Advanced"],
                      ["Priority AI Queue", "—", "✓ Instant", "✓ Highest Priority"],
                      ["Ad-Free Experience", "—", "✓", "✓"],
                      ["History Tracking", "—", "✓", "✓"],
                      ["1-on-1 Onboarding", "—", "—", "✓ Included"],
                      ["Priority Tool Requests", "—", "—", "✓ Included"],
                      ["Early Access", "—", "✓", "✓"],
                      ["Priority Support", "—", "✓ Email", "✓ 24/7 Dedicated"],
                    ].map(([feature, free, pro, business], i) => (
                      <tr key={i} className="hover:bg-muted/5 transition-colors">
                        <td className="py-4 px-8 font-bold whitespace-nowrap">{feature}</td>
                        <td className="py-4 px-8 text-center text-muted-foreground whitespace-nowrap">{free}</td>
                        <td className="py-4 px-8 text-center text-primary font-black whitespace-nowrap">{pro}</td>
                        <td className="py-4 px-8 text-center text-foreground font-black whitespace-nowrap">{business}</td>
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
