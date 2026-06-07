import { ColorContrast } from "@/components/tools/color-contrast"

export const metadata = {
  title: "Color Contrast Checker - WCAG 2.1 Accessibility Tool",
  description: "Check text legibility and accessibility contrast ratios under WCAG 2.1 AA & AAA standards dynamically.",
}

export default function ColorContrastPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Color Contrast Checker</h1>
        <p className="text-muted-foreground mt-2">
          Validate foreground and background color pairings for web accessibility standards.
        </p>
      </div>
      <ColorContrast />
    </div>
  )
}
