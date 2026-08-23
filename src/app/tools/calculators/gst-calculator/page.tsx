import { ToolHeader } from "@/components/tools/tool-header";
import { GSTCalculator } from "@/components/tools/gst-calculator";
import { auth } from "@/auth";
import { generateSeoMetadata } from "@/app/lib/seo";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = generateSeoMetadata({
  title: "GST Calculator",
  description:
    "Calculate Goods and Services Tax for India, Australia, Canada with inclusive/exclusive pricing.",
  keywords: [
    "gst calculator",
    "tax calculator",
    "gst inclusive",
    "gst exclusive",
  ],
  canonical: "/tools/calculators/gst-calculator",
});

export default async function GSTCalculatorPage() {
  const session = await auth();
  const isPro =
    session?.user?.role === "PRO" ||
    session?.user?.role === "BUSINESS" ||
    session?.user?.role === "ADMIN";

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/tools/calculators"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium self-start"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Calculators
      </Link>
      <div>
        <ToolHeader
          category="Calculators"
          categoryHref="/tools/calculators"
          title="GST Calculator"
        />
        <p className="text-muted-foreground mt-2">
          Calculate GST inclusive and exclusive prices instantly.
        </p>
      </div>

      <GSTCalculator isPro={isPro} />
    </div>
  );
}
