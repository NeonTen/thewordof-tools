import { generateSeoMetadata } from "@/app/lib/seo";
import { ToolHeader } from "@/components/tools/tool-header";
import { SipCalculator } from "@/components/tools/sip-calculator";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = generateSeoMetadata({
  title: "SIP & Mutual Fund Return Calculator | TheWordOf Tools",
  description:
    "Project future returns of your Systematic Investment Plan (SIP) investments.",
});

export default function SipPage() {
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
          title="SIP Calculator"
        />
        <p className="text-muted-foreground mt-2">
          Determine compound growth returns for regular mutual fund investments.
        </p>
      </div>
      <SipCalculator />
    </div>
  );
}
