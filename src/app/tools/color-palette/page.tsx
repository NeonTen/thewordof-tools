import { ColorPalette } from "@/components/tools/color-palette"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Color Palette Generator - Generate Color Harmonies",
  description: "Generate mathematical color palettes based on harmony rules. Lock colors and export to CSS or Tailwind.",
}

export default function ColorPalettePage() {
  return (
    <div className="flex flex-col gap-6">
      <Link 
        href="/tools" 
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Tools
      </Link>
      <div>
        <h1 className="text-3xl font-black tracking-tight">Color Palette Generator</h1>
        <p className="text-muted-foreground mt-2">
          Create beautiful, mathematically balanced palettes using standard color harmony theories.
        </p>
      </div>
      <ColorPalette />
    </div>
  )
}
