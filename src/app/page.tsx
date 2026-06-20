import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Zap,
  Sparkles,
  Image as ImageIcon,
  FileCode,
  Calculator,
  Wand2,
  FileText,
  Share2,
  Star,
  QrCode,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { auth } from "@/auth";
import { TestimonialsCarousel } from "@/components/home/testimonials-carousel";

export default async function Home() {
  const session = await auth();
  const isPro =
    session?.user?.role === "PRO" ||
    session?.user?.role === "BUSINESS" ||
    session?.user?.role === "ADMIN";

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Scarcity Banner */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white py-2 text-center text-sm font-bold shadow-md relative z-10 animate-in slide-in-from-top duration-500">
          🔥 Limited spots for early access — Join before the beta closes in 3 days!
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-32 md:pt-24 md:pb-48">
          {/* Background Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
          </div>

          <div className="container mx-auto px-6 max-w-[1440px] text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <Sparkles className="h-3 w-3" /> The Ultimate AI Productivity
              Toolkit
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              Boost Your Productivity 10x <br />
              <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                All AI Tools, Zero Tab Hunting
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-muted-foreground text-lg sm:text-xl leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
              Imagine generating invoices, optimizing images, and crafting SEO—all from one sleek dashboard—without switching tabs ever again.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-700">
              <Link href={session ? "/dashboard" : "/tools"}>
                <Button
                  size="lg"
                  className="h-14 px-10 text-base font-black rounded-xl shadow-[0_0_40px_rgba(var(--primary),0.6)] animate-pulse hover:animate-none hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                >
                  {session ? "Go to Dashboard" : "Explore All Tools"}{" "}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              {!isPro && (
                <Link href="/pricing">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-14 px-10 text-base font-bold rounded-xl border-2"
                  >
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
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                Powerful tools for every task
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                From developers to marketers, we have the right tool for you.
                Fast, secure, and entirely browser-based.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Dynamic QR Codes",
                  desc: "Create custom-branded QR codes with live tracking, redirection links, and advanced scan analytics.",
                  features: [
                    "Custom shapes & colors",
                    "Scan analytics & UTM Builder",
                    "CSV/PDF report exports",
                  ],
                  icon: QrCode,
                  color: "text-blue-500",
                  bg: "bg-blue-500/10",
                  href: "/tools/qr-code",
                },
                {
                  title: "AI Resume & CV Builder",
                  desc: "Design clean, professional Resumes in seconds using ATS-optimized layouts, AI summary writers, and LinkedIn import.",
                  features: [
                    "10 Premium templates",
                    "AI Resume parser & import",
                    "Direct PDF generation",
                  ],
                  icon: FileText,
                  color: "text-purple-500",
                  bg: "bg-purple-500/10",
                  href: "/tools/cv-builder",
                },
                {
                  title: "AI Caption & SEO Suite",
                  desc: "Accelerate your growth with viral caption creators and SEO tags + metadata optimized for search engine ranks.",
                  features: [
                    "Readability Grader & AI Improver",
                    "Meta tags & description generator",
                    "Instagram & TikTok captions",
                  ],
                  icon: Wand2,
                  color: "text-indigo-500",
                  bg: "bg-indigo-500/10",
                  href: "/tools/caption-generator",
                },
                {
                  title: "Branded Invoice Generator",
                  desc: "Produce ready-to-send professional business invoices with custom logos, VAT/tax handling, and automated calculations.",
                  features: [
                    "Branded PDF invoices",
                    "Tax & discount calculators",
                    "Local customer saving",
                  ],
                  icon: Calculator,
                  color: "text-emerald-500",
                  bg: "bg-emerald-500/10",
                  href: "/tools/invoice-generator",
                },
                {
                  title: "Batch Image & SVG Compressor",
                  desc: "Optimize high-quality SVGs and batch convert or resize images directly inside your web browser.",
                  features: [
                    "Up to 1,000 files in parallel",
                    "Lossless SVG optimization",
                    "100% browser local safety",
                  ],
                  icon: ImageIcon,
                  color: "text-rose-500",
                  bg: "bg-rose-500/10",
                  href: "/tools/image-converter",
                },
                {
                  title: "Developer Utilities",
                  desc: "Minify code files, view side-by-side text differences, and generate advanced Schema markup for Google Rich Snippets.",
                  features: [
                    "HTML/CSS/JS minifier",
                    "Diff checker & editor",
                    "Structured data generator",
                  ],
                  icon: FileCode,
                  color: "text-orange-500",
                  bg: "bg-orange-500/10",
                  href: "/tools/schema-generator",
                },
              ].map((tool, i) => {
                const Icon = tool.icon;
                return (
                  <Card
                    key={i}
                    className={cn(
                      "group hover:border-primary/50 transition-all duration-300 flex flex-col justify-between relative overflow-hidden",
                      i === 2 ? "border-primary shadow-xl shadow-primary/10 scale-105 z-10" : "hover:shadow-lg hover:shadow-primary/5"
                    )}
                  >
                    {i === 2 && (
                      <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl z-20">
                        Most Popular
                      </div>
                    )}
                    <CardContent className="p-8 space-y-6 flex-1 flex flex-col justify-between relative z-10">
                      <div className="space-y-4">
                        <div
                          className={cn(
                            "h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300",
                            tool.bg,
                          )}
                        >
                          <Icon className={cn("h-6 w-6", tool.color)} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{tool.title}</h3>
                          <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                            {tool.desc}
                          </p>
                        </div>
                        <ul className="space-y-2 pt-2">
                          {tool.features.map((feat, idx) => (
                            <li
                              key={idx}
                              className="flex items-center gap-2 text-xs text-muted-foreground font-semibold"
                            >
                              <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-4 flex justify-end">
                        <Link
                          href={tool.href}
                          className="text-xs font-black text-primary group-hover:underline flex items-center gap-1"
                        >
                          Try Tool <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <div className="text-center mt-16">
              <Link href="/tools">
                <Button
                  variant="ghost"
                  className="font-bold hover:text-primary"
                >
                  Explore all tools <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 overflow-hidden">
          <div className="container mx-auto px-6 max-w-[1440px]">
            <div className="text-center mb-16 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                Trusted by makers worldwide
              </h2>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                <div className="space-y-1">
                  <p className="text-4xl font-black text-primary animate-in zoom-in duration-1000 delay-300">97%</p>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Saw Instant ROI</p>
                </div>
                <div className="space-y-1">
                  <p className="text-4xl font-black text-primary animate-in zoom-in duration-1000 delay-500">10x</p>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Faster Workflow</p>
                </div>
                <div className="space-y-1">
                  <p className="text-4xl font-black text-primary animate-in zoom-in duration-1000 delay-700">5k+</p>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Active Makers</p>
                </div>
              </div>
            </div>
            <TestimonialsCarousel />
          </div>
        </section>

        {/* Comparison Section */}
        <section className="py-24 bg-muted/30 border-y">
          <div className="container mx-auto px-6 max-w-[1440px]">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                Detailed Feature Comparison
              </h2>
              <p className="text-muted-foreground">
                Everything you get with our Free, Pro, and Business plans.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Free Plan */}
              <Card className="flex flex-col border-border/50 bg-background/50 hover:border-primary/50 transition-all">
                <CardHeader>
                  <h3 className="text-xl font-bold text-muted-foreground">Free</h3>
                  <div className="text-4xl font-black mt-2">$0<span className="text-sm font-medium text-muted-foreground">/mo</span></div>
                  <p className="text-sm text-muted-foreground mt-4">For individuals trying out the tools.</p>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between space-y-8">
                  <ul className="space-y-3 text-sm font-medium">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> 20 AI credits / month</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Basic Core Tools</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> 5 image processings / day</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> 3 invoices / month</li>
                  </ul>
                  <Button variant="outline" className="w-full font-bold">Current Plan</Button>
                </CardContent>
              </Card>

              {/* Pro Plan */}
              <Card className="flex flex-col border-primary shadow-xl shadow-primary/10 relative scale-105 z-10">
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl z-20">
                  Best Value
                </div>
                <CardHeader>
                  <h3 className="text-xl font-bold text-primary">Pro</h3>
                  <div className="text-4xl font-black mt-2">$9<span className="text-sm font-medium text-muted-foreground">/mo</span></div>
                  <p className="text-sm text-muted-foreground mt-4">For power users and creators.</p>
                  <p className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md mt-2 inline-block">
                    🎁 Sign up now and get 10 extra AI credits free!
                  </p>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between space-y-8">
                  <ul className="space-y-3 text-sm font-medium">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> 500 AI credits / month</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Unlimited Core Tools</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> 1,000 image processings / batch</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Priority AI Queue</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Ad-Free Experience</li>
                  </ul>
                  <Link href="/pricing" className="block">
                    <Button className="w-full font-bold shadow-[0_0_20px_rgba(var(--primary),0.4)] animate-pulse hover:animate-none">Upgrade to Pro</Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Business Plan */}
              <Card className="flex flex-col border-border/50 bg-background/50 hover:border-primary/50 transition-all">
                <CardHeader>
                  <h3 className="text-xl font-bold text-foreground">Business</h3>
                  <div className="text-4xl font-black mt-2">$29<span className="text-sm font-medium text-muted-foreground">/mo</span></div>
                  <p className="text-sm text-muted-foreground mt-4">For agencies and large teams.</p>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between space-y-8">
                  <ul className="space-y-3 text-sm font-medium">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> 2,000 AI credits / month</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Unlimited Everything</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Advanced QR Analytics</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Custom AI Schema Generator</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> 24/7 Dedicated Support</li>
                  </ul>
                  <Link href="/pricing" className="block">
                    <Button variant="outline" className="w-full font-bold">Contact Sales</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24">
          <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-center mb-16">
              Common Questions
            </h2>
            <div className="space-y-6">
              {[
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
              ].map((faq, i) => (
                <div
                  key={i}
                  className="group border rounded-2xl p-8 hover:border-primary/50 transition-all bg-background"
                >
                  <h3 className="font-bold text-xl mb-3 flex items-center justify-between">
                    {faq.q}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.a}
                  </p>
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
            <h2 className="text-4xl sm:text-6xl font-black tracking-tight">
              {isPro
                ? "Your workflow, supercharged."
                : "Supercharge your workflow today."}
            </h2>
            <p className="max-w-xl mx-auto text-primary-foreground/80 text-lg sm:text-xl font-medium">
              {isPro
                ? "You're all set with TheWordOf Tools Pro. Experience the full power of our utility toolkit."
                : "Join 5,000+ makers who use TheWordOf Tools to simplify their daily tasks. Free forever."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href={session ? "/dashboard" : "/register"}>
                <Button
                  size="lg"
                  className="h-16 px-12 bg-white text-primary hover:bg-white/90 text-lg font-black rounded-2xl"
                >
                  {session ? "Go to Dashboard" : "Get Started for Free"}
                </Button>
              </Link>
              {!isPro && (
                <Link href="/pricing">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="h-16 px-12 border-2 border-primary-foreground/20 hover:bg-primary-foreground/10 text-primary-foreground hover:text-primary-foreground text-lg font-bold rounded-2xl"
                  >
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
  );
}
