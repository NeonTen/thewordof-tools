import { DocConverter } from "@/components/tools/doc-converter"

export const metadata = {
  title: "Document Converter - PDF, DOCX & Text Conversion",
  description: "Convert Word documents, PDFs, and text files client-side instantly.",
}

export default function DocConverterPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight">Document Converter</h1>
        <p className="text-muted-foreground">
          Convert Word files, text documents, and PDFs entirely in the browser.
        </p>
      </div>
      <DocConverter />
    </div>
  )
}
