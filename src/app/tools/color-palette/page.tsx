import { ColorPalette } from "@/components/tools/color-palette"

export const metadata = {
  title: "Color Palette Generator - Generate Color Harmonies",
  description: "Generate mathematical color palettes based on harmony rules. Lock colors and export to CSS or Tailwind.",
}

export default function ColorPalettePage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Color Palette Generator</h1>
        <p className="text-muted-foreground mt-2">
          Create beautiful, mathematically balanced palettes using standard color harmony theories.
        </p>
      </div>
      <ColorPalette />
    </div>
  )
}
