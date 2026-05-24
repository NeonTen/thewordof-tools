import { ColorConverter } from "@/components/tools/color-converter"
import { auth } from "@/auth"
import { generateSeoMetadata } from "@/app/lib/seo"

export const metadata = generateSeoMetadata({
  title: "HEX / RGB / HSL Converter",
  description: "Convert color formats between HEX, RGB and HSL values with live sync.",
  keywords: ["color converter", "hex to rgb", "rgb to hsl", "hsl converter", "hex converter"],
})

export default async function ColorConverterPage() {
  const session = await auth()
  const isPro = session?.user?.role === "PRO" || session?.user?.role === "BUSINESS" || session?.user?.role === "ADMIN"

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HEX / RGB / HSL Converter</h1>
        <p className="text-muted-foreground mt-2">
          Translate color values seamlessly across HEX, RGB, and HSL.
        </p>
      </div>

      <ColorConverter isPro={isPro} />
    </div>
  )
}
