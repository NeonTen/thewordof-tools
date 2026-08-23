import { Metadata } from "next";

interface SeoMetadataInput {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
}

export function generateSeoMetadata({
  title,
  description,
  keywords = [],
  canonical,
}: SeoMetadataInput): Metadata {
  const baseKeywords = [
    "online tools",
    "free utility",
    "productivity tools",
    "developer tools",
  ];

  return {
    title: title,
    description,
    keywords: [...baseKeywords, ...keywords],
    openGraph: {
      title: `${title} | TheWordOf Tools`,
      description,
      type: "website",
      siteName: "TheWordOf Tools",
      ...(canonical ? { url: canonical } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | TheWordOf Tools`,
      description,
    },
    ...(canonical
      ? {
          alternates: {
            canonical,
          },
        }
      : {}),
  };
}
