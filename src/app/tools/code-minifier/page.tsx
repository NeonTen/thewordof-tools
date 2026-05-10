import { CodeMinifier } from "@/components/tools/code-minifier"
import { FileCode } from "lucide-react"

export const metadata = {
  title: "JS/CSS/HTML Minifier & Beautifier",
  description: "Compress or format your JavaScript, CSS, and HTML code for better performance and readability.",
}

export default function CodeMinifierPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FileCode className="h-8 w-8 text-primary" />
          Code Minifier & Beautifier
        </h1>
        <p className="text-muted-foreground mt-2">
          Optimize your web assets by reducing file sizes or beautify messy code into a readable format.
        </p>
      </div>

      <CodeMinifier />
    </div>
  )
}
