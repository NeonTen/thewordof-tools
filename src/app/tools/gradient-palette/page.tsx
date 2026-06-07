import { GradientPalette } from "@/components/tools/gradient-palette"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Gradient Palette Generator - Generate Harmonious Gradients",
  description: "Generate mathematical gradient palettes and export CSS codes. Lock favorites and copy styles in one click.",
}

export default function GradientPalettePage() {
  return (
    <div className="flex flex-col gap-6">
      <Link 
        href="/tools" 
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Tools
      </Link>
      <div>
        <h1 className="text-3xl font-black tracking-tight">Gradient Palette Generator</h1>
        <p className="text-muted-foreground mt-2">
          Create beautiful, mathematically balanced gradient schemes using standard color harmony theories.
        </p>
      </div>
      <GradientPalette />
    </div>
  )
}
