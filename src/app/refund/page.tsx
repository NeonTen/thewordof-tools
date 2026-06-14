import { generateSeoMetadata } from "@/app/lib/seo";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata = generateSeoMetadata({
  title: "Refund Policy — TheWordOf Tools",
  description:
    "Learn about subscription refunds and our 7-day money-back guarantee.",
});

export default function RefundPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-20 max-w-4xl">
        <h1 className="text-4xl font-black tracking-tight mb-10 text-center">
          Refund Policy
        </h1>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">
              1. 7-Day Money-Back Guarantee
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We want you to be fully satisfied with our services. If you are
              not satisfied with your Pro or Business subscription, you are
              eligible for a full refund within 7 days of your original purchase
              date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Eligibility Criteria</h2>
            <p className="text-muted-foreground leading-relaxed">
              To request a refund, please contact support. Refunds are generally
              granted to first-time subscribers who have not excessively
              consumed resources (such as bulk AI usage or dynamic QR redirect
              scans) during the 7-day period.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Processing Time</h2>
            <p className="text-muted-foreground leading-relaxed">
              Once approved, refunds are processed back to your original payment
              method within 5 to 7 business days depending on your bank or
              payment provider.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              For any refund requests, billing inquiries, or subscription
              issues, please contact our support team via our support portal.
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
