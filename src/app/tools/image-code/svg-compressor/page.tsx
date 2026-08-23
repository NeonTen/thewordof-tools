import { generateSeoMetadata } from "@/app/lib/seo";
import { ToolHeader } from "@/components/tools/tool-header";
import { SVGCompressor } from "@/components/tools/svg-compressor";
import { auth } from "@/auth";

export const metadata = generateSeoMetadata({
  title: "SVG Compressor",
  description: "Compress and optimize SVG files for faster web performance.",
  canonical: "/tools/image-code/svg-compressor",
});

export default async function SVGCompressorPage() {
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
          title="SVG Compressor"
        />
        <p className="text-muted-foreground mt-2">
          Compress and optimize SVG files for faster web performance.
        </p>
      </div>

      <SVGCompressor role={session?.user?.role || "USER"} />
    </div>
  );
}
