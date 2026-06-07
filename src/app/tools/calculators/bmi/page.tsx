import { ToolHeader } from "@/components/tools/tool-header"
import { BmiCalculator } from "@/components/tools/bmi-calculator"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Body Mass Index (BMI) Calculator | TheWordOf Tools",
  description: "Calculate your body mass index instantly with support for metric and imperial scales.",
}

export default function BmiPage() {
  return (
    <div className="space-y-6">
      <Link 
        href="/tools/calculators" 
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Calculators
      </Link>
      <div>
        <ToolHeader category="Calculators" categoryHref="/tools/calculators" title="BMI Calculator" />
        <p className="text-muted-foreground mt-2">
          Monitor your body weight indices using standardized scales.
        </p>
      </div>
      <BmiCalculator />
    </div>
  )
}
