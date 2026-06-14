import { ToolHeader } from "@/components/tools/tool-header";
import { WordCounter } from "@/components/tools/word-counter";
import { generateSeoMetadata } from "@/app/lib/seo";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = generateSeoMetadata({
  title: "Word Counter & Stats",
  description: "Live word, character, and line counter with advanced details.",
  keywords: [
    "word counter",
    "character count",
    "letter counter",
    "text statistics",
  ],
});

export default async function WordCounterPage() {
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
          title="Word / Letter Counter"
        />
        <p className="text-muted-foreground mt-2">
          Calculate word length, lines, character count with live statistics.
        </p>
      </div>

      <WordCounter />
    </div>
  );
}
