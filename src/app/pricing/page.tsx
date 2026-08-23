import { generateSeoMetadata } from "@/app/lib/seo";
import Link from "next/link";
import React from "react";
import { Check, X, Sparkles, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { auth } from "@/auth";

export const metadata = generateSeoMetadata({
  title: "Transparent Pricing — TheWordOf Tools Pro",
  description:
    "Start for free and stay for free. Upgrade to Pro for unlimited batch processing, priority AI generation, and full CV building. Simple monthly billing, cancel anytime.",
  canonical: "/pricing",
});

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

import { PricingCards } from "@/components/pricing/pricing-cards";

export default async function PricingPage() {
  const session = await auth();
  const role = session?.user?.role;
  const isPro = role === "PRO";
  const isBusiness = role === "BUSINESS";
  const isAdmin = role === "ADMIN";

  const faqs = [
    {
      q: "Do I need to create an account to use the tools?",
      a: "For basic utility tools (like calculators, minifiers, or image conversion), no account is required. However, you must create a free account to use any AI-powered tools so we can manage your monthly AI credit pool.",
    },
    {
      q: "How do AI credits work?",
      a: "Each account starts with a free tier of 20 monthly AI credits. AI tasks consume different amounts (e.g., SEO generation costs 1 credit, while AI readability simplification costs 2 credits). Upgrading to Pro gives you up to 500 credits/month.",
    },
    {
      q: "Is my data safe?",
      a: "Yes. All standard calculations, file compression, minification, and image processing happen entirely inside your web browser locally. Nothing is uploaded to our servers unless you explicitly run an AI-powered tool.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We support Credit/Debit cards (Visa, Mastercard), UPI, and Net Banking securely processed via PayPal and Razorpay.",
    },
    {
      q: "Can I cancel my subscription anytime?",
      a: "Yes. You can manage, upgrade, or cancel your subscription at any time from your account dashboard. You will retain Pro features until your current billing period expires.",
    },
  ];

  const tableSections = [
    {
      title: "Usage & Limits",
      rows: [
        ["Monthly AI Credit Pool", "20 / mo", "500 / mo", "2,000 / mo"],
        ["Batch Processing Limit", "5 files / batch", "1,000 / batch", "Unlimited"],
        ["Cloud History & Saving", "—", "✓", "✓"]
      ]
    },
    {
      title: "AI & Generative Tools",
      subtitle: "(Consumes AI Credits)",
      rows: [
        ["Smart AI Chatbot Assistant", "✓", "✓", "✓"],
        ["Generative AI (Captions, SEO, Prompts)", "✓", "✓", "✓"],
        ["ATS Checker & Resume Analyzer", "✓", "✓", "✓"],
        ["AI Resume & CV Builder", "Basic (Text only)", "10 Templates + AI Parser", "10 Templates + AI Parser"]
      ]
    },
    {
      title: "SEO & Document Suite",
      rows: [
        ["Broken Link & SERP Analyzer", "3-5 crawls / mo", "Unlimited", "Unlimited"],
        ["Dynamic QR Codes", "1 (15-day expiry)", "Unlimited (Lifetime)", "Unlimited + Analytics"],
        ["SEO Readability & Schema Gen", "Basic", "Advanced", "Advanced"],
        ["Document Utilities (PDF/DOCX)", "Unlimited", "Unlimited", "Unlimited"]
      ]
    },
    {
      title: "Support & Perks",
      rows: [
        ["Priority AI Processing Queue", "—", "Included", "Highest Priority"],
        ["Ad-Free Experience", "—", "✓", "✓"],
        ["Priority Tool Requests", "—", "—", "Included"],
        ["Early Access", "—", "✓", "✓"],
        ["Priority Support", "Community", "Email", "24/7 Dedicated"]
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-[1440px] mx-auto px-6 py-20 space-y-24">
        {/* Hero */}
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
            <Sparkles className="h-3 w-3" /> Simple, transparent pricing
          </div>
          <h1 className="text-5xl font-black tracking-tight leading-tight">
            Free forever.
            <br />
            <span className="text-primary">Pro when you need it.</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Every tool is free to use. Upgrade to Pro for unlimited processing,
            bulk exports, and priority AI generation.
          </p>
        </div>

        {/* Pricing Cards Component */}
        <PricingCards
          session={session}
          isPro={isPro}
          isBusiness={isBusiness}
          isAdmin={isAdmin}
        />

        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black tracking-tight">
              Detailed Feature Comparison
            </h2>
            <p className="text-muted-foreground">
              Everything you get with our Free and Pro plans.
            </p>
          </div>
          <div className="overflow-x-auto -mx-6 px-6 pb-4">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden border rounded-2xl bg-background">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th
                        scope="col"
                        className="py-4 px-6 text-left text-sm font-black uppercase tracking-widest text-foreground"
                      >
                        Feature
                      </th>
                      <th
                        scope="col"
                        className="py-4 px-6 text-center text-sm font-black uppercase tracking-widest text-foreground"
                      >
                        Free
                      </th>
                      <th
                        scope="col"
                        className="py-4 px-6 text-center text-sm font-black uppercase tracking-widest text-primary"
                      >
                        Pro
                      </th>
                      <th
                        scope="col"
                        className="py-4 px-6 text-center text-sm font-black uppercase tracking-widest text-foreground"
                      >
                        Business
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {tableSections.map((section, sIdx) => (
                      <React.Fragment key={sIdx}>
                        {/* Section Header */}
                        <tr className="bg-muted/30">
                          <td colSpan={4} className="py-3 px-8 text-sm font-black text-foreground uppercase tracking-widest border-y">
                            {section.title} {section.subtitle && <span className="text-muted-foreground font-semibold normal-case tracking-normal ml-2">{section.subtitle}</span>}
                          </td>
                        </tr>
                        {/* Section Rows */}
                        {section.rows.map(([feature, free, pro, business], rIdx) => (
                          <tr
                            key={`${sIdx}-${rIdx}`}
                            className="hover:bg-muted/5 transition-colors"
                          >
                            <td className="py-4 px-8 font-bold whitespace-nowrap">
                              {feature}
                            </td>
                            <td className="py-4 px-8 text-center text-muted-foreground whitespace-nowrap">
                              {free === "✓" ? <Check className="h-5 w-5 mx-auto text-green-500" /> : free}
                            </td>
                            <td className="py-4 px-8 text-center text-primary font-black whitespace-nowrap">
                              {pro === "✓" ? <Check className="h-5 w-5 mx-auto text-primary" /> : pro}
                            </td>
                            <td className="py-4 px-8 text-center text-foreground font-black whitespace-nowrap">
                              {business === "✓" ? <Check className="h-5 w-5 mx-auto text-foreground" /> : business}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black tracking-tight text-center mb-12">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border rounded-2xl p-6 bg-muted/20">
                <h3 className="font-bold mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Bottom */}
        <div className="text-center bg-primary/5 border border-primary/10 rounded-3xl p-16 space-y-6">
          <h2 className="text-4xl font-black tracking-tight">
            {session ? "Ready to dive in?" : "Ready to get started?"}
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {session
              ? "You're all set to use our premium utility toolkit."
              : "All tools are free to use today. No credit card, no account required."}
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="h-14 px-8 font-bold text-base" asChild>
              <Link href={session ? "/dashboard" : "/register"}>
                {session ? "Go to Dashboard" : "Start for Free"}{" "}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 font-bold text-base"
              asChild
            >
              <Link href="/tools">View All Tools</Link>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
