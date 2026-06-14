import { InvoiceGenerator } from "@/components/tools/invoice-generator";
import { auth } from "@/auth";

export const metadata = {
  title: "Invoice Generator – Document Tools",
  description: "Create and export professional invoices.",
};

export default async function InvoiceGeneratorPage() {
  const session = await auth();
  const isPro = session?.user?.role === "PRO" || session?.user?.role === "BUSINESS" || session?.user?.role === "ADMIN";
  return <InvoiceGenerator isPro={isPro} />;
}
