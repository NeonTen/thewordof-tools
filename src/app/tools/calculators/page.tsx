import { EmiCalculator } from "@/components/tools/emi-calculator"
import { SipCalculator } from "@/components/tools/sip-calculator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata = {
  title: "Financial Calculators",
  description: "EMI, SIP, and Mutual Fund calculators.",
}

export default function CalculatorsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financial Calculators</h1>
        <p className="text-muted-foreground mt-2">
          Plan your investments and loans with our interactive financial tools.
        </p>
      </div>

      <Tabs defaultValue="emi" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="emi">EMI Calculator</TabsTrigger>
          <TabsTrigger value="sip">SIP / Mutual Fund Return</TabsTrigger>
        </TabsList>
        <TabsContent value="emi">
          <EmiCalculator />
        </TabsContent>
        <TabsContent value="sip">
          <SipCalculator />
        </TabsContent>
      </Tabs>
    </div>
  )
}
