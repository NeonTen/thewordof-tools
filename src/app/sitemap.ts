import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://thewordof.com";

  const routes = [
    "",
    "/tools",
    "/changelog",
    "/pricing",
    "/login",
    "/register",
    "/privacy",
    "/terms",
    "/refund",

    // AI Tools
    "/tools/ai-tools",
    "/tools/ai-tools/caption-generator",
    "/tools/ai-tools/cv-builder",
    "/tools/ai-tools/product-description",
    "/tools/ai-tools/prompt-generator",
    "/tools/ai-tools/seo-generator",

    // Calculators
    "/tools/calculators",
    "/tools/calculators/aspect-ratio",
    "/tools/calculators/bmi",
    "/tools/calculators/color-converter",
    "/tools/calculators/compound-interest",
    "/tools/calculators/emi",
    "/tools/calculators/gst-calculator",
    "/tools/calculators/line-height",
    "/tools/calculators/px-to-rem",
    "/tools/calculators/salary-to-hourly",
    "/tools/calculators/sip",
    "/tools/calculators/word-counter",

    // Design
    "/tools/design",
    "/tools/design/color-contrast",
    "/tools/design/color-palette",
    "/tools/design/gradient-generator",
    "/tools/design/gradient-palette",

    // Document Tools
    "/tools/document-tools",
    "/tools/document-tools/invoice-generator",
    "/tools/document-tools/report",

    // Image & Code
    "/tools/image-code",
    "/tools/image-code/code-minifier",
    "/tools/image-code/image-converter",
    "/tools/image-code/qr-code",
    "/tools/image-code/svg-compressor",
    "/tools/image-code/text-diff",

    // Technical SEO
    "/tools/technical-seo",
    "/tools/technical-seo/broken-links",
    "/tools/technical-seo/keyword-density",
    "/tools/technical-seo/llms-txt",
    "/tools/technical-seo/readability-grader",
    "/tools/technical-seo/robots-generator",
    "/tools/technical-seo/schema-generator",
    "/tools/technical-seo/serp-preview",
    "/tools/technical-seo/sitemap-validator",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : route.startsWith("/tools/") ? 0.8 : 0.6,
  }));

  return [...routes];
}
