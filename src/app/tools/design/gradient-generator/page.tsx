import { ToolHeader } from "@/components/tools/tool-header"
import { GradientGenerator } from "@/components/tools/gradient-generator"

import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Gradient Generator - CSS Gradient Builder & Preset Explorer",
  description: "Browse curated gradients, customize parameters, swap angles, and export code snippets for CSS or Tailwind.",
}

export default function GradientGeneratorPage() {
  return (
    <div className="flex flex-col gap-6">
      
      <div>
        <ToolHeader category="Design" categoryHref="/tools/design" title="Gradient Generator" />
        <p className="text-muted-foreground mt-2">
          Explore and customize beautiful gradient presets, with instant code exports.
        </p>
      </div>
      <GradientGenerator />
    </div>
  )
}
