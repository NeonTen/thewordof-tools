import { generateSeoMetadata } from "@/app/lib/seo";
import { ToolHeader } from "@/components/tools/tool-header";
import { TextDiff } from "@/components/tools/text-diff";
import { Split } from "lucide-react";

export const metadata = generateSeoMetadata({
  title: "Text Difference Checker",
  description:
    "Compare two text blocks or files side-by-side to find differences and changes.",
});

export default function TextDiffPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <ToolHeader
          category="Image & Code"
          categoryHref="/tools/image-code"
          title="Text Difference Checker"
        />
        <p className="text-muted-foreground mt-2">
          Identify additions, deletions, and modifications between two pieces of
          text or files.
        </p>
      </div>

      <TextDiff />
    </div>
  );
}
