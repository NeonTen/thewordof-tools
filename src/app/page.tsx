import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Check, Zap, Sparkles, Image as ImageIcon, FileCode, Calculator, Wand2, FileText, Share2, Star, QrCode } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { auth } from "@/auth"
import { TestimonialsCarousel } from "@/components/home/testimonials-carousel"

export default async function Home() {
  const session = await auth()
  const isPro = session?.user?.role === "PRO" || session?.user?.role === "BUSINESS" || session?.user?.role === "ADMIN"

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-32 md:pt-32 md:pb-48">
          {/* Background Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
          </div>

          <div className="container mx-auto px-6 max-w-[1440px] text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <Sparkles className="h-3 w-3" /> The Ultimate AI Productivity Toolkit
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              All Your Essential <br />
              <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">Tools in One Dashboard</span>
            </h1>
            <p className="max-w-2xl mx-auto text-muted-foreground text-lg sm:text-xl leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
              AI-powered productivity tools for creators, developers, and businesses. Generate invoices, convert images, build SEO tags, create QR codes, write content, and manage everyday tasks from one powerful workspace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-700">
              <Link href={session ? "/dashboard" : "/tools"}>
                <Button size="lg" className="h-14 px-10 text-base font-black rounded-xl shadow-xl shadow-primary/20">
                  {session ? "Go to Dashboard" : "Explore All Tools"} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              {!isPro && (
                <Link href="/pricing">
                  <Button variant="outline" size="lg" className="h-14 px-10 text-base font-bold rounded-xl border-2">
                    View Pricing
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Tools Grid Preview */}
        <section className="py-24 bg-muted/30 border-y">
          <div className="container mx-auto px-6 max-w-[1440px]">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Powerful tools for every task</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">From developers to marketers, we have the right tool for you. Fast, secure, and entirely browser-based.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { 
                  title: "Dynamic QR Codes", 
                  desc: "Create custom-branded QR codes with live tracking, redirection links, and advanced scan analytics.", 
                  features: ["Custom shapes & colors", "Device & location tracking", "Redirection link manager"],
                  icon: QrCode, 
                  color: "text-blue-500", 
                  bg: "bg-blue-500/10",
                  href: "/tools/qr-code" 
                },
                { 
                  title: "AI Resume & CV Builder", 
                  desc: "Design clean, professional Resumes in seconds using ATS-optimized layouts, AI summary writers, and LinkedIn import.", 
                  features: ["8 Premium templates", "AI summary helper", "Direct PDF generation"],
                  icon: FileText, 
                  color: "text-purple-500", 
                  bg: "bg-purple-500/10",
                  href: "/tools/cv-builder" 
                },
                { 
                  title: "AI Caption & SEO Suite", 
                  desc: "Accelerate your growth with viral caption creators and SEO tags + metadata optimized for search engine ranks.", 
                  features: ["Instagram & TikTok captions", "Meta tags & descriptions", "Custom tone & goal settings"],
                  icon: Wand2, 
                  color: "text-indigo-500", 
                  bg: "bg-indigo-500/10",
                  href: "/tools/caption-generator" 
                },
                { 
                  title: "Branded Invoice Generator", 
                  desc: "Produce ready-to-send professional business invoices with custom logos, VAT/tax handling, and automated calculations.", 
                  features: ["Branded PDF invoices", "Tax & discount calculators", "Local customer saving"],
                  icon: Calculator, 
                  color: "text-emerald-500", 
                  bg: "bg-emerald-500/10",
                  href: "/tools/invoice-generator" 
                },
                { 
                  title: "Batch Image & SVG Compressor", 
                  desc: "Optimize high-quality SVGs and batch convert or resize images directly inside your web browser.", 
                  features: ["Up to 1,000 files in parallel", "Lossless SVG optimization", "100% browser local safety"],
                  icon: ImageIcon, 
                  color: "text-rose-500", 
                  bg: "bg-rose-500/10",
                  href: "/tools/image-converter" 
                },
                { 
                  title: "Developer Utilities", 
                  desc: "Minify code files, view side-by-side text differences, and generate advanced Schema markup for Google Rich Snippets.", 
                  features: ["HTML/CSS/JS minifier", "Diff checker & editor", "Structured data generator"],
                  icon: FileCode, 
                  color: "text-orange-500", 
                  bg: "bg-orange-500/10",
                  href: "/tools/schema-generator" 
                },
              ].map((tool, i) => {
                const Icon = tool.icon
                return (
                  <Card key={i} className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 flex flex-col justify-between">
                    <CardContent className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300", tool.bg)}>
                          <Icon className={cn("h-6 w-6", tool.color)} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{tool.title}</h3>
                          <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{tool.desc}</p>
                        </div>
                        <ul className="space-y-2 pt-2">
                          {tool.features.map((feat, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-xs text-muted-foreground font-semibold">
                              <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-4 flex justify-end">
                        <Link href={tool.href} className="text-xs font-black text-primary group-hover:underline flex items-center gap-1">
                          Try Tool <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
            <div className="text-center mt-16">
              <Link href="/tools">
                <Button variant="ghost" className="font-bold hover:text-primary">
                  Explore all tools <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 overflow-hidden">
          <div className="container mx-auto px-6 max-w-[1440px]">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-center mb-16">Trusted by makers worldwide</h2>
            <TestimonialsCarousel />
          </div>
        </section>

        {/* Comparison Section */}
        <section className="py-24 bg-muted/30 border-y">
          <div className="container mx-auto px-6 max-w-[1440px]">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Detailed Feature Comparison</h2>
              <p className="text-muted-foreground">Everything you get with our Free, Pro, and Business plans.</p>
            </div>
            
            <div className="overflow-x-auto -mx-6 px-6 pb-4">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden rounded-2xl border bg-background shadow-2xl">
                  <table className="min-w-full divide-y divide-border text-sm">
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
                        ["Monthly AI Credit Pool", "20 credits / mo", "500 credits / mo", "2,000 credits / mo"],
                        ["Core Utility Tools", "Unlimited", "Unlimited", "Unlimited"],
                        ["Batch Image Processing", "5 / day", "Up to 1,000 / batch", "Unlimited"],
                        ["SVG Optimization", "5 / day", "Up to 1,000 / batch", "Unlimited"],
                        ["Bulk ZIP Exports", "5 / day", "Up to 1,000 / batch", "Unlimited"],
                        ["AI Caption Generator", "Costs 1 credit", "Costs 1 credit", "Costs 1 credit"],
                        ["AI Product Description", "Costs 1 credit", "Costs 1 credit", "Costs 1 credit"],
                        ["AI SEO Generator", "Costs 1 credit", "Costs 1 credit", "Costs 1 credit"],
                        ["AI Prompt Optimizer", "Costs 1 credit", "Costs 1 credit", "Costs 1 credit"],
                        ["LLMS.txt Builder", "Costs 1 credit", "Costs 1 credit", "Costs 1 credit"],
                        ["AI CV Builder & Import", "Costs 1 credit (Summary)", "Costs 1 credit", "Costs 1-3 credits"],
                        ["Invoice Generator", "3 / month", "Unlimited + Branding", "Unlimited + Branding"],
                        ["Dynamic QR Codes", "1 (15-day expiry)", "Unlimited (Lifetime)", "Unlimited (Lifetime)"],
                        ["Dynamic QR Analytics", "—", "Basic (Timeline, Device, Browser)", "Advanced (Timeline, Device, Browser + Geo Country/City)"],
                        ["SERP Previewer", "5 scrapes / mo", "Unlimited", "Unlimited"],
                        ["Keyword Density Analyzer", "5 crawls / mo", "Unlimited", "Unlimited"],
                        ["SEO Readability Grader", "5 crawls / mo", "Unlimited", "Unlimited"],
                        ["AI Readability Improver", "—", "Costs 2 credits / use", "Costs 2 credits / use"],
                        ["Broken Link Auditor", "3 audits / mo", "Unlimited", "Unlimited"],
                        ["SVG Framework Exports", "—", "Yes (React/Vue/Svelte)", "Yes (React/Vue/Svelte)"],
                        ["Advanced SEO Schema", "Basic", "Advanced", "Advanced"],
                        ["Cloud progress saving", "—", "Unlimited", "Unlimited"],
                        ["Priority AI Queue", "—", "Included", "Highest Priority"],
                        ["Ad-Free Experience", "—", "✓", "✓"],
                        ["History Tracking", "—", "✓", "✓"],
                        ["Priority Tool Requests", "—", "—", "Included"],
                        ["Early Access", "—", "✓", "✓"],
                        ["Priority Support", "—", "Email", "24/7 Dedicated"],
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
        </section>

        {/* FAQ Section */}
        <section className="py-24">
          <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-center mb-16">Common Questions</h2>
            <div className="space-y-6">
              {[
                { q: "Is it really free?", a: "Yes. All tools have a generous free tier that works forever. We are constantly adding new utilities to the collection." },
                { q: "Is my data secure?", a: "100%. All processing (except AI generation) happens directly in your browser. We never see your files." },
                { q: "Can I use AI tools for free?", a: "Yes, every AI tool has a daily free limit. You can upgrade to Pro for high-volume use." },
                { q: "Do you offer refunds?", a: "Yes, we offer a 7-day money-back guarantee for our Pro subscription if you are not satisfied." },
              ].map((faq, i) => (
                <div key={i} className="group border rounded-2xl p-8 hover:border-primary/50 transition-all bg-background">
                  <h3 className="font-bold text-xl mb-3 flex items-center justify-between">
                    {faq.q}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 container mx-auto px-6 max-w-[1440px]">
          <div className="bg-primary rounded-[3rem] p-12 md:p-24 text-center text-primary-foreground space-y-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
              <Zap className="h-64 w-64 rotate-12" />
            </div>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tight">{isPro ? "Your workflow, supercharged." : "Supercharge your workflow today."}</h2>
            <p className="max-w-xl mx-auto text-primary-foreground/80 text-lg sm:text-xl font-medium">
              {isPro 
                ? "You're all set with TheWordOf Tools Pro. Experience the full power of our utility toolkit." 
                : "Join 5,000+ makers who use TheWordOf Tools to simplify their daily tasks. Free forever."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href={session ? "/dashboard" : "/register"}>
                <Button size="lg" className="h-16 px-12 bg-white text-primary hover:bg-white/90 text-lg font-black rounded-2xl">
                  {session ? "Go to Dashboard" : "Get Started for Free"}
                </Button>
              </Link>
              {!isPro && (
                <Link href="/pricing">
                  <Button variant="ghost" size="lg" className="h-16 px-12 border-2 border-primary-foreground/20 hover:bg-primary-foreground/10 text-primary-foreground hover:text-primary-foreground text-lg font-bold rounded-2xl">
                    View Pro Features
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
