import { generateSeoMetadata } from "@/app/lib/seo";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Palette } from "lucide-react";

export const metadata = generateSeoMetadata({
  title: "Creative Design Palette & Harmony Tools | TheWordOf Tools",
  description:
    "Free color theory validation, palette mixers, CSS gradient designers, and export format generators.",
  canonical: "/tools/design",
});

const tools = [
  {
    title: "Color Contrast Checker",
    description:
      "Check foreground and background color contrast against WCAG readability standards.",
    href: "/tools/design/color-contrast",
    icon: Palette,
    pro: false,
  },
  {
    title: "Color Contrast Scanner",
    description:
      "Scan any webpage URL to find element color combinations that fail WCAG readability contrast guidelines.",
    href: "/tools/design/color-contrast-scanner",
    icon: Palette,
    pro: true,
  },
  {
    title: "Color Palette Generator",
    description:
      "Generate mathematical color harmonies and export codes or images.",
    href: "/tools/design/color-palette",
    icon: Palette,
    pro: false,
  },
  {
    title: "Gradient Generator",
    description:
      "Browse, customize and export CSS / Tailwind code for premium gradients.",
    href: "/tools/design/gradient-generator",
    icon: Palette,
    pro: false,
  },
  {
    title: "Gradient Palette Generator",
    description:
      "Generate 5 coordinating harmonious gradients and copy CSS variables.",
    href: "/tools/design/gradient-palette",
    icon: Palette,
    pro: false,
  },
];

export default function DesignPage() {
  return (
    <div className="flex flex-col gap-8 pb-16">
      <div>
        <h1 className="text-3xl font-black tracking-tight">
          Design & Harmony Tools
        </h1>
        <p className="text-muted-foreground mt-2 text-base">
          Validate WCAG accessibility parameters, extract mathematical color
          schemes, and design gradient palettes.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
