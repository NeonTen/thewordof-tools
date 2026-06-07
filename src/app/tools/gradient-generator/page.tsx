import { GradientGenerator } from "@/components/tools/gradient-generator"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Gradient Generator - CSS Gradient Builder & Preset Explorer",
  description: "Browse curated gradients, customize parameters, swap angles, and export code snippets for CSS or Tailwind.",
}

export default function GradientGeneratorPage() {
  return (
    <div className="flex flex-col gap-6">
      <Link 
        href="/tools" 
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Tools
      </Link>
      <div>
        <h1 className="text-3xl font-black tracking-tight">Gradient Generator</h1>
        <p className="text-muted-foreground mt-2">
          Explore and customize beautiful gradient presets, with instant code exports.
        </p>
      </div>
      <GradientGenerator />
    </div>
  )
}
