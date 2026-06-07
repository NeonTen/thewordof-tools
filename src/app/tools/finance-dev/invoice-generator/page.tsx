import { ToolHeader } from "@/components/tools/tool-header"
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
    <div className="flex flex-col gap-6">
      <ToolHeader category="Finance & Dev" categoryHref="/tools/finance-dev" title="Invoice Generator" />
      <p className="text-muted-foreground -mt-4 text-base">
        Fill in the details below to generate a beautiful, print-ready PDF invoice.
      </p>
      <InvoiceGenerator isPro={isPro} />
    </div>
  )
}
