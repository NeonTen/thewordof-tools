import { generateSeoMetadata } from "@/app/lib/seo";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Image as ImageIcon, Zap, FileCode, Split, QrCode } from "lucide-react";

export const metadata = generateSeoMetadata({
  title: "Image & Code Optimization Tools | TheWordOf Tools",
  description:
    "Free client-side tools to convert images, compress SVGs, generate QR codes, minify files, and check text diffs.",
});

const tools = [
  {
    title: "Image Converter",
    description:
      "Convert JPG, PNG, WEBP, AVIF in bulk. Client-side, completely private.",
    href: "/tools/image-converter",
    icon: ImageIcon,
    pro: false,
  },
  {
    title: "SVG Compressor",
    description:
      "Minify, clean, and optimize SVG files for faster web loading.",
    href: "/tools/svg-compressor",
    icon: Zap,
    pro: true,
  },
  {
    title: "QR Code Generator",
    description: "Create customizable QR codes with custom colors and sizes.",
    href: "/tools/qr-code",
    icon: QrCode,
    pro: true,
  },
  {
    title: "Code Minifier",
    description: "Minify and beautify JS, CSS, HTML code in one click.",
    href: "/tools/code-minifier",
    icon: FileCode,
    pro: false,
  },
  {
    title: "Text Difference",
    description:
      "Compare two documents and highlight additions, deletions, or edits.",
    href: "/tools/text-diff",
    icon: Split,
    pro: false,
  },
];

export default function ImageCodePage() {
  return (
    <div className="flex flex-col gap-8 pb-16">
      <div>
        <h1 className="text-3xl font-black tracking-tight">
          Image & Code Tools
        </h1>
        <p className="text-muted-foreground mt-2 text-base">
          Optimize media assets, clean up developer files, and improve asset
          loading speeds.
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
