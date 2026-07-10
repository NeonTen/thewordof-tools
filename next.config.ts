import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["geoip-lite"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.google-analytics.com https://*.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' https:; frame-src 'self' https:; worker-src 'self' blob:;",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/tools/image-converter", destination: "/tools/image-code/image-converter", permanent: true },
      { source: "/tools/svg-compressor", destination: "/tools/image-code/svg-compressor", permanent: true },
      { source: "/tools/qr-code", destination: "/tools/image-code/qr-code", permanent: true },
      { source: "/tools/code-minifier", destination: "/tools/image-code/code-minifier", permanent: true },
      { source: "/tools/text-diff", destination: "/tools/image-code/text-diff", permanent: true },
      { source: "/tools/invoice-generator", destination: "/tools/document-tools/invoice-generator", permanent: true },
      { source: "/tools/report", destination: "/tools/document-tools/report", permanent: true },
      { source: "/tools/finance-dev/invoice-generator", destination: "/tools/document-tools/invoice-generator", permanent: true },
      { source: "/tools/finance-dev/report", destination: "/tools/document-tools/report", permanent: true },
      { source: "/tools/finance-dev", destination: "/tools/document-tools", permanent: true },
      { source: "/tools/schema-generator", destination: "/tools/technical-seo/schema-generator", permanent: true },
      { source: "/tools/robots-generator", destination: "/tools/technical-seo/robots-generator", permanent: true },
      { source: "/tools/sitemap-validator", destination: "/tools/technical-seo/sitemap-validator", permanent: true },
      { source: "/tools/llms-txt", destination: "/tools/technical-seo/llms-txt", permanent: true },
      { source: "/tools/product-description", destination: "/tools/ai-tools/product-description", permanent: true },
      { source: "/tools/caption-generator", destination: "/tools/ai-tools/caption-generator", permanent: true },
      { source: "/tools/prompt-generator", destination: "/tools/ai-tools/prompt-generator", permanent: true },
      { source: "/tools/cv-builder", destination: "/tools/ai-tools/cv-builder", permanent: true },
      { source: "/tools/seo-generator", destination: "/tools/ai-tools/seo-generator", permanent: true },
      { source: "/tools/color-contrast", destination: "/tools/design/color-contrast", permanent: true },
      { source: "/tools/color-contrast-scanner", destination: "/tools/design/color-contrast-scanner", permanent: true },
      { source: "/tools/color-palette", destination: "/tools/design/color-palette", permanent: true },
      { source: "/tools/gradient-generator", destination: "/tools/design/gradient-generator", permanent: true },
      { source: "/tools/gradient-palette", destination: "/tools/design/gradient-palette", permanent: true },
      { source: "/tools/gst-calculator", destination: "/tools/calculators/gst-calculator", permanent: true },
      { source: "/tools/word-counter", destination: "/tools/calculators/word-counter", permanent: true },
      { source: "/tools/color-converter", destination: "/tools/calculators/color-converter", permanent: true },
    ];
  },
};

export default nextConfig;
