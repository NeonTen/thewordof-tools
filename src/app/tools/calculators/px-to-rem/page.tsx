import { ToolHeader } from "@/components/tools/tool-header"
import { PxToRemCalculator } from "@/components/tools/px-to-rem-calculator"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "PX to REM Converter & Tailwind Scale Chart | TheWordOf Tools",
  description: "Convert pixels to REM values dynamically based on base font sizes and view CSS conversion charts.",
}

export default function PxToRemPage() {
  return (
    <div className="space-y-6">
      <Link 
        href="/tools/calculators" 
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Calculators
      </Link>
      <div>
        <ToolHeader category="Calculators" categoryHref="/tools/calculators" title="PX to REM Converter" />
        <p className="text-muted-foreground mt-2">
          Convert layout measurements bidirectionally and map styling classes.
        </p>
      </div>
      <PxToRemCalculator />
    </div>
  )
}
