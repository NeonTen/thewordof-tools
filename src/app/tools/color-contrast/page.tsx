import { ColorContrast } from "@/components/tools/color-contrast"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Color Contrast Checker - WCAG 2.1 Accessibility Tool",
  description: "Check text legibility and accessibility contrast ratios under WCAG 2.1 AA & AAA standards dynamically.",
}

export default function ColorContrastPage() {
  return (
    <div className="flex flex-col gap-6">
      <Link 
        href="/tools" 
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Tools
      </Link>
      <div>
        <h1 className="text-3xl font-black tracking-tight">Color Contrast Checker</h1>
        <p className="text-muted-foreground mt-2">
          Validate foreground and background color pairings for web accessibility standards.
        </p>
      </div>
      <ColorContrast />
    </div>
  )
}
