import { generateSeoMetadata } from "@/app/lib/seo";
import { ToolHeader } from "@/components/tools/tool-header";
import { DocConverter } from "@/components/tools/doc-converter";
import { auth } from "@/auth";

export const metadata = generateSeoMetadata({
  title: "Document Converter - PDF, DOCX & Text Conversion",
  description:
    "Convert Word documents, PDFs, and text files client-side instantly.",
});

export default async function DocConverterPage() {
  const session = await auth();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <ToolHeader
          category="Document Tools"
          categoryHref="/tools/document-tools"
          title="Document Converter"
        />
        <p className="text-muted-foreground mt-2">
          Convert Word files, text documents, and PDFs entirely in the browser.
        </p>
      </div>
      <DocConverter role={session?.user?.role || "USER"} />
    </div>
  );
}
