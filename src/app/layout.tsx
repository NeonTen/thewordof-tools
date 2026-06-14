import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://thewordof.com"),
  title: {
    default: "TheWordOf Tools - Ever-Expanding AI Utility Platform",
    template: "%s | TheWordOf Tools",
  },
  description:
    "An ever-expanding collection of professional AI tools in one dashboard. Generate professional invoices, create viral AI captions, optimize images, build CVs, and more - all in one dashboard.",
  keywords: [
    "AI Tools",
    "Invoice Generator",
    "SEO Generator",
    "Image Converter",
    "SVG Compressor",
    "AI Caption Generator",
    "Financial Calculator",
    "AI CV Builder",
    "SaaS Tools",
    "Productivity Toolkit",
  ],
  authors: [{ name: "TheWordOf", url: "https://thewordof.com" }],
  creator: "TheWordOf",
  publisher: "TheWordOf",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://thewordof.com",
    title: "TheWordOf Tools - Ever-Expanding AI Utility Tools",
    description:
      "The ultimate AI utility platform. Stop switching tabs and start getting things done with our all-in-one productivity toolkit.",
    siteName: "TheWordOf Tools",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TheWordOf Tools Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TheWordOf Tools - AI Utility Platform",
    description:
      "An ever-expanding collection of pro tools in one place. Generate invoices, optimize images, calculate EMIs, and more.",
    images: ["/og-image.png"],
    creator: "@thewordof",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
