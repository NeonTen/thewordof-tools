import { ImageConverter } from "@/components/tools/image-converter"
import { auth } from "@/auth"

export const metadata = {
  title: "Image Converter",
  description: "Convert and optimize images in bulk directly in your browser.",
}

export default async function ImageConverterPage() {
  const session = await auth()
  const isPro = session?.user?.role === "PRO" || session?.user?.role === "BUSINESS" || session?.user?.role === "ADMIN"

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Image Converter</h1>
        <p className="text-muted-foreground mt-2">
          Convert and optimize images in bulk directly in your browser.
        </p>
      </div>

      <ImageConverter role={session?.user?.role || "USER"} />
    </div>
  )
}
