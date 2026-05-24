import { ProductDescription } from "@/components/tools/product-description"
import { auth } from "@/auth"
import { generateSeoMetadata } from "@/app/lib/seo"

export const metadata = generateSeoMetadata({
  title: "Product Description Generator",
  description: "AI-powered tool to generate optimized titles, feature lists, and descriptions for e-commerce products.",
  keywords: ["product description", "ai writer", "copywriting", "e-commerce"],
})

export default async function ProductDescriptionPage() {
  const session = await auth()
  const isPro = session?.user?.role === "PRO" || session?.user?.role === "BUSINESS" || session?.user?.role === "ADMIN"

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Product Description Generator</h1>
        <p className="text-muted-foreground mt-2">
          Generate SEO-optimized product copy, bullet points, and marketing titles.
        </p>
      </div>

      <ProductDescription isPro={isPro} />
    </div>
  )
}
