import { ToolHeader } from "@/components/tools/tool-header"
import { EmiCalculator } from "@/components/tools/emi-calculator"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Home & Car Loan EMI Calculator | TheWordOf Tools",
  description: "Calculate your monthly EMI payments for home, car, or personal loans with visual breakdowns.",
}

export default function EmiPage() {
  return (
    <div className="space-y-6">
      <Link 
        href="/tools/calculators" 
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Calculators
      </Link>
      <div>
        <ToolHeader category="Calculators" categoryHref="/tools/calculators" title="Loan EMI Calculator" />
        <p className="text-muted-foreground mt-2">
          Calculate monthly interest payments and amortization values.
        </p>
      </div>
      <EmiCalculator />
    </div>
  )
}
