import { generateSeoMetadata } from "@/app/lib/seo";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Files } from "lucide-react";

export const metadata = generateSeoMetadata({
  title: "Document Tools | TheWordOf Tools",
  description:
    "Free online document utilities, PDF converters, professional invoice generators, and work report templates.",
});

const tools = [
  {
    title: "Doc Converter",
    description: "Convert document formats like PDF, DOCX, and TXT seamlessly.",
    href: "/tools/document-tools/doc-converter",
    icon: Files,
    pro: false,
  },
  {
    title: "Invoice Generator",
    description: "Create and export professional PDF invoices in seconds.",
    href: "/tools/document-tools/invoice-generator",
    icon: FileText,
    pro: true,
  },
  {
    title: "PDF Merger",
    description: "Merge multiple PDFs into one or extract specific pages securely.",
    href: "/tools/document-tools/pdf-merger",
    icon: Files,
    pro: true,
  },
  {
    title: "PDF Watermarker",
    description: "Apply custom text or image watermarks to all pages of a PDF.",
    href: "/tools/document-tools/pdf-watermark",
    icon: Files,
    pro: true,
  },
  {
    title: "Work Report Generator",
    description:
      "Compile daily task trackers and print matching standard A4 PDFs.",
    href: "/tools/document-tools/report",
    icon: FileText,
    pro: false,
  },
];

export default function DocumentToolsPage() {
  return (
    <div className="flex flex-col gap-8 pb-16">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Document Tools</h1>
        <p className="text-muted-foreground mt-2 text-base">
          Professional PDF generation, document conversion, and invoicing
          utilities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.href}
              href={tool.href}
              className="group block h-full"
            >
              <Card className="h-full border border-border/50 bg-card hover:bg-muted/30 transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                  <div className="p-2.5 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    {tool.pro && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
                        PRO
                      </span>
                    )}
                    <CardTitle className="text-lg font-black group-hover:text-primary transition-colors duration-200 mt-1">
                      {tool.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                    {tool.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
