import { generateSeoMetadata } from "@/app/lib/seo";
import { ToolHeader } from "@/components/tools/tool-header";
import { RobotsGenerator } from "@/components/tools/robots-generator";

import { ArrowLeft } from "lucide-react";

export const metadata = generateSeoMetadata({
  title: "Robots.txt Generator & Validator - Technical SEO Tools",
  description:
    "Create, customize, and validate robots.txt files for search engine crawlers with interactive rule mapping.",
  canonical: "/tools/technical-seo/robots-generator",
});

export default function RobotsGeneratorPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <ToolHeader
          category="Technical SEO"
          categoryHref="/tools/technical-seo"
          title="Robots.txt Generator & Validator"
        />
        <p className="text-muted-foreground mt-2">
          Configure crawler directives for your site and run live validations
          against custom resource paths.
        </p>
      </div>
      <RobotsGenerator />
    </div>
  );
}
