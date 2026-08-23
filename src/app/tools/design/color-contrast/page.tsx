import { generateSeoMetadata } from "@/app/lib/seo";
import { ToolHeader } from "@/components/tools/tool-header";
import { ColorContrast } from "@/components/tools/color-contrast";

import { ArrowLeft } from "lucide-react";

export const metadata = generateSeoMetadata({
  title: "Color Contrast Checker - WCAG 2.1 Accessibility Tool",
  description:
    "Check text legibility and accessibility contrast ratios under WCAG 2.1 AA & AAA standards dynamically.",
  canonical: "/tools/design/color-contrast",
});

export default function ColorContrastPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <ToolHeader
          category="Design"
          categoryHref="/tools/design"
          title="Color Contrast Checker"
        />
        <p className="text-muted-foreground mt-2">
          Validate foreground and background color pairings for web
          accessibility standards.
        </p>
      </div>
      <ColorContrast />
    </div>
  );
}
