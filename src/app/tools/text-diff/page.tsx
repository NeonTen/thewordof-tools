import { TextDiff } from "@/components/tools/text-diff"
import { Split } from "lucide-react"

export const metadata = {
  title: "Text Difference Checker",
  description: "Compare two text blocks or files side-by-side to find differences and changes.",
}

export default function TextDiffPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Split className="h-8 w-8 text-primary" />
          Text Difference Checker
        </h1>
        <p className="text-muted-foreground mt-2">
          Identify additions, deletions, and modifications between two pieces of text or files.
        </p>
      </div>

      <TextDiff />
    </div>
  )
}
