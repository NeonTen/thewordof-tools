import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "TheWordOf Tools - AI Utility Platform",
    template: "%s | TheWordOf Tools",
  },
  description: "A comprehensive SaaS AI utility platform offering multiple tools including invoice generation, SEO metadata, and more.",
  keywords: ["AI Tools", "Invoice Generator", "SEO Generator", "Image Converter"],
  authors: [
    {
      name: "TheWordOf",
      url: "https://thewordof.com",
    },
  ],
  creator: "TheWordOf",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://thewordof.com",
    title: "TheWordOf Tools",
    description: "The ultimate AI utility platform for modern businesses.",
    siteName: "TheWordOf Tools",
  },
  twitter: {
    card: "summary_large_image",
    title: "TheWordOf Tools",
    description: "The ultimate AI utility platform for modern businesses.",
    creator: "@thewordof",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
