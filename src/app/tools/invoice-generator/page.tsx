import { InvoiceGenerator } from "@/components/tools/invoice-generator"
import { auth } from "@/auth"

export const metadata = {
  title: "Invoice Generator",
  description: "Create and export professional invoices.",
}

export default async function InvoicesPage() {
  const session = await auth()
  const isPro = session?.user?.role === "PRO" || session?.user?.role === "BUSINESS" || session?.user?.role === "ADMIN"

  return (
    <div className="flex flex-col gap-8">
      <div className="print:hidden">
        <h1 className="text-3xl font-bold tracking-tight">Invoice Generator</h1>
        <p className="text-muted-foreground mt-2">
          Fill in the details below to generate a beautiful, print-ready PDF invoice.
        </p>
      </div>

      <InvoiceGenerator isPro={isPro} />
    </div>
  )
}
