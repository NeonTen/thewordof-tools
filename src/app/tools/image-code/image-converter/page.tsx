import { generateSeoMetadata } from "@/app/lib/seo";
import { ToolHeader } from "@/components/tools/tool-header";
import { ImageConverter } from "@/components/tools/image-converter";
import { auth } from "@/auth";

export const metadata = generateSeoMetadata({
  title: "Image Converter",
  description: "Convert and optimize images in bulk directly in your browser.",
  canonical: "/tools/image-code/image-converter",
});

export default async function ImageConverterPage() {
  const session = await auth();
  const isPro =
    session?.user?.role === "PRO" ||
    session?.user?.role === "BUSINESS" ||
    session?.user?.role === "ADMIN";

  return (
    <div className="flex flex-col gap-8">
      <div>
        <ToolHeader
          category="Image & Code"
          categoryHref="/tools/image-code"
          title="Image Converter"
        />
        <p className="text-muted-foreground mt-2">
          Convert and optimize images in bulk directly in your browser.
        </p>
      </div>

      <ImageConverter role={session?.user?.role || "USER"} />
    </div>
  );
}
