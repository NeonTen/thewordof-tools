import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Check, Zap, Sparkles, Image as ImageIcon, FileCode, Calculator, Wand2, FileText, Share2, Star } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { auth } from "@/auth"

export default async function Home() {
  const session = await auth()
  const isPro = session?.user?.role === "PRO" || session?.user?.role === "ADMIN"

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

          <div className="container mx-auto px-6 max-w-6xl text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <Sparkles className="h-3 w-3" /> 13+ Pro tools in one place
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              The ultimate <br />
              <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">AI Productivity Dashboard</span>
            </h1>
            <p className="max-w-2xl mx-auto text-muted-foreground text-lg sm:text-xl leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
              Stop switching tabs. TheWordOf Tools provides 13+ professional, browser-based utilities including AI invoice generators, image converters, SEO tag builders, and viral caption creators.
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
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Powerful tools for every task</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">From developers to marketers, we have the right tool for you. Fast, secure, and entirely browser-based.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Image Converter", desc: "Batch convert and resize images with zero loss.", icon: ImageIcon, color: "text-blue-500", bg: "bg-blue-500/10" },
                { title: "AI Caption Generator", desc: "Viral-ready captions for Instagram, TikTok, and more.", icon: Wand2, color: "text-purple-500", bg: "bg-purple-500/10" },
                { title: "Invoice Generator", desc: "Professional, PDF-ready invoices in seconds.", icon: FileText, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                { title: "Code Minifier", desc: "Optimize your CSS/HTML for faster load times.", icon: FileCode, color: "text-orange-500", bg: "bg-orange-500/10" },
                { title: "Financial Calculators", desc: "EMI, SIP, and more with interactive charts.", icon: Calculator, color: "text-rose-500", bg: "bg-rose-500/10" },
                { title: "SEO Generator", desc: "Meta tags and descriptions optimized for search.", icon: Share2, color: "text-indigo-500", bg: "bg-indigo-500/10" },
              ].map((tool, i) => {
                const Icon = tool.icon
                return (
                  <Card key={i} className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                    <CardContent className="p-8 space-y-4">
                      <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300", tool.bg)}>
                        <Icon className={cn("h-6 w-6", tool.color)} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{tool.title}</h3>
                        <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{tool.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
            <div className="text-center mt-12">
              <Link href="/tools">
                <Button variant="ghost" className="font-bold hover:text-primary">
                  See all 13+ tools <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 overflow-hidden">
          <div className="container mx-auto px-6 max-w-6xl">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-center mb-16">Trusted by makers worldwide</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: "Rahul Sharma", role: "Digital Marketer", text: "The AI Caption Generator has saved me hours. The captions are actually high quality and viral-ready." },
                { name: "Jessica Chen", role: "Frontend Developer", text: "The SVG Compressor and Image Converter are my go-to tools now. Super fast and no quality loss." },
                { name: "Sajid Khan", role: "SaaS Founder", text: "Everything I need in one dashboard. The invoice generator is a lifesaver for my freelance projects." },
              ].map((item, i) => (
                <Card key={i} className="bg-muted/30 border-none shadow-none p-8 space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Star className="h-20 w-20 fill-primary text-primary" />
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-primary text-primary" />)}
                  </div>
                  <p className="italic text-lg">"{item.text}"</p>
                  <div>
                    <p className="font-bold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.role}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="py-24 bg-muted/30 border-y">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Free vs Pro</h2>
              <p className="text-muted-foreground">{isPro ? "You are currently enjoying all Pro benefits." : "Core features are free forever. Upgrade for high-volume needs."}</p>
            </div>
            <div className="max-w-4xl mx-auto overflow-hidden rounded-2xl border bg-background shadow-2xl">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-6 px-8 font-bold text-base">Feature</th>
                    <th className="text-center py-6 px-8 font-bold text-base">Free</th>
                    <th className="text-center py-6 px-8 font-bold text-base text-primary">Pro</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Core Utility Tools", "Unlimited", "Unlimited"],
                    ["Image Processing", "5 images/batch", "Unlimited"],
                    ["SVG Compression", "5 files/batch", "Unlimited"],
                    ["AI Captions", "3/generation", "10/generation"],
                    ["AI CV Builder", "Basic", "Pro Template + PDF"],
                    ["Invoice Generator", "3/month", "Unlimited"],
                    ["Priority Support", "—", "✓"],
                    ["No Ads/Banners", "—", "✓"],
                  ].map(([feature, free, pro], i) => (
                    <tr key={i} className="border-b last:border-0 hover:bg-muted/5 transition-colors">
                      <td className="py-4 px-8 font-medium">{feature}</td>
                      <td className="py-4 px-8 text-center text-muted-foreground">{free}</td>
                      <td className="py-4 px-8 text-center text-primary font-bold">{pro}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24">
          <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-center mb-16">Common Questions</h2>
            <div className="space-y-6">
              {[
                { q: "Is it really free?", a: "Yes. All 13+ tools have a generous free tier that works forever without a credit card." },
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
        <section className="py-24 container mx-auto px-6 max-w-6xl">
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
                  <Button variant="outline" size="lg" className="h-16 px-12 border-white/20 hover:bg-white/10 text-white text-lg font-bold rounded-2xl">
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
