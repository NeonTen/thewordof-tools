import { generateSeoMetadata } from "@/app/lib/seo";
import { ToolHeader } from "@/components/tools/tool-header";
import { GradientPalette } from "@/components/tools/gradient-palette";

import { ArrowLeft } from "lucide-react";

export const metadata = generateSeoMetadata({
  title: "Gradient Palette Generator - Generate Harmonious Gradients",
  description:
    "Generate mathematical gradient palettes and export CSS codes. Lock favorites and copy styles in one click.",
  canonical: "/tools/design/gradient-palette",
});

export default function GradientPalettePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <ToolHeader
          category="Design"
          categoryHref="/tools/design"
          title="Gradient Palette Generator"
        />
        <p className="text-muted-foreground mt-2">
          Create beautiful, mathematically balanced gradient schemes using
          standard color harmony theories.
        </p>
      </div>
      <GradientPalette />
    </div>
  );
}
