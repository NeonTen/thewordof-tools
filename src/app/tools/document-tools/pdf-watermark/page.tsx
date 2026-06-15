import { generateSeoMetadata } from "@/app/lib/seo";
import { ToolHeader } from "@/components/tools/tool-header";
import { PdfWatermarker } from "@/components/tools/pdf-watermarker";
import { auth } from "@/auth";

export const metadata = generateSeoMetadata({
  title: "PDF Watermarker | Add Text & Image Watermarks Free",
  description: "Securely add custom text or image logo watermarks to multiple pages of a PDF entirely in your browser.",
});

export default async function PdfWatermarkPage() {
  const session = await auth();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <ToolHeader
          category="Document Tools"
          categoryHref="/tools/document-tools"
          title="PDF Watermarker"
        />
        <p className="text-muted-foreground mt-2">
          Apply a text or image watermark to all pages of a PDF securely in your browser.
          Free users can process up to 5 documents per month.
        </p>
      </div>
      <PdfWatermarker role={session?.user?.role || "USER"} />
    </div>
  );
}
