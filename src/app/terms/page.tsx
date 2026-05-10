import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export const metadata = {
  title: "Terms of Service — TheWordOf Tools",
  description: "Terms and conditions for using TheWordOf Tools.",
}

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-20 max-w-4xl">
        <h1 className="text-4xl font-black tracking-tight mb-10 text-center">Terms of Service</h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using TheWordOf Tools ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground leading-relaxed">
              TheWordOf Tools provides various online utility tools, including image converters, SVG compressors, AI-powered content generators, and financial calculators. These tools are provided "as is" and are subject to change or discontinuation at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. User Conduct</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree to use the Service only for lawful purposes. You are prohibited from using the Service to process, generate, or distribute any content that is illegal, harmful, threatening, abusive, or otherwise objectionable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              The Service and its original content (excluding user-provided data) are and will remain the exclusive property of TheWordOf. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of TheWordOf.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              In no event shall TheWordOf be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.
            </p>
          </section>

          <section className="pt-10 border-t">
            <p className="text-sm text-muted-foreground italic text-center">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
