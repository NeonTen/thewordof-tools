import { GSTCalculator } from "@/components/tools/gst-calculator"
import { auth } from "@/auth"
import { generateSeoMetadata } from "@/app/lib/seo"

export const metadata = generateSeoMetadata({
  title: "GST Calculator",
  description: "Calculate Goods and Services Tax for India, Australia, Canada with inclusive/exclusive pricing.",
  keywords: ["gst calculator", "tax calculator", "gst inclusive", "gst exclusive"],
})

export default async function GSTCalculatorPage() {
  const session = await auth()
  const isPro = session?.user?.role === "PRO" || session?.user?.role === "BUSINESS" || session?.user?.role === "ADMIN"

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">GST Calculator</h1>
        <p className="text-muted-foreground mt-2">
          Calculate GST inclusive and exclusive prices instantly.
        </p>
      </div>

      <GSTCalculator isPro={isPro} />
    </div>
  )
}
