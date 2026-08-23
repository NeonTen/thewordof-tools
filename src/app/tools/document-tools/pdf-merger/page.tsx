import { generateSeoMetadata } from "@/app/lib/seo";
import { ToolHeader } from "@/components/tools/tool-header";
import { PdfMerger } from "@/components/tools/pdf-merger";
import { auth } from "@/auth";

export const metadata = generateSeoMetadata({
  title: "PDF Merger & Splitter | Free Online Tool",
  description: "Merge multiple PDFs into one or extract specific pages securely in your browser. Free online PDF utility.",
  canonical: "/tools/document-tools/pdf-merger",
});

export default async function PdfMergerPage() {
  const session = await auth();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <ToolHeader
          category="Document Tools"
          categoryHref="/tools/document-tools"
          title="PDF Merger & Splitter"
        />
        <p className="text-muted-foreground mt-2">
          Securely combine multiple PDFs or extract specific pages entirely in your browser. 
          Free users can process up to 5 documents per month.
        </p>
      </div>
      <PdfMerger role={session?.user?.role || "USER"} />
    </div>
  );
}
