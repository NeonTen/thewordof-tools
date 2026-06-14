import { generateSeoMetadata } from "@/app/lib/seo";
import { ToolHeader } from "@/components/tools/tool-header";
import { CompoundInterestCalculator } from "@/components/tools/compound-interest-calculator";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = generateSeoMetadata({
  title: "Compound Interest Calculator (Inflation-Adjusted) | TheWordOf Tools",
  description:
    "Calculate compounding growth returns for savings or investments adjusted for yearly inflation.",
});

export default function CompoundInterestPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/tools/calculators"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Calculators
      </Link>
      <div>
        <ToolHeader
          category="Calculators"
          categoryHref="/tools/calculators"
          title="Compound Interest Calculator"
        />
        <p className="text-muted-foreground mt-2">
          Calculate compound wealth gains and inflation impact over a time
          horizon.
        </p>
      </div>
      <CompoundInterestCalculator />
    </div>
  );
}
