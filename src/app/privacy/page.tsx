import { generateSeoMetadata } from "@/app/lib/seo";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata = generateSeoMetadata({
  title: "Privacy Policy — TheWordOf Tools",
  description: "Learn how we handle your data and protect your privacy.",
});

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-20 max-w-4xl">
        <h1 className="text-4xl font-black tracking-tight mb-10 text-center">
          Privacy Policy
        </h1>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">
              1. Information We Collect
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We collect information that you provide directly to us when you
              create an account, such as your email address and name. We also
              collect usage data through cookies and similar technologies to
              improve our Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              2. Browser-Based Processing
            </h2>
            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 my-6">
              <p className="font-bold text-primary mb-2">
                Crucial Privacy Note:
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Most of our tools (Image Converter, SVG Compressor, Code
                Minifier, Calculators) process data entirely in your browser.
                This means your files, documents, and calculations never leave
                your computer and are not uploaded to our servers.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              3. AI Tool Data Handling
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              When you use our AI-powered tools (e.g., Caption Generator, CV
              Builder), the text input you provide is sent to our AI providers
              (Google Gemini or OpenAI) to generate the response. We do not
              store this data permanently unless you are logged in and choose to
              save your history.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              4. How We Use Information
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We use the information we collect to provide, maintain, and
              improve our Service, to communicate with you about your account,
              and to personalize your experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may use third-party analytics services (such as Google
              Analytics) and payment processors (such as Stripe or Razorpay)
              which have their own privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement industry-standard security measures to protect your
              personal information. However, no method of transmission over the
              internet or electronic storage is 100% secure.
            </p>
          </section>

          <section className="pt-10 border-t">
            <p className="text-sm text-muted-foreground italic text-center">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
