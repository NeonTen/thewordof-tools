import { ToolHeader } from "@/components/tools/tool-header";
import { ColorConverter } from "@/components/tools/color-converter";
import { auth } from "@/auth";
import { generateSeoMetadata } from "@/app/lib/seo";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = generateSeoMetadata({
  title: "HEX / RGB / HSL Converter",
  description:
    "Convert color formats between HEX, RGB and HSL values with live sync.",
  keywords: [
    "color converter",
    "hex to rgb",
    "rgb to hsl",
    "hsl converter",
    "hex converter",
  ],
  canonical: "/tools/calculators/color-converter",
});

export default async function ColorConverterPage() {
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
          title="HEX / RGB / HSL Converter"
        />
        <p className="text-muted-foreground mt-2">
          Translate color values seamlessly across HEX, RGB, and HSL.
        </p>
      </div>

      <ColorConverter isPro={isPro} />
    </div>
  );
}
