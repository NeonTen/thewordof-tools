import { generateSeoMetadata } from "@/app/lib/seo";
import { ToolHeader } from "@/components/tools/tool-header";
import { ColorContrastScanner } from "@/components/tools/color-contrast-scanner";
import { auth } from "@/auth";

export const metadata = generateSeoMetadata({
  title: "Color Contrast Scanner - WCAG 2.1 Web Accessibility Auditor",
  description:
    "Scan any webpage URL for contrast accessibility. Find elements failing WCAG AA & AAA standards with detailed selector reports.",
  canonical: "/tools/design/color-contrast-scanner",
});

export default async function ColorContrastScannerPage() {
  const session = await auth();
  const isPro =
    session?.user?.role === "PRO" ||
    session?.user?.role === "BUSINESS" ||
    session?.user?.role === "ADMIN";

  return (
    <div className="flex flex-col gap-8">
      <div>
        <ToolHeader
          category="Design"
          categoryHref="/tools/design"
          title="Color Contrast Scanner"
        />
        <p className="text-muted-foreground mt-2">
          Scan any webpage URL to find elements that fail WCAG readability
          contrast guidelines.
        </p>
      </div>

      <ColorContrastScanner isPro={isPro} />
    </div>
  );
}
