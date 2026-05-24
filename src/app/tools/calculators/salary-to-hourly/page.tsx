import { SalaryHourlyCalculator } from "@/components/tools/salary-hourly-calculator"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Salary to Hourly Converter & Pay Rate Calculator | TheWordOf Tools",
  description: "Convert annual salary into daily rates, hourly wages, weekly equivalents, and vice versa.",
}

export default function SalaryHourlyPage() {
  return (
    <div className="space-y-6">
      <Link 
        href="/tools/calculators" 
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Calculators
      </Link>
      <div>
        <h1 className="text-3xl font-black tracking-tight">Salary to Hourly Converter</h1>
        <p className="text-muted-foreground mt-2">
          Translate annual compensation to hourly metrics and monthly rates.
        </p>
      </div>
      <SalaryHourlyCalculator />
    </div>
  )
}
