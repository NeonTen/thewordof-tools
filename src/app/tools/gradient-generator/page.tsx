import { GradientGenerator } from "@/components/tools/gradient-generator"

export const metadata = {
  title: "Gradient Generator - CSS Gradient Builder & Preset Explorer",
  description: "Browse curated gradients, customize parameters, swap angles, and export code snippets for CSS or Tailwind.",
}

export default function GradientGeneratorPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gradient Generator</h1>
        <p className="text-muted-foreground mt-2">
          Explore and customize beautiful gradient presets, with instant code exports.
        </p>
      </div>
      <GradientGenerator />
    </div>
  )
}
