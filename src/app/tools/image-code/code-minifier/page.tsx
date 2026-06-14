import { generateSeoMetadata } from "@/app/lib/seo";
import { ToolHeader } from "@/components/tools/tool-header";
import { CodeMinifier } from "@/components/tools/code-minifier";
import { FileCode } from "lucide-react";

export const metadata = generateSeoMetadata({
  title: "JS/CSS/HTML Minifier & Beautifier",
  description:
    "Compress or format your JavaScript, CSS, and HTML code for better performance and readability.",
});

export default function CodeMinifierPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <ToolHeader
          category="Image & Code"
          categoryHref="/tools/image-code"
          title="Code Minifier & Beautifier"
        />
        <p className="text-muted-foreground mt-2">
          Optimize your web assets by reducing file sizes or beautify messy code
          into a readable format.
        </p>
      </div>

      <CodeMinifier />
    </div>
  );
}
