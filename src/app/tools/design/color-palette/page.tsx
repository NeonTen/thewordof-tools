import { generateSeoMetadata } from "@/app/lib/seo";
import { ToolHeader } from "@/components/tools/tool-header";
import { ColorPalette } from "@/components/tools/color-palette";

import { ArrowLeft } from "lucide-react";

export const metadata = generateSeoMetadata({
  title: "Color Palette Generator - Generate Color Harmonies",
  description:
    "Generate mathematical color palettes based on harmony rules. Lock colors and export to CSS or Tailwind.",
  canonical: "/tools/design/color-palette",
});

export default function ColorPalettePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <ToolHeader
          category="Design"
          categoryHref="/tools/design"
          title="Color Palette Generator"
        />
        <p className="text-muted-foreground mt-2">
          Create beautiful, mathematically balanced palettes using standard
          color harmony theories.
        </p>
      </div>
      <ColorPalette />
    </div>
  );
}
