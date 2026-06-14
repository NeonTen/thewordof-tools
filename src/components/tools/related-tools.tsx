"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const CATEGORIES: Record<string, { name: string; tools: Array<{ name: string; href: string; desc: string }> }> = {
  "technical-seo": {
    name: "Technical SEO Tools",
    tools: [
      { name: "Broken Link Checker", href: "/tools/technical-seo/broken-links", desc: "Scan webpages to find and fix broken links." },
      { name: "Keyword Density Analyzer", href: "/tools/technical-seo/keyword-density", desc: "Analyze the density and distribution of your keywords." },
      { name: "LLMs.txt Generator", href: "/tools/technical-seo/llms-txt", desc: "Generate llms.txt and llms-full.txt files for AI agents." },
      { name: "Readability Grader", href: "/tools/technical-seo/readability-grader", desc: "Grade readability using Flesch, Gunning, Dale-Chall, ARI, and SMOG." },
      { name: "Robots.txt Generator", href: "/tools/technical-seo/robots-generator", desc: "Generate SEO-optimized robots.txt rules for crawlers." },
      { name: "Schema Markup Generator", href: "/tools/technical-seo/schema-generator", desc: "Build JSON-LD schema markup for structured search snippets." },
      { name: "SERP Preview Tool", href: "/tools/technical-seo/serp-preview", desc: "Preview how your site appears on Google search results." },
      { name: "Sitemap Validator", href: "/tools/technical-seo/sitemap-validator", desc: "Analyze and validate sitemaps for syntax and accessibility errors." }
    ]
  },
  "ai-tools": {
    name: "AI & Content Tools",
    tools: [
      { name: "Caption Generator", href: "/tools/ai-tools/caption-generator", desc: "Generate catchy social media captions with AI." },
      { name: "CV Builder", href: "/tools/ai-tools/cv-builder", desc: "Build professional resumes and generate cover letters." },
      { name: "Product Description", href: "/tools/ai-tools/product-description", desc: "Create conversion-focused e-commerce product descriptions." },
      { name: "Prompt Generator", href: "/tools/ai-tools/prompt-generator", desc: "Generate optimized prompts for ChatGPT, Gemini, and Claude." },
      { name: "SEO Generator", href: "/tools/ai-tools/seo-generator", desc: "AI-generated meta titles and descriptions." }
    ]
  },
  "calculators": {
    name: "Utility Calculators",
    tools: [
      { name: "Aspect Ratio Calculator", href: "/tools/calculators/aspect-ratio", desc: "Calculate image or screen dimensions and ratios." },
      { name: "BMI Calculator", href: "/tools/calculators/bmi", desc: "Compute Body Mass Index and health status indicator." },
      { name: "Color Converter", href: "/tools/calculators/color-converter", desc: "Convert colors between HEX, RGB, HSL, and CMYK formats." },
      { name: "Compound Interest", href: "/tools/calculators/compound-interest", desc: "Forecast investment returns over time with compound interest." },
      { name: "EMI Calculator", href: "/tools/calculators/emi", desc: "Calculate monthly installments for personal or home loans." },
      { name: "GST Calculator", href: "/tools/calculators/gst-calculator", desc: "Calculate inclusive and exclusive goods and services tax." },
      { name: "Line Height Calculator", href: "/tools/calculators/line-height", desc: "Perfect vertical rhythm line-height helper." },
      { name: "Px to Rem Converter", href: "/tools/calculators/px-to-rem", desc: "Convert pixel layout values to responsive rem units." },
      { name: "Salary to Hourly", href: "/tools/calculators/salary-to-hourly", desc: "Convert annual salary to hourly, weekly, or monthly equivalent." },
      { name: "SIP Calculator", href: "/tools/calculators/sip", desc: "Calculate returns on systematic investment plans." },
      { name: "Word Counter", href: "/tools/calculators/word-counter", desc: "Count words, characters, sentences, paragraphs, and reading time." }
    ]
  },
  "design": {
    name: "Design & Color Tools",
    tools: [
      { name: "Color Contrast Checker", href: "/tools/design/color-contrast", desc: "Check WCAG accessibility contrast ratios." },
      { name: "Contrast Scanner", href: "/tools/design/color-contrast-scanner", desc: "Scan page URLs for design color contrast errors." },
      { name: "Color Palette Generator", href: "/tools/design/color-palette", desc: "Generate harmonious modern color palettes." },
      { name: "Gradient Generator", href: "/tools/design/gradient-generator", desc: "Generate smooth CSS gradients." },
      { name: "Gradient Palette", href: "/tools/design/gradient-palette", desc: "Curated collections of premium UI gradients." }
    ]
  },
  "image-code": {
    name: "Image & Code Utilities",
    tools: [
      { name: "Code Minifier", href: "/tools/image-code/code-minifier", desc: "Minify HTML, CSS, and Javascript code." },
      { name: "Image Converter", href: "/tools/image-code/image-converter", desc: "Convert images between WEBP, PNG, JPG, and AVIF formats." },
      { name: "QR Code Generator", href: "/tools/image-code/qr-code", desc: "Create customization-friendly dynamic QR codes." },
      { name: "SVG Compressor", href: "/tools/image-code/svg-compressor", desc: "Optimize vector SVGs by stripping metadata." },
      { name: "Text Diff Tool", href: "/tools/image-code/text-diff", desc: "Compare two pieces of text side-by-side to highlight additions and removals." }
    ]
  },
  "document-tools": {
    name: "Document Tools",
    tools: [
      { name: "Invoice Generator", href: "/tools/document-tools/invoice-generator", desc: "Create, customize, and export professional invoice receipts." },
      { name: "Work Report Generator", href: "/tools/document-tools/report", desc: "Generate professional work reports and daily trackers." }
    ]
  }
}

export function RelatedTools() {
  const pathname = usePathname()
  if (!pathname) return null

  // Filter out empty segments to get a clean list of path segments
  const segments = pathname.split("/").filter(Boolean)
  
  // If it's the root tools page or a category landing page (e.g. /tools or /tools/[category])
  // we do not show the related tools section to avoid duplicate grids.
  if (segments.length <= 2) return null

  const categoryKey = segments[1]
  const currentCategory = CATEGORIES[categoryKey]

  if (!currentCategory) return null

  // Filter out the current active tool
  const related = currentCategory.tools.filter(t => t.href !== pathname)

  if (related.length === 0) return null

  return (
    <div className="border-t border-border pt-12 mt-16 space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-black tracking-tight font-outfit text-foreground">Related Tools</h3>
        <p className="text-xs text-muted-foreground font-semibold">More helpful utilities under the {currentCategory.name} category.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((tool, idx) => (
          <Link 
            key={idx}
            href={tool.href}
            className="group block p-5 bg-card hover:bg-primary/[0.02] border border-border hover:border-primary/20 rounded-2xl transition-all duration-200 shadow-sm relative overflow-hidden"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start gap-2">
                <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors duration-200">{tool.name}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200" />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{tool.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
