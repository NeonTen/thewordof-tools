import { AspectRatioCalculator } from "@/components/tools/aspect-ratio-calculator"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Aspect Ratio Calculator & Resizer | TheWordOf Tools",
  description: "Calculate layouts and scale image dimensions easily based on custom or standard aspect ratios.",
}

export default function AspectRatioPage() {
  return (
    <div className="space-y-6">
      <Link 
        href="/tools/calculators" 
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Calculators
      </Link>
      <div>
        <h1 className="text-3xl font-black tracking-tight">Aspect Ratio Calculator</h1>
        <p className="text-muted-foreground mt-2">
          Calculate scale dimensions and relative aspect ratios instantly.
        </p>
      </div>
      <AspectRatioCalculator />
    </div>
  )
}
