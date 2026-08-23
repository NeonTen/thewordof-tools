import { generateSeoMetadata } from "@/app/lib/seo";
import { ToolHeader } from "@/components/tools/tool-header";
import { LineHeightCalculator } from "@/components/tools/line-height-calculator";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = generateSeoMetadata({
  title: "CSS Line-Height Converter & Live Preview | TheWordOf Tools",
  description:
    "Convert line-height pixel, rem, or percentage values to relative unitless values for web designs.",
  canonical: "/tools/calculators/line-height",
});

export default function LineHeightPage() {
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
          title="Line-Height Converter"
        />
        <p className="text-muted-foreground mt-2">
          Find the relative line-height multiplier for CSS styles.
        </p>
      </div>
      <LineHeightCalculator />
    </div>
  );
}
