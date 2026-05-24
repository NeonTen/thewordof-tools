import { Metadata } from "next"

interface SeoMetadataInput {
  title: string
  description: string
  keywords?: string[]
}

export function generateSeoMetadata({
  title,
  description,
  keywords = [],
}: SeoMetadataInput): Metadata {
  const baseKeywords = ["online tools", "free utility", "productivity tools", "developer tools"]
  
  return {
    title: `${title} | TheWordOf Tools`,
    description,
    keywords: [...baseKeywords, ...keywords],
    openGraph: {
      title: `${title} | TheWordOf Tools`,
      description,
      type: "website",
      siteName: "TheWordOf Tools",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | TheWordOf Tools`,
      description,
    },
  }
}
