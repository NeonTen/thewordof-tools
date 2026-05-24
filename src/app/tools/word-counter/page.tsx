import { WordCounter } from "@/components/tools/word-counter"
import { generateSeoMetadata } from "@/app/lib/seo"

export const metadata = generateSeoMetadata({
  title: "Word Counter & Stats",
  description: "Live word, character, and line counter with advanced details.",
  keywords: ["word counter", "character count", "letter counter", "text statistics"],
})

export default async function WordCounterPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Word / Letter Counter</h1>
        <p className="text-muted-foreground mt-2">
          Calculate word length, lines, character count with live statistics.
        </p>
      </div>

      <WordCounter />
    </div>
  )
}
