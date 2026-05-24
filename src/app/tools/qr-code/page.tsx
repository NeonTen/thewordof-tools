import { QRCodeGenerator } from "@/components/tools/qr-code"
import { auth } from "@/auth"
import { generateSeoMetadata } from "@/app/lib/seo"

export const metadata = generateSeoMetadata({
  title: "QR Code Generator",
  description: "Create customizable QR codes with custom size, background, and foreground colors.",
  keywords: ["qr generator", "qr code", "make qr", "free qr generator"],
})

export default async function QRCodeGeneratorPage() {
  const session = await auth()
  const isPro = session?.user?.role === "PRO" || session?.user?.role === "BUSINESS" || session?.user?.role === "ADMIN"

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">QR Code Generator</h1>
        <p className="text-muted-foreground mt-2">
          Create and download customizable QR codes with live preview.
        </p>
      </div>

      <QRCodeGenerator isPro={isPro} />
    </div>
  )
}
