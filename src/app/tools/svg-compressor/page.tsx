import { SVGCompressor } from "@/components/tools/svg-compressor"
import { auth } from "@/auth"

export const metadata = {
  title: "SVG Compressor",
  description: "Compress and optimize SVG files for faster web performance.",
}

export default async function SVGCompressorPage() {
  const session = await auth()
  const isPro = session?.user?.role === "PRO" || session?.user?.role === "BUSINESS" || session?.user?.role === "ADMIN"

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">SVG Compressor</h1>
        <p className="text-muted-foreground mt-2">
          Compress and optimize SVG files for faster web performance.
        </p>
      </div>

      <SVGCompressor role={session?.user?.role || "USER"} />
    </div>
  )
}
